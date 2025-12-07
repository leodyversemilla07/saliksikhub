<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JournalSettingsController extends Controller
{
    /**
     * Default settings schema with types and descriptions.
     */
    protected array $settingsSchema = [
        'appearance' => [
            'tagline' => ['type' => 'string', 'label' => 'Tagline', 'description' => 'Short tagline displayed below journal name'],
            'hero_title' => ['type' => 'string', 'label' => 'Hero Title', 'description' => 'Main title on the home page'],
            'hero_description' => ['type' => 'text', 'label' => 'Hero Description', 'description' => 'Description text on the home page'],
            'primary_color' => ['type' => 'color', 'label' => 'Primary Color', 'description' => 'Brand primary color'],
            'accent_color' => ['type' => 'color', 'label' => 'Accent Color', 'description' => 'Brand accent color'],
        ],
        'publication' => [
            'open_access' => ['type' => 'boolean', 'label' => 'Open Access', 'description' => 'Is this an open access journal?'],
            'peer_reviewed' => ['type' => 'boolean', 'label' => 'Peer Reviewed', 'description' => 'Is this a peer-reviewed journal?'],
            'disciplines' => ['type' => 'tags', 'label' => 'Disciplines', 'description' => 'Academic disciplines covered'],
            'article_types' => ['type' => 'tags', 'label' => 'Article Types', 'description' => 'Types of articles accepted'],
        ],
        'submission' => [
            'max_file_size_mb' => ['type' => 'number', 'label' => 'Max File Size (MB)', 'description' => 'Maximum upload file size in megabytes'],
            'allowed_file_types' => ['type' => 'tags', 'label' => 'Allowed File Types', 'description' => 'Allowed file extensions for uploads'],
            'require_cover_letter' => ['type' => 'boolean', 'label' => 'Require Cover Letter', 'description' => 'Require authors to submit a cover letter'],
            'require_abstract' => ['type' => 'boolean', 'label' => 'Require Abstract', 'description' => 'Require manuscripts to have an abstract'],
            'max_authors' => ['type' => 'number', 'label' => 'Max Authors', 'description' => 'Maximum number of authors allowed'],
        ],
        'review' => [
            'review_type' => ['type' => 'select', 'label' => 'Review Type', 'description' => 'Type of peer review', 'options' => ['single_blind', 'double_blind', 'open']],
            'min_reviewers' => ['type' => 'number', 'label' => 'Minimum Reviewers', 'description' => 'Minimum number of reviewers per manuscript'],
            'review_deadline_days' => ['type' => 'number', 'label' => 'Review Deadline (Days)', 'description' => 'Default deadline for reviews in days'],
            'allow_reviewer_comments_to_author' => ['type' => 'boolean', 'label' => 'Allow Reviewer Comments to Author', 'description' => 'Allow reviewers to send comments directly to authors'],
        ],
        'notifications' => [
            'notify_on_submission' => ['type' => 'boolean', 'label' => 'Notify on Submission', 'description' => 'Send email when new manuscript is submitted'],
            'notify_on_review_complete' => ['type' => 'boolean', 'label' => 'Notify on Review Complete', 'description' => 'Send email when review is completed'],
            'notify_on_decision' => ['type' => 'boolean', 'label' => 'Notify on Decision', 'description' => 'Send email when editorial decision is made'],
        ],
    ];

    /**
     * Show the journal settings form.
     */
    public function edit(Journal $journal): Response
    {
        return Inertia::render('admin/journals/settings', [
            'journal' => [
                'id' => $journal->id,
                'name' => $journal->name,
                'settings' => $journal->settings ?? [],
            ],
            'settingsSchema' => $this->settingsSchema,
        ]);
    }

    /**
     * Update journal settings.
     */
    public function update(Request $request, Journal $journal): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
        ]);

        // Merge with existing settings
        $currentSettings = $journal->settings ?? [];
        $newSettings = array_merge($currentSettings, $validated['settings']);

        $journal->update(['settings' => $newSettings]);

        return back()->with('success', 'Journal settings updated successfully.');
    }

    /**
     * Reset journal settings to defaults.
     */
    public function reset(Journal $journal): RedirectResponse
    {
        $journal->update(['settings' => []]);

        return back()->with('success', 'Journal settings reset to defaults.');
    }
}
