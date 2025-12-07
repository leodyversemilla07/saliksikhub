<?php

use App\Http\Controllers\Admin\InstitutionController;
use App\Http\Controllers\Admin\JournalController as AdminJournalController;
use App\Http\Controllers\Admin\JournalSettingsController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ManuscriptController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// All routes are wrapped with journal middleware to set the current journal context
Route::middleware(['journal'])->group(function () {
    // Journal API routes
    Route::get('/api/journals', [JournalController::class, 'index'])->name('api.journals.index');
    Route::post('/journals/{journal}/switch', [JournalController::class, 'switch'])->name('journals.switch');

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

    // Public search for published manuscripts
    Route::get('/search', [ManuscriptController::class, 'search'])->name('manuscripts.search');

    // Public issue view for published issues
    Route::get('/issues/{issue:slug}', [IssueController::class, 'showPublic'])->name('issues.public.show');

    // Authentication routes
    require __DIR__.'/auth.php';

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', function () {
            $user = Auth::user();

            // Use Spatie roles for dashboard redirection
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
        })->name('dashboard');

        Route::middleware(['user_role:author'])->group(function () {
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
        Route::middleware(['user_role:super_admin|managing_editor|editor_in_chief|associate_editor|language_editor'])->group(function () {
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

            // Review assignment routes
            Route::get('/editor/manuscripts/{manuscript}/assign-reviewers', [EditorController::class, 'showAssignReviewers'])->name('editor.manuscripts.assign_reviewers');
            Route::post('/editor/manuscripts/{manuscript}/assign-reviewers', [EditorController::class, 'assignReviewers'])->name('editor.manuscripts.assign_reviewers.store');
            Route::get('/editor/manuscripts/{manuscript}/reviews', [EditorController::class, 'showManuscriptReviews'])->name('editor.manuscripts.reviews');

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

        // Admin routes for super_admin, managing_editor and editor_in_chief only
        Route::middleware(['user_role:super_admin|managing_editor|editor_in_chief'])->prefix('admin')->name('admin.')->group(function () {
            // Institution management
            Route::resource('institutions', InstitutionController::class);

            // Journal management
            Route::resource('journals', AdminJournalController::class);
            Route::post('journals/{journal}/toggle-status', [AdminJournalController::class, 'toggleStatus'])->name('journals.toggle-status');

            // Journal settings
            Route::get('journals/{journal}/settings', [JournalSettingsController::class, 'edit'])->name('journals.settings.edit');
            Route::put('journals/{journal}/settings', [JournalSettingsController::class, 'update'])->name('journals.settings.update');
            Route::post('journals/{journal}/settings/reset', [JournalSettingsController::class, 'reset'])->name('journals.settings.reset');

            // Journal CMS - Pages
            Route::get('journals/{journal}/cms/pages', [\App\Http\Controllers\Admin\JournalPageController::class, 'index'])->name('journals.cms.pages.index');
            Route::get('journals/{journal}/cms/pages/create', [\App\Http\Controllers\Admin\JournalPageController::class, 'create'])->name('journals.cms.pages.create');
            Route::post('journals/{journal}/cms/pages', [\App\Http\Controllers\Admin\JournalPageController::class, 'store'])->name('journals.cms.pages.store');
            Route::get('journals/{journal}/cms/pages/{page}', [\App\Http\Controllers\Admin\JournalPageController::class, 'edit'])->name('journals.cms.pages.edit');
            Route::put('journals/{journal}/cms/pages/{page}', [\App\Http\Controllers\Admin\JournalPageController::class, 'update'])->name('journals.cms.pages.update');
            Route::delete('journals/{journal}/cms/pages/{page}', [\App\Http\Controllers\Admin\JournalPageController::class, 'destroy'])->name('journals.cms.pages.destroy');
            Route::post('journals/{journal}/cms/pages/reorder', [\App\Http\Controllers\Admin\JournalPageController::class, 'reorder'])->name('journals.cms.pages.reorder');

            // Journal CMS - Sections
            Route::post('journals/{journal}/cms/pages/{page}/sections', [\App\Http\Controllers\Admin\JournalPageController::class, 'addSection'])->name('journals.cms.pages.sections.store');
            Route::get('journals/{journal}/cms/pages/{page}/sections/{section}/edit', [\App\Http\Controllers\Admin\JournalPageController::class, 'editSection'])->name('journals.cms.pages.sections.edit');
            Route::put('journals/{journal}/cms/pages/{page}/sections/{section}', [\App\Http\Controllers\Admin\JournalPageController::class, 'updateSection'])->name('journals.cms.pages.sections.update');
            Route::delete('journals/{journal}/cms/pages/{page}/sections/{section}', [\App\Http\Controllers\Admin\JournalPageController::class, 'deleteSection'])->name('journals.cms.pages.sections.destroy');
            Route::put('journals/{journal}/cms/pages/{page}/sections/reorder', [\App\Http\Controllers\Admin\JournalPageController::class, 'reorderSections'])->name('journals.cms.pages.sections.reorder');

            // Journal CMS - Menus
            Route::get('journals/{journal}/cms/menus', [\App\Http\Controllers\Admin\JournalMenuController::class, 'index'])->name('journals.cms.menus.index');
            Route::post('journals/{journal}/cms/menus', [\App\Http\Controllers\Admin\JournalMenuController::class, 'store'])->name('journals.cms.menus.store');
            Route::put('journals/{journal}/cms/menus/{menu}', [\App\Http\Controllers\Admin\JournalMenuController::class, 'update'])->name('journals.cms.menus.update');
            Route::delete('journals/{journal}/cms/menus/{menu}', [\App\Http\Controllers\Admin\JournalMenuController::class, 'destroy'])->name('journals.cms.menus.destroy');
            Route::post('journals/{journal}/cms/menus/reorder', [\App\Http\Controllers\Admin\JournalMenuController::class, 'reorder'])->name('journals.cms.menus.reorder');

            // Journal CMS - Theme
            Route::get('journals/{journal}/cms/theme', [\App\Http\Controllers\Admin\JournalThemeController::class, 'edit'])->name('journals.cms.theme.edit');
            Route::put('journals/{journal}/cms/theme', [\App\Http\Controllers\Admin\JournalThemeController::class, 'update'])->name('journals.cms.theme.update');
            Route::post('journals/{journal}/cms/theme/favicon', [\App\Http\Controllers\Admin\JournalThemeController::class, 'uploadFavicon'])->name('journals.cms.theme.favicon');
            Route::post('journals/{journal}/cms/theme/reset', [\App\Http\Controllers\Admin\JournalThemeController::class, 'reset'])->name('journals.cms.theme.reset');
            Route::get('journals/{journal}/cms/theme/preview.css', [\App\Http\Controllers\Admin\JournalThemeController::class, 'preview'])->name('journals.cms.theme.preview');
        });

        // Reviewers group
        Route::middleware(['user_role:reviewer'])->group(function () {
            Route::get('/reviewer', [ReviewerController::class, 'dashboard'])->name('reviewer.dashboard');
            Route::get('/reviewer/manuscripts', [ReviewerController::class, 'index'])->name('reviewer.manuscripts.index');
            Route::get('/reviewer/manuscripts/{id}', [ReviewerController::class, 'show'])->name('reviewer.manuscripts.show');

            // Review management routes
            Route::get('/reviewer/reviews', [\App\Http\Controllers\ReviewController::class, 'index'])->name('reviewer.reviews.index');
            Route::get('/reviewer/reviews/history', [\App\Http\Controllers\ReviewController::class, 'history'])->name('reviewer.reviews.history');
            Route::get('/reviewer/reviews/{review}', [\App\Http\Controllers\ReviewController::class, 'show'])->name('reviewer.reviews.show');
            Route::post('/reviewer/reviews/{review}/accept', [\App\Http\Controllers\ReviewController::class, 'accept'])->name('reviewer.reviews.accept');
            Route::post('/reviewer/reviews/{review}/decline', [\App\Http\Controllers\ReviewController::class, 'decline'])->name('reviewer.reviews.decline');
            Route::post('/reviewer/reviews/{review}/submit', [\App\Http\Controllers\ReviewController::class, 'submit'])->name('reviewer.reviews.submit');
            Route::post('/reviewer/reviews/{review}/save-draft', [\App\Http\Controllers\ReviewController::class, 'saveDraft'])->name('reviewer.reviews.save-draft');
            Route::post('/reviewer/reviews/{review}/request-extension', [\App\Http\Controllers\ReviewController::class, 'requestExtension'])->name('reviewer.reviews.request-extension');
        });
    });

    Route::middleware(['auth'])->group(function () {
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::get('/api/notifications', [NotificationController::class, 'getNotifications'])->name('api.notifications');
        Route::post('/api/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('api.notifications.read');
        Route::post('/api/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.readAll');

        // Manuscript file management routes
        Route::post('/manuscripts/{manuscript}/files/upload', [\App\Http\Controllers\ManuscriptFileController::class, 'upload'])->name('manuscripts.files.upload');
        Route::get('/manuscripts/{manuscript}/files', [\App\Http\Controllers\ManuscriptFileController::class, 'index'])->name('manuscripts.files.index');
        Route::get('/manuscripts/files/{file}/download', [\App\Http\Controllers\ManuscriptFileController::class, 'download'])->name('manuscripts.files.download');
        Route::delete('/manuscripts/files/{file}', [\App\Http\Controllers\ManuscriptFileController::class, 'destroy'])->name('manuscripts.files.destroy');
        Route::get('/manuscripts/files/requirements', [\App\Http\Controllers\ManuscriptFileController::class, 'requirements'])->name('manuscripts.files.requirements');
    });

    Route::get('/unauthorized', function () {
        return Inertia::render('error-pages/unauthorized');
    })->name('unauthorized');

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});
