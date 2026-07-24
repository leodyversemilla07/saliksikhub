<?php

use App\Http\Controllers\Submission\AuthorController;
use App\Http\Controllers\Submission\ManuscriptController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'user_role:author'])->group(function () {
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
