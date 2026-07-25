<?php

use App\Http\Controllers\Production\GalleyController;
use App\Http\Controllers\Publication\DOIController;
use App\Http\Controllers\Publication\IssueController;
use App\Http\Controllers\Publication\PublicationVersionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'user_role:super_admin|managing_editor|editor_in_chief|associate_editor|language_editor'])->group(function () {
    // Publication versioning
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

    // DOI management
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

    // Galley management
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

    // Issues
    Route::resource('issues', IssueController::class);
    Route::post('issues/{issue}/comments', [IssueController::class, 'storeComment'])->name('issues.comments.store');
    Route::get('issues/{issue}/assign-manuscripts', [IssueController::class, 'showAssignManuscriptsForm'])->name('issues.assign-manuscripts.form');
    Route::post('issues/{issue}/assign-manuscripts', [IssueController::class, 'assignManuscripts'])->name('issues.assign-manuscripts');
    Route::delete('issues/{issue}/manuscripts/{manuscript}', [IssueController::class, 'unassignManuscript'])->name('issues.manuscripts.unassign');
});
