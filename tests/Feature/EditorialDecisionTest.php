<?php

use App\ManuscriptStatus;
use App\Models\EditorialDecision;
use App\Models\Manuscript;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Ensure permission cache is cleared
    $registrar = app(PermissionRegistrar::class);
    $registrar->forgetCachedPermissions();
    $registrar->cacheExpirationTime = 0;

    // Roles are already seeded in TestCase::setUp
});

it('maps accept decision to ACCEPTED status', function () {
    $author = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'author',
    ]);
    $author->assignRole('author');

    $editor = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'editor_in_chief',
    ]);
    $editor->assignRole('editor_in_chief');

    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'status' => ManuscriptStatus::UNDER_REVIEW,
    ]);

    // Debug: Check if manuscript exists
    expect(Manuscript::find($manuscript->id))->not->toBeNull();
    expect($manuscript->id)->toBeGreaterThan(0);

    // Debug: Check route generation
    $routeUrl = route('editor.manuscripts.decision', ['manuscript' => $manuscript->id]);
    expect($routeUrl)->toContain((string) $manuscript->id);

    $this->actingAs($editor);

    // Debug: Check authentication
    $this->assertAuthenticatedAs($editor);

    // Debug: Check user roles
    expect($editor->hasRole('editor_in_chief'))->toBeTrue();
    expect($editor->hasAnyRole(['managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor']))->toBeTrue();

    $response = $this->post(route('editor.manuscripts.decision', $manuscript), [
        'decision' => 'accept',
        'comments' => 'Accepted for publication',
    ]);

    $response->assertRedirect();
    $manuscript->refresh();

    // Debug: Check if any editorial decisions were created
    expect(EditorialDecision::count())->toBeGreaterThan(0);

    expect($manuscript->status)->toBe(ManuscriptStatus::ACCEPTED);
    $this->assertDatabaseHas('editorial_decisions', [
        'manuscript_id' => $manuscript->id,
        'decision_type' => 'accept',
        'comments_to_author' => 'Accepted for publication',
    ]);
});

it('maps minor_revision decision to MINOR_REVISION_REQUIRED status', function () {
    $author = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'author',
    ]);
    $author->assignRole('author');

    $editor = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'editor_in_chief',
    ]);
    $editor->assignRole('editor_in_chief');

    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'status' => ManuscriptStatus::UNDER_REVIEW,
    ]);

    $this->actingAs($editor);

    $response = $this->post(route('editor.manuscripts.decision', $manuscript), [
        'decision' => 'minor_revision',
        'comments' => 'Minor revisions required',
        'revision_deadline' => now()->addDays(30)->format('Y-m-d'),
    ]);

    $response->assertRedirect();
    $manuscript->refresh();

    expect($manuscript->status)->toBe(ManuscriptStatus::MINOR_REVISION_REQUIRED);
});

it('maps major_revision decision to MAJOR_REVISION_REQUIRED status', function () {
    $author = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'author',
    ]);
    $author->assignRole('author');

    $editor = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'editor_in_chief',
    ]);
    $editor->assignRole('editor_in_chief');

    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'status' => ManuscriptStatus::UNDER_REVIEW,
    ]);

    $this->actingAs($editor);

    $response = $this->post(route('editor.manuscripts.decision', $manuscript), [
        'decision' => 'major_revision',
        'comments' => 'Major revisions required',
        'revision_deadline' => now()->addDays(60)->format('Y-m-d'),
    ]);

    $response->assertRedirect();
    $manuscript->refresh();

    expect($manuscript->status)->toBe(ManuscriptStatus::MAJOR_REVISION_REQUIRED);
});

it('maps reject decision to REJECTED status', function () {
    $author = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'author',
    ]);
    $author->assignRole('author');

    $editor = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'editor_in_chief',
    ]);
    $editor->assignRole('editor_in_chief');

    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'status' => ManuscriptStatus::UNDER_REVIEW,
    ]);

    $this->actingAs($editor);

    $response = $this->post(route('editor.manuscripts.decision', $manuscript), [
        'decision' => 'reject',
        'comments' => 'Manuscript rejected',
    ]);

    $response->assertRedirect();
    $manuscript->refresh();

    expect($manuscript->status)->toBe(ManuscriptStatus::REJECTED);
});

it('guards copyediting transition to only ACCEPTED manuscripts', function () {
    $author = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'author',
    ]);
    $author->assignRole('author');

    $editor = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'editor_in_chief',
    ]);
    $editor->assignRole('editor_in_chief');

    // Test with SUBMITTED status (should fail)
    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'status' => ManuscriptStatus::SUBMITTED,
    ]);

    $this->actingAs($editor);

    $response = $this->post(route('editor.manuscripts.start_copyediting', $manuscript));

    $response->assertRedirect();
    $manuscript->refresh();
    expect($manuscript->status)->toBe(ManuscriptStatus::SUBMITTED); // Should not change
});

it('allows copyediting transition from ACCEPTED status', function () {
    $author = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'author',
    ]);
    $author->assignRole('author');

    $editor = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'editor_in_chief',
    ]);
    $editor->assignRole('editor_in_chief');

    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'status' => ManuscriptStatus::ACCEPTED,
    ]);

    $this->actingAs($editor);

    $response = $this->post(route('editor.manuscripts.start_copyediting', $manuscript));

    $response->assertRedirect();
    $manuscript->refresh();
    expect($manuscript->status)->toBe(ManuscriptStatus::IN_COPYEDITING);
});

it('transitions to AWAITING_AUTHOR_APPROVAL when finalized manuscript is uploaded', function () {
    Storage::fake('spaces');

    $author = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'author',
    ]);
    $author->assignRole('author');

    $editor = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'editor_in_chief',
    ]);
    $editor->assignRole('editor_in_chief');

    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'status' => ManuscriptStatus::IN_COPYEDITING,
    ]);

    $this->actingAs($editor);

    $file = UploadedFile::fake()->create('finalized.pdf', 1000, 'application/pdf');

    $response = $this->post(route('editor.manuscripts.upload_finalized', $manuscript), [
        'manuscript_file' => $file,
    ]);

    $response->assertRedirect();
    $manuscript->refresh();

    expect($manuscript->status)->toBe(ManuscriptStatus::AWAITING_AUTHOR_APPROVAL);
    expect($manuscript->final_pdf_path)->not->toBeNull();
    expect($manuscript->final_manuscript_uploaded_at)->not->toBeNull();
});

it('transitions to READY_FOR_PUBLICATION when author approves finalized manuscript', function () {
    $author = User::factory()->create([
        'email_verified_at' => now(),
        'role' => 'author',
    ]);
    $author->assignRole('author');

    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'status' => ManuscriptStatus::AWAITING_AUTHOR_APPROVAL,
        'final_pdf_path' => 'manuscripts/finalized/test.pdf',
    ]);

    $this->actingAs($author);

    $response = $this->post(route('manuscripts.approve.submit', $manuscript));

    $response->assertRedirect();
    $manuscript->refresh();

    expect($manuscript->status)->toBe(ManuscriptStatus::READY_FOR_PUBLICATION);
    expect($manuscript->author_approval_date)->not->toBeNull();
});
