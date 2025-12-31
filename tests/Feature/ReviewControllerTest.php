<?php

use App\Models\Manuscript;
use App\Models\Review;
use App\Models\User;
use App\ReviewStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->reviewer = User::factory()->create(['role' => 'reviewer']);
    $this->reviewer->assignRole('reviewer');

    $this->author = User::factory()->create(['role' => 'author']);
    $this->author->assignRole('author');

    $this->editor = User::factory()->create(['role' => 'associate_editor']);
    $this->editor->assignRole('associate_editor');

    $this->manuscript = Manuscript::factory()->create([
        'user_id' => $this->author->id,
        'editor_id' => $this->editor->id,
    ]);

    $this->review = Review::factory()->create([
        'manuscript_id' => $this->manuscript->id,
        'reviewer_id' => $this->reviewer->id,
        'status' => ReviewStatus::INVITED,
    ]);
});

test('reviewer can view review index', function () {
    $this->actingAs($this->reviewer)
        ->get(route('reviewer.reviews.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reviewer/reviews/index')
            ->has('reviews')
            ->has('metrics')
        );
});

test('reviewer can view specific review', function () {
    $this->actingAs($this->reviewer)
        ->get(route('reviewer.reviews.show', $this->review))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reviewer/reviews/show')
            ->has('review')
            ->has('recommendations')
        );
});

test('reviewer cannot view another reviewers review', function () {
    $otherReviewer = User::factory()->create(['role' => 'reviewer']);
    $otherReviewer->assignRole('reviewer');

    $this->actingAs($otherReviewer)
        ->get(route('reviewer.reviews.show', $this->review))
        ->assertForbidden();
});

test('reviewer can accept review invitation', function () {
    $this->actingAs($this->reviewer)
        ->post(route('reviewer.reviews.accept', $this->review))
        ->assertRedirect();

    expect($this->review->fresh()->status)->toBe(ReviewStatus::ACCEPTED);
});

test('reviewer can decline review invitation', function () {
    $this->actingAs($this->reviewer)
        ->post(route('reviewer.reviews.decline', $this->review), [
            'reason' => 'Too busy with other commitments',
        ])
        ->assertRedirect();

    expect($this->review->fresh()->status)->toBe(ReviewStatus::DECLINED);
});

test('reviewer can submit review with valid data', function () {
    $this->review->update(['status' => ReviewStatus::ACCEPTED]);

    $this->actingAs($this->reviewer)
        ->post(route('reviewer.reviews.submit', $this->review), [
            'recommendation' => 'minor_revision',
            'author_comments' => str_repeat('This is a detailed review comment. ', 20),
            'confidential_comments' => 'Some confidential notes for the editor.',
            'quality_rating' => 8,
            'originality_rating' => 7,
            'methodology_rating' => 6,
            'significance_rating' => 8,
        ])
        ->assertRedirect();

    expect($this->review->fresh()->status)->toBe(ReviewStatus::COMPLETED);
});

test('review submission requires minimum comment length', function () {
    $this->review->update(['status' => ReviewStatus::ACCEPTED]);

    $this->actingAs($this->reviewer)
        ->post(route('reviewer.reviews.submit', $this->review), [
            'recommendation' => 'accept',
            'author_comments' => 'Too short',
            'quality_rating' => 8,
            'originality_rating' => 7,
            'methodology_rating' => 6,
            'significance_rating' => 8,
        ])
        ->assertSessionHasErrors('author_comments');
});

test('review submission requires all ratings', function () {
    $this->review->update(['status' => ReviewStatus::ACCEPTED]);

    $this->actingAs($this->reviewer)
        ->post(route('reviewer.reviews.submit', $this->review), [
            'recommendation' => 'accept',
            'author_comments' => str_repeat('Good manuscript. ', 20),
            'quality_rating' => 8,
            // Missing other ratings
        ])
        ->assertSessionHasErrors(['originality_rating', 'methodology_rating', 'significance_rating']);
});

test('reviewer can save review draft', function () {
    $this->review->update(['status' => ReviewStatus::ACCEPTED]);

    $this->actingAs($this->reviewer)
        ->post(route('reviewer.reviews.save-draft', $this->review), [
            'author_comments' => 'Work in progress...',
            'quality_rating' => 7,
        ])
        ->assertRedirect();

    $fresh = $this->review->fresh();
    expect($fresh->author_comments)->toBe('Work in progress...')
        ->and($fresh->quality_rating)->toBe(7);
});

test('reviewer can request deadline extension', function () {
    $this->actingAs($this->reviewer)
        ->post(route('reviewer.reviews.request-extension', $this->review), [
            'new_due_date' => now()->addDays(10)->toDateString(),
            'reason' => 'I need more time to thoroughly review the methodology section.',
        ])
        ->assertRedirect();
});

test('deadline extension requires future date', function () {
    $this->actingAs($this->reviewer)
        ->post(route('reviewer.reviews.request-extension', $this->review), [
            'new_due_date' => now()->subDays(1)->toDateString(),
            'reason' => 'Need more time',
        ])
        ->assertSessionHasErrors('new_due_date');
});

test('reviewer can view review history', function () {
    Review::factory()->count(3)->create([
        'reviewer_id' => $this->reviewer->id,
        'status' => ReviewStatus::COMPLETED,
    ]);

    $this->actingAs($this->reviewer)
        ->get(route('reviewer.reviews.history'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('reviewer/reviews/history')
            ->has('reviews')
        );
});
