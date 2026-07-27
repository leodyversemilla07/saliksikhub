<?php

namespace App\Http\Controllers\Admin;

use App\Models\Journal;
use App\Services\OJSImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OJSImportController extends Controller
{
    /**
     * Show the OJS import page.
     */
    public function index(?Journal $journal = null): Response
    {
        if (! $journal?->exists) {
            $journal = Journal::first();
        }

        $journals = Journal::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('admin/ojs-import/index', [
            'journals' => $journals,
            'selectedJournal' => $journal ?? $journals->first(),
        ]);
    }

    /**
     * Process the import.
     */
    public function store(Request $request, OJSImportService $importer): RedirectResponse
    {
        $validated = $request->validate([
            'journal_id' => ['required', 'exists:journals,id'],
            'xml_file' => ['required', 'file', 'mimes:xml', 'max:10240'], // 10MB max
            'publish_articles' => ['boolean'],
            'skip_existing_dois' => ['boolean'],
        ]);

        $journal = Journal::findOrFail($validated['journal_id']);

        // Store the uploaded file
        $path = $request->file('xml_file')->storeAs(
            'ojs-imports',
            'import-'.$journal->id.'-'.time().'.xml',
        );

        if (! $path) {
            throw ValidationException::withMessages([
                'xml_file' => ['Failed to store uploaded file.'],
            ]);
        }

        $fullPath = storage_path('app/'.$path);

        $stats = $importer->import($journal, $fullPath, [
            'publish_articles' => $validated['publish_articles'] ?? false,
            'skip_existing_dois' => $validated['skip_existing_dois'] ?? true,
        ]);

        return redirect()->route('admin.ojs-import.index')
            ->with('flash', [
                'stats' => $stats,
                'journal_name' => $journal->name,
                'type' => empty($stats['errors']) ? 'success' : 'warning',
            ]);
    }
}
