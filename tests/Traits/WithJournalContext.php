<?php

namespace Tests\Traits;

use App\Models\Institution;
use App\Models\Journal;

/**
 * Trait for handling journal context in tests.
 *
 * When testing with multi-tenancy enabled, you need to set the current journal context
 * for global scopes and role assignments to work correctly.
 */
trait WithJournalContext
{
    protected ?Institution $testInstitution = null;

    protected ?Journal $testJournal = null;

    /**
     * Set up a default journal context for tests.
     */
    protected function setUpJournalContext(): void
    {
        $this->testInstitution = Institution::factory()->create();
        $this->testJournal = Journal::factory()->forInstitution($this->testInstitution)->create();

        $this->setCurrentJournal($this->testJournal);
    }

    /**
     * Set the current journal context.
     */
    protected function setCurrentJournal(Journal $journal): void
    {
        app()->instance('currentJournal', $journal);
        app()->instance('currentInstitution', $journal->institution);
        setPermissionsTeamId($journal->id);
    }

    /**
     * Clear the journal context.
     */
    protected function clearJournalContext(): void
    {
        app()->forgetInstance('currentJournal');
        app()->forgetInstance('currentInstitution');
        setPermissionsTeamId(null);
    }

    /**
     * Get the test institution.
     */
    protected function getTestInstitution(): Institution
    {
        if (! $this->testInstitution) {
            $this->setUpJournalContext();
        }

        return $this->testInstitution;
    }

    /**
     * Get the test journal.
     */
    protected function getTestJournal(): Journal
    {
        if (! $this->testJournal) {
            $this->setUpJournalContext();
        }

        return $this->testJournal;
    }
}
