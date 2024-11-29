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
use App\Models\Manuscript;

use function Termwind\render;

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

Route::get('/manuscriptsmodal', function () {
    return Inertia::render('Manuscripts/ModalManuscript');
})->name('manuscripts.modal');

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