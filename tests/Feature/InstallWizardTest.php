<?php

use App\Http\Middleware\EnsureInstalled;
use App\Models\Institution;
use App\Models\Journal;
use App\Models\PlatformSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Reset the installed state so the middleware redirects to /install
    EnsureInstalled::resetInstallState();
});

/*
|--------------------------------------------------------------------------
| Installation Page Access
|--------------------------------------------------------------------------
*/

test('install page is accessible when platform is not installed', function () {
    $response = $this->get('/install');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('install/index')
        ->has('requirements')
    );
});

test('install page redirects to home when platform is already installed', function () {
    User::factory()->create(['role' => 'super_admin']);

    $response = $this->get('/install');

    $response->assertRedirect('/');
});

test('install page includes all system requirements', function () {
    $response = $this->get('/install');

    $response->assertInertia(fn ($page) => $page
        ->component('install/index')
        ->has('requirements.php_version')
        ->has('requirements.pdo')
        ->has('requirements.mbstring')
        ->has('requirements.openssl')
        ->has('requirements.database')
        ->has('requirements.storage_writable')
        ->has('requirements.env_exists')
    );
});

/*
|--------------------------------------------------------------------------
| Installation Submission
|--------------------------------------------------------------------------
*/

test('install creates admin user, institution, journal, and platform settings', function () {
    $response = $this->post('/install', [
        'admin' => [
            'firstname' => 'John',
            'lastname' => 'Admin',
            'email' => 'admin@example.com',
            'username' => 'johnadmin',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ],
        'institution' => [
            'name' => 'Test University',
            'abbreviation' => 'TU',
            'contact_email' => 'contact@tu.edu',
            'website' => 'https://tu.edu',
            'address' => '123 Main St',
        ],
        'journal' => [
            'name' => 'Test Journal',
            'abbreviation' => 'TJ',
            'description' => 'A test journal for research.',
        ],
        'platform' => [
            'platform_name' => 'TestPlatform',
            'platform_tagline' => 'Open Research',
            'platform_description' => 'A research platform.',
            'admin_email' => 'platform@example.com',
        ],
    ]);

    $response->assertRedirect('/login');

    // Verify admin user was created
    $admin = User::where('email', 'admin@example.com')->first();
    expect($admin)->not->toBeNull();
    expect($admin->role)->toBe('super_admin');
    expect($admin->firstname)->toBe('John');
    expect($admin->lastname)->toBe('Admin');
    expect($admin->username)->toBe('johnadmin');
    expect($admin->email_verified_at)->not->toBeNull();
    expect(Hash::check('password123', $admin->password))->toBeTrue();

    // Verify institution was created
    $institution = Institution::where('name', 'Test University')->first();
    expect($institution)->not->toBeNull();
    expect($institution->abbreviation)->toBe('TU');
    expect($institution->contact_email)->toBe('contact@tu.edu');
    expect($institution->is_active)->toBeTrue();

    // Verify admin is associated with institution
    expect($admin->fresh()->institution_id)->toBe($institution->id);

    // Verify journal was created
    $journal = Journal::where('name', 'Test Journal')->first();
    expect($journal)->not->toBeNull();
    expect($journal->abbreviation)->toBe('TJ');
    expect($journal->institution_id)->toBe($institution->id);
    expect($journal->is_active)->toBeTrue();

    // Verify admin is attached to journal
    expect($admin->journals()->where('journals.id', $journal->id)->exists())->toBeTrue();

    // Verify platform settings were created
    PlatformSetting::clearCache();
    $settings = PlatformSetting::first();
    expect($settings)->not->toBeNull();
    expect($settings->platform_name)->toBe('TestPlatform');
    expect($settings->platform_tagline)->toBe('Open Research');
    expect($settings->admin_email)->toBe('platform@example.com');

    // Verify installed flag is cached
    expect(Cache::get('platform_installed'))->toBeTrue();
});

test('install uses admin email as platform admin email when not provided', function () {
    $this->post('/install', [
        'admin' => [
            'firstname' => 'Jane',
            'lastname' => 'Admin',
            'email' => 'jane@example.com',
            'username' => 'janeadmin',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ],
        'institution' => [
            'name' => 'Test University',
        ],
        'journal' => [
            'name' => 'Test Journal',
            'abbreviation' => 'TJ',
        ],
        'platform' => [
            'platform_name' => 'TestPlatform',
            'admin_email' => '',
        ],
    ]);

    PlatformSetting::clearCache();
    $settings = PlatformSetting::first();
    expect($settings->admin_email)->toBe('jane@example.com');
});

test('install prevents duplicate submission when already installed', function () {
    User::factory()->create(['role' => 'super_admin']);

    $response = $this->post('/install', [
        'admin' => [
            'firstname' => 'Another',
            'lastname' => 'Admin',
            'email' => 'another@example.com',
            'username' => 'anotheradmin',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ],
        'institution' => [
            'name' => 'Another University',
        ],
        'journal' => [
            'name' => 'Another Journal',
            'abbreviation' => 'AJ',
        ],
        'platform' => [
            'platform_name' => 'AnotherPlatform',
        ],
    ]);

    $response->assertRedirect('/');
    expect(User::where('role', 'super_admin')->count())->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

test('install validates required admin fields', function () {
    $response = $this->post('/install', [
        'admin' => [
            'firstname' => '',
            'lastname' => '',
            'email' => '',
            'username' => '',
            'password' => '',
            'password_confirmation' => '',
        ],
        'institution' => ['name' => 'Test University'],
        'journal' => ['name' => 'Test Journal', 'abbreviation' => 'TJ'],
        'platform' => ['platform_name' => 'TestPlatform'],
    ]);

    $response->assertSessionHasErrors([
        'admin.firstname',
        'admin.email',
        'admin.username',
        'admin.password',
    ]);
});

test('install validates required institution name', function () {
    $response = $this->post('/install', [
        'admin' => [
            'firstname' => 'John',
            'lastname' => 'Admin',
            'email' => 'admin@example.com',
            'username' => 'johnadmin',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ],
        'institution' => ['name' => ''],
        'journal' => ['name' => 'Test Journal', 'abbreviation' => 'TJ'],
        'platform' => ['platform_name' => 'TestPlatform'],
    ]);

    $response->assertSessionHasErrors(['institution.name']);
});

test('install validates required journal fields', function () {
    $response = $this->post('/install', [
        'admin' => [
            'firstname' => 'John',
            'lastname' => 'Admin',
            'email' => 'admin@example.com',
            'username' => 'johnadmin',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ],
        'institution' => ['name' => 'Test University'],
        'journal' => ['name' => '', 'abbreviation' => ''],
        'platform' => ['platform_name' => 'TestPlatform'],
    ]);

    $response->assertSessionHasErrors(['journal.name', 'journal.abbreviation']);
});

test('install validates required platform name', function () {
    $response = $this->post('/install', [
        'admin' => [
            'firstname' => 'John',
            'lastname' => 'Admin',
            'email' => 'admin@example.com',
            'username' => 'johnadmin',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ],
        'institution' => ['name' => 'Test University'],
        'journal' => ['name' => 'Test Journal', 'abbreviation' => 'TJ'],
        'platform' => ['platform_name' => ''],
    ]);

    $response->assertSessionHasErrors(['platform.platform_name']);
});

test('install validates password confirmation must match', function () {
    $response = $this->post('/install', [
        'admin' => [
            'firstname' => 'John',
            'lastname' => 'Admin',
            'email' => 'admin@example.com',
            'username' => 'johnadmin',
            'password' => 'password123',
            'password_confirmation' => 'different',
        ],
        'institution' => ['name' => 'Test University'],
        'journal' => ['name' => 'Test Journal', 'abbreviation' => 'TJ'],
        'platform' => ['platform_name' => 'TestPlatform'],
    ]);

    $response->assertSessionHasErrors(['admin.password']);
});

test('install validates password minimum length', function () {
    $response = $this->post('/install', [
        'admin' => [
            'firstname' => 'John',
            'lastname' => 'Admin',
            'email' => 'admin@example.com',
            'username' => 'johnadmin',
            'password' => 'short',
            'password_confirmation' => 'short',
        ],
        'institution' => ['name' => 'Test University'],
        'journal' => ['name' => 'Test Journal', 'abbreviation' => 'TJ'],
        'platform' => ['platform_name' => 'TestPlatform'],
    ]);

    $response->assertSessionHasErrors(['admin.password']);
});

test('install validates unique email', function () {
    User::factory()->create(['email' => 'existing@example.com', 'role' => 'author']);

    $response = $this->post('/install', [
        'admin' => [
            'firstname' => 'John',
            'lastname' => 'Admin',
            'email' => 'existing@example.com',
            'username' => 'johnadmin',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ],
        'institution' => ['name' => 'Test University'],
        'journal' => ['name' => 'Test Journal', 'abbreviation' => 'TJ'],
        'platform' => ['platform_name' => 'TestPlatform'],
    ]);

    $response->assertSessionHasErrors(['admin.email']);
});

test('install validates unique username', function () {
    User::factory()->create(['username' => 'existinguser', 'role' => 'author']);

    $response = $this->post('/install', [
        'admin' => [
            'firstname' => 'John',
            'lastname' => 'Admin',
            'email' => 'admin@example.com',
            'username' => 'existinguser',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ],
        'institution' => ['name' => 'Test University'],
        'journal' => ['name' => 'Test Journal', 'abbreviation' => 'TJ'],
        'platform' => ['platform_name' => 'TestPlatform'],
    ]);

    $response->assertSessionHasErrors(['admin.username']);
});

/*
|--------------------------------------------------------------------------
| EnsureInstalled Middleware
|--------------------------------------------------------------------------
*/

test('middleware redirects to install when no admin exists', function () {
    $response = $this->get('/');

    $response->assertRedirect('/install');
});

test('middleware allows access when platform is installed', function () {
    User::factory()->create(['role' => 'super_admin']);

    $institution = Institution::factory()->create();
    Journal::factory()->create(['institution_id' => $institution->id, 'is_active' => true]);

    $response = $this->get('/');

    $response->assertStatus(200);
});

test('middleware caches installed state', function () {
    User::factory()->create(['role' => 'super_admin']);
    $institution = Institution::factory()->create();
    Journal::factory()->create(['institution_id' => $institution->id, 'is_active' => true]);

    $this->get('/');

    expect(Cache::get('platform_installed'))->toBeTrue();
});

test('install route is not blocked by middleware', function () {
    $response = $this->get('/install');

    $response->assertStatus(200);
});
