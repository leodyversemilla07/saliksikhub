<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\ManuscriptController;
use App\Http\Controllers\PageController;

Route::get('/', [PageController::class, 'renderPage'])->name('home')->defaults('page', 'Home');
Route::get('/current', [PageController::class, 'renderPage'])->name('current')->defaults('page', 'Current');
Route::get('/submissions', [PageController::class, 'renderPage'])->name('submissions')->defaults('page', 'Submissions');
Route::get('/archives', [PageController::class, 'renderPage'])->name('archives')->defaults('page', 'Archives');
Route::get('/editorial-board', [PageController::class, 'renderPage'])->name('editorial-board')->defaults('page', 'EditorialBoard');
Route::get('/about', [PageController::class, 'renderPage'])->name('about-us')->defaults('page', 'About');
Route::get('/contact', [PageController::class, 'renderPage'])->name('contact-us')->defaults('page', 'ContactUs');

// Admin Routes
Route::group([
    'middleware' => ['auth', 'verified', 'role:admin'],
    'prefix' => 'admin',
    'as' => 'admin.'
], function () {
    Route::get('/', [AdminController::class, 'index'])
        ->name('dashboard');

    // User management routes
    Route::prefix('users')->group(function () {
        Route::get('/manage', [AdminController::class, 'manageUsers'])
            ->name('manageUsers');
        Route::post('/', [AdminController::class, 'store'])
            ->name('users.store');
        Route::put('/{user}', [AdminController::class, 'update'])
            ->name('users.update');
        Route::delete('/{user}', [AdminController::class, 'destroy'])
            ->name('users.destroy');
    });
});

// Editor Routes
Route::group(['middleware' => ['auth', 'verified', 'role:editor']], function () {
    Route::get('/editor', [EditorController::class, 'index'])->name('editor.dashboard');
    Route::get('/editor/edit-articles', [EditorController::class, 'editArticles'])->name('editor.editArticles');
    Route::post('/editor/articles/{article}/update', [EditorController::class, 'updateArticle'])->name('editor.updateArticle');
    Route::post('/editor/articles/{article}/publish', [EditorController::class, 'publishArticle'])->name('editor.publishArticle');
    Route::get('/editor/manuscripts', [EditorController::class, 'indexManuscripts'])->name('editor.indexManuscripts');

    Route::put('editor/manuscripts/{id}/approve', [ManuscriptController::class, 'approve'])->name('manuscripts.approve');
    Route::put('editor/manuscripts/{id}/reject', [ManuscriptController::class, 'reject'])->name('manuscripts.reject');
    Route::put('editor/manuscripts/{id}/revise', [ManuscriptController::class, 'revisionRequired'])->name('manuscripts.revisionRequired');
    Route::get('editor/manuscripts/{id}/show', [EditorController::class, 'show'])->name('editor.manuscripts.show');

    Route::get('editor/assign/reviewer', [EditorController::class, 'indexManuscriptsAssign'])->name('editor.reviewer.assign');

    Route::post('editor/reviewer/{manuscript}/assigned', [ManuscriptController::class, 'assignReviewer'])->name('assign.reviewer');
});


// Reviewer Routes
Route::group(['middleware' => ['auth', 'verified', 'role:reviewer']], function () {
    Route::get('/reviewer', [ReviewerController::class, 'index'])->name('reviewer.dashboard');
    Route::get('/reviewer/manuscripts/to-review', [ReviewerController::class, 'toReview'])->name('reviewer.manuscripts.toReview');

    Route::post('/reviewer/submit-review/{id}', [ReviewerController::class, 'submitReview'])->name('reviewer.submitReview');

    Route::get('reviewer/manuscripts/{id}/show', [ReviewerController::class, 'show'])->name('reviewer.manuscripts.show');
    Route::get('reviewer/manuscripts/review/{id}', [ReviewerController::class, 'reviewForm'])->name('reviewer.manuscripts.review');

    // Route to display the review form
    Route::get('/reviews/{reviewId}/submit', [ReviewerController::class, 'showReviewForm'])->name('reviews.show');

    // Route to handle the review submission
    Route::post('/reviews/{reviewId}/submit', [ReviewerController::class, 'submitReview'])->name('reviews.submit');
});

// Author Routes
Route::group(['middleware' => ['auth', 'verified', 'role:author']], function () {
    Route::get('/author', [AuthorController::class, 'index'])->name('author.dashboard');

    Route::prefix('author/manuscripts')->group(function () {
        Route::get('/create', [ManuscriptController::class, 'create'])->name('manuscripts.create');
        Route::post('/', [ManuscriptController::class, 'store'])->name('manuscripts.store');
        Route::get('/index', [ManuscriptController::class, 'index'])->name('manuscripts.index');
        Route::delete('/{id}', [ManuscriptController::class, 'destroy'])->name('manuscripts.destroy');
        Route::get('/{id}', [ManuscriptController::class, 'show'])->name('manuscripts.show');
        Route::get('/{id}/edit', [ManuscriptController::class, 'edit'])->name('manuscripts.edit');
        Route::put('/{id}', [ManuscriptController::class, 'update'])->name('manuscripts.update');
    });

    Route::get('/manuscripts/ai-prereviewed', [ManuscriptController::class, 'indexAIPrereviewed'])->name('manuscripts.indexAIPrereviewed');
    Route::get('/author/notifications', [ManuscriptController::class, 'notification'])->name('author.notifications');
    Route::get('/articles/index', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/manuscripts/revisions', [ManuscriptController::class, 'revisions'])->name('manuscripts.revisions');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('send-mail', [MailController::class, 'index']);

require __DIR__ . '/auth.php';