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

    public function myArticles()
    {
        // List author's submitted articles
        $articles = Article::where('author_id', Auth::id())->get();

        return view('author.my_articles', compact('articles'));
    }
}
