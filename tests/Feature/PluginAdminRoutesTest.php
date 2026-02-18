<?php

use App\Models\Journal;
use App\Models\Plugin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses()->group('plugins');
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'super_admin']);
});

describe('Plugin Admin Routes', function () {
    it('shows plugin index page', function () {
        $response = $this->actingAs($this->admin)
            ->get('/admin/plugins');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/plugins/index')
            ->has('plugins')
            ->has('totalPlugins')
            ->has('activePlugins')
        );
    });

    it('shows plugin settings page', function () {
        $plugin = Plugin::create([
            'name' => 'test-plugin',
            'display_name' => 'Test Plugin',
            'version' => '1.0.0',
            'path' => '/path',
            'enabled' => true,
        ]);

        $response = $this->actingAs($this->admin)
            ->get("/admin/plugins/{$plugin->id}/settings");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/plugins/settings')
            ->has('plugin')
            ->has('journals')
        );
    });

    it('can enable a plugin', function () {
        $plugin = Plugin::create([
            'name' => 'enable-test',
            'display_name' => 'Enable Test',
            'version' => '1.0.0',
            'path' => '/path',
            'enabled' => false,
        ]);

        $response = $this->actingAs($this->admin)
            ->post("/admin/plugins/{$plugin->id}/enable");

        $response->assertRedirect();

        $plugin->refresh();
        expect($plugin->enabled)->toBeTrue();
    });

    it('can disable a plugin', function () {
        $plugin = Plugin::create([
            'name' => 'disable-test',
            'display_name' => 'Disable Test',
            'version' => '1.0.0',
            'path' => '/path',
            'enabled' => true,
        ]);

        $response = $this->actingAs($this->admin)
            ->post("/admin/plugins/{$plugin->id}/disable");

        $response->assertRedirect();

        $plugin->refresh();
        expect($plugin->enabled)->toBeFalse();
    });

    it('can enable plugin for specific journal', function () {
        $journal = Journal::factory()->create();
        $plugin = Plugin::create([
            'name' => 'journal-test',
            'display_name' => 'Journal Test',
            'version' => '1.0.0',
            'path' => '/path',
            'is_global' => false,
            'enabled' => false,
        ]);

        $response = $this->actingAs($this->admin)
            ->post("/admin/plugins/{$plugin->id}/enable-for-journal", [
                'journal_id' => $journal->id,
            ]);

        $response->assertRedirect();

        expect($plugin->isActiveForJournal($journal->id))->toBeTrue();
    });

    it('can update plugin settings', function () {
        $plugin = Plugin::create([
            'name' => 'settings-test',
            'display_name' => 'Settings Test',
            'version' => '1.0.0',
            'path' => '/path',
            'settings' => ['key' => 'old_value'],
        ]);

        $response = $this->actingAs($this->admin)
            ->post("/admin/plugins/{$plugin->id}/settings", [
                'settings' => ['key' => 'new_value', 'other' => 'data'],
            ]);

        $response->assertRedirect();

        $plugin->refresh();
        expect($plugin->settings)->toBe(['key' => 'new_value', 'other' => 'data']);
    });

    it('prevents non-admin access', function () {
        $user = User::factory()->create();
        $user->assignRole('author');

        $response = $this->actingAs($user)
            ->get('/admin/plugins');

        $response->assertStatus(403);
    });
});
