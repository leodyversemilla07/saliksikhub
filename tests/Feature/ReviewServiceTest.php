<?php

use App\ManuscriptStatus;
use App\Models\Manuscript;
use App\Models\Review;
use App\Models\User;
use App\ReviewRecommendation;
use App\ReviewStatus;
use App\Services\ReviewService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->reviewService = new ReviewService;

    // Create test users
    $this->author = User::factory()->create();
    $this->reviewer = User::factory()->create();
    $this->reviewer->assignRole('reviewer');

    $this->editor = User::factory()->create();
    $this->editor->assignRole('associate_editor');

    // Create test manuscript
    $this->manuscript = Manuscript::factory()->create([
        'user_id' => $this->author->id,
        'editor_id' => $this->editor->id,
        'status' => ManuscriptStatus::UNDER_SCREENING,
    ]);
});

test('reviewer can be invited to review a manuscript', function () {
    $review = $this->reviewService->inviteReviewer(
        $this->manuscript,
        $this->reviewer,
        reviewRound: 1,
        dueDate: now()->addWeeks(3)
    );

    expect($review)->not->toBeNull()
        ->and($review->manuscript_id)->toBe($this->manuscript->id)
        ->and($review->reviewer_id)->toBe($this->reviewer->id)
        ->and($review->status)->toBe(ReviewStatus::INVITED)
        ->and($review->review_round)->toBe(1);
});

test('reviewer can accept review invitation', function () {
    $review = Review::factory()->create([
        'manuscript_id' => $this->manuscript->id,
        'reviewer_id' => $this->reviewer->id,
        'status' => ReviewStatus::INVITED,
    ]);

    $result = $this->reviewService->acceptInvitation($review);

    expect($result)->toBeTrue()
        ->and($review->fresh()->status)->toBe(ReviewStatus::ACCEPTED)
        ->and($review->fresh()->invitation_response)->toBe('accepted')
        ->and($review->fresh()->response_date)->not->toBeNull();
});

test('reviewer can decline review invitation', function () {
    $review = Review::factory()->create([
        'manuscript_id' => $this->manuscript->id,
        'reviewer_id' => $this->reviewer->id,
        'status' => ReviewStatus::INVITED,
    ]);

    $result = $this->reviewService->declineInvitation($review, 'Too busy');

    expect($result)->toBeTrue()
        ->and($review->fresh()->status)->toBe(ReviewStatus::DECLINED)
        ->and($review->fresh()->invitation_response)->toBe('declined')
        ->and($review->fresh()->response_date)->not->toBeNull();
});

test('reviewer can submit a completed review', function () {
    $review = Review::factory()->create([
        'manuscript_id' => $this->manuscript->id,
        'reviewer_id' => $this->reviewer->id,
        'status' => ReviewStatus::ACCEPTED,
    ]);

    $result = $this->reviewService->submitReview(
        $review,
        ReviewRecommendation::MINOR_REVISION,
        'The manuscript is well-written but needs minor improvements in methodology.',
        'I recommend acceptance after minor revisions.',
        [
            'quality' => 8,
            'originality' => 7,
            'methodology' => 6,
            'significance' => 8,
        ]
    );

    expect($result)->toBeTrue()
        ->and($review->fresh()->status)->toBe(ReviewStatus::COMPLETED)
        ->and($review->fresh()->recommendation)->toBe(ReviewRecommendation::MINOR_REVISION)
        ->and($review->fresh()->quality_rating)->toBe(8)
        ->and($review->fresh()->originality_rating)->toBe(7)
        ->and($review->fresh()->methodology_rating)->toBe(6)
        ->and($review->fresh()->significance_rating)->toBe(8)
        ->and($review->fresh()->review_submitted_at)->not->toBeNull();
});

test('reviewer can calculate average rating', function () {
    $review = Review::factory()->create([
        'quality_rating' => 8,
        'originality_rating' => 7,
        'methodology_rating' => 6,
        'significance_rating' => 9,
    ]);

    $average = $review->getAverageRating();

    expect($average)->toBe(7.5);
});

test('review can detect if it is overdue', function () {
    $overdueReview = Review::factory()->create([
        'due_date' => now()->subDays(5),
        'status' => ReviewStatus::ACCEPTED,
    ]);

    $activeReview = Review::factory()->create([
        'due_date' => now()->addDays(5),
        'status' => ReviewStatus::ACCEPTED,
    ]);

    expect($overdueReview->isOverdue())->toBeTrue()
        ->and($activeReview->isOverdue())->toBeFalse();
});

test('review can calculate days until deadline', function () {
    $review = Review::factory()->create([
        'due_date' => now()->addDays(7)->startOfDay(),
    ]);

    expect($review->daysUntilDeadline())->toBeGreaterThanOrEqual(6)
        ->and($review->daysUntilDeadline())->toBeLessThanOrEqual(7);

    $overdueReview = Review::factory()->create([
        'due_date' => now()->subDays(3)->startOfDay(),
    ]);

    expect($overdueReview->daysUntilDeadline())->toBeGreaterThanOrEqual(-4)
        ->and($overdueReview->daysUntilDeadline())->toBeLessThanOrEqual(-2);
});

test('find suitable reviewers excludes author and co-authors', function () {
    // Create additional users
    $coAuthor = User::factory()->create();
    $coAuthor->assignRole('reviewer');

    $suitableReviewer = User::factory()->create();
    $suitableReviewer->assignRole('reviewer');

    // Add co-author to manuscript
    $this->manuscript->coAuthors()->attach($coAuthor->id, [
        'author_order' => 2,
        'is_corresponding' => false,
    ]);

    $suitableReviewers = $this->reviewService->findSuitableReviewers($this->manuscript, 10);

    // Should include suitable reviewer but not author or co-author
    expect($suitableReviewers->contains($suitableReviewer))->toBeTrue()
        ->and($suitableReviewers->contains($this->author))->toBeFalse()
        ->and($suitableReviewers->contains($coAuthor))->toBeFalse();
});

test('overdue reviews scope works correctly', function () {
    Review::factory()->create([
        'due_date' => now()->subDays(5),
        'status' => ReviewStatus::ACCEPTED,
    ]);

    Review::factory()->create([
        'due_date' => now()->addDays(5),
        'status' => ReviewStatus::ACCEPTED,
    ]);

    $overdueCount = Review::overdue()->count();

    expect($overdueCount)->toBe(1);
});

test('active reviews scope works correctly', function () {
    Review::factory()->create(['status' => ReviewStatus::INVITED]);
    Review::factory()->create(['status' => ReviewStatus::ACCEPTED]);
    Review::factory()->create(['status' => ReviewStatus::IN_PROGRESS]);
    Review::factory()->create(['status' => ReviewStatus::COMPLETED]);
    Review::factory()->create(['status' => ReviewStatus::DECLINED]);

    $activeCount = Review::active()->count();

    expect($activeCount)->toBe(3); // invited, accepted, in_progress
});

test('reviewer metrics are calculated correctly', function () {
    $reviewer = User::factory()->create();
    $reviewer->assignRole('reviewer');

    // Create reviews with different statuses
    Review::factory()->count(5)->create([
        'reviewer_id' => $reviewer->id,
        'status' => ReviewStatus::COMPLETED,
        'invitation_sent_at' => now()->subDays(20),
        'review_submitted_at' => now()->subDays(5),
    ]);

    Review::factory()->count(2)->create([
        'reviewer_id' => $reviewer->id,
        'status' => ReviewStatus::DECLINED,
    ]);

    Review::factory()->count(3)->create([
        'reviewer_id' => $reviewer->id,
        'status' => ReviewStatus::ACCEPTED,
    ]);

    $metrics = $reviewer->getReviewerMetrics();

    expect($metrics['total_reviews'])->toBe(10)
        ->and($metrics['completed_reviews'])->toBe(5)
        ->and($metrics['declined_reviews'])->toBe(2)
        ->and($metrics['active_reviews'])->toBe(3)
        ->and($metrics['acceptance_rate'])->toBe(50.0);
});
