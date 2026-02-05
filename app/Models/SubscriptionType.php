<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionType extends Model
{
    use HasFactory;

    protected $fillable = [
        'journal_id',
        'name',
        'description',
        'cost',
        'currency',
        'duration_months',
        'subscription_type',
        'format_online',
        'format_print',
        'concurrent_users',
        'is_active',
        'sequence',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'duration_months' => 'integer',
        'format_online' => 'boolean',
        'format_print' => 'boolean',
        'concurrent_users' => 'integer',
        'is_active' => 'boolean',
        'sequence' => 'integer',
    ];

    /**
     * Get the journal that owns this subscription type.
     */
    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    /**
     * Get all subscriptions of this type.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Check if this is an institutional subscription type.
     */
    public function isInstitutional(): bool
    {
        return $this->subscription_type === 'institutional';
    }

    /**
     * Check if this is an individual subscription type.
     */
    public function isIndividual(): bool
    {
        return $this->subscription_type === 'individual';
    }

    /**
     * Get formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        return $this->currency . ' ' . number_format($this->cost, 2);
    }

    /**
     * Scope to get only active subscription types.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->orderBy('sequence');
    }

    /**
     * Scope to get institutional subscription types.
     */
    public function scopeInstitutional($query)
    {
        return $query->where('subscription_type', 'institutional');
    }

    /**
     * Scope to get individual subscription types.
     */
    public function scopeIndividual($query)
    {
        return $query->where('subscription_type', 'individual');
    }
}
