<?php

namespace Database\Seeders;

use App\Models\Expertise;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ExpertiseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $expertises = [
            'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Software Engineering',
            'Cybersecurity', 'Cloud Computing', 'Internet of Things', 'Blockchain',
            'Computer Networks', 'Database Systems', 'Human-Computer Interaction',
            'Environmental Science', 'Climate Change', 'Biodiversity Conservation',
            'Sustainable Agriculture', 'Renewable Energy', 'Marine Biology',
            'Public Health', 'Epidemiology', 'Nursing', 'Mental Health',
            'Economics', 'Sociology', 'Anthropology', 'Political Science',
            'History', 'Philosophy', 'Education', 'Curriculum Development',
            'Indigenous Studies', 'Gender Studies', 'Urban Planning',
            'Business Management', 'Marketing', 'Finance', 'Entrepreneurship',
        ];

        foreach ($expertises as $expertise) {
            Expertise::firstOrCreate(
                ['name' => $expertise],
                ['slug' => Str::slug($expertise)]
            );
        }
    }
}
