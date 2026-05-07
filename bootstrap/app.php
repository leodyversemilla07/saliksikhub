<?php

use App\Http\Middleware\CheckSubscriptionAccess;
use App\Http\Middleware\CheckUserRole;
use App\Http\Middleware\EnsureInstalled;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetCurrentJournal;
use App\Http\Middleware\SlugRedirectMiddleware;
use App\Http\Middleware\TeamsPermission;
use App\Http\Middleware\TrackManuscriptStatistics;
use App\Providers\FortifyServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders([
        FortifyServiceProvider::class,
    ])
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            EnsureInstalled::class,
            SlugRedirectMiddleware::class,
            TeamsPermission::class,
            TrackManuscriptStatistics::class,
        ]);
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'journal' => SetCurrentJournal::class,
            'user_role' => CheckUserRole::class,
            'track_stats' => TrackManuscriptStatistics::class,
            'subscription_access' => CheckSubscriptionAccess::class,
        ]);
        // Ensure TeamsPermission runs before SubstituteBindings (as per Spatie docs)
        $middleware->priority([
            TeamsPermission::class,
            SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
