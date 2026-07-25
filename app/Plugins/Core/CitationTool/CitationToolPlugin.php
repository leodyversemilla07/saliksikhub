<?php

namespace App\Plugins\Core\CitationTool;

use App\Core\Plugin\Contracts\PluginInterface;
use App\Core\Plugin\Hook;
use Illuminate\Http\Request;

class CitationToolPlugin implements PluginInterface
{
    /**
     * Plugin settings.
     */
    protected array $settings = [];

    /**
     * Citation format definitions with their display labels.
     */
    protected array $formats = [
        'apa' => 'APA 7th Edition',
        'mla' => 'MLA 9th Edition',
        'chicago' => 'Chicago 17th Edition',
        'harvard' => 'Harvard',
        'vancouver' => 'Vancouver',
    ];

    /**
     * Register hooks and filters.
     */
    public function register(): void
    {
        // Inject citation tool data into the manuscript public page
        Hook::addFilter('inertia.shared_data', [$this, 'injectCitationData'], 10, 3);

        // Register custom CMS section types for journal landing pages
        Hook::addFilter('cms.section_types', [$this, 'registerSectionTypes'], 10, 1);
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
            'defaultFormat' => 'apa',
            'enabled' => true,
            'showCopyButton' => true,
            'availableFormats' => ['apa', 'mla', 'chicago', 'harvard', 'vancouver'],
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
            'name' => 'citation-tool',
            'version' => '1.0.0',
            'author' => 'SaliksikHub Team',
            'description' => 'Generate manuscript citations in APA, MLA, Chicago, Harvard, and Vancouver formats',
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
        return view('citation-tool::settings', [
            'settings' => $this->settings,
        ]);
    }

    /**
     * Inject citation tool data into Inertia shared props.
     *
     * The component registers itself to appear on the manuscript public page
     * by checking if the current route matches the manuscript view.
     */
    public function injectCitationData(array $data, Request $request, mixed $journal): array
    {
        if (! ($this->settings['enabled'] ?? true)) {
            return $data;
        }

        // Only inject on manuscript public view pages
        $route = $request->route();
        if (! $route || $route->getName() !== 'manuscripts.public.show') {
            return $data;
        }

        $manuscript = $route->parameter('manuscript');
        if (! $manuscript) {
            return $data;
        }

        $data['components'][] = [
            'key' => 'citation-tool',
            'slot' => 'content_bottom',
            'component' => 'citation_tool',
            'props' => [
                'title' => $manuscript->title,
                'authors' => explode(', ', $manuscript->authors),
                'journalName' => $manuscript->journal?->name ?? '',
                'volume' => $manuscript->volume,
                'issue' => $manuscript->issue,
                'pages' => $manuscript->page_range,
                'doi' => $manuscript->doi,
                'publicationDate' => $manuscript->publication_date?->format('Y-m-d'),
                'year' => $manuscript->publication_date?->format('Y'),
                'publisher' => $manuscript->journal?->institution?->name ?? '',
                'url' => $request->url(),
                'availableFormats' => $this->settings['availableFormats'] ?? ['apa', 'mla', 'chicago', 'harvard', 'vancouver'],
                'defaultFormat' => $this->settings['defaultFormat'] ?? 'apa',
                'formatLabels' => $this->formats,
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

    /**
     * Register custom CMS section types for the Citation Tool plugin.
     *
     * These section types can be used on journal landing pages and
     * custom CMS pages to display highlighted publications.
     *
     * The frontend renderers are registered in resources/js/components/cms/plugins/index.ts
     */
    public function registerSectionTypes(array $types): array
    {
        $types['featured_publications'] = [
            'name' => 'Featured Publications',
            'description' => 'Display a grid of highlighted published articles',
            'icon' => 'BookOpen',
            'plugin' => 'citation-tool',
        ];

        $types['editor_picks'] = [
            'name' => "Editor's Picks",
            'description' => 'Show editor-recommended articles in a ranked list',
            'icon' => 'Star',
            'plugin' => 'citation-tool',
        ];

        return $types;
    }
}
