import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, RefreshCw, CheckCircle, Trash2 } from "lucide-react";

import { Manuscript, ManuscriptStatus } from "@/types/manuscript";

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
