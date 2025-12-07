<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalMenu extends Model
{
    use HasFactory;

    protected $fillable = [
        'journal_id',
        'parent_id',
        'label',
        'url',
        'journal_page_id',
        'location',
        'order',
        'is_active',
        'open_in_new_tab',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_active' => 'boolean',
        'open_in_new_tab' => 'boolean',
    ];

    /**
     * Menu locations.
     */
    public const LOCATIONS = [
        'header' => 'Header Navigation',
        'footer' => 'Footer Navigation',
        'both' => 'Both Header & Footer',
    ];

    /**
     * Scope a query to only include menus for a given journal.
     */
    public function scopeForJournal($query, int $journalId)
    {
        return $query->where('journal_id', $journalId);
    }

    /**
     * Scope a query to only include active menu items.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include header menu items.
     */
    public function scopeHeader($query)
    {
        return $query->whereIn('location', ['header', 'both']);
    }

    /**
     * Scope a query to only include footer menu items.
     */
    public function scopeFooter($query)
    {
        return $query->whereIn('location', ['footer', 'both']);
    }

    /**
     * Scope a query to only include top-level menu items.
     */
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Get the journal that owns this menu item.
     */
    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    /**
     * Get the parent menu item.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(JournalMenu::class, 'parent_id');
    }

    /**
     * Get the child menu items.
     */
    public function children(): HasMany
    {
        return $this->hasMany(JournalMenu::class, 'parent_id')->orderBy('order');
    }

    /**
     * Get the linked page.
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(JournalPage::class, 'journal_page_id');
    }

    /**
     * Get the resolved URL for this menu item.
     */
    public function getResolvedUrlAttribute(): string
    {
        if ($this->url) {
            return $this->url;
        }

        if ($this->page) {
            return $this->page->url;
        }

        return '#';
    }

    /**
     * Check if this menu item has children.
     */
    public function hasChildren(): bool
    {
        return $this->children()->count() > 0;
    }

    /**
     * Get the nested menu structure for a journal.
     */
    public static function getMenuTree(int $journalId, string $location = 'header'): array
    {
        $query = self::forJournal($journalId)
            ->active()
            ->topLevel()
            ->orderBy('order');

        if ($location === 'header') {
            $query->header();
        } elseif ($location === 'footer') {
            $query->footer();
        }

        $items = $query->with(['children' => function ($q) {
            $q->active()->orderBy('order')->with('page');
        }, 'page'])->get();

        return $items->map(function ($item) {
            return [
                'id' => $item->id,
                'label' => $item->label,
                'url' => $item->resolved_url,
                'open_in_new_tab' => $item->open_in_new_tab,
                'children' => $item->children->map(function ($child) {
                    return [
                        'id' => $child->id,
                        'label' => $child->label,
                        'url' => $child->resolved_url,
                        'open_in_new_tab' => $child->open_in_new_tab,
                    ];
                })->toArray(),
            ];
        })->toArray();
    }
}
