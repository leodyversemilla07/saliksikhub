<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use App\ReviewRecommendation;
use App\ReviewStatus;
use App\Services\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    protected ReviewService $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * Display reviewer's active review assignments.
     */
    public function index()
    {
        $reviewer = Auth::user();

        $reviews = Review::forReviewer($reviewer->id)
            ->with(['manuscript.author', 'manuscript.editor'])
            ->orderBy('due_date')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'manuscript_id' => $review->manuscript_id,
                    'manuscript_title' => $review->manuscript->title,
                    'manuscript_abstract' => $review->manuscript->abstract,
                    'status' => $review->status->value,
                    'status_label' => $review->status->label(),
                    'status_color' => $review->status->color(),
                    'invitation_sent_at' => $review->invitation_sent_at?->toDateTimeString(),
                    'due_date' => $review->due_date?->toDateString(),
                    'days_until_deadline' => $review->daysUntilDeadline(),
                    'is_overdue' => $review->isOverdue(),
                    'review_round' => $review->review_round,
                    'submitted_at' => $review->review_submitted_at?->toDateTimeString(),
                ];
            });

        $metrics = $reviewer->getReviewerMetrics();

        return Inertia::render('reviewer/reviews/index', [
            'reviews' => $reviews,
            'metrics' => $metrics,
        ]);
    }

    /**
     * Show a specific review for the reviewer.
     */
    public function show(Review $review)
    {
        // Authorize - ensure the logged-in user is the assigned reviewer
        if ($review->reviewer_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this review.');
        }

        $review->load(['manuscript.files', 'manuscript.author']);

        return Inertia::render('reviewer/reviews/show', [
            'review' => [
                'id' => $review->id,
                'manuscript_id' => $review->manuscript_id,
                'manuscript_title' => $review->manuscript->title,
                'manuscript_abstract' => $review->manuscript->abstract,
                'manuscript_keywords' => explode(', ', $review->manuscript->keywords ?? ''),
                'status' => $review->status->value,
                'status_label' => $review->status->label(),
                'invitation_sent_at' => $review->invitation_sent_at?->toDateTimeString(),
                'due_date' => $review->due_date?->toDateString(),
                'days_until_deadline' => $review->daysUntilDeadline(),
                'is_overdue' => $review->isOverdue(),
                'review_round' => $review->review_round,
                'recommendation' => $review->recommendation?->value,
                'author_comments' => $review->author_comments,
                'confidential_comments' => $review->confidential_comments,
                'quality_rating' => $review->quality_rating,
                'originality_rating' => $review->originality_rating,
                'methodology_rating' => $review->methodology_rating,
                'significance_rating' => $review->significance_rating,
                'files' => $review->manuscript->files->map(function ($file) {
                    return [
                        'id' => $file->id,
                        'filename' => $file->filename,
                        'file_type' => $file->file_type->value,
                        'file_type_label' => $file->file_type->label(),
                        'file_size' => $file->getFormattedFileSize(),
                        'download_url' => $file->getDownloadUrl(),
                    ];
                }),
            ],
            'recommendations' => [
                ['value' => ReviewRecommendation::ACCEPT->value, 'label' => ReviewRecommendation::ACCEPT->label()],
                ['value' => ReviewRecommendation::MINOR_REVISION->value, 'label' => ReviewRecommendation::MINOR_REVISION->label()],
                ['value' => ReviewRecommendation::MAJOR_REVISION->value, 'label' => ReviewRecommendation::MAJOR_REVISION->label()],
                ['value' => ReviewRecommendation::REJECT->value, 'label' => ReviewRecommendation::REJECT->label()],
            ],
        ]);
    }

    /**
     * Accept a review invitation.
     */
    public function accept(Review $review)
    {
        // Authorize
        if ($review->reviewer_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this review.');
        }

        if (! $review->isPending()) {
            return back()->with('error', 'This review invitation has already been responded to.');
        }

        if ($this->reviewService->acceptInvitation($review)) {
            return redirect()->route('reviewer.reviews.show', $review)
                ->with('success', 'Review invitation accepted. You can now submit your review.');
        }

        return back()->with('error', 'Failed to accept review invitation.');
    }

    /**
     * Decline a review invitation.
     */
    public function decline(Request $request, Review $review)
    {
        // Authorize
        if ($review->reviewer_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this review.');
        }

        if (! $review->isPending() && ! $review->isAccepted()) {
            return back()->with('error', 'This review cannot be declined at this stage.');
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        if ($this->reviewService->declineInvitation($review, $validated['reason'] ?? null)) {
            return redirect()->route('reviewer.reviews.index')
                ->with('success', 'Review invitation declined.');
        }

        return back()->with('error', 'Failed to decline review invitation.');
    }

    /**
     * Submit a completed review.
     */
    public function submit(Request $request, Review $review)
    {
        // Authorize
        if ($review->reviewer_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this review.');
        }

        if ($review->isCompleted()) {
            return back()->with('error', 'This review has already been submitted.');
        }

        $validated = $request->validate([
            'recommendation' => 'required|in:accept,minor_revision,major_revision,reject',
            'author_comments' => 'required|string|min:100',
            'confidential_comments' => 'nullable|string',
            'quality_rating' => 'required|integer|min:1|max:10',
            'originality_rating' => 'required|integer|min:1|max:10',
            'methodology_rating' => 'required|integer|min:1|max:10',
            'significance_rating' => 'required|integer|min:1|max:10',
            'annotated_file' => 'nullable|file|mimes:pdf|max:10240', // 10MB max
        ]);

        // Handle annotated file upload if provided
        $annotatedFilePath = null;
        if ($request->hasFile('annotated_file')) {
            $file = $request->file('annotated_file');
            $annotatedFilePath = $file->store('reviews/annotated', 'manuscripts');
        }

        $recommendation = ReviewRecommendation::from($validated['recommendation']);
        $ratings = [
            'quality' => $validated['quality_rating'],
            'originality' => $validated['originality_rating'],
            'methodology' => $validated['methodology_rating'],
            'significance' => $validated['significance_rating'],
        ];

        if ($this->reviewService->submitReview(
            $review,
            $recommendation,
            $validated['author_comments'],
            $validated['confidential_comments'] ?? null,
            $ratings
        )) {
            // Update annotated file path if uploaded
            if ($annotatedFilePath) {
                $review->annotated_file_path = $annotatedFilePath;
                $review->save();
            }

            return redirect()->route('reviewer.reviews.index')
                ->with('success', 'Review submitted successfully. Thank you for your contribution!');
        }

        return back()->with('error', 'Failed to submit review.');
    }

    /**
     * Save review as draft (in progress).
     */
    public function saveDraft(Request $request, Review $review)
    {
        // Authorize
        if ($review->reviewer_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this review.');
        }

        $validated = $request->validate([
            'recommendation' => 'nullable|in:accept,minor_revision,major_revision,reject',
            'author_comments' => 'nullable|string',
            'confidential_comments' => 'nullable|string',
            'quality_rating' => 'nullable|integer|min:1|max:10',
            'originality_rating' => 'nullable|integer|min:1|max:10',
            'methodology_rating' => 'nullable|integer|min:1|max:10',
            'significance_rating' => 'nullable|integer|min:1|max:10',
        ]);

        // Update review with draft data
        if (isset($validated['recommendation'])) {
            $review->recommendation = ReviewRecommendation::from($validated['recommendation']);
        }
        $review->author_comments = $validated['author_comments'] ?? $review->author_comments;
        $review->confidential_comments = $validated['confidential_comments'] ?? $review->confidential_comments;
        $review->quality_rating = $validated['quality_rating'] ?? $review->quality_rating;
        $review->originality_rating = $validated['originality_rating'] ?? $review->originality_rating;
        $review->methodology_rating = $validated['methodology_rating'] ?? $review->methodology_rating;
        $review->significance_rating = $validated['significance_rating'] ?? $review->significance_rating;

        // Mark as in progress if not already
        if ($review->status === ReviewStatus::ACCEPTED) {
            $review->markInProgress();
        }

        if ($review->save()) {
            return back()->with('success', 'Review draft saved.');
        }

        return back()->with('error', 'Failed to save review draft.');
    }

    /**
     * Request deadline extension.
     */
    public function requestExtension(Request $request, Review $review)
    {
        // Authorize
        if ($review->reviewer_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this review.');
        }

        $validated = $request->validate([
            'new_due_date' => 'required|date|after:today',
            'reason' => 'required|string|min:20|max:500',
        ]);

        $newDueDate = new \DateTime($validated['new_due_date']);

        if ($this->reviewService->requestExtension($review, $newDueDate, $validated['reason'])) {
            return back()->with('success', 'Extension request submitted. The editor will be notified.');
        }

        return back()->with('error', 'Failed to request extension.');
    }

    /**
     * Display review history for the reviewer.
     */
    public function history()
    {
        $reviewer = Auth::user();

        $completedReviews = Review::forReviewer($reviewer->id)
            ->completed()
            ->with(['manuscript' => fn ($q) => $q->withoutGlobalScope('journal')])
            ->latest('review_submitted_at')
            ->paginate(20)
            ->through(function ($review) {
                return [
                    'id' => $review->id,
                    'manuscript_title' => $review->manuscript?->title ?? 'Unknown Manuscript',
                    'review_round' => $review->review_round,
                    'recommendation' => $review->recommendation?->label(),
                    'recommendation_color' => $review->recommendation?->color(),
                    'submitted_at' => $review->review_submitted_at?->toDateTimeString(),
                    'average_rating' => $review->getAverageRating(),
                ];
            });

        return Inertia::render('reviewer/reviews/history', [
            'reviews' => $completedReviews,
        ]);
    }
}
