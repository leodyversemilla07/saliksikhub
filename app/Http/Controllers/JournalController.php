<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class JournalController extends Controller
{
    /**
     * Get list of active journals for the journal switcher.
     */
    public function index(): JsonResponse
    {
        $journals = Journal::with('institution')
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (Journal $journal) => [
                'id' => $journal->id,
                'name' => $journal->name,
                'slug' => $journal->slug,
                'abbreviation' => $journal->abbreviation,
                'logo_url' => $journal->logo_path ? \Storage::url($journal->logo_path) : null,
                'institution' => $journal->institution ? [
                    'id' => $journal->institution->id,
                    'name' => $journal->institution->name,
                    'abbreviation' => $journal->institution->abbreviation,
                ] : null,
            ]);

        return response()->json([
            'journals' => $journals,
            'current_journal_id' => app()->bound('currentJournal') ? app('currentJournal')?->id : null,
        ]);
    }

    /**
     * Switch to a different journal.
     */
    public function switch(Request $request, Journal $journal): RedirectResponse
    {
        if (! $journal->is_active) {
            return back()->with('error', 'This journal is currently inactive.');
        }

        // Store the selected journal in the session
        session(['selected_journal_id' => $journal->id]);

        // Redirect to the journal's home page or stay on current page
        $redirectTo = $request->input('redirect_to', '/');

        return redirect($redirectTo)->with('success', "Switched to {$journal->name}");
    }
}
