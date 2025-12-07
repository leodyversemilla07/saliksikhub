<?php

namespace Database\Factories;

use App\Models\Institution;
use App\Models\Journal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Journal>
 */
class JournalFactory extends Factory
{
    protected $model = Journal::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(4, true).' Journal';
        $abbreviation = strtoupper(fake()->lexify('???J'));

        return [
            'institution_id' => Institution::factory(),
            'name' => ucwords($name),
            'slug' => fake()->unique()->slug(2),
            'abbreviation' => $abbreviation,
            'description' => fake()->paragraph(),
            'issn' => fake()->numerify('####-####'),
            'eissn' => fake()->numerify('####-####'),
            'logo_path' => null,
            'cover_image_path' => null,
            'submission_guidelines' => fake()->paragraphs(3, true),
            'review_policy' => fake()->paragraphs(2, true),
            'publication_frequency' => fake()->randomElement(['Monthly', 'Quarterly', 'Bi-annual', 'Annual']),
            'settings' => [],
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the journal is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
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

    /**
     * Set a custom domain for the journal.
     */
    public function withDomain(string $domain): static
    {
        return $this->state(fn (array $attributes) => [
            'domain' => $domain,
        ]);
    }
}
