import { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { Eye, Edit2, Trash2, Search, MoreHorizontal } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

interface Manuscript {
    id: number;
    title: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    status: 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected';
    authors: string | string[] | null;
}

interface IndexProps {
    manuscripts: Manuscript[];
}

// Consolidated status color mapping
const statusColors: Record<Manuscript['status'], string> = {
    Submitted: 'bg-gray-200 text-gray-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    'Revision Required': 'bg-yellow-100 text-yellow-800',
    Accepted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};

// Helper to calculate the threshold date for filtering
const calculateFilterDate = (dateFilter: string): Date | null => {
    if (dateFilter === 'all') return null;
    const today = new Date();
    const filterDate = new Date();
    filterDate.setHours(0, 0, 0, 0);

    switch (dateFilter) {
        case 'week':
            filterDate.setDate(today.getDate() - 7);
            break;
        case 'month':
            filterDate.setMonth(today.getMonth() - 1);
            break;
        case 'year':
            filterDate.setFullYear(today.getFullYear() - 1);
            filterDate.setMonth(0);
            filterDate.setDate(1);
            break;
        default:
            return null;
    }
    return filterDate;
};

export default function Index({ manuscripts }: IndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const toast = useToast();

    const statuses = ['Submitted', 'Under Review', 'Revision Required', 'Accepted', 'Rejected'];

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, dateFilter]);

    // Compute filtered manuscripts using useMemo
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

        const thresholdDate = calculateFilterDate(dateFilter);
        if (thresholdDate) {
            filtered = filtered.filter((manuscript) => {
                const manuscriptDate = new Date(manuscript.created_at);
                manuscriptDate.setHours(0, 0, 0, 0);
                return manuscriptDate >= thresholdDate;
            });
        }

        return filtered;
    }, [manuscripts, searchQuery, statusFilter, dateFilter]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredManuscripts.length / pageSize);
    const paginatedManuscripts = filteredManuscripts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Async deletion function with proper feedback
    const handleDelete = async (id: number) => {
        try {
            await Inertia.delete(`/author/manuscripts/${id}`, {
                onSuccess: () => {
                    toast.toast({
                        title: 'Success',
                        description: 'Manuscript deleted successfully.',
                        variant: 'default',
                    });
                },
                onError: () => {
                    toast.toast({
                        title: 'Error',
                        description: 'Failed to delete the manuscript. Please try again.',
                        variant: 'destructive',
                    });
                },
                onFinish: () => {
                    setIsDialogOpen(false);
                },
            });
        } catch (error) {
            console.error('Error deleting manuscript:', error);
        }
    };

    // Helper to ensure authors are returned as an array of strings
    const getAuthors = (authors: string | string[] | null): string[] => {
        if (Array.isArray(authors)) {
            return authors;
        }
        if (typeof authors === 'string' && authors.trim()) {
            return authors.split(',').map((author) => author.trim());
        }
        return [];
    };

    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                        Manuscript Tracking
                    </h2>
                }
            >
                <Head title="Manuscript Tracking" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Card className="w-full shadow-lg rounded-lg">
                        <CardHeader className="border-b border-gray-200 pb-4">
                            <CardTitle className="text-2xl font-bold mb-4">My Manuscripts</CardTitle>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="relative w-full md:max-w-xs">
                                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                    <Input
                                        placeholder="Search manuscripts..."
                                        className="pl-10 rounded-full shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-48">
                                        <Label htmlFor="status-filter" className="mb-1">
                                            Status
                                        </Label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger id="status-filter" className="rounded-md">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                {statuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <Label htmlFor="date-filter" className="mb-1">
                                            Time Period
                                        </Label>
                                        <Select value={dateFilter} onValueChange={setDateFilter}>
                                            <SelectTrigger id="date-filter" className="rounded-md">
                                                <SelectValue placeholder="All Time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Time</SelectItem>
                                                <SelectItem value="week">Past Week</SelectItem>
                                                <SelectItem value="month">Past Month</SelectItem>
                                                <SelectItem value="year">Past Year</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table className="min-w-full divide-y divide-gray-200">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                ID
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                Manuscript Title
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                Status
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                Submitted
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                Authors
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                Updated
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white divide-y divide-gray-200">
                                        {paginatedManuscripts.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                    No manuscripts found matching your criteria
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedManuscripts.map((manuscript) => (
                                                <TableRow
                                                    key={manuscript.id}
                                                    className="transition-colors duration-200 hover:bg-gray-50"
                                                >
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {manuscript.id}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[200px] truncate">
                                                        {manuscript.title}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                                        <Badge
                                                            variant="secondary"
                                                            className={`${statusColors[manuscript.status]} whitespace-nowrap`}
                                                        >
                                                            {manuscript.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(manuscript.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px]">
                                                        {getAuthors(manuscript.authors).length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {getAuthors(manuscript.authors).map(
                                                                    (author, index) => (
                                                                        <Badge key={index} variant="outline" className="text-xs">
                                                                            {author}
                                                                        </Badge>
                                                                    )
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">No co-authors</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(manuscript.updated_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        (window.location.href = `/author/manuscripts/${manuscript.id}`)
                                                                    }
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        (window.location.href = `/author/manuscripts/${manuscript.id}/edit`)
                                                                    }
                                                                >
                                                                    <Edit2 className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedManuscript(manuscript);
                                                                        setIsDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="text-sm text-gray-700">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {(currentPage - 1) * pageSize + 1}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * pageSize, filteredManuscripts.length)}
                                        </span>{' '}
                                        of <span className="font-medium">{filteredManuscripts.length}</span>{' '}
                                        results
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
                                            Previous
                                        </Button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {selectedManuscript && (
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogContent className="max-w-md">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-semibold">
                                        Confirm Deletion
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="mt-2 text-gray-600">
                                        Are you sure you want to delete this manuscript? <br />
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-4 flex justify-end space-x-3">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (selectedManuscript)
                                                handleDelete(selectedManuscript.id);
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </AuthenticatedLayout>
        </>
    );
}
