<?php

namespace App\Http\Controllers\Admin;

use App\Core\Plugin\PluginManager;
use App\Http\Controllers\Controller;
use App\Models\Journal;
use App\Models\Plugin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PluginController extends Controller
{
    /**
     * Plugin manager instance.
     */
    protected PluginManager $pluginManager;

    /**
     * Constructor.
     */
    public function __construct(PluginManager $pluginManager)
    {
        $this->pluginManager = $pluginManager;
    }

    /**
     * Display a listing of plugins.
     */
    public function index(Request $request): Response
    {
        $plugins = Plugin::withCount('journals')->get();

        return Inertia::render('admin/plugins/index', [
            'plugins' => $plugins,
            'totalPlugins' => $plugins->count(),
            'activePlugins' => $plugins->where('enabled', true)->count(),
        ]);
    }

    /**
     * Show plugin details.
     */
    public function show(Plugin $plugin): Response
    {
        $plugin->load(['journals' => function ($query) {
            $query->select('journals.id', 'journals.name');
        }]);

        return Inertia::render('admin/plugins/show', [
            'plugin' => $plugin,
        ]);
    }

    /**
     * Install a new plugin.
     */
    public function install(Request $request): RedirectResponse
    {
        $request->validate([
            'source' => 'required|string',
        ]);

        try {
            $plugin = $this->pluginManager->install($request->input('source'));

            return redirect()
                ->route('admin.plugins.index')
                ->with('success', "Plugin '{$plugin->display_name}' installed successfully.");
        } catch (\Exception $e) {
            Log::error('Plugin installation failed: '.$e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Failed to install plugin: '.$e->getMessage());
        }
    }

    /**
     * Upload and install a plugin.
     */
    public function upload(Request $request): RedirectResponse
    {
        $request->validate([
            'plugin_file' => 'required|file|mimes:zip|max:10240', // Max 10MB
        ]);

        try {
            $file = $request->file('plugin_file');
            $path = $file->store('temp/plugins');
            $fullPath = storage_path('app/'.$path);

            $plugin = $this->pluginManager->install($fullPath);

            // Clean up temp file
            unlink($fullPath);

            return redirect()
                ->route('admin.plugins.index')
                ->with('success', "Plugin '{$plugin->display_name}' uploaded and installed successfully.");
        } catch (\Exception $e) {
            Log::error('Plugin upload failed: '.$e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Failed to upload plugin: '.$e->getMessage());
        }
    }

    /**
     * Enable a plugin globally.
     */
    public function enable(Plugin $plugin): RedirectResponse
    {
        try {
            $this->pluginManager->enable($plugin);

            return redirect()
                ->back()
                ->with('success', "Plugin '{$plugin->display_name}' enabled successfully.");
        } catch (\Exception $e) {
            Log::error('Plugin enable failed: '.$e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Failed to enable plugin: '.$e->getMessage());
        }
    }

    /**
     * Disable a plugin globally.
     */
    public function disable(Plugin $plugin): RedirectResponse
    {
        try {
            $this->pluginManager->disable($plugin);

            return redirect()
                ->back()
                ->with('success', "Plugin '{$plugin->display_name}' disabled successfully.");
        } catch (\Exception $e) {
            Log::error('Plugin disable failed: '.$e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Failed to disable plugin: '.$e->getMessage());
        }
    }

    /**
     * Enable a plugin for a specific journal.
     */
    public function enableForJournal(Request $request, Plugin $plugin): RedirectResponse
    {
        $request->validate([
            'journal_id' => 'required|exists:journals,id',
        ]);

        try {
            $this->pluginManager->enable($plugin, $request->input('journal_id'));

            return redirect()
                ->back()
                ->with('success', 'Plugin enabled for journal successfully.');
        } catch (\Exception $e) {
            Log::error('Plugin enable for journal failed: '.$e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Failed to enable plugin for journal: '.$e->getMessage());
        }
    }

    /**
     * Disable a plugin for a specific journal.
     */
    public function disableForJournal(Request $request, Plugin $plugin): RedirectResponse
    {
        $request->validate([
            'journal_id' => 'required|exists:journals,id',
        ]);

        try {
            $this->pluginManager->disable($plugin, $request->input('journal_id'));

            return redirect()
                ->back()
                ->with('success', 'Plugin disabled for journal successfully.');
        } catch (\Exception $e) {
            Log::error('Plugin disable for journal failed: '.$e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Failed to disable plugin for journal: '.$e->getMessage());
        }
    }

    /**
     * Show plugin settings.
     */
    public function settings(Plugin $plugin): Response
    {
        $plugin->load('journals');

        $plugin->journals->each(function ($journal) {
            if (is_string($journal->pivot?->settings)) {
                $decoded = json_decode($journal->pivot->settings, true);
                $journal->pivot->settings = is_array($decoded) ? $decoded : [];
            }
        });

        return Inertia::render('admin/plugins/settings', [
            'plugin' => $plugin,
            'journals' => Journal::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update plugin settings.
     */
    public function updateSettings(Request $request, Plugin $plugin): RedirectResponse
    {
        $request->validate([
            'settings' => 'required',
            'journal_id' => 'nullable|exists:journals,id',
        ]);

        try {
            // Handle both JSON string and array input
            $settings = $request->input('settings');
            if (is_string($settings)) {
                $settings = json_decode($settings, true);
            }

            $this->pluginManager->updateSettings(
                $plugin,
                $settings,
                $request->input('journal_id')
            );

            return redirect()
                ->back()
                ->with('success', 'Plugin settings updated successfully.');
        } catch (\Exception $e) {
            Log::error('Plugin settings update failed: '.$e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Failed to update plugin settings: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified plugin.
     */
    public function destroy(Plugin $plugin): RedirectResponse
    {
        try {
            $name = $plugin->display_name;
            $this->pluginManager->uninstall($plugin);

            return redirect()
                ->route('admin.plugins.index')
                ->with('success', "Plugin '{$name}' uninstalled successfully.");
        } catch (\Exception $e) {
            Log::error('Plugin uninstall failed: '.$e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Failed to uninstall plugin: '.$e->getMessage());
        }
    }

    /**
     * Get plugin status for a journal (API endpoint).
     */
    public function status(Plugin $plugin, Journal $journal): JsonResponse
    {
        $enabled = $plugin->journals()
            ->where('journal_id', $journal->id)
            ->wherePivot('enabled', true)
            ->exists();

        $settings = $plugin->getSettingsForJournal($journal->id);

        return response()->json([
            'enabled' => $enabled,
            'settings' => $settings,
        ]);
    }

    /**
     * Refresh plugin list and discover new plugins.
     */
    public function refresh(): RedirectResponse
    {
        try {
            // Scan plugins directory for new plugins
            $pluginsPath = storage_path('plugins');
            if (! is_dir($pluginsPath)) {
                return redirect()
                    ->back()
                    ->with('info', 'No plugins directory found.');
            }

            $discovered = 0;
            $iterator = new \DirectoryIterator($pluginsPath);

            foreach ($iterator as $item) {
                if ($item->isDir() && ! $item->isDot()) {
                    $pluginPath = $item->getPathname();

                    // Check if already installed
                    $pluginJsonPath = $pluginPath.'/plugin.json';
                    if (file_exists($pluginJsonPath)) {
                        $pluginData = json_decode(file_get_contents($pluginJsonPath), true);

                        $existing = Plugin::where('name', $pluginData['name'])->first();
                        if (! $existing) {
                            $this->pluginManager->install($pluginPath);
                            $discovered++;
                        }
                    }
                }
            }

            return redirect()
                ->route('admin.plugins.index')
                ->with('success', "Plugin list refreshed. {$discovered} new plugin(s) discovered.");
        } catch (\Exception $e) {
            Log::error('Plugin refresh failed: '.$e->getMessage());

            return redirect()
                ->back()
                ->with('error', 'Failed to refresh plugin list: '.$e->getMessage());
        }
    }
}
