<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MailController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\ManuscriptController;

Route::get('/', fn() => renderPage('Home'));
Route::get('/current', fn() => renderPage('Current'));
Route::get('/submissions', fn() => renderPage('Submissions'));
Route::get('/archives', fn() => renderPage('Archives'));
Route::get('/editorial-board', fn() => renderPage('EditorialBoard'));
Route::get('/about-us', fn() => renderPage('About'));
Route::get('/contact-us', fn() => renderPage('ContactUs'));

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
    Route::get('/reviewer/review-manuscripts', [ReviewerController::class, 'reviewManuscripts'])->name('reviewer.reviewManuscripts');
    Route::post('/reviewer/articles/{article}/submit-review', [ReviewerController::class, 'submitReview'])->name('reviewer.submitReview');

    Route::get('reviewer/manuscripts/{id}/show', [ReviewerController::class, 'show'])->name('reviewer.manuscripts.show');
    Route::get('reviewer/manuscripts/review', [ReviewerController::class, 'reviewForm'])->name('reviewer.manuscripts.review');
});

// Author Routes
Route::group(['middleware' => ['auth', 'verified', 'role:author']], function () {
    Route::get('/author', [AuthorController::class, 'index'])->name('author.dashboard');
    Route::get('/author/my-articles', [AuthorController::class, 'myArticles'])->name('author.myArticles');

    Route::get('/author/manuscripts/create', [ManuscriptController::class, 'create'])->name('manuscripts.create');
    Route::post('/author/manuscripts', [ManuscriptController::class, 'store'])->name('manuscripts.store');
    Route::get('/author/manuscripts/index', [ManuscriptController::class, 'index'])->name('manuscripts.index');
    Route::delete('/author/manuscripts/{id}', [ManuscriptController::class, 'destroy'])->name('manuscripts.destroy');
    Route::get('/author/manuscripts/{id}', [ManuscriptController::class, 'show'])->name('manuscripts.show');
    Route::get('/author/manuscripts/{id}/edit', [ManuscriptController::class, 'edit'])->name('manuscripts.edit');
    Route::put('/author/manuscripts/{id}', [ManuscriptController::class, 'update'])->name('manuscripts.update');

    Route::get('/manuscripts/{id}/ai-review', [ManuscriptController::class, 'showAiReview'])
        ->name('manuscripts.aiReview');
    Route::get('/manuscripts/ai-review', [ManuscriptController::class, 'indexAIPrereviewed'])
        ->name('manuscripts.indexAIPrereviewed');

    Route::get('/author/notifications', [ManuscriptController::class, 'notification'])
        ->name('author.notifications');

    Route::get('/articles/index', function () {
        return inertia('Articles/Index');
    })->name('articles.index');

    Route::get('/manuscripts/revisions', [ManuscriptController::class, 'revisions'])->name('manuscripts.revisions');
});

Route::post('/manuscript-review', [ManuscriptController::class, 'sendForReview']);
Route::get('/manuscript-review', function () {
    return inertia('ManuscriptReview', [
        'review' => null,
        'compliance_score' => null,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('send-mail', [MailController::class, 'index']);

require __DIR__ . '/auth.php';