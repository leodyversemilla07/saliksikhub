<?php

namespace App\Providers;

use App\Core\Plugin\PluginManager;
use App\Models\Plugin;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class PluginServiceProvider extends ServiceProvider
{
    /**
     * Register plugin services.
     */
    public function register(): void
    {
        $this->app->singleton(PluginManager::class, function ($app) {
            return new PluginManager;
        });
    }

    /**
     * Bootstrap plugin services.
     */
    public function boot(): void
    {
        $manager = $this->app->make(PluginManager::class);

        // Only proceed if the plugins table exists (migrations have run).
        if (! $this->pluginsTableExists()) {
            return;
        }

        // Register core plugins bundled with the application
        $this->registerCorePlugins($manager);

        // Load active plugins
        try {
            if ($this->app->has('currentJournal')) {
                $journalId = app('currentJournal')?->id;
                $manager->loadActivePlugins($journalId);
            } else {
                $manager->loadActivePlugins();
            }
        } catch (\Exception $e) {
            // Database not ready — skip plugin loading
            report($e);
        }
    }

    /**
     * Check whether the plugins table exists in the database.
     */
    protected function pluginsTableExists(): bool
    {
        try {
            return Schema::hasTable('plugins');
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Discover and register core plugins bundled with the application.
     *
     * Core plugins live in app/Plugins/Core/ and are auto-installed
     * on the first run so they appear in the admin plugin list.
     */
    protected function registerCorePlugins(PluginManager $manager): void
    {
        $corePath = app_path('Plugins/Core');

        if (! is_dir($corePath)) {
            return;
        }

        $iterator = new \DirectoryIterator($corePath);

        foreach ($iterator as $item) {
            if (! $item->isDir() || $item->isDot()) {
                continue;
            }

            $pluginPath = $item->getPathname();
            $jsonPath = $pluginPath.'/plugin.json';

            if (! file_exists($jsonPath)) {
                continue;
            }

            $pluginData = json_decode(file_get_contents($jsonPath), true);
            if (! $pluginData || ! isset($pluginData['name'])) {
                continue;
            }

            // Skip if already installed
            if (Plugin::where('name', $pluginData['name'])->exists()) {
                continue;
            }

            // Install core plugin using the manager's logic
            try {
                $plugin = Plugin::create([
                    'name' => $pluginData['name'],
                    'display_name' => $pluginData['displayName'] ?? $pluginData['name'],
                    'version' => $pluginData['version'] ?? '1.0.0',
                    'author' => $pluginData['author'] ?? 'SaliksikHub Team',
                    'description' => $pluginData['description'] ?? '',
                    'path' => $pluginPath,
                    'is_global' => $pluginData['isGlobal'] ?? true,
                    'enabled' => true, // Core plugins are enabled by default
                    'settings' => $pluginData['defaultSettings'] ?? null,
                ]);

                // Copy to the managed plugins directory so the manager
                // can find it for future reference
                $managedPath = storage_path('plugins/'.$pluginData['name']);
                if (! is_dir(dirname($managedPath))) {
                    mkdir(dirname($managedPath), 0755, true);
                }
                if (! is_dir($managedPath)) {
                    $this->copyDirectory($pluginPath, $managedPath);
                    $plugin->update(['path' => $managedPath]);
                }
            } catch (\Exception $e) {
                report($e);
            }
        }
    }

    /**
     * Copy a directory recursively.
     */
    protected function copyDirectory(string $source, string $destination): void
    {
        if (! is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $item) {
            $relativePath = substr($item->getPathname(), strlen($source));
            $relativePath = ltrim($relativePath, '/\\');
            $destPath = $destination.DIRECTORY_SEPARATOR.$relativePath;

            if ($item->isDir()) {
                if (! is_dir($destPath)) {
                    mkdir($destPath, 0755, true);
                }
            } else {
                copy($item->getPathname(), $destPath);
            }
        }
    }
}
