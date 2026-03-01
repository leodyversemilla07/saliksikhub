<?php

namespace App\Models;

use App\ReviewRecommendation;
use App\ReviewStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'manuscript_id',
        'reviewer_id',
        'review_round',
        'invitation_sent_at',
        'invitation_response',
        'response_date',
        'review_submitted_at',
        'due_date',
        'extension_requested',
        'extension_reason',
        'recommendation',
        'confidential_comments',
        'author_comments',
        'quality_rating',
        'originality_rating',
        'methodology_rating',
        'significance_rating',
        'annotated_file_path',
        'status',
    ];

    protected $casts = [
        'invitation_sent_at' => 'datetime',
        'response_date' => 'datetime',
        'review_submitted_at' => 'datetime',
        'due_date' => 'datetime',
        'extension_requested' => 'boolean',
        'status' => ReviewStatus::class,
        'recommendation' => ReviewRecommendation::class,
        'quality_rating' => 'integer',
        'originality_rating' => 'integer',
        'methodology_rating' => 'integer',
        'significance_rating' => 'integer',
    ];

    /**
     * Get the manuscript being reviewed
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Get the reviewer
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Check if the review is pending (invited but not responded)
     */
    public function isPending(): bool
    {
        return $this->status === ReviewStatus::INVITED;
    }

    /**
     * Check if the reviewer has accepted
     */
    public function isAccepted(): bool
    {
        return $this->status === ReviewStatus::ACCEPTED || $this->status === ReviewStatus::IN_PROGRESS;
    }

    /**
     * Check if the review is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === ReviewStatus::COMPLETED;
    }

    /**
     * Check if the reviewer declined
     */
    public function isDeclined(): bool
    {
        return $this->status === ReviewStatus::DECLINED;
    }

    /**
     * Check if the review is overdue
     */
    public function isOverdue(): bool
    {
        return $this->due_date &&
               $this->due_date->isPast() &&
               ! $this->isCompleted() &&
               ! $this->isDeclined();
    }

    /**
     * Get the number of days until the deadline
     */
    public function daysUntilDeadline(): ?int
    {
        if (! $this->due_date) {
            return null;
        }

        return now()->diffInDays($this->due_date, false);
    }

    /**
     * Get average rating across all criteria
     */
    public function getAverageRating(): ?float
    {
        $ratings = array_filter([
            $this->quality_rating,
            $this->originality_rating,
            $this->methodology_rating,
            $this->significance_rating,
        ]);

        if (empty($ratings)) {
            return null;
        }

        return round(array_sum($ratings) / count($ratings), 2);
    }

    /**
     * Accept the review invitation
     */
    public function accept(): bool
    {
        $this->status = ReviewStatus::ACCEPTED;
        $this->invitation_response = 'accepted';
        $this->response_date = now();

        return $this->save();
    }

    /**
     * Decline the review invitation
     */
    public function decline(): bool
    {
        $this->status = ReviewStatus::DECLINED;
        $this->invitation_response = 'declined';
        $this->response_date = now();

        return $this->save();
    }

    /**
     * Mark review as in progress
     */
    public function markInProgress(): bool
    {
        $this->status = ReviewStatus::IN_PROGRESS;

        return $this->save();
    }

    /**
     * Submit the review
     */
    public function submit(): bool
    {
        $this->status = ReviewStatus::COMPLETED;
        $this->review_submitted_at = now();

        return $this->save();
    }

    /**
     * Scope: Active reviews (invited or in progress)
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', [
            ReviewStatus::INVITED,
            ReviewStatus::ACCEPTED,
            ReviewStatus::IN_PROGRESS,
        ]);
    }

    /**
     * Scope: Overdue reviews
     */
    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->whereIn('status', [
                ReviewStatus::INVITED,
                ReviewStatus::ACCEPTED,
                ReviewStatus::IN_PROGRESS,
            ]);
    }

    /**
     * Scope: For a specific reviewer
     */
    public function scopeForReviewer($query, $reviewerId)
    {
        return $query->where('reviewer_id', $reviewerId);
    }

    /**
     * Scope: For a specific manuscript
     */
    public function scopeForManuscript($query, $manuscriptId)
    {
        return $query->where('manuscript_id', $manuscriptId);
    }

    /**
     * Scope: Completed reviews
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', ReviewStatus::COMPLETED);
    }
}
