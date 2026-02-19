<?php

use App\Models\Journal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses()->group('journal-users');
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->journal = Journal::factory()->create();
    app()->instance('currentJournal', $this->journal);
    app()->instance('currentInstitution', $this->journal->institution);

    $this->admin = User::factory()->create(['role' => 'super_admin']);
    $this->editor = User::factory()->create(['role' => 'managing_editor']);
    $this->author = User::factory()->create(['role' => 'author']);
});

describe('Journal User Index', function () {
    it('shows journal users index page for admin', function () {
        // Assign some users to the journal
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->get('/admin/journal-users');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/journal-users/index')
            ->has('journalUsers.data', 1)
            ->has('roles')
            ->has('filters')
        );
    });

    it('shows empty state when no users assigned', function () {
        $response = $this->actingAs($this->admin)
            ->get('/admin/journal-users');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/journal-users/index')
            ->has('journalUsers.data', 0)
        );
    });

    it('filters users by role', function () {
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);
        $this->journal->users()->attach($this->author->id, [
            'role' => 'author',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->get('/admin/journal-users?role=managing_editor');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('journalUsers.data', 1)
        );
    });

    it('filters users by status', function () {
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);
        $this->journal->users()->attach($this->author->id, [
            'role' => 'author',
            'is_active' => false,
            'assigned_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->get('/admin/journal-users?status=active');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('journalUsers.data', 1)
        );
    });

    it('searches users by name', function () {
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->get('/admin/journal-users?search='.$this->editor->firstname);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('journalUsers.data', 1)
        );
    });

    it('prevents non-admin access', function () {
        $response = $this->actingAs($this->author)
            ->get('/admin/journal-users');

        $response->assertStatus(403);
    });
});

describe('Journal User Assignment', function () {
    it('shows create page for admin', function () {
        $response = $this->actingAs($this->admin)
            ->get('/admin/journal-users/create');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/journal-users/create')
            ->has('availableUsers')
            ->has('roles')
        );
    });

    it('lists only unassigned users on create page', function () {
        // Assign editor to journal
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)
            ->get('/admin/journal-users/create');

        $response->assertStatus(200);
        // Editor should NOT be in available users
        $response->assertInertia(fn ($page) => $page
            ->component('admin/journal-users/create')
            ->where('availableUsers.data', function ($users) {
                $userIds = collect($users)->pluck('id')->toArray();

                return ! in_array($this->editor->id, $userIds);
            })
        );
    });

    it('can assign a user to the journal', function () {
        $user = User::factory()->create(['role' => 'reviewer']);

        $response = $this->actingAs($this->admin)
            ->post('/admin/journal-users', [
                'user_id' => $user->id,
                'role' => 'reviewer',
            ]);

        $response->assertRedirect(route('admin.journal-users.index'));

        $this->assertDatabaseHas('journal_user', [
            'journal_id' => $this->journal->id,
            'user_id' => $user->id,
            'role' => 'reviewer',
            'is_active' => true,
        ]);
    });

    it('prevents duplicate role assignment', function () {
        $user = User::factory()->create(['role' => 'reviewer']);

        // First assignment
        $this->journal->users()->attach($user->id, [
            'role' => 'reviewer',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        // Try duplicate
        $response = $this->actingAs($this->admin)
            ->post('/admin/journal-users', [
                'user_id' => $user->id,
                'role' => 'reviewer',
            ]);

        $response->assertRedirect(route('admin.journal-users.index'));
        $response->assertSessionHas('error');
    });

    it('validates required fields on assignment', function () {
        $response = $this->actingAs($this->admin)
            ->post('/admin/journal-users', []);

        $response->assertSessionHasErrors(['user_id', 'role']);
    });

    it('validates role is a valid journal role', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($this->admin)
            ->post('/admin/journal-users', [
                'user_id' => $user->id,
                'role' => 'invalid_role',
            ]);

        $response->assertSessionHasErrors(['role']);
    });

    it('prevents author from assigning users', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($this->author)
            ->post('/admin/journal-users', [
                'user_id' => $user->id,
                'role' => 'author',
            ]);

        $response->assertStatus(403);
    });
});

describe('Journal User Edit', function () {
    it('shows edit page for a journal user assignment', function () {
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $pivot = DB::table('journal_user')
            ->where('journal_id', $this->journal->id)
            ->where('user_id', $this->editor->id)
            ->first();

        $response = $this->actingAs($this->admin)
            ->get("/admin/journal-users/{$pivot->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/journal-users/edit')
            ->has('journalUser')
            ->has('roles')
        );
    });

    it('can update a journal user role', function () {
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $pivot = DB::table('journal_user')
            ->where('journal_id', $this->journal->id)
            ->where('user_id', $this->editor->id)
            ->first();

        $response = $this->actingAs($this->admin)
            ->put("/admin/journal-users/{$pivot->id}", [
                'role' => 'editor_in_chief',
                'is_active' => true,
            ]);

        $response->assertRedirect(route('admin.journal-users.index'));

        $this->assertDatabaseHas('journal_user', [
            'id' => $pivot->id,
            'role' => 'editor_in_chief',
            'is_active' => true,
        ]);
    });

    it('can deactivate a journal user assignment', function () {
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $pivot = DB::table('journal_user')
            ->where('journal_id', $this->journal->id)
            ->where('user_id', $this->editor->id)
            ->first();

        $response = $this->actingAs($this->admin)
            ->put("/admin/journal-users/{$pivot->id}", [
                'role' => 'managing_editor',
                'is_active' => false,
            ]);

        $response->assertRedirect(route('admin.journal-users.index'));

        $this->assertDatabaseHas('journal_user', [
            'id' => $pivot->id,
            'is_active' => false,
        ]);
    });

    it('returns 404 for pivot from another journal', function () {
        $otherJournal = Journal::factory()->create();
        $otherJournal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $pivot = DB::table('journal_user')
            ->where('journal_id', $otherJournal->id)
            ->where('user_id', $this->editor->id)
            ->first();

        $response = $this->actingAs($this->admin)
            ->get("/admin/journal-users/{$pivot->id}/edit");

        $response->assertStatus(404);
    });

    it('prevents duplicate role when updating', function () {
        // Assign editor with two roles
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'reviewer',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $pivot = DB::table('journal_user')
            ->where('journal_id', $this->journal->id)
            ->where('user_id', $this->editor->id)
            ->where('role', 'reviewer')
            ->first();

        // Try to change reviewer role to managing_editor (which already exists)
        $response = $this->actingAs($this->admin)
            ->put("/admin/journal-users/{$pivot->id}", [
                'role' => 'managing_editor',
                'is_active' => true,
            ]);

        $response->assertSessionHas('error');
    });
});

describe('Journal User Deletion', function () {
    it('can remove a user from the journal', function () {
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $pivot = DB::table('journal_user')
            ->where('journal_id', $this->journal->id)
            ->where('user_id', $this->editor->id)
            ->first();

        $response = $this->actingAs($this->admin)
            ->delete("/admin/journal-users/{$pivot->id}");

        $response->assertRedirect(route('admin.journal-users.index'));

        $this->assertDatabaseMissing('journal_user', [
            'id' => $pivot->id,
        ]);
    });

    it('returns 404 when deleting pivot from another journal', function () {
        $otherJournal = Journal::factory()->create();
        $otherJournal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $pivot = DB::table('journal_user')
            ->where('journal_id', $otherJournal->id)
            ->where('user_id', $this->editor->id)
            ->first();

        $response = $this->actingAs($this->admin)
            ->delete("/admin/journal-users/{$pivot->id}");

        $response->assertStatus(404);
    });
});

describe('Journal User Toggle Status', function () {
    it('can toggle user assignment status', function () {
        $this->journal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $pivot = DB::table('journal_user')
            ->where('journal_id', $this->journal->id)
            ->where('user_id', $this->editor->id)
            ->first();

        // Toggle to inactive
        $response = $this->actingAs($this->admin)
            ->post("/admin/journal-users/{$pivot->id}/toggle-status");

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('journal_user', [
            'id' => $pivot->id,
            'is_active' => false,
        ]);

        // Toggle back to active
        $response = $this->actingAs($this->admin)
            ->post("/admin/journal-users/{$pivot->id}/toggle-status");

        $this->assertDatabaseHas('journal_user', [
            'id' => $pivot->id,
            'is_active' => true,
        ]);
    });

    it('returns 404 for toggle on another journal', function () {
        $otherJournal = Journal::factory()->create();
        $otherJournal->users()->attach($this->editor->id, [
            'role' => 'managing_editor',
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        $pivot = DB::table('journal_user')
            ->where('journal_id', $otherJournal->id)
            ->where('user_id', $this->editor->id)
            ->first();

        $response = $this->actingAs($this->admin)
            ->post("/admin/journal-users/{$pivot->id}/toggle-status");

        $response->assertStatus(404);
    });
});

describe('Access Control', function () {
    it('allows managing_editor to access journal users', function () {
        $response = $this->actingAs($this->editor)
            ->get('/admin/journal-users');

        $response->assertStatus(200);
    });

    it('allows editor_in_chief to access journal users', function () {
        $chiefEditor = User::factory()->create(['role' => 'editor_in_chief']);

        $response = $this->actingAs($chiefEditor)
            ->get('/admin/journal-users');

        $response->assertStatus(200);
    });

    it('prevents author from accessing journal users', function () {
        $response = $this->actingAs($this->author)
            ->get('/admin/journal-users');

        $response->assertStatus(403);
    });

    it('prevents guest from accessing journal users', function () {
        $response = $this->get('/admin/journal-users');

        $response->assertRedirect();
    });

    it('allows managing_editor to assign users', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($this->editor)
            ->post('/admin/journal-users', [
                'user_id' => $user->id,
                'role' => 'author',
            ]);

        $response->assertRedirect(route('admin.journal-users.index'));

        $this->assertDatabaseHas('journal_user', [
            'journal_id' => $this->journal->id,
            'user_id' => $user->id,
            'role' => 'author',
        ]);
    });
});
