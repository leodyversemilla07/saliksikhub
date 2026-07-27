<?php

use App\Models\Issue;
use App\Models\Journal;
use App\Models\Manuscript;
use App\Services\OJSImportService;

use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    $this->journal = Journal::factory()->create([
        'name' => 'Test Journal',
        'slug' => 'test-journal',
    ]);

    $this->importer = app(OJSImportService::class);
    $this->xmlPath = __DIR__.'/../Fixtures/ojs-import-sample.xml';
});

it('imports issues and articles from a valid OJS XML file', function () {
    $stats = $this->importer->import($this->journal, $this->xmlPath);

    expect($stats['issues'])->toBe(2);
    expect($stats['articles'])->toBe(3);
    expect($stats['authors'])->toBe(5);
    expect($stats['skipped'])->toBe(0);
    expect($stats['errors'])->toBeEmpty();
});

it('creates issues in the database', function () {
    $this->importer->import($this->journal, $this->xmlPath);

    $issues = Issue::where('journal_id', $this->journal->id)->get();
    expect($issues)->toHaveCount(2);

    $issue1 = $issues->firstWhere('issue_number', '2');
    expect($issue1)->not->toBeNull();
    expect((int) $issue1->volume_number)->toBe(10);
    expect($issue1->issue_title)->toContain('Special Issue on Philippine Biodiversity');
    expect($issue1->status)->toBe(Issue::STATUS_PUBLISHED);
});

it('creates manuscripts with correct metadata', function () {
    $this->importer->import($this->journal, $this->xmlPath);

    $manuscript = Manuscript::where('doi', '10.1234/saliksik.v10i2.101')->first();
    expect($manuscript)->not->toBeNull();
    expect($manuscript->title)->toBe('Endemic Amphibians of the Sierra Madre Mountain Range');
    expect($manuscript->abstract)->toContain('amphibian populations');
    expect($manuscript->page_range)->toBe('1-15');
    expect((int) $manuscript->volume)->toBe(10);
    expect($manuscript->issue)->toBe('2');
    expect($manuscript->category)->toBe('Research Article');
    expect($manuscript->authors)->toContain('Maria Santos');
    expect($manuscript->authors)->toContain('Juan dela Cruz');
});

it('maps section_ref to correct categories', function () {
    $this->importer->import($this->journal, $this->xmlPath);

    expect(Manuscript::where('doi', '10.1234/saliksik.v10i2.102')->first()->category)->toBe('Review Article');
    expect(Manuscript::where('doi', '10.1234/saliksik.v10i3.103')->first()->category)->toBe('Case Report');
});

it('skips articles with existing DOIs when skip_existing_dois is enabled', function () {
    // Import first time
    $stats1 = $this->importer->import($this->journal, $this->xmlPath, [
        'skip_existing_dois' => true,
    ]);

    expect($stats1['articles'])->toBe(3);

    // Import again
    $stats2 = $this->importer->import($this->journal, $this->xmlPath, [
        'skip_existing_dois' => true,
    ]);

    expect($stats2['articles'])->toBe(0);
    expect($stats2['skipped'])->toBe(3);
});

it('returns early for invalid XML', function () {
    $stats = $this->importer->import($this->journal, 'not a valid xml file');

    expect($stats['errors'])->not->toBeEmpty();
    expect($stats['issues'])->toBe(0);
});

it('returns early for missing file path', function () {
    $stats = $this->importer->import($this->journal, '/nonexistent/path/file.xml');

    expect($stats['errors'])->not->toBeEmpty();
    expect($stats['issues'])->toBe(0);
});

it('creates the importer user', function () {
    $this->importer->import($this->journal, $this->xmlPath);

    assertDatabaseHas('users', [
        'email' => 'ojs-import@saliksikhub.local',
        'firstname' => 'OJS',
        'lastname' => 'Import',
    ]);
});
