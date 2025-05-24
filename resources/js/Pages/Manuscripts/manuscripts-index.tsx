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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    'SUBMITTED': { color: 'purple', icon: Clock, display: 'Submitted' },
    'UNDER_REVIEW': { color: 'blue', icon: Eye, display: 'Under Review' },
    'MINOR_REVISION': { color: 'amber', icon: RefreshCw, display: 'Minor Rev.' },
    'MAJOR_REVISION': { color: 'orange', icon: AlertTriangle, display: 'Major Rev.' },
    'ACCEPTED': { color: 'green', icon: CheckCircle, display: 'Accepted' },
    'IN_COPYEDITING': { color: 'indigo', icon: Edit, display: 'Copyediting' },
    'AWAITING_AUTHOR_APPROVAL': { color: 'cyan', icon: Hourglass, display: 'Awaiting Approval' },
    'READY_FOR_PUBLICATION': { color: 'emerald', icon: FileText, display: 'Ready to Publish' },
    'REJECTED': { color: 'red', icon: XCircle, display: 'Rejected' },
    'PUBLISHED': { color: 'blue', icon: CalendarDays, display: 'Published' }
};

interface StatusBadgeProps {
    status: ManuscriptStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const normalizedStatus = status.toUpperCase() as keyof typeof STATUS_CONFIG;
    const config = STATUS_CONFIG[normalizedStatus] || { color: 'gray', icon: Info, display: status };

    const Icon = config.icon;
    const colorClass = `bg-gradient-to-r from-${config.color}-50 to-${config.color}-100 text-${config.color}-700 
        dark:bg-${config.color}-900/50 dark:text-${config.color}-300 border border-${config.color}-300 
        dark:border-${config.color}-700 shadow-sm`;

    return (
        <Tooltip>
            <TooltipTrigger>
                <div>
                    <Badge variant="outline" className={`flex items-center w-fit px-2 py-1 text-xs font-medium whitespace-nowrap rounded-md ${colorClass}`}>
                        <Icon className={`h-3.5 w-3.5 mr-1.5 text-${config.color}-600 dark:text-${config.color}-400`} />
                        {config.display}
                    </Badge>
                </div>
            </TooltipTrigger>
            <TooltipContent>{status}</TooltipContent>
        </Tooltip>
    );
};

interface DateDisplayProps {
    date: string;
    showTime?: boolean;
}

const DateDisplay = ({ date, showTime = true }: DateDisplayProps) => (
    <div className="flex flex-col">
        <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
            {new Date(date).toLocaleDateString()}
        </span>
        {showTime && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
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
        <div className="flex justify-end gap-1 sm:gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleViewClick}
                        className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent border-gray-200 dark:border-gray-700
                hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm
                dark:hover:bg-blue-900/30 dark:hover:text-blue-400 dark:hover:border-blue-700
                transition-all duration-200"
                    >
                        <span className="sr-only">View manuscript</span>
                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>View manuscript</TooltipContent>
            </Tooltip>

            {(manuscript.status === ManuscriptStatus.MINOR_REVISION || manuscript.status === ManuscriptStatus.MAJOR_REVISION) && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.visit(route('manuscripts.revision.form', manuscript.id))}
                            className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent border-gray-200 dark:border-gray-700
                    hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 hover:shadow-sm
                    dark:hover:bg-amber-900/30 dark:hover:text-amber-400 dark:hover:border-amber-700
                    transition-all duration-200"
                        >
                            <span className="sr-only">Submit revision</span>
                            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                            variant="outline"
                            size="icon"
                            onClick={() => router.visit(route('manuscripts.approve', manuscript.id))}
                            className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent border-gray-200 dark:border-gray-700
                    hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-sm
                    dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 dark:hover:border-emerald-700
                    transition-all duration-200"
                        >
                            <span className="sr-only">Approve manuscript</span>
                            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Review and approve final version</TooltipContent>
                </Tooltip>
            )}

            {manuscript.status === ManuscriptStatus.SUBMITTED && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onDelete}
                            className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent border-gray-200 dark:border-gray-700
                    hover:bg-red-50 hover:text-red-600 hover:border-red-300 hover:shadow-sm 
                    dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:hover:border-red-700
                    transition-all duration-200"
                        >
                            <span className="sr-only">Delete manuscript</span>
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete manuscript</TooltipContent>
                </Tooltip>
            )}
        </div>
    );
};

const CreateNewButton = () => (
    <Link
        href={route('manuscripts.create')}
        className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-full py-2 px-4 shadow-md transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px]"
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

            <div className="space-y-8">
                <Card className="shadow-md border border-gray-200/70 dark:border-gray-800">
                    <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white/80 dark:from-gray-900/90 dark:to-gray-800/90 pb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight text-green-700 dark:text-green-400">My Manuscripts</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Track and manage your manuscript submissions
                                </CardDescription>
                            </div>
                            <CreateNewButton />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 pt-4">
                        <div className="flex flex-col sm:flex-row px-4 sm:px-6 py-4 gap-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="relative flex-grow group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    placeholder="Search manuscripts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {Object.values(ManuscriptStatus).map((status) => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {selectedManuscripts.length > 0 && (
                            <div className="px-4 sm:px-6 py-2.5 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800/50 flex flex-wrap items-center justify-between animate-fadeIn">
                                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                    {selectedManuscripts.length} manuscript{selectedManuscripts.length > 1 ? 's' : ''} selected
                                </span>
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:text-blue-400 dark:border-blue-900/50 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-800 transition-colors"
                                        onClick={() => handleBulkAction('export')}
                                    >
                                        <Download className="h-3.5 w-3.5 mr-1.5" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent bg-gray-50/50 dark:bg-gray-800/50">
                                        <TableHead className="w-[40px] px-2 sm:px-4 text-center">
                                            <input
                                                type="checkbox"
                                                id="select-all-manuscripts"
                                                name="select-all-manuscripts"
                                                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors"
                                                checked={
                                                    paginatedManuscripts.length > 0 &&
                                                    paginatedManuscripts.every(manuscript => selectedManuscripts.includes(manuscript.id))
                                                }
                                                onChange={toggleSelectAll}
                                                disabled={paginatedManuscripts.length === 0}
                                            />
                                        </TableHead>
                                        <TableHead className="w-[50px] px-2 sm:px-4">ID</TableHead>
                                        <TableHead className="min-w-[150px]">
                                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('title')}>
                                                Title
                                                {sortConfig?.key === 'title' && (
                                                    <ChevronDown className={`h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-[100px]">Status</TableHead>
                                        <TableHead className="w-[120px]">
                                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('created_at')}>
                                                Submitted
                                                {sortConfig?.key === 'created_at' && (
                                                    <ChevronDown className={`h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">Authors</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('updated_at')}>
                                                Updated
                                                {sortConfig?.key === 'updated_at' && (
                                                    <ChevronDown className={`h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-[80px] sm:w-[120px] text-right pr-2 sm:pr-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedManuscripts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-32 text-center">
                                                <EmptyState
                                                    searchActive={searchActive}
                                                    message="You haven't created any manuscripts yet"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedManuscripts.map((manuscript) => (
                                            <TableRow
                                                key={manuscript.id}
                                                className={cn(
                                                    "hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-all cursor-pointer",
                                                    selectedManuscripts.includes(manuscript.id) ? "bg-green-50/70 dark:bg-green-900/20" : ""
                                                )}
                                            >
                                                <TableCell className="text-center px-2 sm:px-4">
                                                    <input
                                                        type="checkbox"
                                                        id={`select-manuscript-${manuscript.id}`}
                                                        name={`select-manuscript-${manuscript.id}`}
                                                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors"
                                                        checked={selectedManuscripts.includes(manuscript.id)}
                                                        onChange={() => toggleSelectManuscript(manuscript.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium px-2 sm:px-4 text-gray-700 dark:text-gray-300">{manuscript.id}</TableCell>
                                                <TableCell>
                                                    <div
                                                        className="max-w-[150px] xs:max-w-[200px] sm:max-w-[300px] truncate font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors"
                                                        title={manuscript.title}
                                                    >
                                                        {manuscript.title}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={manuscript.status} />
                                                </TableCell>
                                                <TableCell className="w-[120px]">
                                                    <DateDisplay date={manuscript.created_at} showTime={true} />
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <AuthorBadges authors={manuscript.authors} />
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <DateDisplay date={manuscript.updated_at} />
                                                </TableCell>
                                                <TableCell className="text-right pr-2 sm:pr-4">
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
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {filteredManuscripts.length > 0 && (
                            <CardFooter className="border-t bg-gradient-to-r from-gray-50 to-white/80 dark:from-gray-900/90 dark:to-gray-800/90 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Showing <span className="font-medium">
                                            {(currentPage - 1) * pageSize + 1}
                                        </span> to{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * pageSize, filteredManuscripts.length)}
                                        </span> of{' '}
                                        <span className="font-medium">
                                            {filteredManuscripts.length}
                                        </span> manuscripts
                                    </p>
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/30 border border-green-200/70 dark:border-green-800/30 text-green-700 dark:text-green-300 rounded-md px-3 py-1.5 shadow-sm">
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium text-green-600/80 dark:text-green-400/70 mr-1">Page</span>
                                                <span className="font-bold text-green-700 dark:text-green-300">{currentPage}</span>
                                            </div>
                                            <div className="h-3 w-px bg-green-200 dark:bg-green-700/50"></div>
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium text-green-600/80 dark:text-green-400/70 mr-1">of</span>
                                                <span className="font-bold text-green-700 dark:text-green-300">{totalPages}</span>
                                            </div>
                                        </div>

                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                                        className={cn(
                                                            "text-sm rounded-md py-1 px-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors",
                                                            currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-green-600 dark:hover:text-green-400"
                                                        )}
                                                    />
                                                </PaginationItem>

                                                {generatePagination(currentPage, totalPages).map((item, index) => {
                                                    if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                                                        return (
                                                            <PaginationItem key={`${item}-${index}`}>
                                                                <span className="px-2">
                                                                    <PaginationEllipsis />
                                                                </span>
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
                                                                    isActive && "bg-green-600 text-white hover:bg-green-700 hover:text-white",
                                                                    "cursor-pointer"
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
                                                            "text-sm rounded-md py-1 px-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors",
                                                            currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-green-600 dark:hover:text-green-400"
                                                        )}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </CardFooter>
                        )}
                    </CardContent>
                </Card>

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
            </div>
        </AuthenticatedLayout>
    );
}