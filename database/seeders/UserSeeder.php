<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'firstname' => 'Leif Sage',
                'lastname' => 'Semilla',
                'username' => 'leifsagesemilla',
                'email' => 'leifsagesemilla@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'language_editor',
                'affiliation' => 'Mindoro State University - Bongabong Campus',
                'country' => 'Philippines',
                'email_verified_at' => now(),
                'data_collection' => true,
                'notifications' => true,
                'review_requests' => true,
            ],
            [
                'firstname' => 'Leodyver',
                'lastname' => 'Semilla',
                'username' => 'leodyversemilla07',
                'email' => 'leodyversemilla07@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'author',
                'affiliation' => 'Mindoro State University - Bongabong Campus',
                'country' => 'Philippines',
                'email_verified_at' => now(),
                'data_collection' => true,
                'notifications' => true,
                'review_requests' => true,
            ],
            [
                'firstname' => 'LeodyBriel',
                'lastname' => 'Zilvrak',
                'username' => 'leobrielzilvrak',
                'email' => 'leobrielzilvrak@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'managing_editor',
                'affiliation' => 'Mindoro State University - Bongabong Campus',
                'country' => 'Philippines',
                'email_verified_at' => now(),
                'data_collection' => true,
                'notifications' => true,
                'review_requests' => true,
            ],
            [
                'firstname' => 'Addison',
                'lastname' => 'Rau',
                'username' => 'rau.addison',
                'email' => 'rau.addison@minsu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'managing_editor',
                'affiliation' => 'Upton, King and Raynor',
                'country' => 'Philippines',
                'email_verified_at' => now(),
                'data_collection' => true,
                'notifications' => true,
                'review_requests' => true,
            ],
            [
                'firstname' => 'Cleora',
                'lastname' => 'Schultz',
                'username' => 'schultz.cleora',
                'email' => 'schultz.cleora@minsu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'editor_in_chief',
                'affiliation' => 'O\'Keefe-Schaefer',
                'country' => 'Andorra',
                'email_verified_at' => now(),
                'data_collection' => true,
                'notifications' => true,
                'review_requests' => true,
            ],
            [
                'firstname' => 'Sophia',
                'lastname' => 'Rempel',
                'username' => 'rempel.sophia',
                'email' => 'rempel.sophia@minsu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'associate_editor',
                'affiliation' => 'Walter and Sons',
                'country' => 'New Zealand',
                'email_verified_at' => now(),
                'data_collection' => true,
                'notifications' => true,
                'review_requests' => true,
            ],
            [
                'firstname' => 'Carroll',
                'lastname' => 'Carroll',
                'username' => 'carroll.carroll',
                'email' => 'carroll.carroll@minsu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'author',
                'affiliation' => 'Kuhn PLC',
                'country' => 'Bonaire, Sint Eustatius and Saba',
                'email_verified_at' => now(),
                'data_collection' => true,
                'notifications' => true,
                'review_requests' => true,
            ],
            [
                'firstname' => 'Clovis',
                'lastname' => 'Wunsch',
                'username' => 'wunsch.clovis',
                'email' => 'wunsch.clovis@minsu.edu.ph',
                'password' => Hash::make('password123'),
                'role' => 'reviewer',
                'affiliation' => 'Rodriguez Ltd',
                'country' => 'Christmas Island',
                'email_verified_at' => now(),
                'data_collection' => true,
                'notifications' => true,
                'review_requests' => true,
            ],
        ];

        foreach ($users as $userData) {
            // Remove avatar_url if present
            unset($userData['avatar_url']);
            $roleName = $userData['role'];
            $user = User::firstOrCreate(
                ['email' => $userData['email']], // Check by email to avoid duplicates
                $userData
            );
            if ($roleName) {
                $user->assignRole($roleName);
            }
        }

        // Create additional users using UserFactory
        $factoryUsers = User::factory()->count(50)->make();
        foreach ($factoryUsers as $factoryUser) {
            $userData = $factoryUser->toArray();
            unset($userData['avatar_url']);
            if (empty($userData['password'])) {
                $userData['password'] = \Illuminate\Support\Facades\Hash::make('password');
            }
            $user = User::firstOrCreate(
                ['email' => $factoryUser->email],
                $userData
            );
            if ($user->role) {
                $user->assignRole($user->role);
            }
        }
    }
}
