<?php

use App\Http\Controllers\Install\InstallController;
use Illuminate\Support\Facades\Route;

// Installation wizard routes (outside journal middleware — no journal exists yet)
Route::get('/install', [InstallController::class, 'index'])->name('install');
Route::post('/install', [InstallController::class, 'store'])->name('install.store');
