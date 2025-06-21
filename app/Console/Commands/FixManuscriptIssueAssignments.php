<?php

namespace App\Console\Commands;

use App\Models\Issue;
use App\Models\Manuscript;
use Illuminate\Console\Command;

class FixManuscriptIssueAssignments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'manuscripts:fix-issues';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix inconsistencies between manuscripts and their assigned issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for manuscript-issue inconsistencies...');

        // Find manuscripts with issue_id that doesn't exist
        $orphanedManuscripts = Manuscript::whereNotNull('issue_id')
            ->whereRaw('issue_id NOT IN (SELECT id FROM issues)')
            ->where('issue_id', '!=', 0)
            ->get();

        if ($orphanedManuscripts->count() > 0) {
            $this->warn("Found {$orphanedManuscripts->count()} manuscripts with invalid issue references");

            if ($this->confirm('Do you want to clear these invalid issue assignments?')) {
                $count = 0;
                foreach ($orphanedManuscripts as $manuscript) {
                    $this->line("Fixing manuscript #{$manuscript->id}: {$manuscript->title}");
                    $manuscript->update([
                        'issue_id' => null,
                        'volume' => null,
                        'issue' => null,
                    ]);
                    $count++;
                }
                $this->info("Cleared invalid issue assignments for {$count} manuscripts");
            }
        } else {
            $this->info('No manuscripts with invalid issue references found');
        }

        // Find manuscripts with issue_id but mismatched volume/issue numbers
        $inconsistentManuscripts = Manuscript::whereNotNull('issue_id')
            ->where('issue_id', '!=', 0)
            ->get()
            ->filter(function ($manuscript) {
                $issue = Issue::find($manuscript->issue_id);
                if (! $issue) {
                    return false;
                }

                return (string) $issue->volume_number !== $manuscript->volume ||
                       (string) $issue->issue_number !== $manuscript->issue;
            });

        if ($inconsistentManuscripts->count() > 0) {
            $this->warn("Found {$inconsistentManuscripts->count()} manuscripts with inconsistent volume/issue numbers");

            if ($this->confirm('Do you want to fix these inconsistencies?')) {
                $count = 0;
                foreach ($inconsistentManuscripts as $manuscript) {
                    $issue = Issue::find($manuscript->issue_id);
                    $this->line("Fixing manuscript #{$manuscript->id}: {$manuscript->title}");

                    $manuscript->update([
                        'volume' => (string) $issue->volume_number,
                        'issue' => (string) $issue->issue_number,
                    ]);
                    $count++;
                }
                $this->info("Fixed volume/issue number inconsistencies for {$count} manuscripts");
            }
        } else {
            $this->info('No manuscripts with inconsistent volume/issue numbers found');
        }

        $this->info('All done!');

        return Command::SUCCESS;
    }
}
