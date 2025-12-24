<?php

use App\Models\CopyrightAgreement;
use App\Models\Manuscript;
use App\Models\User;

use function Pest\Laravel\{actingAs, assertDatabaseHas};

beforeEach(function () {
    $this->author = User::factory()->create();
    $this->manuscript = Manuscript::factory()->create([
        'user_id' => $this->author->id,
    ]);
});

it('can create a copyright agreement', function () {
    $agreement = CopyrightAgreement::create([
        'manuscript_id' => $this->manuscript->id,
        'author_id' => $this->author->id,
        'agreement_type' => CopyrightAgreement::TYPE_LICENSE_TO_PUBLISH,
        'sent_at' => now(),
    ]);

    expect($agreement->manuscript_id)->toBe($this->manuscript->id);
    expect($agreement->author_id)->toBe($this->author->id);
    expect($agreement->is_signed)->toBeFalse();
    expect($agreement->isPending())->toBeTrue();
});

it('can mark agreement as signed', function () {
    $agreement = CopyrightAgreement::create([
        'manuscript_id' => $this->manuscript->id,
        'author_id' => $this->author->id,
        'agreement_type' => CopyrightAgreement::TYPE_LICENSE_TO_PUBLISH,
        'sent_at' => now(),
    ]);

    $agreement->markAsSigned('digital-signature-hash');

    expect($agreement->is_signed)->toBeTrue();
    expect($agreement->signed_at)->not->toBeNull();
    expect($agreement->signature)->toBe('digital-signature-hash');
    expect($agreement->isSigned())->toBeTrue();
});

it('belongs to a manuscript', function () {
    $agreement = CopyrightAgreement::create([
        'manuscript_id' => $this->manuscript->id,
        'author_id' => $this->author->id,
        'agreement_type' => CopyrightAgreement::TYPE_LICENSE_TO_PUBLISH,
    ]);

    expect($agreement->manuscript)->toBeInstanceOf(Manuscript::class);
    expect($agreement->manuscript->id)->toBe($this->manuscript->id);
});

it('belongs to an author', function () {
    $agreement = CopyrightAgreement::create([
        'manuscript_id' => $this->manuscript->id,
        'author_id' => $this->author->id,
        'agreement_type' => CopyrightAgreement::TYPE_LICENSE_TO_PUBLISH,
    ]);

    expect($agreement->author)->toBeInstanceOf(User::class);
    expect($agreement->author->id)->toBe($this->author->id);
});

it('has correct agreement type labels', function () {
    $agreement = CopyrightAgreement::create([
        'manuscript_id' => $this->manuscript->id,
        'author_id' => $this->author->id,
        'agreement_type' => CopyrightAgreement::TYPE_LICENSE_TO_PUBLISH,
    ]);

    expect($agreement->getAgreementTypeLabel())->toBe('License to Publish');
});
