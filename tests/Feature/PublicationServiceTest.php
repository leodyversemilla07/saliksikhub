<?php

use App\Models\CopyrightAgreement;
use App\Models\Manuscript;
use App\Models\ManuscriptIndexing;
use App\Models\ProofCorrection;
use App\Models\User;
use App\Services\PublicationService;

beforeEach(function () {
    $this->publicationService = app(PublicationService::class);
    $this->author = User::factory()->create();
    $this->manuscript = Manuscript::factory()->create([
        'user_id' => $this->author->id,
        'doi' => '10.1234/test.2025.001',
    ]);
});

it('can send copyright agreement', function () {
    $agreement = $this->publicationService->sendCopyrightAgreement(
        $this->manuscript,
        CopyrightAgreement::TYPE_LICENSE_TO_PUBLISH,
        CopyrightAgreement::LICENSE_CC_BY
    );

    expect($agreement)->toBeInstanceOf(CopyrightAgreement::class);
    expect($agreement->manuscript_id)->toBe($this->manuscript->id);
    expect($agreement->sent_at)->not->toBeNull();
});

it('can sign copyright agreement', function () {
    $agreement = CopyrightAgreement::create([
        'manuscript_id' => $this->manuscript->id,
        'author_id' => $this->author->id,
        'agreement_type' => CopyrightAgreement::TYPE_LICENSE_TO_PUBLISH,
        'sent_at' => now(),
    ]);

    $result = $this->publicationService->signCopyrightAgreement(
        $agreement,
        'digital-signature'
    );

    expect($result)->toBeTrue();
    expect($agreement->fresh()->is_signed)->toBeTrue();
});

it('can send proofs to author', function () {
    $proof = $this->publicationService->sendProofsToAuthor(
        $this->manuscript,
        'proofs/manuscript-proof.pdf'
    );

    expect($proof)->toBeInstanceOf(ProofCorrection::class);
    expect($proof->manuscript_id)->toBe($this->manuscript->id);
    expect($proof->proof_round)->toBe(1);
    expect($proof->sent_to_author_at)->not->toBeNull();
});

it('increments proof round correctly', function () {
    // First proof
    $proof1 = $this->publicationService->sendProofsToAuthor(
        $this->manuscript,
        'proofs/manuscript-proof-1.pdf'
    );

    expect($proof1->proof_round)->toBe(1);

    // Second proof
    $proof2 = $this->publicationService->sendProofsToAuthor(
        $this->manuscript,
        'proofs/manuscript-proof-2.pdf'
    );

    expect($proof2->proof_round)->toBe(2);
});

it('can process proof approval', function () {
    $proof = ProofCorrection::create([
        'manuscript_id' => $this->manuscript->id,
        'proof_round' => 1,
        'status' => ProofCorrection::STATUS_PENDING,
    ]);

    $result = $this->publicationService->processProofResponse($proof, true);

    expect($result)->toBeTrue();
    expect($proof->fresh()->isApproved())->toBeTrue();
});

it('can process proof corrections', function () {
    $proof = ProofCorrection::create([
        'manuscript_id' => $this->manuscript->id,
        'proof_round' => 1,
        'status' => ProofCorrection::STATUS_PENDING,
    ]);

    $corrections = 'Fix typo on page 3';
    $result = $this->publicationService->processProofResponse($proof, false, $corrections);

    expect($result)->toBeTrue();
    expect($proof->fresh()->needsCorrections())->toBeTrue();
    expect($proof->fresh()->author_corrections)->toBe($corrections);
});

it('can submit to indexing databases', function () {
    $results = $this->publicationService->submitToIndexingDatabases($this->manuscript);

    expect($results)->toBeArray();
    expect($results)->toHaveKeys(['CrossRef', 'Google Scholar']);
});

it('creates indexing records when submitting', function () {
    $this->publicationService->submitToIndexingDatabases($this->manuscript);

    $crossrefIndexing = ManuscriptIndexing::where('manuscript_id', $this->manuscript->id)
        ->where('database_name', ManuscriptIndexing::DATABASE_CROSSREF)
        ->first();

    expect($crossrefIndexing)->not->toBeNull();
    expect($crossrefIndexing->status)->toBeIn([
        ManuscriptIndexing::STATUS_SUBMITTED,
        ManuscriptIndexing::STATUS_PENDING,
    ]);
});

it('does not resubmit already indexed manuscripts', function () {
    // Create an already indexed record
    ManuscriptIndexing::create([
        'manuscript_id' => $this->manuscript->id,
        'database_name' => ManuscriptIndexing::DATABASE_CROSSREF,
        'status' => ManuscriptIndexing::STATUS_INDEXED,
        'indexed_at' => now(),
    ]);

    $results = $this->publicationService->submitToIndexingDatabases($this->manuscript);

    expect($results[ManuscriptIndexing::DATABASE_CROSSREF])->toBe('already_indexed');
});

it('can confirm indexing', function () {
    $indexing = ManuscriptIndexing::create([
        'manuscript_id' => $this->manuscript->id,
        'database_name' => ManuscriptIndexing::DATABASE_PUBMED,
        'status' => ManuscriptIndexing::STATUS_SUBMITTED,
    ]);

    $result = $this->publicationService->confirmIndexing($indexing, 'PM123456');

    expect($result)->toBeTrue();
    expect($indexing->fresh()->isIndexed())->toBeTrue();
    expect($indexing->fresh()->external_id)->toBe('PM123456');
});
