<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Manuscript;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index()
    {
        $manuscripts = Manuscript::all(); // Fetch data from your database

        return Inertia::render('Author/AuthorDashboard', compact('manuscripts'));
    }

    public function myArticles()
    {
        // List author's submitted articles
        $articles = Article::where('author_id', Auth::id())->get();

        return view('author.my_articles', compact('articles'));
    }
}
