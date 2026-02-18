import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Search, FileText, Users, Calendar, ExternalLink, Home, ChevronRight, SortAsc, SortDesc, Download, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PublicLayout from '@/layouts/public-layout';

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
}

export default function SearchResults({ results, query }: SearchResultsProps) {
    const [sortBy, setSortBy] = useState('relevance');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showFilters, setShowFilters] = useState(false);
    const [dateFilter, setDateFilter] = useState('all');
    const [volumeFilter, setVolumeFilter] = useState('all');

    // Get unique volumes for filtering
    const availableVolumes = [...new Set(results.data.map(r => r.volume).filter(v => v !== null))].sort((a, b) => b - a);

    // Filter and sort results
    const filteredAndSortedResults = React.useMemo(() => {
        let filtered = [...results.data];

        // Apply date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();
            switch (dateFilter) {
                case 'last_year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
                case 'last_2_years':
                    filterDate.setFullYear(now.getFullYear() - 2);
                    break;
                case 'last_5_years':
                    filterDate.setFullYear(now.getFullYear() - 5);
                    break;
            }
            filtered = filtered.filter(result =>
                result.publication_date && new Date(result.publication_date) >= filterDate
            );
        }

        // Apply volume filter
        if (volumeFilter !== 'all') {
            filtered = filtered.filter(result => result.volume === parseInt(volumeFilter));
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'date':
                    if (a.publication_date && b.publication_date) {
                        comparison = new Date(a.publication_date).getTime() - new Date(b.publication_date).getTime();
                    }
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'authors':
                    comparison = a.authors.join(', ').localeCompare(b.authors.join(', '));
                    break;
                case 'relevance':
                default:
                    // Keep original order for relevance (assuming backend sorts by relevance)
                    return 0;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [results.data, sortBy, sortOrder, dateFilter, volumeFilter]);

    const handleSortChange = (newSortBy: string) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
    };

    const exportResults = () => {
        const csvContent = [
            ['Title', 'Authors', 'Publication Date', 'Volume', 'Issue', 'DOI', 'Keywords'].join(','),
            ...filteredAndSortedResults.map(result => [
                `"${result.title.replace(/"/g, '""')}"`,
                `"${result.authors.join('; ').replace(/"/g, '""')}"`,
                result.publication_date || '',
                result.volume || '',
                result.issue || '',
                result.doi || '',
                `"${result.keywords.join('; ').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `search_results_${query.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <PublicLayout title={`Search: ${query}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-foreground flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/archives" className="hover:text-foreground">
                            Archives
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground">Search Results</span>
                    </nav>

                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Search className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                Search Results
                            </h1>
                        </div>
                        <p className="text-lg text-muted-foreground">
                            Found {filteredAndSortedResults.length} result{filteredAndSortedResults.length !== 1 ? 's' : ''} for "{query}"
                        </p>
                        <div className="mt-4 flex items-center gap-4">
                            <Link href="/archives" className="text-primary hover:underline">
                                ← Back to Archives
                            </Link>
                            {filteredAndSortedResults.length > 0 && (
                                <Button variant="outline" size="sm" onClick={exportResults}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Results
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filters and Sorting */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevance">Relevance</SelectItem>
                                        <SelectItem value="date">Date</SelectItem>
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="authors">Authors</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSortChange(sortBy)}
                                >
                                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                </Button>
                            </div>
                            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-4 p-4 border rounded-lg bg-card">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date-filter">Publication Date</Label>
                                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Dates</SelectItem>
                                                    <SelectItem value="last_year">Last Year</SelectItem>
                                                    <SelectItem value="last_2_years">Last 2 Years</SelectItem>
                                                    <SelectItem value="last_5_years">Last 5 Years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="volume-filter">Volume</Label>
                                            <Select value={volumeFilter} onValueChange={setVolumeFilter}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Volumes</SelectItem>
                                                    {availableVolumes.map(volume => (
                                                        <SelectItem key={volume} value={volume.toString()}>
                                                            Volume {volume}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {(dateFilter !== 'all' || volumeFilter !== 'all') && (
                                        <div className="mt-4 flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setDateFilter('all');
                                                    setVolumeFilter('all');
                                                }}
                                            >
                                                Clear Filters
                                            </Button>
                                        </div>
                                    )}
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </div>

                    {/* Results */}
                    {filteredAndSortedResults.length > 0 ? (
                        <div className="space-y-6">
                            {filteredAndSortedResults.map((result) => (
                                <Card key={result.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Title */}
                                            <div>
                                                <Link
                                                    href={`/manuscripts/${result.slug}`}
                                                    className="text-xl font-semibold text-primary hover:underline block"
                                                >
                                                    {result.title}
                                                </Link>
                                            </div>

                                            {/* Authors */}
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                <span>{result.authors.join(', ')}</span>
                                            </div>

                                            {/* Publication Info */}
                                            {result.publication_date && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{result.publication_date}</span>
                                                    {result.volume && result.issue && (
                                                        <Badge variant="outline" className="ml-2">
                                                            Vol. {result.volume} No. {result.issue}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* Abstract */}
                                            <p className="text-muted-foreground line-clamp-3">
                                                {result.abstract}
                                            </p>

                                            {/* Keywords */}
                                            {result.keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {result.keywords.slice(0, 5).map((keyword, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {keyword}
                                                        </Badge>
                                                    ))}
                                                    {result.keywords.length > 5 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{result.keywords.length - 5} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 pt-2">
                                                <Link
                                                    href={`/manuscripts/${result.slug}`}
                                                    className="inline-flex items-center gap-2 text-primary hover:underline"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Read Article
                                                </Link>
                                                {result.doi && (
                                                    <a
                                                        href={`https://doi.org/${result.doi}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-primary hover:underline"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                        DOI: {result.doi}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Pagination */}
                            {results.last_page > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex gap-2">
                                        {results.current_page > 1 && (
                                            <Link
                                                href={`/search?q=${encodeURIComponent(query)}&page=${results.current_page - 1}`}
                                                className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
                                            >
                                                Previous
                                            </Link>
                                        )}

                                        {Array.from({ length: Math.min(5, results.last_page) }, (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <Link
                                                    key={page}
                                                    href={`/search?q=${encodeURIComponent(query)}&page=${page}`}
                                                    className={`px-4 py-2 border border-border rounded-md transition-colors ${
                                                        page === results.current_page
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'hover:bg-accent'
                                                    }`}
                                                >
                                                    {page}
                                                </Link>
                                            );
                                        })}

                                        {results.current_page < results.last_page && (
                                            <Link
                                                href={`/search?q=${encodeURIComponent(query)}&page=${results.current_page + 1}`}
                                                className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
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
                            <CardContent className="text-center py-12">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    No results found
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    {results.data.length === 0
                                        ? `We couldn't find any published manuscripts matching "${query}".`
                                        : `No results match your current filters. Try adjusting your filters or search terms.`
                                    }
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Try searching with different keywords or check your spelling.
                                    </p>
                                    <Link href="/archives" className="inline-flex items-center gap-2 text-primary hover:underline">
                                        <Search className="h-4 w-4" />
                                        Search again
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
        </PublicLayout>
    );
}