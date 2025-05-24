<?php

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\ManuscriptController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'home')->name('home');
Route::inertia('/current', 'current')->name('current');
Route::inertia('/submissions', 'submissions')->name('submissions');
Route::inertia('/archives', 'archives')->name('archives');
Route::inertia('/editorial-board', 'editorial-board')->name('editorial-board');
Route::inertia('/announcements', 'announcements')->name('announcements');
Route::inertia('/about/aims-scope', 'about-aims-scope')->name('about-aims-scope');
Route::inertia('/about/journal', 'about-journal')->name('about-journal');
Route::inertia('/contact', 'contact-us')->name('contact-us');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();

        return match ($user->role) {
            'author' => redirect()->route('author.dashboard'),
            'editor' => redirect()->route('editor.dashboard'),
            default => redirect()->route('login'),
        };
    })->name('dashboard');

    Route::middleware(['role:author'])->group(function () {
        Route::get('/author', [AuthorController::class, 'index'])->name('author.dashboard');

        Route::prefix('author/manuscripts')->group(function () {
            Route::get('/index', [ManuscriptController::class, 'index'])->name('manuscripts.index');
            Route::get('/create', [ManuscriptController::class, 'create'])->name('manuscripts.create');
            Route::post('/', [ManuscriptController::class, 'store'])->name('manuscripts.store');
            Route::get('/{id}', [ManuscriptController::class, 'show'])->name('manuscripts.show');
            Route::delete('/{id}', [ManuscriptController::class, 'destroy'])->name('manuscripts.destroy');
            Route::get('/{id}/revision', [ManuscriptController::class, 'showRevisionForm'])->name('manuscripts.revision.form');
            Route::post('/{id}/revision', [ManuscriptController::class, 'submitRevision'])->name('manuscripts.revision.submit');
        });

        Route::get('/author/notifications', [ManuscriptController::class, 'notification'])->name('author.notifications');
        Route::get('/author/manuscripts/{manuscript}/approve', [ManuscriptController::class, 'showApproveForm'])->name('manuscripts.approve');
        Route::post('/author/manuscripts/{manuscript}/approve', [ManuscriptController::class, 'approveManuscript'])->name('manuscripts.approve.submit');
    });

    Route::middleware(['role:editor'])->group(function () {
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

        Route::prefix('users')->group(function () {
            Route::post('/bulk-delete', [EditorController::class, 'bulkDestroy'])->name('editor.users.bulk-destroy');
            Route::get('/', [EditorController::class, 'manageUsers'])->name('editor.users.index');
            Route::post('/', [EditorController::class, 'store'])->name('editor.users.store');
            Route::put('/{user}', [EditorController::class, 'update'])->name('editor.users.update');
            Route::delete('/{user}', [EditorController::class, 'destroy'])->name('editor.users.destroy');
        });
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

Route::get('/debug-manuscript/{id}', function ($id) {
    if (app()->environment('local')) {
        $manuscript = \App\Models\Manuscript::find($id);
        if (!$manuscript) {
            return response()->json(['error' => 'Manuscript not found'], 404);
        }

        return response()->json([
            'id' => $manuscript->id,
            'title' => $manuscript->title,
            'status' => $manuscript->status,
            'raw_status' => $manuscript->getRawOriginal('status'),
            'is_accepted' => $manuscript->status === \App\Models\Manuscript::STATUSES['ACCEPTED'],
            'accepted_value' => \App\Models\Manuscript::STATUSES['ACCEPTED'],
            'all_statuses' => \App\Models\Manuscript::STATUSES
        ]);
    }
    return abort(404);
});

Route::get('/debug-routes', function () {
    if (app()->environment('local')) {
        return response()->json([
            'prepare_publication_form' => route('editor.manuscripts.prepare_publication_form', 1),
            'prepare_publication' => route('editor.manuscripts.prepare_publication', 1),
            'all_routes' => array_filter(
                Route::getRoutes()->getRoutesByMethod()['GET'] ?? [],
                fn($route) => str_contains($route->getName() ?? '', 'prepare_publication')
            )
        ]);
    }
    return abort(404);
})->name('debug.routes');

require __DIR__ . '/auth.php';
