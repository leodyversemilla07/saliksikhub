import * as React from "react";
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
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { columns } from "./columns";
import { Manuscript } from "@/types/manuscript";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";

interface DataTableProps {
    data: Manuscript[];
}

export function DataTable({ data }: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
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
    );
}
