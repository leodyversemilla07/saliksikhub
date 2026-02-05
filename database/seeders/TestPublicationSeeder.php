<?php

namespace Database\Seeders;

use App\Models\DOI;
use App\Models\Issue;
use App\Models\Manuscript;
use App\Models\ManuscriptAuthor;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestPublicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user/author
        $author = User::firstOrCreate(
            ['email' => 'test.author@example.com'],
            [
                'firstname' => 'Test',
                'lastname' => 'Author',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'role' => 'author',
            ]
        );

        // Create a test issue
        $issue = Issue::firstOrCreate(
            ['volume_number' => '1', 'issue_number' => '1'],
            [
                'issue_title' => 'Volume 1, Issue 1',
                'description' => 'Test issue for JATS XML generation',
                'publication_date' => '2026-01-01',
                'status' => 'published',
                'user_id' => $author->id,
            ]
        );

        // Create a test manuscript
        $manuscript = Manuscript::create([
            'title' => 'A Comprehensive Study on JATS XML Generation in Academic Publishing',
            'abstract' => 'This article presents a comprehensive approach to generating JATS XML for academic publishing platforms. We demonstrate the implementation of JATS 1.3 standard in modern Laravel applications.',
            'keywords' => json_encode(['JATS', 'XML', 'Academic Publishing', 'Laravel', 'Metadata']),
            'authors' => json_encode([]),
            'status' => 'published',
            'submission_date' => now()->subMonths(3),
            'category' => 'Research Article',
            'user_id' => $author->id,
            'issue_id' => $issue->id,
        ]);

        // Create manuscript author
        ManuscriptAuthor::create([
            'manuscript_id' => $manuscript->id,
            'full_name' => 'Dr. Test Author',
            'first_name' => 'Test',
            'last_name' => 'Author',
            'email' => 'test.author@example.com',
            'affiliation' => 'Test University, Department of Computer Science',
            'orcid' => '0000-0001-2345-6789',
            'order' => 1,
            'is_corresponding' => true,
        ]);

        // Add co-author
        ManuscriptAuthor::create([
            'manuscript_id' => $manuscript->id,
            'full_name' => 'Dr. Jane Smith',
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane.smith@example.com',
            'affiliation' => 'Research Institute of Technology',
            'orcid' => '0000-0002-3456-7890',
            'order' => 2,
            'is_corresponding' => false,
        ]);

        // Create publication
        $publication = Publication::create([
            'manuscript_id' => $manuscript->id,
            'version_major' => 1,
            'version_minor' => 0,
            'version_stage' => 'published',
            'status' => 'published',
            'access_status' => 'open',
            'title' => $manuscript->title,
            'abstract' => $manuscript->abstract,
            'keywords' => $manuscript->keywords,
            'language' => 'en',
            'license_url' => 'https://creativecommons.org/licenses/by/4.0/',
            'copyright_holder' => 'The Authors',
            'copyright_year' => 2026,
            'date_published' => now(),
            'date_submitted' => now()->subMonths(3),
            'date_accepted' => now()->subMonth(),
            'page_start' => 1,
            'page_end' => 15,
            'url_path' => 'comprehensive-study-jats-xml-generation',
        ]);

        // Create DOI
        DOI::create([
            'doi' => '10.12345/test.2026.001',
            'doiable_type' => Publication::class,
            'doiable_id' => $publication->id,
            'status' => 'registered',
            'registration_agency' => 'crossref',
            'registered_at' => now(),
        ]);

        $this->command->info('Test publication created successfully!');
        $this->command->info('Publication ID: ' . $publication->id);
        $this->command->info('Test JATS XML at: /api/jats/publications/' . $publication->id);
    }
}

