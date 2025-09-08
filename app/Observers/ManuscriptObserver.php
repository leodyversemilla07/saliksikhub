<?php

namespace App\Observers;

use App\Models\Manuscript;
use App\Models\ManuscriptRevision;
use App\Models\User;
use App\Notifications\ManuscriptRevisionSubmitted;
use App\Notifications\ManuscriptSubmitted;

class ManuscriptObserver
{
    public function created(Manuscript $manuscript): void
    {
        // Notify editors when a new manuscript is submitted
        $editors = User::role(['managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor'])->get();
        foreach ($editors as $editor) {
            $editor->notify(new ManuscriptSubmitted($manuscript));
        }
    }

    public function updated(Manuscript $manuscript): void
    {
        // If a revision was submitted, create a revision record and notify editors
        if ($manuscript->wasChanged('revision_history') || $manuscript->wasChanged('revised_at')) {
            // Create a revision row if last revision exists in the history
            $history = $manuscript->revision_history ?? [];
            $last = \Illuminate\Support\Arr::last($history);
            if ($last) {
                ManuscriptRevision::create([
                    'manuscript_id' => $manuscript->id,
                    'version' => $last['version'] ?? 1,
                    'previous_status' => $last['previous_status'] ?? null,
                    'manuscript_path' => $last['manuscript_path'] ?? null,
                    'submitted_at' => $last['submitted_at'] ?? now(),
                    'comments' => $last['comments'] ?? null,
                    'user_id' => $manuscript->user_id,
                ]);

                $editors = User::role(['managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor'])->get();
                foreach ($editors as $editor) {
                    $editor->notify(new ManuscriptRevisionSubmitted($manuscript));
                }
            }
        }
    }
}
