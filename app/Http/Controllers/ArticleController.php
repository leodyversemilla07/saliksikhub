<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Inertia\Inertia;

class ArticleController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function index()
    {
        $articles = Article::with('author')
            ->latest()
            ->paginate(10);

        return Inertia::render('Articles/Index', $articles);
    }
}
