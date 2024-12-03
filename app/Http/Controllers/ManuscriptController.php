<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Manuscript;
use App\Models\Article;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use GuzzleHttp\Client;
use Exception;
use App\Models\ReviewerAssignment;

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

        $manuscripts = Manuscript::where('user_id', $userId)
            ->where('status', 'Revision Required')
            ->get();

        return Inertia::render('Manuscripts/Index', compact('manuscripts'));
    }

    /**
     * Show the form for creating a new manuscript.
     */
    public function create()
    {
        return Inertia::render('Manuscripts/Create');
    }

    /**
     * Store a new manuscript.
     */
    public function store(Request $request)
    {
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
            $validated['status'] = Manuscript::STATUS_SUBMITTED;

            $manuscript = Manuscript::create($validated);

            return response()->json([
                'message' => 'Manuscript submitted successfully!',
                'data' => $manuscript,
            ], 201);
        } catch (Exception $e) {
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
                'manuscript_url' => asset('storage/' . $manuscript->manuscript_path),
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
            $manuscript->update(['manuscript_path' => asset('storage/' . $path)]);
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

    /**
     * Submit a manuscript for review.
     */
    public function submitForReview($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->update(['status' => Manuscript::STATUS_UNDER_REVIEW]);

        return redirect()->back()->with('success', 'Manuscript submitted for review.');
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
        $manuscript->update(['status' => Manuscript::STATUS_UNDER_REVIEW]);

        return redirect()->back()->with('success', 'Reviewer(s) assigned successfully.');
    }

    /**
     * Approve or reject or revision required a manuscript.
     */
    public function approve($id)
    {
        return $this->changeStatus($id, Manuscript::STATUS_ACCEPTED, 'Manuscript accepted.');
    }

    public function reject($id)
    {
        return $this->changeStatus($id, Manuscript::STATUS_REJECTED, 'Manuscript rejected.');
    }

    public function revisionRequired($id)
    {
        return $this->changeStatus($id, Manuscript::STATUS_REVISION_REQUIRED, 'Manuscript requires revision.');
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

    public function sendForReview(Request $request)
    {
        $request->validate(['manuscript' => 'required|file|mimes:pdf,docx',]);
        $manuscript = $request->file('manuscript');
        $client = new Client();
        $response = $client->post('http://127.0.0.1:8000/api/manuscript-review/', ['multipart' => [['name' => 'manuscript', 'contents' => fopen($manuscript->getPathname(), 'r'), 'filename' => $manuscript->getClientOriginalName(),],], 'headers' => ['X-CSRF-TOKEN' => csrf_token(),],]);
        $data = json_decode($response->getBody()->getContents(), true);
        $review = $data['review'];
        $compliance_score = $data['compliance_score'];
        return inertia('ManuscriptReview', ['review' => $review, 'compliance_score' => $compliance_score]);
    }

    public function showAiReview($manuscriptId)
    {
        $manuscript = Manuscript::findOrFail($manuscriptId);

        // Hardcoded AI review data
        $aiReview = [
            'manuscriptTitle' => $manuscript->title,
            'reviewDate' => now()->toISOString(),
            'overallScore' => 85,
            'plagiarismScore' => 5,
            'sections' => [
                [
                    'title' => 'Language and Grammar',
                    'description' => 'The manuscript has minor grammatical errors.',
                    'suggestions' => [
                        'Correct the grammatical errors in Section 2.',
                        'Use consistent tense throughout the document.',
                    ],
                ],
                [
                    'title' => 'Plagiarism',
                    'description' => 'Minimal overlap detected with other sources.',
                    'suggestions' => [
                        'Ensure proper citations for the flagged sections.',
                    ],
                ],
            ],
            // 'downloadUrl' => route('manuscripts.downloadReport', $manuscriptId),
        ];

        return Inertia::render('Manuscripts/AiReviewReport', $aiReview);
    }

    public function indexAIPrereviewed()
    {
        // Fetch manuscripts that have been reviewed by AI
        $manuscripts = Manuscript::where('status', 'AI Pre-reviewed')->get();

        // Returning data to Inertia (React)
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
