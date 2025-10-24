<?php

use App\Models\Manuscript;
use App\Models\ManuscriptRevision;

it('returns revisions via manuscript_id foreign key', function () {
    $manuscript = Manuscript::factory()->create();
    ManuscriptRevision::factory()->create([
        'manuscript_id' => $manuscript->id,
        'version' => 1,
    ]);

    $revisions = $manuscript->revisions;

    expect($revisions)->toHaveCount(1);
    expect($revisions->first()->manuscript_id)->toBe($manuscript->id);
});
