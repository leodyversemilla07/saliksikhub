<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Database\Factories\AnnouncementFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    /** @use HasFactory<AnnouncementFactory> */
    use HasFactory, Sluggable, SluggableScopeHelpers;

    public const TYPE_GENERAL = 'general';

    public const TYPE_CALL_FOR_PAPERS = 'call_for_papers';

    public const TYPE_EVENT = 'event';

    public const TYPE_MAINTENANCE = 'maintenance';

    public const TYPE_POLICY = 'policy';

    public const TYPES = [
        self::TYPE_GENERAL => 'General',
        self::TYPE_CALL_FOR_PAPERS => 'Call for Papers',
        self::TYPE_EVENT => 'Event',
        self::TYPE_MAINTENANCE => 'Maintenance',
        self::TYPE_POLICY => 'Policy Update',
    ];

    protected $fillable = [
        'journal_id',
        'user_id',
        'title',
        'slug',
        'content',
        'excerpt',
        'type',
        'is_pinned',
        'is_published',
        'published_at',
        'expires_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_pinned' => 'boolean',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Return the sluggable configuration array for this model.
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'maxLength' => 100,
            ],
        ];
    }

    /**
     * Get the journal that owns the announcement.
     */
    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    /**
     * Get the user who created the announcement.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope to published announcements.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->where(function (Builder $q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Scope to a specific journal.
     */
    public function scopeForJournal(Builder $query, int $journalId): Builder
    {
        return $query->where('journal_id', $journalId);
    }

    /**
     * Scope ordered by pinned first, then latest.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('is_pinned')->latest('published_at');
    }

    /**
     * Check if the announcement has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }
}
