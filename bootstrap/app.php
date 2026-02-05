<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders([
        App\Providers\FortifyServiceProvider::class,
    ])
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\SlugRedirectMiddleware::class,
            \App\Http\Middleware\TeamsPermission::class,
            \App\Http\Middleware\TrackManuscriptStatistics::class,
        ]);
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'journal' => \App\Http\Middleware\SetCurrentJournal::class,
            'user_role' => \App\Http\Middleware\CheckUserRole::class,
            'track_stats' => \App\Http\Middleware\TrackManuscriptStatistics::class,
            'subscription_access' => \App\Http\Middleware\CheckSubscriptionAccess::class,
        ]);
        // Ensure TeamsPermission runs before SubstituteBindings (as per Spatie docs)
        $middleware->priority([
            \App\Http\Middleware\TeamsPermission::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
