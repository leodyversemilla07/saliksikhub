import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, BookOpen, Calendar, Eye, Edit, Archive, FileText, X } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';

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
            return 'bg-gray-500 text-white';
        case 'in_review':
            return 'bg-blue-500 text-white';
        case 'published':
            return 'bg-green-500 text-white';
        case 'archived':
            return 'bg-amber-500 text-white';
        default:
            return 'bg-gray-500 text-white';
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
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedVolume, setSelectedVolume] = useState(filters.volume || 'all');    // Remove the useEffect that was causing page reloads
    // All filtering is now handled client-side for better performance

    // Get unique volumes from issues data
    const availableVolumes = useMemo(() => {
        const volumes = issues.data.map(issue => issue.volume_number);
        return [...new Set(volumes)].sort((a, b) => b - a); // Sort descending
    }, [issues.data]);    // Client-side filtering for all filters (search, status, volume)
    const filteredIssues = useMemo(() => {
        let filtered = issues.data;

        // Apply search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(issue =>
                issue.issue_title.toLowerCase().includes(searchLower) ||
                issue.description.toLowerCase().includes(searchLower) ||
                (issue.doi && issue.doi.toLowerCase().includes(searchLower)) ||
                (issue.theme && issue.theme.toLowerCase().includes(searchLower)) ||
                issue.volume_number.toString().includes(searchLower) ||
                issue.issue_number.toString().includes(searchLower)
            );
        }

        // Apply status filter
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(issue => issue.status === selectedStatus);
        }

        // Apply volume filter
        if (selectedVolume !== 'all') {
            filtered = filtered.filter(issue => issue.volume_number.toString() === selectedVolume);
        }

        return filtered;
    }, [issues.data, searchTerm, selectedStatus, selectedVolume]);

    // Get active filters count
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedStatus !== 'all') count++;
        if (selectedVolume !== 'all') count++;
        return count;
    }, [searchTerm, selectedStatus, selectedVolume]);

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
        },
        {
            label: 'Journal Issues',
            href: route('issues.index'),
        }
    ];    const clearFilters = () => {
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
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Journal Issues" />

            <div className="py-12">
                <div className="w-full">

                    {/* Header with Stats and Create Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Journal Issues
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {issues.total} total issues • {activeFiltersCount > 0 && `${filteredIssues.length} filtered • `}
                                Manage your research publication volumes
                            </p>
                        </div>
                        <Link href="/issues/create">
                            <Button className="bg-gradient-to-br from-[#18652c] to-[#3fb65e] text-white hover:from-[#145024] hover:to-[#35a051] transition-all duration-300 shadow-lg">
                                <Plus className="h-4 w-4 mr-2" />
                                New Issue
                            </Button>
                        </Link>
                    </div>

                    {/* Compact Filters */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by title, description, DOI, or theme..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="w-full lg:w-48">
                                <Select value={selectedStatus} onValueChange={(value) => {
                                    setSelectedStatus(value);
                                }}>
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-600">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="draft">
                                            <div className="flex items-center">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Draft
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="in_review">
                                            <div className="flex items-center">
                                                <Eye className="h-4 w-4 mr-2" />
                                                In Review
                                            </div>
                                        </SelectItem>
                                        
                                        <SelectItem value="published">
                                            <div className="flex items-center">
                                                <BookOpen className="h-4 w-4 mr-2" />
                                                Published
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            <div className="flex items-center">
                                                <Archive className="h-4 w-4 mr-2" />
                                                Archived
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Volume Filter */}
                            <div className="w-full lg:w-40">
                                <Select value={selectedVolume} onValueChange={(value) => {
                                    setSelectedVolume(value);
                                }}>
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-600">
                                        <SelectValue placeholder="All Volumes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Volumes</SelectItem>
                                        {availableVolumes.map((volume) => (
                                            <SelectItem key={volume} value={volume.toString()}>
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
                                    className="text-gray-600 hover:text-gray-800 border-gray-300"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Clear ({activeFiltersCount})
                                </Button>
                            )}
                        </div>

                        {/* Active Filters */}
                        {activeFiltersCount > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                {searchTerm && (
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                        Search: "{searchTerm}"
                                        <X
                                            className="h-3 w-3 ml-1 cursor-pointer"
                                            onClick={() => removeFilter('search')}
                                        />
                                    </Badge>
                                )}
                                {selectedStatus !== 'all' && (
                                    <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                                        Status: {selectedStatus.replace('_', ' ')}
                                        <X
                                            className="h-3 w-3 ml-1 cursor-pointer"
                                            onClick={() => removeFilter('status')}
                                        />
                                    </Badge>
                                )}
                                {selectedVolume !== 'all' && (
                                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                                        Volume: {selectedVolume}
                                        <X
                                            className="h-3 w-3 ml-1 cursor-pointer"
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
                                <CardContent className="text-center py-12">
                                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {searchTerm ? 'No matching issues found' : 'No Journal Issues Found'}
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm
                                            ? `No issues match your search "${searchTerm}". Try adjusting your search terms.`
                                            : 'Get started by creating your first journal issue.'
                                        }
                                    </p>
                                    {!searchTerm && (
                                        <Link href="/issues/create">
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create Issue
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            filteredIssues.map((issue) => (
                                <Card key={issue.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            {/* Cover Image */}
                                            {issue.cover_image_url && (
                                                <div className="mr-6 flex-shrink-0">
                                                    <img
                                                        src={issue.cover_image_url}
                                                        alt={`Cover for Volume ${issue.volume_number}, Issue ${issue.issue_number}`}
                                                        className="w-20 h-24 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    {getStatusIcon(issue.status)}
                                                    <Link
                                                        href={`/issues/${issue.id}`}
                                                        className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                                                    >
                                                        Vol. {issue.volume_number}, Issue {issue.issue_number}
                                                        {issue.issue_title && `: ${issue.issue_title}`}
                                                    </Link>
                                                    <Badge className={getStatusColor(issue.status)}>
                                                        {issue.status.replace('_', ' ')}
                                                    </Badge>
                                                    {issue.theme && (
                                                        <Badge variant="outline">
                                                            {issue.theme}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {issue.description && (
                                                    <p className="text-gray-600 mb-3 line-clamp-2">
                                                        {issue.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>#{issue.id}</span>
                                                    <span>Editor: {issue.user.name}</span>
                                                    {issue.manuscripts_count !== undefined && issue.manuscripts_count > 0 && (
                                                        <span className="flex items-center">
                                                            <FileText className="w-4 h-4 mr-1" />
                                                            {issue.manuscripts_count} manuscript{issue.manuscripts_count !== 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                    {issue.publication_date && (
                                                        <span className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {new Date(issue.publication_date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {issue.doi && (
                                                        <span className="flex items-center text-blue-600">
                                                            DOI: {issue.doi}
                                                        </span>
                                                    )}
                                                    <span>Created: {new Date(issue.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Link href={`/issues/${issue.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link href={`/issues/${issue.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4 mr-1" />
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
                                {Array.from({ length: issues.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === issues.current_page ? 'default' : 'outline'}
                                        size="sm"                                        onClick={() => {
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
            </div>
        </AuthenticatedLayout>
    );
}
