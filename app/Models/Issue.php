<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Issue extends Model
{
    use HasFactory;

    // Journal Issue Status Constants    
    const STATUS_DRAFT = 'draft';
    const STATUS_IN_REVIEW = 'in_review';
    const STATUS_PUBLISHED = 'published';
    const STATUS_ARCHIVED = 'archived';

    public const STATUSES = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_IN_REVIEW => 'In Review',
        self::STATUS_PUBLISHED => 'Published',
        self::STATUS_ARCHIVED => 'Archived',
    ];    
    
    protected $fillable = [
        'volume_number',
        'issue_number',
        'issue_title',
        'description',
        'publication_date',
        'status',
        'cover_image',
        'doi',
        'theme',
        'editorial_note',
        'user_id',
    ];

    protected $casts = [
        'publication_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who created this journal issue (usually an editor).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all manuscripts assigned to this journal issue.
     */
    public function manuscripts(): HasMany
    {
        return $this->hasMany(Manuscript::class);
    }

    /**
     * Get the related manuscript (for single manuscript reference).
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Get all comments for this issue.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(IssueComment::class);
    }

    /**
     * Check if the issue is published.
     */
    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    /**
     * Check if the issue is in draft status.
     */
    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /**
     * Get formatted volume and issue number.
     */
    public function getFormattedVolumeIssueAttribute(): string
    {
        return "Vol. {$this->volume_number}, No. {$this->issue_number}";
    }

    /**
     * Get the issue DOI URL.
     */
    public function getDoiUrlAttribute(): ?string
    {
        return $this->doi ? "https://doi.org/{$this->doi}" : null;
    }

    /**
     * Scope for published issues.
     */
    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }

    /**
     * Scope for issues by volume.
     */
    public function scopeByVolume($query, $volume)
    {
        return $query->where('volume_number', $volume);
    }

    /**
     * Get the latest volume number.
     */
    public static function getLatestVolume(): int
    {
        return self::max('volume_number') ?? 1;
    }    
    
    /**
     * Get the next issue number for a given volume.
     */
    public static function getNextIssueNumber(int $volume): int
    {
        return self::where('volume_number', $volume)->max('issue_number') + 1 ?? 1;
    }

    /**
     * Get the status color for UI display.
     */
    public function getStatusColor(): string
    {
        return match ($this->status) {
            self::STATUS_DRAFT => 'blue',
            self::STATUS_IN_REVIEW => 'yellow',
            self::STATUS_PUBLISHED => 'green',
            self::STATUS_ARCHIVED => 'gray',
            default => 'blue',
        };
    }

    /**
     * Scope to filter by status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get current year issues.
     */
    public function scopeCurrentYear($query)
    {
        return $query->whereYear('publication_date', now()->year);
    }    
    
    /**
     * Scope to order by volume and issue number.
     */
    public function scopeOrderedByVolumeIssue($query)
    {
        return $query->orderBy('volume_number', 'desc')->orderBy('issue_number', 'desc');
    }
}
