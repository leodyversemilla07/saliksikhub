<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Inertia\Inertia;
use App\Models\Manuscript;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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

    public function indexManuscripts()
    {
        $manuscripts = Manuscript::where('status', 'Submitted')->get();

        return Inertia::render('Editor/Index', compact('manuscripts'));
    }

    public function indexManuscriptsAssign()
    {
        // Step 1: Fetch accepted manuscripts
        $manuscripts = Manuscript::where('status', 'Accepted')->get();

        // Step 2: Fetch all users with the 'reviewer' role using Spatie's role() method
        $reviewers = User::role('reviewer')->get(); // Fetch all users with 'reviewer' role

        // Step 3: Return the data to the Inertia view
        return Inertia::render('Editor/AssignReviewer', [
            'manuscripts' => $manuscripts,
            'reviewers' => $reviewers,
        ]);
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
