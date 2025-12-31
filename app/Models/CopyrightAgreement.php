<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CopyrightAgreement extends Model
{
    use HasFactory;

    protected $fillable = [
        'manuscript_id',
        'author_id',
        'agreement_type',
        'license_type',
        'terms',
        'agreement_file_path',
        'signed_at',
        'signature',
        'is_signed',
        'sent_at',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'sent_at' => 'datetime',
        'is_signed' => 'boolean',
    ];

    protected $attributes = [
        'is_signed' => false,
    ];

    // Agreement types
    public const TYPE_COPYRIGHT_TRANSFER = 'copyright_transfer';

    public const TYPE_LICENSE_TO_PUBLISH = 'license_to_publish';

    public const TYPE_CREATIVE_COMMONS = 'creative_commons';

    // Common Creative Commons licenses
    public const LICENSE_CC_BY = 'CC-BY';

    public const LICENSE_CC_BY_SA = 'CC-BY-SA';

    public const LICENSE_CC_BY_NC = 'CC-BY-NC';

    public const LICENSE_CC_BY_NC_SA = 'CC-BY-NC-SA';

    public const LICENSE_CC_BY_ND = 'CC-BY-ND';

    public const LICENSE_CC_BY_NC_ND = 'CC-BY-NC-ND';

    /**
     * Get the manuscript this agreement belongs to.
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Get the author who signed this agreement.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Check if the agreement is signed.
     */
    public function isSigned(): bool
    {
        return $this->is_signed;
    }

    /**
     * Check if the agreement is pending.
     */
    public function isPending(): bool
    {
        return ! $this->is_signed && $this->sent_at !== null;
    }

    /**
     * Mark the agreement as signed.
     */
    public function markAsSigned(string $signature): bool
    {
        $this->is_signed = true;
        $this->signed_at = now();
        $this->signature = $signature;

        return $this->save();
    }

    /**
     * Get the agreement type label.
     */
    public function getAgreementTypeLabel(): string
    {
        return match ($this->agreement_type) {
            self::TYPE_COPYRIGHT_TRANSFER => 'Copyright Transfer',
            self::TYPE_LICENSE_TO_PUBLISH => 'License to Publish',
            self::TYPE_CREATIVE_COMMONS => 'Creative Commons',
            default => 'Unknown',
        };
    }
}
