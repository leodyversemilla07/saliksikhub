<?php

namespace Database\Factories;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'institution_id' => Institution::factory(),
            'firstname' => fake()->firstName(),
            'lastname' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => fake()->randomElement([
                'author',
                'managing_editor',
                'editor_in_chief',
                'associate_editor',
                'language_editor',
                'reviewer',
            ]),
            'affiliation' => fake()->company(),
            'country' => fake()->country(),
            'username' => fake()->unique()->userName(),
            'avatar' => null, // or generate a fake filename if needed
            'data_collection' => fake()->boolean(),
            'notifications' => fake()->boolean(),
            'review_requests' => fake()->boolean(),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Associate with a specific institution.
     */
    public function forInstitution(Institution $institution): static
    {
        return $this->state(fn (array $attributes) => [
            'institution_id' => $institution->id,
        ]);
    }
}
