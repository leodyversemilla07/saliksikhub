<?php

namespace App\Services;

use App\Models\Issue;
use App\Models\Manuscript;
use Illuminate\Support\Str;

/**
 * Generate structured data (JSON-LD) for SEO across the application.
 */
class SEOService
{
    /**
     * Get the base URL for the current request.
     */
    protected function baseUrl(): string
    {
        return config('app.url', 'https://saliksikhub.com');
    }

    /**
     * Generate Organization schema for the journal or platform.
     *
     * @return array<string, mixed>
     */
    public function organizationSchema(?string $name = null, ?string $description = null, ?string $logo = null): array
    {
        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            '@id' => $this->baseUrl().'/#organization',
            'name' => $name ?? $journal?->name ?? config('app.name'),
            'description' => $description ?? $journal?->description ?? '',
            'url' => $this->baseUrl(),
            'logo' => $logo ?? ($journal?->logo_path ? asset('storage/'.$journal->logo_path) : null),
            ...($journal?->issn ? ['identifier' => 'ISSN:'.$journal->issn] : []),
        ];
    }

    /**
     * Generate WebSite schema.
     *
     * @return array<string, mixed>
     */
    public function websiteSchema(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            '@id' => $this->baseUrl().'/#website',
            'url' => $this->baseUrl(),
            'name' => config('app.name'),
            'publisher' => ['@id' => $this->baseUrl().'/#organization'],
        ];
    }

    /**
     * Generate Article / ScholarlyArticle schema for a manuscript.
     *
     * @return array<string, mixed>
     */
    public function articleSchema(Manuscript $manuscript): array
    {
        $authors = $this->parseAuthors($manuscript->authors);
        $keywords = $this->parseKeywords($manuscript->keywords);
        $publicationDate = $manuscript->published_at ?? $manuscript->publication_date;

        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'ScholarlyArticle',
            '@id' => route('manuscripts.public.show', $manuscript->slug).'#article',
            'headline' => $manuscript->title,
            'name' => $manuscript->title,
            'description' => $manuscript->abstract ? Str::limit(strip_tags($manuscript->abstract), 300) : null,
            'abstract' => $manuscript->abstract,
            'author' => $authors,
            'datePublished' => $publicationDate?->toIso8601String(),
            'dateModified' => $manuscript->updated_at?->toIso8601String(),
            'mainEntityOfPage' => route('manuscripts.public.show', $manuscript->slug),
            'publisher' => ['@id' => $this->baseUrl().'/#organization'],
            'image' => null, // Could add feature image if available
            'keywords' => $keywords,
        ];

        if ($manuscript->doi) {
            $schema['sameAs'] = 'https://doi.org/'.$manuscript->doi;
            $schema['identifier'] = $manuscript->doi;
        }

        if ($manuscript->volume && $manuscript->issue) {
            $schema['isPartOf'] = [
                '@type' => 'PublicationIssue',
                'volumeNumber' => (int) $manuscript->volume,
                'issueNumber' => (int) $manuscript->issue,
            ];
        }

        if ($manuscript->page_range) {
            $schema['pagination'] = $manuscript->page_range;
        }

        return $schema;
    }

    /**
     * Generate BreadcrumbList schema.
     *
     * @param  array<int, array{label: string, url?: string}>  $crumbs
     * @return array<string, mixed>
     */
    public function breadcrumbSchema(array $crumbs): array
    {
        $items = [];
        foreach ($crumbs as $index => $crumb) {
            $items[] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $crumb['label'],
                'item' => isset($crumb['url']) ? url($crumb['url']) : null,
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $items,
        ];
    }

    /**
     * Generate Issue schema.
     *
     * @return array<string, mixed>
     */
    public function issueSchema(Issue $issue): array
    {
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'PublicationIssue',
            '@id' => route('issues.public.show', $issue->slug).'#issue',
            'name' => "Volume {$issue->volume_number}, Issue {$issue->issue_number}",
            'volumeNumber' => $issue->volume_number,
            'issueNumber' => $issue->issue_number,
            'datePublished' => $issue->publication_date?->toIso8601String(),
            'isPartOf' => [
                '@type' => 'PublicationVolume',
                'volumeNumber' => $issue->volume_number,
            ],
        ];

        if ($issue->issue_title) {
            $schema['description'] = $issue->issue_title;
        }

        if ($issue->doi) {
            $schema['identifier'] = $issue->doi;
        }

        return $schema;
    }

    /**
     * Get default Open Graph / Twitter meta for the journal.
     *
     * @return array<string, string|null>
     */
    public function defaultOpenGraph(): array
    {
        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;

        return [
            'og:title' => $journal?->name ?? config('app.name'),
            'og:description' => $journal?->description ?? config('app.name').' — An open access academic journal platform.',
            'og:url' => url()->current(),
            'og:type' => 'website',
            'og:site_name' => $journal?->name ?? config('app.name'),
            'og:image' => $journal?->logo_path ? asset('storage/'.$journal->logo_path) : null,
            'twitter:card' => 'summary_large_image',
            'twitter:title' => $journal?->name ?? config('app.name'),
            'twitter:description' => $journal?->description ?? null,
        ];
    }

    /**
     * Parse authors string into schema.org Person array.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function parseAuthors(mixed $authors): array
    {
        if (empty($authors)) {
            return [];
        }

        $names = [];
        if (is_string($authors)) {
            $decoded = json_decode($authors, true);
            $names = (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) ? $decoded : explode(',', $authors);
        } elseif (is_array($authors)) {
            $names = $authors;
        }

        return array_map(fn (string $name) => [
            '@type' => 'Person',
            'name' => trim($name),
        ], array_filter($names));
    }

    /**
     * Parse keywords string into a comma-separated string.
     */
    protected function parseKeywords(mixed $keywords): string
    {
        if (empty($keywords)) {
            return '';
        }

        if (is_string($keywords)) {
            return $keywords;
        }

        if (is_array($keywords)) {
            return implode(', ', $keywords);
        }

        return (string) $keywords;
    }
}
