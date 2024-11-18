<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
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
Route::group(['middleware' => ['auth', 'verified', 'role:admin']], function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/manage-users', [AdminController::class, 'manageUsers'])->name('admin.manageUsers');
    Route::post('/admin/users/create', [AdminController::class, 'createUser'])->name('admin.createUser');
    Route::get('/admin/users/{user}/edit', [AdminController::class, 'editUser'])->name('admin.editUser');
    Route::post('/admin/users/{user}/update', [AdminController::class, 'updateUser'])->name('admin.updateUser');
    Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser'])->name('admin.deleteUser');
});

// Editor Routes
Route::group(['middleware' => ['auth', 'verified', 'role:editor']], function () {
    Route::get('/editor', [EditorController::class, 'index'])->name('editor.dashboard');
    Route::get('/editor/edit-articles', [EditorController::class, 'editArticles'])->name('editor.editArticles');
    Route::post('/editor/articles/{article}/update', [EditorController::class, 'updateArticle'])->name('editor.updateArticle');
    Route::post('/editor/articles/{article}/publish', [EditorController::class, 'publishArticle'])->name('editor.publishArticle');
});

// Reviewer Routes
Route::group(['middleware' => ['auth', 'verified', 'role:reviewer']], function () {
    Route::get('/reviewer', [ReviewerController::class, 'index'])->name('reviewer.dashboard');
    Route::get('/reviewer/review-articles', [ReviewerController::class, 'reviewArticles'])->name('reviewer.reviewArticles');
    Route::post('/reviewer/articles/{article}/submit-review', [ReviewerController::class, 'submitReview'])->name('reviewer.submitReview');
});

// Author Routes
Route::group(['middleware' => ['auth', 'verified', 'role:author']], function () {
    Route::get('/author', [AuthorController::class, 'index'])->name('author.dashboard');
    Route::get('/author/submissions', [AuthorController::class, 'submissionForm'])->name('submissions.dashboard');
    Route::post('/author/articles/submit', [AuthorController::class, 'submitArticle'])->name('author.submitArticle');
    Route::get('/author/my-articles', [AuthorController::class, 'myArticles'])->name('author.myArticles');
    Route::get('/author/articles/{article}/edit', [AuthorController::class, 'editMyArticle'])->name('author.editMyArticle');
    Route::post('/author/articles/{article}/update', [AuthorController::class, 'updateMyArticle'])->name('author.updateMyArticle');

    Route::get('/manuscripts/create', [ManuscriptController::class, 'create'])->name('manuscripts.create');
    Route::post('/manuscripts', [ManuscriptController::class, 'store'])->name('manuscripts.store');
    Route::get('/user/manuscripts', [ManuscriptController::class, 'userManuscripts'])->name('manuscripts.show');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('send-mail', [MailController::class, 'index']);

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