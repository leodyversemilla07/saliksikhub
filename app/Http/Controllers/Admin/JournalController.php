<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJournalRequest;
use App\Http\Requests\Admin\UpdateJournalRequest;
use App\Models\Institution;
use App\Models\Journal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class JournalController extends Controller
{
    /**
     * Display a listing of journals.
     */
    public function index(): Response
    {
        $journals = Journal::query()
            ->with('institution')
            ->withCount('manuscripts')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('admin/journals/index', [
            'journals' => $journals,
        ]);
    }

    /**
     * Show the form for creating a new journal.
     */
    public function create(): Response
    {
        $institutions = Institution::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'abbreviation']);

        return Inertia::render('admin/journals/create', [
            'institutions' => $institutions,
        ]);
    }

    /**
     * Store a newly created journal.
     */
    public function store(StoreJournalRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('journals/logos', 'public');
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->store('journals/covers', 'public');
        }

        Journal::create($data);

        return redirect()
            ->route('admin.journals.index')
            ->with('success', 'Journal created successfully.');
    }

    /**
     * Display the specified journal.
     */
    public function show(Journal $journal): Response
    {
        $journal->load(['institution', 'manuscripts' => fn ($q) => $q->latest()->limit(10)]);

        return Inertia::render('admin/journals/show', [
            'journal' => $journal,
        ]);
    }

    /**
     * Show the form for editing the specified journal.
     */
    public function edit(Journal $journal): Response
    {
        $institutions = Institution::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'abbreviation']);

        return Inertia::render('admin/journals/edit', [
            'journal' => $journal,
            'institutions' => $institutions,
        ]);
    }

    /**
     * Update the specified journal.
     */
    public function update(UpdateJournalRequest $request, Journal $journal): RedirectResponse
    {
        $data = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            if ($journal->logo_path) {
                Storage::disk('public')->delete($journal->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('journals/logos', 'public');
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            if ($journal->cover_image_path) {
                Storage::disk('public')->delete($journal->cover_image_path);
            }
            $data['cover_image_path'] = $request->file('cover_image')->store('journals/covers', 'public');
        }

        $journal->update($data);

        return redirect()
            ->route('admin.journals.index')
            ->with('success', 'Journal updated successfully.');
    }

    /**
     * Remove the specified journal.
     */
    public function destroy(Journal $journal): RedirectResponse
    {
        // Check for associated manuscripts
        if ($journal->manuscripts()->exists()) {
            return back()->with('error', 'Cannot delete journal with associated manuscripts.');
        }

        // Delete files
        if ($journal->logo_path) {
            Storage::disk('public')->delete($journal->logo_path);
        }
        if ($journal->cover_image_path) {
            Storage::disk('public')->delete($journal->cover_image_path);
        }

        $journal->delete();

        return redirect()
            ->route('admin.journals.index')
            ->with('success', 'Journal deleted successfully.');
    }

    /**
     * Toggle journal active status.
     */
    public function toggleStatus(Journal $journal): RedirectResponse
    {
        $journal->update(['is_active' => ! $journal->is_active]);

        $status = $journal->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Journal {$status} successfully.");
    }
}
