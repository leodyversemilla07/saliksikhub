<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class ProcessSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'subscriptions:process
                          {--expire : Expire old subscriptions}
                          {--reminders : Send renewal reminders}
                          {--auto-renew : Process auto-renewals}';

    /**
     * The console command description.
     */
    protected $description = 'Process subscriptions: expire old ones, send reminders, and handle auto-renewals';

    /**
     * Execute the console command.
     */
    public function handle(SubscriptionService $subscriptionService): int
    {
        $this->info('Processing subscriptions...');

        $expire = $this->option('expire');
        $reminders = $this->option('reminders');
        $autoRenew = $this->option('auto-renew');

        // If no options specified, run all
        if (! $expire && ! $reminders && ! $autoRenew) {
            $expire = $reminders = $autoRenew = true;
        }

        // Expire old subscriptions
        if ($expire) {
            $this->info('Expiring old subscriptions...');
            $expired = $subscriptionService->expireSubscriptions();
            $this->info("Expired {$expired} subscription(s).");
        }

        // Send renewal reminders
        if ($reminders) {
            $this->info('Sending renewal reminders...');
            $expiring = $subscriptionService->getExpiringSubscriptions(30);

            $sent = 0;
            foreach ($expiring as $subscription) {
                $subscriptionService->sendRenewalReminder($subscription);
                $sent++;
            }

            $this->info("Sent {$sent} renewal reminder(s).");
        }

        // Process auto-renewals
        if ($autoRenew) {
            $this->info('Processing auto-renewals...');
            $autoRenewSubscriptions = Subscription::where('status', 'active')
                ->where('auto_renew', true)
                ->whereDate('date_end', '<=', now()->addDays(7))
                ->get();

            $renewed = 0;
            foreach ($autoRenewSubscriptions as $subscription) {
                if ($subscriptionService->processAutoRenewal($subscription)) {
                    $renewed++;
                }
            }

            $this->info("Processed {$renewed} auto-renewal(s).");
        }

        $this->info('Subscription processing complete!');

        return Command::SUCCESS;
    }
}
