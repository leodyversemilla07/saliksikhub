<?php

namespace App\Services;

use App\Enums\ManuscriptStatus;
use App\Models\Manuscript;

class SidebarWidgetService
{
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

            // Populate widget-specific data
            $widget = $this->populateWidgetData($widget, $journalId);

            $widgets[] = $widget;
        }

        return $widgets;
    }

    /**
     * Populate a single widget with its data.
     */
    protected function populateWidgetData(array $widget, ?int $journalId): array
    {
        return match ($widget['type']) {
            'recent_articles' => $this->populateRecentArticles($widget, $journalId),
            'keywords' => $this->populateKeywords($widget, $journalId),
            'journal_info' => $this->populateJournalInfo($widget),
            default => $widget,
        };
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

        // Extract and count keywords from published manuscripts
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

        // Sort by count descending, take top 20
        usort($keywords, fn ($a, $b) => $b['count'] <=> $a['count']);
        $keywords = array_slice($keywords, 0, 20);

        $widget['settings']['keywords'] = array_values($keywords);

        return $widget;
    }

    /**
     * Populate journal info — set from the shared currentJournal props.
     */
    protected function populateJournalInfo(array $widget): array
    {
        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;

        if ($journal) {
            $widget['settings']['info'] = [
                'name' => $journal->name,
                'description' => $journal->description,
                'issn' => $journal->issn,
                'publisher' => null, // Could be populated from institution
                'frequency' => $journal->settings['publication_frequency'] ?? $journal->publication_frequency ?? null,
            ];
        }

        return $widget;
    }
}
