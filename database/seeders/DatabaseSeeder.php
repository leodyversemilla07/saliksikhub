<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        // Demo users for each role
        $roles = [
            'managing_editor',
            'editor_in_chief',
            'associate_editor',
            'language_editor',
            'author',
            'reviewer',
        ];

        foreach ($roles as $role) {
            // Ensure the role exists before assignment
            Role::findOrCreate($role, 'web');
            $user = \App\Models\User::factory()->create([
                'role' => $role,
                'email' => $role.'@minsu.edu.ph',
            ]);
            $user->assignRole($role);
        }
    }
}
