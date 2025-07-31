<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Issue;
use App\Models\Manuscript;
use Illuminate\Database\Seeder;

class ManuscriptAndIssueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting Manuscript and Issue seeding...');

        // Get existing users or create if none exist
        $editors = User::where('role', 'editor_in_chief')->get();
        $associateEditors = User::where('role', 'associate_editor')->get();
        $authors = User::where('role', 'author')->get();

        // Create additional users if needed
        if ($editors->count() < 2) {
            $editors = $editors->merge(
                User::factory()->count(2 - $editors->count())->create(['role' => 'editor_in_chief'])
            );
        }
        
        if ($associateEditors->count() < 3) {
            $associateEditors = $associateEditors->merge(
                User::factory()->count(3 - $associateEditors->count())->create(['role' => 'associate_editor'])
            );
        }
        
        if ($authors->count() < 10) {
            $authors = $authors->merge(
                User::factory()->count(10 - $authors->count())->create(['role' => 'author'])
            );
        }

        $this->command->info("Users available - Editors: {$editors->count()}, Associate Editors: {$associateEditors->count()}, Authors: {$authors->count()}");

        // Create published issues for volumes 1-3
        $publishedIssues = collect();
        $this->command->info('Creating published issues...');
        
        for ($volume = 1; $volume <= 3; $volume++) {
            for ($issueNum = 1; $issueNum <= 4; $issueNum++) {
                // Check if this volume/issue combination already exists
                $existingIssue = Issue::where('volume_number', $volume)
                    ->where('issue_number', $issueNum)
                    ->first();
                
                if (!$existingIssue) {
                    $issue = Issue::factory()
                        ->published()
                        ->forVolumeAndIssue($volume, $issueNum)
                        ->createdBy($editors->random())
                        ->create();
                    
                    $publishedIssues->push($issue);
                    $this->command->info("Created issue: Vol. {$volume}, No. {$issueNum} - {$issue->issue_title}");
                } else {
                    $publishedIssues->push($existingIssue);
                    $this->command->info("Using existing issue: Vol. {$volume}, No. {$issueNum}");
                }
            }
        }

        // Create current year issues (volume 4)
        $this->command->info('Creating current year issues...');
        
        $currentYearIssues = [
            [4, 1, 'draft'],
            [4, 2, 'draft'], 
            [4, 3, 'inReview'],
            [4, 4, 'published']
        ];

        foreach ($currentYearIssues as [$volume, $issueNum, $status]) {
            $existingIssue = Issue::where('volume_number', $volume)
                ->where('issue_number', $issueNum)
                ->first();
                
            if (!$existingIssue) {
                $issue = Issue::factory()
                    ->{$status}()
                    ->forVolumeAndIssue($volume, $issueNum)
                    ->createdBy($editors->random())
                    ->create();
                
                if ($status === 'published') {
                    $publishedIssues->push($issue);
                }
                
                $this->command->info("Created {$status} issue: Vol. {$volume}, No. {$issueNum}");
            }
        }

        // Create a special issue for AI in Education
        $this->command->info('Creating special issue...');
        $specialIssueExists = Issue::where('volume_number', 5)->where('issue_number', 1)->first();
        
        if (!$specialIssueExists) {
            $specialIssue = Issue::factory()
                ->specialIssue()
                ->withTheme('AI in Education')
                ->published()
                ->forVolumeAndIssue(5, 1)
                ->createdBy($editors->random())
                ->create();
            
            $publishedIssues->push($specialIssue);
            $this->command->info("Created special issue: {$specialIssue->issue_title}");
        } else {
            $specialIssue = $specialIssueExists;
            $publishedIssues->push($specialIssue);
        }

        // Create published manuscripts for published issues
        $this->command->info('Creating published manuscripts...');
        foreach ($publishedIssues->take(6) as $index => $issue) {
            $manuscriptCount = rand(3, 5);
            
            for ($i = 0; $i < $manuscriptCount; $i++) {
                Manuscript::factory()
                    ->published()
                    ->create([
                        'user_id' => $authors->random()->id,
                        'issue_id' => $issue->id,
                        'editor_id' => $associateEditors->random()->id,
                    ]);
            }
            
            $this->command->info("Created {$manuscriptCount} published manuscripts for issue: {$issue->issue_title}");
        }

        // Create manuscripts in various review stages
        $this->command->info('Creating manuscripts in review stages...');
        
        $manuscriptStages = [
            ['submitted', 8],
            ['underReview', 6],
            ['needsRevision', 4],
            ['accepted', 3],
            ['rejected', 2]
        ];

        foreach ($manuscriptStages as [$stage, $count]) {
            for ($i = 0; $i < $count; $i++) {
                $manuscriptData = [
                    'user_id' => $authors->random()->id,
                    'issue_id' => null, // Non-published manuscripts don't have issues yet
                ];
                
                // Add editor for stages that need one
                if (in_array($stage, ['underReview', 'needsRevision', 'accepted', 'rejected'])) {
                    $manuscriptData['editor_id'] = $associateEditors->random()->id;
                }
                
                Manuscript::factory()
                    ->{$stage}()
                    ->create($manuscriptData);
            }
            
            $this->command->info("Created {$count} {$stage} manuscripts");
        }

        // Create some manuscripts with revision history
        $this->command->info('Creating manuscripts with revisions...');
        for ($i = 0; $i < 3; $i++) {
            Manuscript::factory()
                ->withRevisions()
                ->create([
                    'user_id' => $authors->random()->id,
                    'editor_id' => $associateEditors->random()->id,
                    'issue_id' => null, // Manuscripts with revisions are still in process
                ]);
        }

        // Display final counts
        $this->command->info('Seeding completed!');
        $this->command->info('Final counts:');
        $this->command->info('- Total Issues: ' . Issue::count());
        $this->command->info('- Total Manuscripts: ' . Manuscript::count());
        $this->command->info('- Published Issues: ' . Issue::where('status', Issue::STATUS_PUBLISHED)->count());
        $this->command->info('- Published Manuscripts: ' . Manuscript::where('status', 'Published')->count());
        $this->command->info('- Submitted Manuscripts: ' . Manuscript::where('status', 'Submitted')->count());
        $this->command->info('- Under Review Manuscripts: ' . Manuscript::where('status', 'Under Review')->count());
    }
}
