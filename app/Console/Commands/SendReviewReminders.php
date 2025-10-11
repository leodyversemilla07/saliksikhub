<?php

namespace App\Console\Commands;

use App\Models\Review;
use App\ReviewStatus;
use App\Services\ReviewService;
use Illuminate\Console\Command;

class SendReviewReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reviews:send-reminders {--days=3 : Days before deadline to send reminder}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder notifications to reviewers for pending reviews';

    protected ReviewService $reviewService;

    /**
     * Create a new command instance.
     */
    public function __construct(ReviewService $reviewService)
    {
        parent::__construct();
        $this->reviewService = $reviewService;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $daysBeforeDeadline = (int) $this->option('days');
        $reminderDate = now()->addDays($daysBeforeDeadline)->startOfDay();

        $this->info("Sending reminders for reviews due within {$daysBeforeDeadline} days...");

        // Find reviews that need reminders
        $reviews = Review::whereIn('status', [
            ReviewStatus::INVITED,
            ReviewStatus::ACCEPTED,
            ReviewStatus::IN_PROGRESS,
        ])
            ->whereDate('due_date', '<=', $reminderDate)
            ->with(['reviewer', 'manuscript'])
            ->get();

        if ($reviews->isEmpty()) {
            $this->info('No reviews need reminders at this time.');

            return Command::SUCCESS;
        }

        $this->info("Found {$reviews->count()} reviews that need reminders.");

        $bar = $this->output->createProgressBar($reviews->count());
        $bar->start();

        $sent = 0;
        $failed = 0;

        foreach ($reviews as $review) {
            try {
                if ($this->reviewService->sendReminder($review)) {
                    $sent++;
                } else {
                    $failed++;
                }
            } catch (\Exception $e) {
                $failed++;
                $this->error("\nFailed to send reminder for review #{$review->id}: ".$e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Reminders sent successfully: {$sent}");
        if ($failed > 0) {
            $this->warn("Failed to send: {$failed}");
        }

        return Command::SUCCESS;
    }
}
