<?php

use App\Http\Controllers\Admin\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\Admin\InstitutionController;
use App\Http\Controllers\Admin\JournalController as AdminJournalController;
use App\Http\Controllers\Admin\JournalMenuController;
use App\Http\Controllers\Admin\JournalPageController;
use App\Http\Controllers\Admin\JournalSettingsController;
use App\Http\Controllers\Admin\JournalThemeController;
use App\Http\Controllers\Admin\JournalUserController;
use App\Http\Controllers\Admin\PlatformSettingsController;
use App\Http\Controllers\Admin\PluginController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\DOIController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\GalleyController;
use App\Http\Controllers\InitialScreeningController;
use App\Http\Controllers\InstallController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ManuscriptController;
use App\Http\Controllers\ManuscriptFileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductionWorkflowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicationVersionController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Installation wizard routes (outside journal middleware — no journal exists yet)
Route::get('/install', [InstallController::class, 'index'])->name('install');
Route::post('/install', [InstallController::class, 'store'])->name('install.store');

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
    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements');
    Route::get('/announcements/{announcement:slug}', [AnnouncementController::class, 'show'])->name('announcements.show');
    Route::inertia('/about/aims-scope', 'about-aims-scope')->name('about-aims-scope');
    Route::inertia('/about/journal', 'about-journal')->name('about-journal');
    Route::inertia('/contact', 'contact-us')->name('contact-us');

    // Design System Documentation
    Route::get('/design-system', function () {
        return response()->file(base_path('docs/design-system-palette.html'));
    })->name('design-system');

    // Public PDF access for published manuscripts
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

            // Initial screening routes
            Route::get('/editor/manuscripts/{manuscript}/initial-screening', [InitialScreeningController::class, 'show'])->name('editor.manuscripts.initial_screening');
            Route::post('/editor/manuscripts/{manuscript}/initial-screening', [InitialScreeningController::class, 'update'])->name('editor.manuscripts.initial_screening.update');

            // Review assignment routes
            Route::get('/editor/manuscripts/{manuscript}/assign-reviewers', [EditorController::class, 'showAssignReviewers'])->name('editor.manuscripts.assign_reviewers');
            Route::post('/editor/manuscripts/{manuscript}/assign-reviewers', [EditorController::class, 'assignReviewers'])->name('editor.manuscripts.assign_reviewers.store');
            Route::get('/editor/manuscripts/{manuscript}/reviews', [EditorController::class, 'showManuscriptReviews'])->name('editor.manuscripts.reviews');

            // Publication versioning routes
            Route::prefix('/manuscripts/{manuscript}/publications')->name('manuscripts.publications.')->group(function () {
                Route::get('/', [PublicationVersionController::class, 'index'])->name('index');
                Route::post('/', [PublicationVersionController::class, 'store'])->name('store');
                Route::get('/{publication}', [PublicationVersionController::class, 'show'])->name('show');
                Route::put('/{publication}', [PublicationVersionController::class, 'update'])->name('update');
                Route::post('/{publication}/publish', [PublicationVersionController::class, 'publish'])->name('publish');
                Route::post('/{publication}/schedule', [PublicationVersionController::class, 'schedule'])->name('schedule');
                Route::post('/{publication}/embargo', [PublicationVersionController::class, 'setEmbargo'])->name('embargo');
                Route::post('/{publication}/correct', [PublicationVersionController::class, 'correct'])->name('correct');
                Route::post('/{publication}/retract', [PublicationVersionController::class, 'retract'])->name('retract');
                Route::post('/{publication}/revert', [PublicationVersionController::class, 'revert'])->name('revert');
            });

            // DOI management routes
            Route::prefix('/manuscripts/{manuscript}/dois')->name('manuscripts.dois.')->group(function () {
                Route::get('/', [DOIController::class, 'index'])->name('index');
                Route::post('/publications/{publication}/assign', [DOIController::class, 'assign'])->name('assign');
                Route::post('/batch-assign', [DOIController::class, 'batchAssign'])->name('batch-assign');
                Route::post('/batch-register', [DOIController::class, 'batchRegister'])->name('batch-register');
            });

            Route::prefix('/dois')->name('dois.')->group(function () {
                Route::post('/{doi}/register', [DOIController::class, 'register'])->name('register');
                Route::post('/{doi}/check-status', [DOIController::class, 'checkStatus'])->name('check-status');
                Route::post('/{doi}/redeposit', [DOIController::class, 'redeposit'])->name('redeposit');
                Route::delete('/{doi}', [DOIController::class, 'destroy'])->name('destroy');
            });

            // Galley management routes
            Route::prefix('/publications/{publication}/galleys')->name('galleys.')->group(function () {
                Route::get('/', [GalleyController::class, 'index'])->name('index');
                Route::post('/', [GalleyController::class, 'store'])->name('store');
                Route::post('/reorder', [GalleyController::class, 'reorder'])->name('reorder');
            });

            Route::prefix('/galleys')->name('galleys.')->group(function () {
                Route::put('/{galley}', [GalleyController::class, 'update'])->name('update');
                Route::delete('/{galley}', [GalleyController::class, 'destroy'])->name('destroy');
                Route::post('/{galley}/approve', [GalleyController::class, 'approve'])->name('approve');
            });

            // Production workflow routes
            Route::prefix('/production')->name('production.')->group(function () {
                Route::get('/', [ProductionWorkflowController::class, 'index'])->name('dashboard');
                Route::get('/manuscripts/{manuscript}', [ProductionWorkflowController::class, 'show'])->name('show');

                Route::post('/manuscripts/{manuscript}/copyediting/start', [ProductionWorkflowController::class, 'startCopyediting'])->name('copyediting.start');
                Route::post('/manuscripts/{manuscript}/copyediting/complete', [ProductionWorkflowController::class, 'completeCopyediting'])->name('copyediting.complete');
                Route::post('/manuscripts/{manuscript}/copyeditor/assign', [ProductionWorkflowController::class, 'assignCopyeditor'])->name('copyeditor.assign');

                Route::post('/manuscripts/{manuscript}/typesetting/start', [ProductionWorkflowController::class, 'startTypesetting'])->name('typesetting.start');
                Route::post('/manuscripts/{manuscript}/typesetting/complete', [ProductionWorkflowController::class, 'completeTypesetting'])->name('typesetting.complete');
                Route::post('/manuscripts/{manuscript}/layout-editor/assign', [ProductionWorkflowController::class, 'assignLayoutEditor'])->name('layout-editor.assign');

                Route::post('/manuscripts/{manuscript}/proofing/start', [ProductionWorkflowController::class, 'startProofing'])->name('proofing.start');
                Route::post('/manuscripts/{manuscript}/proofing/complete', [ProductionWorkflowController::class, 'completeProofing'])->name('proofing.complete');

                Route::post('/manuscripts/{manuscript}/publish', [ProductionWorkflowController::class, 'publish'])->name('publish');
                Route::post('/manuscripts/{manuscript}/revert', [ProductionWorkflowController::class, 'revertStage'])->name('revert');
            });

            // Statistics routes
            Route::prefix('/statistics')->name('statistics.')->group(function () {
                Route::get('/', [StatisticsController::class, 'index'])->name('index');
                Route::get('/manuscripts/{manuscript}', [StatisticsController::class, 'show'])->name('show');
                Route::get('/manuscripts/{manuscript}/export', [StatisticsController::class, 'export'])->name('export');
                Route::get('/manuscripts/{manuscript}/api', [StatisticsController::class, 'api'])->name('api');
                Route::post('/counter-report', [StatisticsController::class, 'counterReport'])->name('counter-report');
            });

            // Payment routes
            Route::prefix('/payments')->name('payments.')->group(function () {
                Route::get('/', [PaymentController::class, 'index'])->name('index');
                Route::get('/{payment}', [PaymentController::class, 'show'])->name('show');

                Route::get('/manuscripts/{manuscript}/submission-fee', [PaymentController::class, 'submissionFee'])->name('submission-fee');
                Route::post('/manuscripts/{manuscript}/submission-fee', [PaymentController::class, 'processSubmissionFee'])->name('submission-fee.process');

                Route::get('/manuscripts/{manuscript}/publication-charge', [PaymentController::class, 'publicationCharge'])->name('publication-charge');
                Route::post('/manuscripts/{manuscript}/publication-charge', [PaymentController::class, 'processPublicationCharge'])->name('publication-charge.process');

                Route::post('/{payment}/refund', [PaymentController::class, 'refund'])->name('refund');
            });

            // Subscription routes
            Route::prefix('/subscriptions')->name('subscriptions.')->group(function () {
                Route::get('/', [SubscriptionController::class, 'index'])->name('index');
                Route::get('/create', [SubscriptionController::class, 'create'])->name('create');
                Route::post('/', [SubscriptionController::class, 'store'])->name('store');
                Route::get('/{subscription}', [SubscriptionController::class, 'show'])->name('show');

                Route::post('/{subscription}/renew', [SubscriptionController::class, 'renew'])->name('renew');
                Route::post('/{subscription}/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
                Route::post('/{subscription}/suspend', [SubscriptionController::class, 'suspend'])->name('suspend');
                Route::post('/{subscription}/reactivate', [SubscriptionController::class, 'reactivate'])->name('reactivate');

                Route::post('/{subscription}/ip-ranges/add', [SubscriptionController::class, 'addIpRange'])->name('ip-ranges.add');
                Route::post('/{subscription}/ip-ranges/remove', [SubscriptionController::class, 'removeIpRange'])->name('ip-ranges.remove');

                // Subscription types management
                Route::get('/types/manage', [SubscriptionController::class, 'types'])->name('types');
                Route::post('/types', [SubscriptionController::class, 'storeType'])->name('types.store');
                Route::put('/types/{type}', [SubscriptionController::class, 'updateType'])->name('types.update');
                Route::delete('/types/{type}', [SubscriptionController::class, 'destroyType'])->name('types.destroy');
            });

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

            // Announcement management
            Route::resource('announcements', AdminAnnouncementController::class)->except(['show']);

            // Journal-User management
            Route::get('journal-users', [JournalUserController::class, 'index'])->name('journal-users.index');
            Route::get('journal-users/create', [JournalUserController::class, 'create'])->name('journal-users.create');
            Route::post('journal-users', [JournalUserController::class, 'store'])->name('journal-users.store');
            Route::get('journal-users/{pivotId}/edit', [JournalUserController::class, 'edit'])->name('journal-users.edit');
            Route::put('journal-users/{pivotId}', [JournalUserController::class, 'update'])->name('journal-users.update');
            Route::delete('journal-users/{pivotId}', [JournalUserController::class, 'destroy'])->name('journal-users.destroy');
            Route::post('journal-users/{pivotId}/toggle-status', [JournalUserController::class, 'toggleStatus'])->name('journal-users.toggle-status');

            // Journal management
            Route::resource('journals', AdminJournalController::class);
            Route::post('journals/{journal}/toggle-status', [AdminJournalController::class, 'toggleStatus'])->name('journals.toggle-status');

            // Journal settings
            Route::get('journals/{journal}/settings', [JournalSettingsController::class, 'edit'])->name('journals.settings.edit');
            Route::put('journals/{journal}/settings', [JournalSettingsController::class, 'update'])->name('journals.settings.update');
            Route::post('journals/{journal}/settings/reset', [JournalSettingsController::class, 'reset'])->name('journals.settings.reset');

            // Journal CMS - Pages
            Route::get('journals/{journal}/cms/pages', [JournalPageController::class, 'index'])->name('journals.cms.pages.index');
            Route::get('journals/{journal}/cms/pages/create', [JournalPageController::class, 'create'])->name('journals.cms.pages.create');
            Route::post('journals/{journal}/cms/pages', [JournalPageController::class, 'store'])->name('journals.cms.pages.store');
            Route::get('journals/{journal}/cms/pages/{page}', [JournalPageController::class, 'edit'])->name('journals.cms.pages.edit');
            Route::put('journals/{journal}/cms/pages/{page}', [JournalPageController::class, 'update'])->name('journals.cms.pages.update');
            Route::delete('journals/{journal}/cms/pages/{page}', [JournalPageController::class, 'destroy'])->name('journals.cms.pages.destroy');
            Route::post('journals/{journal}/cms/pages/reorder', [JournalPageController::class, 'reorder'])->name('journals.cms.pages.reorder');

            // Journal CMS - Sections
            Route::post('journals/{journal}/cms/pages/{page}/sections', [JournalPageController::class, 'addSection'])->name('journals.cms.pages.sections.store');
            Route::get('journals/{journal}/cms/pages/{page}/sections/{section}/edit', [JournalPageController::class, 'editSection'])->name('journals.cms.pages.sections.edit');
            Route::put('journals/{journal}/cms/pages/{page}/sections/{section}', [JournalPageController::class, 'updateSection'])->name('journals.cms.pages.sections.update');
            Route::delete('journals/{journal}/cms/pages/{page}/sections/{section}', [JournalPageController::class, 'deleteSection'])->name('journals.cms.pages.sections.destroy');
            Route::put('journals/{journal}/cms/pages/{page}/sections/reorder', [JournalPageController::class, 'reorderSections'])->name('journals.cms.pages.sections.reorder');

            // Journal CMS - Menus
            Route::get('journals/{journal}/cms/menus', [JournalMenuController::class, 'index'])->name('journals.cms.menus.index');
            Route::post('journals/{journal}/cms/menus', [JournalMenuController::class, 'store'])->name('journals.cms.menus.store');
            Route::put('journals/{journal}/cms/menus/{menu}', [JournalMenuController::class, 'update'])->name('journals.cms.menus.update');
            Route::delete('journals/{journal}/cms/menus/{menu}', [JournalMenuController::class, 'destroy'])->name('journals.cms.menus.destroy');
            Route::post('journals/{journal}/cms/menus/reorder', [JournalMenuController::class, 'reorder'])->name('journals.cms.menus.reorder');

            // Journal CMS - Theme
            Route::get('journals/{journal}/cms/theme', [JournalThemeController::class, 'edit'])->name('journals.cms.theme.edit');
            Route::put('journals/{journal}/cms/theme', [JournalThemeController::class, 'update'])->name('journals.cms.theme.update');
            Route::post('journals/{journal}/cms/theme/favicon', [JournalThemeController::class, 'uploadFavicon'])->name('journals.cms.theme.favicon');
            Route::post('journals/{journal}/cms/theme/reset', [JournalThemeController::class, 'reset'])->name('journals.cms.theme.reset');
            Route::get('journals/{journal}/cms/theme/preview.css', [JournalThemeController::class, 'preview'])->name('journals.cms.theme.preview');

            // Platform Settings (super_admin only)
            Route::middleware(['user_role:super_admin'])->group(function () {
                Route::get('platform-settings', [PlatformSettingsController::class, 'edit'])->name('platform-settings.edit');
                Route::put('platform-settings', [PlatformSettingsController::class, 'update'])->name('platform-settings.update');
                Route::delete('platform-settings/logo', [PlatformSettingsController::class, 'removeLogo'])->name('platform-settings.remove-logo');
                Route::delete('platform-settings/favicon', [PlatformSettingsController::class, 'removeFavicon'])->name('platform-settings.remove-favicon');
                Route::post('platform-settings/reset', [PlatformSettingsController::class, 'reset'])->name('platform-settings.reset');
            });

            // Plugin Management
            Route::get('plugins', [PluginController::class, 'index'])->name('plugins.index');
            Route::get('plugins/{plugin}', [PluginController::class, 'show'])->name('plugins.show');
            Route::post('plugins/install', [PluginController::class, 'install'])->name('plugins.install');
            Route::post('plugins/upload', [PluginController::class, 'upload'])->name('plugins.upload');
            Route::post('plugins/{plugin}/enable', [PluginController::class, 'enable'])->name('plugins.enable');
            Route::post('plugins/{plugin}/disable', [PluginController::class, 'disable'])->name('plugins.disable');
            Route::post('plugins/{plugin}/enable-for-journal', [PluginController::class, 'enableForJournal'])->name('plugins.enable-for-journal');
            Route::post('plugins/{plugin}/disable-for-journal', [PluginController::class, 'disableForJournal'])->name('plugins.disable-for-journal');
            Route::get('plugins/{plugin}/settings', [PluginController::class, 'settings'])->name('plugins.settings');
            Route::post('plugins/{plugin}/settings', [PluginController::class, 'updateSettings'])->name('plugins.settings.update');
            Route::delete('plugins/{plugin}', [PluginController::class, 'destroy'])->name('plugins.destroy');
            Route::post('plugins/refresh', [PluginController::class, 'refresh'])->name('plugins.refresh');
        });

        // Reviewers group
        Route::middleware(['user_role:reviewer'])->group(function () {
            Route::get('/reviewer', [ReviewerController::class, 'dashboard'])->name('reviewer.dashboard');
            Route::get('/reviewer/manuscripts', [ReviewerController::class, 'index'])->name('reviewer.manuscripts.index');
            Route::get('/reviewer/manuscripts/{id}', [ReviewerController::class, 'show'])->name('reviewer.manuscripts.show');

            // Review management routes
            Route::get('/reviewer/reviews', [ReviewController::class, 'index'])->name('reviewer.reviews.index');
            Route::get('/reviewer/reviews/history', [ReviewController::class, 'history'])->name('reviewer.reviews.history');
            Route::get('/reviewer/reviews/{review}', [ReviewController::class, 'show'])->name('reviewer.reviews.show');
            Route::post('/reviewer/reviews/{review}/accept', [ReviewController::class, 'accept'])->name('reviewer.reviews.accept');
            Route::post('/reviewer/reviews/{review}/decline', [ReviewController::class, 'decline'])->name('reviewer.reviews.decline');
            Route::post('/reviewer/reviews/{review}/submit', [ReviewController::class, 'submit'])->name('reviewer.reviews.submit');
            Route::post('/reviewer/reviews/{review}/save-draft', [ReviewController::class, 'saveDraft'])->name('reviewer.reviews.save-draft');
            Route::post('/reviewer/reviews/{review}/request-extension', [ReviewController::class, 'requestExtension'])->name('reviewer.reviews.request-extension');
        });
    });

    Route::middleware(['auth'])->group(function () {
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::get('/api/notifications', [NotificationController::class, 'getNotifications'])->name('api.notifications');
        Route::post('/api/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('api.notifications.read');
        Route::post('/api/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.readAll');

        // Manuscript file management routes
        Route::post('/manuscripts/{manuscript}/files/upload', [ManuscriptFileController::class, 'upload'])->name('manuscripts.files.upload');
        Route::get('/manuscripts/{manuscript}/files', [ManuscriptFileController::class, 'index'])->name('manuscripts.files.index');
        Route::get('/manuscripts/files/{file}/download', [ManuscriptFileController::class, 'download'])->name('manuscripts.files.download');
        Route::delete('/manuscripts/files/{file}', [ManuscriptFileController::class, 'destroy'])->name('manuscripts.files.destroy');
        Route::get('/manuscripts/files/requirements', [ManuscriptFileController::class, 'requirements'])->name('manuscripts.files.requirements');
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
