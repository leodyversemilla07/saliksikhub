<?php

use App\Http\Controllers\Api\JATSController;
use App\Http\Controllers\Api\OAIController;
use App\Http\Controllers\Api\PubMedController;
use App\Http\Controllers\Api\SushiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| SUSHI API Routes - COUNTER 5 compliant statistics API
| OAI-PMH Routes - Open Archives Initiative Protocol for Metadata Harvesting
| JATS XML Routes - Journal Article Tag Suite XML export
| PubMed XML Routes - PubMed Central submission format
|
*/

// OAI-PMH endpoint
Route::get('/oai', [OAIController::class, 'index'])->name('oai.index');

// JATS XML endpoints
Route::prefix('jats')->name('jats.')->group(function () {
    Route::get('/publications/{publication}', [JATSController::class, 'show'])->name('show');
    Route::get('/publications/{publication}/download', [JATSController::class, 'download'])->name('download');
    Route::post('/batch', [JATSController::class, 'batch'])->name('batch');
    Route::get('/issue/{issue}', [JATSController::class, 'issue'])->name('issue');
    Route::post('/validate', [JATSController::class, 'validateXml'])->name('validate');
});

// PubMed XML endpoints
Route::prefix('pubmed')->name('pubmed.')->group(function () {
    Route::get('/publications/{publication}', [PubMedController::class, 'show'])->name('show');
    Route::get('/publications/{publication}/download', [PubMedController::class, 'download'])->name('download');
    Route::post('/batch', [PubMedController::class, 'batch'])->name('batch');
    Route::get('/issue/{issue}', [PubMedController::class, 'issue'])->name('issue');
    Route::post('/validate', [PubMedController::class, 'validateXml'])->name('validate');
    Route::post('/ftp/prepare', [PubMedController::class, 'prepareFtpUpload'])->name('ftp.prepare');
    Route::get('/ftp/list', [PubMedController::class, 'listFtpUploads'])->name('ftp.list');
});

Route::prefix('sushi')->name('sushi.')->group(function () {
    // Public SUSHI endpoints (no authentication required for discovery)
    Route::get('/status', [SushiController::class, 'status'])->name('status');
    Route::get('/members', [SushiController::class, 'members'])->name('members');
    Route::get('/reports', [SushiController::class, 'reports'])->name('reports');

    // Report endpoints (require API key in query parameters)
    Route::get('/reports/{report}', [SushiController::class, 'report'])->name('report');
});
