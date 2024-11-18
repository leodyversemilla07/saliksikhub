<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index()
    {
        // Display author dashboard
        return Inertia::render('Author/AuthorDashboard');
    }

    public function submissionForm()
    {
        return Inertia::render('Author/SubmissionForm');
    }

    public function submitArticle(Request $request)
    {
        // Validate and create a new article submission
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'manuscript_file' => 'required|file|mimes:pdf,doc,docx|max:2048', // Validate file type and size
            // Add other validations as necessary
        ]);

        // Handle the manuscript file upload
        $filePath = $request->file('manuscript_file')->store('manuscripts', 'public'); // Store in public disk

        // Create a new article record
        Article::create([
            'title' => $request->title,
            'abstract   ' => $request->content,
            'author_id' => Auth::id(),
            'status' => 'pending',
            'manuscript_file' => $filePath, // Save the file path in the database
            // Add other fields as necessary
        ]);

        return redirect()->route('author.index')->with('success', 'Article submitted successfully.');
    }

    public function myArticles()
    {
        // List author's submitted articles
        $articles = Article::where('author_id', Auth::id())->get();

        return view('author.my_articles', compact('articles'));
    }

    public function editMyArticle(Article $article)
    {
        if ($article->author_id !== Auth::id()) {
            abort(403); // Unauthorized access if not the author.
        }

        return view('author.edit_article', compact('article'));
    }

    public function updateMyArticle(Request $request, Article $article)
    {
        if ($article->author_id !== Auth::id()) {
            abort(403); // Unauthorized access if not the author.
        }

        // Validate and update article details.
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            // Add other validations as necessary.
        ]);

        $article->update($request->only('title', 'content'));

        return redirect()->route('author.myArticles')->with('success', 'Article updated successfully.');
    }
}
