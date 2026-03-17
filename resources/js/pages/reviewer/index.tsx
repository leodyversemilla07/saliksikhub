import { Head, Link, router } from '@inertiajs/react';
import type {
    ColumnFiltersState,
    SortingState,
    ColumnDef} from '@tanstack/react-table';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender
} from '@tanstack/react-table';
import {
    Eye,
    MoreHorizontal,
    Search,
    Filter,
    Calendar,
    Users,
    FileText,
    Clock,
} from 'lucide-react';
import * as React from 'react';
import { Pagination as ShadcnPagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
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
import AppLayout from '@/layouts/app-layout';
import reviewer from '@/routes/reviewer';
import type { Manuscript } from '@/types';

interface PaginatedManuscripts {
    data: Manuscript[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Filters {
    status: string;
    search: string;
    per_page: string;
}

const breadcrumbItems = [
    {
        label: 'Manuscripts for Review',
        href: '#',
    },
];

export default function Index({
    manuscripts,
    filters,
}: {
    manuscripts: PaginatedManuscripts;
    filters: Filters;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState(
        filters.search || '',
    );
    const [statusFilter, setStatusFilter] = React.useState<string>(
        filters.status || 'all',
    );

    // Debounced search to avoid too many requests
    const [debouncedSearch, setDebouncedSearch] = React.useState(
        filters.search || '',
    );

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(globalFilter);
        }, 300);

        return () => clearTimeout(timer);
    }, [globalFilter]);

    React.useEffect(() => {
        if (
            debouncedSearch !== filters.search ||
            statusFilter !== filters.status
        ) {
            router.visit(reviewer.manuscripts.index.url(), {
                data: {
                    search: debouncedSearch,
                    status: statusFilter,
                    per_page: filters.per_page,
                },
                preserveState: true,
                preserveScroll: true,
            });
        }
    }, [
        debouncedSearch,
        statusFilter,
        filters.search,
        filters.status,
        filters.per_page,
    ]);

    const columns: ColumnDef<Manuscript>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                        Title
                        <FileText className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="max-w-xs">
                    <div
                        className="truncate font-medium"
                        title={row.getValue('title')}
                    >
                        {row.getValue('title')}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'authors',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                        Authors
                        <Users className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div
                    className="max-w-xs truncate text-muted-foreground"
                    title={row.getValue('authors')}
                >
                    {row.getValue('authors')}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                        Status
                        <Clock className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const getStatusVariant = (status: string) => {
                    switch (status) {
                        case 'submitted':
                            return 'secondary';
                        case 'under_review':
                            return 'default';
                        case 'needs_revision':
                            return 'destructive';
                        case 'accepted':
                            return 'default';
                        case 'rejected':
                            return 'destructive';
                        case 'published':
                            return 'default';
                        default:
                            return 'secondary';
                    }
                };

                return (
                    <Badge
                        variant={getStatusVariant(status)}
                        className="capitalize"
                    >
                        {status.replace('_', ' ')}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                        Submitted
                        <Calendar className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue('created_at'));

                return (
                    <div className="text-sm text-muted-foreground">
                        {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                );
            },
        },
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const manuscript = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={reviewer.manuscripts.show.url({
                                        id: manuscript.id,
                                    })}
                                    prefetch="hover"
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: manuscripts.data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        state: {
            sorting,
            columnFilters,
            rowSelection,
            globalFilter,
        },
    });

    const handlePageChange = (page: number) => {
        router.visit(reviewer.manuscripts.index.url(), {
            data: {
                page,
                search: debouncedSearch,
                status: statusFilter,
                per_page: filters.per_page,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageSizeChange = (size: number) => {
        router.visit(reviewer.manuscripts.index.url(), {
            data: {
                search: debouncedSearch,
                status: statusFilter,
                per_page: size === -1 ? 'all' : size.toString(),
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const paginationMeta = {
        current_page: manuscripts.current_page,
        last_page: manuscripts.last_page,
        per_page: manuscripts.per_page,
        total: manuscripts.total,
        from: manuscripts.from,
        to: manuscripts.to,
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Manuscripts for Review" />
            <div className="flex flex-col space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Manuscripts for Review
                        </h1>
                        <p className="text-muted-foreground">
                            Review manuscripts assigned to you (
                            {manuscripts.total} total)
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters & Search
                        </CardTitle>
                        <CardDescription>
                            Filter manuscripts by status and search by title or
                            authors
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        placeholder="Search manuscripts..."
                                        value={globalFilter ?? ''}
                                        onChange={(event) =>
                                            setGlobalFilter(event.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="submitted">
                                        Submitted
                                    </SelectItem>
                                    <SelectItem value="under_review">
                                        Under Review
                                    </SelectItem>
                                    <SelectItem value="needs_revision">
                                        Needs Revision
                                    </SelectItem>
                                    <SelectItem value="accepted">
                                        Accepted
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                    <SelectItem value="published">
                                        Published
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                        className={`transition-colors hover:bg-muted/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'} `}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-3"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <FileText className="h-8 w-8 text-muted-foreground" />
                                            <div className="text-muted-foreground">
                                                No manuscripts found for review.
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <ShadcnPagination
                    meta={paginationMeta}
                    onPageChange={handlePageChange}
                    pageSize={manuscripts.per_page}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={[6, 12, 24, 48, 96, 'all']}
                    itemsLabel="Manuscripts per page"
                    pageLabel={(meta) =>
                        `Showing ${meta.from || 0} to ${meta.to || 0} of ${meta.total} manuscripts`
                    }
                />
            </div>
        </AppLayout>
    );
}
