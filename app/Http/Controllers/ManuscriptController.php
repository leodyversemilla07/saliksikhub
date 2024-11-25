<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Manuscript;
use App\Models\Article;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use GuzzleHttp\Client;

class ManuscriptController extends Controller
{
    public function index()
    {
        $userId = Auth::id(); // Or use $request->user()->id
        // Fetch manuscripts from the database
        $manuscripts = Manuscript::where('user_id', $userId)->get(); // Get the manuscripts belonging to the logged-in user

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
            'manuscript' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // Max 10MB
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

        } catch (\Exception $e) {
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

        return response()->json([
            'data' => [
                'title' => $manuscript->title,
                'authors' => $manuscript->authors,
                'abstract' => $manuscript->abstract,
                'keywords' => $manuscript->keywords,
                'manuscript_url' => $manuscript->manuscript_path
                    ? asset('storage/' . $manuscript->manuscript_path) // Generate public URL
                    : null,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified manuscript.
     */
    public function edit($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        return view('manuscripts.edit', compact('manuscript'));
    }

    /**
     * Update the specified manuscript in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'abstract' => 'required',
        ]);

        $manuscript = Manuscript::findOrFail($id);
        $manuscript->update($validated);

        return redirect()->route('manuscripts.index')->with('success', 'Manuscript updated successfully.');
    }

    /**
     * Remove the specified manuscript from storage.
     */
    public function destroy($id)
    {
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->delete();

        return redirect()->route('manuscripts.index')->with('success', 'Manuscript deleted successfully.');
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

    /**
     * Download the manuscript file.
     */
    // public function download($id)
    // {
    //     $manuscript = Manuscript::findOrFail($id);

    //     // Check user role or permissions
    //     if (!Auth::user()->can('download', $manuscript)) {
    //         return redirect()->back()->with('error', 'Unauthorized access.');
    //     }

    //     // Ensure the file exists
    //     if (!$manuscript->file || !Storage::disk('public')->exists($manuscript->file)) {
    //         return redirect()->back()->with('error', 'File not found.');
    //     }

    //     // Download the file
    //     return response()->download(storage_path('app/public/' . $manuscript->file));
    // }
}
