<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewerController extends Controller
{
    public function index()
    {
        // Display reviewer dashboard
        return Inertia::render("Reviewer/ReviewerDashboard");
    }

    public function reviewArticles()
    {
        // List articles assigned for review
        $articles = Article::where('status', 'under_review')->get();
        return view('reviewer.review_articles', compact('articles'));
    }

    public function submitReview(Request $request, Article $article)
    {
        // Validate and submit review feedback
        $request->validate([
            'feedback' => 'required|string',
            // Add other validations as necessary
        ]);

        // Assuming you have a feedback column or related model to store reviews.
        $article->feedback()->create([
            'reviewer_id' => Auth::id(), // Use Auth facade here
            'feedback' => $request->feedback,
            // Add other fields as necessary
        ]);

        return redirect()->route('reviewer.reviewArticles')->with('success', 'Review submitted successfully.');
    }
}
