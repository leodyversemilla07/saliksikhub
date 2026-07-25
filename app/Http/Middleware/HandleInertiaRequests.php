<?php

namespace App\Http\Middleware;

use App\Core\Plugin\Hook;
use App\Models\Journal;
use App\Models\PlatformSetting;
use App\Services\SidebarWidgetService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;
        $institution = app()->bound('currentInstitution') ? app('currentInstitution') : null;

        try {
            $platformSettings = PlatformSetting::instance();
        } catch (\Exception $e) {
            $platformSettings = null;
        }

        // Build navigation menus
        $headerMenu = [];
        $footerMenu = [];
        if ($journal) {
            $headerMenu = $journal->headerMenu();
            $footerMenu = $journal->footerMenu();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'roles' => $request->user() ? $request->user()->role : null,
            ],
            'platformSettings' => $platformSettings ? [
                'platform_name' => $platformSettings->platform_name,
                'platform_tagline' => $platformSettings->platform_tagline,
                'platform_description' => $platformSettings->platform_description,
                'logo_url' => $platformSettings->logo_url,
                'favicon_url' => $platformSettings->favicon_url,
                'admin_email' => $platformSettings->admin_email,
            ] : null,
            'currentJournal' => $journal ? [
                'id' => $journal->id,
                'name' => $journal->name,
                'slug' => $journal->slug,
                'abbreviation' => $journal->abbreviation,
                'description' => $journal->description,
                'issn' => $journal->issn,
                'eissn' => $journal->eissn,
                'logo_path' => $journal->logo_path,
                'logo_url' => $journal->logo_path ? asset('storage/'.$journal->logo_path) : null,
                'settings' => $journal->settings,
                'theme_settings' => $journal->merged_theme_settings,
            ] : null,
            'currentInstitution' => $institution ? [
                'id' => $institution->id,
                'name' => $institution->name,
                'slug' => $institution->slug,
                'abbreviation' => $institution->abbreviation,
                'logo_path' => $institution->logo_path,
                'logo_url' => $institution->logo_path ? asset('storage/'.$institution->logo_path) : null,
                'website' => $institution->website,
                'contact_email' => $institution->contact_email,
            ] : null,
            'headerMenu' => $headerMenu,
            'footerMenu' => $footerMenu,
            'sidebarWidgets' => $this->getSidebarWidgets($journal),
            'pluginData' => $this->getPluginData($request, $journal),
        ];
    }

    /**
     * Collect data from registered plugins for the frontend.
     * Plugins can hook into 'inertia.shared_data' via Hook::addFilter().
     */
    protected function getPluginData(Request $request, ?Journal $journal): array
    {
        $data = [];

        return Hook::applyFilters('inertia.shared_data', $data, $request, $journal);
    }

    /**
     * Build sidebar widget data from journal settings.
     */
    protected function getSidebarWidgets(?Journal $journal): array
    {
        if (! $journal) {
            return [];
        }

        $widgetConfigs = $journal->settings['sidebar_widgets'] ?? [];

        if (empty($widgetConfigs)) {
            return [];
        }

        $service = app(SidebarWidgetService::class);

        return $service->buildWidgets($widgetConfigs, $journal->id);
    }
}
