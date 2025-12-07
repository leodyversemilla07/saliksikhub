<?php

namespace App\Models\Concerns;

use App\Models\Institution;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Trait for models that belong to a specific institution.
 *
 * @mixin Model
 */
trait BelongsToInstitution
{
    /**
     * Boot the trait.
     */
    protected static function bootBelongsToInstitution(): void
    {
        // Auto-set institution_id on create (only if context is available)
        static::creating(function (Model $model) {
            if (app()->bound('currentInstitution') && $institution = app('currentInstitution')) {
                $model->institution_id ??= $institution->id;
            }
        });
    }

    /**
     * Initialize the trait.
     */
    public function initializeBelongsToInstitution(): void
    {
        // Ensure institution_id is fillable
        if (! in_array('institution_id', $this->fillable)) {
            $this->fillable[] = 'institution_id';
        }
    }

    /**
     * Get the institution that this model belongs to.
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Scope a query to a specific institution.
     */
    public function scopeForInstitution(Builder $query, Institution|int $institution): Builder
    {
        $institutionId = $institution instanceof Institution ? $institution->id : $institution;

        return $query->where('institution_id', $institutionId);
    }

    /**
     * Check if this model belongs to the given institution.
     */
    public function belongsToInstitution(Institution|int $institution): bool
    {
        $institutionId = $institution instanceof Institution ? $institution->id : $institution;

        return $this->institution_id === $institutionId;
    }
}
