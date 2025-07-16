import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
    CheckCircle, Clock, Edit, Eye, FileText, Filter,
    Search, ChevronDown, Download, AlertTriangle,
    CalendarDays, AlertCircle, RefreshCw, XCircle, Hourglass, Info, Upload,
    Loader2
} from 'lucide-react'
import AppLayout from '@/layouts/app-layout'
import { Head, router } from '@inertiajs/react'
import { cn } from "@/lib/utils"
import { Manuscript, ManuscriptStatus } from '@/types/manuscript'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ManuscriptTableProps {
    manuscripts: Manuscript[]
}

const STATUS_CONFIG = {
    'SUBMITTED': {
        color: 'purple',
        icon: Clock,
        display: 'Submitted',
        badgeClass: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 dark:from-purple-900/50 dark:to-purple-800/50 dark:text-purple-200 border border-purple-300 dark:border-purple-600',
        iconClass: 'text-purple-600 dark:text-purple-300',
        dropdownIconClass: 'text-purple-600 dark:text-purple-300'
    },
    'UNDER_REVIEW': {
        color: 'blue',
        icon: Eye,
        display: 'Under Review',
        badgeClass: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 dark:from-blue-900/50 dark:to-blue-800/50 dark:text-blue-200 border border-blue-300 dark:border-blue-600',
        iconClass: 'text-blue-600 dark:text-blue-300',
        dropdownIconClass: 'text-blue-600 dark:text-blue-300'
    },
    'MINOR_REVISION': {
        color: 'amber',
        icon: RefreshCw,
        display: 'Minor Rev.',
        badgeClass: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 dark:from-amber-900/50 dark:to-amber-800/50 dark:text-amber-200 border border-amber-300 dark:border-amber-600',
        iconClass: 'text-amber-600 dark:text-amber-300',
        dropdownIconClass: 'text-amber-600 dark:text-amber-300'
    },
    'MAJOR_REVISION': {
        color: 'orange',
        icon: AlertTriangle,
        display: 'Major Rev.',
        badgeClass: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 dark:from-orange-900/50 dark:to-orange-800/50 dark:text-orange-200 border border-orange-300 dark:border-orange-600',
        iconClass: 'text-orange-600 dark:text-orange-300',
        dropdownIconClass: 'text-orange-600 dark:text-orange-300'
    },
    'ACCEPTED': {
        color: 'green',
        icon: CheckCircle,
        display: 'Accepted',
        badgeClass: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 dark:from-green-900/50 dark:to-green-800/50 dark:text-green-200 border border-green-300 dark:border-green-600',
        iconClass: 'text-green-600 dark:text-green-300',
        dropdownIconClass: 'text-green-600 dark:text-green-300'
    },
    'IN_COPYEDITING': {
        color: 'indigo',
        icon: Edit,
        display: 'Copyediting',
        badgeClass: 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 dark:from-indigo-900/50 dark:to-indigo-800/50 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-600',
        iconClass: 'text-indigo-600 dark:text-indigo-300',
        dropdownIconClass: 'text-indigo-600 dark:text-indigo-300'
    },
    'AWAITING_AUTHOR_APPROVAL': {
        color: 'cyan',
        icon: Hourglass,
        display: 'Awaiting Approval',
        badgeClass: 'bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 dark:from-cyan-900/50 dark:to-cyan-800/50 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-600',
        iconClass: 'text-cyan-600 dark:text-cyan-300',
        dropdownIconClass: 'text-cyan-600 dark:text-cyan-300'
    },
    'READY_FOR_PUBLICATION': {
        color: 'emerald',
        icon: FileText,
        display: 'Ready to Publish',
        badgeClass: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 dark:from-emerald-900/50 dark:to-emerald-800/50 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600',
        iconClass: 'text-emerald-600 dark:text-emerald-300',
        dropdownIconClass: 'text-emerald-600 dark:text-emerald-300'
    },
    'REJECTED': {
        color: 'red',
        icon: XCircle,
        display: 'Rejected',
        badgeClass: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-200 border border-red-300 dark:border-red-600',
        iconClass: 'text-red-600 dark:text-red-300',
        dropdownIconClass: 'text-red-600 dark:text-red-300'
    },
    'PUBLISHED': {
        color: 'blue',
        icon: CalendarDays,
        display: 'Published',
        badgeClass: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 dark:from-blue-900/50 dark:to-blue-800/50 dark:text-blue-200 border border-blue-300 dark:border-blue-600',
        iconClass: 'text-blue-600 dark:text-blue-300',
        dropdownIconClass: 'text-blue-600 dark:text-blue-300'
    }
};

interface StatusBadgeProps {
    status: Manuscript['status'];
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

interface AuthorBadgesProps {
    authors: string | string[] | null;
}

const AuthorBadges = ({ authors }: AuthorBadgesProps) => {
    const authorList = Array.isArray(authors)
        ? authors
        : (typeof authors === 'string' && authors.trim() ? authors.split(',').map(author => author.trim()) : []);

    if (authorList.length === 0) {
        return <span className="text-gray-400 dark:text-gray-500">No authors</span>;
    }

    const allAuthorsText = authorList.join(', ');

    return (
        <div className="flex flex-wrap gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex flex-wrap gap-1">
                        {authorList.slice(0, 1).map((author, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {author}
                            </Badge>
                        ))}
                        {authorList.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                                +{authorList.length - 1}
                            </Badge>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm font-medium">All Authors:</p>
                    <p className="text-xs">{allAuthorsText}</p>
                </TooltipContent>
            </Tooltip>
        </div>
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

interface EmptyStateProps {
    searchActive: boolean;
    message: string;
}

const EmptyState = ({ searchActive, message }: EmptyStateProps) => (
    <Alert variant="default" className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4 animate-pulse">
            {searchActive ?
                <Search className="h-8 w-8 text-muted-foreground" /> :
                <FileText className="h-8 w-8 text-muted-foreground" />
            }
        </div>
        <AlertTitle>No manuscripts found</AlertTitle>
        <AlertDescription>
            {searchActive ? "Try adjusting your filters or search term" : message}
        </AlertDescription>
    </Alert>
);

export default function Index({ manuscripts }: ManuscriptTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<Manuscript['status'] | 'All'>('All')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedManuscripts, setSelectedManuscripts] = useState<number[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
    const [manuscriptToReview, setManuscriptToReview] = useState<number | null>(null)
    const [showReviewDialog, setShowReviewDialog] = useState(false)
    const [manuscriptToCopyEdit, setManuscriptToCopyEdit] = useState<number | null>(null)
    const [showCopyEditDialog, setShowCopyEditDialog] = useState(false)
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [sortConfig, setSortConfig] = useState<{ key: keyof Manuscript; direction: 'asc' | 'desc' }>({
        key: 'created_at',
        direction: 'desc'
    });

    const filteredResults = useMemo(() => {
        const filtered = manuscripts.filter(manuscript =>
            manuscript.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === 'All' || manuscript.status === statusFilter)
        );

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
    }, [manuscripts, searchTerm, statusFilter, sortConfig]);

    const totalPages = Math.ceil(filteredResults.length / pageSize);
    const paginatedManuscripts = filteredResults.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const searchActive = searchTerm !== '' || statusFilter !== 'All';

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('editor.dashboard'),
        },
        {
            label: 'Manuscripts',
            href: route('editor.indexManuscripts'),
        }
    ];

    const handleViewManuscript = (id: number) => {
        setIsLoading(true);
        router.visit(route('editor.manuscripts.show', id), {
            onFinish: () => setIsLoading(false)
        });
    };

    const handleSetUnderReviewClick = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click event
        setManuscriptToReview(id);
        setShowReviewDialog(true);
    };

    const handleStartCopyEditingClick = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click event
        setManuscriptToCopyEdit(id);
        setShowCopyEditDialog(true);
    };

    const handleSetUnderReview = () => {
        if (!manuscriptToReview) return;

        setIsLoading(true);
        router.post(route('editor.manuscripts.set_under_review', manuscriptToReview), {}, {
            onFinish: () => {
                setIsLoading(false);
                setShowReviewDialog(false);
                setManuscriptToReview(null);
            },
            preserveScroll: true,
        });
    };

    const handleStartCopyEditing = () => {
        if (!manuscriptToCopyEdit) return;

        setIsLoading(true);
        console.log('Starting copy editing for manuscript:', manuscriptToCopyEdit);

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        fetch(route('editor.manuscripts.start_copyediting', manuscriptToCopyEdit), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken || '',
            },
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Error starting copy editing');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                window.location.href = route('editor.indexManuscripts');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to start copy editing: ' + error.message);
            })
            .finally(() => {
                setIsLoading(false);
                setShowCopyEditDialog(false);
                setManuscriptToCopyEdit(null);
            });
    };

    const handleEditorialDecision = (id: number) => {
        setIsLoading(true);
        router.visit(route('editor.manuscripts.create_decision', id), {
            onFinish: () => setIsLoading(false)
        });
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setUploadFile(file);
        setUploadError(null);
    };

    const handleUploadFinalized = () => {
        if (!manuscriptToCopyEdit || !uploadFile) {
            setUploadError("Please select a file to upload");
            return;
        }

        setIsLoading(true);

        router.post(route('editor.manuscripts.upload_finalized', manuscriptToCopyEdit), {
            manuscript_file: uploadFile
        }, {
            forceFormData: true, // Ensure FormData is used
            onProgress: (progress) => {
                console.log('Upload progress:', progress);
            },
            onSuccess: () => {
                console.log('Upload successful');
                window.location.href = route('editor.indexManuscripts');
            },
            onError: (errors) => {
                console.error('Upload error:', errors);
                setUploadError(errors.manuscript_file || 'Failed to upload finalized manuscript');
            },
            onFinish: () => {
                setIsLoading(false);
                setShowUploadDialog(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Submitted Manuscripts" />
            <Card className="max-w-full">
                <CardHeader>
                    <CardTitle>Submitted Manuscripts</CardTitle>
                    <CardDescription>Review and manage manuscript submissions</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-6">
                    {/* Search and Controls Section */}
                    <div className="bg-card dark:bg-[color:var(--color-bg-dark)] rounded-lg shadow-sm border border-border">
                        <div className="px-4 sm:px-6 py-5">
                            <div className="flex flex-col gap-4">
                                {/* Controls Row */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {filteredResults.length} {filteredResults.length === 1 ? 'manuscript' : 'manuscripts'} found
                                        </p>
                                        {selectedManuscripts.length > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-primary">
                                                <span className="hidden sm:inline">•</span>
                                                <span>{selectedManuscripts.length} selected</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={selectedManuscripts.length === 0}
                                        className="w-full sm:w-auto border-[color:var(--color-border)] dark:border-[color:var(--color-border-dark)] hover:border-primary hover:text-primary transition-all"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export ({selectedManuscripts.length})
                                    </Button>
                                </div>

                                {/* Search and Filter Row */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1 group min-w-0">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            placeholder="Search by title, author, or ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 border-border bg-background text-foreground focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    <DropdownMenu open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="border-border bg-background text-foreground w-full sm:w-[200px] justify-between"
                                            >
                                                <div className="flex items-center">
                                                    <Filter className="h-4 w-4 mr-2" />
                                                    {statusFilter === 'All' ? 'All Status' : STATUS_CONFIG[statusFilter.toUpperCase() as keyof typeof STATUS_CONFIG]?.display || statusFilter}
                                                </div>
                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-full sm:w-[200px]">
                                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className={statusFilter === 'All' ? "bg-muted dark:bg-background" : ""}
                                                onClick={() => {
                                                    setStatusFilter('All');
                                                    setIsFilterMenuOpen(false);
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                                                    All Manuscripts
                                                </div>
                                            </DropdownMenuItem>
                                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                                <DropdownMenuItem
                                                    key={key}
                                                    className={statusFilter === key ? "bg-muted dark:bg-background" : ""}
                                                    onClick={() => {
                                                        setStatusFilter(key as Manuscript['status']);
                                                        setIsFilterMenuOpen(false);
                                                    }}
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
                    <div className="bg-card dark:bg-[color:var(--color-bg-dark)] rounded-lg shadow-sm border border-border overflow-hidden">
                        {paginatedManuscripts.length > 0 ? (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden xl:block">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent bg-card dark:bg-card border-b border-border">
                                                    <TableHead className="w-12 text-center">
                                                        <Checkbox
                                                            checked={
                                                                paginatedManuscripts.length > 0 &&
                                                                paginatedManuscripts.every(manuscript => selectedManuscripts.includes(manuscript.id))
                                                            }
                                                            onCheckedChange={toggleSelectAll}
                                                            aria-label="Select all manuscripts"
                                                        />
                                                    </TableHead>
                                                    <TableHead
                                                        className="cursor-pointer hover:text-primary"
                                                        onClick={() => setSortConfig({
                                                            key: 'id',
                                                            direction: sortConfig.key === 'id' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                                        })}
                                                    >
                                                        <div className="flex items-center font-semibold">
                                                            ID
                                                            {sortConfig.key === 'id' && (
                                                                <span className="ml-1 text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                            )}
                                                        </div>
                                                    </TableHead>
                                                    <TableHead
                                                        className="cursor-pointer hover:text-primary"
                                                        onClick={() => setSortConfig({
                                                            key: 'title',
                                                            direction: sortConfig.key === 'title' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                                        })}
                                                    >
                                                        <div className="flex items-center font-semibold">
                                                            Manuscript Details
                                                            {sortConfig.key === 'title' && (
                                                                <span className="ml-1 text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                            )}
                                                        </div>
                                                    </TableHead>
                                                    <TableHead
                                                        className="cursor-pointer hover:text-primary"
                                                        onClick={() => setSortConfig({
                                                            key: 'status',
                                                            direction: sortConfig.key === 'status' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                                        })}
                                                    >
                                                        <div className="flex items-center font-semibold">
                                                            Status
                                                            {sortConfig.key === 'status' && (
                                                                <span className="ml-1 text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                            )}
                                                        </div>
                                                    </TableHead>
                                                    <TableHead
                                                        className="cursor-pointer hover:text-primary"
                                                        onClick={() => setSortConfig({
                                                            key: 'created_at',
                                                            direction: sortConfig.key === 'created_at' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                                        })}
                                                    >
                                                        <div className="flex items-center font-semibold">
                                                            Timeline
                                                            {sortConfig.key === 'created_at' && (
                                                                <span className="ml-1 text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                            )}
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="bg-card divide-y divide-border">
                                                {paginatedManuscripts.map((manuscript) => (
                                                    <TableRow
                                                        key={manuscript.id}
                                                        className={cn(
                                                            "group cursor-pointer transition-all hover:bg-gray-50/80 dark:hover:bg-gray-800/50 border-b border-gray-200/40 dark:border-gray-700/40",
                                                            selectedManuscripts.includes(manuscript.id) && "bg-primary/10"
                                                        )}
                                                        onClick={() => handleViewManuscript(manuscript.id)}
                                                    >
                                                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                                            <Checkbox
                                                                checked={selectedManuscripts.includes(manuscript.id)}
                                                                onCheckedChange={() => toggleSelectManuscript(manuscript.id)}
                                                                aria-label={`Select manuscript #${manuscript.id}`}
                                                                onClick={e => e.stopPropagation()}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                                            #{manuscript.id}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="max-w-md">
                                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-2">
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
                                                            <div className="flex justify-end gap-1">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleViewManuscript(manuscript.id)}
                                                                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                                                                        >
                                                                            <FileText className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>View Details</TooltipContent>
                                                                </Tooltip>

                                                                {manuscript.status === ManuscriptStatus.SUBMITTED && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={(e) => handleSetUnderReviewClick(manuscript.id, e)}
                                                                                className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
                                                                            >
                                                                                <Eye className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Start Review</TooltipContent>
                                                                    </Tooltip>
                                                                )}

                                                                {manuscript.status === ManuscriptStatus.UNDER_REVIEW && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleEditorialDecision(manuscript.id)}
                                                                                className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors"
                                                                            >
                                                                                <AlertCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Editorial Decision</TooltipContent>
                                                                    </Tooltip>
                                                                )}

                                                                {manuscript.status === ManuscriptStatus.ACCEPTED && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={(e) => handleStartCopyEditingClick(manuscript.id, e)}
                                                                                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                                                                            >
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Start Copy Editing</TooltipContent>
                                                                    </Tooltip>
                                                                )}

                                                                {manuscript.status === ManuscriptStatus.IN_COPYEDITING && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setManuscriptToCopyEdit(manuscript.id);
                                                                                    setShowUploadDialog(true);
                                                                                }}
                                                                                className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors"
                                                                            >
                                                                                <Upload className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Upload Finalized</TooltipContent>
                                                                    </Tooltip>
                                                                )}

                                                                {manuscript.status === ManuscriptStatus.READY_FOR_PUBLICATION && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setIsLoading(true);
                                                                                    router.visit(route('editor.manuscripts.prepare_publication_form', manuscript.id), {
                                                                                        onFinish: () => setIsLoading(false)
                                                                                    });
                                                                                }}
                                                                                className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors"
                                                                            >
                                                                                <CalendarDays className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Prepare Publication</TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Mobile Card View */}
                                <div className="xl:hidden divide-y divide-gray-200 dark:divide-gray-700">
                                    {paginatedManuscripts.map((manuscript) => (
                                        <div
                                            key={manuscript.id}
                                            className={cn(
                                                "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer",
                                                selectedManuscripts.includes(manuscript.id) && "bg-primary/10"
                                            )}
                                            onClick={() => handleViewManuscript(manuscript.id)}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    checked={selectedManuscripts.includes(manuscript.id)}
                                                    onCheckedChange={() => toggleSelectManuscript(manuscript.id)}
                                                    aria-label={`Select manuscript #${manuscript.id}`}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">#{manuscript.id}</span>
                                                        <StatusBadge status={manuscript.status} />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                                                        {manuscript.title}
                                                    </h3>
                                                    <AuthorBadges authors={manuscript.authors} />
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            {new Date(manuscript.created_at).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewManuscript(manuscript.id)}
                                                                className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                                                            >
                                                                <FileText className="h-3.5 w-3.5" />
                                                            </Button>
                                                            {manuscript.status === ManuscriptStatus.SUBMITTED && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={(e) => handleSetUnderReviewClick(manuscript.id, e)}
                                                                    className="h-7 w-7 p-0 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
                                                                >
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                </Button>
                                                            )}
                                                            {/* Add other action buttons for mobile as needed */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="py-12">
                                <EmptyState
                                    searchActive={searchActive}
                                    message={searchActive ? "No manuscripts match your search criteria" : "No manuscripts have been submitted yet"}
                                />
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredResults.length > 0 && totalPages > 1 && (
                        <div className="bg-card dark:bg-[color:var(--color-bg-dark)] border-t border-border px-4 sm:px-6 py-4 rounded-b-lg">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 order-2 sm:order-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                                        <span className="block sm:inline">
                                            Showing <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {(currentPage - 1) * pageSize + 1}
                                            </span> to <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {Math.min(currentPage * pageSize, filteredResults.length)}
                                            </span>
                                        </span>
                                        <span className="block sm:inline sm:ml-1">
                                            of <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {filteredResults.length}
                                            </span> manuscripts
                                        </span>
                                    </p>
                                </div>

                                <div className="order-1 sm:order-2">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                                    className={cn(
                                                        "cursor-pointer hover:text-primary",
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
                                                                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                                                            )}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}

                                            <PaginationItem>                                            <PaginationNext
                                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                                className={cn(
                                                    "cursor-pointer hover:text-primary",
                                                    currentPage >= totalPages && "opacity-50 cursor-not-allowed"
                                                )}
                                            />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Set under review dialog - existing code */}
            <Dialog open={showReviewDialog} onOpenChange={(open) => {
                setShowReviewDialog(open);
                if (!open) setManuscriptToReview(null);
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Set to Under Review</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                            This will change the manuscript status to "Under Review" and notify relevant parties. Are you sure you want to continue?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start">
                            <Eye className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
                            <span>
                                <span className="font-medium block">
                                    {manuscripts.find(m => m.id === manuscriptToReview)?.title}
                                </span>
                                <span className="text-blue-600 dark:text-blue-400 text-xs mt-1 block">
                                    by {manuscripts.find(m => m.id === manuscriptToReview)?.authors}
                                </span>
                            </span>
                        </p>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowReviewDialog(false)}
                            disabled={isLoading}
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSetUnderReview}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add new Copy Editing dialog */}
            <Dialog open={showCopyEditDialog} onOpenChange={(open) => {
                setShowCopyEditDialog(open);
                if (!open) setManuscriptToCopyEdit(null);
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Start Copy Editing</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                            Copy editing will be conducted outside of this system. Confirm to proceed with the copy editing process.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                            <p className="flex items-start">
                                <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                <span>
                                    Copy editing will be performed <strong>outside</strong> of this system
                                </span>
                            </p>
                            <p className="flex items-start">
                                <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                <span>
                                    The manuscript status will change to "In Copyediting"
                                </span>
                            </p>
                            <p className="flex items-start">
                                <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                <span>
                                    You'll need to upload the final version after the process is complete
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                                <span className="font-medium block">
                                    {manuscripts.find(m => m.id === manuscriptToCopyEdit)?.title}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs mt-1 block">
                                    {/* Fix: authors might be a string, not an array */}
                                    by {manuscripts.find(m => m.id === manuscriptToCopyEdit)?.authors || ''}
                                </span>
                            </span>
                        </p>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowCopyEditDialog(false)}
                            disabled={isLoading}
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStartCopyEditing}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : "Start Copy Editing"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Upload Finalized Manuscript Dialog */}
            <Dialog open={showUploadDialog} onOpenChange={(open) => {
                setShowUploadDialog(open);
                if (!open) {
                    setManuscriptToCopyEdit(null);
                    setUploadFile(null);
                    setUploadError(null);
                }
            }}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Upload Finalized Manuscript</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                            Upload the finalized manuscript after copy editing. This will be the version sent to the author for final approval.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                                <span className="font-medium block">
                                    {manuscripts.find(m => m.id === manuscriptToCopyEdit)?.title}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs mt-1 block">
                                    by {manuscripts.find(m => m.id === manuscriptToCopyEdit)?.authors || ''}
                                </span>
                            </span>
                        </p>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div className="flex flex-col">
                            <label htmlFor="manuscript-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Finalized Manuscript File (PDF)
                            </label>

                            <div className={`mt-1 border-2 border-dashed rounded-lg transition-colors ${uploadFile
                                ? 'bg-accent/20 border-primary'
                                : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                }`}>
                                <div className="flex flex-col items-center justify-center py-6 px-4">
                                    {!uploadFile ? (
                                        <>
                                            <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-1">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                PDF files only (max. 20MB)
                                            </p>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <FileText className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                                            <p className="text-sm font-medium text-green-700 dark:text-green-300 text-center">
                                                {uploadFile.name}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                {(uploadFile.size / 1024 / 1024).toFixed(2)} MB • PDF
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-3 h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                                                onClick={() => setUploadFile(null)}
                                            >
                                                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                                Remove file
                                            </Button>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="manuscript-file"
                                        name="manuscript_file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${uploadFile ? 'pointer-events-none' : ''}`}
                                    />
                                </div>
                            </div>

                            {!uploadFile && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    The copy-edited manuscript should be properly formatted and ready for author approval
                                </p>
                            )}

                            {uploadError && (
                                <Alert variant="destructive" className="mt-3">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{uploadError}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                            <li className="flex items-start">
                                <Info className="h-4 w-4 mr-1.5 mt-0.5" />
                                <span>The finalized manuscript will be sent to the author for approval.</span>
                            </li>
                            <li className="flex items-start">
                                <Info className="h-4 w-4 mr-1.5 mt-0.5" />
                                <span>This upload should include all copy editing changes and formatting.</span>
                            </li>
                        </ul>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowUploadDialog(false)}
                            disabled={isLoading}
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUploadFinalized}
                            disabled={isLoading || !uploadFile}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                    Uploading...
                                </span>
                            ) : "Upload Finalized Manuscript"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    )
}
