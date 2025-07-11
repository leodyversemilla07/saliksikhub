import * as React from "react";
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Plus } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState
} from "@tanstack/react-table";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DeleteDialog } from "./components/delete-dialog";
import { MoreHorizontal, Eye, RefreshCw, CheckCircle, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/status-badge";
import { Manuscript, ManuscriptStatus } from '@/types/manuscript';
import { Pagination } from '@/components/pagination';

export default function Index({ manuscripts }: { manuscripts: Manuscript[] }) {
    const breadcrumbItems = [
        { label: 'Dashboard', href: route('dashboard') },
        { label: 'Manuscripts' }
    ];
    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(6); // Default to 6, matching new options
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    // Filtering logic (title and status)
    const filteredManuscripts = React.useMemo(() => {
        let result = manuscripts;
        const titleFilterObj = columnFilters.find(f => f.id === "title");
        const statusFilterObj = columnFilters.find(f => f.id === "status");
        const titleFilter = typeof titleFilterObj?.value === "string" ? titleFilterObj.value.toLowerCase() : "";
        const statusFilter = typeof statusFilterObj?.value === "string" ? statusFilterObj.value : "";
        if (titleFilter) {
            result = result.filter(m => m.title?.toLowerCase().includes(titleFilter));
        }
        if (statusFilter && statusFilter !== "ALL") {
            result = result.filter(m => m.status === statusFilter);
        }
        return result;
    }, [manuscripts, columnFilters]);

    const totalPages = pageSize === -1 ? 1 : Math.ceil(filteredManuscripts.length / pageSize);
    // Slice manuscripts for current page
    const paginatedManuscripts = pageSize === -1
        ? filteredManuscripts
        : filteredManuscripts.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        );

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when page size changes
    };

    // DataTable logic directly in main component
    const columns: ColumnDef<Manuscript, unknown>[] = [
        {
            accessorKey: "id",
            header: () => (
                <span className="font-bold text-base">ID</span>
            ),
            cell: ({ row }) => <span className="font-mono text-sm text-muted-foreground">{row.original.id}</span>,
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: () => (
                <span className="font-bold text-base">Title</span>
            ),
            cell: ({ row }) => (
                <div className="max-w-md truncate" title={row.original.title}>
                    <div className="font-semibold text-foreground">{row.original.title}</div>
                </div>
            ),
        },
        {
            accessorKey: "authors",
            header: () => (
                <span className="font-bold text-base">Authors</span>
            ),
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground truncate" title={Array.isArray(row.original.authors) ? row.original.authors.join(", ") : row.original.authors}>
                    {Array.isArray(row.original.authors)
                        ? row.original.authors.join(", ")
                        : row.original.authors}
                </span>
            ),
        },
        {
            accessorKey: "keywords",
            header: () => (
                <span className="font-bold text-base">Keywords</span>
            ),
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground truncate" title={Array.isArray(row.original.keywords) ? row.original.keywords.join(", ") : row.original.keywords}>
                    {Array.isArray(row.original.keywords)
                        ? row.original.keywords.join(", ")
                        : row.original.keywords}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: () => (
                <span className="font-bold text-base">Status</span>
            ),
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
            accessorKey: "created_at",
            header: () => (
                <span className="font-bold text-base">Created</span>
            ),
            cell: ({ row }) => <span>{new Date(row.original.created_at).toLocaleDateString()}</span>,
        },
        {
            id: "actions",
            cell: ({ row, table }) => {
                const manuscript = row.original;
                const meta = table.options.meta as { onDeleteClick?: (m: Manuscript) => void } | undefined;
                const onDeleteClick = meta?.onDeleteClick;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-accent focus:ring-2 focus:ring-primary"
                                aria-label={`Open actions menu for manuscript ${manuscript.title}`}
                                tabIndex={0}
                            >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" aria-label="Manuscript actions">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => window.location.href = route('manuscripts.show', { id: manuscript.id })}
                                aria-label={`View manuscript ${manuscript.title}`}
                                tabIndex={0}
                            >
                                <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            {(manuscript.status === ManuscriptStatus.MINOR_REVISION || manuscript.status === ManuscriptStatus.MAJOR_REVISION) && (
                                <DropdownMenuItem
                                    onClick={() => window.location.href = route('manuscripts.revision.form', { id: manuscript.id })}
                                    aria-label={`Submit revision for manuscript ${manuscript.title}`}
                                    tabIndex={0}
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" /> Submit Revision
                                </DropdownMenuItem>
                            )}
                            {manuscript.status === ManuscriptStatus.AWAITING_AUTHOR_APPROVAL && (
                                <DropdownMenuItem
                                    onClick={() => window.location.href = route('manuscripts.approve', { manuscript: manuscript.id })}
                                    aria-label={`Approve manuscript ${manuscript.title}`}
                                    tabIndex={0}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDeleteClick && onDeleteClick(manuscript)}
                                aria-label={`Delete manuscript ${manuscript.title}`}
                                tabIndex={0}
                            >
                                <Trash2 className="h-4 w-4 mr-2 text-red-500" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];

    const [sorting, setSorting] = React.useState<SortingState>([]);
    // columnFilters state is already declared above, so remove this duplicate
    const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedManuscript, setSelectedManuscript] = React.useState<Manuscript | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [toast, setToast] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleDeleteClick = (manuscript: Manuscript) => {
        setSelectedManuscript(manuscript);
        setDeleteDialogOpen(true);
    };
    const handleDelete = () => {
        setDeleteDialogOpen(false);
        if (selectedManuscript) {
            setLoading(true);
            router.delete(route('manuscripts.destroy', { id: selectedManuscript.id }), {
                onSuccess: () => {
                    setLoading(false);
                    setToast({ type: 'success', message: 'Manuscript deleted successfully.' });
                },
                onError: () => {
                    setLoading(false);
                    setToast({ type: 'error', message: 'Failed to delete manuscript.' });
                }
            });
        }
    };

    const table = useReactTable({
        data: paginatedManuscripts,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // getFilteredRowModel is not needed since we filter manually above
        meta: {
            onDeleteClick: handleDeleteClick,
        },
    });

    const statusOptions = Object.entries(ManuscriptStatus).map(([key, label]) => ({ key, label }));

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Manuscripts" />
            <div className="space-y-6 bg-background text-foreground">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold">Manuscripts</h1>
                        <p className="text-muted-foreground">Browse, search, and manage all submitted manuscripts in the system.</p>
                    </div>
                    <Button
                        asChild
                        variant="default"
                        className="rounded-lg shadow-md self-start md:self-auto"
                    >
                        <Link href={route('manuscripts.create')}>
                            <Plus className="h-5 w-5 mr-1" />
                            <span>New Manuscript</span>
                        </Link>
                    </Button>
                </div>

                {/* DataTable directly here */}
                <div className="flex flex-col md:flex-row items-center py-4 gap-4">
                    <div className="relative max-w-sm w-full">
                        <Input
                            placeholder="Search title..."
                            value={String(columnFilters.find(f => f.id === "title")?.value ?? "")}
                            onChange={event => {
                                const value = event.target.value;
                                setColumnFilters(filters => {
                                    const other = filters.filter(f => f.id !== "title");
                                    return value ? [...other, { id: "title", value }] : other;
                                });
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-10"
                            aria-label="Search manuscripts by title"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </span>
                        {(() => {
                            const titleFilterObj = columnFilters.find(f => f.id === "title");
                            if (typeof titleFilterObj?.value === "string" && titleFilterObj.value.length > 0) {
                                return (
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        aria-label="Clear search"
                                        onClick={() => {
                                            setColumnFilters(filters => filters.filter(f => f.id !== "title"));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                );
                            }
                            return null;
                        })()}
                    </div>
                    <div className="w-full max-w-xs">
                        <Select
                            value={String(columnFilters.find(f => f.id === "status")?.value ?? "")}
                            onValueChange={value => {
                                setColumnFilters(filters => {
                                    const other = filters.filter(f => f.id !== "status");
                                    return value ? [...other, { id: "status", value }] : other;
                                });
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[120px]" aria-label="Filter by status">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className="w-[120px]">
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                {statusOptions.map(opt => (
                                    <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="rounded-md border overflow-x-auto relative">
                    {loading && (
                        <div className="absolute inset-0 bg-background bg-opacity-60 flex items-center justify-center z-20">
                            <div className="w-full">
                                <table className="min-w-full">
                                    <thead className="sticky top-0 z-20 bg-background shadow-sm">
                                        <tr>
                                            {columns.map((col, idx) => (
                                                <th key={col.id || idx} className="px-4 py-3 text-left font-bold text-base bg-background">
                                                    {typeof col.header === 'string' ? col.header : (col.id || `Column ${idx + 1}`)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(5)].map((_, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-muted/40' : 'bg-background'}>
                                                {columns.map((col, idx) => (
                                                    <td key={col.id || idx} className="px-4 py-3">
                                                        <div className="animate-pulse h-4 bg-muted rounded w-3/4 mx-auto" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <Table className="min-w-full">
                        <TableHeader className="sticky top-0 z-20 bg-background shadow-sm">
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id} className="px-4 py-3 text-left font-bold text-base bg-background">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row, idx) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={
                                            `${idx % 2 === 0 ? 'bg-muted/40' : 'bg-background'} hover:bg-accent transition-colors duration-150 focus-within:ring-2 focus-within:ring-primary`}
                                        tabIndex={0}
                                        aria-label={`Row for manuscript ${row.original.title}`}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id} className="px-4 py-3" tabIndex={0} aria-label={`Cell for ${cell.column.id} of manuscript ${row.original.title}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-64 text-center flex flex-col items-center justify-center gap-3" aria-label="No manuscripts found">
                                        <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 64 64" className="mx-auto text-muted-foreground mb-3">
                                            <rect x="8" y="18" width="48" height="32" rx="4" fill="#f3f4f6" stroke="#d1d5db" />
                                            <path d="M24 18V12a8 8 0 0 1 16 0v6" stroke="#d1d5db" />
                                            <circle cx="32" cy="34" r="8" fill="#e5e7eb" stroke="#d1d5db" />
                                            <path d="M32 30v8M28 34h8" stroke="#9ca3af" />
                                        </svg>
                                        <span className="text-xl font-bold text-muted-foreground">No manuscripts found</span>
                                        <span className="text-base text-muted-foreground">You haven’t added any manuscripts yet.</span>
                                        <Button
                                            asChild
                                            variant="default"
                                            className="mt-2 rounded-lg shadow-md"
                                            aria-label="Create new manuscript"
                                        >
                                            <Link href={route('manuscripts.create')}>
                                                <Plus className="h-5 w-5 mr-1" />
                                                <span>Create Manuscript</span>
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {toast && (
                        <div
                            className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border-2 ${toast.type === 'success' ? 'bg-green-600 border-green-700 text-white' : 'bg-red-600 border-red-700 text-white'}`}
                            role="alert"
                            aria-live="assertive"
                            tabIndex={0}
                            aria-label={toast.type === 'success' ? 'Success notification' : 'Error notification'}
                        >
                            <span className="flex items-center justify-center rounded-full bg-white/20 p-2">
                                {toast.type === 'success' ? (
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                                )}
                            </span>
                            <span className="font-semibold text-base" id="toast-message">{toast.message}</span>
                            <button className="ml-2 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded-full px-2 py-1" onClick={() => setToast(null)} aria-label="Close notification" tabIndex={0}>&times;</button>
                        </div>
                    )}
                </div>
                <DeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    manuscriptTitle={selectedManuscript?.title || ''}
                    onDelete={handleDelete}
                />

                <div className="pt-4 w-full">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 w-full">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={page => {
                                if (page >= 1 && page <= totalPages) setCurrentPage(page);
                            }}
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSizeChange}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/30 shadow-sm"
                            aria-label="Manuscripts pagination"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
