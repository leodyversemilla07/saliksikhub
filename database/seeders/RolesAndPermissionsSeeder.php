<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define all roles including super_admin
        $roles = [
            'super_admin',      // Platform-wide administrator (manages all institutions/journals)
            'managing_editor',
            'editor_in_chief',
            'associate_editor',
            'language_editor',
            'author',
            'reviewer',
        ];

        // Create roles for the 'web' guard
        foreach ($roles as $role) {
            Role::firstOrCreate([
                'name' => $role,
                'guard_name' => 'web',
            ]);
        }

        $permissions = [
            // ===== Super Admin / Platform Management Permissions =====
            'manage platform',              // Overall platform management
            'manage institutions',          // CRUD institutions
            'manage journals',              // CRUD journals (across all institutions)
            'manage journal settings',      // Configure journal-specific settings
            'view all institutions',        // View all institutions
            'view all journals',            // View all journals across platform
            'activate journals',            // Activate/deactivate journals
            'activate institutions',        // Activate/deactivate institutions
            'manage users',                 // Manage all users across platform
            'assign roles',                 // Assign roles to users
            'view platform analytics',      // View platform-wide analytics
            'manage platform settings',     // Configure platform-wide settings

            // ===== Managing Editor & EIC =====
            'access dashboard',
            'view statistics',
            'administer system',
            'view all submissions',
            'view all workflow stages',
            'make editorial decisions',
            'overall editorial oversight',

            // ===== Associate Editor =====
            'compose decision letters',
            'track manuscript revisions',
            'track review rounds',
            'log communication',

            // ===== Language Editor =====
            'copyedit manuscripts',
            'language review',

            // ===== Author =====
            'submit manuscripts',
            'upload metadata',
            'upload files',
            'resubmit revised manuscripts',
            'upload required documents',
            'complete submission checklist',
            'respond to feedback',

            // ===== Reviewer =====
            'review manuscripts',
            'upload review reports',
            'upload annotated manuscripts',
            'view performance metrics',
            'receive reminders',
            'receive invitations',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Assign permissions to roles
        $rolePermissions = [
            'super_admin' => [
                // Platform management
                'manage platform',
                'manage institutions',
                'manage journals',
                'manage journal settings',
                'view all institutions',
                'view all journals',
                'activate journals',
                'activate institutions',
                'manage users',
                'assign roles',
                'view platform analytics',
                'manage platform settings',
                // Also has all editorial permissions for oversight
                'access dashboard',
                'view statistics',
                'administer system',
                'view all submissions',
                'view all workflow stages',
                'make editorial decisions',
                'overall editorial oversight',
            ],
            'managing_editor' => [
                'access dashboard',
                'view statistics',
                'administer system',
                'view all submissions',
                'view all workflow stages',
            ],
            'editor_in_chief' => [
                'access dashboard',
                'view statistics',
                'make editorial decisions',
                'view all submissions',
                'view all workflow stages',
                'overall editorial oversight',
            ],
            'associate_editor' => [
                'make editorial decisions',
                'compose decision letters',
                'track manuscript revisions',
                'track review rounds',
                'log communication',
            ],
            'language_editor' => [
                'copyedit manuscripts',
                'language review',
            ],
            'author' => [
                'submit manuscripts',
                'upload metadata',
                'upload files',
                'resubmit revised manuscripts',
                'upload required documents',
                'complete submission checklist',
                'respond to feedback',
            ],
            'reviewer' => [
                'review manuscripts',
                'upload review reports',
                'upload annotated manuscripts',
                'view performance metrics',
                'receive reminders',
                'receive invitations',
            ],
        ];

        foreach ($rolePermissions as $roleName => $perms) {
            $role = Role::where('name', $roleName)->where('guard_name', 'web')->first();
            if ($role) {
                $role->syncPermissions($perms);
            }
        }
    }
}
