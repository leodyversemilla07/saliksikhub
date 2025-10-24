<?php

namespace Database\Factories;

use App\Models\Manuscript;
use App\Models\ManuscriptRevision;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ManuscriptRevision>
 */
class ManuscriptRevisionFactory extends Factory
{
    protected $model = ManuscriptRevision::class;

    public function definition(): array
    {
        return [
            'manuscript_id' => Manuscript::factory(),
            'version' => 1,
            'previous_status' => 'submitted',
            'manuscript_path' => 'manuscripts/example.pdf',
            'submitted_at' => now(),
            'comments' => $this->faker->sentence(),
            'user_id' => User::factory(),
        ];
    }
}
