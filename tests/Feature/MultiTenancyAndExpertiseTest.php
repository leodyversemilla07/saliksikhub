<?php

namespace Tests\Feature;

use App\Models\Expertise;
use App\Models\Journal;
use App\Models\Manuscript;
use App\Models\User;
use App\Services\ReviewService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MultiTenancyAndExpertiseTest extends TestCase
{
    use RefreshDatabase;

    public function test_submissions_page_loads_with_journal_context()
    {
        // create a journal
        $journal = Journal::factory()->create([
            'name' => 'Test Journal of Science',
            'abbreviation' => 'TJS',
        ]);

        // create a user to simulate journal context (or we can just rely on the middleware if we set the host correctly,
        // but typically in feature tests we might need to set the current journal explicitly or mock the middleware if it depends on domain)
        // However, the route middleware 'journal' sets the context. Let's see how SetCurrentJournal works.
        // Usually it checks the domain. Since we are in a test, we might need to trick it or manually set the View share.

        // Let's assume the default journal seeded or created is accessible via a specific route or we simulate the hostname.
        // For simplicity, let's just create a journal and try to access the route.
        // If the middleware logic is robust, it might default to the first journal or fail if no domain matches.

        // Let's try to access the route directly. The SetCurrentJournal middleware might be bypassed or we might need to configure the request host.
        // Let's configure the app url to match the journal domain if possible, or just create a journal that matches 'localhost' or simply mock the share.

        // Actually, looking at the code, SetCurrentJournal usually sets `currentJournal` in Inertia share.

        $response = $this->get(route('submissions'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('submissions')
            ->has('currentJournal')
            ->has('currentInstitution')
        );
    }

    public function test_reviewer_expertise_matching_logic()
    {
        // 1. Create Expertises
        $aiExpertise = Expertise::create(['name' => 'Artificial Intelligence', 'slug' => 'ai']);
        $bioExpertise = Expertise::create(['name' => 'Biology', 'slug' => 'biology']);

        $journal = Journal::factory()->create();

        // 2. Create Reviewers with Journal context (team_id)
        $aiReviewer = User::factory()->create(['firstname' => 'AI', 'lastname' => 'Expert']);
        $aiReviewer->assignRole('reviewer', $journal->id); // Providing team/journal ID
        $aiReviewer->expertises()->attach($aiExpertise);

        $bioReviewer = User::factory()->create(['firstname' => 'Bio', 'lastname' => 'Expert']);
        $bioReviewer->assignRole('reviewer', $journal->id);
        $bioReviewer->expertises()->attach($bioExpertise);

        $generalReviewer = User::factory()->create(['firstname' => 'General', 'lastname' => 'Reviewer']);
        $generalReviewer->assignRole('reviewer', $journal->id);

        // 3. Create Manuscript with AI keywords
        $manuscript = Manuscript::factory()->create([
            'title' => 'Deep Learning in 2025',
            'keywords' => 'Artificial Intelligence, Machine Learning, Neural Networks',
            'user_id' => User::factory()->create()->id,
            'journal_id' => $journal->id, // Associate manuscript with journal
        ]);

        // 4. Use ReviewService to find reviewers
        // Since SetCurrentJournal middleware might not be active, we might need to set the context or the service might depend on manuscript's journal?
        // Let's check ReviewService implementation.
        // It filters by role 'reviewer'. If teams are enabled, finding users by role usually requires team context if not global.
        // However, User::role('reviewer') without parameters finds users with that role in ANY team or globally?
        // Spatie docs: $user->assignRole('role', $team_id);
        // User::role('role') might need adjustment if scoped.
        // But let's assume standard behavior for now.

        $reviewService = new ReviewService;
        $suitableReviewers = $reviewService->findSuitableReviewers($manuscript);

        // 5. Assertions
        // The AI reviewer should be top of the list or have a higher score
        $firstReviewer = $suitableReviewers->first();

        $this->assertEquals($aiReviewer->id, $firstReviewer->id, 'The AI reviewer should be the most suitable.');
        $this->assertTrue($firstReviewer->relevance_score > 0, 'Relevance score should be positive for matching expertise.');

        // Check Bio reviewer score (should be 0 or lower than AI)
        $bioReviewerInList = $suitableReviewers->where('id', $bioReviewer->id)->first();
        $this->assertTrue($firstReviewer->relevance_score > ($bioReviewerInList->relevance_score ?? 0));
    }

    public function test_assign_reviewers_page_displays_expertise_and_relevance()
    {
        // Create a journal
        $journal = Journal::factory()->create();

        // Create an editor
        $editor = User::factory()->create();
        $editor->assignRole('managing_editor', $journal->id);

        // Create a manuscript
        $manuscript = Manuscript::factory()->create([
            'title' => 'Test Manuscript',
            'keywords' => 'Computer Science',
            'journal_id' => $journal->id,
            'editor_id' => $editor->id, // Assign to editor
        ]);

        // Create a reviewer with expertise
        $expertise = Expertise::create(['name' => 'Computer Science', 'slug' => 'cs']);
        $reviewer = User::factory()->create(['firstname' => 'John', 'lastname' => 'Doe']);
        $reviewer->assignRole('reviewer', $journal->id);
        $reviewer->expertises()->attach($expertise);

        // Mock the currentJournal in the container
        app()->bind('currentJournal', fn() => $journal);

        // Act as editor
        $response = $this->actingAs($editor)->get(route('editor.manuscripts.assign_reviewers', $manuscript->id));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('editor/assign-reviewers')
            ->has('suitable_reviewers', 1)
            ->where('suitable_reviewers.0.id', $reviewer->id)
            ->where('suitable_reviewers.0.relevance_score', fn ($score) => $score > 0)
            ->where('suitable_reviewers.0.expertises.0', 'Computer Science')
        );
    }
}
