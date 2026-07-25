<?php

use App\Enums\ManuscriptStatus;
use App\Models\Journal;
use App\Models\Manuscript;
use App\Services\SidebarWidgetService;

beforeEach(function () {
    $this->service = app(SidebarWidgetService::class);
    // Use the journal already bound by Pest.php, or create one
    if (! app()->bound('currentJournal')) {
        $journal = Journal::factory()->create([
            'name' => 'Test Widget Journal',
            'slug' => 'test-widget-'.uniqid(),
        ]);
        app()->instance('currentJournal', $journal);
    }
    $this->journal = app('currentJournal');
});

it('returns available widget types', function () {
    $types = $this->service->getAvailableTypes();

    expect($types)->toBeArray()
        ->toHaveKeys(['recent_articles', 'keywords', 'journal_info']);

    expect($types['recent_articles'])->toHaveKeys(['name', 'description']);
    expect($types['recent_articles']['name'])->toBe('Recent Articles');
});

it('builds empty widgets from empty config', function () {
    $widgets = $this->service->buildWidgets([], $this->journal->id);

    expect($widgets)->toBe([]);
});

it('filters out disabled widgets', function () {
    $config = [
        ['id' => 'w1', 'type' => 'recent_articles', 'title' => 'Articles', 'enabled' => false, 'order' => 0, 'settings' => []],
    ];

    $widgets = $this->service->buildWidgets($config, $this->journal->id);

    expect($widgets)->toBe([]);
});

it('builds recent articles widget with data', function () {
    // Create published manuscripts
    Manuscript::factory()->count(3)->sequence(
        ['title' => 'Test Article One', 'slug' => 'test-article-one'],
        ['title' => 'Test Article Two', 'slug' => 'test-article-two'],
        ['title' => 'Test Article Three', 'slug' => 'test-article-three'],
    )->create([
        'journal_id' => $this->journal->id,
        'status' => ManuscriptStatus::PUBLISHED,
        'published_at' => now(),
        'authors' => 'John Doe, Jane Smith',
    ]);

    $config = [
        ['id' => 'w1', 'type' => 'recent_articles', 'title' => 'Recent', 'enabled' => true, 'order' => 0, 'settings' => []],
    ];

    $widgets = $this->service->buildWidgets($config, $this->journal->id);

    expect($widgets)->toHaveCount(1);
    expect($widgets[0])->toHaveKeys(['id', 'type', 'title', 'order', 'settings']);
    expect($widgets[0]['type'])->toBe('recent_articles');
    expect($widgets[0]['settings'])->toHaveKey('articles');
    expect($widgets[0]['settings']['articles'])->toHaveCount(3);
});

it('builds keywords widget from manuscript keywords', function () {
    Manuscript::factory()->create([
        'journal_id' => $this->journal->id,
        'status' => ManuscriptStatus::PUBLISHED,
        'title' => 'Keyword Article One',
        'slug' => 'keyword-article-one',
        'keywords' => 'php, laravel, testing',
    ]);
    Manuscript::factory()->create([
        'journal_id' => $this->journal->id,
        'status' => ManuscriptStatus::PUBLISHED,
        'title' => 'Keyword Article Two',
        'slug' => 'keyword-article-two',
        'keywords' => 'php, testing, pest',
    ]);

    $config = [
        ['id' => 'w2', 'type' => 'keywords', 'title' => 'Topics', 'enabled' => true, 'order' => 1, 'settings' => []],
    ];

    $widgets = $this->service->buildWidgets($config, $this->journal->id);

    expect($widgets)->toHaveCount(1);
    expect($widgets[0]['type'])->toBe('keywords');
    expect($widgets[0]['settings'])->toHaveKey('keywords');

    $keywords = collect($widgets[0]['settings']['keywords']);
    expect($keywords->where('name', 'php')->first()['count'])->toBe(2);
    expect($keywords->where('name', 'testing')->first()['count'])->toBe(2);
    expect($keywords->where('name', 'laravel')->first()['count'])->toBe(1);
    expect($keywords->where('name', 'pest')->first()['count'])->toBe(1);
});

it('builds journal info widget', function () {
    $config = [
        ['id' => 'w3', 'type' => 'journal_info', 'title' => 'About', 'enabled' => true, 'order' => 2, 'settings' => []],
    ];

    $widgets = $this->service->buildWidgets($config, $this->journal->id);

    expect($widgets)->toHaveCount(1);
    expect($widgets[0]['type'])->toBe('journal_info');
    expect($widgets[0]['settings'])->toHaveKey('info');
    expect($widgets[0]['settings']['info']['name'])->toBe($this->journal->name);
});

it('builds multiple widgets in order', function () {
    Manuscript::factory()->create([
        'journal_id' => $this->journal->id,
        'status' => ManuscriptStatus::PUBLISHED,
        'published_at' => now(),
        'title' => 'Multiple Widget Article',
        'slug' => 'multiple-widget-article',
    ]);

    $config = [
        ['id' => 'w1', 'type' => 'recent_articles', 'title' => 'Articles', 'enabled' => true, 'order' => 1, 'settings' => []],
        ['id' => 'w3', 'type' => 'journal_info', 'title' => 'Info', 'enabled' => true, 'order' => 0, 'settings' => []],
    ];

    $widgets = $this->service->buildWidgets($config, $this->journal->id);

    expect($widgets)->toHaveCount(2);
    // Widgets are returned in config order (not sorted)
    expect($widgets[0]['id'])->toBe('w1');
    expect($widgets[1]['id'])->toBe('w3');
});

it('skips manuscript drafts in recent articles', function () {
    // Create a draft manuscript (not published)
    Manuscript::factory()->create([
        'journal_id' => $this->journal->id,
        'status' => ManuscriptStatus::SUBMITTED,
        'published_at' => null,
        'title' => 'Draft Article',
        'slug' => 'draft-article',
    ]);

    $config = [
        ['id' => 'w1', 'type' => 'recent_articles', 'title' => 'Articles', 'enabled' => true, 'order' => 0, 'settings' => []],
    ];

    $widgets = $this->service->buildWidgets($config, $this->journal->id);

    expect($widgets[0]['settings']['articles'])->toHaveCount(0);
});

it('returns empty keywords when no published manuscripts exist', function () {
    $config = [
        ['id' => 'w2', 'type' => 'keywords', 'title' => 'Topics', 'enabled' => true, 'order' => 0, 'settings' => []],
    ];

    $widgets = $this->service->buildWidgets($config, $this->journal->id);

    expect($widgets[0]['settings']['keywords'])->toBe([]);
});

it('handles unknown widget types gracefully', function () {
    $config = [
        ['id' => 'w99', 'type' => 'nonexistent_type', 'title' => 'Unknown', 'enabled' => true, 'order' => 0, 'settings' => []],
    ];

    $widgets = $this->service->buildWidgets($config, $this->journal->id);

    // Unknown types pass through as-is (plugins can handle them via filter)
    expect($widgets)->toHaveCount(1);
    expect($widgets[0]['type'])->toBe('nonexistent_type');
});

it('limits recent articles to 5', function () {
    // Create 10 published manuscripts with unique slugs
    for ($i = 1; $i <= 10; $i++) {
        Manuscript::factory()->create([
            'journal_id' => $this->journal->id,
            'status' => ManuscriptStatus::PUBLISHED,
            'published_at' => now(),
            'title' => "Limit Article {$i}",
            'slug' => "limit-article-{$i}",
        ]);
    }

    $config = [
        ['id' => 'w1', 'type' => 'recent_articles', 'title' => 'Articles', 'enabled' => true, 'order' => 0, 'settings' => []],
    ];

    $widgets = $this->service->buildWidgets($config, $this->journal->id);

    expect($widgets[0]['settings']['articles'])->toHaveCount(5);
});
