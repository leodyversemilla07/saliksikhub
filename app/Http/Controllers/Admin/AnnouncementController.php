<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of announcements for the current journal.
     */
    public function index(): Response
    {
        $journal = app('currentJournal');

        $announcements = Announcement::query()
            ->where('journal_id', $journal->id)
            ->with('author:id,name')
            ->ordered()
            ->paginate(15);

        return Inertia::render('admin/announcements/index', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Show the form for creating a new announcement.
     */
    public function create(): Response
    {
        return Inertia::render('admin/announcements/create', [
            'types' => Announcement::TYPES,
        ]);
    }

    /**
     * Store a newly created announcement.
     */
    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        $journal = app('currentJournal');
        $data = $request->validated();

        $data['journal_id'] = $journal->id;
        $data['user_id'] = $request->user()->id;

        // Auto-set published_at when publishing for the first time
        if (($data['is_published'] ?? false) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        Announcement::create($data);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement created successfully.');
    }

    /**
     * Show the form for editing the specified announcement.
     */
    public function edit(Announcement $announcement): Response
    {
        $journal = app('currentJournal');

        // Ensure announcement belongs to current journal
        if ($announcement->journal_id !== $journal->id) {
            abort(403);
        }

        return Inertia::render('admin/announcements/edit', [
            'announcement' => $announcement,
            'types' => Announcement::TYPES,
        ]);
    }

    /**
     * Update the specified announcement.
     */
    public function update(UpdateAnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $journal = app('currentJournal');

        // Ensure announcement belongs to current journal
        if ($announcement->journal_id !== $journal->id) {
            abort(403);
        }

        $data = $request->validated();

        // Auto-set published_at when publishing for the first time
        if (($data['is_published'] ?? false) && ! $announcement->is_published && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $announcement->update($data);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement updated successfully.');
    }

    /**
     * Remove the specified announcement.
     */
    public function destroy(Announcement $announcement): RedirectResponse
    {
        $journal = app('currentJournal');

        // Ensure announcement belongs to current journal
        if ($announcement->journal_id !== $journal->id) {
            abort(403);
        }

        $announcement->delete();

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', 'Announcement deleted successfully.');
    }
}
