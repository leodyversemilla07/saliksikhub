import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, RefreshCw, CheckCircle, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/status-badge";
import { Manuscript, ManuscriptStatus } from '@/types/manuscript';
import * as React from "react";

export const columns: ColumnDef<Manuscript>[] = [
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
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>ID</Button>
        ),
        cell: ({ row }) => <span className="font-mono text-sm text-muted-foreground">#{row.original.id}</span>,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Title</Button>
        ),
        cell: ({ row }) => (
            <div className="max-w-md">
                <div className="font-semibold text-foreground">{row.original.title}</div>
            </div>
        ),
    },
    {
        accessorKey: "authors",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Authors</Button>
        ),
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground truncate">
                {Array.isArray(row.original.authors)
                    ? row.original.authors.join(", ")
                    : row.original.authors}
            </span>
        ),
    },
    {
        accessorKey: "keywords",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Keywords</Button>
        ),
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground truncate">
                {Array.isArray(row.original.keywords)
                    ? row.original.keywords.join(", ")
                    : row.original.keywords}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Status</Button>
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Created</Button>
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
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => window.location.href = route('manuscripts.show', { id: manuscript.id })}>
                            <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        {(manuscript.status === ManuscriptStatus.MINOR_REVISION || manuscript.status === ManuscriptStatus.MAJOR_REVISION) && (
                            <DropdownMenuItem onClick={() => window.location.href = route('manuscripts.revision.form', { id: manuscript.id })}>
                                <RefreshCw className="h-4 w-4 mr-2" /> Submit Revision
                            </DropdownMenuItem>
                        )}
                        {manuscript.status === ManuscriptStatus.AWAITING_AUTHOR_APPROVAL && (
                            <DropdownMenuItem onClick={() => window.location.href = route('manuscripts.approve', { manuscript: manuscript.id })}>
                                <CheckCircle className="h-4 w-4 mr-2" /> Approve
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeleteClick && onDeleteClick(manuscript)}>
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
