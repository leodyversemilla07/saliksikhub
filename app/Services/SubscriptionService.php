<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\SubscriptionType;
use App\Models\User;
use App\Notifications\SubscriptionRenewalReminder;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class SubscriptionService
{
    /**
     * Create a new subscription
     */
    public function createSubscription(
        SubscriptionType $type,
        User $user,
        Carbon $startDate,
        ?Carbon $endDate = null,
        bool $autoRenew = false,
        ?array $ipRanges = null
    ): Subscription {
        // Calculate end date if not provided
        if (! $endDate) {
            $endDate = $this->calculateEndDate($startDate, $type->duration_months);
        }

        return Subscription::create([
            'subscription_type_id' => $type->id,
            'user_id' => $user->id,
            'date_start' => $startDate,
            'date_end' => $endDate,
            'status' => 'active',
            'auto_renew' => $autoRenew,
            'ip_ranges' => $ipRanges,
        ]);
    }

    /**
     * Renew an existing subscription
     */
    public function renewSubscription(Subscription $subscription, ?int $durationMonths = null): Subscription
    {
        $duration = $durationMonths ?? $subscription->subscriptionType->duration_months;

        // Calculate new dates
        $startDate = $subscription->date_end->isFuture()
            ? $subscription->date_end->addDay()
            : now();

        $endDate = $this->calculateEndDate($startDate, $duration);

        $subscription->update([
            'date_start' => $startDate,
            'date_end' => $endDate,
            'status' => 'active',
            'renewal_reminder_sent_at' => null,
        ]);

        return $subscription->fresh();
    }

    /**
     * Cancel a subscription
     */
    public function cancelSubscription(Subscription $subscription, bool $immediate = false): Subscription
    {
        if ($immediate) {
            $subscription->update([
                'status' => 'cancelled',
                'date_end' => now(),
            ]);
        } else {
            // Cancel at end of period
            $subscription->update([
                'status' => 'cancelled',
                'auto_renew' => false,
            ]);
        }

        return $subscription;
    }

    /**
     * Suspend a subscription
     */
    public function suspendSubscription(Subscription $subscription, ?string $reason = null): Subscription
    {
        $subscription->update([
            'status' => 'suspended',
        ]);

        return $subscription;
    }

    /**
     * Reactivate a suspended subscription
     */
    public function reactivateSubscription(Subscription $subscription): Subscription
    {
        if ($subscription->status !== 'suspended') {
            throw new InvalidArgumentException('Only suspended subscriptions can be reactivated');
        }

        if ($subscription->date_end->isPast()) {
            throw new InvalidArgumentException('Cannot reactivate expired subscription. Please renew instead.');
        }

        $subscription->update([
            'status' => 'active',
        ]);

        return $subscription;
    }

    /**
     * Check if IP address has access
     */
    public function checkIpAccess(Subscription $subscription, string $ipAddress): bool
    {
        // Check if subscription is active
        if ($subscription->status !== 'active') {
            return false;
        }

        // Check if subscription is within valid dates
        if (! $subscription->isActive()) {
            return false;
        }

        // Check IP ranges
        $ipRanges = $subscription->ip_ranges;

        if (empty($ipRanges)) {
            return false; // No IP ranges configured
        }

        foreach ($ipRanges as $range) {
            if ($this->ipInRange($ipAddress, $range)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if IP is in range
     */
    protected function ipInRange(string $ip, string $range): bool
    {
        // Handle CIDR notation (e.g., 192.168.1.0/24)
        if (strpos($range, '/') !== false) {
            [$subnet, $bits] = explode('/', $range);

            $ipLong = ip2long($ip);
            $subnetLong = ip2long($subnet);
            $mask = -1 << (32 - $bits);

            return ($ipLong & $mask) === ($subnetLong & $mask);
        }

        // Handle range (e.g., 192.168.1.1-192.168.1.255)
        if (strpos($range, '-') !== false) {
            [$start, $end] = explode('-', $range);

            $ipLong = ip2long($ip);
            $startLong = ip2long(trim($start));
            $endLong = ip2long(trim($end));

            return $ipLong >= $startLong && $ipLong <= $endLong;
        }

        // Handle single IP
        return $ip === $range;
    }

    /**
     * Add IP range to subscription
     */
    public function addIpRange(Subscription $subscription, string $ipRange): Subscription
    {
        // Validate IP range format
        if (! $this->isValidIpRange($ipRange)) {
            throw new InvalidArgumentException('Invalid IP range format');
        }

        $ipRanges = $subscription->ip_ranges ?? [];

        if (! in_array($ipRange, $ipRanges)) {
            $ipRanges[] = $ipRange;
            $subscription->update(['ip_ranges' => $ipRanges]);
        }

        return $subscription;
    }

    /**
     * Remove IP range from subscription
     */
    public function removeIpRange(Subscription $subscription, string $ipRange): Subscription
    {
        $ipRanges = $subscription->ip_ranges ?? [];

        $ipRanges = array_values(array_filter($ipRanges, fn ($range) => $range !== $ipRange));

        $subscription->update(['ip_ranges' => $ipRanges]);

        return $subscription;
    }

    /**
     * Validate IP range format
     */
    protected function isValidIpRange(string $range): bool
    {
        // CIDR notation
        if (strpos($range, '/') !== false) {
            [$ip, $bits] = explode('/', $range);

            return filter_var($ip, FILTER_VALIDATE_IP) !== false && is_numeric($bits) && $bits >= 0 && $bits <= 32;
        }

        // Range notation
        if (strpos($range, '-') !== false) {
            [$start, $end] = explode('-', $range);

            return filter_var(trim($start), FILTER_VALIDATE_IP) !== false &&
                   filter_var(trim($end), FILTER_VALIDATE_IP) !== false;
        }

        // Single IP
        return filter_var($range, FILTER_VALIDATE_IP) !== false;
    }

    /**
     * Get expiring subscriptions
     */
    public function getExpiringSubscriptions(int $daysBeforeExpiry = 30): Collection
    {
        $expiryDate = now()->addDays($daysBeforeExpiry);

        return Subscription::where('status', 'active')
            ->whereBetween('date_end', [now(), $expiryDate])
            ->whereNull('renewal_reminder_sent_at')
            ->with(['user', 'subscriptionType'])
            ->get();
    }

    /**
     * Send renewal reminder
     */
    public function sendRenewalReminder(Subscription $subscription): void
    {
        $subscription->load(['user', 'subscriptionType']);

        if ($subscription->user) {
            $subscription->user->notify(new SubscriptionRenewalReminder($subscription));
        }

        $subscription->update([
            'renewal_reminder_sent_at' => now(),
        ]);
    }

    /**
     * Process auto-renewal
     */
    public function processAutoRenewal(Subscription $subscription): bool
    {
        if (! $subscription->auto_renew) {
            return false;
        }

        if (! $subscription->isExpiringSoon(7)) {
            return false;
        }

        try {
            // Get payment amount
            $amount = (float) $subscription->subscriptionType->cost;

            // Create payment (would integrate with PaymentService)
            // $payment = app(PaymentService::class)->createSubscriptionPayment(
            //     $subscription,
            //     $subscription->user_id,
            //     $amount
            // );

            // For now, just renew if auto_renew is enabled
            $this->renewSubscription($subscription);

            return true;

        } catch (\Exception $e) {
            // Log error and send notification to user
            return false;
        }
    }

    /**
     * Expire old subscriptions
     */
    public function expireSubscriptions(): int
    {
        $expired = Subscription::where('status', 'active')
            ->where('date_end', '<', now())
            ->update(['status' => 'expired']);

        return $expired;
    }

    /**
     * Calculate end date based on duration
     */
    protected function calculateEndDate(Carbon $startDate, int $durationMonths): Carbon
    {
        return $startDate->copy()->addMonths($durationMonths)->subDay();
    }

    /**
     * Get subscription statistics
     */
    public function getSubscriptionStats(): array
    {
        $stats = Subscription::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $revenue = Subscription::where('status', 'active')
            ->join('subscription_types', 'subscriptions.subscription_type_id', '=', 'subscription_types.id')
            ->sum('subscription_types.cost');

        return [
            'active' => $stats['active'] ?? 0,
            'expired' => $stats['expired'] ?? 0,
            'cancelled' => $stats['cancelled'] ?? 0,
            'suspended' => $stats['suspended'] ?? 0,
            'total' => array_sum($stats),
            'total_revenue' => $revenue,
            'expiring_soon' => $this->getExpiringSubscriptions(30)->count(),
        ];
    }

    /**
     * Create subscription type
     */
    public function createSubscriptionType(array $data): SubscriptionType
    {
        return SubscriptionType::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'cost' => $data['price'],
            'currency' => $data['currency'] ?? 'USD',
            'duration_months' => $data['duration_months'],
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    /**
     * Update subscription type
     */
    public function updateSubscriptionType(SubscriptionType $type, array $data): SubscriptionType
    {
        if (array_key_exists('price', $data)) {
            $data['cost'] = $data['price'];
            unset($data['price']);
        }
        unset($data['features']);

        $type->update(array_filter($data));

        return $type->fresh();
    }

    /**
     * Delete subscription type
     */
    public function deleteSubscriptionType(SubscriptionType $type): bool
    {
        // Check if there are active subscriptions
        $activeCount = $type->subscriptions()->where('status', 'active')->count();

        if ($activeCount > 0) {
            throw new InvalidArgumentException(
                "Cannot delete subscription type with {$activeCount} active subscription(s)"
            );
        }

        return $type->delete();
    }
}
