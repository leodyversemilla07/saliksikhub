<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Plugin extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'version',
        'author',
        'description',
        'path',
        'is_global',
        'enabled',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_global' => 'boolean',
        'enabled' => 'boolean',
    ];

    /**
     * Get the journals that have this plugin enabled.
     */
    public function journals(): BelongsToMany
    {
        return $this->belongsToMany(Journal::class, 'journal_plugins')
            ->withPivot('enabled', 'settings')
            ->withTimestamps();
    }

    /**
     * Check if plugin is active for a specific journal.
     */
    public function isActiveForJournal(int $journalId): bool
    {
        if ($this->enabled && $this->is_global) {
            return true;
        }

        return $this->journals()
            ->where('journal_id', $journalId)
            ->wherePivot('enabled', true)
            ->exists();
    }

    /**
     * Get settings for a specific journal.
     */
    public function getSettingsForJournal(int $journalId): array
    {
        $pivot = $this->journals()
            ->where('journal_id', $journalId)
            ->first()?->pivot;

        $settings = $pivot?->settings;

        if (is_string($settings)) {
            $decoded = json_decode($settings, true);

            return is_array($decoded) ? $decoded : [];
        }

        return $settings ?? $this->settings ?? [];
    }
}
