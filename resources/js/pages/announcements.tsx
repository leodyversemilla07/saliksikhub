import { Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    Megaphone,
    Pin,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import type { PageProps } from '@/types';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    type: string;
    is_pinned: boolean;
    is_published: boolean;
    published_at: string | null;
    expires_at: string | null;
    created_at: string;
}

interface PaginatedAnnouncements {
    data: Announcement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props extends PageProps {
    announcements: PaginatedAnnouncements;
}

const typeLabels: Record<string, string> = {
    general: 'General',
    call_for_papers: 'Call for Papers',
    event: 'Event',
    maintenance: 'Maintenance',
    policy: 'Policy Update',
};

const typeBadgeClasses: Record<string, string> = {
    general: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    call_for_papers:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    event: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    maintenance:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    policy: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

export default function Announcements({ announcements }: Props) {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';

    const formatDate = (dateString: string | null) => {
        if (!dateString) {
            return '';
        }

        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const pinnedAnnouncements = announcements.data.filter((a) => a.is_pinned);
    const regularAnnouncements = announcements.data.filter((a) => !a.is_pinned);

    return (
        <PublicLayout title={`Announcements | ${journalName}`}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="mb-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                        Announcements
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Stay updated with the latest news, events, and updates
                        from {journalName}.
                    </p>
                </div>

                {announcements.data.length === 0 ? (
                    <div className="py-16 text-center">
                        <Megaphone className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <h2 className="mb-2 text-xl font-medium text-foreground">
                            No announcements yet
                        </h2>
                        <p className="text-muted-foreground">
                            Check back later for updates from {journalName}.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Pinned Announcements */}
                        {pinnedAnnouncements.map((announcement) => (
                            <Card
                                key={announcement.id}
                                className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-3 flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="bg-primary text-primary-foreground"
                                        >
                                            <Pin className="mr-1 h-3 w-3" />
                                            Pinned
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                typeBadgeClasses[
                                                    announcement.type
                                                ] || typeBadgeClasses.general
                                            }
                                        >
                                            {typeLabels[announcement.type] ||
                                                announcement.type}
                                        </Badge>
                                        {announcement.published_at && (
                                            <span className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {formatDate(
                                                    announcement.published_at,
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">
                                        <Link
                                            href={`/announcements/${announcement.slug}`}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {announcement.title}
                                        </Link>
                                    </h2>
                                    <p className="mb-4 text-muted-foreground">
                                        {announcement.excerpt ||
                                            announcement.content.substring(
                                                0,
                                                200,
                                            ) +
                                                (announcement.content.length >
                                                200
                                                    ? '...'
                                                    : '')}
                                    </p>
                                    <Button
                                        variant="outline"
                                        render={
                                            <Link
                                                href={`/announcements/${announcement.slug}`}
                                            />
                                        }
                                    >
                                        Read More
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Regular Announcements */}
                        {regularAnnouncements.map((announcement) => (
                            <Card
                                key={announcement.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader>
                                    <div className="mb-1 flex items-center gap-3">
                                        <Badge
                                            variant="secondary"
                                            className={
                                                typeBadgeClasses[
                                                    announcement.type
                                                ] || typeBadgeClasses.general
                                            }
                                        >
                                            {typeLabels[announcement.type] ||
                                                announcement.type}
                                        </Badge>
                                        {announcement.published_at && (
                                            <span className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {formatDate(
                                                    announcement.published_at,
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <CardTitle className="font-serif text-xl">
                                        <Link
                                            href={`/announcements/${announcement.slug}`}
                                            className="transition-colors hover:text-primary"
                                        >
                                            {announcement.title}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-muted-foreground">
                                        {announcement.excerpt ||
                                            announcement.content.substring(
                                                0,
                                                300,
                                            ) +
                                                (announcement.content.length >
                                                300
                                                    ? '...'
                                                    : '')}
                                    </p>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-primary"
                                        render={
                                            <Link
                                                href={`/announcements/${announcement.slug}`}
                                            />
                                        }
                                    >
                                        Read More →
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {announcements.last_page > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <p className="text-sm text-muted-foreground">
                                    Page {announcements.current_page} of{' '}
                                    {announcements.last_page}
                                </p>
                                <div className="flex items-center gap-2">
                                    {announcements.links.map((link, index) => {
                                        if (index === 0) {
                                            return (
                                                <Button
                                                    key="prev"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!link.url}
                                                    render={
                                                        link.url ? (
                                                            <Link
                                                                href={link.url}
                                                            />
                                                        ) : undefined
                                                    }
                                                >
                                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                                    Previous
                                                </Button>
                                            );
                                        }

                                        if (
                                            index ===
                                            announcements.links.length - 1
                                        ) {
                                            return (
                                                <Button
                                                    key="next"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!link.url}
                                                    render={
                                                        link.url ? (
                                                            <Link
                                                                href={link.url}
                                                            />
                                                        ) : undefined
                                                    }
                                                >
                                                    Next
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            );
                                        }

                                        return null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
