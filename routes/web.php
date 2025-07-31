<?php

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\ManuscriptController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'home')->name('home');
Route::get('/current', [IssueController::class, 'current'])->name('current');
Route::inertia('/submissions', 'submissions')->name('submissions');
Route::inertia('/archives', 'archives')->name('archives');
Route::inertia('/editorial-board', 'editorial-board')->name('editorial-board');
Route::inertia('/announcements', 'announcements')->name('announcements');
Route::inertia('/about/aims-scope', 'about-aims-scope')->name('about-aims-scope');
Route::inertia('/about/journal', 'about-journal')->name('about-journal');
Route::inertia('/contact', 'contact-us')->name('contact-us');

// Public PDF access for published manuscripts
Route::get('/manuscripts/{manuscript:slug}/pdf', [ManuscriptController::class, 'servePdf'])->name('manuscripts.pdf');

// Public manuscript view for published manuscripts
Route::get('/manuscripts/{manuscript:slug}', [ManuscriptController::class, 'showPublic'])->name('manuscripts.public.show');

// Public issue view for published issues
Route::get('/issues/{issue:slug}', [IssueController::class, 'showPublic'])->name('issues.public.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();

        // Use Spatie roles for dashboard redirection
        if ($user->hasRole('author')) {
            return redirect()->route('author.dashboard');
        }
        if ($user->hasRole('managing_editor') || $user->hasRole('editor_in_chief') || $user->hasRole('associate_editor') || $user->hasRole('language_editor')) {
            return redirect()->route('editor.dashboard');
        }

        return redirect()->route('login');
    })->name('dashboard');

    Route::middleware(['role:author'])->group(function () {
        Route::get('/author', [AuthorController::class, 'index'])->name('author.dashboard');

        Route::get('/author/manuscripts/index', [ManuscriptController::class, 'index'])->name('manuscripts.index');
        Route::get('/author/manuscripts/create', [ManuscriptController::class, 'create'])->name('manuscripts.create');
        Route::post('/author/manuscripts', [ManuscriptController::class, 'store'])->name('manuscripts.store');
        Route::get('/author/manuscripts/{id}', [ManuscriptController::class, 'show'])->name('manuscripts.show');
        Route::delete('/author/manuscripts/{id}', [ManuscriptController::class, 'destroy'])->name('manuscripts.destroy');
        Route::get('/author/manuscripts/{id}/revision', [ManuscriptController::class, 'showRevisionForm'])->name('manuscripts.revision.form');
        Route::post('/author/manuscripts/{id}/revision', [ManuscriptController::class, 'submitRevision'])->name('manuscripts.revision.submit');

        Route::get('/author/notifications', [ManuscriptController::class, 'notification'])->name('author.notifications');
        Route::get('/author/manuscripts/{manuscript}/approve', [ManuscriptController::class, 'showApproveForm'])->name('manuscripts.approve');
        Route::post('/author/manuscripts/{manuscript}/approve', [ManuscriptController::class, 'approveManuscript'])->name('manuscripts.approve.submit');
    });

    // Editors group: managing_editor, editor_in_chief, associate_editor, language_editor
    Route::middleware(['role:managing_editor|editor_in_chief|associate_editor|language_editor'])->group(function () {
        Route::get('/editor', [EditorController::class, 'index'])->name('editor.dashboard');
        Route::get('/editor/edit-articles', [EditorController::class, 'editArticles'])->name('editor.editArticles');
        Route::post('/editor/articles/{article}/update', [EditorController::class, 'updateArticle'])->name('editor.updateArticle');
        Route::post('/editor/articles/{article}/publish', [EditorController::class, 'publishArticle'])->name('editor.publishArticle');
        Route::get('/editor/manuscripts', [EditorController::class, 'indexManuscripts'])->name('editor.indexManuscripts');
        Route::get('editor/manuscripts/{id}', [EditorController::class, 'showManuscript'])->name('editor.manuscripts.show');
        Route::post('/editor/manuscripts/{id}/set-under-review', [EditorController::class, 'setUnderReview'])->name('editor.manuscripts.set_under_review');
        Route::get('/editor/manuscripts/{manuscript}/decision', [EditorController::class, 'createEditorialDecision'])->name('editor.manuscripts.create_decision');
        Route::post('/editor/manuscripts/{manuscript}/decision', [EditorController::class, 'makeDecision'])->name('editor.manuscripts.decision');
        Route::get('/editor/manuscripts/{manuscript}/decisions', [EditorController::class, 'showEditorialDecisions'])->name('editor.manuscripts.decisions');
        Route::post('/editor/manuscripts/{manuscript}/start-copyediting', [EditorController::class, 'startCopyEditing'])->name('editor.manuscripts.start_copyediting');
        Route::post('/editor/manuscripts/{manuscript}/upload-finalized', [EditorController::class, 'uploadFinalizedManuscript'])->name('editor.manuscripts.upload_finalized');
        Route::get('/editor/manuscripts/{manuscript}/prepare-publication', [EditorController::class, 'showPublicationForm'])->name('editor.manuscripts.prepare_publication_form');
        Route::post('/editor/manuscripts/{manuscript}/prepare-publication', [EditorController::class, 'prepareForPublication'])->name('editor.manuscripts.prepare_publication');

        // User management CRUD resource route
        Route::resource('users', UserController::class);
        Route::post('users/bulk-destroy', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');

        // Issue routes
        Route::resource('issues', IssueController::class);
        Route::post('issues/{issue}/comments', [IssueController::class, 'storeComment'])->name('issues.comments.store');
        Route::get('issues/{issue}/assign-manuscripts', [IssueController::class, 'showAssignManuscriptsForm'])->name('issues.assign-manuscripts.form');
        Route::post('issues/{issue}/assign-manuscripts', [IssueController::class, 'assignManuscripts'])->name('issues.assign-manuscripts');
        Route::delete('issues/{issue}/manuscripts/{manuscript}', [IssueController::class, 'unassignManuscript'])->name('issues.manuscripts.unassign');
    });
});

Route::middleware(['auth'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/api/notifications', [NotificationController::class, 'getNotifications'])->name('api.notifications');
    Route::post('/api/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('api.notifications.read');
    Route::post('/api/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.readAll');
});

Route::get('/unauthorized', function () {
    return Inertia::render('error-pages/unauthorized');
})->name('unauthorized');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
