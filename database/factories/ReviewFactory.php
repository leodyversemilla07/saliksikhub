<?php

namespace Database\Factories;

use App\Models\Manuscript;
use App\Models\User;
use App\ReviewRecommendation;
use App\ReviewStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
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
            'reviewer_id' => User::factory(),
            'review_round' => 1,
            'invitation_sent_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'due_date' => $this->faker->dateTimeBetween('now', '+30 days'),
            'status' => ReviewStatus::INVITED,
        ];
    }

    /**
     * Indicate that the review invitation has been accepted.
     */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReviewStatus::ACCEPTED,
            'invitation_response' => 'accepted',
            'response_date' => now(),
        ]);
    }

    /**
     * Indicate that the review is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReviewStatus::IN_PROGRESS,
            'invitation_response' => 'accepted',
            'response_date' => $this->faker->dateTimeBetween('-20 days', '-10 days'),
        ]);
    }

    /**
     * Indicate that the review has been completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReviewStatus::COMPLETED,
            'invitation_response' => 'accepted',
            'response_date' => $this->faker->dateTimeBetween('-30 days', '-20 days'),
            'review_submitted_at' => $this->faker->dateTimeBetween('-15 days', 'now'),
            'recommendation' => $this->faker->randomElement(ReviewRecommendation::cases()),
            'author_comments' => $this->faker->paragraphs(3, true),
            'confidential_comments' => $this->faker->paragraph(),
            'quality_rating' => $this->faker->numberBetween(1, 10),
            'originality_rating' => $this->faker->numberBetween(1, 10),
            'methodology_rating' => $this->faker->numberBetween(1, 10),
            'significance_rating' => $this->faker->numberBetween(1, 10),
        ]);
    }

    /**
     * Indicate that the review invitation has been declined.
     */
    public function declined(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReviewStatus::DECLINED,
            'invitation_response' => 'declined',
            'response_date' => now(),
        ]);
    }

    /**
     * Indicate that the review is overdue.
     */
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReviewStatus::ACCEPTED,
            'due_date' => $this->faker->dateTimeBetween('-10 days', '-1 day'),
        ]);
    }
}
