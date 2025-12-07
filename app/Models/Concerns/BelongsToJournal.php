<?php

namespace App\Models\Concerns;

use App\Models\Journal;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Trait for models that belong to a specific journal (tenant).
 *
 * This trait provides:
 * - Automatic global scoping to the current journal context
 * - Auto-assignment of journal_id on model creation
 * - Helper methods for querying across journals
 *
 * @mixin Model
 */
trait BelongsToJournal
{
    /**
     * Boot the trait.
     */
    protected static function bootBelongsToJournal(): void
    {
        // Auto-scope queries to current journal (only if context is available)
        static::addGlobalScope('journal', function (Builder $query) {
            if (app()->bound('currentJournal') && $journal = app('currentJournal')) {
                $query->where($query->getModel()->getTable().'.journal_id', $journal->id);
            }
        });

        // Auto-set journal_id on create (only if context is available)
        static::creating(function (Model $model) {
            if (app()->bound('currentJournal') && $journal = app('currentJournal')) {
                $model->journal_id ??= $journal->id;
            }
        });
    }

    /**
     * Initialize the trait.
     */
    public function initializeBelongsToJournal(): void
    {
        // Ensure journal_id is fillable
        if (! in_array('journal_id', $this->fillable)) {
            $this->fillable[] = 'journal_id';
        }
    }

    /**
     * Get the journal that this model belongs to.
     */
    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    /**
     * Scope a query to a specific journal, bypassing the global scope.
     */
    public function scopeForJournal(Builder $query, Journal|int $journal): Builder
    {
        $journalId = $journal instanceof Journal ? $journal->id : $journal;

        return $query->withoutGlobalScope('journal')->where('journal_id', $journalId);
    }

    /**
     * Scope a query to include all journals (bypass global scope).
     */
    public function scopeWithoutJournalScope(Builder $query): Builder
    {
        return $query->withoutGlobalScope('journal');
    }

    /**
     * Scope a query to multiple journals.
     */
    public function scopeForJournals(Builder $query, array $journalIds): Builder
    {
        return $query->withoutGlobalScope('journal')->whereIn('journal_id', $journalIds);
    }

    /**
     * Check if this model belongs to the given journal.
     */
    public function belongsToJournal(Journal|int $journal): bool
    {
        $journalId = $journal instanceof Journal ? $journal->id : $journal;

        return $this->journal_id === $journalId;
    }

    /**
     * Check if this model belongs to the current journal context.
     */
    public function belongsToCurrentJournal(): bool
    {
        $currentJournal = app('currentJournal');

        if (! $currentJournal) {
            return true; // No context means no restriction
        }

        return $this->journal_id === $currentJournal->id;
    }
}
