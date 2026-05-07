<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Institution extends Model
{
    use HasFactory, Sluggable, SluggableScopeHelpers;

    protected $fillable = [
        'name',
        'slug',
        'domain',
        'abbreviation',
        'logo_path',
        'address',
        'contact_email',
        'website',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Return the sluggable configuration array for this model.
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
                'maxLength' => 100,
                'maxLengthKeepWords' => true,
                'onUpdate' => false,
            ],
        ];
    }

    /**
     * Get all journals belonging to this institution.
     */
    public function journals(): HasMany
    {
        return $this->hasMany(Journal::class);
    }

    /**
     * Get all users belonging to this institution (primary).
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get all users associated with this institution (including non-primary).
     */
    public function allUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'institution_user')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    /**
     * Get the institution's logo URL.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo_path) {
            return null;
        }

        return Storage::url($this->logo_path);
    }

    /**
     * Scope a query to only include active institutions.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the institution's contact phone.
     */
    public function getContactPhoneAttribute(): ?string
    {
        return $this->settings['contact_phone'] ?? null;
    }

    /**
     * Get the institution's address.
     */
    public function getAddressAttribute(): ?string
    {
        return $this->settings['address'] ?? $this->getRawOriginal('address');
    }

    /**
     * Get the institution's ISSN.
     */
    public function getIssnAttribute(): ?string
    {
        return $this->settings['issn'] ?? null;
    }

    /**
     * Get the default journal frequency.
     */
    public function getDefaultFrequencyAttribute(): string
    {
        return $this->settings['frequency'] ?? 'Bi-annual';
    }

    /**
     * Get the default language.
     */
    public function getDefaultLanguageAttribute(): string
    {
        return $this->settings['language'] ?? 'English';
    }

    /**
     * Get a setting value.
     */
    public function getSetting(string $key, mixed $default = null): mixed
    {
        return data_get($this->settings, $key, $default);
    }
}
