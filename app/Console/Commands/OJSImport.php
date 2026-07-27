<?php

namespace App\Console\Commands;

use App\Models\Journal;
use App\Services\OJSImportService;
use Illuminate\Console\Command;

class OJSImport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ojs:import
                            {journal : The journal ID or slug to import into}
                            {file : Path to the OJS Native XML file}
                            {--publish : Publish imported articles immediately}
                            {--skip-dois : Skip articles with DOIs that already exist in the system}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import issues and articles from an OJS Native XML export';

    /**
     * Execute the console command.
     */
    public function handle(OJSImportService $importer): int
    {
        $journalId = $this->argument('journal');
        $filePath = $this->argument('file');

        // Resolve journal
        $journal = is_numeric($journalId)
            ? Journal::find((int) $journalId)
            : Journal::where('slug', $journalId)->first();

        if (! $journal) {
            $this->components->error("Journal not found: {$journalId}");

            return 1;
        }

        // Check file exists
        if (! file_exists($filePath)) {
            $this->components->error("File not found: {$filePath}");

            return 1;
        }

        $this->components->twoColumnDetail('Journal', $journal->name);
        $this->components->twoColumnDetail('File', realpath($filePath));
        $this->components->twoColumnDetail('Publish', $this->option('publish') ? 'Yes' : 'No');
        $this->components->twoColumnDetail('Skip existing DOIs', $this->option('skip-dois') ? 'Yes' : 'No');

        if (! $this->components->confirm('Start import?', true)) {
            $this->components->info('Import cancelled.');

            return 0;
        }

        $this->components->task('Importing OJS XML...', function () use ($importer, $journal, $filePath) {
            $this->stats = $importer->import($journal, $filePath, [
                'publish_articles' => (bool) $this->option('publish'),
                'skip_existing_dois' => (bool) $this->option('skip-dois'),
            ]);

            return empty($this->stats['errors']);
        });

        // Report results
        $stats = $this->stats;

        $this->components->twoColumnDetail('Issues imported', (string) $stats['issues']);
        $this->components->twoColumnDetail('Articles imported', (string) $stats['articles']);
        $this->components->twoColumnDetail('Authors imported', (string) $stats['authors']);
        $this->components->twoColumnDetail('Skipped', (string) $stats['skipped']);

        if (! empty($stats['errors'])) {
            $this->components->warn('Errors encountered:');
            foreach ($stats['errors'] as $error) {
                $this->components->error($error);
            }
        }

        if ($stats['issues'] > 0 || $stats['articles'] > 0) {
            $this->components->info('Import completed successfully! 🎉');
        }

        return 0;
    }

    /**
     * Import stats populated during the task callback.
     *
     * @var array{issues: int, articles: int, authors: int, skipped: int, errors: array<int, string>}
     */
    protected array $stats = [];
}
