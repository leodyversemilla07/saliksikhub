<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Manuscript;
use App\Models\Article;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Exception;
use App\Models\ReviewerAssignment;
use App\Models\AiReview;
use Smalot\PdfParser\Parser;

class ManuscriptController extends Controller
{
    /**
     * Display a list of manuscripts for the authenticated user.
     */
    public function index()
    {
        $userId = Auth::id();

        $manuscripts = Manuscript::where('user_id', $userId)
            ->whereNotIn('status', ['Revision Required', 'AI Pre-reviewed'])
            ->get();

        return Inertia::render('Manuscripts/Index', compact('manuscripts'));
    }

    /**
     * Show manuscripts requiring revision for the authenticated user.
     */
    public function revisions()
    {
        $userId = Auth::id();

        $manuscripts = Manuscript::where([
            ['user_id', '=', $userId],
            ['status', '=', 'Revision Required']
        ])->get();

        return Inertia::render('Manuscripts/Index', ['manuscripts' => $manuscripts]);
    }

    /**
     * Show the form for creating a new manuscript.
     */
    public function create()
    {
        return Inertia::render('Manuscripts/Create');
    }

    public function store(Request $request)
    {
        set_time_limit(240);

        $validated = $request->validate([
            'title' => 'required|string|min:10',
            'authors' => 'required|string|min:3',
            'abstract' => 'required|string|min:100',
            'keywords' => 'required|string|min:3',
            'manuscript' => 'required|mimes:pdf|max:20480',
        ]);

        try {
            if ($request->hasFile('manuscript')) {
                $path = $request->file('manuscript')->store('manuscripts', 'public');
                $validated['manuscript_path'] = $path;
            }

            $validated['user_id'] = Auth::id();
            $validated['status'] = Manuscript::STATUSES['SUBMITTED'];

            $manuscript = Manuscript::create($validated);

            $filePath = Storage::disk('public')->path($validated['manuscript_path']);
            $parser = new Parser();
            $pdf = $parser->parseFile($filePath);
            $manuscriptText = $pdf->getText();

            logger()->info('Extracted Manuscript Text:', ['text' => $manuscriptText]);

            $response = Http::timeout(240)
                ->post('http://127.0.0.1:3000/pre_review/', [
                    'manuscript_text' => $manuscriptText,
                ]);

            if ($response->successful()) {
                $responseBody = $response->json();

                logger()->info('AI Pre-review Response:', ['response' => $responseBody]);

                AiReview::create([
                    'manuscript_id' => $manuscript->id,
                    'summary' => $responseBody['summary'] ?? null,
                    'keywords' => isset($responseBody['keywords']) ? json_encode($responseBody['keywords']) : null,
                    'language_quality' => isset($responseBody['language_quality']) ? json_encode($responseBody['language_quality']) : null,
                ]);
            } else {
                logger()->error('AI Pre-review failed', [
                    'response' => $response->body(),
                ]);
            }

            return response()->json([
                'message' => 'Manuscript submitted successfully!',
                'data' => $manuscript->load('aiReview'),
            ], 201);

        } catch (Exception $e) {
            logger()->error('Submission Error', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'An error occurred during submission.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show a specific manuscript.
     */
    public function show($id)
    {
        $manuscript = Manuscript::findOrFail($id);

        return Inertia::render('Manuscripts/Show', [
            'manuscript' => [
                'title' => $manuscript->title,
                'authors' => explode(', ', $manuscript->authors),
                'abstract' => $manuscript->abstract,
                'keywords' => explode(', ', $manuscript->keywords),
                'manuscript_url' => asset("storage/{$manuscript->manuscript_path}"),
                'status' => $manuscript->status,
                'created_at' => $manuscript->created_at->toDateTimeString(),
                'updated_at' => $manuscript->updated_at->toDateTimeString(),
            ],
        ]);
    }

    /**
     * Show the form for editing a manuscript.
     */
    public function edit($id)
    {
        $manuscript = Manuscript::findOrFail($id);

        return Inertia::render('Manuscripts/Edit', compact('manuscript'));
    }

    /**
     * Update a manuscript.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'authors' => 'required|string|max:255',
            'abstract' => 'required',
            'keywords' => 'required|string|max:255',
            'manuscript_file' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $manuscript = Manuscript::findOrFail($id);
        $manuscript->update($validated);

        if ($request->hasFile('manuscript_file')) {
            if ($manuscript->manuscript_path) {
                Storage::delete(str_replace(asset('storage/'), 'public/', $manuscript->manuscript_path));
            }

            $path = $request->file('manuscript_file')->store('manuscripts', 'public');
            $manuscript->update(['manuscript_path' => asset("storage/{$path}")]);
        }

        return redirect()->route('manuscripts.index')->with('success', 'Manuscript updated successfully.');
    }


    /**
     * Delete a manuscript.
     */
    public function destroy($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->delete();

        return response()->json(['message' => 'Deleted successfully'], 200);
    }

    public function assignReviewer(Request $request, Manuscript $manuscript)
    {
        // Validate request
        $request->validate([
            'reviewer_id' => 'required|array',
            'reviewer_id.*' => 'exists:users,id',
        ]);

        // Create reviewer assignments
        foreach ($request->reviewer_id as $reviewerId) {
            ReviewerAssignment::create([
                'manuscript_id' => $manuscript->id,
                'reviewer_id' => $reviewerId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Update manuscript status
        $manuscript->update(['status' => 'Under Review']);

        return redirect()->back()->with('success', 'Reviewer(s) assigned successfully.');
    }

    /**
     * Approve or reject or revision required a manuscript.
     */
    public function approve($id)
    {
        return $this->changeStatus($id, Manuscript::STATUSES['ACCEPTED'], 'Manuscript accepted.');
    }

    public function reject($id)
    {
        return $this->changeStatus($id, Manuscript::STATUSES['REJECTED'], 'Manuscript rejected.');
    }

    public function revisionRequired($id)
    {
        return $this->changeStatus($id, Manuscript::STATUSES['REVISION_REQUIRED'], 'Manuscript requires revision.');
    }

    /**
     * Publish a manuscript.
     */
    public function publish($id)
    {
        $manuscript = Manuscript::findOrFail($id);

        if ($manuscript->status !== 'approved') {
            return redirect()->back()->with('error', 'Only approved manuscripts can be published.');
        }

        Article::create([
            'title' => $manuscript->title,
            'abstract' => $manuscript->abstract,
            'file' => $manuscript->manuscript_path,
            'author_id' => $manuscript->user_id,
            'published_at' => now(),
        ]);

        $manuscript->update(['status' => 'published']);

        return redirect()->back()->with('success', 'Manuscript published successfully.');
    }

    public function indexAIPrereviewed()
    {
        $userId = Auth::id();

        // Fetch manuscripts with AI reviews for the authenticated user
        $manuscripts = Manuscript::with('aiReview')
            ->where('user_id', $userId)
            ->get();

        // Transform the data to match the expected structure
        $manuscripts = $manuscripts->map(function ($manuscript) {
            return [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'user_id' => $manuscript->user_id,
                'created_at' => $manuscript->created_at->toDateTimeString(),
                'updated_at' => $manuscript->updated_at->toDateTimeString(),
                'status' => $manuscript->status,
                'authors' => $manuscript->authors,
                'aiReview' => $manuscript->aiReview ? [
                    'summary' => $manuscript->aiReview->summary,
                    'keywords' => $manuscript->aiReview->keywords ? explode(',', $manuscript->aiReview->keywords) : [],
                    'language_quality' => json_decode($manuscript->aiReview->language_quality, true),
                    'created_at' => $manuscript->aiReview->created_at->toDateTimeString(),
                ] : null,
            ];
        });

        return Inertia::render('Manuscripts/IndexAIPrereviewed', [
            'manuscripts' => $manuscripts,
        ]);
    }

    public function notification()
    {
        return Inertia::render('Author/Notification');
    }

    /**
     * Change manuscript status helper.
     */
    private function changeStatus($id, $status, $message)
    {
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->update(['status' => $status]);

        return redirect()->back()->with('success', $message);
    }
}
