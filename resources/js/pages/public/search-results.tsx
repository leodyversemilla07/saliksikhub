import { Link, router, usePage } from '@inertiajs/react';
import {
    Search,
    FileText,
    Users,
    Calendar,
    ExternalLink,
    Home,
    ChevronRight,
    X,
    Download,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import type { PageProps } from '@/types';

interface SearchResult {
    id: number;
    title: string;
    slug: string;
    authors: string[];
    abstract: string;
    keywords: string[];
    publication_date: string | null;
    doi: string | null;
    volume: number | null;
    issue: number | null;
    category: string | null;
    pdf_url: string | null;
}

interface FacetItem {
    value: string | number;
    count: number;
}

interface Facets {
    years: FacetItem[];
    volumes: FacetItem[];
    categories: FacetItem[];
    keywords: FacetItem[];
    authors: FacetItem[];
}

interface SearchResultsProps extends PageProps {
    results: {
        data: SearchResult[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    query: string;
    filters: {
        year_from: string | null;
        year_to: string | null;
        author: string | null;
        keyword: string | null;
        volume: string | null;
        category: string | null;
        sort: string;
        order: string;
    };
    facets: Facets;
}

export default function SearchResults({
    results,
    query,
    filters: initialFilters,
    facets,
}: SearchResultsProps) {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';
    const [searchInput, setSearchInput] = useState(query);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (initialFilters.year_from) count++;
        if (initialFilters.year_to) count++;
        if (initialFilters.author) count++;
        if (initialFilters.keyword) count++;
        if (initialFilters.volume) count++;
        if (initialFilters.category) count++;
        return count;
    }, [initialFilters]);

    /**
     * Navigate to search with updated query params.
     */
    function updateFilters(overrides: Record<string, string | null>) {
        const params: Record<string, string> = {};

        if (query) params.q = query;
        if (initialFilters.sort && initialFilters.sort !== 'date')
            params.sort = initialFilters.sort;
        if (initialFilters.order && initialFilters.order !== 'desc')
            params.order = initialFilters.order;

        // Merge overrides
        for (const [key, value] of Object.entries(overrides)) {
            if (value !== null && value !== '') {
                params[key] = value;
            }
        }

        const qs = new URLSearchParams(params).toString();
        router.visit(`/search?${qs}`, {
            preserveState: true,
            preserveScroll: false,
        });
    }

    function clearAllFilters() {
        const params: Record<string, string> = {};
        if (query) params.q = query;
        const qs = new URLSearchParams(params).toString();
        router.visit(`/search?${qs}`, {
            preserveState: true,
            preserveScroll: false,
        });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        updateFilters({ q: searchInput });
    }

    const handleSortChange = (value: string) => {
        if (value === initialFilters.sort) {
            // Toggle order
            updateFilters({
                order: initialFilters.order === 'asc' ? 'desc' : 'asc',
            });
        } else {
            updateFilters({ sort: value, order: 'desc' });
        }
    };

    const exportResults = () => {
        const csvContent = [
            [
                'Title',
                'Authors',
                'Publication Date',
                'Volume',
                'Issue',
                'DOI',
                'Category',
                'Keywords',
            ].join(','),
            ...results.data.map((result) =>
                [
                    `"${result.title.replace(/"/g, '""')}"`,
                    `"${(result.authors || []).join('; ').replace(/"/g, '""')}"`,
                    result.publication_date || '',
                    result.volume ?? '',
                    result.issue ?? '',
                    result.doi || '',
                    result.category || '',
                    `"${(result.keywords || []).join('; ').replace(/"/g, '""')}"`,
                ].join(','),
            ),
        ].join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            `search_results_${query.replace(/\s+/g, '_') || 'all'}.csv`,
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <PublicLayout
            title={`Search: ${query || 'All Manuscripts'} | ${journalName}`}
        >
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link
                        href="/"
                        className="flex items-center gap-1 hover:text-foreground"
                    >
                        <Home className="h-4 w-4" />
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/archives" className="hover:text-foreground">
                        Archives
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground">Search</span>
                </nav>

                {/* Search Bar */}
                <Card className="mb-8">
                    <CardContent className="p-4">
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search articles, authors, keywords..."
                                    className="pl-10"
                                    value={searchInput}
                                    onChange={(e) =>
                                        setSearchInput(e.target.value)
                                    }
                                />
                            </div>
                            <Button type="submit">Search</Button>
                            <Link href="/search">
                                <Button type="button" variant="outline">
                                    Clear
                                </Button>
                            </Link>
                        </form>
                    </CardContent>
                </Card>

                {/* Header + Results count + Sort */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {query
                                ? `Results for "${query}"`
                                : 'All Manuscripts'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {results.total} result
                            {results.total !== 1 ? 's' : ''} found
                            {activeFilterCount > 0 &&
                                ` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} active)`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Select
                                value={initialFilters.sort}
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="title">Title</SelectItem>
                                    <SelectItem value="authors">
                                        Authors
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Badge
                                variant="outline"
                                className="cursor-pointer px-2 py-1 text-xs select-none"
                                onClick={() =>
                                    updateFilters({
                                        order:
                                            initialFilters.order === 'asc'
                                                ? 'desc'
                                                : 'asc',
                                    })
                                }
                            >
                                {initialFilters.order === 'asc' ? '↑' : '↓'}
                            </Badge>
                        </div>
                        {results.data.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportResults}
                            >
                                <Download className="mr-1.5 h-3.5 w-3.5" />
                                Export CSV
                            </Button>
                        )}
                    </div>
                </div>

                {/* Active filter badges */}
                {activeFilterCount > 0 && (
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        {initialFilters.year_from && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                From: {initialFilters.year_from}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() =>
                                        updateFilters({ year_from: null })
                                    }
                                />
                            </Badge>
                        )}
                        {initialFilters.year_to && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                To: {initialFilters.year_to}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() =>
                                        updateFilters({ year_to: null })
                                    }
                                />
                            </Badge>
                        )}
                        {initialFilters.author && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                Author: {initialFilters.author}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() =>
                                        updateFilters({ author: null })
                                    }
                                />
                            </Badge>
                        )}
                        {initialFilters.keyword && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                Keyword: {initialFilters.keyword}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() =>
                                        updateFilters({ keyword: null })
                                    }
                                />
                            </Badge>
                        )}
                        {initialFilters.volume && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                Vol. {initialFilters.volume}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() =>
                                        updateFilters({ volume: null })
                                    }
                                />
                            </Badge>
                        )}
                        {initialFilters.category && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                {initialFilters.category}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() =>
                                        updateFilters({ category: null })
                                    }
                                />
                            </Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground"
                            onClick={clearAllFilters}
                        >
                            Clear all
                        </Button>
                    </div>
                )}

                {/* Main layout: facets sidebar + results */}
                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    {/* Facets Sidebar */}
                    <div className="space-y-6">
                        {/* Years */}
                        {facets.years.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-sm font-semibold text-foreground">
                                    Publication Year
                                </h3>
                                <div className="space-y-0.5">
                                    {facets.years.map((item) => {
                                        const active =
                                            initialFilters.year_from ===
                                                String(item.value) ||
                                            initialFilters.year_to ===
                                                String(item.value);

                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() =>
                                                    updateFilters({
                                                        year_from: String(
                                                            item.value,
                                                        ),
                                                        year_to: String(
                                                            item.value,
                                                        ),
                                                    })
                                                }
                                                className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                                                    active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                }`}
                                            >
                                                <span>{item.value}</span>
                                                <span className="text-xs opacity-60">
                                                    {item.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Volumes */}
                        {facets.volumes.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-sm font-semibold text-foreground">
                                    Volume
                                </h3>
                                <div className="space-y-0.5">
                                    {facets.volumes.map((item) => {
                                        const active =
                                            initialFilters.volume ===
                                            String(item.value);

                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() =>
                                                    updateFilters({
                                                        volume: active
                                                            ? null
                                                            : String(
                                                                  item.value,
                                                              ),
                                                    })
                                                }
                                                className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                                                    active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                }`}
                                            >
                                                <span>Vol. {item.value}</span>
                                                <span className="text-xs opacity-60">
                                                    {item.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Categories */}
                        {facets.categories.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-sm font-semibold text-foreground">
                                    Category
                                </h3>
                                <div className="space-y-0.5">
                                    {facets.categories.map((item) => {
                                        const active =
                                            initialFilters.category ===
                                            item.value;

                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() =>
                                                    updateFilters({
                                                        category: active
                                                            ? null
                                                            : item.value,
                                                    })
                                                }
                                                className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                                                    active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                }`}
                                            >
                                                <span className="truncate">
                                                    {item.value}
                                                </span>
                                                <span className="text-xs opacity-60">
                                                    {item.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Authors */}
                        {facets.authors.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-sm font-semibold text-foreground">
                                    Authors
                                </h3>
                                <div className="space-y-0.5">
                                    {facets.authors.map((item) => {
                                        const active =
                                            initialFilters.author ===
                                            item.value;

                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() =>
                                                    updateFilters({
                                                        author: active
                                                            ? null
                                                            : item.value,
                                                    })
                                                }
                                                className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                                                    active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                }`}
                                            >
                                                <span className="truncate text-xs">
                                                    {item.value}
                                                </span>
                                                <span className="ml-1 text-xs opacity-60">
                                                    {item.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Keywords */}
                        {facets.keywords.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-sm font-semibold text-foreground">
                                    Keywords
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {facets.keywords.map((item) => {
                                        const active =
                                            initialFilters.keyword ===
                                            item.value;

                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() =>
                                                    updateFilters({
                                                        keyword: active
                                                            ? null
                                                            : item.value,
                                                    })
                                                }
                                            >
                                                <Badge
                                                    variant={
                                                        active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className="cursor-pointer text-xs"
                                                >
                                                    {item.value}
                                                    <span className="ml-1 opacity-60">
                                                        ({item.count})
                                                    </span>
                                                </Badge>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results List */}
                    <div>
                        {results.data.length > 0 ? (
                            <div className="space-y-4">
                                {results.data.map((result) => (
                                    <Card
                                        key={result.id}
                                        className="transition-shadow hover:shadow-md"
                                    >
                                        <CardContent className="p-5">
                                            <div className="space-y-3">
                                                {/* Title + Category */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <Link
                                                        href={`/manuscripts/${result.slug}`}
                                                        className="text-lg font-semibold text-primary hover:underline"
                                                    >
                                                        {result.title}
                                                    </Link>
                                                    {result.category && (
                                                        <Badge
                                                            variant="outline"
                                                            className="shrink-0 text-xs"
                                                        >
                                                            {result.category}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Authors */}
                                                {result.authors &&
                                                    result.authors.length >
                                                        0 && (
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Users className="h-3.5 w-3.5 shrink-0" />
                                                            <span>
                                                                {result.authors.join(
                                                                    ', ',
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                {/* Publication info */}
                                                {(result.publication_date ||
                                                    result.volume) && (
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                        {result.publication_date && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {
                                                                    result.publication_date
                                                                }
                                                            </span>
                                                        )}
                                                        {result.volume &&
                                                            result.issue && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    Vol.{' '}
                                                                    {
                                                                        result.volume
                                                                    }{' '}
                                                                    No.{' '}
                                                                    {
                                                                        result.issue
                                                                    }
                                                                </Badge>
                                                            )}
                                                    </div>
                                                )}

                                                {/* Abstract */}
                                                {result.abstract && (
                                                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                                        {result.abstract}
                                                    </p>
                                                )}

                                                {/* Keywords */}
                                                {result.keywords &&
                                                    result.keywords.length >
                                                        0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {result.keywords
                                                                .slice(0, 5)
                                                                .map(
                                                                    (kw, i) => (
                                                                        <button
                                                                            key={
                                                                                i
                                                                            }
                                                                            type="button"
                                                                            onClick={() =>
                                                                                updateFilters(
                                                                                    {
                                                                                        keyword:
                                                                                            kw,
                                                                                    },
                                                                                )
                                                                            }
                                                                        >
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="cursor-pointer text-xs hover:bg-primary/10"
                                                                            >
                                                                                {
                                                                                    kw
                                                                                }
                                                                            </Badge>
                                                                        </button>
                                                                    ),
                                                                )}
                                                            {result.keywords
                                                                .length > 5 && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    +
                                                                    {result
                                                                        .keywords
                                                                        .length -
                                                                        5}{' '}
                                                                    more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}

                                                {/* Actions */}
                                                <div className="flex items-center gap-3 pt-1">
                                                    <Link
                                                        href={`/manuscripts/${result.slug}`}
                                                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        Read Article
                                                    </Link>
                                                    {result.doi && (
                                                        <a
                                                            href={`https://doi.org/${result.doi}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                            DOI
                                                        </a>
                                                    )}
                                                    {result.pdf_url && (
                                                        <a
                                                            href={
                                                                result.pdf_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            PDF
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Pagination */}
                                {results.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex gap-2">
                                            {results.current_page > 1 && (
                                                <Link
                                                    href={`/search?${new URLSearchParams(
                                                        buildPaginatedParams(
                                                            query,
                                                            initialFilters,
                                                            results.current_page -
                                                                1,
                                                        ),
                                                    ).toString()}`}
                                                    className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-accent"
                                                >
                                                    Previous
                                                </Link>
                                            )}

                                            {Array.from(
                                                {
                                                    length: Math.min(
                                                        7,
                                                        results.last_page,
                                                    ),
                                                },
                                                (_, i) => {
                                                    const start = Math.max(
                                                        1,
                                                        results.current_page -
                                                            3,
                                                    );
                                                    const page = start + i;

                                                    if (
                                                        page > results.last_page
                                                    ) {
                                                        return null;
                                                    }

                                                    return (
                                                        <Link
                                                            key={page}
                                                            href={`/search?${new URLSearchParams(
                                                                buildPaginatedParams(
                                                                    query,
                                                                    initialFilters,
                                                                    page,
                                                                ),
                                                            ).toString()}`}
                                                            className={`rounded-md border border-border px-4 py-2 text-sm transition-colors ${
                                                                page ===
                                                                results.current_page
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'hover:bg-accent'
                                                            }`}
                                                        >
                                                            {page}
                                                        </Link>
                                                    );
                                                },
                                            )}

                                            {results.current_page <
                                                results.last_page && (
                                                <Link
                                                    href={`/search?${new URLSearchParams(
                                                        buildPaginatedParams(
                                                            query,
                                                            initialFilters,
                                                            results.current_page +
                                                                1,
                                                        ),
                                                    ).toString()}`}
                                                    className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-accent"
                                                >
                                                    Next
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-medium">
                                        No results found
                                    </h3>
                                    <p className="mb-6 text-muted-foreground">
                                        {query
                                            ? `We couldn't find any manuscripts matching "${query}".`
                                            : 'No manuscripts match the current filters.'}
                                    </p>
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Try different keywords or adjust
                                            your filters.
                                        </p>
                                        <Link
                                            href="/search"
                                            className="inline-flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <Search className="h-4 w-4" />
                                            Browse all manuscripts
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

/**
 * Build query params for paginated search links, preserving current filters.
 */
function buildPaginatedParams(
    query: string,
    filters: SearchResultsProps['filters'],
    page: number,
): Record<string, string> {
    const params: Record<string, string> = {};

    if (query) params.q = query;
    if (page > 1) params.page = String(page);
    if (filters.sort && filters.sort !== 'date') params.sort = filters.sort;
    if (filters.order && filters.order !== 'desc') params.order = filters.order;
    if (filters.year_from) params.year_from = filters.year_from;
    if (filters.year_to) params.year_to = filters.year_to;
    if (filters.author) params.author = filters.author;
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.volume) params.volume = filters.volume;
    if (filters.category) params.category = filters.category;

    return params;
}
