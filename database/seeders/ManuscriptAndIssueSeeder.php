<?php

namespace Database\Seeders;

use App\Models\Issue;
use App\Models\Manuscript;
use App\Models\User;
use Illuminate\Database\Seeder;

class ManuscriptAndIssueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        // Create published issues for volumes 1-3
        $publishedIssues = collect();

        for ($volume = 1; $volume <= 3; $volume++) {
            for ($issueNum = 1; $issueNum <= 4; $issueNum++) {
                // Check if this volume/issue combination already exists
                $existingIssue = Issue::where('volume_number', $volume)
                    ->where('issue_number', $issueNum)
                    ->first();

                if (! $existingIssue) {
                    $issue = Issue::factory()
                        ->published()
                        ->forVolumeAndIssue($volume, $issueNum)
                        ->createdBy($editors->random())
                        ->create();

                    $publishedIssues->push($issue);
                } else {
                    $publishedIssues->push($existingIssue);
                }
            }
        }

        // Create current year issues (volume 4)
        $currentYearIssues = [
            [4, 1, 'draft'],
            [4, 2, 'draft'],
            [4, 3, 'inReview'],
            [4, 4, 'published'],
        ];

        foreach ($currentYearIssues as [$volume, $issueNum, $status]) {
            $existingIssue = Issue::where('volume_number', $volume)
                ->where('issue_number', $issueNum)
                ->first();

            if (! $existingIssue) {
                $issue = Issue::factory()
                    ->{$status}()
                    ->forVolumeAndIssue($volume, $issueNum)
                    ->createdBy($editors->random())
                    ->create();

                if ($status === 'published') {
                    $publishedIssues->push($issue);
                }
            }
        }

        // Create a special issue for AI in Education
        $specialIssueExists = Issue::where('volume_number', 5)->where('issue_number', 1)->first();

        if (! $specialIssueExists) {
            $specialIssue = Issue::factory()
                ->specialIssue()
                ->withTheme('AI in Education')
                ->published()
                ->forVolumeAndIssue(5, 1)
                ->createdBy($editors->random())
                ->create();

            $publishedIssues->push($specialIssue);
        } else {
            $specialIssue = $specialIssueExists;
            $publishedIssues->push($specialIssue);
        }

        // Create published manuscripts for published issues
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
        }

        // Create manuscripts in various review stages
        $manuscriptStages = [
            ['submitted', 8],
            ['underReview', 6],
            ['needsRevision', 4],
            ['accepted', 3],
            ['rejected', 2],
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
        }

        // Create some manuscripts with revision history
        for ($i = 0; $i < 3; $i++) {
            Manuscript::factory()
                ->withRevisions()
                ->create([
                    'user_id' => $authors->random()->id,
                    'editor_id' => $associateEditors->random()->id,
                    'issue_id' => null, // Manuscripts with revisions are still in process
                ]);
        }
    }
}
