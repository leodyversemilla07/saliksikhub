<?php

namespace App\Plugins\Core\AnnouncementBanner;

use App\Core\Plugin\Contracts\PluginInterface;
use App\Core\Plugin\Hook;
use Illuminate\Support\Facades\View;

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
        // Add banner to journal header
        Hook::addAction('journal.header.after', [$this, 'renderBanner'], 10);

        // Add banner to journal homepage
        Hook::addAction('journal.homepage.before', [$this, 'renderBanner'], 10);

        // Filter to check if banner should show
        Hook::addFilter('announcement.should_display', [$this, 'shouldDisplay'], 10);
    }

    /**
     * Initialize the plugin.
     */
    public function boot(): void
    {
        // Share view namespace
        View::addLocation(__DIR__.'/resources/views');
    }

    /**
     * Run activation logic.
     */
    public function activate(): void
    {
        // Set default settings on activation
        $this->settings = [
            'enabled' => true,
            'message' => 'Welcome to our journal!',
            'type' => 'info',
            'position' => 'top',
            'dismissible' => true,
        ];
    }

    /**
     * Run deactivation logic.
     */
    public function deactivate(): void
    {
        // Clean up any temporary data
    }

    /**
     * Run uninstall logic.
     */
    public function uninstall(): void
    {
        // Clean up all plugin data
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
        // Return settings view or component
        return view('announcement-banner::settings', [
            'settings' => $this->settings,
        ]);
    }

    /**
     * Render the announcement banner.
     */
    public function renderBanner(): void
    {
        $shouldDisplay = Hook::applyFilters('announcement.should_display', true);

        if (! $shouldDisplay || ! $this->settings['enabled']) {
            return;
        }

        $bannerHtml = $this->generateBannerHtml();
        echo $bannerHtml;
    }

    /**
     * Check if banner should be displayed.
     */
    public function shouldDisplay(bool $default): bool
    {
        // Check if user has dismissed the banner
        if ($this->settings['dismissible'] && $this->isDismissed()) {
            return false;
        }

        return $default && $this->settings['enabled'];
    }

    /**
     * Generate banner HTML.
     */
    protected function generateBannerHtml(): string
    {
        $type = $this->settings['type'] ?? 'info';
        $message = $this->settings['message'] ?? '';
        $dismissible = $this->settings['dismissible'] ?? true;

        $typeClasses = [
            'info' => 'bg-blue-50 border-blue-400 text-blue-800',
            'success' => 'bg-green-50 border-green-400 text-green-800',
            'warning' => 'bg-yellow-50 border-yellow-400 text-yellow-800',
            'error' => 'bg-red-50 border-red-400 text-red-800',
        ];

        $classes = $typeClasses[$type] ?? $typeClasses['info'];

        $html = '<div id="announcement-banner" class="'.$classes.' border px-4 py-3 rounded relative mb-4" role="alert">';
        $html .= '<div class="flex">';
        $html .= '<div class="flex-1">';
        $html .= '<p class="font-medium">'.htmlspecialchars($message).'</p>';
        $html .= '</div>';

        if ($dismissible) {
            $html .= '<button onclick="dismissAnnouncementBanner()" class="ml-4 text-current hover:opacity-75" aria-label="Dismiss">';
            $html .= '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>';
            $html .= '</button>';
        }

        $html .= '</div>';
        $html .= '</div>';

        // Add JavaScript for dismissal
        if ($dismissible) {
            $html .= '<script>';
            $html .= 'function dismissAnnouncementBanner() {';
            $html .= 'document.getElementById("announcement-banner").style.display = "none";';
            $html .= 'localStorage.setItem("announcement_banner_dismissed", "true");';
            $html .= '}';
            $html .= 'if (localStorage.getItem("announcement_banner_dismissed") === "true") {';
            $html .= 'document.getElementById("announcement-banner").style.display = "none";';
            $html .= '}';
            $html .= '</script>';
        }

        return $html;
    }

    /**
     * Check if banner has been dismissed by user.
     */
    protected function isDismissed(): bool
    {
        // This would typically check session or cookie
        // For now, we rely on JavaScript localStorage
        return false;
    }

    /**
     * Update plugin settings.
     */
    public function updateSettings(array $settings): void
    {
        $this->settings = array_merge($this->settings, $settings);
    }
}
