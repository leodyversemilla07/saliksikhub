<?php

namespace App\Providers;

use App\Models\Manuscript;
use App\Observers\ManuscriptObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Manuscript::observe(ManuscriptObserver::class);
    }
}
