<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    /**
     * Display a listing of published articles.
     */
    public function index()
    {
        $articles = Article::latest()->paginate(10); // Paginated list of articles
        return view('articles.index', compact('articles'));
    }

    /**
     * Show the form for creating a new article (Admin only).
     */
    public function create()
    {
        return view('articles.create');
    }

    /**
     * Store a newly created article in the database (Admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'content' => 'required',
            'file' => 'nullable|file|mimes:pdf,docx',
        ]);

        $filePath = $request->file('file') ? $request->file('file')->store('articles', 'public') : null;

        $article = new Article();
        $article->title = $validated['title'];
        $article->abstract = $validated['abstract'];
        $article->content = $validated['content'];
        $article->file = $filePath;
        $article->published_at = now();
        $article->author_id = Auth::id(); // Assuming the logged-in  is the author
        $article->save();

        return redirect()->route('articles.index')->with('success', 'Article created successfully.');
    }

    /**
     * Display the specified article.
     */
    public function show($id)
    {
        $article = Article::findOrFail($id);
        return view('articles.show', compact('article'));
    }

    /**
     * Show the form for editing the specified article (Admin only).
     */
    public function edit($id)
    {
        $article = Article::findOrFail($id);
        return view('articles.edit', compact('article'));
    }

    /**
     * Update the specified article in the database (Admin only).
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'content' => 'required',
            'file' => 'nullable|file|mimes:pdf,docx',
        ]);

        $article = Article::findOrFail($id);

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('articles', 'public');
            $article->file = $filePath; // Update file if a new one is provided
        }

        $article->update([
            'title' => $validated['title'],
            'abstract' => $validated['abstract'],
            'content' => $validated['content'],
        ]);

        return redirect()->route('articles.index')->with('success', 'Article updated successfully.');
    }

    /**
     * Remove the specified article from the database (Admin only).
     */
    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return redirect()->route('articles.index')->with('success', 'Article deleted successfully.');
    }


    /**
     * Download the article file.
     */
    public function download($id)
    {
        $article = Article::findOrFail($id);

        // Ensure the file exists
        if (!$article->file || !Storage::disk('public')->exists($article->file)) {
            return redirect()->back()->with('error', 'File not found.');
        }

        // Download the file
        return response()->download(storage_path('app/public/' . $article->file));
    }
}
