<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Inertia\Inertia;

class EditorController extends Controller
{
    public function index()
    {
        // Display editor dashboard
        return Inertia::render("Editor/EditorDashboard");
    }

    public function editArticles()
    {
        // List articles pending edits
        $articles = Article::where('status', 'pending')->get();
        return view('editor.edit_articles', compact('articles'));
    }

    public function updateArticle(Request $request, Article $article)
    {
        // Validate and update article details
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            // Add other validations as necessary
        ]);

        $article->update($request->only('title', 'content'));

        return redirect()->route('editor.editArticles')->with('success', 'Article updated successfully.');
    }

    public function publishArticle(Article $article)
    {
        // Publish the article
        $article->update(['status' => 'published']);

        return redirect()->route('editor.editArticles')->with('success', 'Article published successfully.');
    }
}
