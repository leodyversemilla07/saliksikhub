<?php

use App\Http\Controllers\Submission\ManuscriptFileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::post('/manuscripts/{manuscript}/files/upload', [ManuscriptFileController::class, 'upload'])->name('manuscripts.files.upload');
    Route::get('/manuscripts/{manuscript}/files', [ManuscriptFileController::class, 'index'])->name('manuscripts.files.index');
    Route::get('/manuscripts/files/{file}/download', [ManuscriptFileController::class, 'download'])->name('manuscripts.files.download');
    Route::delete('/manuscripts/files/{file}', [ManuscriptFileController::class, 'destroy'])->name('manuscripts.files.destroy');
    Route::get('/manuscripts/files/requirements', [ManuscriptFileController::class, 'requirements'])->name('manuscripts.files.requirements');
});
