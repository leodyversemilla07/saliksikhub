<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ArticleRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class ArticleController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function index()
    {
        $articles = Article::with('author')
            ->latest()
            ->paginate(10);

        return view('articles.index', compact('articles'));
    }

    public function create()
    {
        $this->authorize('create', Article::class);
        return view('articles.create');
    }

    public function store(ArticleRequest $request)
    {
        $validated = $request->validated();

        $article = new Article($validated);
        $article->author_id = Auth::id();
        $article->published_at = now();

        if ($request->hasFile('file')) {
            $article->file = $this->handleFileUpload($request->file('file'));
        }

        $article->save();

        return redirect()
            ->route('articles.index')
            ->with('success', 'Article created successfully.');
    }

    public function show(Article $article)
    {
        return view('articles.show', compact('article'));
    }

    public function edit(Article $article)
    {
        $this->authorize('update', $article);
        return view('articles.edit', compact('article'));
    }

    public function update(ArticleRequest $request, Article $article)
    {
        $this->authorize('update', $article);

        $validated = $request->validated();

        if ($request->hasFile('file')) {
            $this->deleteExistingFile($article->file);
            $validated['file'] = $this->handleFileUpload($request->file('file'));
        }

        $article->update($validated);

        return redirect()
            ->route('articles.index')
            ->with('success', 'Article updated successfully.');
    }

    public function destroy(Article $article)
    {
        $this->authorize('delete', $article);

        $this->deleteExistingFile($article->file);
        $article->delete();

        return redirect()
            ->route('articles.index')
            ->with('success', 'Article deleted successfully.');
    }

    public function download(Article $article)
    {
        if (!$article->file || !Storage::disk('public')->exists($article->file)) {
            return redirect()->back()->with('error', 'File not found.');
        }

        return Storage::download('public/' . $article->file);
    }

    private function handleFileUpload($file)
    {
        return $file->store('articles', 'public');
    }

    private function deleteExistingFile($filePath)
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }
}
