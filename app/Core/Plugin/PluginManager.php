<?php

namespace App\Core\Plugin;

use App\Core\Plugin\Contracts\PluginInterface;
use App\Models\Journal;
use App\Models\Plugin;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use Symfony\Component\Finder\Finder;

class PluginManager
{
    /**
     * Path to plugins directory.
     */
    protected string $pluginsPath;

    /**
     * Loaded plugin instances.
     *
     * @var array<string, PluginInterface>
     */
    protected array $loadedPlugins = [];

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->pluginsPath = app()->environment('testing')
            ? storage_path('framework/testing/plugins')
            : storage_path('plugins');
    }

    /**
     * Install a plugin from a directory or zip file.
     *
     * @param  string  $source  Path to plugin directory or zip file
     * @return Plugin|null The installed plugin model
     *
     * @throws RuntimeException
     */
    public function install(string $source): ?Plugin
    {
        // Handle zip files
        if (Str::endsWith($source, '.zip')) {
            $source = $this->extractZip($source);
        }

        // Validate plugin structure
        $pluginJson = $this->getPluginJson($source);
        if (! $pluginJson) {
            throw new RuntimeException('Invalid plugin: plugin.json not found');
        }

        // Check if plugin already exists
        $existing = Plugin::where('name', $pluginJson['name'])->first();
        if ($existing) {
            // Update if version is different
            if ($existing->version !== $pluginJson['version']) {
                return $this->update($existing, $source, $pluginJson);
            }

            return $existing;
        }

        // Copy to plugins directory
        $destination = $this->copyToPluginsDirectory($source, $pluginJson['name']);

        // Create plugin record
        $plugin = Plugin::create([
            'name' => $pluginJson['name'],
            'display_name' => $pluginJson['displayName'] ?? $pluginJson['name'],
            'version' => $pluginJson['version'] ?? '1.0.0',
            'author' => $pluginJson['author'] ?? null,
            'description' => $pluginJson['description'] ?? null,
            'path' => $destination,
            'is_global' => $pluginJson['isGlobal'] ?? false,
            'enabled' => false,
            'settings' => $pluginJson['defaultSettings'] ?? null,
        ]);

        return $plugin;
    }

    /**
     * Update an existing plugin.
     */
    protected function update(Plugin $plugin, string $source, array $pluginJson): Plugin
    {
        // Backup old version
        $backupPath = $plugin->path.'_backup_'.time();
        rename($plugin->path, $backupPath);

        try {
            // Copy new version
            $destination = $this->copyToPluginsDirectory($source, $pluginJson['name']);

            // Update plugin record
            $plugin->update([
                'version' => $pluginJson['version'],
                'author' => $pluginJson['author'] ?? $plugin->author,
                'description' => $pluginJson['description'] ?? $plugin->description,
                'path' => $destination,
            ]);

            // Clean up backup
            $this->removeDirectory($backupPath);

            return $plugin;
        } catch (\Exception $e) {
            // Restore backup on failure
            rename($backupPath, $plugin->path);
            throw $e;
        }
    }

    /**
     * Uninstall a plugin.
     */
    public function uninstall(Plugin $plugin): bool
    {
        // Run uninstall hook if plugin is loaded
        if (isset($this->loadedPlugins[$plugin->name])) {
            $this->loadedPlugins[$plugin->name]->uninstall();
            unset($this->loadedPlugins[$plugin->name]);
        }

        // Remove from database
        $plugin->delete();

        // Remove directory
        if (is_dir($plugin->path)) {
            $this->removeDirectory($plugin->path);
        }

        return true;
    }

    /**
     * Enable a plugin.
     */
    public function enable(Plugin $plugin, ?int $journalId = null): bool
    {
        if ($journalId === null || $plugin->is_global) {
            // Enable globally
            $plugin->update(['enabled' => true]);

            // Activate plugin instance
            if (isset($this->loadedPlugins[$plugin->name])) {
                $this->loadedPlugins[$plugin->name]->activate();
            }
        } else {
            // Enable for specific journal
            $plugin->journals()->syncWithoutDetaching([
                $journalId => ['enabled' => true],
            ]);
        }

        return true;
    }

    /**
     * Disable a plugin.
     */
    public function disable(Plugin $plugin, ?int $journalId = null): bool
    {
        if ($journalId === null || $plugin->is_global) {
            // Disable globally
            $plugin->update(['enabled' => false]);

            // Deactivate plugin instance
            if (isset($this->loadedPlugins[$plugin->name])) {
                $this->loadedPlugins[$plugin->name]->deactivate();
            }
        } else {
            // Disable for specific journal
            $plugin->journals()->updateExistingPivot($journalId, ['enabled' => false]);
        }

        return true;
    }

    /**
     * Load and register all active plugins.
     */
    public function loadActivePlugins(?int $journalId = null): void
    {
        $query = Plugin::query();

        if ($journalId) {
            // Get globally enabled or journal-specific plugins
            $query->where(function ($q) use ($journalId) {
                $q->where('enabled', true)
                    ->where('is_global', true)
                    ->orWhereHas('journals', function ($jq) use ($journalId) {
                        $jq->where('journal_id', $journalId)
                            ->where('journal_plugins.enabled', true);
                    });
            });
        } else {
            $query->where('enabled', true);
        }

        $plugins = $query->get();

        foreach ($plugins as $plugin) {
            $this->loadPlugin($plugin);
        }

        // Boot all loaded plugins
        foreach ($this->loadedPlugins as $instance) {
            $instance->boot();
        }
    }

    /**
     * Load a single plugin.
     */
    protected function loadPlugin(Plugin $plugin): void
    {
        if (isset($this->loadedPlugins[$plugin->name])) {
            return;
        }

        try {
            $instance = $this->instantiatePlugin($plugin);
            if ($instance) {
                $instance->register();
                $this->loadedPlugins[$plugin->name] = $instance;
            }
        } catch (\Exception $e) {
            Log::error("Failed to load plugin {$plugin->name}: ".$e->getMessage());
        }
    }

    /**
     * Instantiate a plugin class.
     */
    protected function instantiatePlugin(Plugin $plugin): ?PluginInterface
    {
        $pluginJson = $this->getPluginJson($plugin->path);
        if (! $pluginJson) {
            return null;
        }

        // Find the main plugin class
        $finder = new Finder;
        $finder->files()->in($plugin->path)->name('*Plugin.php')->depth(0);

        foreach ($finder as $file) {
            $className = $this->getClassFromFile($file->getRealPath());
            if ($className && class_exists($className)) {
                $instance = new $className;
                if ($instance instanceof PluginInterface) {
                    return $instance;
                }
            }
        }

        return null;
    }

    /**
     * Get plugin JSON configuration.
     */
    protected function getPluginJson(string $path): ?array
    {
        $jsonPath = $path.'/plugin.json';
        if (! file_exists($jsonPath)) {
            return null;
        }

        $content = file_get_contents($jsonPath);

        return json_decode($content, true);
    }

    /**
     * Extract a zip file.
     */
    protected function extractZip(string $zipPath): string
    {
        $extractPath = sys_get_temp_dir().'/plugin_'.uniqid();
        $zip = new \ZipArchive;

        if ($zip->open($zipPath) !== true) {
            throw new RuntimeException('Failed to open zip file');
        }

        $zip->extractTo($extractPath);
        $zip->close();

        return $extractPath;
    }

    /**
     * Copy plugin to plugins directory.
     */
    protected function copyToPluginsDirectory(string $source, string $name): string
    {
        $destination = $this->pluginsPath.'/'.$name;

        if (! is_dir($this->pluginsPath)) {
            mkdir($this->pluginsPath, 0755, true);
        }

        if (is_dir($destination)) {
            $this->removeDirectory($destination);
        }

        $this->copyDirectory($source, $destination);

        return $destination;
    }

    /**
     * Copy directory recursively.
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
            // Get relative path properly for both Windows and Unix
            $relativePath = substr($item->getPathname(), strlen($source));
            $relativePath = ltrim($relativePath, '/\\'); // Remove leading slashes
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

    /**
     * Remove directory recursively.
     */
    protected function removeDirectory(string $path): void
    {
        if (! is_dir($path)) {
            return;
        }

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($files as $file) {
            if ($file->isDir()) {
                rmdir($file->getRealPath());
            } else {
                unlink($file->getRealPath());
            }
        }

        rmdir($path);
    }

    /**
     * Get class name from file.
     */
    protected function getClassFromFile(string $filePath): ?string
    {
        $contents = file_get_contents($filePath);

        // Extract namespace
        $namespace = '';
        if (preg_match('/namespace\s+([^;]+);/', $contents, $matches)) {
            $namespace = $matches[1];
        }

        // Extract class name
        $class = '';
        if (preg_match('/class\s+(\w+)/', $contents, $matches)) {
            $class = $matches[1];
        }

        return $namespace ? $namespace.'\\'.$class : $class;
    }

    /**
     * Get all installed plugins.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, Plugin>
     */
    public function getAllPlugins()
    {
        return Plugin::all();
    }

    /**
     * Get active plugins for a journal.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, Plugin>
     */
    public function getActivePlugins(?int $journalId = null)
    {
        $query = Plugin::query();

        if ($journalId) {
            $query->where(function ($q) use ($journalId) {
                $q->where('enabled', true)
                    ->where('is_global', true)
                    ->orWhereHas('journals', function ($jq) use ($journalId) {
                        $jq->where('journal_id', $journalId)
                            ->where('journal_plugins.enabled', true);
                    });
            });
        } else {
            $query->where('enabled', true);
        }

        return $query->get();
    }

    /**
     * Update plugin settings.
     */
    public function updateSettings(Plugin $plugin, array $settings, ?int $journalId = null): bool
    {
        if ($journalId === null || $plugin->is_global) {
            $plugin->update(['settings' => $settings]);
        } else {
            $plugin->journals()->updateExistingPivot($journalId, ['settings' => $settings]);
        }

        return true;
    }
}
