<?php

namespace Database\Factories;

use App\Models\Manuscript;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ManuscriptAuthorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'manuscript_id' => Manuscript::factory(),
            'user_id' => User::factory(),
            'author_order' => $this->faker->numberBetween(1, 5),
            'is_corresponding' => false,
            'contribution_role' => $this->faker->randomElements([
                'Conceptualization',
                'Data curation',
                'Formal analysis',
                'Funding acquisition',
                'Investigation',
                'Methodology',
                'Project administration',
                'Resources',
                'Software',
                'Supervision',
                'Validation',
                'Visualization',
                'Writing – original draft',
                'Writing – review & editing',
            ], $this->faker->numberBetween(2, 5)),
        ];
    }

    /**
     * Indicate that this is the corresponding author.
     */
    public function corresponding(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_corresponding' => true,
            'author_order' => 1,
        ]);
    }

    /**
     * Set specific author order.
     */
    public function order(int $order): static
    {
        return $this->state(fn (array $attributes) => [
            'author_order' => $order,
        ]);
    }
}
