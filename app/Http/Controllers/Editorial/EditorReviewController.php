<?php

namespace App\Http\Controllers\Editorial;

use App\Http\Controllers\Controller;
use App\Http\Requests\Editorial\AssignReviewersRequest;
use App\Models\Manuscript;
use App\Services\ManuscriptWorkflowService;
use App\Services\ReviewService;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EditorReviewController extends Controller
{
    /**
     * Show form to assign reviewers to a manuscript.
     */
    public function showAssignReviewers(Manuscript $manuscript)
    {
        $reviewService = app(ReviewService::class);
        $suitableReviewers = $reviewService->findSuitableReviewers($manuscript, 20);

        $currentReviews = $manuscript->reviews()
            ->with('reviewer')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($review) => [
                'id' => $review->id,
                'reviewer_name' => $review->reviewer->firstname.' '.$review->reviewer->lastname,
                'reviewer_email' => $review->reviewer->email,
                'status' => $review->status->value,
                'status_label' => $review->status->label(),
                'invitation_sent_at' => $review->invitation_sent_at?->toDateTimeString(),
                'due_date' => $review->due_date?->toDateString(),
                'review_round' => $review->review_round,
            ]);

        return Inertia::render('editor/assign-reviewers', [
            'manuscript' => [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'abstract' => $manuscript->abstract,
                'keywords' => explode(', ', $manuscript->keywords ?? ''),
                'status' => $manuscript->status->value,
            ],
            'suitable_reviewers' => $suitableReviewers->map(fn ($reviewer) => [
                'id' => $reviewer->id,
                'name' => $reviewer->firstname.' '.$reviewer->lastname,
                'email' => $reviewer->email,
                'affiliation' => $reviewer->affiliation,
                'expertises' => $reviewer->expertises->pluck('name'),
                'relevance_score' => $reviewer->relevance_score ?? 0,
                'completed_reviews' => $reviewer->getReviewerMetrics()['completed_reviews'],
                'average_review_time_days' => $reviewer->getReviewerMetrics()['average_review_time_days'],
                'acceptance_rate' => $reviewer->getReviewerMetrics()['acceptance_rate'],
            ]),
            'current_reviews' => $currentReviews,
        ]);
    }

    /**
     * Assign reviewers to a manuscript.
     */
    public function assignReviewers(AssignReviewersRequest $request, Manuscript $manuscript)
    {
        try {
            $validated = $request->validated();

            $workflowService = app(ManuscriptWorkflowService::class);

            $dueDate = new \DateTime($validated['due_date']);
            $reviewRound = $validated['review_round'] ?? 1;

            if ($workflowService->assignReviewers(
                $manuscript,
                $validated['reviewer_ids'],
                $reviewRound,
                $dueDate
            )) {
                return redirect()->route('editor.manuscripts.show', $manuscript->id)
                    ->with('success', 'Reviewers assigned successfully. Invitations have been sent.');
            }

            return back()->with('error', 'Failed to assign reviewers.');
        } catch (Exception $e) {
            Log::error('Error assigning reviewers: '.$e->getMessage());

            return back()->with('error', 'Failed to assign reviewers: '.$e->getMessage());
        }
    }

    /**
     * Show all reviews for a manuscript.
     */
    public function showManuscriptReviews(Manuscript $manuscript)
    {
        $reviews = $manuscript->reviews()
            ->with('reviewer')
            ->orderBy('review_round', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($review) => [
                'id' => $review->id,
                'reviewer_name' => $review->reviewer->firstname.' '.$review->reviewer->lastname,
                'status' => $review->status->value,
                'status_label' => $review->status->label(),
                'status_color' => $review->status->color(),
                'recommendation' => $review->recommendation?->value,
                'recommendation_label' => $review->recommendation?->label(),
                'recommendation_color' => $review->recommendation?->color(),
                'author_comments' => $review->author_comments,
                'confidential_comments' => $review->confidential_comments,
                'average_rating' => $review->getAverageRating(),
                'review_round' => $review->review_round,
                'invitation_sent_at' => $review->invitation_sent_at?->toDateTimeString(),
                'submitted_at' => $review->review_submitted_at?->toDateTimeString(),
                'due_date' => $review->due_date?->toDateString(),
                'is_overdue' => $review->isOverdue(),
            ]);

        return Inertia::render('editor/manuscript-reviews', [
            'manuscript' => [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'status' => $manuscript->status->value,
                'status_label' => $manuscript->status->label(),
            ],
            'reviews' => $reviews,
        ]);
    }
}
