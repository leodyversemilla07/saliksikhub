import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Search,
    UserPlus,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
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

interface AvailableUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    affiliation: string | null;
}

interface PaginatedUsers {
    data: AvailableUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    availableUsers: PaginatedUsers;
    roles: Record<string, string>;
    filters: {
        search: string | null;
    };
}

export default function CreateJournalUser({
    availableUsers,
    roles,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedUser, setSelectedUser] = useState<AvailableUser | null>(
        null,
    );

    const { data, setData, post, processing, errors } = useForm({
        user_id: 0,
        role: '',
    });

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin/journal-users' },
        { label: 'Journal Users', href: '/admin/journal-users' },
        { label: 'Assign User' },
    ];

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            '/admin/journal-users/create',
            {
                search: search || undefined,
            },
            { preserveState: true },
        );
    };

    const handleSelectUser = (user: AvailableUser) => {
        setSelectedUser(user);
        setData('user_id', user.id);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/journal-users');
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Assign User to Journal" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        render={<Link href="/admin/journal-users" />}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Assign User to Journal
                        </h1>
                        <p className="text-muted-foreground">
                            Search for an existing user and assign them a role
                            in this journal
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* User Search */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Find User</CardTitle>
                                <CardDescription>
                                    Search for users who are not yet assigned to
                                    this journal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex gap-4"
                                >
                                    <div className="relative flex-1">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name or email..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="pl-9"
                                        />
                                    </div>
                                    <Button type="submit" variant="secondary">
                                        Search
                                    </Button>
                                </form>

                                {availableUsers.data.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <UserPlus className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {filters.search
                                                ? 'No unassigned users found matching your search.'
                                                : 'All users are already assigned to this journal.'}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>
                                                        System Role
                                                    </TableHead>
                                                    <TableHead>
                                                        Affiliation
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Action
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {availableUsers.data.map(
                                                    (user) => (
                                                        <TableRow
                                                            key={user.id}
                                                            className={
                                                                selectedUser?.id ===
                                                                user.id
                                                                    ? 'bg-muted/50'
                                                                    : ''
                                                            }
                                                        >
                                                            <TableCell>
                                                                <span className="font-medium">
                                                                    {
                                                                        user.firstname
                                                                    }{' '}
                                                                    {
                                                                        user.lastname
                                                                    }
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm">
                                                                    {user.email}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {user.role ||
                                                                        '-'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {user.affiliation ||
                                                                        '-'}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    size="sm"
                                                                    variant={
                                                                        selectedUser?.id ===
                                                                        user.id
                                                                            ? 'default'
                                                                            : 'outline'
                                                                    }
                                                                    onClick={() =>
                                                                        handleSelectUser(
                                                                            user,
                                                                        )
                                                                    }
                                                                >
                                                                    {selectedUser?.id ===
                                                                    user.id
                                                                        ? 'Selected'
                                                                        : 'Select'}
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                        {availableUsers.last_page > 1 && (
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-muted-foreground">
                                                        Page{' '}
                                                        {
                                                            availableUsers.current_page
                                                        }{' '}
                                                        of{' '}
                                                        {
                                                            availableUsers.last_page
                                                        }
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        {availableUsers.links.map(
                                                            (link, index) => {
                                                                if (
                                                                    index === 0
                                                                ) {
                                                                    return (
                                                                        <Button
                                                                            key="prev"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            disabled={
                                                                                !link.url
                                                                            }
                                                                            render={
                                                                                link.url ? (
                                                                                    <Link
                                                                                        href={
                                                                                            link.url
                                                                                        }
                                                                                        preserveScroll
                                                                                    />
                                                                                ) : undefined
                                                                            }
                                                                        >
                                                                            <ChevronLeft className="h-4 w-4" />
                                                                        </Button>
                                                                    );
                                                                }

                                                                if (
                                                                    index ===
                                                                    availableUsers
                                                                        .links
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
                                                                            render={
                                                                                link.url ? (
                                                                                    <Link
                                                                                        href={
                                                                                            link.url
                                                                                        }
                                                                                        preserveScroll
                                                                                    />
                                                                                ) : undefined
                                                                            }
                                                                        >
                                                                            <ChevronRight className="h-4 w-4" />
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

                    {/* Assignment Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Assignment Details</CardTitle>
                                <CardDescription>
                                    Select a user and choose a journal role
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    {selectedUser ? (
                                        <div className="space-y-1 rounded-lg border p-4">
                                            <p className="font-medium">
                                                {selectedUser.firstname}{' '}
                                                {selectedUser.lastname}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedUser.email}
                                            </p>
                                            {selectedUser.affiliation && (
                                                <p className="text-xs text-muted-foreground">
                                                    {selectedUser.affiliation}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed p-4 text-center">
                                            <p className="text-sm text-muted-foreground">
                                                No user selected. Search and
                                                select a user from the list.
                                            </p>
                                        </div>
                                    )}
                                    {errors.user_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.user_id}
                                        </p>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Journal Role *
                                        </label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(value) =>
                                                setData('role', value ?? '')
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                        {errors.role && (
                                            <p className="text-sm text-destructive">
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            render={
                                                <Link href="/admin/journal-users" />
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                !selectedUser ||
                                                !data.role
                                            }
                                            className="flex-1"
                                        >
                                            {processing
                                                ? 'Assigning...'
                                                : 'Assign User'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
