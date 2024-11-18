<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Manuscript;

class ManuscriptController extends Controller
{
    public function create()
    {
        // Render the ManuscriptSubmissionForm in Inertia
        return Inertia::render('Manuscripts/Create');
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|min:10',
            'authors' => 'required|string|min:3',
            'abstract' => 'required|string|min:100',
            'keywords' => 'required|string|min:3',
            'manuscript' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // Max 10MB
        ]);

        // Handle file upload if present
        if ($request->hasFile('manuscript')) {
            $file = $request->file('manuscript');
            $path = $file->store('manuscripts', 'public');
            $validated['manuscript_path'] = $path;
        }

        // Associate the manuscript with the authenticated user
        $manuscript = Manuscript::create(array_merge($validated, [
            'user_id' => $request->user()->id,
        ]));

        return response()->json([
            'message' => 'Manuscript submitted successfully!',
            'data' => $manuscript,
        ]);
    }

    public function userManuscripts(Request $request)
    {
        $user = $request->user();
        $manuscripts = $user->manuscripts; // Use the relationship
        return response()->json($manuscripts);
    }

    public function show($id)
    {
        $manuscript = Manuscript::findOrFail($id);

        return response()->json([
            'data' => [
                'title' => $manuscript->title,
                'authors' => $manuscript->authors,
                'abstract' => $manuscript->abstract,
                'keywords' => $manuscript->keywords,
                'manuscript_url' => $manuscript->manuscript_path
                    ? asset('storage/' . $manuscript->manuscript_path) // Generate public URL
                    : null,
            ],
        ]);
    }
}
