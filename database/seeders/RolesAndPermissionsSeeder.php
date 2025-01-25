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
        // Create roles
        $admin = Role::create(['name' => 'admin']);
        $editor = Role::create(['name' => 'editor']);
        $reviewer = Role::create(['name' => 'reviewer']);
        $author = Role::create(['name' => 'author']);

        // Create permissions
        $permissions = [
            'manage users',
            'access all articles',
            'edit articles',
            'publish articles',
            'review articles',
            'submit articles',
            'view submission status',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign permissions to roles
        $admin->givePermissionTo(Permission::all());
        $editor->givePermissionTo(['edit articles', 'publish articles']);
        $reviewer->givePermissionTo('review articles');
        $author->givePermissionTo(['submit articles', 'view submission status']);
    }
}
