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
        $manuscripts = Manuscript::all();

        return Inertia::render('Author/AuthorDashboard', compact('manuscripts'));
    }
}
