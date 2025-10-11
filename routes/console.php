<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Schedule review reminder notifications
Schedule::command('reviews:send-reminders --days=3')
    ->dailyAt('09:00')
    ->timezone('UTC')
    ->description('Send reminders for reviews due in 3 days');

Schedule::command('reviews:send-reminders --days=7')
    ->dailyAt('09:00')
    ->timezone('UTC')
    ->description('Send reminders for reviews due in 7 days');

Schedule::command('reviews:send-overdue-reminders')
    ->dailyAt('10:00')
    ->timezone('UTC')
    ->description('Send reminders for overdue reviews');
