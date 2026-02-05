<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_type_id',
        'user_id',
        'institution_id',
        'date_start',
        'date_end',
        'status',
        'ip_ranges',
        'domain',
        'payment_id',
        'auto_renew',
        'renewal_reminder_sent_at',
        'notes',
    ];

    protected $casts = [
        'date_start' => 'date',
        'date_end' => 'date',
        'ip_ranges' => 'array',
        'auto_renew' => 'boolean',
        'renewal_reminder_sent_at' => 'datetime',
    ];

    /**
     * Get the subscription type.
     */
    public function subscriptionType(): BelongsTo
    {
        return $this->belongsTo(SubscriptionType::class);
    }

    /**
     * Get the user (for individual subscriptions).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the institution (for institutional subscriptions).
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Get the payment record.
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * Check if subscription is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active'
            && $this->date_start <= today()
            && $this->date_end >= today();
    }

    /**
     * Check if subscription is expired.
     */
    public function isExpired(): bool
    {
        return $this->date_end < today() || $this->status === 'expired';
    }

    /**
     * Check if subscription expires soon (within 30 days).
     */
    public function expiresSoon(): bool
    {
        return $this->date_end->diffInDays(today()) <= 30
            && !$this->isExpired();
    }

    /**
     * Get days until expiration.
     */
    public function daysUntilExpiration(): int
    {
        return max(0, today()->diffInDays($this->date_end, false));
    }

    /**
     * Renew subscription.
     */
    public function renew(int $months = null): bool
    {
        $months = $months ?? $this->subscriptionType->duration_months;
        
        $this->date_start = $this->date_end->addDay();
        $this->date_end = $this->date_start->copy()->addMonths($months);
        $this->status = 'active';
        $this->renewal_reminder_sent_at = null;
        
        return $this->save();
    }

    /**
     * Cancel subscription.
     */
    public function cancel(): bool
    {
        $this->status = 'cancelled';
        return $this->save();
    }

    /**
     * Check if user IP is in allowed range (for institutional subscriptions).
     */
    public function isIpAllowed(string $ip): bool
    {
        if (!$this->ip_ranges) {
            return false;
        }

        foreach ($this->ip_ranges as $range) {
            if ($this->ipInRange($ip, $range)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if IP is in range.
     */
    private function ipInRange(string $ip, string $range): bool
    {
        if (str_contains($range, '/')) {
            // CIDR notation
            [$subnet, $mask] = explode('/', $range);
            $ip_long = ip2long($ip);
            $subnet_long = ip2long($subnet);
            $mask_long = -1 << (32 - (int)$mask);
            
            return ($ip_long & $mask_long) === ($subnet_long & $mask_long);
        } elseif (str_contains($range, '-')) {
            // IP range (e.g., 192.168.1.1-192.168.1.255)
            [$start, $end] = explode('-', $range);
            $ip_long = ip2long($ip);
            return $ip_long >= ip2long(trim($start)) && $ip_long <= ip2long(trim($end));
        } else {
            // Single IP
            return $ip === $range;
        }
    }

    /**
     * Scope to get active subscriptions.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('date_start', '<=', today())
            ->where('date_end', '>=', today());
    }

    /**
     * Scope to get expired subscriptions.
     */
    public function scopeExpired($query)
    {
        return $query->where(function ($q) {
            $q->where('date_end', '<', today())
                ->orWhere('status', 'expired');
        });
    }

    /**
     * Scope to get subscriptions expiring soon.
     */
    public function scopeExpiringSoon($query, int $days = 30)
    {
        return $query->where('status', 'active')
            ->whereBetween('date_end', [today(), today()->addDays($days)]);
    }

    /**
     * Scope to get subscriptions needing renewal reminders.
     */
    public function scopeNeedsRenewalReminder($query)
    {
        return $query->active()
            ->where('date_end', '<=', today()->addDays(30))
            ->where(function ($q) {
                $q->whereNull('renewal_reminder_sent_at')
                    ->orWhere('renewal_reminder_sent_at', '<', today()->subDays(7));
            });
    }
}
