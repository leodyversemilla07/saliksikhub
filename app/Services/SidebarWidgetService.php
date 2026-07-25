<?php

namespace App\Services;

use App\Core\Plugin\Hook;
use App\Enums\ManuscriptStatus;
use App\Models\Manuscript;

class SidebarWidgetService
{
    /**
     * Get all available widget types, including those registered by plugins.
     *
     * @return array<string, array{name: string, description: string, icon?: string}>
     */
    public function getAvailableTypes(): array
    {
        $types = [
            'recent_articles' => [
                'name' => 'Recent Articles',
                'description' => 'Shows the latest published manuscripts',
                'icon' => 'FileText',
            ],
            'keywords' => [
                'name' => 'Keywords / Topics',
                'description' => 'Displays a tag cloud of manuscript keywords',
                'icon' => 'Hash',
            ],
            'journal_info' => [
                'name' => 'About the Journal',
                'description' => 'Shows journal metadata (ISSN, publisher, etc.)',
                'icon' => 'Info',
            ],
        ];

        return Hook::applyFilters('sidebar.widget_types', $types);
    }

    /**
     * Build widget data for the sidebar based on journal settings.
     *
     * Reads the sidebar_widgets configuration from journal settings and
     * populates each widget with its data (recent articles, keywords, etc.).
     *
     * @param  array  $widgetConfigs  The sidebar_widgets array from journal settings
     * @param  int|null  $journalId  Current journal ID for scoping queries
     * @return array Fully populated widgets ready for the frontend
     */
    public function buildWidgets(array $widgetConfigs, ?int $journalId): array
    {
        $widgets = [];

        foreach ($widgetConfigs as $config) {
            if (! ($config['enabled'] ?? true)) {
                continue;
            }

            $widget = [
                'id' => $config['id'] ?? uniqid('widget_'),
                'type' => $config['type'] ?? 'unknown',
                'title' => $config['title'] ?? '',
                'order' => $config['order'] ?? 0,
                'settings' => $config['settings'] ?? [],
            ];

            // Populate widget-specific data, including plugin-registered types
            $widget = $this->populateWidgetData($widget, $journalId);

            $widgets[] = $widget;
        }

        return $widgets;
    }

    /**
     * Populate a single widget with its data.
     * Falls back to a filter for plugin-registered widget types.
     */
    protected function populateWidgetData(array $widget, ?int $journalId): array
    {
        $result = match ($widget['type']) {
            'recent_articles' => $this->populateRecentArticles($widget, $journalId),
            'keywords' => $this->populateKeywords($widget, $journalId),
            'journal_info' => $this->populateJournalInfo($widget),
            default => null,
        };

        // If the built-in handler handled it, return the result
        if ($result !== null) {
            return $result;
        }

        // Otherwise, let plugins handle custom widget types via filter
        return Hook::applyFilters('sidebar.widget_data', $widget, $journalId);
    }

    /**
     * Populate recent articles data.
     */
    protected function populateRecentArticles(array $widget, ?int $journalId): array
    {
        $query = Manuscript::query()
            ->where('status', ManuscriptStatus::PUBLISHED)
            ->whereNotNull('published_at');

        if ($journalId) {
            $query->where('journal_id', $journalId);
        }

        $articles = $query->latest('published_at')
            ->take(5)
            ->get(['id', 'title', 'authors', 'published_at', 'slug']);

        $widget['settings']['articles'] = $articles->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'authors' => $article->authors,
                'published_at' => $article->published_at?->toDateString(),
                'slug' => $article->slug ?? (string) $article->id,
            ];
        })->toArray();

        return $widget;
    }

    /**
     * Populate keywords/topics data.
     */
    protected function populateKeywords(array $widget, ?int $journalId): array
    {
        $query = Manuscript::query()
            ->where('status', ManuscriptStatus::PUBLISHED)
            ->whereNotNull('keywords')
            ->where('keywords', '!=', '');

        if ($journalId) {
            $query->where('journal_id', $journalId);
        }

        $keywords = [];
        $manuscripts = $query->get(['keywords']);

        foreach ($manuscripts as $manuscript) {
            $parts = explode(',', $manuscript->keywords);
            foreach ($parts as $keyword) {
                $keyword = trim($keyword);
                if (! empty($keyword)) {
                    $keywordLower = mb_strtolower($keyword);
                    if (! isset($keywords[$keywordLower])) {
                        $keywords[$keywordLower] = ['name' => $keyword, 'count' => 0];
                    }
                    $keywords[$keywordLower]['count']++;
                }
            }
        }

        usort($keywords, fn ($a, $b) => $b['count'] <=> $a['count']);
        $keywords = array_slice($keywords, 0, 20);

        $widget['settings']['keywords'] = array_values($keywords);

        return $widget;
    }

    /**
     * Populate journal info.
     */
    protected function populateJournalInfo(array $widget): array
    {
        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;

        if ($journal) {
            $widget['settings']['info'] = [
                'name' => $journal->name,
                'description' => $journal->description,
                'issn' => $journal->issn,
                'publisher' => null,
                'frequency' => $journal->settings['publication_frequency'] ?? $journal->publication_frequency ?? null,
            ];
        }

        return $widget;
    }
}
