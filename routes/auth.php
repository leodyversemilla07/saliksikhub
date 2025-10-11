<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
|
| Here are all authentication-related routes for the application.
| These routes are loaded by the RouteServiceProvider and use Fortify
| for authentication functionality.
|
*/

// Guest routes - Login, Register, Password Reset
Route::middleware('guest')->group(function () {
    Route::inertia('/login', 'auth/login')->name('login');
    Route::inertia('/register', 'auth/register')->name('register');
    Route::inertia('/forgot-password', 'auth/forgot-password')->name('password.request');
    Route::get('/reset-password/{token}', fn ($token) => inertia('auth/reset-password', [
        'token' => $token,
        'email' => request('email'),
    ]))->name('password.reset');
});

// Authenticated user routes - Email Verification, Password Confirmation, 2FA
Route::middleware('auth')->group(function () {
    Route::inertia('/verify-email', 'auth/verify-email')->name('verification.notice');
    Route::inertia('/confirm-password', 'auth/confirm-password')->name('password.confirm');
    Route::inertia('/two-factor-challenge', 'auth/two-factor-challenge')->name('two-factor.login');
});
