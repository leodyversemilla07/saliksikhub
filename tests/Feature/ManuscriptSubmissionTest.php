<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Ensure permission cache is cleared and role exists for tests
    app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    Role::firstOrCreate(['name' => 'author', 'guard_name' => 'web']);
});

it('allows an author to submit a manuscript (happy path)', function () {
    Storage::fake('local');

    $author = User::factory()->create(['email_verified_at' => now()]);
    $author->assignRole('author');

    $this->actingAs($author);
    $this->withoutMiddleware();
    fwrite(STDERR, "Generated manuscripts.create URL: /author/manuscripts/create\n");
    $file = UploadedFile::fake()->create('paper.docx', 100, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    $response = $this->post('/author/manuscripts', [
        'title' => 'A Valid Manuscript Title',
        'authors' => 'First Last',
        'abstract' => str_repeat('Lorem ipsum ', 10),
        'keywords' => 'science,research',
        'manuscript' => $file,
    ]);

    if ($response->status() !== 302) {
        fwrite(STDERR, "\nResponse status: {$response->status()}\n");
        fwrite(STDERR, "Response content: {$response->getContent()}\n");
    }
    $response->assertRedirect(route('manuscripts.index'));
    $this->assertDatabaseHas('manuscripts', [
        'title' => 'A Valid Manuscript Title',
        'user_id' => $author->id,
    ]);
});

it('rejects manuscript submission with invalid file type', function () {
    Storage::fake('local');

    $author = User::factory()->create(['email_verified_at' => now()]);
    $author->assignRole('author');

    $this->actingAs($author);
    $this->withoutMiddleware();

    $file = UploadedFile::fake()->create('paper.pdf', 100, 'application/pdf');

    $response = $this->post('/author/manuscripts', [
        'title' => 'Another Title',
        'authors' => 'First Last',
        'abstract' => str_repeat('Lorem ipsum ', 10),
        'keywords' => 'science,research',
        'manuscript' => $file,
    ]);

    if (! session()->has('errors')) {
        fwrite(STDERR, "\nResponse status: {$response->status()}\n");
        fwrite(STDERR, "Response content: {$response->getContent()}\n");
    }
    $response->assertSessionHasErrors('manuscript');
});
