<?php

namespace Database\Factories;

use App\Models\Institution;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Institution>
 */
class InstitutionFactory extends Factory
{
    protected $model = Institution::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company().' University';

        return [
            'name' => $name,
            'slug' => fake()->unique()->slug(2),
            'abbreviation' => strtoupper(fake()->lexify('???U')),
            'domain' => null,
            'logo_path' => null,
            'address' => fake()->address(),
            'contact_email' => fake()->companyEmail(),
            'website' => fake()->url(),
            'settings' => [],
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the institution is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Set a custom domain for the institution.
     */
    public function withDomain(string $domain): static
    {
        return $this->state(fn (array $attributes) => [
            'domain' => $domain,
        ]);
    }
}
