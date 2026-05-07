<?php

namespace Tests;

use App\Http\Middleware\SlugRedirectMiddleware;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\seed;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Disable Vite during testing to prevent asset resolution issues
        $this->withoutVite();

        // Seed roles and permissions for tests and clear spatie cache
        $this->seed(RolesAndPermissionsSeeder::class);
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // For tests, we use team ID 0 for global roles to avoid NOT NULL constraints in SQLite
        setPermissionsTeamId(0);

        // Disable the SlugRedirectMiddleware in tests to avoid unexpected redirects or 404s
        $this->withoutMiddleware(SlugRedirectMiddleware::class);
    }
}
