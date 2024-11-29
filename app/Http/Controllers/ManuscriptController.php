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

class ManuscriptController extends Controller
{
    public function index()
    {
        $userId = Auth::id(); // Or use $request->user()->id
        // Fetch manuscripts from the database
        $manuscripts = Manuscript::where('user_id', $userId)
            ->where('status', '!=', 'Revision Required')
            ->where('status', '!=', 'AI Pre-reviewed')
            ->get(); // Get the manuscripts belonging to the logged-in user

        // Return the data to the Inertia view
        return Inertia::render('Manuscripts/Index', [
            'manuscripts' => $manuscripts
        ]);
    }

    /**
     * Show the form for creating a new manuscript.
     */
    public function create()
    {
        // Render the ManuscriptSubmissionForm in Inertia
        return Inertia::render('Manuscripts/Create');
    }

    public function revisions()
    {
        $userId = Auth::id(); // Get the logged-in user's ID

        // Fetch manuscripts with 'revision' status that belong to the logged-in user
        $manuscripts = Manuscript::where('user_id', $userId)
            ->where('status', 'Revision Required')
            ->get();

        // Return the data to the Inertia view
        return Inertia::render('Manuscripts/Index', [
            'manuscripts' => $manuscripts,
        ]);
    }

    /**
     * Store a newly created manuscript in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|min:10',
            'authors' => 'required|string|min:3',
            'abstract' => 'required|string|min:100',
            'keywords' => 'required|string|min:3',
            'manuscript' => 'required|mimes:pdf|max:20480', // Accept PDF files up to 20MB
        ]);

        try {
            // Handle file upload if present
            if ($request->hasFile('manuscript')) {
                $file = $request->file('manuscript');
                $path = $file->store('manuscripts', 'public');

                if (!$path) {
                    return response()->json(['message' => 'File upload failed.'], 500);
                }

                $validated['manuscript_path'] = $path;
            }

            // Associate the manuscript with the authenticated user
            $manuscript = Manuscript::create(array_merge($validated, [
                'user_id' => $request->user()->id,
                'status' => Manuscript::STATUS_SUBMITTED, // Default status
            ]));

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
     * Display the specified manuscript.
     */
    public function show($id)
    {
        $manuscript = Manuscript::findOrFail($id);

        return Inertia::render('Manuscripts/Show', [
            'manuscript' => [
                'title' => $manuscript->title,
                'authors' => $manuscript->authors ? explode(', ', $manuscript->authors) : [],
                'abstract' => $manuscript->abstract,
                'keywords' => $manuscript->keywords ? explode(', ', $manuscript->keywords) : [],
                'manuscript_url' => $manuscript->manuscript_path ? asset('storage/' . $manuscript->manuscript_path) : null,
                'status' => $manuscript->status,
                'created_at' => $manuscript->created_at->toDateTimeString(),
                'updated_at' => $manuscript->updated_at->toDateTimeString(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified manuscript.
     */
    public function edit($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        return Inertia::render('Manuscripts/Edit', [
            'manuscript' => $manuscript,
        ]);
    }

    /**
     * Update the specified manuscript in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'authors' => 'required|string|max:255',
            'abstract' => 'required',
            'keywords' => 'required|string|max:255',
            'manuscript_file' => 'nullable|file|mimes:pdf|max:10240', // Only allow PDF files, max 10MB
        ]);

        $manuscript = Manuscript::findOrFail($id);

        // Step 1: Save the validated fields to the manuscript
        $manuscript->update($validated);

        // Step 2: Handle file upload and deletion of old file
        if ($request->hasFile('manuscript_file')) {
            // Step 2.1: Delete the old file if it exists
            if ($manuscript->manuscript_path) {
                // Use Laravel's `Storage` facade to delete the old file from the public disk
                $oldFilePath = str_replace('http://127.0.0.1:8000/storage/', 'public/', $manuscript->manuscript_path);
                Storage::delete($oldFilePath); // Deletes the old file from the storage
            }

            // Step 2.2: Store the new file and update the manuscript path
            $filePath = $request->file('manuscript_file')->store('manuscripts', 'public');
            $manuscript->manuscript_path = asset('storage/' . $filePath); // Update with the new file's URL
            $manuscript->save(); // Save the manuscript with the new file path
        }

        // Step 3: Redirect with success message
        return redirect()->route('manuscripts.index')->with('success', 'Manuscript updated successfully.');
    }


    /**
     * Remove the specified manuscript from storage.
     */
    public function destroy($id)
    {
        try {
            $manuscript = Manuscript::findOrFail($id); // Check if it exists
            $manuscript->delete();

            return response()->json(['message' => 'Deleted successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500); // Debug the error
        }
    }

    /**
     * Submit the manuscript for review.
     */
    public function submitForReview($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->status = Manuscript::STATUS_UNDER_REVIEW;
        $manuscript->save();

        return redirect()->back()->with('success', 'Manuscript submitted for review.');
    }

    /**
     * Assign reviewers to the manuscript.
     */
    public function assignReviewer(Request $request, $id)
    {
        $validated = $request->validate([
            'reviewer_ids' => 'required|array',
        ]);

        $manuscript = Manuscript::findOrFail($id);
        $manuscript->reviewers()->sync($validated['reviewer_ids']);

        return redirect()->back()->with('success', 'Reviewers assigned successfully.');
    }

    /**
     * Approve the manuscript for publication.
     */
    public function approve($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->status = 'approved';
        $manuscript->save();

        return redirect()->back()->with('success', 'Manuscript approved.');
    }

    /**
     * Reject the manuscript.
     */
    public function reject($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->status = 'rejected';
        $manuscript->save();

        return redirect()->back()->with('success', 'Manuscript rejected.');
    }

    /**
     * Publish the manuscript.
     */
    public function publish($id)
    {
        $manuscript = Manuscript::findOrFail($id);

        if ($manuscript->status !== 'approved') {
            return redirect()->back()->with('error', 'Only approved manuscripts can be published.');
        }

        // Transfer manuscript data to the articles table
        $article = new Article();
        $article->title = $manuscript->title;
        $article->abstract = $manuscript->abstract;
        $article->content = $manuscript->content; // If applicable
        $article->file = $manuscript->file; // Assuming the same file is used
        $article->author_id = $manuscript->author_id;
        $article->published_at = now();
        $article->save();

        // Update manuscript status to indicate it has been published
        $manuscript->status = 'published';
        $manuscript->save();

        return redirect()->back()->with('success', 'Manuscript published successfully and moved to Articles.');
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
}
