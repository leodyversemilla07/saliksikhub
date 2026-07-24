<?php

use App\Http\Controllers\Payment\PaymentController;
use App\Http\Controllers\Payment\SubscriptionController;
use App\Http\Controllers\Statistics\StatisticsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'user_role:super_admin|managing_editor|editor_in_chief|associate_editor|language_editor'])->group(function () {
// Statistics
Route::prefix('/statistics')->name('statistics.')->group(function () {
Route::get('/', [StatisticsController::class, 'index'])->name('index');
Route::get('/manuscripts/{manuscript}', [StatisticsController::class, 'show'])->name('show');
Route::get('/manuscripts/{manuscript}/export', [StatisticsController::class, 'export'])->name('export');
Route::get('/manuscripts/{manuscript}/api', [StatisticsController::class, 'api'])->name('api');
Route::post('/counter-report', [StatisticsController::class, 'counterReport'])->name('counter-report');
});

// Payments
Route::prefix('/payments')->name('payments.')->group(function () {
Route::get('/', [PaymentController::class, 'index'])->name('index');
Route::get('/{payment}', [PaymentController::class, 'show'])->name('show');

Route::get('/manuscripts/{manuscript}/submission-fee', [PaymentController::class, 'submissionFee'])->name('submission-fee');
Route::post('/manuscripts/{manuscript}/submission-fee', [PaymentController::class, 'processSubmissionFee'])->name('submission-fee.process');

Route::get('/manuscripts/{manuscript}/publication-charge', [PaymentController::class, 'publicationCharge'])->name('publication-charge');
Route::post('/manuscripts/{manuscript}/publication-charge', [PaymentController::class, 'processPublicationCharge'])->name('publication-charge.process');

Route::post('/{payment}/refund', [PaymentController::class, 'refund'])->name('refund');
});

// Subscriptions
Route::prefix('/subscriptions')->name('subscriptions.')->group(function () {
Route::get('/', [SubscriptionController::class, 'index'])->name('index');
Route::get('/create', [SubscriptionController::class, 'create'])->name('create');
Route::post('/', [SubscriptionController::class, 'store'])->name('store');
Route::get('/{subscription}', [SubscriptionController::class, 'show'])->name('show');

Route::post('/{subscription}/renew', [SubscriptionController::class, 'renew'])->name('renew');
Route::post('/{subscription}/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
Route::post('/{subscription}/suspend', [SubscriptionController::class, 'suspend'])->name('suspend');
Route::post('/{subscription}/reactivate', [SubscriptionController::class, 'reactivate'])->name('reactivate');

Route::post('/{subscription}/ip-ranges/add', [SubscriptionController::class, 'addIpRange'])->name('ip-ranges.add');
Route::post('/{subscription}/ip-ranges/remove', [SubscriptionController::class, 'removeIpRange'])->name('ip-ranges.remove');

Route::get('/types/manage', [SubscriptionController::class, 'types'])->name('types');
Route::post('/types', [SubscriptionController::class, 'storeType'])->name('types.store');
Route::put('/types/{type}', [SubscriptionController::class, 'updateType'])->name('types.update');
Route::delete('/types/{type}', [SubscriptionController::class, 'destroyType'])->name('types.destroy');
});

// User management
Route::resource('users', \App\Http\Controllers\UserManagement\UserController::class);
Route::post('users/bulk-destroy', [\App\Http\Controllers\UserManagement\UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
});
