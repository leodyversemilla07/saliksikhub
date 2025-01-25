<?php

namespace App\Http\Controllers;

use App\Models\Manuscript;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index()
    {
        $manuscripts = Manuscript::all()->map(function ($manuscript) {
            return [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'status' => $manuscript->status,
                'created_at' => $manuscript->created_at ? $manuscript->created_at->toIso8601String() : null,
                'updated_at' => $manuscript->updated_at->toIso8601String(),
            ];
        });

        return Inertia::render('Author/AuthorDashboard', [
            'manuscripts' => $manuscripts,
        ]);
    }
}
