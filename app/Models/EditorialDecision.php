<?php

namespace App\Models;

use App\DecisionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EditorialDecision extends Model
{
    use HasFactory;

    protected $fillable = [
        'manuscript_id',
        'editor_id',
        'decision_type',
        'comments_to_author',
        'decision_date',
        'revision_deadline',
        'status',
        'decision_file_path',
    ];

    protected $casts = [
        'decision_date' => 'datetime',
        'revision_deadline' => 'date',
        'decision_type' => DecisionType::class,
    ];

    // Status constants
    public const STATUS_PENDING = 'pending';

    public const STATUS_FINALIZED = 'finalized';

    public const STATUS_ARCHIVED = 'archived';

    public const STATUSES = [
        self::STATUS_PENDING => 'Pending',
        self::STATUS_FINALIZED => 'Finalized',
        self::STATUS_ARCHIVED => 'Archived',
    ];

    // Relationships
    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class);
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    /**
     * Check if the decision is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if the decision is finalized.
     */
    public function isFinalized(): bool
    {
        return $this->status === self::STATUS_FINALIZED;
    }

    /**
     * Check if the editorial decision requires revision.
     */
    public function requiresRevision(): bool
    {
        return in_array($this->decision_type, [
            DecisionType::MINOR_REVISION,
            DecisionType::MAJOR_REVISION,
        ], true);
    }

    public function isAccepted(): bool
    {
        return $this->decision_type === DecisionType::ACCEPT;
    }

    public function isConditionallyAccepted(): bool
    {
        return $this->decision_type === DecisionType::CONDITIONAL_ACCEPT;
    }

    public function isRejected(): bool
    {
        return $this->decision_type === DecisionType::REJECT;
    }

    public function isDeskRejected(): bool
    {
        return $this->decision_type === DecisionType::DESK_REJECT;
    }

    public function isMinorRevision(): bool
    {
        return $this->decision_type === DecisionType::MINOR_REVISION;
    }

    public function isMajorRevision(): bool
    {
        return $this->decision_type === DecisionType::MAJOR_REVISION;
    }

    /**
     * Get the resulting manuscript status for this decision.
     */
    public function getResultingStatus(): \App\ManuscriptStatus
    {
        return $this->decision_type?->resultingStatus() ?? \App\ManuscriptStatus::UNDER_SCREENING;
    }
}
