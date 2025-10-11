<?php

namespace App\Console\Commands;

use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Console\Command;

class SendOverdueReviewReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reviews:send-overdue-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder notifications for overdue reviews';

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
        $this->info('Sending reminders for overdue reviews...');

        // Find overdue reviews
        $overdueReviews = Review::overdue()
            ->with(['reviewer', 'manuscript'])
            ->get();

        if ($overdueReviews->isEmpty()) {
            $this->info('No overdue reviews at this time.');

            return Command::SUCCESS;
        }

        $this->info("Found {$overdueReviews->count()} overdue reviews.");

        $bar = $this->output->createProgressBar($overdueReviews->count());
        $bar->start();

        $sent = 0;
        $failed = 0;

        foreach ($overdueReviews as $review) {
            try {
                if ($this->reviewService->sendReminder($review)) {
                    $sent++;

                    // Log overdue reviews for editor notification
                    \Log::warning('Overdue review reminder sent', [
                        'review_id' => $review->id,
                        'manuscript_id' => $review->manuscript_id,
                        'reviewer_id' => $review->reviewer_id,
                        'days_overdue' => abs($review->daysUntilDeadline()),
                    ]);
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

        $this->info("Overdue reminders sent successfully: {$sent}");
        if ($failed > 0) {
            $this->warn("Failed to send: {$failed}");
        }

        return Command::SUCCESS;
    }
}
