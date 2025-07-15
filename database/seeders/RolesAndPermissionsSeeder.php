<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
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
            // Managing Editor & EIC
            'access dashboard',
            'view statistics',
            'administer system',
            'view all submissions',
            'view all workflow stages',
            'make editorial decisions',
            'overall editorial oversight',
            // Associate Editor
            'compose decision letters',
            'track manuscript revisions',
            'track review rounds',
            'log communication',
            // Language Editor
            'copyedit manuscripts',
            'language review',
            // Author
            'submit manuscripts',
            'upload metadata',
            'upload files',
            'resubmit revised manuscripts',
            'upload required documents',
            'complete submission checklist',
            'respond to feedback',
            // Reviewer
            'review manuscripts',
            'upload review reports',
            'upload annotated manuscripts',
            'view performance metrics',
            'receive reminders',
            'receive invitations',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign permissions to roles
        $rolePermissions = [
            'managing_editor' => [
                'access dashboard', 'view statistics', 'administer system', 'view all submissions', 'view all workflow stages',
            ],
            'editor_in_chief' => [
                'access dashboard', 'view statistics', 'make editorial decisions', 'view all submissions', 'view all workflow stages', 'overall editorial oversight',
            ],
            'associate_editor' => [
                'make editorial decisions', 'compose decision letters', 'track manuscript revisions', 'track review rounds', 'log communication',
            ],
            'language_editor' => [
                'copyedit manuscripts', 'language review',
            ],
            'author' => [
                'submit manuscripts', 'upload metadata', 'upload files', 'resubmit revised manuscripts', 'upload required documents', 'complete submission checklist', 'respond to feedback',
            ],
            'reviewer' => [
                'review manuscripts', 'upload review reports', 'upload annotated manuscripts', 'view performance metrics', 'receive reminders', 'receive invitations',
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
