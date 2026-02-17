<?php

namespace App\Core\Plugin\Contracts;

interface PluginInterface
{
    /**
     * Register hooks and filters.
     * This is called when the plugin is loaded.
     */
    public function register(): void;

    /**
     * Initialize the plugin.
     * This is called after all plugins are registered.
     */
    public function boot(): void;

    /**
     * Run activation logic.
     * This is called when the plugin is enabled.
     */
    public function activate(): void;

    /**
     * Run deactivation logic.
     * This is called when the plugin is disabled.
     */
    public function deactivate(): void;

    /**
     * Run uninstall logic.
     * This is called when the plugin is removed.
     */
    public function uninstall(): void;

    /**
     * Get plugin information.
     *
     * @return array{
     *     name: string,
     *     version: string,
     *     author: string,
     *     description?: string,
     * }
     */
    public function getInfo(): array;

    /**
     * Check if plugin has settings.
     */
    public function hasSettings(): bool;

    /**
     * Render settings page.
     *
     * @return mixed HTML or component
     */
    public function renderSettings(): mixed;
}
