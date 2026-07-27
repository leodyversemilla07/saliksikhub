<?php

namespace App\Http\Middleware;

use App\Core\Plugin\Hook;
use App\Models\Journal;
use App\Models\PlatformSetting;
use App\Services\SidebarWidgetService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
            'seo' => $this->getSEOData($journal),
        ];
    }

    /**
     * Build default SEO metadata for the frontend.
     *
     * @return array{meta: array<string, string|null>, jsonld: list<array<string, mixed>>}
     */
    protected function getSEOData(?Journal $journal): array
    {
        $appName = config('app.name');
        $description = $journal?->description ?? $appName.' — An open access academic journal platform.';
        $image = $journal?->logo_path ? asset('storage/'.$journal->logo_path) : null;
        $currentUrl = url()->current();

        return [
            'meta' => [
                'title' => $journal?->name ?? $appName,
                'description' => $description,
                'keywords' => $journal?->settings['meta_keywords'] ?? 'academic journal, research, open access, scholarly publishing',
                'og:title' => $journal?->name ?? $appName,
                'og:description' => Str::limit(strip_tags($description), 300),
                'og:url' => $currentUrl,
                'og:type' => 'website',
                'og:site_name' => $journal?->name ?? $appName,
                'og:image' => $image,
                'og:locale' => str_replace('_', '-', app()->getLocale()),
                'twitter:card' => 'summary_large_image',
                'twitter:title' => $journal?->name ?? $appName,
                'twitter:description' => Str::limit(strip_tags($description), 200),
                'twitter:image' => $image,
            ],
            'jsonld' => [
                $this->getOrganizationSchema($journal, $appName, $description, $image),
                $this->getWebsiteSchema($appName),
            ],
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

    /**
     * Generate Organization JSON-LD schema.
     *
     * @return array<string, mixed>
     */
    protected function getOrganizationSchema(?Journal $journal, string $appName, string $description, ?string $image): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            '@id' => url('/').'/#organization',
            'name' => $journal?->name ?? $appName,
            'description' => $description,
            'url' => url('/'),
            'logo' => $image,
            ...($journal?->issn ? ['identifier' => 'ISSN:'.$journal->issn] : []),
        ];
    }

    /**
     * Generate WebSite JSON-LD schema.
     *
     * @return array<string, mixed>
     */
    protected function getWebsiteSchema(string $appName): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            '@id' => url('/').'/#website',
            'url' => url('/'),
            'name' => $appName,
            'publisher' => ['@id' => url('/').'/#organization'],
        ];
    }
}
