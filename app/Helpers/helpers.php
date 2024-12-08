<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

/**
 * Helper function to render pages with common authentication checks
 */
function renderPage(string $page)
{
    return Inertia::render($page, [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
}