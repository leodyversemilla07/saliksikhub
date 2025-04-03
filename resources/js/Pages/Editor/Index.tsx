import { useState, useMemo } from 'react'
import { Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
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
    Search, ChevronRight, ChevronDown, Download, AlertTriangle,
    CalendarDays, AlertCircle, RefreshCw, XCircle, Hourglass, Info, Upload,
    Loader2
} from 'lucide-react'
import AuthenticatedLayout from '@/layouts/authenticated-layout'
import { Head } from '@inertiajs/react'
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

interface ManuscriptTableProps {
    manuscripts: Manuscript[]
}

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
    status: Manuscript['status'];
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

    // Create a formatted string of all authors for the tooltip
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
    // Add state for copy editing dialog
    const [manuscriptToCopyEdit, setManuscriptToCopyEdit] = useState<number | null>(null)
    const [showCopyEditDialog, setShowCopyEditDialog] = useState(false)
    // Add state for upload dialog
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [sortConfig, setSortConfig] = useState<{ key: keyof Manuscript; direction: 'asc' | 'desc' }>({
        key: 'created_at',
        direction: 'desc'
    });

    // Add sort functionality to filter results
    const filteredResults = useMemo(() => {
        const filtered = manuscripts.filter(manuscript =>
            manuscript.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === 'All' || manuscript.status === statusFilter)
        );

        // Apply sorting
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

    // Remove unused stats variable or comment it out for future use
    // const stats = {
    //     totalManuscripts: manuscripts.length,
    //     pendingReview: manuscripts.filter(m => m.status === ManuscriptStatus.SUBMITTED).length,
    //     underReview: manuscripts.filter(m => m.status === ManuscriptStatus.UNDER_REVIEW).length,
    //     completed: manuscripts.filter(m => [ManuscriptStatus.ACCEPTED, ManuscriptStatus.REJECTED].includes(m.status as any)).length
    // }

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

    // Add handler for copy editing dialog
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

    // Update the handler for confirming copy editing
    const handleStartCopyEditing = () => {
        if (!manuscriptToCopyEdit) return;

        setIsLoading(true);
        console.log('Starting copy editing for manuscript:', manuscriptToCopyEdit);

        // Add CSRF token manually
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        // Create fetch request with detailed error handling
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
                // Hard reload to ensure we get fresh data
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

    // Add handler for file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setUploadFile(file);
        setUploadError(null);
    };

    // Add handler for finalizing manuscript upload
    const handleUploadFinalized = () => {
        if (!manuscriptToCopyEdit || !uploadFile) {
            setUploadError("Please select a file to upload");
            return;
        }

        setIsLoading(true);

        // Use Inertia's router for the file upload
        router.post(route('editor.manuscripts.upload_finalized', manuscriptToCopyEdit), {
            // For PUT/PATCH methods, use method spoofing if needed
            // _method: 'put',
            manuscript_file: uploadFile
        }, {
            forceFormData: true, // Ensure FormData is used
            onProgress: (progress) => {
                console.log('Upload progress:', progress);
                // You could add upload progress state if desired
            },
            onSuccess: () => {
                console.log('Upload successful');
                // Hard reload is typically not needed with Inertia
                // but if you want to force a fresh data load:
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
        <AuthenticatedLayout header="Submitted Manuscripts">
            <Head title="Submitted Manuscripts" />

            <div className="space-y-8">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
                            <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Dashboard
                        </Link>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400 dark:text-gray-500" />
                    <div className="flex items-center">
                        <span className="font-medium text-green-600 dark:text-green-400">
                            My Manuscripts
                        </span>
                    </div>
                </div>

                <Card className="shadow-md border border-gray-200/70 dark:border-gray-800">
                    <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white/80 dark:from-gray-900/90 dark:to-gray-800/90 pb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight text-green-700 dark:text-green-400">Manuscript Submissions</CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Manage and review submitted manuscripts
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={selectedManuscripts.length === 0}
                                    className="border-green-200 hover:border-green-300 dark:border-green-900 dark:hover:border-green-800 transition-colors"
                                >
                                    <Download className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="hidden sm:inline">Export Selected</span>
                                    <span className="sm:hidden">Export</span>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 pt-4">
                        <div className="flex flex-col sm:flex-row px-4 sm:px-6 py-4 gap-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="relative flex-grow group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                <Input
                                    id="search-manuscripts"
                                    name="search-manuscripts"
                                    placeholder="Search manuscripts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <DropdownMenu open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <Filter className="h-4 w-4" />
                                        <span className="truncate max-w-[100px]">
                                            {statusFilter !== 'All' ? statusFilter : 'Filter'}
                                        </span>
                                        <ChevronDown className="h-3.5 w-3.5 ml-1.5 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 border border-gray-200 dark:border-gray-700">
                                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className={statusFilter === 'All' ? "bg-gray-100 dark:bg-gray-800" : ""}
                                        onClick={() => {
                                            setStatusFilter('All');
                                            setIsFilterMenuOpen(false);
                                        }}
                                    >
                                        All Manuscripts
                                    </DropdownMenuItem>
                                    {Object.values(ManuscriptStatus).map((status) => (
                                        <DropdownMenuItem
                                            key={status}
                                            className={statusFilter === status ? "bg-gray-100 dark:bg-gray-800" : ""}
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setIsFilterMenuOpen(false);
                                            }}
                                        >
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

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
                                        <TableHead 
                                            className="w-[50px] px-2 sm:px-4 cursor-pointer"
                                            onClick={() => setSortConfig({
                                                key: 'id',
                                                direction: sortConfig.key === 'id' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                            })}
                                        >
                                            <div className="flex items-center">
                                                ID
                                                {sortConfig.key === 'id' && (
                                                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead 
                                            className="min-w-[150px] cursor-pointer"
                                            onClick={() => setSortConfig({
                                                key: 'title',
                                                direction: sortConfig.key === 'title' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                            })}
                                        >
                                            <div className="flex items-center">
                                                Title
                                                {sortConfig.key === 'title' && (
                                                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead 
                                            className="w-[100px] cursor-pointer"
                                            onClick={() => setSortConfig({
                                                key: 'status',
                                                direction: sortConfig.key === 'status' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                            })}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                {sortConfig.key === 'status' && (
                                                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead 
                                            className="w-[120px] cursor-pointer"
                                            onClick={() => setSortConfig({
                                                key: 'created_at',
                                                direction: sortConfig.key === 'created_at' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                            })}
                                        >
                                            <div className="flex items-center">
                                                Submitted
                                                {sortConfig.key === 'created_at' && (
                                                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">Authors</TableHead>
                                        <TableHead 
                                            className="hidden md:table-cell cursor-pointer"
                                            onClick={() => setSortConfig({
                                                key: 'updated_at',
                                                direction: sortConfig.key === 'updated_at' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                                            })}
                                        >
                                            <div className="flex items-center">
                                                Updated
                                                {sortConfig.key === 'updated_at' && (
                                                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-[80px] sm:w-[120px] text-right pr-2 sm:pr-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedManuscripts.length > 0 ? paginatedManuscripts.map((manuscript) => (
                                        <TableRow
                                            key={manuscript.id}
                                            className={cn(
                                                "hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-all cursor-pointer",
                                                selectedManuscripts.includes(manuscript.id) && "bg-green-50/70 dark:bg-green-900/20"
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
                                                <div className="flex justify-end gap-1 sm:gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                disabled={isLoading}
                                                                onClick={() => handleViewManuscript(manuscript.id)}
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

                                                    {manuscript.status === ManuscriptStatus.SUBMITTED && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    disabled={isLoading}
                                                                    onClick={(e) => handleSetUnderReviewClick(manuscript.id, e)}
                                                                    className="h-8 w-8 sm:h-9 sm:w-9 ml-1 sm:ml-0 bg-transparent border-gray-200 dark:border-gray-700
                                                                    hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-sm
                                                                    dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 dark:hover:border-indigo-700
                                                                    transition-all duration-200"
                                                                >
                                                                    <span className="sr-only">Set to Under Review</span>
                                                                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Set to Under Review</TooltipContent>
                                                        </Tooltip>
                                                    )}

                                                    {manuscript.status === ManuscriptStatus.UNDER_REVIEW && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    disabled={isLoading}
                                                                    onClick={() => handleEditorialDecision(manuscript.id)}
                                                                    className="h-8 w-8 sm:h-9 sm:w-9 ml-1 sm:ml-0 bg-transparent border-gray-200 dark:border-gray-700
                                                                    hover:bg-green-50 hover:text-green-600 hover:border-green-300 hover:shadow-sm
                                                                    dark:hover:bg-green-900/30 dark:hover:text-green-400 dark:hover:border-green-700
                                                                    transition-all duration-200"
                                                                >
                                                                    <span className="sr-only">Make editorial decision</span>
                                                                    <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Make editorial decision</TooltipContent>
                                                        </Tooltip>
                                                    )}

                                                    {/* Add new button for starting copy editing */}
                                                    {manuscript.status === ManuscriptStatus.ACCEPTED && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    disabled={isLoading}
                                                                    onClick={(e) => handleStartCopyEditingClick(manuscript.id, e)}
                                                                    className="h-8 w-8 sm:h-9 sm:w-9 ml-1 sm:ml-0 bg-transparent border-gray-200 dark:border-gray-700
                                                                    hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm
                                                                    dark:hover:bg-blue-900/30 dark:hover:text-blue-400 dark:hover:border-blue-700
                                                                    transition-all duration-200"
                                                                >
                                                                    <span className="sr-only">Start Copy Editing</span>
                                                                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Start Copy Editing</TooltipContent>
                                                        </Tooltip>
                                                    )}

                                                    {/* Add new button for copy editing manuscripts */}
                                                    {manuscript.status === ManuscriptStatus.IN_COPYEDITING && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    disabled={isLoading}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setManuscriptToCopyEdit(manuscript.id);
                                                                        setShowUploadDialog(true);
                                                                    }}
                                                                    className="h-8 w-8 sm:h-9 sm:w-9 ml-1 sm:ml-0 bg-transparent border-gray-200 dark:border-gray-700
                                                                    hover:bg-green-50 hover:text-green-600 hover:border-green-300 hover:shadow-sm
                                                                    dark:hover:bg-green-900/30 dark:hover:text-green-400 dark:hover:border-green-700
                                                                    transition-all duration-200"
                                                                >
                                                                    <span className="sr-only">Upload Finalized Manuscript</span>
                                                                    <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Upload Finalized Manuscript</TooltipContent>
                                                        </Tooltip>
                                                    )}

                                                    {/* Add new button for preparing publication */}
                                                    {manuscript.status === ManuscriptStatus.READY_FOR_PUBLICATION && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    disabled={isLoading}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setIsLoading(true);
                                                                        router.visit(route('editor.manuscripts.prepare_publication_form', manuscript.id), {
                                                                            onFinish: () => setIsLoading(false)
                                                                        });
                                                                    }}
                                                                    className="h-8 w-8 sm:h-9 sm:w-9 ml-1 sm:ml-0 bg-transparent border-gray-200 dark:border-gray-700
                                                                    hover:bg-green-50 hover:text-green-600 hover:border-green-300 hover:shadow-sm
                                                                    dark:hover:bg-green-900/30 dark:hover:text-green-400 dark:hover:border-green-700
                                                                    transition-all duration-200"
                                                                >
                                                                    <span className="sr-only">Prepare Publication</span>
                                                                    <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Prepare for Publication</TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-32 text-center">
                                                <EmptyState
                                                    searchActive={searchActive}
                                                    message="No manuscripts have been submitted yet"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>

                    {filteredResults.length > 0 && (
                        <CardFooter className="border-t bg-gradient-to-r from-gray-50 to-white/80 dark:from-gray-900/90 dark:to-gray-800/90 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-medium">
                                        {(currentPage - 1) * pageSize + 1}
                                    </span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(currentPage * pageSize, filteredResults.length)}
                                    </span> of{' '}
                                    <span className="font-medium">
                                        {filteredResults.length}
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
                </Card>
            </div>

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
                                ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-600'
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
                                <div className="mt-3 p-2.5 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                                    <p className="flex items-center text-sm text-red-700 dark:text-red-300">
                                        <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span>{uploadError}</span>
                                    </p>
                                </div>
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

        </AuthenticatedLayout>
    )
}

