<?php

namespace App\Plugins\Core\AnnouncementBanner;

use App\Core\Plugin\Contracts\PluginInterface;
use App\Core\Plugin\Hook;
use Illuminate\Http\Request;

class AnnouncementBannerPlugin implements PluginInterface
{
    /**
     * Plugin settings.
     */
    protected array $settings = [];

    /**
     * Register hooks and filters.
     */
    public function register(): void
    {
        // Inject banner data into Inertia shared props so the React
        // AnnouncementBanner component can render it
        Hook::addFilter('inertia.shared_data', [$this, 'injectBannerData'], 10, 3);
    }

    /**
     * Initialize the plugin.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Run activation logic.
     */
    public function activate(): void
    {
        $this->settings = [
            'enabled' => true,
            'message' => 'Welcome to our journal!',
            'type' => 'info',
            'dismissible' => true,
        ];
    }

    /**
     * Run deactivation logic.
     */
    public function deactivate(): void
    {
        //
    }

    /**
     * Run uninstall logic.
     */
    public function uninstall(): void
    {
        //
    }

    /**
     * Get plugin information.
     */
    public function getInfo(): array
    {
        return [
            'name' => 'announcement-banner',
            'version' => '1.0.0',
            'author' => 'SaliksikHub Team',
            'description' => 'Display customizable announcement banners on journal pages',
        ];
    }

    /**
     * Check if plugin has settings.
     */
    public function hasSettings(): bool
    {
        return true;
    }

    /**
     * Render settings page.
     */
    public function renderSettings(): mixed
    {
        return view('announcement-banner::settings', [
            'settings' => $this->settings,
        ]);
    }

    /**
     * Inject banner component data into Inertia shared props.
     *
     * Registered via Hook::addFilter('inertia.shared_data').
     */
    public function injectBannerData(array $data, Request $request, mixed $journal): array
    {
        if (! $this->settings['enabled'] ?? true) {
            return $data;
        }

        $shouldDisplay = Hook::applyFilters('announcement.should_display', true);

        if (! $shouldDisplay) {
            return $data;
        }

        // Add our component definition to the pluginData
        $data['components'][] = [
            'key' => 'announcement-banner-'.md5($this->settings['message'] ?? ''),
            'slot' => 'announcement_banner',
            'component' => 'announcement_banner',
            'props' => [
                'message' => $this->settings['message'] ?? '',
                'type' => $this->settings['type'] ?? 'info',
                'dismissible' => $this->settings['dismissible'] ?? true,
                'storageKey' => 'plugin_announcement_dismissed_'.($journal->id ?? 'global'),
            ],
        ];

        return $data;
    }

    /**
     * Update plugin settings.
     */
    public function updateSettings(array $settings): void
    {
        $this->settings = array_merge($this->settings, $settings);
    }
}
