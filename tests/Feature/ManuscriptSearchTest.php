<?php

use App\ManuscriptStatus;
use App\Models\Manuscript;
use App\Models\User;

it('allows searching published manuscripts by title', function () {
    $author = User::factory()->create();
    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'title' => 'Machine Learning Applications',
        'status' => ManuscriptStatus::PUBLISHED,
        'authors' => 'John Doe',
        'abstract' => 'This paper discusses machine learning.',
        'keywords' => 'AI, ML',
    ]);

    $response = $this->get('/search?q=Machine+Learning');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('search-results')
        ->has('results.data', 1)
        ->where('results.data.0.title', 'Machine Learning Applications')
        ->where('query', 'Machine Learning')
    );
});

it('allows searching published manuscripts by author', function () {
    $author = User::factory()->create();
    $manuscript = Manuscript::factory()->create([
        'user_id' => $author->id,
        'title' => 'Research Paper',
        'status' => ManuscriptStatus::PUBLISHED,
        'authors' => 'Jane Smith',
        'abstract' => 'Some abstract.',
        'keywords' => 'research',
    ]);

    $response = $this->get('/search?q=Jane+Smith');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('search-results')
        ->has('results.data', 1)
        ->where('results.data.0.authors.0', 'Jane Smith')
    );
});

it('does not return unpublished manuscripts in search results', function () {
    $author = User::factory()->create();
    $published = Manuscript::factory()->create([
        'user_id' => $author->id,
        'title' => 'Published Paper',
        'status' => ManuscriptStatus::PUBLISHED,
        'authors' => 'Author One',
    ]);
    $unpublished = Manuscript::factory()->create([
        'user_id' => $author->id,
        'title' => 'Unpublished Paper',
        'status' => ManuscriptStatus::SUBMITTED,
        'authors' => 'Author Two',
    ]);

    $response = $this->get('/search?q=Paper');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('search-results')
        ->has('results.data', 1)
        ->where('results.data.0.title', 'Published Paper')
    );
});

it('returns no results for empty search', function () {
    $response = $this->get('/search?q=');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('search-results')
        ->has('results.data', 0)
        ->where('query', '')
    );
});

it('handles pagination for search results', function () {
    $author = User::factory()->create();

    // Create 25 published manuscripts
    Manuscript::factory()->count(25)->create([
        'user_id' => $author->id,
        'status' => ManuscriptStatus::PUBLISHED,
        'title' => 'Test Paper',
        'authors' => 'Test Author',
    ]);

    $response = $this->get('/search?q=Test+Paper');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('search-results')
        ->has('results.data', 20) // Default per page
        ->where('results.total', 25)
        ->where('results.last_page', 2)
    );
});
