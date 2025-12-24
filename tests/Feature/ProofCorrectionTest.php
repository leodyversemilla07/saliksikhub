<?php

use App\Models\Manuscript;
use App\Models\ProofCorrection;
use App\Models\User;

beforeEach(function () {
    $this->author = User::factory()->create();
    $this->manuscript = Manuscript::factory()->create([
        'user_id' => $this->author->id,
    ]);
});

it('can create a proof correction', function () {
    $proof = ProofCorrection::create([
        'manuscript_id' => $this->manuscript->id,
        'proof_round' => 1,
        'proof_file_path' => 'proofs/manuscript-proof-1.pdf',
        'sent_to_author_at' => now(),
        'status' => ProofCorrection::STATUS_PENDING,
    ]);

    expect($proof->manuscript_id)->toBe($this->manuscript->id);
    expect($proof->proof_round)->toBe(1);
    expect($proof->isPending())->toBeTrue();
});

it('can approve a proof', function () {
    $proof = ProofCorrection::create([
        'manuscript_id' => $this->manuscript->id,
        'proof_round' => 1,
        'proof_file_path' => 'proofs/manuscript-proof-1.pdf',
        'sent_to_author_at' => now(),
        'status' => ProofCorrection::STATUS_PENDING,
    ]);

    $proof->approve();

    expect($proof->isApproved())->toBeTrue();
    expect($proof->author_responded_at)->not->toBeNull();
    expect($proof->completed_at)->not->toBeNull();
});

it('can request corrections on a proof', function () {
    $proof = ProofCorrection::create([
        'manuscript_id' => $this->manuscript->id,
        'proof_round' => 1,
        'proof_file_path' => 'proofs/manuscript-proof-1.pdf',
        'sent_to_author_at' => now(),
        'status' => ProofCorrection::STATUS_PENDING,
    ]);

    $corrections = 'Please fix typo on page 5';
    $proof->requestCorrections($corrections);

    expect($proof->needsCorrections())->toBeTrue();
    expect($proof->author_corrections)->toBe($corrections);
    expect($proof->author_responded_at)->not->toBeNull();
});

it('belongs to a manuscript', function () {
    $proof = ProofCorrection::create([
        'manuscript_id' => $this->manuscript->id,
        'proof_round' => 1,
        'status' => ProofCorrection::STATUS_PENDING,
    ]);

    expect($proof->manuscript)->toBeInstanceOf(Manuscript::class);
    expect($proof->manuscript->id)->toBe($this->manuscript->id);
});

it('has correct status labels', function () {
    $proof = ProofCorrection::create([
        'manuscript_id' => $this->manuscript->id,
        'proof_round' => 1,
        'status' => ProofCorrection::STATUS_PENDING,
    ]);

    expect($proof->getStatusLabel())->toBe('Pending Author Review');

    $proof->approve();
    expect($proof->getStatusLabel())->toBe('Approved');
});
