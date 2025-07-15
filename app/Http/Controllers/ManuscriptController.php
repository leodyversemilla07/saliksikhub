<?php

namespace App\Http\Controllers;

use App\ManuscriptStatus;
use App\Models\Manuscript;
use App\Models\User;
use App\Notifications\ManuscriptApproved;
use App\Notifications\ManuscriptRevisionSubmitted;
use App\Notifications\ManuscriptStatusChanged;
use App\Notifications\ManuscriptSubmitted;
use App\Services\StorageService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ManuscriptController extends Controller
{
    /**
     * Display a listing of the user's manuscripts.
     */
    public function index()
    {
        $userId = Auth::id();

        $manuscripts = Manuscript::where('user_id', $userId)
            ->latest()
            ->get();

        return Inertia::render('manuscripts/index/page', compact('manuscripts'));
    }

    /**
     * Show the form for submitting a new manuscript.
     */
    public function create()
    {
        return Inertia::render('manuscripts/manuscript-submission');
    }

    /**
     * Store a newly submitted manuscript in storage.
     */
    public function store(Request $request, StorageService $storageService)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:10',
            'authors' => 'required|string|min:3',
            'abstract' => 'required|string|min:100',
            'keywords' => 'required|string|min:3',
            'manuscript' => 'required|mimes:docx|max:10240',
        ]);

        try {
            if ($request->hasFile('manuscript')) {
                $validated['manuscript_path'] = $storageService->storeUserFile($request->file('manuscript'), 'manuscripts');
            }

            $validated['user_id'] = Auth::id();
            $validated['status'] = ManuscriptStatus::SUBMITTED;

            $manuscript = Manuscript::create($validated);

            $editors = User::where('role', 'editor')->get();
            foreach ($editors as $editor) {
                $editor->notify(new ManuscriptSubmitted($manuscript));
            }

            return redirect()->route('manuscripts.index')->with('success', 'Manuscript submitted successfully!');
        } catch (Exception $e) {
            logger()->error('Submission Error', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred during submission.');
        }
    }

    /**
     * Display the specified manuscript to its owner.
     */
    public function show($id, StorageService $storageService)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);
            $userId = Auth::id();

            // Authorization check: only owner can view
            if ($manuscript->user_id !== $userId) {
                return redirect()->route('manuscripts.index')->with('error', 'You do not have permission to view this manuscript.');
            }

            $manuscriptUrl = $manuscript->manuscript_path
                ? $storageService->generateTemporaryUrl($manuscript->manuscript_path, 5)
                : null;

            $finalPdfUrl = $manuscript->final_pdf_path
                ? $storageService->generateTemporaryUrl($manuscript->final_pdf_path, $manuscript->status === 'Published' ? 30 : 5)
                : null;

            return Inertia::render('manuscripts/show-manuscript', [
                'manuscript' => [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => explode(', ', $manuscript->authors),
                    'abstract' => $manuscript->abstract,
                    'keywords' => explode(', ', $manuscript->keywords),
                    'manuscript_path' => $manuscriptUrl,
                    'final_pdf_path' => $finalPdfUrl,
                    'status' => $manuscript->status,
                    'user_id' => $manuscript->user_id,
                    'created_at' => $manuscript->created_at->toDateTimeString(),
                    'updated_at' => $manuscript->updated_at->toDateTimeString(),
                    'doi' => $manuscript->doi,
                    'volume' => $manuscript->volume,
                    'issue' => $manuscript->issue,
                    'page_range' => $manuscript->page_range,
                    'publication_date' => $manuscript->publication_date ? $manuscript->publication_date->toDateString() : null,
                ],
            ]);
        } catch (Exception $e) {
            logger()->error('Manuscript Show Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred while loading the manuscript.');
        }
    }

    /**
     * Show a published manuscript publicly (no authentication required).
     */
    public function showPublic($id)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            // Only allow viewing of published manuscripts
            if ($manuscript->status !== ManuscriptStatus::PUBLISHED) {
                abort(404, 'Manuscript not found or not publicly available');
            }

            return Inertia::render('manuscripts/public-view', [
                'manuscript' => [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => explode(', ', $manuscript->authors),
                    'abstract' => $manuscript->abstract,
                    'keywords' => explode(', ', $manuscript->keywords),
                    'pdfUrl' => $manuscript->final_pdf_path ? route('manuscripts.pdf', $manuscript->id) : null,
                    'doi' => $manuscript->doi,
                    'volume' => $manuscript->volume,
                    'issue' => $manuscript->issue,
                    'page_range' => $manuscript->page_range,
                    'publication_date' => $manuscript->publication_date ? $manuscript->publication_date->toDateString() : null,
                    'institution' => $manuscript->user->affiliation ?? 'Mindoro State University',
                ],
            ]);
        } catch (Exception $e) {
            Log::error('Public Manuscript Show Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            abort(404, 'Manuscript not found');
        }
    }

    /**
     * Remove the specified manuscript from storage.
     */
    public function destroy($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->delete();

        return redirect()->route('manuscripts.index')->with('success', 'Manuscript deleted successfully');
    }

    /**
     * Display the author's notifications.
     */
    public function notification()
    {
        $user = Auth::user();

        $notificationsCount = $user->notifications()->count();
        $unreadCount = $user->unreadNotifications()->count();

        Log::info('Author notification page viewed', [
            'user_id' => $user->id,
            'total_notifications' => $notificationsCount,
            'unread_notifications' => $unreadCount,
        ]);

        return Inertia::render('author/notification', [
            'debug' => [
                'total_notifications' => $notificationsCount,
                'unread_notifications' => $unreadCount,
            ],
        ]);
    }

    /**
     * Show the form for submitting a revision for a manuscript.
     */
    public function showRevisionForm($id, StorageService $storageService)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);
            $userId = Auth::id();

            if ($manuscript->user_id !== $userId) {
                return redirect()->route('manuscripts.index')->with('error', 'You do not have permission to revise this manuscript.');
            }

            if (
                $manuscript->status !== ManuscriptStatus::MINOR_REVISION &&
                $manuscript->status !== ManuscriptStatus::MAJOR_REVISION
            ) {
                return redirect()->route('manuscripts.show', $id)
                    ->with('error', 'This manuscript does not require a revision at this time.');
            }

            $latestDecision = $manuscript->editorialDecisions()
                ->latest('decision_date')
                ->first();

            $manuscriptUrl = $manuscript->manuscript_path
                ? $storageService->generateTemporaryUrl($manuscript->manuscript_path, 5)
                : null;

            return Inertia::render('manuscripts/revision', [
                'manuscript' => [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => explode(', ', $manuscript->authors),
                    'abstract' => $manuscript->abstract,
                    'keywords' => $manuscript->keywords,
                    'manuscript_url' => $manuscriptUrl,
                    'status' => $manuscript->status,
                    'created_at' => $manuscript->created_at->toDateTimeString(),
                    'updated_at' => $manuscript->updated_at->toDateTimeString(),
                ],
                'decision' => $latestDecision ? [
                    'id' => $latestDecision->id,
                    'comments' => $latestDecision->comments_to_author,
                    'decision_type' => $latestDecision->decision_type,
                    'decision_date' => $latestDecision->decision_date->format('Y-m-d'),
                    'revision_deadline' => $latestDecision->revision_deadline ?
                        $latestDecision->revision_deadline->format('Y-m-d') : null,
                ] : null,
            ]);
        } catch (Exception $e) {
            logger()->error('Revision Form Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred while loading the revision form.');
        }
    }

    /**
     * Store a submitted revision for a manuscript.
     */
    public function submitRevision(Request $request, $id, StorageService $storageService)
    {
        $manuscript = Manuscript::findOrFail($id);
        $userId = Auth::id();

        if ($manuscript->user_id !== $userId) {
            return redirect()->route('manuscripts.index')->with('error', 'You do not have permission to revise this manuscript.');
        }

        $validated = $request->validate([
            'revised_manuscript' => 'required|mimes:pdf|max:10240',
            'revision_comments' => 'required|string|min:10',
        ]);

        try {
            $revisionHistory = $manuscript->revision_history ?? [];
            $revisionHistory[] = [
                'version' => count($revisionHistory) + 1,
                'previous_status' => $manuscript->status,
                'manuscript_path' => $manuscript->manuscript_path,
                'submitted_at' => now()->toIso8601String(),
                'comments' => $validated['revision_comments'],
            ];

            if ($request->hasFile('revised_manuscript')) {
                // Use StorageService for storing revised manuscript
                $manuscript->manuscript_path = $storageService
                    ->storeUserFile($request->file('revised_manuscript'), 'manuscripts');
            }

            $previousStatus = $manuscript->status;

            $manuscript->status = ManuscriptStatus::SUBMITTED;
            $manuscript->revision_history = $revisionHistory;
            $manuscript->revision_comments = $validated['revision_comments'];
            $manuscript->revised_at = now();
            $manuscript->save();

            $editors = User::where('role', 'editor')->get();
            logger()->info('Sending revision notifications to editors', [
                'editor_count' => $editors->count(),
                'manuscript_id' => $manuscript->id,
            ]);

            foreach ($editors as $editor) {
                try {
                    $editor->notify(new ManuscriptRevisionSubmitted($manuscript));
                    logger()->info('Revision notification sent successfully', [
                        'editor_id' => $editor->id,
                        'editor_email' => $editor->email,
                        'manuscript_id' => $manuscript->id,
                    ]);
                } catch (Exception $e) {
                    logger()->error('Failed to send revision notification', [
                        'error' => $e->getMessage(),
                        'editor_id' => $editor->id,
                        'manuscript_id' => $manuscript->id,
                    ]);
                }
            }

            if ($previousStatus !== ManuscriptStatus::SUBMITTED) {
                try {
                    $manuscript->author->notify(new ManuscriptStatusChanged(
                        $manuscript,
                        (string) $previousStatus,
                        (string) ManuscriptStatus::SUBMITTED
                    ));

                    logger()->info('Status change notification sent to author', [
                        'manuscript_id' => $manuscript->id,
                        'previous_status' => $previousStatus,
                        'new_status' => ManuscriptStatus::SUBMITTED,
                    ]);
                } catch (Exception $e) {
                    logger()->error('Failed to send status change notification to author', [
                        'error' => $e->getMessage(),
                        'manuscript_id' => $manuscript->id,
                    ]);
                }
            }

            return redirect()->route('manuscripts.index')
                ->with('success', 'Revision submitted successfully. Your manuscript has been sent back for review.');
        } catch (Exception $e) {
            logger()->error('Revision Submission Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred during revision submission.');
        }
    }

    /**
     * Show the form for approving a manuscript for publication.
     */
    public function showApproveForm(Manuscript $manuscript, StorageService $storageService)
    {
        try {
            $finalPdfUrl = $manuscript->final_pdf_path
                ? $storageService->generateTemporaryUrl($manuscript->final_pdf_path, 30)
                : null;

            return Inertia::render('manuscripts/approve-manuscript', [
                'manuscript' => [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => explode(', ', $manuscript->authors),
                    'status' => $manuscript->status,
                    'final_pdf_url' => $finalPdfUrl,
                ],
            ]);
        } catch (Exception $e) {
            Log::error('Error showing approval form', [
                'error' => $e->getMessage(),
                'manuscript_id' => $manuscript->id,
            ]);

            return redirect()->back()->with('error', 'Failed to load approval form: '.$e->getMessage());
        }
    }

    /**
     * Mark a manuscript as ready to publish and notify the author.
     */
    public function approveManuscript(Request $request, Manuscript $manuscript)
    {
        try {
            DB::beginTransaction();

            $previousStatus = $manuscript->status;

            $manuscript->author_approval_date = now();
            $manuscript->status = (string) ManuscriptStatus::READY_TO_PUBLISH;
            $manuscript->save();

            try {
                $manuscript->author->notify(new ManuscriptApproved($manuscript));

                $manuscript->author->notify(new ManuscriptStatusChanged(
                    $manuscript,
                    (string) $previousStatus,
                    (string) $manuscript->status
                ));
            } catch (Exception $e) {
                Log::error('Failed to send publication notification', [
                    'error' => $e->getMessage(),
                    'manuscript_id' => $manuscript->id,
                ]);
            }

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Manuscript has been marked as ready to publish.',
                    'redirect' => route('manuscripts.index'),
                ]);
            }

            return redirect()->route('manuscripts.index')
                ->with('success', 'Manuscript has been marked as ready to publish.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error approving manuscript', [
                'error' => $e->getMessage(),
                'manuscript_id' => $manuscript->id,
                'trace' => $e->getTraceAsString(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to approve manuscript: '.$e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to approve manuscript: '.$e->getMessage());
        }
    }

    /**
     * Serve the PDF file for a published manuscript.
     */
    public function servePdf($id, StorageService $storageService)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            if (! $manuscript->final_pdf_path) {
                abort(404, 'PDF not found');
            }

            if ($manuscript->status !== ManuscriptStatus::PUBLISHED) {
                abort(403, 'PDF not publicly available - manuscript not yet published');
            }

            if (! $storageService->fileExists($manuscript->final_pdf_path)) {
                Log::error('PDF file not found in storage', [
                    'manuscript_id' => $id,
                    'pdf_path' => $manuscript->final_pdf_path,
                ]);
                abort(404, 'PDF file not found in storage');
            }

            $fileContent = $storageService->getFileContent($manuscript->final_pdf_path);

            $filename = sprintf(
                '%s_manuscript_%d.pdf',
                Str::slug($manuscript->title, '_'),
                $manuscript->id
            );

            return response($fileContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="'.$filename.'"')
                ->header('Cache-Control', 'public, max-age=3600')
                ->header('X-Content-Type-Options', 'nosniff');
        } catch (ModelNotFoundException $e) {
            Log::warning('Manuscript not found for PDF serving', [
                'manuscript_id' => $id,
            ]);
            abort(404, 'Manuscript not found');
        } catch (Exception $e) {
            Log::error('Error serving manuscript PDF', [
                'error' => $e->getMessage(),
                'manuscript_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            abort(500, 'Error serving PDF file');
        }
    }
}
