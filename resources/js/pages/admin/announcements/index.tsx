import { Head, Link, router } from '@inertiajs/react';
import {
    Megaphone,
    Plus,
    Pencil,
    Trash2,
    Pin,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    type: string;
    is_pinned: boolean;
    is_published: boolean;
    published_at: string | null;
    expires_at: string | null;
    created_at: string;
    author: {
        id: number;
        name: string;
    } | null;
}

interface PaginatedAnnouncements {
    data: Announcement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    announcements: PaginatedAnnouncements;
}

const typeLabels: Record<string, string> = {
    general: 'General',
    call_for_papers: 'Call for Papers',
    event: 'Event',
    maintenance: 'Maintenance',
    policy: 'Policy Update',
};

const typeVariants: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    general: 'secondary',
    call_for_papers: 'default',
    event: 'outline',
    maintenance: 'destructive',
    policy: 'outline',
};

export default function AnnouncementsIndex({ announcements }: Props) {
    const handleDelete = (announcement: Announcement) => {
        router.delete(`/admin/announcements/${announcement.id}`, {
            preserveScroll: true,
        });
    };

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin/announcements' },
        { label: 'Announcements' },
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

    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) {
            return false;
        }

        return new Date(expiresAt) < new Date();
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Announcements Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Announcements
                        </h1>
                        <p className="text-muted-foreground">
                            Manage announcements for the current journal
                        </p>
                    </div>
                    <Button
                        render={<Link href="/admin/announcements/create" />}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Announcement
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="h-5 w-5" />
                            All Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {announcements.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <Megaphone className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-medium">
                                    No announcements yet
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Get started by creating your first
                                    announcement.
                                </p>
                                <Button
                                    render={
                                        <Link href="/admin/announcements/create" />
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Announcement
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Author</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Published</TableHead>
                                            <TableHead>Expires</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {announcements.data.map(
                                            (announcement) => (
                                                <TableRow key={announcement.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {announcement.is_pinned && (
                                                                <Pin className="h-3 w-3 shrink-0 text-primary" />
                                                            )}
                                                            <span className="font-medium">
                                                                {
                                                                    announcement.title
                                                                }
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                typeVariants[
                                                                    announcement
                                                                        .type
                                                                ] || 'secondary'
                                                            }
                                                        >
                                                            {typeLabels[
                                                                announcement
                                                                    .type
                                                            ] ||
                                                                announcement.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-muted-foreground">
                                                            {announcement.author
                                                                ?.name || '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {isExpired(
                                                            announcement.expires_at,
                                                        ) ? (
                                                            <Badge variant="destructive">
                                                                Expired
                                                            </Badge>
                                                        ) : announcement.is_published ? (
                                                            <Badge variant="default">
                                                                Published
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary">
                                                                Draft
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm">
                                                            {formatDate(
                                                                announcement.published_at,
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm">
                                                            {formatDate(
                                                                announcement.expires_at,
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                render={
                                                                    <Link
                                                                        href={`/admin/announcements/${announcement.id}/edit`}
                                                                    />
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    render={
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="text-destructive hover:text-destructive"
                                                                        />
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            Delete
                                                                            Announcement
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are
                                                                            you
                                                                            sure
                                                                            you
                                                                            want
                                                                            to
                                                                            delete
                                                                            &quot;
                                                                            {
                                                                                announcement.title
                                                                            }
                                                                            &quot;?
                                                                            This
                                                                            action
                                                                            cannot
                                                                            be
                                                                            undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    announcement,
                                                                                )
                                                                            }
                                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                                {announcements.last_page > 1 && (
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                Page{' '}
                                                {announcements.current_page} of{' '}
                                                {announcements.last_page}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {announcements.links.map(
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
                                                            announcements.links
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
        </AppLayout>
    );
}
