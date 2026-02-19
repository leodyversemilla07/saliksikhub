<?php

use App\Models\Journal;
use App\Models\PlatformSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses()->group('platform-settings');
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->journal = Journal::factory()->create();
    app()->instance('currentJournal', $this->journal);
    app()->instance('currentInstitution', $this->journal->institution);

    $this->superAdmin = User::factory()->create(['role' => 'super_admin']);
    $this->editor = User::factory()->create(['role' => 'managing_editor']);
    $this->author = User::factory()->create(['role' => 'author']);
});

describe('PlatformSetting Model', function () {
    it('creates a singleton instance with defaults', function () {
        $settings = PlatformSetting::instance();

        expect($settings)->toBeInstanceOf(PlatformSetting::class)
            ->and($settings->platform_name)->toBe('Research Platform')
            ->and($settings->settings)->toBe(PlatformSetting::getDefaultSettings());
    });

    it('returns the same instance on subsequent calls', function () {
        $first = PlatformSetting::instance();
        $second = PlatformSetting::instance();

        expect($first->id)->toBe($second->id);
    });

    it('provides getSetting helper with dot notation', function () {
        $settings = PlatformSetting::instance();

        expect($settings->getSetting('registration.open_registration'))->toBeTrue()
            ->and($settings->getSetting('security.password_min_length'))->toBe(8)
            ->and($settings->getSetting('nonexistent.key', 'fallback'))->toBe('fallback');
    });

    it('provides merged settings with defaults', function () {
        $settings = PlatformSetting::factory()->create([
            'settings' => ['registration' => ['open_registration' => false]],
        ]);

        $merged = $settings->merged_settings;

        expect($merged['registration']['open_registration'])->toBeFalse()
            ->and($merged['registration']['require_email_verification'])->toBeTrue()
            ->and($merged['security']['password_min_length'])->toBe(8);
    });

    it('provides default settings schema', function () {
        $schema = PlatformSetting::getSettingsSchema();

        expect($schema)->toHaveKeys(['registration', 'security', 'email', 'submissions', 'appearance'])
            ->and($schema['registration'])->toHaveKey('open_registration')
            ->and($schema['registration']['open_registration']['type'])->toBe('boolean');
    });

    it('generates logo url from logo path', function () {
        $settings = PlatformSetting::factory()->create([
            'logo_path' => 'platform/logo.png',
        ]);

        expect($settings->logo_url)->toContain('platform/logo.png');
    });

    it('returns null for logo url when no path', function () {
        $settings = PlatformSetting::factory()->create([
            'logo_path' => null,
        ]);

        expect($settings->logo_url)->toBeNull();
    });

    it('generates favicon url from favicon path', function () {
        $settings = PlatformSetting::factory()->create([
            'favicon_path' => 'platform/favicon.png',
        ]);

        expect($settings->favicon_url)->toContain('platform/favicon.png');
    });

    it('clears cache when saved', function () {
        $settings = PlatformSetting::instance();
        $settings->update(['platform_name' => 'Updated Platform']);

        PlatformSetting::clearCache();
        $fresh = PlatformSetting::instance();

        expect($fresh->platform_name)->toBe('Updated Platform');
    });
});

describe('Platform Settings Admin Routes', function () {
    it('shows settings edit page for super admin', function () {
        $response = $this->actingAs($this->superAdmin)
            ->get('/admin/platform-settings');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/platform-settings/edit')
            ->has('platformSettings')
            ->has('settingsSchema')
        );
    });

    it('denies access to non-super-admin users', function () {
        $response = $this->actingAs($this->editor)
            ->get('/admin/platform-settings');

        $response->assertStatus(403);
    });

    it('denies access to authors', function () {
        $response = $this->actingAs($this->author)
            ->get('/admin/platform-settings');

        $response->assertStatus(403);
    });

    it('denies access to guests', function () {
        $response = $this->get('/admin/platform-settings');

        $response->assertRedirect('/login');
    });

    it('can update platform name and tagline', function () {
        PlatformSetting::instance();

        $response = $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'platform_name' => 'My Research Hub',
                'platform_tagline' => 'Advancing Knowledge',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $updated = PlatformSetting::first();
        expect($updated->platform_name)->toBe('My Research Hub')
            ->and($updated->platform_tagline)->toBe('Advancing Knowledge');
    });

    it('can update admin email', function () {
        PlatformSetting::instance();

        $response = $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'admin_email' => 'newadmin@example.com',
            ]);

        $response->assertRedirect();

        $updated = PlatformSetting::first();
        expect($updated->admin_email)->toBe('newadmin@example.com');
    });

    it('validates admin email format', function () {
        PlatformSetting::instance();

        $response = $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'admin_email' => 'not-an-email',
            ]);

        $response->assertSessionHasErrors('admin_email');
    });

    it('can update nested settings', function () {
        PlatformSetting::instance();

        $response = $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'settings' => [
                    'registration' => [
                        'open_registration' => false,
                    ],
                    'security' => [
                        'password_min_length' => 12,
                    ],
                ],
            ]);

        $response->assertRedirect();

        $updated = PlatformSetting::first();
        expect($updated->getSetting('registration.open_registration'))->toBeFalse()
            ->and($updated->getSetting('security.password_min_length'))->toBe(12);
    });

    it('merges settings with existing values', function () {
        $platformSettings = PlatformSetting::instance();

        // First update - set registration
        $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'settings' => [
                    'registration' => ['open_registration' => false],
                ],
            ]);

        // Second update - set security (registration should persist)
        $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'settings' => [
                    'security' => ['password_min_length' => 16],
                ],
            ]);

        $updated = PlatformSetting::first();
        expect($updated->getSetting('registration.open_registration'))->toBeFalse()
            ->and($updated->getSetting('security.password_min_length'))->toBe(16);
    });

    it('can upload logo', function () {
        Storage::fake('public');
        PlatformSetting::instance();

        $file = UploadedFile::fake()->image('logo.png', 200, 200);

        $response = $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'platform_name' => 'Test Platform',
                'logo' => $file,
            ]);

        $response->assertRedirect();

        $updated = PlatformSetting::first();
        expect($updated->logo_path)->not->toBeNull();
        Storage::disk('public')->assertExists($updated->logo_path);
    });

    it('can upload favicon', function () {
        Storage::fake('public');
        PlatformSetting::instance();

        $file = UploadedFile::fake()->image('favicon.png', 32, 32);

        $response = $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'platform_name' => 'Test Platform',
                'favicon' => $file,
            ]);

        $response->assertRedirect();

        $updated = PlatformSetting::first();
        expect($updated->favicon_path)->not->toBeNull();
        Storage::disk('public')->assertExists($updated->favicon_path);
    });

    it('can remove logo', function () {
        Storage::fake('public');
        $settings = PlatformSetting::instance();
        Storage::disk('public')->put('platform/logo.png', 'fake');
        $settings->update(['logo_path' => 'platform/logo.png']);

        $response = $this->actingAs($this->superAdmin)
            ->delete('/admin/platform-settings/logo');

        $response->assertRedirect();

        $updated = PlatformSetting::first();
        expect($updated->logo_path)->toBeNull();
    });

    it('can remove favicon', function () {
        Storage::fake('public');
        $settings = PlatformSetting::instance();
        Storage::disk('public')->put('platform/favicon.png', 'fake');
        $settings->update(['favicon_path' => 'platform/favicon.png']);

        $response = $this->actingAs($this->superAdmin)
            ->delete('/admin/platform-settings/favicon');

        $response->assertRedirect();

        $updated = PlatformSetting::first();
        expect($updated->favicon_path)->toBeNull();
    });

    it('can reset settings to defaults', function () {
        $settings = PlatformSetting::instance();
        $settings->update([
            'settings' => [
                'registration' => ['open_registration' => false],
                'security' => ['password_min_length' => 32],
            ],
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->post('/admin/platform-settings/reset');

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $updated = PlatformSetting::first();
        expect($updated->settings)->toBe(PlatformSetting::getDefaultSettings());
    });

    it('rejects update from non-super-admin', function () {
        PlatformSetting::instance();

        $response = $this->actingAs($this->editor)
            ->put('/admin/platform-settings', [
                'platform_name' => 'Hacked',
            ]);

        $response->assertStatus(403);
    });

    it('validates platform name max length', function () {
        PlatformSetting::instance();

        $response = $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'platform_name' => str_repeat('a', 256),
            ]);

        $response->assertSessionHasErrors('platform_name');
    });

    it('validates color format', function () {
        PlatformSetting::instance();

        $response = $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'settings' => [
                    'appearance' => [
                        'admin_primary_color' => 'not-a-color',
                    ],
                ],
            ]);

        $response->assertSessionHasErrors('settings.appearance.admin_primary_color');
    });

    it('validates session lifetime range', function () {
        PlatformSetting::instance();

        $response = $this->actingAs($this->superAdmin)
            ->put('/admin/platform-settings', [
                'settings' => [
                    'security' => [
                        'session_lifetime_minutes' => 2,
                    ],
                ],
            ]);

        $response->assertSessionHasErrors('settings.security.session_lifetime_minutes');
    });
});

describe('Platform Settings Shared Props', function () {
    it('shares platform settings with all pages', function () {
        PlatformSetting::factory()->create([
            'platform_name' => 'Test Hub',
            'platform_tagline' => 'Test Tagline',
        ]);
        PlatformSetting::clearCache();

        $response = $this->actingAs($this->superAdmin)->get('/');

        $response->assertInertia(fn ($page) => $page
            ->has('platformSettings')
            ->where('platformSettings.platform_name', 'Test Hub')
            ->where('platformSettings.platform_tagline', 'Test Tagline')
        );
    });
});

describe('PlatformSetting Factory', function () {
    it('creates with default settings', function () {
        $settings = PlatformSetting::factory()->create();

        expect($settings->platform_name)->toBe('Research Platform')
            ->and($settings->settings)->toBe(PlatformSetting::getDefaultSettings());
    });

    it('supports withBranding state', function () {
        $settings = PlatformSetting::factory()
            ->withBranding('Custom Hub', 'Custom Tagline')
            ->create();

        expect($settings->platform_name)->toBe('Custom Hub')
            ->and($settings->platform_tagline)->toBe('Custom Tagline');
    });

    it('supports closedRegistration state', function () {
        $settings = PlatformSetting::factory()
            ->closedRegistration()
            ->create();

        expect($settings->getSetting('registration.open_registration'))->toBeFalse();
    });
});
