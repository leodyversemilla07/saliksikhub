<?php

namespace Tests;

use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

use function Pest\Laravel\seed;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions for tests and clear spatie cache
        $this->seed(RolesAndPermissionsSeeder::class);
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        // Disable the SlugRedirectMiddleware in tests to avoid unexpected redirects or 404s
        $this->withoutMiddleware(\App\Http\Middleware\SlugRedirectMiddleware::class);
    }
}
