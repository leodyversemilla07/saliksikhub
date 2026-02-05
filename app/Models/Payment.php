<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'manuscript_id',
        'payment_type',
        'amount',
        'currency',
        'status',
        'payment_gateway',
        'transaction_id',
        'gateway_response',
        'payment_method',
        'paid_at',
        'refunded_at',
        'expires_at',
        'description',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'refunded_at' => 'datetime',
        'expires_at' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Get the user who made the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the manuscript this payment is for (if applicable).
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Check if payment is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed' && $this->paid_at !== null;
    }

    /**
     * Check if payment is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if payment has failed.
     */
    public function hasFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Check if payment is refunded.
     */
    public function isRefunded(): bool
    {
        return $this->status === 'refunded' && $this->refunded_at !== null;
    }

    /**
     * Check if payment has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast() && $this->isPending();
    }

    /**
     * Mark payment as completed.
     */
    public function markAsCompleted(string $transactionId = null, string $gatewayResponse = null): bool
    {
        $this->status = 'completed';
        $this->paid_at = now();
        
        if ($transactionId) {
            $this->transaction_id = $transactionId;
        }
        
        if ($gatewayResponse) {
            $this->gateway_response = $gatewayResponse;
        }
        
        return $this->save();
    }

    /**
     * Mark payment as failed.
     */
    public function markAsFailed(string $gatewayResponse = null): bool
    {
        $this->status = 'failed';
        
        if ($gatewayResponse) {
            $this->gateway_response = $gatewayResponse;
        }
        
        return $this->save();
    }

    /**
     * Refund payment.
     */
    public function refund(string $reason = null): bool
    {
        if (!$this->isCompleted()) {
            return false;
        }

        $this->status = 'refunded';
        $this->refunded_at = now();
        
        if ($reason) {
            $this->notes = ($this->notes ? $this->notes . "\n\n" : '') . "Refund reason: {$reason}";
        }
        
        return $this->save();
    }

    /**
     * Cancel payment.
     */
    public function cancel(): bool
    {
        if (!$this->isPending()) {
            return false;
        }

        $this->status = 'cancelled';
        return $this->save();
    }

    /**
     * Get formatted amount.
     */
    public function getFormattedAmountAttribute(): string
    {
        return $this->currency . ' ' . number_format($this->amount, 2);
    }

    /**
     * Get payment type label.
     */
    public function getPaymentTypeLabelAttribute(): string
    {
        return match($this->payment_type) {
            'submission_fee' => 'Submission Fee',
            'publication_charge' => 'Publication Charge',
            'subscription_fee' => 'Subscription Fee',
            'page_charge' => 'Page Charge',
            'color_charge' => 'Color Charge',
            default => 'Other',
        };
    }

    /**
     * Scope to get completed payments.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope to get pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get failed payments.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Scope to get refunded payments.
     */
    public function scopeRefunded($query)
    {
        return $query->where('status', 'refunded');
    }

    /**
     * Scope to get expired payments.
     */
    public function scopeExpired($query)
    {
        return $query->where('status', 'pending')
            ->where('expires_at', '<', now());
    }

    /**
     * Scope to filter by payment type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('payment_type', $type);
    }
}
