<?php

namespace App\Console\Commands;

use App\Models\Issue;
use App\Models\Manuscript;
use Illuminate\Console\Command;

class GenerateSlugs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'slugs:generate 
                            {--force : Force regeneration of existing slugs}
                            {--model= : Generate slugs for specific model (manuscript, issue)}
                            {--batch=100 : Number of records to process in each batch}
                            {--dry-run : Show what would be done without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate slugs for existing manuscripts and issues with advanced options';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $force = $this->option('force');
        $model = $this->option('model');
        $batchSize = (int) $this->option('batch');
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('🔍 DRY RUN MODE - No changes will be made');
        }

        $this->info('🚀 Starting slug generation process...');
        $this->newLine();

        $totalProcessed = 0;

        // Process manuscripts
        if (! $model || $model === 'manuscript') {
            $totalProcessed += $this->processManuscripts($force, $batchSize, $dryRun);
        }

        // Process issues
        if (! $model || $model === 'issue') {
            $totalProcessed += $this->processIssues($force, $batchSize, $dryRun);
        }

        $this->newLine();
        $this->info('✅ Slug generation completed!');
        $this->info("📊 Total records processed: {$totalProcessed}");

        if ($dryRun) {
            $this->warn('⚠️  This was a dry run - no actual changes were made');
            $this->info('💡 Run without --dry-run to apply changes');
        }

        return 0;
    }

    /**
     * Process manuscripts for slug generation.
     */
    private function processManuscripts(bool $force, int $batchSize, bool $dryRun): int
    {
        $this->info('📄 Processing Manuscripts...');

        $query = Manuscript::query();
        if (! $force) {
            $query->whereNull('slug');
        }

        $totalCount = $query->count();

        if ($totalCount === 0) {
            $this->line('   ℹ️  No manuscripts need slug generation');

            return 0;
        }

        $this->line("   📊 Found {$totalCount} manuscripts to process");

        $progressBar = $this->output->createProgressBar($totalCount);
        $progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %memory:6s%');

        $processedCount = 0;
        $errors = [];

        $query->chunk($batchSize, function ($manuscripts) use (&$processedCount, &$errors, $force, $dryRun, $progressBar) {
            foreach ($manuscripts as $manuscript) {
                try {
                    if ($force || is_null($manuscript->slug)) {
                        $oldSlug = $manuscript->slug;

                        if (! $dryRun) {
                            $manuscript->slug = null; // Clear to regenerate
                            $manuscript->save();
                        }

                        $newSlug = $dryRun ? $this->generateSlugPreview($manuscript->title) : $manuscript->slug;

                        if ($this->option('verbose')) {
                            $this->newLine();
                            $this->line("   📝 {$manuscript->title}");
                            $this->line("      → {$newSlug}");
                        }

                        $processedCount++;
                    }
                } catch (\Exception $e) {
                    $errors[] = "Manuscript ID {$manuscript->id}: ".$e->getMessage();
                }

                $progressBar->advance();
            }
        });

        $progressBar->finish();
        $this->newLine();

        if (! empty($errors)) {
            $this->error('   ❌ Errors encountered:');
            foreach ($errors as $error) {
                $this->line("      • {$error}");
            }
        }

        $this->info("   ✅ Manuscripts processed: {$processedCount}");

        return $processedCount;
    }

    /**
     * Process issues for slug generation.
     */
    private function processIssues(bool $force, int $batchSize, bool $dryRun): int
    {
        $this->info('📰 Processing Issues...');

        $query = Issue::query();
        if (! $force) {
            $query->whereNull('slug');
        }

        $totalCount = $query->count();

        if ($totalCount === 0) {
            $this->line('   ℹ️  No issues need slug generation');

            return 0;
        }

        $this->line("   📊 Found {$totalCount} issues to process");

        $progressBar = $this->output->createProgressBar($totalCount);
        $progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %memory:6s%');

        $processedCount = 0;
        $errors = [];

        $query->chunk($batchSize, function ($issues) use (&$processedCount, &$errors, $force, $dryRun, $progressBar) {
            foreach ($issues as $issue) {
                try {
                    if ($force || is_null($issue->slug)) {
                        $oldSlug = $issue->slug;

                        if (! $dryRun) {
                            $issue->slug = null; // Clear to regenerate
                            $issue->save();
                        }

                        $sourceData = "{$issue->volume_number} {$issue->issue_number} {$issue->issue_title}";
                        $newSlug = $dryRun ? $this->generateSlugPreview($sourceData) : $issue->slug;

                        if ($this->option('verbose')) {
                            $this->newLine();
                            $this->line("   📰 Vol.{$issue->volume_number} No.{$issue->issue_number}: {$issue->issue_title}");
                            $this->line("      → {$newSlug}");
                        }

                        $processedCount++;
                    }
                } catch (\Exception $e) {
                    $errors[] = "Issue ID {$issue->id}: ".$e->getMessage();
                }

                $progressBar->advance();
            }
        });

        $progressBar->finish();
        $this->newLine();

        if (! empty($errors)) {
            $this->error('   ❌ Errors encountered:');
            foreach ($errors as $error) {
                $this->line("      • {$error}");
            }
        }

        $this->info("   ✅ Issues processed: {$processedCount}");

        return $processedCount;
    }

    /**
     * Generate a preview of what the slug would be without saving.
     */
    private function generateSlugPreview(string $source): string
    {
        return \Illuminate\Support\Str::slug($source);
    }
}
