<?php

use App\Http\Controllers\Editorial\EditorController;
use App\Http\Controllers\Editorial\InitialScreeningController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'user_role:super_admin|managing_editor|editor_in_chief|associate_editor|language_editor'])->group(function () {
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
});
