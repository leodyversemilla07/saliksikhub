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

    // Define constants for decision types that match both the form and database
    const DECISION_TYPES = [
        'ACCEPT' => 'Accept',
        'MINOR_REVISION' => 'Minor Revision',
        'MAJOR_REVISION' => 'Major Revision',
        'REJECT' => 'Reject',
    ];

    public const STATUSES = [
        'PENDING' => 'Pending',
        'FINALIZED' => 'Finalized',
        'ARCHIVED' => 'Archived',
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
        return $this->status === self::STATUSES['PENDING'];
    }

    /**
     * Check if the decision is finalized.
     */
    public function isFinalized(): bool
    {
        return $this->status === self::STATUSES['FINALIZED'];
    }

    /**
     * Check if the editorial decision requires revision.
     */
    public function requiresRevision(): bool
    {
        return in_array($this->decision_type?->value, [DecisionType::MINOR_REVISION->value, DecisionType::MAJOR_REVISION->value], true);
    }

    public function isAccepted(): bool
    {
        return $this->decision_type === DecisionType::ACCEPT;
    }

    public function isRejected(): bool
    {
        return $this->decision_type === DecisionType::REJECT;
    }

    public function isMinorRevision(): bool
    {
        return $this->decision_type === DecisionType::MINOR_REVISION;
    }

    public function isMajorRevision(): bool
    {
        return $this->decision_type === DecisionType::MAJOR_REVISION;
    }
}
