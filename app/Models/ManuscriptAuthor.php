<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManuscriptAuthor extends Model
{
    use HasFactory;

    protected $fillable = [
        'manuscript_id',
        'user_id',
        'author_order',
        'is_corresponding',
        'contribution_role',
    ];

    protected $casts = [
        'is_corresponding' => 'boolean',
        'contribution_role' => 'array',
        'author_order' => 'integer',
    ];

    /**
     * Get the manuscript
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Get the author (user)
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Check if this is the corresponding author
     */
    public function isCorrespondingAuthor(): bool
    {
        return $this->is_corresponding === true;
    }

    /**
     * Get formatted contribution roles
     */
    public function getFormattedContributions(): string
    {
        if (! $this->contribution_role || ! is_array($this->contribution_role)) {
            return '';
        }

        return implode(', ', $this->contribution_role);
    }

    /**
     * Scope: Corresponding authors only
     */
    public function scopeCorresponding($query)
    {
        return $query->where('is_corresponding', true);
    }

    /**
     * Scope: Order by author order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('author_order');
    }
}
