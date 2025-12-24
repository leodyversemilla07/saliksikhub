<?php

use App\Models\Manuscript;
use App\Models\ManuscriptIndexing;
use App\Models\User;

beforeEach(function () {
    $this->author = User::factory()->create();
    $this->manuscript = Manuscript::factory()->create([
        'user_id' => $this->author->id,
        'doi' => '10.1234/test.2025.001',
    ]);
});

it('can create an indexing record', function () {
    $indexing = ManuscriptIndexing::create([
        'manuscript_id' => $this->manuscript->id,
        'database_name' => ManuscriptIndexing::DATABASE_CROSSREF,
        'status' => ManuscriptIndexing::STATUS_PENDING,
    ]);

    expect($indexing->manuscript_id)->toBe($this->manuscript->id);
    expect($indexing->database_name)->toBe(ManuscriptIndexing::DATABASE_CROSSREF);
    expect($indexing->isPending())->toBeTrue();
});

it('can mark as submitted', function () {
    $indexing = ManuscriptIndexing::create([
        'manuscript_id' => $this->manuscript->id,
        'database_name' => ManuscriptIndexing::DATABASE_CROSSREF,
        'status' => ManuscriptIndexing::STATUS_PENDING,
    ]);

    $metadata = [
        'doi' => $this->manuscript->doi,
        'title' => $this->manuscript->title,
    ];

    $indexing->markAsSubmitted($metadata);

    expect($indexing->isSubmitted())->toBeTrue();
    expect($indexing->submitted_at)->not->toBeNull();
    expect($indexing->metadata_json)->toBe($metadata);
});

it('can mark as indexed', function () {
    $indexing = ManuscriptIndexing::create([
        'manuscript_id' => $this->manuscript->id,
        'database_name' => ManuscriptIndexing::DATABASE_PUBMED,
        'status' => ManuscriptIndexing::STATUS_SUBMITTED,
    ]);

    $indexing->markAsIndexed('PM123456');

    expect($indexing->isIndexed())->toBeTrue();
    expect($indexing->indexed_at)->not->toBeNull();
    expect($indexing->external_id)->toBe('PM123456');
});

it('can mark as failed', function () {
    $indexing = ManuscriptIndexing::create([
        'manuscript_id' => $this->manuscript->id,
        'database_name' => ManuscriptIndexing::DATABASE_SCOPUS,
        'status' => ManuscriptIndexing::STATUS_SUBMITTED,
    ]);

    $errorMessage = 'Invalid DOI format';
    $indexing->markAsFailed($errorMessage);

    expect($indexing->hasFailed())->toBeTrue();
    expect($indexing->error_message)->toBe($errorMessage);
});

it('belongs to a manuscript', function () {
    $indexing = ManuscriptIndexing::create([
        'manuscript_id' => $this->manuscript->id,
        'database_name' => ManuscriptIndexing::DATABASE_CROSSREF,
        'status' => ManuscriptIndexing::STATUS_PENDING,
    ]);

    expect($indexing->manuscript)->toBeInstanceOf(Manuscript::class);
    expect($indexing->manuscript->id)->toBe($this->manuscript->id);
});

it('has correct status labels', function () {
    $indexing = ManuscriptIndexing::create([
        'manuscript_id' => $this->manuscript->id,
        'database_name' => ManuscriptIndexing::DATABASE_WEB_OF_SCIENCE,
        'status' => ManuscriptIndexing::STATUS_PENDING,
    ]);

    expect($indexing->getStatusLabel())->toBe('Pending Submission');

    $indexing->markAsSubmitted(['doi' => '10.1234/test']);
    expect($indexing->getStatusLabel())->toBe('Submitted to Web of Science');

    $indexing->markAsIndexed();
    expect($indexing->getStatusLabel())->toBe('Successfully Indexed');
});

it('prevents duplicate indexing records for same database', function () {
    ManuscriptIndexing::create([
        'manuscript_id' => $this->manuscript->id,
        'database_name' => ManuscriptIndexing::DATABASE_CROSSREF,
        'status' => ManuscriptIndexing::STATUS_PENDING,
    ]);

    expect(function () {
        ManuscriptIndexing::create([
            'manuscript_id' => $this->manuscript->id,
            'database_name' => ManuscriptIndexing::DATABASE_CROSSREF,
            'status' => ManuscriptIndexing::STATUS_PENDING,
        ]);
    })->toThrow(Exception::class);
});
