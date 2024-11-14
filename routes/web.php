<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => renderPage('Home'));
Route::get('/current', fn() => renderPage('Current'));
Route::get('/submissions', fn() => renderPage('Submissions'));
Route::get('/archives', fn() => renderPage('Archives'));
Route::get('/editorial-board', fn() => renderPage('EditorialBoard'));
Route::get('/about-us', fn() => renderPage('About'));
Route::get('/contact-us', fn() => renderPage('ContactUs'));

Route::get('/editor-dashboard', fn() => Inertia::render('Editor/EditorDashboard'))
    ->middleware(['auth', 'verified'])
    ->name('editor.dashboard');

Route::get('/reviewer-dashboard', fn() => Inertia::render('Reviewer/ReviewerDashboard'))
    ->middleware(['auth', 'verified'])
    ->name('reviewer.dashboard');

Route::get('/author-dashboard', fn() => Inertia::render('Author/AuthorDashboard'))
    ->middleware(['auth', 'verified'])
    ->name('author.dashboard.');

Route::get('/admin-dashboard', fn() => Inertia::render('Admin/AdminPanel'))
    ->middleware(['auth', 'verified'])
    ->name('admin.dashboard');

Route::get('/admin-dashboard', fn() => Inertia::render('Admin/AdminPanel'))
    ->middleware(['auth', 'verified'])
    ->name('admin.dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

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