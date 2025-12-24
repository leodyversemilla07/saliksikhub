<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProofCorrection extends Model
{
    use HasFactory;

    protected $fillable = [
        'manuscript_id',
        'proof_round',
        'proof_file_path',
        'sent_to_author_at',
        'author_responded_at',
        'author_corrections',
        'status',
        'corrected_proof_path',
        'completed_at',
    ];

    protected $casts = [
        'sent_to_author_at' => 'datetime',
        'author_responded_at' => 'datetime',
        'completed_at' => 'datetime',
        'proof_round' => 'integer',
    ];

    // Status constants
    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_CORRECTIONS_NEEDED = 'corrections_needed';

    /**
     * Get the manuscript this proof belongs to.
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Check if proof is pending author review.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if proof is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Check if proof needs corrections.
     */
    public function needsCorrections(): bool
    {
        return $this->status === self::STATUS_CORRECTIONS_NEEDED;
    }

    /**
     * Mark proof as approved.
     */
    public function approve(): bool
    {
        $this->status = self::STATUS_APPROVED;
        $this->author_responded_at = now();
        $this->completed_at = now();

        return $this->save();
    }

    /**
     * Mark proof as needing corrections.
     */
    public function requestCorrections(string $corrections): bool
    {
        $this->status = self::STATUS_CORRECTIONS_NEEDED;
        $this->author_corrections = $corrections;
        $this->author_responded_at = now();

        return $this->save();
    }

    /**
     * Get the status label.
     */
    public function getStatusLabel(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING => 'Pending Author Review',
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_CORRECTIONS_NEEDED => 'Corrections Needed',
            default => 'Unknown',
        };
    }
}
