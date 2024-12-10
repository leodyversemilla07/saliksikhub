<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Manuscript extends Model
{
    use HasFactory;

    /**
     * Manuscript status constants
     */
    public const STATUSES = [
        'SUBMITTED' => 'Submitted',
        'UNDER_REVIEW' => 'Under Review',
        'REVISION_REQUIRED' => 'Revision Required',
        'ACCEPTED' => 'Accepted',
        'REJECTED' => 'Rejected',
        'PUBLISHED' => 'Published'
    ];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'user_id',
        'authors',
        'status',
        'abstract',
        'keywords',
        'manuscript_path',
        'editor_id',
        'decision_date',
        'decision_comments'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'keywords' => 'array',
        'authors' => 'array'
    ];

    /**
     * Relationships
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    public function reviewerAssignments()
    {
        return $this->hasMany(ReviewerAssignment::class);
    }

    public function reviews()
    {
        return $this->hasManyThrough(Review::class, ReviewerAssignment::class);
    }

    public function decisions()
    {
        return $this->hasMany(ManuscriptDecision::class);
    }

    /**
     * Status related methods
     */
    public function updateStatus(string $status): bool
    {
        if (in_array($status, self::STATUSES)) {
            return $this->update(['status' => $status]);
        }
        return false;
    }

    public function isUnderReview(): bool
    {
        return $this->status === self::STATUSES['UNDER_REVIEW'];
    }

    /**
     * Decision related methods
     */
    public function latestDecision()
    {
        return $this->decisions()->latest('decided_at')->first();
    }

    public function aiReview()
    {
        return $this->hasOne(AiReview::class);
    }
}
