<?php

namespace App\Models;

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
        return $this->status === 'Pending';
    }

    /**
     * Check if the decision is finalized.
     */
    public function isFinalized(): bool
    {
        return $this->status === 'Finalized';
    }

    /**
     * Check if the editorial decision requires revision.
     */
    public function requiresRevision(): bool
    {
        return in_array($this->decision_type, ['Minor Revision', 'Major Revision']);
    }

    public function isAccepted(): bool
    {
        return $this->decision_type === 'Accept';
    }

    public function isRejected(): bool
    {
        return $this->decision_type === 'Reject';
    }

    public function isMinorRevision(): bool
    {
        return $this->decision_type === 'Minor Revision';
    }

    public function isMajorRevision(): bool
    {
        return $this->decision_type === 'Major Revision';
    }
}
