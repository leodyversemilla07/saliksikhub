import { Head, router } from '@inertiajs/react';
import {
    format,
    formatDistanceToNow,
    isToday,
    isYesterday,
    parseISO,
} from 'date-fns';
import {
    Eye,
    UserPlus,
    Trash2,
    Filter,
    Users,
    UserCog,
    Search,
    X,
    MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import BulkDeleteUserDialog from '@/components/bulk-delete-user-dialog';
import DeleteUserDialog from '@/components/delete-user-dialog';
import { Pagination } from '@/components/pagination'; // Reusable Pagination component
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import usersRoutes from '@/routes/users';
import type { User } from '@/types';

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface PaginationData {
    meta: PaginationMeta;
}

const breadcrumbItems = [
    {
        label: 'Dashboard',
        href: dashboard.url(),
    },
    {
        label: 'User Management',
        href: usersRoutes.index.url(),
        current: true,
    },
];

export default function IndexUser({
    users,
    pagination,
}: {
    users: User[];
    pagination: PaginationData;
}) {
    const pageSizeValue =
        typeof pagination?.meta?.per_page === 'number' &&
        pagination.meta.per_page > 0
            ? pagination.meta.per_page
            : 6;
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const initialSearch =
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('search') || ''
            : '';
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteDialogUserId, setDeleteDialogUserId] = useState<number | null>(
        null,
    );

    const filteredUsers: User[] = users;

    const handlePageChange = (page: number) => {
        setIsLoading(true);
        const perPageValue = pageSizeValue === -1 ? 'all' : pageSizeValue;
        const roleValue = selectedRole || 'all';
        router.visit(
            `?page=${page}&per_page=${perPageValue}&role=${roleValue}&search=${encodeURIComponent(searchTerm)}`,
            {
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handlePageSizeChange = (size: number) => {
        setIsLoading(true);
        const perPageValue = size === -1 ? 'all' : size;
        const roleValue = selectedRole || 'all';
        router.visit(
            `?page=1&per_page=${perPageValue}&role=${roleValue}&search=${encodeURIComponent(searchTerm)}`,
            {
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        setIsLoading(true);
        const perPageValue = role === 'all' ? 6 : 'all';
        router.visit(
            `?page=1&per_page=${perPageValue}&role=${role}&search=${encodeURIComponent(searchTerm)}`,
            {
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const perPageValue = pageSizeValue === -1 ? 'all' : pageSizeValue;
        const roleValue = selectedRole || 'all';
        router.visit(
            `?page=1&per_page=${perPageValue}&role=${roleValue}&search=${encodeURIComponent(searchTerm)}`,
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setIsLoading(true);
        const perPageValue = pageSizeValue === -1 ? 'all' : pageSizeValue;
        const roleValue = selectedRole || 'all';
        router.visit(
            `?page=1&per_page=${perPageValue}&role=${roleValue}&search=`,
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleClearFilter = () => {
        setSelectedRole('all');
        setSearchTerm('');
        setIsLoading(true);
        router.visit(`?page=1&per_page=6&role=all&search=`, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((user) => user.id));
        }
    };

    const toggleSelectUser = (userId: number) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleBulkDeleteSuccess = () => {
        setSelectedUsers([]);
    };

    const roleOptions = [
        { value: 'all', label: 'All Roles' },
        { value: 'editor_in_chief', label: 'Editor-in-Chief' },
        { value: 'managing_editor', label: 'Managing Editor' },
        { value: 'associate_editor', label: 'Associate Editor' },
        { value: 'language_editor', label: 'Language Editor' },
        { value: 'author', label: 'Author' },
        { value: 'reviewer', label: 'Reviewer' },
    ];

    const getRoleBadgeVariant = (
        role?: string,
    ): 'default' | 'secondary' | 'destructive' | 'outline' => {
        if (!role) {
            return 'default';
        }

        const variants: Record<
            string,
            'default' | 'secondary' | 'destructive' | 'outline'
        > = {
            editor_in_chief: 'destructive',
            managing_editor: 'secondary',
            associate_editor: 'secondary',
            language_editor: 'secondary',
            reviewer: 'outline',
            author: 'default',
        };

        return variants[role] || 'default';
    };

    const getRoleLabel = (role?: string): string => {
        if (!role) {
            return 'No Role';
        }

        const labels: Record<string, string> = {
            managing_editor: 'Managing Editor',
            author: 'Author',
            editor_in_chief: 'Editor-in-Chief',
            associate_editor: 'Associate Editor',
            language_editor: 'Language Editor',
            reviewer: 'Reviewer',
        };

        return (
            labels[role] ||
            role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        );
    };

    const formatDate = (date?: Date | string) => {
        if (!date) {
            return {
                full: '-',
                short: '-',
                relative: '-',
            };
        }

        const dateObj = typeof date === 'string' ? parseISO(date) : date;

        let relative = '';

        if (isToday(dateObj)) {
            relative = 'Today';
        } else if (isYesterday(dateObj)) {
            relative = 'Yesterday';
        } else {
            relative = formatDistanceToNow(dateObj, { addSuffix: true });
        }

        return {
            full: format(dateObj, 'EEEE, MMMM do, yyyy'),
            short: format(dateObj, 'MMM dd, yyyy'),
            relative: relative,
        };
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="User Management" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            User Management
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage system users, permissions, and access control
                        </p>
                    </div>
                    <Button
                        className="bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                        onClick={() => router.visit(usersRoutes.create.url())}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                <form
                    className="flex flex-row items-center justify-between gap-4"
                    onSubmit={handleSearch}
                >
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Search users by name, username, email, country, or affiliation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 transform p-0"
                                type="button"
                                onClick={handleClearSearch}
                                disabled={isLoading}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={selectedRole}
                            onValueChange={(value) => {
                                if (value !== null) {
                                    handleRoleChange(value);
                                }
                            }}
                        >
                            <SelectTrigger className="w-48">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roleOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={handleClearFilter}
                            disabled={
                                isLoading ||
                                (selectedRole === 'all' && !searchTerm)
                            }
                        >
                            Clear Filter
                        </Button>
                    </div>
                </form>

                {selectedUsers.length > 0 && (
                    <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                                    <span className="text-sm font-semibold text-primary">
                                        {selectedUsers.length}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                    {selectedUsers.length} user
                                    {selectedUsers.length > 1 ? 's' : ''}{' '}
                                    selected
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUsers([])}
                                    className="border-primary/20 text-primary hover:bg-primary/5"
                                >
                                    Clear Selection
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                        setBulkDeleteDialogOpen(true)
                                    }
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Selected
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={
                                                selectedUsers.length > 0 &&
                                                selectedUsers.length ===
                                                    filteredUsers.length
                                            }
                                            onCheckedChange={toggleSelectAll}
                                            aria-label="Select all users"
                                        />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Affiliation</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Updated At</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border bg-card">
                                {isLoading ? (
                                    Array.from({
                                        length:
                                            pageSizeValue === -1
                                                ? 6
                                                : pageSizeValue,
                                    }).map((_, idx) => (
                                        <TableRow key={'skeleton-' + idx}>
                                            <TableCell>
                                                <Skeleton className="h-5 w-5 rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-32" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-40" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-32" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-20" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-20" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-8 w-8 rounded" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => {
                                        const isSelected =
                                            selectedUsers.includes(user.id);
                                        const createdDate = formatDate(
                                            user.created_at,
                                        );
                                        const updatedDate = formatDate(
                                            user.updated_at,
                                        );

                                        return (
                                            <TableRow
                                                key={user.id}
                                                className={cn(
                                                    'transition-all duration-200 hover:bg-muted/50',
                                                    isSelected &&
                                                        'bg-primary/5 dark:bg-primary/10',
                                                )}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() =>
                                                            toggleSelectUser(
                                                                user.id,
                                                            )
                                                        }
                                                        aria-label={`Select ${user.firstname} ${user.lastname}`}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    {user.firstname}{' '}
                                                    {user.lastname}
                                                </TableCell>
                                                <TableCell>
                                                    {user.username || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {user.email || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {user.affiliation || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {user.country || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getRoleBadgeVariant(
                                                            user.role,
                                                        )}
                                                    >
                                                        {getRoleLabel(
                                                            user.role,
                                                        )}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p
                                                            className="text-sm font-medium text-foreground"
                                                            title={
                                                                createdDate.full
                                                            }
                                                        >
                                                            {createdDate.short}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                createdDate.relative
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p
                                                            className="text-sm font-medium text-foreground"
                                                            title={
                                                                updatedDate.full
                                                            }
                                                        >
                                                            {updatedDate.short}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                updatedDate.relative
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            render={
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                />
                                                            }
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48"
                                                        >
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    router.visit(
                                                                        usersRoutes.show.url(
                                                                            {
                                                                                user: user.id,
                                                                            },
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="mr-2 h-4 w-4 text-primary" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    router.visit(
                                                                        usersRoutes.edit.url(
                                                                            {
                                                                                user: user.id,
                                                                            },
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                <UserCog className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                Edit User
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    setDeleteDialogUserId(
                                                                        user.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                                Delete User
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    {deleteDialogUserId ===
                                                        user.id && (
                                                        <DeleteUserDialog
                                                            open={true}
                                                            onOpenChange={(
                                                                open,
                                                            ) => {
                                                                if (!open) {
                                                                    setDeleteDialogUserId(
                                                                        null,
                                                                    );
                                                                }
                                                            }}
                                                            user={user}
                                                            onSuccess={() =>
                                                                setDeleteDialogUserId(
                                                                    null,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={11}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                                    <Users className="h-8 w-8" />
                                                </div>
                                                <div className="space-y-2 text-center">
                                                    <h3 className="text-lg font-semibold text-foreground">
                                                        No users found
                                                    </h3>
                                                    <p className="text-sm">
                                                        {searchTerm ||
                                                        selectedRole
                                                            ? 'Try adjusting your search or filters'
                                                            : 'Get started by adding your first user'}
                                                    </p>
                                                </div>
                                                {!searchTerm &&
                                                    !selectedRole && (
                                                        <Button
                                                            className="mt-4"
                                                            onClick={() =>
                                                                router.visit(
                                                                    usersRoutes.create.url(),
                                                                )
                                                            }
                                                        >
                                                            <UserPlus className="mr-2 h-4 w-4" />
                                                            Add First User
                                                        </Button>
                                                    )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {filteredUsers.length > 0 && (
                    <Pagination
                        meta={pagination.meta}
                        onPageChange={handlePageChange}
                        pageSize={pageSizeValue}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={[6, 12, 24, 48, 96, 'all']}
                        itemsLabel="Users per page"
                        pageLabel={(meta) =>
                            `Page ${meta.current_page} of ${meta.last_page}`
                        }
                        className="w-full"
                    />
                )}

                <BulkDeleteUserDialog
                    open={bulkDeleteDialogOpen}
                    onOpenChange={setBulkDeleteDialogOpen}
                    selectedUsers={selectedUsers}
                    onSuccess={handleBulkDeleteSuccess}
                />
            </div>
        </AppLayout>
    );
}
