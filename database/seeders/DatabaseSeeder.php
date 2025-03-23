<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(100)->create();

        \App\Models\User::create([
            'firstname' => 'Author',
            'lastname' => 'User',
            'role' => 'author',
            'email' => 'author@example.com',
            'affiliation' => 'Research Institute',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        \App\Models\User::create([
            'firstname' => 'John',
            'lastname' => 'Doe',
            'role' => 'author',
            'email' => 'john.doe@example.com',
            'affiliation' => 'Tech Institute',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        \App\Models\User::create([
            'firstname' => 'Jane',
            'lastname' => 'Smith',
            'role' => 'editor',
            'email' => 'jane.smith@example.com',
            'affiliation' => 'Science Academy',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);
    }
}
