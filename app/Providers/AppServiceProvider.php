<?php

namespace App\Providers;

use App\Models\Manuscript;
use App\Models\Publication;
use App\Observers\ManuscriptObserver;
use App\Observers\PublicationObserver;
use App\Policies\ManuscriptPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Manuscript::class => ManuscriptPolicy::class,
    ];

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
        Publication::observe(PublicationObserver::class);

        // Register policies
        Gate::policy(Manuscript::class, ManuscriptPolicy::class);
    }
}
