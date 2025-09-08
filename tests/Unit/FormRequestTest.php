<?php

use App\Http\Requests\StoreManuscriptRequest;
use App\Http\Requests\SubmitRevisionRequest;

it('has expected rules for StoreManuscriptRequest', function () {
    $request = new StoreManuscriptRequest;

    $rules = $request->rules();

    expect($rules)->toHaveKey('title')
        ->and($rules['title'])->toBe('required|string|min:10');

    expect($rules)->toHaveKey('manuscript')
        ->and($rules['manuscript'])->toBe('required|mimes:docx|max:10240');
});

it('has expected rules for SubmitRevisionRequest', function () {
    $request = new SubmitRevisionRequest;

    $rules = $request->rules();

    expect($rules)->toHaveKey('revised_manuscript')
        ->and($rules['revised_manuscript'])->toBe('required|mimes:pdf|max:10240');

    expect($rules)->toHaveKey('revision_comments')
        ->and($rules['revision_comments'])->toBe('required|string|min:10');
});
