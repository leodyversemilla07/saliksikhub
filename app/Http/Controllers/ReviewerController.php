<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Manuscript;
use App\Models\Review;
use App\Models\ReviewerAssignment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\ManuscriptReview;

class ReviewerController extends Controller
{
    public function index()
    {
        // Display reviewer dashboard
        return Inertia::render("Reviewer/ReviewerDashboard");
    }

    public function reviewForm(?int $id = null)
    {
        if (!$id) {
            abort(404);
        }
        $manuscript = Manuscript::findOrFail($id);

        return Inertia::render("Reviewer/ReviewForm", $manuscript = [
            'id' => $manuscript->id,
            'title' => $manuscript->title,
            'authors' => explode(', ', $manuscript->authors),
            'manuscript_url' => asset('storage/' . $manuscript->manuscript_path),
        ]);
    }

    public function reviewManuscripts()
    {
        // List articles assigned for review
        $manuscripts = Manuscript::where('status', 'Under Review')->get();
        return Inertia::render('Reviewer/ReviewManuscriptsTable', compact('manuscripts'));
    }

    public function showReviewForm($reviewId)
{
    $review = Review::with('manuscript')->findOrFail($reviewId);
    return Inertia::render('Reviews/SubmitReview', [
        'review' => $review,
    ]);
}

    public function submitReview(Request $request, $reviewId)
    {
        $validated = $request->validate([
            'rating' => 'nullable|integer|min:1|max:5',
            'comments' => 'nullable|string',
            'suggested_edits' => 'nullable|string',
            'confidential_comments' => 'nullable|string',
            'status' => 'required|in:approved,rejected',
        ]);

        $review = Review::findOrFail($reviewId);
        $review->update($validated);

        // Optional: Send notification to editors/authors

        return back()->with('success', 'Your review has been submitted successfully.');
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
