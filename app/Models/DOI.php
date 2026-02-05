<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class DOI extends Model
{
    use HasFactory;

    protected $table = 'dois';

    protected $fillable = [
        'doiable_type',
        'doiable_id',
        'doi',
        'prefix',
        'suffix',
        'status',
        'registration_agency',
        'registered_at',
        'registration_response',
        'error_message',
        'retry_count',
        'metadata',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
        'metadata' => 'array',
        'retry_count' => 'integer',
    ];

    /**
     * Get the owning doiable model (Publication, Issue, etc.).
     */
    public function doiable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the full DOI URL.
     */
    public function getUrlAttribute(): string
    {
        return "https://doi.org/{$this->doi}";
    }

    /**
     * Check if DOI is registered.
     */
    public function isRegistered(): bool
    {
        return $this->status === 'deposited';
    }

    /**
     * Check if DOI has errors.
     */
    public function hasError(): bool
    {
        return $this->status === 'error';
    }

    /**
     * Check if DOI needs registration.
     */
    public function needsRegistration(): bool
    {
        return in_array($this->status, ['assigned', 'stale', 'error']);
    }

    /**
     * Mark DOI as queued for registration.
     */
    public function queue(): bool
    {
        $this->status = 'queued';
        return $this->save();
    }

    /**
     * Mark DOI as successfully deposited.
     */
    public function markAsDeposited(string $response = null): bool
    {
        $this->status = 'deposited';
        $this->registered_at = now();
        $this->registration_response = $response;
        $this->error_message = null;
        $this->retry_count = 0;
        
        return $this->save();
    }

    /**
     * Mark DOI as failed with error message.
     */
    public function markAsError(string $errorMessage): bool
    {
        $this->status = 'error';
        $this->error_message = $errorMessage;
        $this->retry_count++;
        
        return $this->save();
    }

    /**
     * Reset for re-registration.
     */
    public function resetForRetry(): bool
    {
        $this->status = 'assigned';
        $this->error_message = null;
        
        return $this->save();
    }

    /**
     * Scope to get DOIs that need registration.
     */
    public function scopeNeedsRegistration($query)
    {
        return $query->whereIn('status', ['assigned', 'stale', 'error'])
            ->where('retry_count', '<', 3);
    }

    /**
     * Scope to get registered DOIs.
     */
    public function scopeRegistered($query)
    {
        return $query->where('status', 'deposited');
    }

    /**
     * Scope to get DOIs by registration agency.
     */
    public function scopeByAgency($query, string $agency)
    {
        return $query->where('registration_agency', $agency);
    }

    /**
     * Generate DOI string from prefix and suffix.
     */
    public static function generateDoi(string $prefix, string $suffix): string
    {
        return "{$prefix}/{$suffix}";
    }

    /**
     * Parse DOI into prefix and suffix.
     */
    public static function parseDoi(string $doi): array
    {
        $parts = explode('/', $doi, 2);
        
        return [
            'prefix' => $parts[0] ?? '',
            'suffix' => $parts[1] ?? '',
        ];
    }
}
