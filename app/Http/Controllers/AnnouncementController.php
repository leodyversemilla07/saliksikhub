<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of published announcements for the current journal.
     */
    public function index(): Response
    {
        $journal = app('currentJournal');

        $announcements = Announcement::query()
            ->forJournal($journal->id)
            ->published()
            ->ordered()
            ->paginate(10);

        return Inertia::render('announcements', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Display a single announcement.
     */
    public function show(Announcement $announcement): Response
    {
        $journal = app('currentJournal');

        // Ensure announcement belongs to current journal and is published
        if ($announcement->journal_id !== $journal->id || ! $announcement->is_published || $announcement->isExpired()) {
            abort(404);
        }

        $announcement->load('author:id,name');

        return Inertia::render('announcement-show', [
            'announcement' => $announcement,
        ]);
    }
}
