<?php

use App\Http\Controllers\Cms\AnnouncementController;
use App\Http\Controllers\Cms\JournalCmsController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\Payment\PaymentController;
use App\Http\Controllers\Production\GalleyController;
use App\Http\Controllers\Publication\IssueController;
use App\Http\Controllers\Submission\ManuscriptController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Journal API routes
Route::get('/api/journals', [JournalController::class, 'index'])->name('api.journals.index');
Route::post('/journals/{journal}/switch', [JournalController::class, 'switch'])->name('journals.switch');

// Static & CMS-managed pages
Route::get('/', [JournalCmsController::class, 'home'])->name('home');
Route::get('/page/{slug}', [JournalCmsController::class, 'show'])->name('cms.page');
Route::get('/current', [IssueController::class, 'current'])->name('current');
Route::inertia('/submissions', 'public/submissions')->name('submissions');
Route::get('/archives', [IssueController::class, 'archives'])->name('archives');
Route::inertia('/editorial-board', 'public/editorial-board')->name('editorial-board');
Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements');
Route::get('/announcements/{announcement:slug}', [AnnouncementController::class, 'show'])->name('announcements.show');
Route::inertia('/about/journal', 'public/about-journal')->name('about-journal');
Route::inertia('/contact', 'public/contact-us')->name('contact-us');

// CMS Menu API (public)
Route::get('/api/menu', [JournalCmsController::class, 'getMenu'])->name('api.menu');

// Design System Documentation
Route::get('/design-system', function () {
    return response()->file(base_path('docs/design-system-palette.html'));
})->name('design-system');

// Public manuscript PDF
Route::get('/manuscripts/{manuscript:slug}/pdf', [ManuscriptController::class, 'servePdf'])->name('manuscripts.pdf');

// Public galley view/download
Route::get('/galleys/{galley}/view', [GalleyController::class, 'view'])->name('galleys.view');
Route::get('/galleys/{galley}/download', [GalleyController::class, 'download'])->name('galleys.download');

// Public payment return/cancel endpoints
Route::get('/payments/return', [PaymentController::class, 'return'])->name('payments.return');
Route::get('/payments/cancel', [PaymentController::class, 'cancel'])->name('payments.cancel');

// Payment webhooks (public, no auth)
Route::post('/webhooks/stripe', [PaymentController::class, 'stripeWebhook'])->name('webhooks.stripe');
Route::post('/webhooks/paypal', [PaymentController::class, 'paypalWebhook'])->name('webhooks.paypal');

// Public manuscript view for published manuscripts
Route::get('/manuscripts/{manuscript:slug}', [ManuscriptController::class, 'showPublic'])->name('manuscripts.public.show');

// Public search
Route::get('/search', [ManuscriptController::class, 'search'])->name('manuscripts.search');

// Public issue view
Route::get('/issues/{issue:slug}', [IssueController::class, 'showPublic'])->name('issues.public.show');

// Dashboard redirect
Route::get('/dashboard', function () {
    $user = Auth::user();
    if ($user->hasRole('author')) {
        return redirect()->route('author.dashboard');
    }
    if ($user->hasRole('reviewer')) {
        return redirect()->route('reviewer.dashboard');
    }
    if ($user->hasRole('managing_editor') || $user->hasRole('editor_in_chief') || $user->hasRole('associate_editor') || $user->hasRole('language_editor')) {
        return redirect()->route('editor.dashboard');
    }

    return redirect()->route('login');
})->name('dashboard')->middleware(['auth', 'verified']);

// Unauthorized page
Route::inertia('/unauthorized', 'error-pages/unauthorized')->name('unauthorized');
