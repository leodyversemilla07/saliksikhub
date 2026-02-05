<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class OAIRecord extends Model
{
    protected $table = 'oai_records';

    protected $fillable = [
        'identifier',
        'datestamp',
        'set_spec',
        'recordable_type',
        'recordable_id',
        'metadata_format',
        'metadata',
        'deleted',
    ];

    protected $casts = [
        'datestamp' => 'datetime',
        'deleted' => 'boolean',
    ];

    /**
     * Get the owning recordable model (Publication, Issue, etc.)
     */
    public function recordable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope to get non-deleted records
     */
    public function scopeActive($query)
    {
        return $query->where('deleted', false);
    }

    /**
     * Scope to filter by set
     */
    public function scopeInSet($query, string $setSpec)
    {
        return $query->where('set_spec', $setSpec);
    }

    /**
     * Scope to filter by date range
     */
    public function scopeFromDate($query, $from)
    {
        return $query->where('datestamp', '>=', $from);
    }

    public function scopeUntilDate($query, $until)
    {
        return $query->where('datestamp', '<=', $until);
    }
}
