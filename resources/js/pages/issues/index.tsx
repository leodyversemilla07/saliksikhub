import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    BookOpen,
    Calendar,
    Eye,
    Edit,
    Archive,
    FileText,
    X,
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
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import issuesRoutes from '@/routes/issues';
import type { PageProps } from '@/types';

interface JournalIssue {
    id: number;
    volume_number: number;
    issue_number: number;
    issue_title: string;
    description: string;
    publication_date: string | null;
    status: 'draft' | 'in_review' | 'published' | 'archived';
    cover_image: string | null;
    cover_image_url?: string | null;
    doi: string | null;
    theme: string | null;
    editorial_note: string | null;
    user: {
        id: number;
        name: string;
        email?: string;
    };
    manuscripts_count?: number;
    created_at: string;
    updated_at: string;
}

interface IndexProps extends PageProps {
    issues: {
        data: JournalIssue[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        volume?: string;
    };
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'draft':
            return 'bg-muted text-muted-foreground';
        case 'in_review':
            return 'bg-primary text-primary-foreground';
        case 'published':
            return 'bg-success text-success-foreground';
        case 'archived':
            return 'bg-warning text-warning-foreground';
        default:
            return 'bg-muted text-muted-foreground';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'draft':
            return <Edit className="h-4 w-4" />;
        case 'in_review':
            return <Eye className="h-4 w-4" />;
        case 'published':
            return <BookOpen className="h-4 w-4" />;
        case 'archived':
            return <Archive className="h-4 w-4" />;
        default:
            return <FileText className="h-4 w-4" />;
    }
};

export default function Index({ issues, filters }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(
        filters.status || 'all',
    );
    const [selectedVolume, setSelectedVolume] = useState(
        filters.volume || 'all',
    ); // Remove the useEffect that was causing page reloads
    // All filtering is now handled client-side for better performance

    // Get unique volumes from issues data
    const availableVolumes = useMemo(() => {
        const volumes = issues.data.map((issue) => issue.volume_number);

        return [...new Set(volumes)].sort((a, b) => b - a); // Sort descending
    }, [issues.data]); // Client-side filtering for all filters (search, status, volume)
    const filteredIssues = useMemo(() => {
        let filtered = issues.data;

        // Apply search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (issue) =>
                    issue.issue_title.toLowerCase().includes(searchLower) ||
                    issue.description.toLowerCase().includes(searchLower) ||
                    (issue.doi &&
                        issue.doi.toLowerCase().includes(searchLower)) ||
                    (issue.theme &&
                        issue.theme.toLowerCase().includes(searchLower)) ||
                    issue.volume_number.toString().includes(searchLower) ||
                    issue.issue_number.toString().includes(searchLower),
            );
        }

        // Apply status filter
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(
                (issue) => issue.status === selectedStatus,
            );
        }

        // Apply volume filter
        if (selectedVolume !== 'all') {
            filtered = filtered.filter(
                (issue) => issue.volume_number.toString() === selectedVolume,
            );
        }

        return filtered;
    }, [issues.data, searchTerm, selectedStatus, selectedVolume]);

    // Get active filters count
    const activeFiltersCount = useMemo(() => {
        let count = 0;

        if (searchTerm) {
            count++;
        }

        if (selectedStatus !== 'all') {
            count++;
        }

        if (selectedVolume !== 'all') {
            count++;
        }

        return count;
    }, [searchTerm, selectedStatus, selectedVolume]);

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: dashboard.url(),
        },
        {
            label: 'Journal Issues',
            href: issuesRoutes.index.url(),
        },
    ];
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedVolume('all');
        // No server request needed - all filtering is client-side
    };

    const removeFilter = (filterType: string) => {
        switch (filterType) {
            case 'search':
                setSearchTerm('');
                break;
            case 'status':
                setSelectedStatus('all');
                break;
            case 'volume':
                setSelectedVolume('all');
                break;
        }
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Journal Issues" />

            <div className="w-full">
                {/* Header with Stats and Create Button */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            Journal Issues
                        </h2>
                        <p className="mt-1 text-sm text-foreground">
                            {issues.total} total issues •{' '}
                            {activeFiltersCount > 0 &&
                                `${filteredIssues.length} filtered • `}
                            Manage your research publication volumes
                        </p>
                    </div>
                    <Button render={<Link href="/issues/create" />}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Issue
                    </Button>
                </div>

                {/* Compact Filters */}
                <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row">
                        {/* Left: Search Bar */}
                        <div className="relative w-full max-w-md lg:mr-4">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder="Search by title, description, DOI, or theme..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border bg-background pl-10 focus:border-primary focus:ring-primary"
                            />
                        </div>

                        {/* Right: Filters */}
                        <div className="flex w-full flex-col justify-end gap-4 lg:w-auto lg:flex-row">
                            {/* Status Filter */}
                            <div className="w-full lg:w-48">
                                <Select
                                    value={selectedStatus}
                                    onValueChange={(value) => {
                                        if (value !== null) {
                                            setSelectedStatus(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="border bg-background">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Statuses
                                        </SelectItem>
                                        <SelectItem value="draft">
                                            <div className="flex items-center">
                                                <Edit className="mr-2 h-4 w-4" />
                                                Draft
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="in_review">
                                            <div className="flex items-center">
                                                <Eye className="mr-2 h-4 w-4" />
                                                In Review
                                            </div>
                                        </SelectItem>

                                        <SelectItem value="published">
                                            <div className="flex items-center">
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                Published
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            <div className="flex items-center">
                                                <Archive className="mr-2 h-4 w-4" />
                                                Archived
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Volume Filter */}
                            <div className="w-full lg:w-40">
                                <Select
                                    value={selectedVolume}
                                    onValueChange={(value) => {
                                        if (value !== null) {
                                            setSelectedVolume(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="border bg-background">
                                        <SelectValue placeholder="All Volumes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Volumes
                                        </SelectItem>
                                        {availableVolumes.map((volume) => (
                                            <SelectItem
                                                key={volume}
                                                value={volume.toString()}
                                            >
                                                Volume {volume}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters Button */}
                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="border text-muted-foreground hover:text-foreground"
                                >
                                    <X className="mr-1 h-4 w-4" />
                                    Clear ({activeFiltersCount})
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Active Filters */}
                    {activeFiltersCount > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                            {searchTerm && (
                                <Badge
                                    variant="secondary"
                                    className="bg-primary text-primary-foreground hover:bg-primary/80"
                                >
                                    Search: "{searchTerm}"
                                    <X
                                        className="ml-1 h-3 w-3 cursor-pointer"
                                        onClick={() => removeFilter('search')}
                                    />
                                </Badge>
                            )}
                            {selectedStatus !== 'all' && (
                                <Badge
                                    variant="secondary"
                                    className="bg-success text-success-foreground hover:bg-success/80"
                                >
                                    Status: {selectedStatus.replace('_', ' ')}
                                    <X
                                        className="ml-1 h-3 w-3 cursor-pointer"
                                        onClick={() => removeFilter('status')}
                                    />
                                </Badge>
                            )}
                            {selectedVolume !== 'all' && (
                                <Badge
                                    variant="secondary"
                                    className="bg-accent text-accent-foreground hover:bg-accent/80"
                                >
                                    Volume: {selectedVolume}
                                    <X
                                        className="ml-1 h-3 w-3 cursor-pointer"
                                        onClick={() => removeFilter('volume')}
                                    />
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                    {filteredIssues.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium text-foreground">
                                    {searchTerm
                                        ? 'No matching issues found'
                                        : 'No Journal Issues Found'}
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    {searchTerm
                                        ? `No issues match your search "${searchTerm}". Try adjusting your search terms.`
                                        : 'Get started by creating your first journal issue.'}
                                </p>
                                {!searchTerm && (
                                    <Link href="/issues/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Issue
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        filteredIssues.map((issue) => (
                            <Card
                                key={issue.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        {/* Cover Image */}
                                        {issue.cover_image_url && (
                                            <div className="mr-6 flex-shrink-0">
                                                <img
                                                    src={issue.cover_image_url}
                                                    alt={`Cover for Volume ${issue.volume_number}, Issue ${issue.issue_number}`}
                                                    className="h-24 w-20 rounded-lg border border-border object-cover shadow-sm"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <div className="mb-3 flex items-center space-x-3">
                                                {getStatusIcon(issue.status)}
                                                <Link
                                                    href={`/issues/${issue.id}`}
                                                    className="text-lg font-semibold text-primary hover:text-primary/80"
                                                >
                                                    Vol. {issue.volume_number},
                                                    Issue {issue.issue_number}
                                                    {issue.issue_title &&
                                                        `: ${issue.issue_title}`}
                                                </Link>
                                                <Badge
                                                    variant="secondary"
                                                    className={getStatusColor(
                                                        issue.status,
                                                    )}
                                                >
                                                    {issue.status.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </Badge>
                                                {issue.theme && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-accent text-accent-foreground hover:bg-accent/80"
                                                    >
                                                        {issue.theme}
                                                    </Badge>
                                                )}
                                            </div>

                                            {issue.description && (
                                                <p className="mb-3 line-clamp-2 text-muted-foreground">
                                                    {issue.description}
                                                </p>
                                            )}

                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <span>#{issue.id}</span>
                                                <span>
                                                    Editor: {issue.user.name}
                                                </span>
                                                {issue.manuscripts_count !==
                                                    undefined &&
                                                    issue.manuscripts_count >
                                                        0 && (
                                                        <span className="flex items-center">
                                                            <FileText className="mr-1 h-4 w-4" />
                                                            {
                                                                issue.manuscripts_count
                                                            }{' '}
                                                            manuscript
                                                            {issue.manuscripts_count !==
                                                            1
                                                                ? 's'
                                                                : ''}
                                                        </span>
                                                    )}
                                                {issue.publication_date && (
                                                    <span className="flex items-center">
                                                        <Calendar className="mr-1 h-4 w-4" />
                                                        {new Date(
                                                            issue.publication_date,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {issue.doi && (
                                                    <span className="flex items-center text-primary">
                                                        DOI: {issue.doi}
                                                    </span>
                                                )}
                                                <span>
                                                    Created:{' '}
                                                    {new Date(
                                                        issue.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Link href={`/issues/${issue.id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Link
                                                href={`/issues/${issue.id}/edit`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Edit className="mr-1 h-4 w-4" />
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {issues.last_page > 1 && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex space-x-2">
                            {Array.from(
                                { length: issues.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === issues.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => {
                                        // Simple pagination without filters since all filtering is client-side
                                        router.visit(`/issues?page=${page}`, {
                                            preserveState: true,
                                            preserveScroll: false,
                                            replace: true,
                                            only: ['issues'],
                                        });
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
