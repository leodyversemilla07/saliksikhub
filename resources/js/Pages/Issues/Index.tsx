import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Filter, BookOpen, Calendar, Eye, Edit, Archive, FileText } from 'lucide-react';
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
    const [selectedVolume, setSelectedVolume] = useState(filters.volume || 'all');

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
        },
        {
            label: 'Journal Issues',
            href: route('issues.index'),
        }
    ];

    const handleFilter = () => {
        router.get('/issues', {
            search: searchTerm,
            status: selectedStatus === 'all' ? '' : selectedStatus,
            volume: selectedVolume === 'all' ? '' : selectedVolume,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedVolume('all');
        router.get('/issues', {}, {
            preserveState: true,
            replace: true,
        });
    };    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Journal Issues" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header with Create Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Journal Issues
                        </h2>
                        <Link href="/issues/create">
                            <Button className="bg-gradient-to-br from-[#18652c] to-[#3fb65e] text-white hover:from-[#145024] hover:to-[#35a051] transition-all duration-300">
                                <Plus className="h-5 w-5 mr-1" />
                                Create Issue
                            </Button>
                        </Link>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Filter className="h-5 w-5 mr-2" />
                                Filters
                            </CardTitle>
                        </CardHeader>                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search journal issues..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="in_review">In Review</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={selectedVolume} onValueChange={setSelectedVolume}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Volume" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Volumes</SelectItem>
                                        {/* Dynamic volume options would be populated from backend */}
                                        <SelectItem value="1">Volume 1</SelectItem>
                                        <SelectItem value="2">Volume 2</SelectItem>
                                        <SelectItem value="3">Volume 3</SelectItem>
                                        <SelectItem value="4">Volume 4</SelectItem>
                                        <SelectItem value="5">Volume 5</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="flex space-x-2">
                                    <Button onClick={handleFilter} className="flex-1">
                                        Apply
                                    </Button>
                                    <Button variant="outline" onClick={clearFilters} className="flex-1">
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Issues List */}
                    <div className="space-y-4">                        {issues.data.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Journal Issues Found</h3>
                                    <p className="text-gray-500 mb-4">
                                        Get started by creating your first journal issue.
                                    </p>
                                    <Link href="/issues/create">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Issue
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>                        ) : (                            issues.data.map((issue) => (
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
                    </div>                    {/* Pagination */}
                    {issues.last_page > 1 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-2">
                                {Array.from({ length: issues.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === issues.current_page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => router.get(`/issues?page=${page}`)}
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
