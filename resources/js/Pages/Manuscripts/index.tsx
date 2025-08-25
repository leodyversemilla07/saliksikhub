import * as React from "react";
import { Head, Link } from '@inertiajs/react';
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import AppLayout from '@/layouts/app-layout';
import { Plus, MoreHorizontal, Eye, RefreshCw, CheckCircle, Trash2 } from "lucide-react";
import { Manuscript, ManuscriptStatus } from "@/types/manuscript";

export default function Index({ manuscripts }: { manuscripts: Manuscript[] }) {
    // Helper functions
    const getStatusBadgeVariant = (status: ManuscriptStatus): "default" | "secondary" | "destructive" | "outline" => {
        const variants: Record<ManuscriptStatus, "default" | "secondary" | "destructive" | "outline"> = {
            [ManuscriptStatus.UNDER_REVIEW]: "secondary",
            [ManuscriptStatus.ACCEPTED]: "default",
            [ManuscriptStatus.MINOR_REVISION]: "outline",
            [ManuscriptStatus.MAJOR_REVISION]: "destructive",
            [ManuscriptStatus.AWAITING_AUTHOR_APPROVAL]: "secondary",
            [ManuscriptStatus.REJECTED]: "destructive",
            [ManuscriptStatus.SUBMITTED]: "default",
            [ManuscriptStatus.IN_COPYEDITING]: "default",
            [ManuscriptStatus.READY_FOR_PUBLICATION]: "default",
            [ManuscriptStatus.PUBLISHED]: "default",
        };
        return variants[status] || "default";
    };

    const getStatusLabel = (status: ManuscriptStatus): string => {
        const labels: Record<ManuscriptStatus, string> = {
            [ManuscriptStatus.SUBMITTED]: "Submitted",
            [ManuscriptStatus.UNDER_REVIEW]: "Under Review",
            [ManuscriptStatus.MINOR_REVISION]: "Minor Revision",
            [ManuscriptStatus.MAJOR_REVISION]: "Major Revision",
            [ManuscriptStatus.ACCEPTED]: "Accepted",
            [ManuscriptStatus.IN_COPYEDITING]: "Copyediting",
            [ManuscriptStatus.AWAITING_AUTHOR_APPROVAL]: "Awaiting Approval",
            [ManuscriptStatus.READY_FOR_PUBLICATION]: "Ready to Publish",
            [ManuscriptStatus.REJECTED]: "Rejected",
            [ManuscriptStatus.PUBLISHED]: "Published",
        };
        return labels[status] || status;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let relative = "";
        if (diffDays === 1) {
            relative = "Today";
        } else if (diffDays === 2) {
            relative = "Yesterday";
        } else if (diffDays < 7) {
            relative = `${diffDays - 1} days ago`;
        } else {
            relative = `${Math.floor((diffDays - 1) / 7)} weeks ago`;
        }

        return {
            short: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            relative: relative,
        };
    };

    // Column definitions
    const columns: ColumnDef<Manuscript>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <code className="text-sm font-mono px-2 py-1 rounded bg-muted text-muted-foreground">
                    {row.original.id}
                </code>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="max-w-md">
                    <p className="font-semibold line-clamp-2 leading-tight text-foreground">
                        {row.original.title}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "authors",
            header: "Authors",
            cell: ({ row }) => (
                <div className="space-y-1">
                    <p className="text-sm line-clamp-2 text-muted-foreground">
                        {Array.isArray(row.original.authors)
                            ? row.original.authors.join(", ")
                            : (row.original.authors || "")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {Array.isArray(row.original.authors)
                            ? `${row.original.authors.length} author${row.original.authors.length !== 1 ? "s" : ""}`
                            : ""}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "keywords",
            header: "Keywords",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {Array.isArray(row.original.keywords)
                        ? row.original.keywords.slice(0, 2).map((keyword: string, idx: number) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-muted text-muted-foreground"
                            >
                                {keyword}
                            </Badge>
                        ))
                        : (row.original.keywords ? <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">{row.original.keywords}</Badge> : null)
                    }
                    {Array.isArray(row.original.keywords) && row.original.keywords.length > 2 && (
                        <Badge
                            variant="outline"
                            className="text-xs bg-muted text-muted-foreground"
                        >
                            +{row.original.keywords.length - 2}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={getStatusBadgeVariant(row.original.status)}
                    className="font-medium bg-primary text-primary-foreground"
                >
                    {getStatusLabel(row.original.status)}
                </Badge>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Created",
            cell: ({ row }) => {
                const createdDate = formatDate(row.original.created_at);
                return (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{createdDate.short}</p>
                        <p className="text-xs text-muted-foreground">{createdDate.relative}</p>
                    </div>
                );
            },
        },
        {
            accessorKey: "updated_at",
            header: "Updated",
            cell: ({ row }) => {
                const updatedDate = row.original.updated_at
                    ? formatDate(row.original.updated_at)
                    : { short: "-", relative: "-" };
                return (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{updatedDate.short}</p>
                        <p className="text-xs text-muted-foreground">{updatedDate.relative}</p>
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const manuscript = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = route('manuscripts.show', { id: manuscript.id })}>
                                <Eye className="w-4 h-4 mr-2 text-primary" />
                                View Details
                            </DropdownMenuItem>
                            {(manuscript.status === ManuscriptStatus.MINOR_REVISION || manuscript.status === ManuscriptStatus.MAJOR_REVISION) && (
                                <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = route('manuscripts.revision.form', { id: manuscript.id })}>
                                    <RefreshCw className="w-4 h-4 mr-2 text-muted-foreground" />
                                    Submit Revision
                                </DropdownMenuItem>
                            )}
                            {manuscript.status === ManuscriptStatus.AWAITING_AUTHOR_APPROVAL && (
                                <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = route('manuscripts.approve', { manuscript: manuscript.id })}>
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    Approve
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => window.location.href = route('manuscripts.destroy', { id: manuscript.id })}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];

    // Table state
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: manuscripts,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <AppLayout breadcrumbItems={[{ label: 'Dashboard', href: route('dashboard') }, { label: 'Manuscripts', href: route('manuscripts.index') }]}>
            <Head title="Manuscripts" />
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Manuscripts</h1>
                        <p className="text-muted-foreground mt-1">
                            Browse, search, and manage all submitted manuscripts in the system
                        </p>
                    </div>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                        asChild
                    >
                        <Link href={route('manuscripts.create')}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Manuscript
                        </Link>
                    </Button>
                </div>

                {/* Main Content Table */}
                <div className="overflow-hidden rounded-lg bg-card shadow-lg">
                    <div className="overflow-x-auto">
                        {/* DataTable Content */}
                        <div>
                            {/* Filtering and column visibility controls */}
                            <div className="flex items-center py-4 gap-2">
                                <Input
                                    placeholder="Search manuscripts..."
                                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                                    onChange={event => table.getColumn("title")?.setFilterValue(event.target.value)}
                                    className="max-w-sm"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="ml-auto">Columns</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {table.getAllColumns()
                                            .filter(column => column.getCanHide())
                                            .map(column => (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={value => column.toggleVisibility(!!value)}
                                                >
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Table */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.length ? (
                                            table.getRowModel().rows.map(row => (
                                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                                    {row.getVisibleCells().map(cell => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    No results.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination controls */}
                            <div className="flex w-full justify-between items-center px-2 py-4">
                                <div className="text-muted-foreground text-sm">
                                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                                </div>
                                <div className="flex justify-end">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); table.previousPage(); }}
                                                    aria-disabled={!table.getCanPreviousPage()}
                                                    tabIndex={!table.getCanPreviousPage() ? -1 : 0}
                                                    style={!table.getCanPreviousPage() ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                                />
                                            </PaginationItem>
                                            {/* Page numbers with ellipsis for large page counts */}
                                            {(() => {
                                                const pageCount = table.getPageCount();
                                                const current = table.getState().pagination?.pageIndex ?? 0;
                                                const items = [];
                                                // Always show first page
                                                items.push(
                                                    <PaginationItem key={0}>
                                                        <PaginationLink
                                                            isActive={current === 0}
                                                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); table.setPageIndex(0); }}
                                                        >
                                                            1
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                                // Show ellipsis if current > 3
                                                if (current > 3) {
                                                    items.push(<PaginationEllipsis key="start-ellipsis" />);
                                                }
                                                // Show up to two pages before current
                                                for (let i = Math.max(1, current - 2); i < current; i++) {
                                                    items.push(
                                                        <PaginationItem key={i}>
                                                            <PaginationLink
                                                                isActive={false}
                                                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); table.setPageIndex(i); }}
                                                            >
                                                                {i + 1}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                }
                                                // Show current page (if not first/last)
                                                if (current !== 0 && current !== pageCount - 1) {
                                                    items.push(
                                                        <PaginationItem key={current}>
                                                            <PaginationLink
                                                                isActive={true}
                                                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); table.setPageIndex(current); }}
                                                            >
                                                                {current + 1}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                }
                                                // Show up to two pages after current
                                                for (let i = current + 1; i < Math.min(pageCount - 1, current + 3); i++) {
                                                    items.push(
                                                        <PaginationItem key={i}>
                                                            <PaginationLink
                                                                isActive={false}
                                                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); table.setPageIndex(i); }}
                                                            >
                                                                {i + 1}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                }
                                                // Show ellipsis if current < pageCount - 4
                                                if (current < pageCount - 4) {
                                                    items.push(<PaginationEllipsis key="end-ellipsis" />);
                                                }
                                                // Always show last page if more than one page
                                                if (pageCount > 1) {
                                                    items.push(
                                                        <PaginationItem key={pageCount - 1}>
                                                            <PaginationLink
                                                                isActive={current === pageCount - 1}
                                                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); table.setPageIndex(pageCount - 1); }}
                                                            >
                                                                {pageCount}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                }
                                                return items;
                                            })()}
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); table.nextPage(); }}
                                                    aria-disabled={!table.getCanNextPage()}
                                                    tabIndex={!table.getCanNextPage() ? -1 : 0}
                                                    style={!table.getCanNextPage() ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}