<?php

namespace Database\Factories;

use App\FileType;
use App\Models\Manuscript;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ManuscriptFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fileType = $this->faker->randomElement(FileType::cases());

        return [
            'manuscript_id' => Manuscript::factory(),
            'file_type' => $fileType,
            'filename' => $this->faker->word().'.pdf',
            'storage_path' => 'manuscripts/'.$this->faker->uuid().'/main_document/file.pdf',
            'file_size' => $this->faker->numberBetween(100000, 10000000), // 100KB to 10MB
            'mime_type' => 'application/pdf',
            'uploaded_by' => User::factory(),
            'version' => 1,
        ];
    }

    /**
     * Indicate that this is a main document.
     */
    public function mainDocument(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_type' => FileType::MAIN_DOCUMENT,
            'filename' => 'manuscript.pdf',
        ]);
    }

    /**
     * Indicate that this is a cover letter.
     */
    public function coverLetter(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_type' => FileType::COVER_LETTER,
            'filename' => 'cover_letter.pdf',
        ]);
    }

    /**
     * Indicate that this is a figure.
     */
    public function figure(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_type' => FileType::FIGURE,
            'filename' => 'figure.png',
            'mime_type' => 'image/png',
        ]);
    }

    /**
     * Indicate that this is a table.
     */
    public function table(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_type' => FileType::TABLE,
            'filename' => 'table.xlsx',
            'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    /**
     * Indicate that this is supplementary material.
     */
    public function supplementary(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_type' => FileType::SUPPLEMENTARY,
            'filename' => 'supplementary.zip',
            'mime_type' => 'application/zip',
        ]);
    }
}
