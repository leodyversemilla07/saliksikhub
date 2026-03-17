import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    Plus,
    Pencil,
    Trash2,
    ToggleLeft,
    ToggleRight,
    ChevronLeft,
    ChevronRight,
    Search,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface JournalUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    affiliation: string | null;
    avatar: string | null;
    created_at: string;
    pivot: {
        id: number;
        role: string;
        is_active: boolean;
        assigned_at: string | null;
    };
}

interface PaginatedJournalUsers {
    data: JournalUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    journalUsers: PaginatedJournalUsers;
    roles: Record<string, string>;
    filters: {
        search: string | null;
        role: string | null;
        status: string | null;
    };
}

const roleVariants: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    managing_editor: 'default',
    editor_in_chief: 'default',
    associate_editor: 'secondary',
    language_editor: 'secondary',
    reviewer: 'outline',
    author: 'outline',
};

export default function JournalUsersIndex({
    journalUsers,
    roles,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleFilter: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            '/admin/journal-users',
            {
                search: search || undefined,
                role: roleFilter !== 'all' ? roleFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (user: JournalUser) => {
        router.delete(`/admin/journal-users/${user.pivot.id}`, {
            preserveScroll: true,
        });
    };

    const handleToggleStatus = (user: JournalUser) => {
        router.post(
            `/admin/journal-users/${user.pivot.id}/toggle-status`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin/journal-users' },
        { label: 'Journal Users' },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) {
return '-';
}

        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Journal Users" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Journal Users
                        </h1>
                        <p className="text-muted-foreground">
                            Manage user assignments and roles for the current
                            journal
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/journal-users/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Assign User
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form
                            onSubmit={handleFilter}
                            className="flex flex-col gap-4 sm:flex-row"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or affiliation..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={roleFilter}
                                onValueChange={setRoleFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Roles
                                    </SelectItem>
                                    {Object.entries(roles).map(
                                        ([value, label]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" variant="secondary">
                                <Search className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Assigned Users
                            <Badge variant="secondary" className="ml-2">
                                {journalUsers.total}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {journalUsers.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-medium">
                                    No users assigned
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Get started by assigning users to this
                                    journal.
                                </p>
                                <Button asChild>
                                    <Link href="/admin/journal-users/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Assign User
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Journal Role</TableHead>
                                            <TableHead>System Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Assigned</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {journalUsers.data.map((user) => (
                                            <TableRow
                                                key={`${user.id}-${user.pivot.id}`}
                                            >
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {user.firstname}{' '}
                                                        {user.lastname}
                                                    </span>
                                                    {user.affiliation && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {user.affiliation}
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm">
                                                        {user.email}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            roleVariants[
                                                                user.pivot.role
                                                            ] || 'secondary'
                                                        }
                                                    >
                                                        {roles[
                                                            user.pivot.role
                                                        ] || user.pivot.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">
                                                        {user.role || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {user.pivot.is_active ? (
                                                        <Badge variant="default">
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm">
                                                        {formatDate(
                                                            user.pivot
                                                                .assigned_at,
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={
                                                                user.pivot
                                                                    .is_active
                                                                    ? 'Deactivate'
                                                                    : 'Activate'
                                                            }
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            {user.pivot
                                                                .is_active ? (
                                                                <ToggleRight className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/journal-users/${user.pivot.id}/edit`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Remove
                                                                        User
                                                                        from
                                                                        Journal
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        remove{' '}
                                                                        {
                                                                            user.firstname
                                                                        }{' '}
                                                                        {
                                                                            user.lastname
                                                                        }
                                                                        &apos;s
                                                                        &quot;
                                                                        {roles[
                                                                            user
                                                                                .pivot
                                                                                .role
                                                                        ] ||
                                                                            user
                                                                                .pivot
                                                                                .role}
                                                                        &quot;
                                                                        role
                                                                        from
                                                                        this
                                                                        journal?
                                                                        This
                                                                        will not
                                                                        delete
                                                                        the user
                                                                        account.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                user,
                                                                            )
                                                                        }
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    >
                                                                        Remove
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {journalUsers.last_page > 1 && (
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                Page {journalUsers.current_page}{' '}
                                                of {journalUsers.last_page}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {journalUsers.links.map(
                                                    (link, index) => {
                                                        if (index === 0) {
                                                            return (
                                                                <Button
                                                                    key="prev"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    disabled={
                                                                        !link.url
                                                                    }
                                                                    asChild={
                                                                        !!link.url
                                                                    }
                                                                >
                                                                    {link.url ? (
                                                                        <Link
                                                                            href={
                                                                                link.url
                                                                            }
                                                                            preserveScroll
                                                                        >
                                                                            <ChevronLeft className="h-4 w-4" />
                                                                        </Link>
                                                                    ) : (
                                                                        <span>
                                                                            <ChevronLeft className="h-4 w-4" />
                                                                        </span>
                                                                    )}
                                                                </Button>
                                                            );
                                                        }

                                                        if (
                                                            index ===
                                                            journalUsers.links
                                                                .length -
                                                                1
                                                        ) {
                                                            return (
                                                                <Button
                                                                    key="next"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    disabled={
                                                                        !link.url
                                                                    }
                                                                    asChild={
                                                                        !!link.url
                                                                    }
                                                                >
                                                                    {link.url ? (
                                                                        <Link
                                                                            href={
                                                                                link.url
                                                                            }
                                                                            preserveScroll
                                                                        >
                                                                            <ChevronRight className="h-4 w-4" />
                                                                        </Link>
                                                                    ) : (
                                                                        <span>
                                                                            <ChevronRight className="h-4 w-4" />
                                                                        </span>
                                                                    )}
                                                                </Button>
                                                            );
                                                        }

                                                        return null;
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
