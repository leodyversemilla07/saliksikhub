<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Routes are organized by RJMS domain module. Each domain file declares
| its own use imports and middleware requirements.
|
| Domain structure:
|   install.php       — Installation wizard (no journal context)
|   public.php        — Public pages, search, dashboard redirect
|   auth.php          — Login, registration, password reset
|   notification.php  — In-app notifications (auth required)
|   file.php          — Manuscript file management (auth required)
|   profile.php       — User profile (auth required)
|   submission.php    — Author manuscript submission
|   editorial.php     — Editor workflow, decisions, screening
|   review.php        — Reviewer peer review
|   production.php    — Production/copyediting/typesetting
|   publication.php   — Issues, DOIs, galleys, versions
|   payment.php       — Payments, subscriptions, statistics
|   admin.php         — System administration
|
| SEO:
|   robots.txt — Dynamic robots.txt
|   sitemap.xml — XML sitemap for search engines
|
*/

use Illuminate\Support\Facades\Route;

// ============================================================
// SEO — robots.txt and sitemap (no journal context)
// ============================================================
Route::get('/robots.txt', function () {
    $disallow = app()->environment('production') ? '' : '/';
    $url = url('/sitemap.xml');
    $now = now()->toIso8601String();

    $content = "User-agent: *\n";
    $content .= "Allow: /\n";
    $content .= "Disallow: {$disallow}\n";
    $content .= "Disallow: /dashboard\n";
    $content .= "Disallow: /editor\n";
    $content .= "Disallow: /admin\n";
    $content .= "Disallow: /profile\n";
    $content .= "Disallow: /submissions\n";
    $content .= "Disallow: /payments\n";
    $content .= "\n";
    $content .= "Sitemap: {$url}\n";
    $content .= "\n";
    $content .= "# Generated at: {$now}\n";

    return response($content, 200, ['Content-Type' => 'text/plain']);
})->name('robots');

Route::get('/sitemap.xml', function () {
    $path = public_path('sitemap.xml');

    if (! file_exists($path)) {
        abort(404, 'Sitemap not yet generated. Run php artisan sitemap:generate');
    }

    return response()->file($path, ['Content-Type' => 'application/xml']);
})->name('sitemap');

// ============================================================
// Installation (no journal context)
// ============================================================
require __DIR__.'/install.php';

// ============================================================
// All routes with journal context
// ============================================================
Route::middleware(['journal'])->group(function () {

    // --- Public routes (no auth) ---
    require __DIR__.'/public.php';

    // --- Authentication ---
    require __DIR__.'/auth.php';

    // --- Authenticated routes (no verified required) ---
    Route::middleware(['auth'])->group(function () {
        require __DIR__.'/notification.php';
        require __DIR__.'/file.php';
        require __DIR__.'/profile.php';
    });

    // --- Authenticated + verified routes, grouped by role ---
    Route::middleware(['auth', 'verified'])->group(function () {
        require __DIR__.'/submission.php';   // author role
        require __DIR__.'/editorial.php';    // editor roles
        require __DIR__.'/review.php';       // reviewer role
        require __DIR__.'/production.php';   // editor roles
        require __DIR__.'/publication.php';  // editor roles
        require __DIR__.'/payment.php';      // editor roles
        require __DIR__.'/admin.php';        // super_admin, managing_editor, editor_in_chief
    });

});
