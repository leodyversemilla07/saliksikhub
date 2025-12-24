<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManuscriptIndexing extends Model
{
    use HasFactory;

    protected $fillable = [
        'manuscript_id',
        'database_name',
        'status',
        'submitted_at',
        'indexed_at',
        'metadata_json',
        'external_id',
        'error_message',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'indexed_at' => 'datetime',
        'metadata_json' => 'array',
    ];

    // Status constants
    public const STATUS_PENDING = 'pending';

    public const STATUS_SUBMITTED = 'submitted';

    public const STATUS_INDEXED = 'indexed';

    public const STATUS_FAILED = 'failed';

    // Common indexing databases
    public const DATABASE_PUBMED = 'PubMed';

    public const DATABASE_WEB_OF_SCIENCE = 'Web of Science';

    public const DATABASE_SCOPUS = 'Scopus';

    public const DATABASE_CROSSREF = 'CrossRef';

    public const DATABASE_GOOGLE_SCHOLAR = 'Google Scholar';

    public const DATABASE_DOAJ = 'DOAJ';

    /**
     * Get the manuscript this indexing record belongs to.
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Check if submission is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if metadata has been submitted.
     */
    public function isSubmitted(): bool
    {
        return $this->status === self::STATUS_SUBMITTED;
    }

    /**
     * Check if successfully indexed.
     */
    public function isIndexed(): bool
    {
        return $this->status === self::STATUS_INDEXED;
    }

    /**
     * Check if indexing failed.
     */
    public function hasFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    /**
     * Mark as submitted.
     */
    public function markAsSubmitted(array $metadata): bool
    {
        $this->status = self::STATUS_SUBMITTED;
        $this->submitted_at = now();
        $this->metadata_json = $metadata;

        return $this->save();
    }

    /**
     * Mark as indexed.
     */
    public function markAsIndexed(?string $externalId = null): bool
    {
        $this->status = self::STATUS_INDEXED;
        $this->indexed_at = now();
        $this->external_id = $externalId;

        return $this->save();
    }

    /**
     * Mark as failed.
     */
    public function markAsFailed(string $errorMessage): bool
    {
        $this->status = self::STATUS_FAILED;
        $this->error_message = $errorMessage;

        return $this->save();
    }

    /**
     * Get the status label.
     */
    public function getStatusLabel(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING => 'Pending Submission',
            self::STATUS_SUBMITTED => 'Submitted to '.$this->database_name,
            self::STATUS_INDEXED => 'Successfully Indexed',
            self::STATUS_FAILED => 'Indexing Failed',
            default => 'Unknown',
        };
    }
}
