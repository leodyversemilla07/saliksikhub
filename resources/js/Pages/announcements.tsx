import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Megaphone, Pin, ChevronLeft, ChevronRight } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

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
    call_for_papers: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    event: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    maintenance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    policy: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

export default function Announcements({ announcements }: Props) {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                        Announcements
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Stay updated with the latest news, events, and updates from {journalName}.
                    </p>
                </div>

                {announcements.data.length === 0 ? (
                    <div className="text-center py-16">
                        <Megaphone className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-medium text-foreground mb-2">No announcements yet</h2>
                        <p className="text-muted-foreground">
                            Check back later for updates from {journalName}.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Pinned Announcements */}
                        {pinnedAnnouncements.map((announcement) => (
                            <Card key={announcement.id} className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                                            <Pin className="h-3 w-3 mr-1" />
                                            Pinned
                                        </Badge>
                                        <Badge variant="secondary" className={typeBadgeClasses[announcement.type] || typeBadgeClasses.general}>
                                            {typeLabels[announcement.type] || announcement.type}
                                        </Badge>
                                        {announcement.published_at && (
                                            <span className="text-muted-foreground text-sm flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(announcement.published_at)}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="font-serif text-2xl font-bold mb-3 text-foreground">
                                        <Link
                                            href={`/announcements/${announcement.slug}`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {announcement.title}
                                        </Link>
                                    </h2>
                                    <p className="text-muted-foreground mb-4">
                                        {announcement.excerpt || announcement.content.substring(0, 200) + (announcement.content.length > 200 ? '...' : '')}
                                    </p>
                                    <Button asChild variant="outline">
                                        <Link href={`/announcements/${announcement.slug}`}>
                                            Read More
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Regular Announcements */}
                        {regularAnnouncements.map((announcement) => (
                            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-1">
                                        <Badge variant="secondary" className={typeBadgeClasses[announcement.type] || typeBadgeClasses.general}>
                                            {typeLabels[announcement.type] || announcement.type}
                                        </Badge>
                                        {announcement.published_at && (
                                            <span className="text-muted-foreground text-sm flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(announcement.published_at)}
                                            </span>
                                        )}
                                    </div>
                                    <CardTitle className="font-serif text-xl">
                                        <Link
                                            href={`/announcements/${announcement.slug}`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {announcement.title}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-4">
                                        {announcement.excerpt || announcement.content.substring(0, 300) + (announcement.content.length > 300 ? '...' : '')}
                                    </p>
                                    <Button asChild variant="link" className="p-0 h-auto text-primary">
                                        <Link href={`/announcements/${announcement.slug}`}>
                                            Read More →
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {announcements.last_page > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <p className="text-sm text-muted-foreground">
                                    Page {announcements.current_page} of {announcements.last_page}
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
                                                    asChild={!!link.url}
                                                >
                                                    {link.url ? (
                                                        <Link href={link.url}>
                                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                                            Previous
                                                        </Link>
                                                    ) : (
                                                        <span>
                                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                                            Previous
                                                        </span>
                                                    )}
                                                </Button>
                                            );
                                        }
                                        if (index === announcements.links.length - 1) {
                                            return (
                                                <Button
                                                    key="next"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!link.url}
                                                    asChild={!!link.url}
                                                >
                                                    {link.url ? (
                                                        <Link href={link.url}>
                                                            Next
                                                            <ChevronRight className="h-4 w-4 ml-1" />
                                                        </Link>
                                                    ) : (
                                                        <span>
                                                            Next
                                                            <ChevronRight className="h-4 w-4 ml-1" />
                                                        </span>
                                                    )}
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
