<?php

namespace App\Services;

use App\Models\Issue;
use App\Models\Manuscript;
use Illuminate\Support\Collection;

class BreadcrumbService
{
    /**
     * Generate breadcrumbs for manuscript pages.
     */
    public static function forManuscript(Manuscript $manuscript): Collection
    {
        $breadcrumbs = collect([
            ['label' => 'Home', 'url' => route('home'), 'active' => false],
        ]);

        // Add issue breadcrumb if manuscript is assigned to an issue
        $issue = $manuscript->issue;
        if ($manuscript->issue_id && $issue instanceof Issue && !empty($issue->slug)) {
            $breadcrumbs->push([
                'label' => "Vol. {$issue->volume_number} No. {$issue->issue_number}",
                'url' => url("/issues/{$issue->slug}"),
                'active' => false,
            ]);
        } else {
            $breadcrumbs->push([
                'label' => 'Articles',
                'url' => route('archives'),
                'active' => false,
            ]);
        }

        $breadcrumbs->push([
            'label' => self::truncateTitle($manuscript->title),
            'url' => route('manuscripts.public.show', $manuscript->slug),
            'active' => true,
        ]);

        return $breadcrumbs;
    }

    /**
     * Generate breadcrumbs for issue pages.
     */
    public static function forIssue(Issue $issue): Collection
    {
        return collect([
            ['label' => 'Home', 'url' => route('home'), 'active' => false],
            ['label' => 'Archives', 'url' => route('archives'), 'active' => false],
            [
                'label' => "Vol. {$issue->volume_number} No. {$issue->issue_number}",
                'url' => url("/issues/{$issue->slug}"),
                'active' => true,
            ],
        ]);
    }

    /**
     * Generate breadcrumbs for search results.
     */
    public static function forSearch(string $query = null): Collection
    {
        $breadcrumbs = collect([
            ['label' => 'Home', 'url' => route('home'), 'active' => false],
        ]);

        if ($query) {
            $breadcrumbs->push([
                'label' => 'Search',
                'url' => route('archives'),
                'active' => false,
            ]);
            $breadcrumbs->push([
                'label' => "Results for: " . self::truncateTitle($query),
                'url' => '#',
                'active' => true,
            ]);
        } else {
            $breadcrumbs->push([
                'label' => 'Search',
                'url' => '#',
                'active' => true,
            ]);
        }

        return $breadcrumbs;
    }

    /**
     * Generate breadcrumbs for archives.
     */
    public static function forArchives(): Collection
    {
        return collect([
            ['label' => 'Home', 'url' => route('home'), 'active' => false],
            ['label' => 'Archives', 'url' => route('archives'), 'active' => true],
        ]);
    }

    /**
     * Generate structured data for breadcrumbs (JSON-LD format for SEO).
     */
    public static function generateStructuredData(Collection $breadcrumbs): array
    {
        $items = [];
        
        foreach ($breadcrumbs as $index => $crumb) {
            $items[] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $crumb['label'],
                'item' => $crumb['url'] !== '#' ? url($crumb['url']) : null,
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $items,
        ];
    }

    /**
     * Truncate title for breadcrumb display.
     */
    private static function truncateTitle(string $title, int $maxLength = 50): string
    {
        if (strlen($title) <= $maxLength) {
            return $title;
        }

        return substr($title, 0, $maxLength) . '...';
    }
}
