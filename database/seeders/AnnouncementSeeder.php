<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Journal;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $journals = Journal::all();
        $adminUsers = User::whereIn('role', ['super_admin', 'managing_editor', 'editor_in_chief'])->get();

        if ($journals->isEmpty() || $adminUsers->isEmpty()) {
            $this->command->warn('No journals or admin users found. Skipping announcement seeding.');

            return;
        }

        foreach ($journals as $journal) {
            $author = $adminUsers->random();

            // Create a few published, pinned announcements
            Announcement::factory()
                ->count(2)
                ->published()
                ->pinned()
                ->forJournal($journal)
                ->byAuthor($author)
                ->create();

            // Create published general announcements
            Announcement::factory()
                ->count(3)
                ->published()
                ->forJournal($journal)
                ->byAuthor($author)
                ->create();

            // Create a call for papers
            Announcement::factory()
                ->published()
                ->callForPapers()
                ->forJournal($journal)
                ->byAuthor($author)
                ->create();

            // Create an event announcement
            Announcement::factory()
                ->published()
                ->event()
                ->forJournal($journal)
                ->byAuthor($author)
                ->create();

            // Create a couple of drafts
            Announcement::factory()
                ->count(2)
                ->draft()
                ->forJournal($journal)
                ->byAuthor($author)
                ->create();

            // Create an expired announcement
            Announcement::factory()
                ->expired()
                ->forJournal($journal)
                ->byAuthor($author)
                ->create();
        }
    }
}
