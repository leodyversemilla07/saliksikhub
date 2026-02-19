<?php

use App\Models\Announcement;
use App\Models\Journal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses()->group('announcements');
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->journal = Journal::factory()->create();
    app()->instance('currentJournal', $this->journal);
    app()->instance('currentInstitution', $this->journal->institution);

    $this->admin = User::factory()->create(['role' => 'super_admin']);
    $this->author = User::factory()->create(['role' => 'author']);
});

describe('Announcement Admin Routes', function () {
    it('shows announcement index page for admin', function () {
        Announcement::factory()
            ->count(3)
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        $response = $this->actingAs($this->admin)
            ->get('/admin/announcements');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/announcements/index')
            ->has('announcements.data', 3)
        );
    });

    it('shows create announcement form', function () {
        $response = $this->actingAs($this->admin)
            ->get('/admin/announcements/create');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/announcements/create')
            ->has('types')
        );
    });

    it('can store a new announcement', function () {
        $response = $this->actingAs($this->admin)
            ->post('/admin/announcements', [
                'title' => 'Test Announcement',
                'content' => 'This is a test announcement content.',
                'type' => 'general',
                'is_published' => true,
                'is_pinned' => false,
            ]);

        $response->assertRedirect(route('admin.announcements.index'));

        $this->assertDatabaseHas('announcements', [
            'title' => 'Test Announcement',
            'journal_id' => $this->journal->id,
            'user_id' => $this->admin->id,
            'type' => 'general',
            'is_published' => true,
        ]);
    });

    it('auto-sets published_at when publishing', function () {
        $this->actingAs($this->admin)
            ->post('/admin/announcements', [
                'title' => 'Auto Publish Date Test',
                'content' => 'Content here.',
                'type' => 'general',
                'is_published' => true,
                'is_pinned' => false,
            ]);

        $announcement = Announcement::where('title', 'Auto Publish Date Test')->first();
        expect($announcement->published_at)->not->toBeNull();
    });

    it('shows edit form for existing announcement', function () {
        $announcement = Announcement::factory()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        $response = $this->actingAs($this->admin)
            ->get("/admin/announcements/{$announcement->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/announcements/edit')
            ->has('announcement')
            ->has('types')
        );
    });

    it('can update an announcement', function () {
        $announcement = Announcement::factory()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create(['title' => 'Original Title']);

        $response = $this->actingAs($this->admin)
            ->put("/admin/announcements/{$announcement->id}", [
                'title' => 'Updated Title',
                'content' => 'Updated content.',
                'type' => 'event',
                'is_published' => true,
                'is_pinned' => true,
            ]);

        $response->assertRedirect(route('admin.announcements.index'));

        $announcement->refresh();
        expect($announcement->title)->toBe('Updated Title');
        expect($announcement->type)->toBe('event');
        expect($announcement->is_pinned)->toBeTrue();
    });

    it('can delete an announcement', function () {
        $announcement = Announcement::factory()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        $response = $this->actingAs($this->admin)
            ->delete("/admin/announcements/{$announcement->id}");

        $response->assertRedirect(route('admin.announcements.index'));
        $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
    });

    it('prevents editing announcement from another journal', function () {
        $otherJournal = Journal::factory()->create();
        $announcement = Announcement::factory()
            ->forJournal($otherJournal)
            ->byAuthor($this->admin)
            ->create();

        $response = $this->actingAs($this->admin)
            ->get("/admin/announcements/{$announcement->id}/edit");

        $response->assertStatus(403);
    });

    it('prevents non-admin access', function () {
        $response = $this->actingAs($this->author)
            ->get('/admin/announcements');

        $response->assertStatus(403);
    });
});

describe('Public Announcement Routes', function () {
    it('shows published announcements on public page', function () {
        Announcement::factory()
            ->count(3)
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        // Draft should not appear
        Announcement::factory()
            ->draft()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        $response = $this->get('/announcements');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('announcements')
            ->has('announcements.data', 3)
        );
    });

    it('shows single announcement by slug', function () {
        $announcement = Announcement::factory()
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create(['title' => 'My Test Announcement']);

        $response = $this->get("/announcements/{$announcement->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('announcement-show')
            ->has('announcement')
        );
    });

    it('returns 404 for expired announcement', function () {
        $announcement = Announcement::factory()
            ->expired()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        $response = $this->get("/announcements/{$announcement->slug}");

        $response->assertStatus(404);
    });

    it('returns 404 for draft announcement', function () {
        $announcement = Announcement::factory()
            ->draft()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        $response = $this->get("/announcements/{$announcement->slug}");

        $response->assertStatus(404);
    });

    it('does not show announcements from other journals', function () {
        $otherJournal = Journal::factory()->create();

        Announcement::factory()
            ->published()
            ->forJournal($otherJournal)
            ->byAuthor($this->admin)
            ->create();

        Announcement::factory()
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        $response = $this->get('/announcements');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('announcements')
            ->has('announcements.data', 1)
        );
    });
});

describe('Announcement Model', function () {
    it('generates slug from title', function () {
        $announcement = Announcement::factory()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create(['title' => 'My Test Announcement']);

        expect($announcement->slug)->not->toBeNull();
        expect($announcement->slug)->toContain('my-test-announcement');
    });

    it('checks if expired correctly', function () {
        $expired = Announcement::factory()
            ->expired()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        $active = Announcement::factory()
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create(['expires_at' => now()->addMonth()]);

        $noExpiry = Announcement::factory()
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create(['expires_at' => null]);

        expect($expired->isExpired())->toBeTrue();
        expect($active->isExpired())->toBeFalse();
        expect($noExpiry->isExpired())->toBeFalse();
    });

    it('scopes to published only', function () {
        Announcement::factory()
            ->count(2)
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        Announcement::factory()
            ->draft()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        Announcement::factory()
            ->expired()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create();

        expect(Announcement::published()->count())->toBe(2);
    });

    it('orders pinned first then by published_at desc', function () {
        $regular = Announcement::factory()
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create([
                'is_pinned' => false,
                'published_at' => now()->subDays(2),
            ]);

        $pinned = Announcement::factory()
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create([
                'is_pinned' => true,
                'published_at' => now()->subDays(5),
            ]);

        $recent = Announcement::factory()
            ->published()
            ->forJournal($this->journal)
            ->byAuthor($this->admin)
            ->create([
                'is_pinned' => false,
                'published_at' => now()->subDay(),
            ]);

        $ordered = Announcement::ordered()->pluck('id')->toArray();
        expect($ordered[0])->toBe($pinned->id); // Pinned first
        expect($ordered[1])->toBe($recent->id); // Then recent
        expect($ordered[2])->toBe($regular->id); // Then older
    });
});
