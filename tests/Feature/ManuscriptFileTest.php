<?php

use App\FileType;
use App\Models\Manuscript;
use App\Models\ManuscriptFile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('manuscripts');

    $this->author = User::factory()->create();
    $this->author->assignRole('author');

    $this->editor = User::factory()->create();
    $this->editor->assignRole('associate_editor');

    $this->manuscript = Manuscript::factory()->create([
        'user_id' => $this->author->id,
    ]);
});

test('author can upload main document', function () {
    $file = UploadedFile::fake()->create('manuscript.pdf', 5000, 'application/pdf');

    $this->actingAs($this->author)
        ->post(route('manuscripts.files.upload', $this->manuscript), [
            'file' => $file,
            'file_type' => 'main_document',
        ])
        ->assertRedirect();

    expect(ManuscriptFile::count())->toBe(1);

    $uploadedFile = ManuscriptFile::first();
    expect($uploadedFile->file_type)->toBe(FileType::MAIN_DOCUMENT)
        ->and($uploadedFile->manuscript_id)->toBe($this->manuscript->id);

    Storage::disk('manuscripts')->assertExists($uploadedFile->storage_path);
});

test('file upload validates file type', function () {
    $file = UploadedFile::fake()->create('document.exe', 1000, 'application/x-msdownload');

    $this->actingAs($this->author)
        ->post(route('manuscripts.files.upload', $this->manuscript), [
            'file' => $file,
            'file_type' => 'main_document',
        ])
        ->assertRedirect()
        ->assertSessionHas('error');
});

test('file upload enforces size limits', function () {
    // Try to upload 150MB file (exceeds 100MB limit for main document)
    $file = UploadedFile::fake()->create('huge.pdf', 150000, 'application/pdf');

    $this->actingAs($this->author)
        ->post(route('manuscripts.files.upload', $this->manuscript), [
            'file' => $file,
            'file_type' => 'main_document',
        ])
        ->assertRedirect()
        ->assertSessionHasErrors('file'); // Laravel validation error for file size
});

test('file versioning works correctly', function () {
    $file1 = UploadedFile::fake()->create('manuscript_v1.pdf', 1000, 'application/pdf');
    $file2 = UploadedFile::fake()->create('manuscript_v2.pdf', 1000, 'application/pdf');

    $this->actingAs($this->author)
        ->post(route('manuscripts.files.upload', $this->manuscript), [
            'file' => $file1,
            'file_type' => 'main_document',
        ]);

    $this->actingAs($this->author)
        ->post(route('manuscripts.files.upload', $this->manuscript), [
            'file' => $file2,
            'file_type' => 'main_document',
        ]);

    $files = ManuscriptFile::where('manuscript_id', $this->manuscript->id)
        ->where('file_type', FileType::MAIN_DOCUMENT)
        ->get();

    expect($files)->toHaveCount(2)
        ->and($files->first()->version)->toBe(1)
        ->and($files->last()->version)->toBe(2);
});

test('author can download their own files', function () {
    $file = ManuscriptFile::factory()->create([
        'manuscript_id' => $this->manuscript->id,
        'uploaded_by' => $this->author->id,
    ]);

    Storage::disk('manuscripts')->put($file->storage_path, 'test content');

    $this->actingAs($this->author)
        ->get(route('manuscripts.files.download', $file))
        ->assertOk()
        ->assertDownload($file->filename);
});

test('editor can download manuscript files', function () {
    $file = ManuscriptFile::factory()->create([
        'manuscript_id' => $this->manuscript->id,
    ]);

    Storage::disk('manuscripts')->put($file->storage_path, 'test content');

    $this->actingAs($this->editor)
        ->get(route('manuscripts.files.download', $file))
        ->assertOk();
});

test('unauthorized user cannot download files', function () {
    $otherUser = User::factory()->create();

    $file = ManuscriptFile::factory()->create([
        'manuscript_id' => $this->manuscript->id,
    ]);

    $this->actingAs($otherUser)
        ->get(route('manuscripts.files.download', $file))
        ->assertForbidden();
});

test('author can delete their files', function () {
    $file = ManuscriptFile::factory()->create([
        'manuscript_id' => $this->manuscript->id,
        'uploaded_by' => $this->author->id,
    ]);

    Storage::disk('manuscripts')->put($file->storage_path, 'test content');

    $this->actingAs($this->author)
        ->delete(route('manuscripts.files.destroy', $file))
        ->assertRedirect();

    expect(ManuscriptFile::count())->toBe(0);
});

test('file list returns grouped by type', function () {
    ManuscriptFile::factory()->create([
        'manuscript_id' => $this->manuscript->id,
        'file_type' => FileType::MAIN_DOCUMENT,
    ]);

    ManuscriptFile::factory()->count(2)->create([
        'manuscript_id' => $this->manuscript->id,
        'file_type' => FileType::FIGURE,
    ]);

    $this->actingAs($this->author)
        ->get(route('manuscripts.files.index', $this->manuscript))
        ->assertOk()
        ->assertJsonStructure([
            'files' => [
                'Main Document',
                'Figure',
            ],
        ]);
});

test('file requirements endpoint returns correct data', function () {
    $this->actingAs($this->author)
        ->get(route('manuscripts.files.requirements', ['file_type' => 'main_document']))
        ->assertOk()
        ->assertJson([
            'file_type' => 'main_document',
            'label' => 'Main Document',
            'max_file_size' => 104857600, // 100MB
            'is_required' => true,
        ])
        ->assertJsonStructure([
            'accepted_mime_types',
            'max_file_size_mb',
        ]);
});

test('file formatted size is correct', function () {
    $file = ManuscriptFile::factory()->create([
        'file_size' => 1048576, // 1MB
    ]);

    expect($file->getFormattedFileSize())->toBe('1.00 MB');

    $file->file_size = 1024;
    expect($file->getFormattedFileSize())->toBe('1.00 KB');

    $file->file_size = 1073741824; // 1GB
    expect($file->getFormattedFileSize())->toBe('1.00 GB');
});
