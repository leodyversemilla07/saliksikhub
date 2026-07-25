<?php

use App\Http\Controllers\Production\ProductionWorkflowController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'user_role:super_admin|managing_editor|editor_in_chief|associate_editor|language_editor'])->prefix('/production')->name('production.')->group(function () {
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
