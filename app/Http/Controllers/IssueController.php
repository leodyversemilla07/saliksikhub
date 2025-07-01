<?php

namespace App\Http\Controllers;

use App\ManuscriptStatus;
use App\Models\Issue;
use App\Models\Manuscript;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IssueController extends Controller
{
    /**
     * Display a listing of journal issues.
     */
    public function index(Request $request)
    {
        $query = Issue::with(['user'])
            ->withCount('manuscripts')
            ->orderedByVolumeIssue();

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('volume')) {
            $query->where('volume_number', $request->volume);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('issue_title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('theme', 'like', "%{$search}%")
                    ->orWhere('doi', 'like', "%{$search}%");
            });
        }

        $issues = $query->paginate(15);

        // Generate temporary URLs for cover images
        $issues->transform(function ($issue) {
            if ($issue->cover_image) {
                try {
                    $issue->cover_image_url = Storage::disk('spaces')->temporaryUrl(
                        $issue->cover_image,
                        now()->addMinutes(5)
                    );
                } catch (Exception $e) {
                    Log::error('Error generating cover image temporary URL', [
                        'error' => $e->getMessage(),
                        'issue_id' => $issue->id,
                        'cover_image_path' => $issue->cover_image,
                    ]);
                    $issue->cover_image_url = null;
                }
            } else {
                $issue->cover_image_url = null;
            }

            return $issue;
        });

        return Inertia::render('issues/index', [
            'issues' => $issues,
            'filters' => [
                'status' => $request->status,
                'volume' => $request->volume,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new journal issue.
     */
    public function create()
    {
        return Inertia::render('issues/create');
    }

    /**
     * Store a newly created journal issue.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'volume_number' => 'required|integer|min:1',
            'issue_number' => 'required|integer|min:1',
            'issue_title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'publication_date' => 'nullable|date',
            'status' => 'required|in:draft,in_review,published,archived',
            'theme' => 'nullable|string|max:255',
            'editorial_note' => 'nullable|string',
            'doi' => 'nullable|string|max:255|unique:issues,doi',
            'cover_image' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120', // 5MB max
        ]);

        try {
            DB::beginTransaction();

            // Check for duplicate volume/issue combination
            $existingIssue = Issue::where('volume_number', $validated['volume_number'])
                ->where('issue_number', $validated['issue_number'])
                ->first();

            if ($existingIssue) {
                return redirect()->back()
                    ->withErrors(['volume_number' => 'An issue with this volume and issue number already exists.'])
                    ->withInput();
            }

            $issue = Issue::create([
                'volume_number' => $validated['volume_number'],
                'issue_number' => $validated['issue_number'],
                'issue_title' => $validated['issue_title'],
                'description' => $validated['description'],
                'publication_date' => $validated['publication_date'],
                'status' => $validated['status'],
                'theme' => $validated['theme'],
                'editorial_note' => $validated['editorial_note'],
                'doi' => $validated['doi'],
                'user_id' => Auth::id(),
            ]);

            // Handle cover image upload
            if ($request->hasFile('cover_image')) {
                $coverImagePath = $this->uploadCoverImage($request->file('cover_image'), $issue);
                $issue->cover_image = $coverImagePath;
                $issue->save();
            }

            DB::commit();

            return redirect()->route('issues.show', $issue)
                ->with('success', 'Journal issue created successfully!');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error creating journal issue', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->withErrors(['error' => 'Failed to create journal issue. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Display the specified journal issue.
     */
    public function show(Issue $issue)
    {
        $issue->load(['user', 'manuscripts.user']);

        // Generate temporary URL for cover image if it exists
        $coverImageUrl = null;
        if ($issue->cover_image) {
            try {
                $coverImageUrl = Storage::disk('spaces')->temporaryUrl(
                    $issue->cover_image,
                    now()->addMinutes(5)
                );
            } catch (Exception $e) {
                Log::error('Error generating cover image temporary URL', [
                    'error' => $e->getMessage(),
                    'issue_id' => $issue->id,
                    'cover_image_path' => $issue->cover_image,
                ]);
            }
        }

        return Inertia::render('issues/show', [
            'issue' => $issue,
            'manuscripts' => $issue->manuscripts,
            'coverImageUrl' => $coverImageUrl,
        ]);
    }

    /**
     * Show the form for editing the specified journal issue.
     */
    public function edit(Issue $issue)
    {
        return Inertia::render('issues/edit', [
            'issue' => $issue,
        ]);
    }

    /**
     * Update the specified journal issue.
     */
    public function update(Request $request, Issue $issue)
    {
        $validated = $request->validate([
            'volume_number' => 'required|integer|min:1',
            'issue_number' => 'required|integer|min:1',
            'issue_title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'publication_date' => 'nullable|date',
            'status' => 'required|in:draft,in_review,published,archived',
            'theme' => 'nullable|string|max:255',
            'editorial_note' => 'nullable|string',
            'doi' => 'nullable|string|max:255|unique:issues,doi,'.$issue->id,
            'cover_image' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120', // 5MB max
        ]);

        try {
            DB::beginTransaction();

            // Check for duplicate volume/issue combination (excluding current issue)
            $existingIssue = Issue::where('volume_number', $validated['volume_number'])
                ->where('issue_number', $validated['issue_number'])
                ->where('id', '!=', $issue->id)
                ->first();

            if ($existingIssue) {
                return redirect()->back()
                    ->withErrors(['volume_number' => 'An issue with this volume and issue number already exists.'])
                    ->withInput();
            }

            // Handle cover image upload
            if ($request->hasFile('cover_image')) {
                // Delete old cover image if it exists
                if ($issue->cover_image) {
                    try {
                        Storage::disk('spaces')->delete($issue->cover_image);
                    } catch (Exception $e) {
                        Log::warning('Failed to delete old cover image', [
                            'issue_id' => $issue->id,
                            'old_path' => $issue->cover_image,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }

                // Upload new cover image
                $coverImagePath = $this->uploadCoverImage($request->file('cover_image'), $issue);
                $validated['cover_image'] = $coverImagePath;
            } else {
                // Remove cover_image from validated data if no file uploaded to prevent overwriting existing image
                unset($validated['cover_image']);
            }

            $issue->update($validated);

            DB::commit();

            return redirect()->route('issues.show', $issue)
                ->with('success', 'Journal issue updated successfully!');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error updating journal issue', [
                'error' => $e->getMessage(),
                'issue_id' => $issue->id,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->withErrors(['error' => 'Failed to update journal issue. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Upload cover image to DigitalOcean Spaces.
     */
    private function uploadCoverImage($file, Issue $issue)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = "cover_vol{$issue->volume_number}_issue{$issue->issue_number}_{$issue->id}.{$extension}";
        $storagePath = "issue-covers/{$issue->id}/{$filename}";

        // Upload to DigitalOcean Spaces
        Storage::disk('spaces')->put($storagePath, file_get_contents($file), [
            'visibility' => 'private',
            'ContentType' => $file->getMimeType(),
        ]);

        return $storagePath;
    }

    /**
     * Remove the specified journal issue.
     */
    public function destroy(Issue $issue)
    {
        try {
            // Check if issue has manuscripts
            if ($issue->manuscripts()->count() > 0) {
                return redirect()->back()
                    ->with('error', 'Cannot delete journal issue that contains manuscripts.');
            }

            // Delete cover image if it exists
            if ($issue->cover_image) {
                try {
                    Storage::disk('spaces')->delete($issue->cover_image);
                } catch (Exception $e) {
                    Log::warning('Failed to delete cover image during issue deletion', [
                        'issue_id' => $issue->id,
                        'cover_image_path' => $issue->cover_image,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            $issue->delete();

            return redirect()->route('issues.index')
                ->with('success', 'Journal issue deleted successfully!');
        } catch (Exception $e) {
            Log::error('Error deleting journal issue', [
                'error' => $e->getMessage(),
                'issue_id' => $issue->id,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to delete journal issue. Please try again.');
        }
    }

    /**
     * Assign manuscripts to an issue.
     */
    public function assignManuscripts(Request $request, Issue $issue)
    {
        $validated = $request->validate([
            'data.manuscript_ids' => 'required|array',
            'data.manuscript_ids.*' => 'exists:manuscripts,id',
        ]);

        try {
            DB::beginTransaction();

            // Get the manuscripts being assigned
            $manuscripts = Manuscript::whereIn('id', $validated['data']['manuscript_ids'])->get();

            // Verify all manuscripts are valid for assignment
            foreach ($manuscripts as $manuscript) {
                if (! in_array($manuscript->status, ['Ready to Publish', 'Accepted', 'Published'])) {
                    return redirect()->back()
                        ->with('error', "Manuscript '{$manuscript->title}' is not in a valid status for assignment.");
                }

                if ($manuscript->issue_id && $manuscript->issue_id != $issue->id) {
                    return redirect()->back()
                        ->with('error', "Manuscript '{$manuscript->title}' is already assigned to another issue.");
                }
            }

            // Update manuscripts to belong to this issue
            foreach ($manuscripts as $manuscript) {
                $manuscript->update([
                    'issue_id' => $issue->id,
                    'volume' => (string) $issue->volume_number,
                    'issue' => (string) $issue->issue_number,
                ]);

                // Notify author about assignment to journal issue
                if ($manuscript->user) {
                    $manuscript->user->notify(new \App\Notifications\IssueAssigned($issue, $manuscript));
                }
            }

            DB::commit();

            return redirect()->route('issues.show', $issue)
                ->with('success', 'Manuscripts assigned to issue successfully!');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error assigning manuscripts to issue', [
                'error' => $e->getMessage(),
                'issue_id' => $issue->id,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to assign manuscripts. Please try again.');
        }
    }

    /**
     * Show manuscripts assignment form for an issue.
     */
    public function showAssignManuscriptsForm(Issue $issue)
    {
        // Get manuscripts that are ready for publication and not assigned to any issue
        // Using case-insensitive comparison for status values to handle potential inconsistencies
        $availableManuscripts = Manuscript::with(['user'])
            ->where(function ($query) {
                $query->whereNull('issue_id')
                    ->orWhere('issue_id', 0); // Handle any zero values that might exist
            })
            ->where(function ($query) {
                $query->whereIn('status', ['Ready to Publish', 'Accepted', 'Published'])
                    ->orWhereRaw('LOWER(status) = ?', ['ready to publish'])
                    ->orWhereRaw('LOWER(status) = ?', ['accepted'])
                    ->orWhereRaw('LOWER(status) = ?', ['published']);
            })
            ->get();

        return Inertia::render('issues/assign-manuscripts', [
            'issue' => $issue,
            'availableManuscripts' => $availableManuscripts,
        ]);
    }

    /**
     * Get dashboard statistics for journal issues.
     */
    public function getDashboardStats()
    {
        $stats = [
            'total_issues' => Issue::count(),
            'published_issues' => Issue::published()->count(),
            'draft_issues' => Issue::where('status', 'draft')->count(),
            'in_review_issues' => Issue::where('status', 'in_review')->count(),
            'current_year_issues' => Issue::currentYear()->count(),
            'recent_issues' => Issue::with(['user'])
                ->latest()
                ->limit(5)
                ->get(),
        ];

        return $stats;
    }

    /**
     * Bulk update journal issues.
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'issue_ids' => 'required|array',
            'issue_ids.*' => 'exists:issues,id',
            'action' => 'required|in:status_change,archive,publish',
            'status' => 'nullable|in:draft,in_review,published,archived',
        ]);

        try {
            DB::beginTransaction();

            $issues = Issue::whereIn('id', $validated['issue_ids'])->get();

            foreach ($issues as $issue) {
                switch ($validated['action']) {
                    case 'status_change':
                        if ($validated['status']) {
                            $issue->status = $validated['status'];
                            $issue->save();
                        }
                        break;

                    case 'archive':
                        $issue->status = 'archived';
                        $issue->save();
                        break;

                    case 'publish':
                        $issue->status = 'published';
                        if (! $issue->publication_date) {
                            $issue->publication_date = now();
                        }
                        $issue->save();
                        break;
                }
            }

            DB::commit();

            return redirect()->back()
                ->with('success', 'Journal issues updated successfully!');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error in bulk update for journal issues', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to update journal issues. Please try again.');
        }
    }

    /**
     * Unassign a manuscript from an issue.
     */
    public function unassignManuscript(Request $request, Issue $issue, Manuscript $manuscript)
    {
        try {
            if ($manuscript->issue_id != $issue->id) {
                return redirect()->back()
                    ->with('error', 'This manuscript is not assigned to the specified issue.');
            }

            DB::beginTransaction();

            $manuscript->update([
                'issue_id' => null,
                'volume' => null,
                'issue' => null,
            ]);

            DB::commit();

            return redirect()->route('issues.show', $issue)
                ->with('success', "Manuscript '{$manuscript->title}' unassigned from issue successfully.");
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error unassigning manuscript from issue', [
                'error' => $e->getMessage(),
                'issue_id' => $issue->id,
                'manuscript_id' => $manuscript->id,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to unassign manuscript. Please try again.');
        }
    }

    /**
     * Display the current issue.
     */
    public function current()
    {
        // Get the latest published issue
        $currentIssue = Issue::where('status', Issue::STATUS_PUBLISHED)
            ->latest('publication_date')
            ->first();

        if (! $currentIssue) {
            // No published issue found, render with empty data
            return Inertia::render('current', [
                'currentIssue' => null,
            ]);
        }

        // Get published manuscripts for this issue
        $articles = Manuscript::where('status', ManuscriptStatus::PUBLISHED)
            ->where('issue_id', $currentIssue->id)
            ->with('user')
            ->get()
            ->map(function ($manuscript) {
                // Handle authors - could be JSON array or comma-separated string
                $authors = $manuscript->authors;
                if (is_string($authors)) {
                    // If it's a JSON string, decode it
                    $decodedAuthors = json_decode($authors, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decodedAuthors)) {
                        $authors = implode(', ', $decodedAuthors);
                    }
                } elseif (is_array($authors)) {
                    $authors = implode(', ', $authors);
                }

                // Handle keywords
                $keywords = $manuscript->keywords;
                if (is_string($keywords)) {
                    $keywords = explode(', ', $keywords);
                } elseif (! is_array($keywords)) {
                    $keywords = [];
                }

                return [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => $authors ?: 'Unknown Author',
                    'abstract' => $manuscript->abstract ?: '',
                    'keywords' => $keywords,
                    'url' => route('manuscripts.public.show', $manuscript->id),
                    'pdfUrl' => $manuscript->final_pdf_path ? route('manuscripts.pdf', $manuscript->id) : '',
                    'doi' => $manuscript->doi ?: '',
                    'pages' => $manuscript->page_range ?: '',
                    'citations' => 0, // TODO: Implement citation tracking
                    'downloads' => 0, // TODO: Implement download tracking
                    'category' => 'Research Article', // TODO: Add categories to manuscripts
                    'institution' => $manuscript->user->affiliation ?? 'Mindoro State University',
                ];
            });

        // Generate cover image URL
        $coverImageUrl = $currentIssue->cover_image ? Storage::disk('spaces')->temporaryUrl(
            $currentIssue->cover_image,
            now()->addMinutes(5)
        ) : 'images/journal-cover.webp';

        // Format data for the frontend
        $issueData = [
            'volume' => $currentIssue->volume_number,
            'number' => $currentIssue->issue_number,
            'year' => $currentIssue->publication_date->year,
            'fullTitle' => "Vol. {$currentIssue->volume_number} No. {$currentIssue->issue_number} (".$currentIssue->publication_date->year.'): DDMRJ - Current Issue',
            'specialIssueTitle' => $currentIssue->issue_title,
            'publicationDate' => $currentIssue->publication_date->toDateString(),
            'coverImageUrl' => $coverImageUrl,
            'articles' => $articles,
        ];

        return Inertia::render('current', [
            'currentIssue' => $issueData,
        ]);
    }
}
