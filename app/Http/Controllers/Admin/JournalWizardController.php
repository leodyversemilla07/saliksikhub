<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use App\Models\Journal;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JournalWizardController extends Controller
{
    /**
     * Show the onboarding wizard.
     */
    public function index(): Response
    {
        $institutions = Institution::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'abbreviation', 'logo_url']);

        // Get available editors for team step
        $editors = User::role(['managing_editor', 'editor_in_chief', 'associate_editor'])
            ->select(['id', 'firstname', 'lastname', 'email', 'avatar_url'])
            ->orderBy('lastname')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => "{$user->firstname} {$user->lastname}",
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
            ]);

        return Inertia::render('admin/journals/onboarding', [
            'institutions' => $institutions,
            'editors' => $editors,
            'defaultTheme' => Journal::getDefaultThemeSettings(),
        ]);
    }

    /**
     * Store the journal from the onboarding wizard.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Step 1: Basic
            'institution_id' => ['required', 'exists:institutions,id'],
            'name' => ['required', 'string', 'max:255'],
            'abbreviation' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:2000'],
            'issn' => ['nullable', 'string', 'max:20'],
            'eissn' => ['nullable', 'string', 'max:20'],
            'publication_frequency' => ['nullable', 'string', 'max:100'],

            // Step 2: Branding
            'logo' => ['nullable', 'image', 'max:2048'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'theme_settings' => ['nullable', 'array'],
            'theme_settings.colors' => ['nullable', 'array'],
            'theme_settings.colors.primary' => ['nullable', 'string', 'max:7'],

            // Step 3: Policies
            'submission_guidelines' => ['nullable', 'string'],
            'review_policy' => ['nullable', 'string'],
            'open_access' => ['boolean'],
            'peer_reviewed' => ['boolean'],

            // Step 4: Team
            'team' => ['nullable', 'array'],
            'team.*.user_id' => ['nullable', 'exists:users,id'],
            'team.*.role' => ['nullable', 'string', 'in:managing_editor,editor_in_chief,associate_editor'],
        ]);

        try {
            DB::beginTransaction();

            // Merge settings into the settings JSON column
            $settings = [
                'open_access' => $validated['open_access'] ?? true,
                'peer_reviewed' => $validated['peer_reviewed'] ?? true,
                'submission_guidelines' => $validated['submission_guidelines'] ?? null,
                'review_policy' => $validated['review_policy'] ?? null,
                'publication_frequency' => $validated['publication_frequency'] ?? null,
            ];

            $data = [
                'institution_id' => $validated['institution_id'],
                'name' => $validated['name'],
                'abbreviation' => $validated['abbreviation'],
                'description' => $validated['description'] ?? null,
                'issn' => $validated['issn'] ?? null,
                'eissn' => $validated['eissn'] ?? null,
                'settings' => $settings,
                'theme_settings' => $validated['theme_settings'] ?? Journal::getDefaultThemeSettings(),
                'is_active' => true,
            ];

            // Handle logo upload
            if ($request->hasFile('logo')) {
                $data['logo_path'] = $request->file('logo')->store('journals/logos', 'public');
            }

            // Handle cover image upload
            if ($request->hasFile('cover_image')) {
                $data['cover_image_path'] = $request->file('cover_image')->store('journals/covers', 'public');
            }

            $journal = Journal::create($data);

            // Assign team members
            if (! empty($validated['team'])) {
                $teamData = [];
                foreach ($validated['team'] as $member) {
                    if (! empty($member['user_id']) && ! empty($member['role'])) {
                        $teamData[$member['user_id']] = [
                            'role' => $member['role'],
                            'is_active' => true,
                            'assigned_at' => now(),
                        ];
                    }
                }

                if (! empty($teamData)) {
                    $journal->users()->syncWithoutDetaching($teamData);
                }
            }

            DB::commit();

            return redirect()
                ->route('admin.journals.onboarding.complete', $journal)
                ->with('success', "Journal \"{$journal->name}\" created successfully! 🎉");
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Failed to create journal: '.$e->getMessage());
        }
    }

    /**
     * Show the onboarding complete/success page.
     */
    public function complete(Journal $journal): Response
    {
        $journal->load('institution');

        return Inertia::render('admin/journals/onboarding-complete', [
            'journal' => [
                'id' => $journal->id,
                'name' => $journal->name,
                'slug' => $journal->slug,
                'abbreviation' => $journal->abbreviation,
                'issn' => $journal->issn,
                'eissn' => $journal->eissn,
                'logo_url' => $journal->logo_path ? \Storage::url($journal->logo_path) : null,
                'institution' => $journal->institution ? [
                    'name' => $journal->institution->name,
                    'abbreviation' => $journal->institution->abbreviation,
                ] : null,
                'public_url' => url('/journals/'.$journal->slug),
                'admin_url' => route('admin.journals.settings.edit', $journal),
                'submission_url' => route('admin.journals.index'),
                'team_size' => $journal->users()->count(),
            ],
            'nextSteps' => [
                [
                    'title' => 'Customize Theme',
                    'description' => 'Set your journal\'s colors, fonts, and layout to match your institution\'s branding.',
                    'action' => 'Go to Theme Settings',
                    'url' => route('admin.journals.cms.theme.edit', $journal),
                    'icon' => 'Palette',
                ],
                [
                    'title' => 'Set Up CMS Pages',
                    'description' => 'Create custom pages like "About", "Editorial Board", and "Contact" for your journal.',
                    'action' => 'Manage Pages',
                    'url' => route('admin.journals.cms.pages.index', $journal),
                    'icon' => 'FileText',
                ],
                [
                    'title' => 'Configure Plugins',
                    'description' => 'Enable plugins for citation tools, announcements, and sidebar widgets.',
                    'action' => 'Manage Plugins',
                    'url' => route('admin.journals.settings.edit', $journal).'#plugins',
                    'icon' => 'Puzzle',
                ],
                [
                    'title' => 'Create First Issue',
                    'description' => 'Set up your first journal issue and start accepting submissions.',
                    'action' => 'Create Issue',
                    'url' => route('issues.create'),
                    'icon' => 'BookOpen',
                ],
                [
                    'title' => 'Review Submission Settings',
                    'description' => 'Fine-tune submission guidelines, review policies, and author instructions.',
                    'action' => 'Journal Settings',
                    'url' => route('admin.journals.settings.edit', $journal),
                    'icon' => 'Settings',
                ],
            ],
        ]);
    }
}
