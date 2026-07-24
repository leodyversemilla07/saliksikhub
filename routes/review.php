<?php

use App\Http\Controllers\Review\ReviewController;
use App\Http\Controllers\Review\ReviewerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'user_role:reviewer'])->group(function () {
Route::get('/reviewer', [ReviewerController::class, 'dashboard'])->name('reviewer.dashboard');
Route::get('/reviewer/manuscripts', [ReviewerController::class, 'index'])->name('reviewer.manuscripts.index');
Route::get('/reviewer/manuscripts/{id}', [ReviewerController::class, 'show'])->name('reviewer.manuscripts.show');

Route::get('/reviewer/reviews', [ReviewController::class, 'index'])->name('reviewer.reviews.index');
Route::get('/reviewer/reviews/history', [ReviewController::class, 'history'])->name('reviewer.reviews.history');
Route::get('/reviewer/reviews/{review}', [ReviewController::class, 'show'])->name('reviewer.reviews.show');
Route::post('/reviewer/reviews/{review}/accept', [ReviewController::class, 'accept'])->name('reviewer.reviews.accept');
Route::post('/reviewer/reviews/{review}/decline', [ReviewController::class, 'decline'])->name('reviewer.reviews.decline');
Route::post('/reviewer/reviews/{review}/submit', [ReviewController::class, 'submit'])->name('reviewer.reviews.submit');
Route::post('/reviewer/reviews/{review}/save-draft', [ReviewController::class, 'saveDraft'])->name('reviewer.reviews.save-draft');
Route::post('/reviewer/reviews/{review}/request-extension', [ReviewController::class, 'requestExtension'])->name('reviewer.reviews.request-extension');
});
