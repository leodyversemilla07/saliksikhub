<?php

use App\ManuscriptStatus;
use App\Models\Manuscript;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

// Ensure this file uses the TestCase and RefreshDatabase so facades and factories work
uses(Tests\TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    // no-op: RefreshDatabase will run
});

it('scopes published manuscripts', function () {
    $user = User::factory()->create();

    Manuscript::factory()->create([
        'user_id' => $user->id,
        'status' => ManuscriptStatus::PUBLISHED,
    ]);

    Manuscript::factory()->create([
        'user_id' => $user->id,
        'status' => ManuscriptStatus::SUBMITTED,
    ]);

    $published = Manuscript::published()->get();

    expect($published->count())->toBe(1);
});

it('scopes by author', function () {
    $a = User::factory()->create();
    $b = User::factory()->create();

    Manuscript::factory()->create(['user_id' => $a->id]);
    Manuscript::factory()->create(['user_id' => $b->id]);

    $byA = Manuscript::byAuthor($a->id)->get();
    expect($byA->count())->toBe(1);
});

it('scopes assigned to editor', function () {
    $editor = User::factory()->create();
    $m = Manuscript::factory()->create(['editor_id' => $editor->id]);

    $found = Manuscript::assignedToEditor($editor->id)->first();
    expect($found->id)->toBe($m->id);
});

it('scopes pending review', function () {
    Manuscript::factory()->create(['status' => ManuscriptStatus::SUBMITTED]);
    Manuscript::factory()->create(['status' => ManuscriptStatus::UNDER_REVIEW]);
    Manuscript::factory()->create(['status' => ManuscriptStatus::PUBLISHED]);

    $pending = Manuscript::pendingReview()->get();
    expect($pending->count())->toBe(2);
});
