import { Link, usePage } from '@inertiajs/react';
import { Calendar, ArrowLeft, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    author: {
        id: number;
        name: string;
    } | null;
}

interface Props extends PageProps {
    announcement: Announcement;
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

export default function AnnouncementShow({ announcement }: Props) {
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

    return (
        <PublicLayout title={`${announcement.title} | ${journalName}`}>
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back link */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        render={<Link href="/announcements" />}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Announcements
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="mb-4 flex items-center gap-3">
                                <Badge
                                    variant="secondary"
                                    className={
                                        typeBadgeClasses[announcement.type] ||
                                        typeBadgeClasses.general
                                    }
                                >
                                    {typeLabels[announcement.type] ||
                                        announcement.type}
                                </Badge>
                                {announcement.is_pinned && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-primary text-primary-foreground"
                                    >
                                        Pinned
                                    </Badge>
                                )}
                            </div>

                            <h1 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
                                {announcement.title}
                            </h1>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {announcement.published_at && (
                                    <span className="flex items-center">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        {formatDate(announcement.published_at)}
                                    </span>
                                )}
                                {announcement.author && (
                                    <span className="flex items-center">
                                        <User className="mr-1 h-4 w-4" />
                                        {announcement.author.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="my-6" />

                        {/* Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
                            {announcement.content}
                        </div>

                        {/* Expiry notice */}
                        {announcement.expires_at && (
                            <div className="mt-8 rounded-lg bg-muted p-4">
                                <p className="text-sm text-muted-foreground">
                                    This announcement is valid until{' '}
                                    {formatDate(announcement.expires_at)}.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
