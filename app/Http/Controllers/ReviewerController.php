<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Manuscript;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    public function index()
    {
        // Display reviewer dashboard
        return Inertia::render("Reviewer/ReviewerDashboard");
    }

    public function reviewForm()
    {
        // Display reviewer dashboard
        return Inertia::render("Reviewer/ReviewForm");
    }

    public function reviewManuscripts()
    {
        // List articles assigned for review
        $manuscripts = Manuscript::where('status', 'Under Review')->get();
        return Inertia::render('Reviewer/ReviewManuscriptsTable', compact('manuscripts'));
    }

    public function submitReview(Request $request, Manuscript $manuscript)
    {
        // Validate and submit review feedback
        $request->validate([
            'feedback' => 'required|string',
            // Add other validations as necessary
        ]);

        // Assuming you have a feedback column or related model to store reviews.
        $manuscript->feedback()->create([
            'reviewer_id' => Auth::id(), // Use Auth facade here
            'feedback' => $request->feedback,
            // Add other fields as necessary
        ]);

        return redirect()->route('reviewer.reviewArticles')->with('success', 'Review submitted successfully.');
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
}
