import { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Eye, Edit2, Trash2, Clock, Search } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { toast, useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';


type Manuscript = {
    id: number;
    title: string;
    user_id: number;
    created_at: string; // Changed from submissionDate
    updated_at: string; // Changed from lastUpdated
    status: 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected';
    authors: string | string[] | null;
};

interface ManuscriptTableProps {
    manuscripts: Manuscript[];
}

export default function Index({ manuscripts }: ManuscriptTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [filteredManuscripts, setFilteredManuscripts] = useState<Manuscript[]>(manuscripts);
    const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const toast = useToast();

    const statuses = ['Submitted', 'Under Review', 'Revision Required', 'Accepted', 'Rejected'];

    useEffect(() => {
        let filtered = [...manuscripts];

        if (searchQuery) {
            filtered = filtered.filter((manuscript) =>
                manuscript.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter((manuscript) => manuscript.status === statusFilter);
        }

        if (dateFilter && dateFilter !== 'all') {
            const today = new Date();
            const filterDate = new Date();

            // Normalize both dates to remove time component for accurate comparisons
            filterDate.setHours(0, 0, 0, 0); // Start of the day

            switch (dateFilter) {
                case 'week':
                    filterDate.setDate(today.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(today.getMonth() - 1);
                    break;
                case 'year':
                    // Set filterDate to the start of last year (January 1st of the previous year)
                    filterDate.setFullYear(today.getFullYear() - 1);
                    filterDate.setMonth(0); // January
                    filterDate.setDate(1); // 1st day of January
                    break;
                default:
                    break;
            }

            filtered = filtered.filter(
                (manuscript) => {
                    const manuscriptDate = new Date(manuscript.created_at);
                    manuscriptDate.setHours(0, 0, 0, 0); // Normalize manuscript's date for accurate comparison

                    if (dateFilter === 'year') {
                        // For "year" filter, check if the manuscript is within the past year
                        const startOfYear = new Date(today.getFullYear(), 0, 1); // Start of the current year
                        return manuscriptDate >= filterDate && manuscriptDate < startOfYear;
                    } else {
                        return manuscriptDate >= filterDate;
                    }
                }
            );
        }

        setFilteredManuscripts(filtered);
    }, [searchQuery, statusFilter, dateFilter, manuscripts]);


    const getStatusBadgeColor = (status: Manuscript['status']) => {
        const statusColors: Record<Manuscript['status'], string> = {
            Submitted: 'bg-gray-200 text-gray-800',
            'Under Review': 'bg-blue-100 text-blue-800',
            'Revision Required': 'bg-yellow-100 text-yellow-800',
            Accepted: 'bg-green-100 text-green-800',
            Rejected: 'bg-red-100 text-red-800',
        };
        return statusColors[status];
    };

    // Handle authors in different formats (string, array, or null)
    const getAuthors = (authors: string | string[] | null) => {
        if (Array.isArray(authors)) {
            return authors;  // Already an array, return as is
        }
        if (typeof authors === 'string' && authors.trim()) {
            return authors.split(',').map((author) => author.trim()); // Split by comma if it's a string
        }
        return []; // Return empty array if null or empty string
    };

    const destroy = async (id: number) => {
        try {
            await axios.delete(`/manuscripts/${id}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            setFilteredManuscripts((prev) => prev.filter((manuscript) => manuscript.id !== id));

            // Use the 'default' variant or 'destructive' for success or error toasts
            toast.toast({
                title: 'Success',
                description: 'Manuscript deleted successfully.',
                variant: 'default',  // Use 'default' as per the type definition
            });
        } catch (error) {
            console.error('Error deleting manuscript:', error);

            // Use 'destructive' variant for error toast
            toast.toast({
                title: 'Error',
                description: 'Failed to delete the manuscript. Please try again.',
                variant: 'destructive',  // Use 'destructive' for error
            });
        }
        finally {
            setIsDialogOpen(false);
        }
    };

    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Manuscript Tracking
                    </h2>
                }
            >
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">My Manuscripts</CardTitle>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search manuscripts..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="w-48">
                                    <Label htmlFor="status-filter">Status</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger id="status-filter">
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
                                <div className="w-48">
                                    <Label htmlFor="date-filter">Time Period</Label>
                                    <Select value={dateFilter} onValueChange={setDateFilter}>
                                        <SelectTrigger id="date-filter">
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
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left">ID</th>
                                        <th className="px-4 py-3 text-left">Manuscript Title</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Submission Date</th> {/* Updated column name */}
                                        <th className="px-4 py-3 text-left">Authors</th>
                                        <th className="px-4 py-3 text-left">Last Updated</th> {/* Updated column name */}
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredManuscripts.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                                No manuscripts found matching your criteria
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredManuscripts.map((manuscript) => (
                                            <tr key={manuscript.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">{manuscript.id}</td>
                                                <td className="px-4 py-3 font-medium">{manuscript.title}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={`${getStatusBadgeColor(manuscript.status)}`}>
                                                        {manuscript.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">{new Date(manuscript.created_at).toLocaleDateString()}</td> {/* Display created_at */}
                                                <td className="px-4 py-3">
                                                    {getAuthors(manuscript.authors).length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {getAuthors(manuscript.authors).map((author, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {author}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">No co-authors</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        {new Date(manuscript.updated_at).toLocaleDateString()} {/* Display updated_at */}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                Inertia.visit(`/author/manuscripts/${manuscript.id}`);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                Inertia.visit(`/author/manuscripts/${manuscript.id}/edit`);
                                                            }}>
                                                            <Edit2 className="h-4 w-4 text-yellow-600" />
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedManuscript(manuscript);
                                                                setIsDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                {
                    selectedManuscript && (
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Deletion </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this manuscript? <br /> This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                < AlertDialogFooter >
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)
                                    }>
                                        Cancel
                                    </Button>
                                    < Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (selectedManuscript) destroy(selectedManuscript.id);
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
            </AuthenticatedLayout>
        </>
    );
}
