<?php

namespace App\Console\Commands;

use Database\Seeders\ManuscriptAndIssueSeeder;
use Illuminate\Console\Command;

class SeedManuscriptsAndIssues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:manuscripts-issues {--fresh : Drop existing data first}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the database with sample manuscripts and issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('fresh')) {
            $this->info('Clearing existing manuscripts and issues...');
            
            // Clear existing data
            \App\Models\Manuscript::query()->delete();
            \App\Models\Issue::query()->delete();
            
            $this->info('Existing data cleared.');
        }

        $this->info('Seeding manuscripts and issues...');
        
        $seeder = new ManuscriptAndIssueSeeder();
        $seeder->setCommand($this);
        $seeder->run();

        $this->info('✅ Manuscripts and issues seeded successfully!');
        
        return Command::SUCCESS;
    }
}
