<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalPage extends Model
{
    use HasFactory, Sluggable, SluggableScopeHelpers;

    protected $fillable = [
        'journal_id',
        'title',
        'slug',
        'type',
        'meta_description',
        'meta_keywords',
        'is_published',
        'show_in_menu',
        'menu_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'show_in_menu' => 'boolean',
        'menu_order' => 'integer',
    ];

    /**
     * Available page types.
     */
    public const TYPES = [
        'home' => 'Home Page',
        'about' => 'About',
        'editorial_board' => 'Editorial Board',
        'submission_guidelines' => 'Submission Guidelines',
        'contact' => 'Contact',
        'custom' => 'Custom Page',
    ];

    /**
     * Return the sluggable configuration array for this model.
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'maxLength' => 100,
                'maxLengthKeepWords' => true,
                'onUpdate' => false,
            ],
        ];
    }

    /**
     * Scope a query to only include pages for a given journal.
     */
    public function scopeForJournal($query, int $journalId)
    {
        return $query->where('journal_id', $journalId);
    }

    /**
     * Scope a query to only include published pages.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to only include menu-visible pages.
     */
    public function scopeInMenu($query)
    {
        return $query->where('show_in_menu', true)->orderBy('menu_order');
    }

    /**
     * Get the journal that owns this page.
     */
    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    /**
     * Get the sections for this page.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(JournalPageSection::class)->orderBy('order');
    }

    /**
     * Get the menu items that link to this page.
     */
    public function menuItems(): HasMany
    {
        return $this->hasMany(JournalMenu::class);
    }

    /**
     * Get the full URL for this page.
     */
    public function getUrlAttribute(): string
    {
        if ($this->type === 'home') {
            return '/';
        }

        return '/pages/'.$this->slug;
    }

    /**
     * Get visible sections for the page.
     */
    public function visibleSections(): HasMany
    {
        return $this->sections()->where('is_visible', true);
    }
}
