<?php

use App\Models\User;
use App\Models\Manuscript;
use App\Models\AiReview;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('user can view their manuscripts', function () {
    $user = User::factory()->create();
    $manuscripts = Manuscript::factory(3)->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->get('/manuscripts');

    $response->assertOk();
    $response->assertInertia(
        fn($assert) => $assert
            ->component('Manuscripts/Index')
            ->has('manuscripts', 3)
    );
});

test('user can create new manuscript', function () {
    $user = User::factory()->create();

    $manuscriptData = [
        'title' => 'Test Manuscript Title',
        'authors' => 'John Doe, Jane Doe',
        'abstract' => 'This is a test abstract that needs to be at least 100 characters long to pass validation. Adding more text to meet the minimum length requirement.',
        'keywords' => 'test, manuscript, keywords',
        'manuscript' => UploadedFile::fake()->create('document.pdf', 100)
    ];

    $response = $this
        ->actingAs($user)
        ->post('/manuscripts', $manuscriptData);

    $response->assertStatus(201);
    $this->assertDatabaseHas('manuscripts', [
        'title' => 'Test Manuscript Title',
        'user_id' => $user->id
    ]);
    Storage::assertExists('manuscripts/' . $manuscriptData['manuscript']->hashName());
});

test('user can view manuscript details', function () {
    $user = User::factory()->create();
    $manuscript = Manuscript::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->get("/manuscripts/{$manuscript->id}");

    $response->assertOk();
    $response->assertInertia(
        fn($assert) => $assert
            ->component('Manuscripts/Show')
            ->has('manuscript')
    );
});

test('user can update manuscript', function () {
    $user = User::factory()->create();
    $manuscript = Manuscript::factory()->create(['user_id' => $user->id]);

    $updatedData = [
        'title' => 'Updated Title',
        'authors' => 'Updated Author',
        'abstract' => 'Updated abstract text',
        'keywords' => 'updated, keywords'
    ];

    $response = $this
        ->actingAs($user)
        ->put("/manuscripts/{$manuscript->id}", $updatedData);

    $response->assertRedirect(route('manuscripts.index'));
    $this->assertDatabaseHas('manuscripts', [
        'id' => $manuscript->id,
        'title' => 'Updated Title'
    ]);
});

test('user can delete manuscript', function () {
    $user = User::factory()->create();
    $manuscript = Manuscript::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->delete("/manuscripts/{$manuscript->id}");

    $response->assertRedirect(route('manuscripts.index'));
    $this->assertDatabaseMissing('manuscripts', ['id' => $manuscript->id]);
});

test('user can view ai pre-reviewed manuscripts', function () {
    $user = User::factory()->create();
    $manuscript = Manuscript::factory()->create(['user_id' => $user->id]);
    $aiReview = AiReview::factory()->create(['manuscript_id' => $manuscript->id]);

    $response = $this
        ->actingAs($user)
        ->get('/manuscripts/ai-prereviewed');

    $response->assertOk();
    $response->assertInertia(
        fn($assert) => $assert
            ->component('Manuscripts/IndexAIPrereviewed')
            ->has('manuscripts')
    );
});