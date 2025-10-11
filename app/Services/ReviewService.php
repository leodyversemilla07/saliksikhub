<?php

namespace App\Services;

use App\Models\Manuscript;
use App\Models\Review;
use App\Models\User;
use App\ReviewRecommendation;
use App\ReviewStatus;
use Illuminate\Support\Facades\DB;

class ReviewService
{
    /**
     * Invite a reviewer to review a manuscript.
     */
    public function inviteReviewer(
        Manuscript $manuscript,
        User $reviewer,
        int $reviewRound = 1,
        ?\DateTime $dueDate = null
    ): ?Review {
        try {
            // Set default due date (3 weeks)
            if (! $dueDate) {
                $dueDate = now()->addWeeks(3);
            }

            $review = Review::create([
                'manuscript_id' => $manuscript->id,
                'reviewer_id' => $reviewer->id,
                'review_round' => $reviewRound,
                'invitation_sent_at' => now(),
                'due_date' => $dueDate,
                'status' => ReviewStatus::INVITED,
            ]);

            // Send review invitation email
            $reviewer->notify(new \App\Notifications\ReviewInvitation($manuscript, $review));

            return $review;
        } catch (\Exception $e) {
            \Log::error('Failed to invite reviewer: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Reviewer accepts review invitation.
     */
    public function acceptInvitation(Review $review): bool
    {
        try {
            DB::beginTransaction();

            $review->status = ReviewStatus::ACCEPTED;
            $review->invitation_response = 'accepted';
            $review->response_date = now();
            $review->save();

            // Send confirmation to reviewer and notification to editor
            $manuscript = $review->manuscript;
            if ($manuscript->editor) {
                $manuscript->editor->notify(new \App\Notifications\ReviewAccepted($review));
            }

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to accept review invitation: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Reviewer declines review invitation.
     */
    public function declineInvitation(Review $review, ?string $reason = null): bool
    {
        try {
            DB::beginTransaction();

            $review->status = ReviewStatus::DECLINED;
            $review->invitation_response = 'declined';
            $review->response_date = now();
            $review->save();

            // Notify editor about declined review
            $manuscript = $review->manuscript;
            if ($manuscript->editor) {
                $manuscript->editor->notify(new \App\Notifications\ReviewDeclined($review, $reason));
            }

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to decline review invitation: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Submit a completed review.
     */
    public function submitReview(
        Review $review,
        ReviewRecommendation $recommendation,
        string $authorComments,
        ?string $confidentialComments = null,
        array $ratings = []
    ): bool {
        try {
            DB::beginTransaction();

            $review->status = ReviewStatus::COMPLETED;
            $review->recommendation = $recommendation;
            $review->author_comments = $authorComments;
            $review->confidential_comments = $confidentialComments;
            $review->review_submitted_at = now();

            // Set ratings if provided
            if (isset($ratings['quality'])) {
                $review->quality_rating = $ratings['quality'];
            }
            if (isset($ratings['originality'])) {
                $review->originality_rating = $ratings['originality'];
            }
            if (isset($ratings['methodology'])) {
                $review->methodology_rating = $ratings['methodology'];
            }
            if (isset($ratings['significance'])) {
                $review->significance_rating = $ratings['significance'];
            }

            $review->save();

            // Notify editor about completed review
            $manuscript = $review->manuscript;
            if ($manuscript->editor) {
                $manuscript->editor->notify(new \App\Notifications\ReviewSubmitted($review));
            }

            // Check if all reviews are completed and notify if so
            $activeReviews = $manuscript->activeReviews()->count();
            if ($activeReviews === 0) {
                \Log::info('All reviews completed for manuscript: '.$manuscript->id);
                // Could send additional notification here
            }

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to submit review: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Send reminder to reviewer.
     */
    public function sendReminder(Review $review): bool
    {
        try {
            // Only send reminder for pending reviews
            if (! in_array($review->status, [ReviewStatus::INVITED, ReviewStatus::ACCEPTED, ReviewStatus::IN_PROGRESS])) {
                return false;
            }

            // Send reminder notification
            $review->reviewer->notify(new \App\Notifications\ReviewReminder($review));

            \Log::info('Review reminder sent', [
                'review_id' => $review->id,
                'reviewer_id' => $review->reviewer_id,
            ]);

            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to send review reminder: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get overdue reviews.
     */
    public function getOverdueReviews(?int $editorId = null)
    {
        $query = Review::overdue()
            ->with(['manuscript', 'reviewer']);

        if ($editorId) {
            $query->whereHas('manuscript', function ($q) use ($editorId) {
                $q->where('editor_id', $editorId);
            });
        }

        return $query->get();
    }

    /**
     * Get reviewer performance metrics.
     */
    public function getReviewerPerformanceMetrics(User $reviewer): array
    {
        return $reviewer->getReviewerMetrics();
    }

    /**
     * Find suitable reviewers for a manuscript.
     */
    public function findSuitableReviewers(Manuscript $manuscript, int $limit = 10)
    {
        // Get users with reviewer role
        $query = User::role('reviewer');

        // TODO: Implement more sophisticated matching based on:
        // - Expertise keywords
        // - Subject area
        // - Past review performance
        // - Current workload
        // - Conflict of interest checking

        // Exclude manuscript author
        $query->where('id', '!=', $manuscript->user_id);

        // Exclude co-authors
        $coAuthorIds = $manuscript->coAuthors()->pluck('users.id')->toArray();
        if (! empty($coAuthorIds)) {
            $query->whereNotIn('id', $coAuthorIds);
        }

        // Exclude current reviewers
        $currentReviewerIds = $manuscript->reviews()
            ->pluck('reviewer_id')
            ->toArray();
        if (! empty($currentReviewerIds)) {
            $query->whereNotIn('id', $currentReviewerIds);
        }

        // Order by completed reviews (experienced reviewers first)
        $query->withCount(['completedReviews'])
            ->orderByDesc('completed_reviews_count');

        return $query->limit($limit)->get();
    }

    /**
     * Get review statistics for dashboard.
     */
    public function getReviewStatistics(?int $manuscriptId = null): array
    {
        $query = Review::query();

        if ($manuscriptId) {
            $query->where('manuscript_id', $manuscriptId);
        }

        return [
            'total_reviews' => $query->count(),
            'pending_invitations' => (clone $query)->where('status', ReviewStatus::INVITED)->count(),
            'accepted' => (clone $query)->where('status', ReviewStatus::ACCEPTED)->count(),
            'in_progress' => (clone $query)->where('status', ReviewStatus::IN_PROGRESS)->count(),
            'completed' => (clone $query)->where('status', ReviewStatus::COMPLETED)->count(),
            'declined' => (clone $query)->where('status', ReviewStatus::DECLINED)->count(),
            'overdue' => (clone $query)->overdue()->count(),
        ];
    }

    /**
     * Request deadline extension for a review.
     */
    public function requestExtension(Review $review, \DateTime $newDueDate, string $reason): bool
    {
        try {
            DB::beginTransaction();

            $review->due_date = $newDueDate;
            $review->save();

            // TODO: Notify editor about extension request

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to request review extension: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Reassign review to a different reviewer.
     */
    public function reassignReview(Review $oldReview, User $newReviewer): ?Review
    {
        try {
            DB::beginTransaction();

            // Mark old review as cancelled
            $oldReview->status = ReviewStatus::DECLINED;
            $oldReview->save();

            // Create new review invitation
            $newReview = $this->inviteReviewer(
                $oldReview->manuscript,
                $newReviewer,
                $oldReview->review_round,
                $oldReview->due_date
            );

            DB::commit();

            return $newReview;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to reassign review: '.$e->getMessage());

            return null;
        }
    }
}
