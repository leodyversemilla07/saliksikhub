<?php

use App\Http\Controllers\Editorial\EditorDashboardController;
use App\Http\Controllers\Editorial\EditorDecisionController;
use App\Http\Controllers\Editorial\EditorManuscriptController;
use App\Http\Controllers\Editorial\EditorProductionController;
use App\Http\Controllers\Editorial\EditorReviewController;
use App\Http\Controllers\Editorial\InitialScreeningController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'user_role:super_admin|managing_editor|editor_in_chief|associate_editor|language_editor'])->group(function () {
    // Dashboard
    Route::get('/editor', [EditorDashboardController::class, 'index'])->name('editor.dashboard');

    // Manuscript listing and viewing
    Route::get('/editor/manuscripts', [EditorManuscriptController::class, 'index'])->name('editor.manuscripts.index');
    Route::get('/editor/manuscripts/{id}', [EditorManuscriptController::class, 'show'])->name('editor.manuscripts.show');

    // Editorial decisions
    Route::get('/editor/manuscripts/{manuscript}/decision', [EditorManuscriptController::class, 'createDecision'])->name('editor.manuscripts.create_decision');
    Route::post('/editor/manuscripts/{manuscript}/decision', [EditorDecisionController::class, 'store'])->name('editor.manuscripts.decision');
    Route::get('/editor/manuscripts/{manuscript}/decisions', [EditorManuscriptController::class, 'showDecisions'])->name('editor.manuscripts.decisions');

    // Status management and production
    Route::post('/editor/manuscripts/{manuscript}/set-under-review', [EditorProductionController::class, 'setUnderReview'])->name('editor.manuscripts.set_under_review');
    Route::post('/editor/manuscripts/{manuscript}/start-copyediting', [EditorProductionController::class, 'startCopyEditing'])->name('editor.manuscripts.start_copyediting');
    Route::post('/editor/manuscripts/{manuscript}/upload-finalized', [EditorProductionController::class, 'uploadFinalized'])->name('editor.manuscripts.upload_finalized');
    Route::get('/editor/manuscripts/{manuscript}/prepare-publication', [EditorProductionController::class, 'showPublicationForm'])->name('editor.manuscripts.prepare_publication_form');
    Route::post('/editor/manuscripts/{manuscript}/prepare-publication', [EditorProductionController::class, 'prepareForPublication'])->name('editor.manuscripts.prepare_publication');

    // Initial screening routes
    Route::get('/editor/manuscripts/{manuscript}/initial-screening', [InitialScreeningController::class, 'show'])->name('editor.manuscripts.initial_screening');
    Route::post('/editor/manuscripts/{manuscript}/initial-screening', [InitialScreeningController::class, 'update'])->name('editor.manuscripts.initial_screening.update');

    // Review assignment routes
    Route::get('/editor/manuscripts/{manuscript}/assign-reviewers', [EditorReviewController::class, 'showAssignReviewers'])->name('editor.manuscripts.assign_reviewers');
    Route::post('/editor/manuscripts/{manuscript}/assign-reviewers', [EditorReviewController::class, 'assignReviewers'])->name('editor.manuscripts.assign_reviewers.store');
    Route::get('/editor/manuscripts/{manuscript}/reviews', [EditorReviewController::class, 'showManuscriptReviews'])->name('editor.manuscripts.reviews');
});
