<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use App\Models\Journal;
use App\Models\PlatformSetting;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class InstallController extends Controller
{
    /**
     * Show the installation wizard.
     */
    public function index(): Response|RedirectResponse
    {
        if ($this->isInstalled()) {
            return redirect('/');
        }

        return Inertia::render('install/index', [
            'requirements' => $this->checkRequirements(),
        ]);
    }

    /**
     * Process the installation.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($this->isInstalled()) {
            return redirect('/');
        }

        $validated = $request->validate([
            // Admin account
            'admin.firstname' => ['required', 'string', 'max:255'],
            'admin.lastname' => ['required', 'string', 'max:255'],
            'admin.email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'admin.username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'admin.password' => ['required', 'string', 'min:8', 'confirmed'],
            'admin.password_confirmation' => ['required', 'string'],

            // Institution
            'institution.name' => ['required', 'string', 'max:255'],
            'institution.abbreviation' => ['nullable', 'string', 'max:50'],
            'institution.contact_email' => ['nullable', 'email', 'max:255'],
            'institution.website' => ['nullable', 'url:http,https', 'max:255'],
            'institution.address' => ['nullable', 'string', 'max:500'],

            // Journal
            'journal.name' => ['required', 'string', 'max:255'],
            'journal.abbreviation' => ['required', 'string', 'max:50'],
            'journal.description' => ['nullable', 'string', 'max:2000'],

            // Platform settings
            'platform.platform_name' => ['required', 'string', 'max:255'],
            'platform.platform_tagline' => ['nullable', 'string', 'max:255'],
            'platform.platform_description' => ['nullable', 'string', 'max:2000'],
            'platform.admin_email' => ['nullable', 'email', 'max:255'],
        ]);

        DB::transaction(function () use ($validated) {
            // 1. Seed roles and permissions (Spatie)
            (new RolesAndPermissionsSeeder)->run();

            // 2. Create super admin user
            $admin = User::create([
                'firstname' => $validated['admin']['firstname'],
                'lastname' => $validated['admin']['lastname'],
                'email' => $validated['admin']['email'],
                'username' => $validated['admin']['username'],
                'password' => Hash::make($validated['admin']['password']),
                'role' => 'super_admin',
            ]);
            $admin->forceFill(['email_verified_at' => now()])->save();
            $admin->assignRole('super_admin');

            // 3. Create institution
            $institution = Institution::create([
                'name' => $validated['institution']['name'],
                'abbreviation' => $validated['institution']['abbreviation'] ?? null,
                'contact_email' => $validated['institution']['contact_email'] ?? null,
                'website' => $validated['institution']['website'] ?? null,
                'address' => $validated['institution']['address'] ?? null,
                'is_active' => true,
            ]);

            // 4. Associate admin with institution
            $admin->update(['institution_id' => $institution->id]);

            // 5. Create journal
            $journal = Journal::create([
                'institution_id' => $institution->id,
                'name' => $validated['journal']['name'],
                'abbreviation' => $validated['journal']['abbreviation'],
                'description' => $validated['journal']['description'] ?? null,
                'is_active' => true,
                'settings' => [],
                'theme_settings' => [],
            ]);

            // 6. Attach admin to journal with managing_editor role
            $admin->journals()->attach($journal->id, [
                'role' => 'managing_editor',
                'is_active' => true,
                'assigned_at' => now(),
            ]);

            // 7. Create platform settings (update if auto-created by middleware)
            $adminEmail = ! empty($validated['platform']['admin_email'])
                ? $validated['platform']['admin_email']
                : $validated['admin']['email'];

            $platformData = [
                'platform_name' => $validated['platform']['platform_name'],
                'platform_tagline' => $validated['platform']['platform_tagline'] ?? null,
                'platform_description' => $validated['platform']['platform_description'] ?? null,
                'admin_email' => $adminEmail,
                'settings' => PlatformSetting::getDefaultSettings(),
            ];

            $existing = PlatformSetting::first();
            if ($existing) {
                $existing->update($platformData);
            } else {
                PlatformSetting::create($platformData);
            }
            PlatformSetting::clearCache();

            // 8. Mark as installed
            Cache::forever('platform_installed', true);
        });

        return redirect('/login')->with('status', 'Installation complete! Please log in with your admin credentials.');
    }

    /**
     * Check if the platform is already installed.
     */
    private function isInstalled(): bool
    {
        try {
            return User::where('role', 'super_admin')->exists();
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Check system requirements.
     *
     * @return array<string, array{label: string, required: string, current: string, passed: bool}>
     */
    private function checkRequirements(): array
    {
        $dbConnected = $this->checkDatabase();

        return [
            'php_version' => [
                'label' => 'PHP Version',
                'required' => '8.2+',
                'current' => PHP_VERSION,
                'passed' => version_compare(PHP_VERSION, '8.2.0', '>='),
            ],
            'pdo' => [
                'label' => 'PDO Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('pdo') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('pdo'),
            ],
            'mbstring' => [
                'label' => 'Mbstring Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('mbstring') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('mbstring'),
            ],
            'openssl' => [
                'label' => 'OpenSSL Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('openssl') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('openssl'),
            ],
            'tokenizer' => [
                'label' => 'Tokenizer Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('tokenizer') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('tokenizer'),
            ],
            'xml' => [
                'label' => 'XML Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('xml') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('xml'),
            ],
            'ctype' => [
                'label' => 'Ctype Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('ctype') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('ctype'),
            ],
            'json' => [
                'label' => 'JSON Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('json') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('json'),
            ],
            'bcmath' => [
                'label' => 'BCMath Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('bcmath') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('bcmath'),
            ],
            'fileinfo' => [
                'label' => 'Fileinfo Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('fileinfo') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('fileinfo'),
            ],
            'gd' => [
                'label' => 'GD Extension',
                'required' => 'Enabled',
                'current' => extension_loaded('gd') ? 'Enabled' : 'Disabled',
                'passed' => extension_loaded('gd'),
            ],
            'storage_writable' => [
                'label' => 'Storage Directory',
                'required' => 'Writable',
                'current' => is_writable(storage_path()) ? 'Writable' : 'Not Writable',
                'passed' => is_writable(storage_path()),
            ],
            'env_exists' => [
                'label' => '.env File',
                'required' => 'Exists',
                'current' => file_exists(base_path('.env')) ? 'Exists' : 'Missing',
                'passed' => file_exists(base_path('.env')),
            ],
            'database' => [
                'label' => 'Database Connection',
                'required' => 'Connected',
                'current' => $dbConnected ? 'Connected' : 'Failed',
                'passed' => $dbConnected,
            ],
        ];
    }

    /**
     * Check if the database connection is working.
     */
    private function checkDatabase(): bool
    {
        try {
            DB::connection()->getPdo();

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
