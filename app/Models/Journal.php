<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Journal extends Model
{
    use HasFactory, Sluggable, SluggableScopeHelpers;

    protected $fillable = [
        'institution_id',
        'name',
        'slug',
        'abbreviation',
        'description',
        'issn',
        'eissn',
        'logo_path',
        'cover_image_path',
        'submission_guidelines',
        'review_policy',
        'publication_frequency',
        'settings',
        'theme_settings',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'theme_settings' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Return the sluggable configuration array for this model.
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'abbreviation',
                'maxLength' => 50,
                'maxLengthKeepWords' => true,
                'onUpdate' => false,
            ],
        ];
    }

    /**
     * Get the institution that owns this journal.
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Get all manuscripts belonging to this journal.
     */
    public function manuscripts(): HasMany
    {
        return $this->hasMany(Manuscript::class);
    }

    /**
     * Get all issues belonging to this journal.
     */
    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }

    /**
     * Get all users assigned to this journal with roles.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'journal_user')
            ->withPivot(['role', 'is_active', 'assigned_at'])
            ->withTimestamps();
    }

    /**
     * Get users with a specific role in this journal.
     */
    public function usersWithRole(string $role): BelongsToMany
    {
        return $this->users()->wherePivot('role', $role)->wherePivot('is_active', true);
    }

    /**
     * Get the journal's logo URL.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo_path) {
            return $this->institution?->logo_url;
        }

        return Storage::url($this->logo_path);
    }

    /**
     * Get the journal's cover image URL.
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        if (! $this->cover_image_path) {
            return null;
        }

        return Storage::url($this->cover_image_path);
    }

    /**
     * Scope a query to only include active journals.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get a setting value from the settings JSON.
     */
    public function getSetting(string $key, mixed $default = null): mixed
    {
        return data_get($this->settings, $key, $default);
    }

    /**
     * Get a theme setting value.
     */
    public function getThemeSetting(string $key, mixed $default = null): mixed
    {
        return data_get($this->theme_settings, $key, $default);
    }

    /**
     * Get the pages for this journal.
     */
    public function pages(): HasMany
    {
        return $this->hasMany(JournalPage::class);
    }

    /**
     * Get the menu items for this journal.
     */
    public function menuItems(): HasMany
    {
        return $this->hasMany(JournalMenu::class);
    }

    /**
     * Get the header menu items.
     */
    public function headerMenu(): array
    {
        return JournalMenu::getMenuTree($this->id, 'header');
    }

    /**
     * Get the footer menu items.
     */
    public function footerMenu(): array
    {
        return JournalMenu::getMenuTree($this->id, 'footer');
    }

    /**
     * Get published pages for this journal.
     */
    public function publishedPages()
    {
        return $this->pages()->published()->orderBy('menu_order');
    }

    /**
     * Get the default theme settings.
     */
    public static function getDefaultThemeSettings(): array
    {
        return [
            'colors' => [
                'primary' => '#2563eb',        // Blue
                'primary_foreground' => '#ffffff',
                'secondary' => '#64748b',      // Slate
                'secondary_foreground' => '#ffffff',
                'accent' => '#f59e0b',         // Amber
                'background' => '#ffffff',
                'foreground' => '#0f172a',
                'muted' => '#f1f5f9',
                'muted_foreground' => '#64748b',
                'border' => '#e2e8f0',
            ],
            'typography' => [
                'font_family' => 'Inter',
                'heading_font' => 'Inter',
                'base_size' => '16px',
            ],
            'layout' => [
                'header_style' => 'default',   // default, centered, minimal
                'footer_style' => 'default',   // default, minimal, expanded
                'max_width' => '1280px',
            ],
            'branding' => [
                'show_institution_logo' => true,
                'show_journal_name' => true,
                'favicon' => null,
            ],
        ];
    }

    /**
     * Get merged theme settings with defaults.
     */
    public function getMergedThemeSettingsAttribute(): array
    {
        $defaults = self::getDefaultThemeSettings();

        return array_replace_recursive($defaults, $this->theme_settings ?? []);
    }
}
