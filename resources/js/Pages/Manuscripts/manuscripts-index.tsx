import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

import {
    AlertTriangle,
    CalendarDays,
    CheckCircle,
    ChevronDown,
    Clock,
    Download,
    Edit,
    Eye,
    FileText,
    Filter,
    Hourglass,
    Info,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    XCircle
} from 'lucide-react';

import AuthenticatedLayout from '@/layouts/authenticated-layout';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { Manuscript, ManuscriptStatus } from '@/types/manuscript';
import { PageProps } from '@/types';

interface IndexProps {
    manuscripts: Manuscript[];
}

const getAuthors = (authors: string | string[] | null): string[] => {
    if (Array.isArray(authors)) return authors;
    if (typeof authors === 'string' && authors.trim()) {
        return authors.split(',').map((author) => author.trim());
    }
    return [];
};

const STATUS_CONFIG = {
    'SUBMITTED': {
        color: 'purple',
        icon: Clock,
        display: 'Submitted',
        badgeClass: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 dark:from-purple-900/80 dark:to-purple-800/80 dark:text-purple-200 border border-purple-300 dark:border-purple-600',
        iconClass: 'text-purple-600 dark:text-purple-300',
        dropdownIconClass: 'text-purple-600 dark:text-purple-300'
    },
    'UNDER_REVIEW': {
        color: 'blue',
        icon: Eye,
        display: 'Under Review',
        badgeClass: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 dark:from-blue-900/80 dark:to-blue-800/80 dark:text-blue-200 border border-blue-300 dark:border-blue-600',
        iconClass: 'text-blue-600 dark:text-blue-300',
        dropdownIconClass: 'text-blue-600 dark:text-blue-300'
    },
    'MINOR_REVISION': {
        color: 'amber',
        icon: RefreshCw,
        display: 'Minor Rev.',
        badgeClass: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 dark:from-amber-900/80 dark:to-amber-800/80 dark:text-amber-200 border border-amber-300 dark:border-amber-600',
        iconClass: 'text-amber-600 dark:text-amber-300',
        dropdownIconClass: 'text-amber-600 dark:text-amber-300'
    },
    'MAJOR_REVISION': {
        color: 'orange',
        icon: AlertTriangle,
        display: 'Major Rev.',
        badgeClass: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 dark:from-orange-900/80 dark:to-orange-800/80 dark:text-orange-200 border border-orange-300 dark:border-orange-600',
        iconClass: 'text-orange-600 dark:text-orange-300',
        dropdownIconClass: 'text-orange-600 dark:text-orange-300'
    },
    'ACCEPTED': {
        color: 'green',
        icon: CheckCircle,
        display: 'Accepted',
        badgeClass: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 dark:from-green-900/80 dark:to-green-800/80 dark:text-green-200 border border-green-300 dark:border-green-600',
        iconClass: 'text-green-600 dark:text-green-300',
        dropdownIconClass: 'text-green-600 dark:text-green-300'
    },
    'IN_COPYEDITING': {
        color: 'indigo',
        icon: Edit,
        display: 'Copyediting',
        badgeClass: 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 dark:from-indigo-900/80 dark:to-indigo-800/80 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-600',
        iconClass: 'text-indigo-600 dark:text-indigo-300',
        dropdownIconClass: 'text-indigo-600 dark:text-indigo-300'
    },
    'AWAITING_AUTHOR_APPROVAL': {
        color: 'cyan',
        icon: Hourglass,
        display: 'Awaiting Approval',
        badgeClass: 'bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 dark:from-cyan-900/80 dark:to-cyan-800/80 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-600',
        iconClass: 'text-cyan-600 dark:text-cyan-300',
        dropdownIconClass: 'text-cyan-600 dark:text-cyan-300'
    },
    'READY_FOR_PUBLICATION': {
        color: 'emerald',
        icon: FileText,
        display: 'Ready to Publish',
        badgeClass: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 dark:from-emerald-900/80 dark:to-emerald-800/80 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600',
        iconClass: 'text-emerald-600 dark:text-emerald-300',
        dropdownIconClass: 'text-emerald-600 dark:text-emerald-300'
    },
    'REJECTED': {
        color: 'red',
        icon: XCircle,
        display: 'Rejected',
        badgeClass: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 dark:from-red-900/80 dark:to-red-800/80 dark:text-red-200 border border-red-300 dark:border-red-600',
        iconClass: 'text-red-600 dark:text-red-300',
        dropdownIconClass: 'text-red-600 dark:text-red-300'
    },
    'PUBLISHED': {
        color: 'blue',
        icon: CalendarDays,
        display: 'Published',
        badgeClass: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 dark:from-blue-900/80 dark:to-blue-800/80 dark:text-blue-200 border border-blue-300 dark:border-blue-600',
        iconClass: 'text-blue-600 dark:text-blue-300',
        dropdownIconClass: 'text-blue-600 dark:text-blue-300'
    }
};

interface StatusBadgeProps {
    status: ManuscriptStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const normalizedStatus = status.toUpperCase() as keyof typeof STATUS_CONFIG;
    const config = STATUS_CONFIG[normalizedStatus] || {
        color: 'gray',
        icon: Info,
        display: status,
        badgeClass: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300 border border-gray-300 dark:border-gray-700',
        iconClass: 'text-gray-600 dark:text-gray-400'
    };

    const Icon = config.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-sm",
            config.badgeClass
        )}>
            <Icon className={cn("h-3.5 w-3.5", config.iconClass)} />
            <span className="tracking-wide">{config.display}</span>
        </div>
    );
};

interface DateDisplayProps {
    date: string;
    showTime?: boolean;
}

const DateDisplay = ({ date, showTime = true }: DateDisplayProps) => (
    <div className="flex flex-col space-y-0.5">
        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })}
        </span>
        {showTime && (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        )}
    </div>
);

interface AuthorBadgesProps {
    authors: string | string[] | null;
}

const formatAuthorsForTooltip = (authorList: string[]): string => authorList.join(', ');

const AuthorBadges: React.FC<AuthorBadgesProps> = ({ authors }) => {
    const authorList = useMemo(() => getAuthors(authors), [authors]);

    if (authorList.length === 0) {
        return <span className="text-gray-400 dark:text-gray-500" aria-label="No authors">No authors</span>;
    }

    const allAuthorsText = formatAuthorsForTooltip(authorList);
    const visibleAuthorCount = 1;

    return (
        <div className="flex flex-wrap gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className="flex flex-wrap gap-1"
                        role="group"
                        aria-label={`Authors: ${allAuthorsText}`}
                    >
                        {authorList.slice(0, visibleAuthorCount).map((author, index) => (
                            <Badge
                                key={`author-${index}-${author.substring(0, 10)}`}
                                variant="outline"
                                className="text-xs"
                            >
                                {author}
                            </Badge>
                        ))}
                        {authorList.length > visibleAuthorCount && (
                            <Badge
                                variant="outline"
                                className="text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                +{authorList.length - visibleAuthorCount}
                            </Badge>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs" aria-hidden="true">
                    <p className="text-sm font-medium">All Authors:</p>
                    <p className="text-xs break-words">{allAuthorsText}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

interface EmptyStateProps {
    searchActive: boolean;
    message: string;
}

const EmptyState = ({ searchActive, message }: EmptyStateProps) => (
    <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4 animate-pulse">
            {searchActive ?
                <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" /> :
                <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            }
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No manuscripts found</h3>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 max-w-md">
            {searchActive ? "Try adjusting your filters or search term" : message}
        </p>
    </div>
);

const ActionButtons = ({ manuscript, userRole, onDelete }: { manuscript: Manuscript, userRole: string, onDelete: () => void }) => {
    const handleViewClick = () => {
        const viewRoute = userRole === 'editor'
            ? route('editor.manuscripts.show', manuscript.id)
            : route('manuscripts.show', manuscript.id);

        router.visit(viewRoute);
    };

    return (
        <div className="flex justify-end gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleViewClick}
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                    >
                        <FileText className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
            </Tooltip>

            {(manuscript.status === ManuscriptStatus.MINOR_REVISION || manuscript.status === ManuscriptStatus.MAJOR_REVISION) && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit(route('manuscripts.revision.form', manuscript.id))}
                            className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30 dark:hover:text-amber-400 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {manuscript.status === ManuscriptStatus.MINOR_REVISION
                            ? "Submit minor revision"
                            : "Submit major revision"}
                    </TooltipContent>
                </Tooltip>
            )}

            {manuscript.status === ManuscriptStatus.AWAITING_AUTHOR_APPROVAL && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit(route('manuscripts.approve', manuscript.id))}
                            className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors"
                        >
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Review and approve final version</TooltipContent>
                </Tooltip>
            )}

            {manuscript.status === ManuscriptStatus.SUBMITTED && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Manuscript</TooltipContent>
                </Tooltip>
            )}
        </div>
    );
};

const CreateNewButton = () => (
    <Link
        href={route('manuscripts.create')}
        className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg py-2 px-4 shadow-md transition-all duration-200"
    >
        <Plus className="h-5 w-5 mr-1" />
        <span>New Manuscript</span>
    </Link>
);

export default function Index({ manuscripts }: IndexProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [sortConfig, setSortConfig] = useState<{ key: keyof Manuscript; direction: 'asc' | 'desc' } | null>({
        key: 'created_at',
        direction: 'desc'
    });
    const [selectedManuscripts, setSelectedManuscripts] = useState<number[]>([]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    const filteredManuscripts = useMemo(() => {
        let filtered = [...manuscripts];

        if (searchQuery.trim()) {
            filtered = filtered.filter((manuscript) =>
                manuscript.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((manuscript) => manuscript.status === statusFilter);
        }

        if (sortConfig) {
            filtered.sort((a, b) => {
                if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
                    const dateA = new Date(a[sortConfig.key]).getTime();
                    const dateB = new Date(b[sortConfig.key]).getTime();
                    return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
                }

                const valueA = a[sortConfig.key];
                const valueB = b[sortConfig.key];

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return sortConfig.direction === 'asc'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                return 0;
            });
        }

        return filtered;
    }, [manuscripts, searchQuery, statusFilter, sortConfig]);

    const handleSort = (key: keyof Manuscript) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const totalPages = Math.ceil(filteredManuscripts.length / pageSize);
    const paginatedManuscripts = filteredManuscripts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleDelete = async (id: number) => {
        try {
            await router.delete(`/author/manuscripts/${id}`, {
                onSuccess: () => {
                    toast.success('Manuscript deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete the manuscript. Please try again.');
                }
            });
        } catch (error) {
            console.error('Error deleting manuscript:', error);
        }
    };

    const toggleSelectAll = () => {
        if (selectedManuscripts.length === paginatedManuscripts.length) {
            setSelectedManuscripts([]);
        } else {
            setSelectedManuscripts(paginatedManuscripts.map(m => m.id));
        }
    };

    const toggleSelectManuscript = (id: number) => {
        setSelectedManuscripts(prev =>
            prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
        );
    };

    const handleBulkAction = (action: string) => {
        if (action === 'export') {
            toast.info('Export Started', {
                description: `Exporting ${selectedManuscripts.length} selected manuscripts to CSV format.`,
                duration: 5000,
                icon: <Download className="h-5 w-5 text-blue-500" />
            });
        } else if (action === 'delete') {
            toast.error('Please confirm deletion', {
                description: `Please confirm deletion of ${selectedManuscripts.length} manuscripts.`,
            });
        }
        setSelectedManuscripts([]);
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        setSelectedManuscripts([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generatePagination = (current: number, total: number) => {
        const maxVisiblePages = 5;
        const delta = Math.floor(maxVisiblePages / 2);
        let range = [];

        if (total <= maxVisiblePages) {
            range = Array.from({ length: total }, (_, i) => i + 1);
            return range;
        }

        range.push(1);

        let rangeStart = Math.max(2, current - delta);
        let rangeEnd = Math.min(total - 1, current + delta);

        if (current - 1 <= delta) {
            rangeEnd = Math.min(total - 1, 1 + maxVisiblePages - 2);
        }

        if (total - current <= delta) {
            rangeStart = Math.max(2, total - (maxVisiblePages - 2));
        }

        if (rangeStart > 2) {
            range.push("ellipsis-start");
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
            range.push(i);
        }

        if (rangeEnd < total - 1) {
            range.push("ellipsis-end");
        }

        if (total > 1) {
            range.push(total);
        }

        return range;
    };

    const searchActive = searchQuery.trim() !== '' || statusFilter !== 'all';

    const breadcrumbItems = [
        {
            label: auth.user.role === 'editor' ? 'Dashboard' : 'Dashboard',
            href: auth.user.role === 'editor' ? route('editor.dashboard') : route('dashboard'),
        },
        {
            label: 'Manuscripts',
            href: auth.user.role === 'editor' ? route('editor.manuscripts.index') : route('manuscripts.index'),
        }
    ];

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Manuscripts" />

            <div className="space-y-6">
                {/* Search and Controls Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/60 dark:border-gray-700/60">
                    <div className="px-6 py-5">
                        <div className="flex flex-col gap-4">
                            {/* Controls Row */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {filteredManuscripts.length} {filteredManuscripts.length === 1 ? 'manuscript' : 'manuscripts'} found
                                    </p>
                                    {selectedManuscripts.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                            <span>•</span>
                                            <span>{selectedManuscripts.length} selected</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={selectedManuscripts.length === 0}
                                        onClick={() => handleBulkAction('export')}
                                        className="border-gray-300 dark:border-gray-600 hover:border-green-400 hover:text-green-600 dark:hover:border-green-500 dark:hover:text-green-400 transition-all"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export ({selectedManuscripts.length})
                                    </Button>
                                    <CreateNewButton />
                                </div>
                            </div>

                            {/* Search and Filter Row */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                    <Input
                                        placeholder="Search by title, author, or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900"
                                    />
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-[200px] justify-between border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                                        >
                                            <div className="flex items-center">
                                                <Filter className="h-4 w-4 mr-2" />
                                                {statusFilter === 'all' ? 'All Status' : STATUS_CONFIG[statusFilter.toUpperCase() as keyof typeof STATUS_CONFIG]?.display || statusFilter}
                                            </div>
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[200px]">
                                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className={statusFilter === 'all' ? "bg-gray-100 dark:bg-gray-800" : ""}
                                            onClick={() => setStatusFilter('all')}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                                                All Manuscripts
                                            </div>
                                        </DropdownMenuItem>
                                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                            <DropdownMenuItem
                                                key={key}
                                                className={statusFilter === key ? "bg-gray-100 dark:bg-gray-800" : ""}
                                                onClick={() => setStatusFilter(key.toLowerCase() as Manuscript['status'] | 'all')}
                                            >
                                                <div className="flex items-center">
                                                    <config.icon className={`h-3.5 w-3.5 mr-3 ${config.dropdownIconClass}`} />
                                                    {config.display}
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
                    {paginatedManuscripts.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200/60 dark:border-gray-700/60">
                                                <TableHead className="w-12 text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                        checked={
                                                            paginatedManuscripts.length > 0 &&
                                                            paginatedManuscripts.every(manuscript => selectedManuscripts.includes(manuscript.id))
                                                        }
                                                        onChange={toggleSelectAll}
                                                    />
                                                </TableHead>
                                                <TableHead
                                                    className="cursor-pointer hover:text-green-600 dark:hover:text-green-400"
                                                    onClick={() => handleSort('id')}
                                                >
                                                    <div className="flex items-center font-semibold">
                                                        ID
                                                        {sortConfig?.key === 'id' && (
                                                            <span className="ml-1 text-green-600">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                        )}
                                                    </div>
                                                </TableHead>
                                                <TableHead
                                                    className="cursor-pointer hover:text-green-600 dark:hover:text-green-400"
                                                    onClick={() => handleSort('title')}
                                                >
                                                    <div className="flex items-center font-semibold">
                                                        Manuscript Details
                                                        {sortConfig?.key === 'title' && (
                                                            <span className="ml-1 text-green-600">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                        )}
                                                    </div>
                                                </TableHead>
                                                <TableHead
                                                    className="cursor-pointer hover:text-green-600 dark:hover:text-green-400"
                                                    onClick={() => handleSort('status')}
                                                >
                                                    <div className="flex items-center font-semibold">
                                                        Status
                                                        {sortConfig?.key === 'status' && (
                                                            <span className="ml-1 text-green-600">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                        )}
                                                    </div>
                                                </TableHead>
                                                <TableHead
                                                    className="cursor-pointer hover:text-green-600 dark:hover:text-green-400"
                                                    onClick={() => handleSort('created_at')}
                                                >
                                                    <div className="flex items-center font-semibold">
                                                        Timeline
                                                        {sortConfig?.key === 'created_at' && (
                                                            <span className="ml-1 text-green-600">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                        )}
                                                    </div>
                                                </TableHead>
                                                <TableHead className="text-right font-semibold">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedManuscripts.map((manuscript) => (
                                                <TableRow
                                                    key={manuscript.id}
                                                    className={cn(
                                                        "group cursor-pointer transition-all hover:bg-gray-50/80 dark:hover:bg-gray-800/50 border-b border-gray-200/40 dark:border-gray-700/40",
                                                        selectedManuscripts.includes(manuscript.id) && "bg-green-50/60 dark:bg-green-900/20"
                                                    )}
                                                    onClick={() => {
                                                        const viewRoute = auth.user.role === 'editor'
                                                            ? route('editor.manuscripts.show', manuscript.id)
                                                            : route('manuscripts.show', manuscript.id);
                                                        router.visit(viewRoute);
                                                    }}
                                                >
                                                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                            checked={selectedManuscripts.includes(manuscript.id)}
                                                            onChange={() => toggleSelectManuscript(manuscript.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                                        #{manuscript.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="max-w-md">
                                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                                                                {manuscript.title}
                                                            </h3>
                                                            <div className="mt-1">
                                                                <AuthorBadges authors={manuscript.authors} />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={manuscript.status} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Submitted
                                                            </div>
                                                            <DateDisplay date={manuscript.created_at} showTime={false} />
                                                            {manuscript.updated_at !== manuscript.created_at && (
                                                                <>
                                                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                                        <RefreshCw className="h-3 w-3 mr-1" />
                                                                        Updated
                                                                    </div>
                                                                    <DateDisplay date={manuscript.updated_at} showTime={false} />
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                        <ActionButtons
                                                            manuscript={manuscript}
                                                            userRole={auth.user.role}
                                                            onDelete={() => {
                                                                setSelectedManuscript(manuscript);
                                                                setIsDialogOpen(true);
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden">
                                <div className="divide-y divide-gray-200/60 dark:divide-gray-700/60">
                                    {paginatedManuscripts.map((manuscript) => (
                                        <div
                                            key={manuscript.id}
                                            className={cn(
                                                "p-4 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-all cursor-pointer",
                                                selectedManuscripts.includes(manuscript.id) && "bg-green-50/60 dark:bg-green-900/20"
                                            )}
                                            onClick={() => {
                                                const viewRoute = auth.user.role === 'editor'
                                                    ? route('editor.manuscripts.show', manuscript.id)
                                                    : route('manuscripts.show', manuscript.id);
                                                router.visit(viewRoute);
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                            checked={selectedManuscripts.includes(manuscript.id)}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                toggleSelectManuscript(manuscript.id);
                                                            }}
                                                        />
                                                        <span className="font-mono text-sm text-gray-600 dark:text-gray-400">#{manuscript.id}</span>
                                                        <StatusBadge status={manuscript.status} />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                                                        {manuscript.title}
                                                    </h3>
                                                    <div className="mb-2">
                                                        <AuthorBadges authors={manuscript.authors} />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            <DateDisplay date={manuscript.created_at} showTime={false} />
                                                        </div>
                                                        <ActionButtons
                                                            manuscript={manuscript}
                                                            userRole={auth.user.role}
                                                            onDelete={() => {
                                                                setSelectedManuscript(manuscript);
                                                                setIsDialogOpen(true);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-12">
                            <EmptyState
                                searchActive={searchActive}
                                message={searchActive ? "No manuscripts match your search criteria" : "You haven't created any manuscripts yet"}
                            />
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredManuscripts.length > 0 && totalPages > 1 && (
                    <div className="bg-white dark:bg-gray-800 border-t border-gray-200/60 dark:border-gray-700/60 px-6 py-4 rounded-b-lg">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {(currentPage - 1) * pageSize + 1}
                                    </span> to <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {Math.min(currentPage * pageSize, filteredManuscripts.length)}
                                    </span> of <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {filteredManuscripts.length}
                                    </span> manuscripts
                                </p>
                            </div>

                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                            className={cn(
                                                "cursor-pointer hover:text-green-600 dark:hover:text-green-400",
                                                currentPage <= 1 && "opacity-50 cursor-not-allowed"
                                            )}
                                        />
                                    </PaginationItem>

                                    {generatePagination(currentPage, totalPages).map((item, index) => {
                                        if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                                            return (
                                                <PaginationItem key={`${item}-${index}`}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }

                                        const page = item as number;
                                        const isActive = page === currentPage;

                                        return (
                                            <PaginationItem key={`page-${page}`}>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(page)}
                                                    isActive={isActive}
                                                    className={cn(
                                                        "cursor-pointer",
                                                        isActive && "bg-green-600 text-white hover:bg-green-700 hover:text-white"
                                                    )}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                            className={cn(
                                                "cursor-pointer hover:text-green-600 dark:hover:text-green-400",
                                                currentPage >= totalPages && "opacity-50 cursor-not-allowed"
                                            )}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                )}
            </div>

            {selectedManuscript && (
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold">Delete Manuscript</AlertDialogTitle>
                            <AlertDialogDescription className="mt-2">
                                Are you sure you want to delete <span className="font-medium text-gray-800">"{selectedManuscript.title}"</span>?
                                <span className="block mt-2 text-red-500">This action cannot be undone.</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (selectedManuscript) handleDelete(selectedManuscript.id);
                                }}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </AuthenticatedLayout>
    );
}
