<?php

use App\Http\Controllers\Admin\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\Admin\InstitutionController;
use App\Http\Controllers\Admin\JournalController as AdminJournalController;
use App\Http\Controllers\Admin\JournalMenuController;
use App\Http\Controllers\Admin\JournalPageController;
use App\Http\Controllers\Admin\JournalSettingsController;
use App\Http\Controllers\Admin\JournalThemeController;
use App\Http\Controllers\Admin\JournalUserController;
use App\Http\Controllers\Admin\PlatformSettingsController;
use App\Http\Controllers\Admin\PluginController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'user_role:super_admin|managing_editor|editor_in_chief'])->prefix('admin')->name('admin.')->group(function () {
    // Institution management
    Route::resource('institutions', InstitutionController::class);

    // Announcement management
    Route::resource('announcements', AdminAnnouncementController::class)->except(['show']);

    // Journal-User management
    Route::get('journal-users', [JournalUserController::class, 'index'])->name('journal-users.index');
    Route::get('journal-users/create', [JournalUserController::class, 'create'])->name('journal-users.create');
    Route::post('journal-users', [JournalUserController::class, 'store'])->name('journal-users.store');
    Route::get('journal-users/{pivotId}/edit', [JournalUserController::class, 'edit'])->name('journal-users.edit');
    Route::put('journal-users/{pivotId}', [JournalUserController::class, 'update'])->name('journal-users.update');
    Route::delete('journal-users/{pivotId}', [JournalUserController::class, 'destroy'])->name('journal-users.destroy');
    Route::post('journal-users/{pivotId}/toggle-status', [JournalUserController::class, 'toggleStatus'])->name('journal-users.toggle-status');

    // Journal management
    Route::resource('journals', AdminJournalController::class);
    Route::post('journals/{journal}/toggle-status', [AdminJournalController::class, 'toggleStatus'])->name('journals.toggle-status');

    // Journal settings
    Route::get('journals/{journal}/settings', [JournalSettingsController::class, 'edit'])->name('journals.settings.edit');
    Route::put('journals/{journal}/settings', [JournalSettingsController::class, 'update'])->name('journals.settings.update');
    Route::post('journals/{journal}/settings/reset', [JournalSettingsController::class, 'reset'])->name('journals.settings.reset');

    // Journal CMS - Pages
    Route::get('journals/{journal}/cms/pages', [JournalPageController::class, 'index'])->name('journals.cms.pages.index');
    Route::get('journals/{journal}/cms/pages/create', [JournalPageController::class, 'create'])->name('journals.cms.pages.create');
    Route::post('journals/{journal}/cms/pages', [JournalPageController::class, 'store'])->name('journals.cms.pages.store');
    Route::get('journals/{journal}/cms/pages/{page}', [JournalPageController::class, 'edit'])->name('journals.cms.pages.edit');
    Route::put('journals/{journal}/cms/pages/{page}', [JournalPageController::class, 'update'])->name('journals.cms.pages.update');
    Route::delete('journals/{journal}/cms/pages/{page}', [JournalPageController::class, 'destroy'])->name('journals.cms.pages.destroy');
    Route::post('journals/{journal}/cms/pages/reorder', [JournalPageController::class, 'reorder'])->name('journals.cms.pages.reorder');

    // Journal CMS - Sections
    Route::post('journals/{journal}/cms/pages/{page}/sections', [JournalPageController::class, 'addSection'])->name('journals.cms.pages.sections.store');
    Route::get('journals/{journal}/cms/pages/{page}/sections/{section}/edit', [JournalPageController::class, 'editSection'])->name('journals.cms.pages.sections.edit');
    Route::put('journals/{journal}/cms/pages/{page}/sections/{section}', [JournalPageController::class, 'updateSection'])->name('journals.cms.pages.sections.update');
    Route::delete('journals/{journal}/cms/pages/{page}/sections/{section}', [JournalPageController::class, 'deleteSection'])->name('journals.cms.pages.sections.destroy');
    Route::put('journals/{journal}/cms/pages/{page}/sections/reorder', [JournalPageController::class, 'reorderSections'])->name('journals.cms.pages.sections.reorder');

    // Journal CMS - Menus
    Route::get('journals/{journal}/cms/menus', [JournalMenuController::class, 'index'])->name('journals.cms.menus.index');
    Route::post('journals/{journal}/cms/menus', [JournalMenuController::class, 'store'])->name('journals.cms.menus.store');
    Route::put('journals/{journal}/cms/menus/{menu}', [JournalMenuController::class, 'update'])->name('journals.cms.menus.update');
    Route::delete('journals/{journal}/cms/menus/{menu}', [JournalMenuController::class, 'destroy'])->name('journals.cms.menus.destroy');
    Route::post('journals/{journal}/cms/menus/reorder', [JournalMenuController::class, 'reorder'])->name('journals.cms.menus.reorder');

    // Journal CMS - Theme
    Route::get('journals/{journal}/cms/theme', [JournalThemeController::class, 'edit'])->name('journals.cms.theme.edit');
    Route::put('journals/{journal}/cms/theme', [JournalThemeController::class, 'update'])->name('journals.cms.theme.update');
    Route::post('journals/{journal}/cms/theme/favicon', [JournalThemeController::class, 'uploadFavicon'])->name('journals.cms.theme.favicon');
    Route::post('journals/{journal}/cms/theme/reset', [JournalThemeController::class, 'reset'])->name('journals.cms.theme.reset');
    Route::get('journals/{journal}/cms/theme/preview.css', [JournalThemeController::class, 'preview'])->name('journals.cms.theme.preview');

    // Platform Settings (super_admin only)
    Route::middleware(['user_role:super_admin'])->group(function () {
        Route::get('platform-settings', [PlatformSettingsController::class, 'edit'])->name('platform-settings.edit');
        Route::put('platform-settings', [PlatformSettingsController::class, 'update'])->name('platform-settings.update');
        Route::delete('platform-settings/logo', [PlatformSettingsController::class, 'removeLogo'])->name('platform-settings.remove-logo');
        Route::delete('platform-settings/favicon', [PlatformSettingsController::class, 'removeFavicon'])->name('platform-settings.remove-favicon');
        Route::post('platform-settings/reset', [PlatformSettingsController::class, 'reset'])->name('platform-settings.reset');
    });

    // Plugin Management
    Route::get('plugins', [PluginController::class, 'index'])->name('plugins.index');
    Route::get('plugins/{plugin}', [PluginController::class, 'show'])->name('plugins.show');
    Route::post('plugins/install', [PluginController::class, 'install'])->name('plugins.install');
    Route::post('plugins/upload', [PluginController::class, 'upload'])->name('plugins.upload');
    Route::post('plugins/{plugin}/enable', [PluginController::class, 'enable'])->name('plugins.enable');
    Route::post('plugins/{plugin}/disable', [PluginController::class, 'disable'])->name('plugins.disable');
    Route::post('plugins/{plugin}/enable-for-journal', [PluginController::class, 'enableForJournal'])->name('plugins.enable-for-journal');
    Route::post('plugins/{plugin}/disable-for-journal', [PluginController::class, 'disableForJournal'])->name('plugins.disable-for-journal');
    Route::get('plugins/{plugin}/settings', [PluginController::class, 'settings'])->name('plugins.settings');
    Route::post('plugins/{plugin}/settings', [PluginController::class, 'updateSettings'])->name('plugins.settings.update');
    Route::delete('plugins/{plugin}', [PluginController::class, 'destroy'])->name('plugins.destroy');
    Route::post('plugins/refresh', [PluginController::class, 'refresh'])->name('plugins.refresh');
});
