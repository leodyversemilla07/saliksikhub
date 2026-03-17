import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

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
}

interface Props {
    announcement: Announcement;
    types: Record<string, string>;
}

function formatDatetimeLocal(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function EditAnnouncement({ announcement, types }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT' as const,
        title: announcement.title || '',
        content: announcement.content || '',
        excerpt: announcement.excerpt || '',
        type: announcement.type || 'general',
        is_pinned: announcement.is_pinned,
        is_published: announcement.is_published,
        published_at: formatDatetimeLocal(announcement.published_at),
        expires_at: formatDatetimeLocal(announcement.expires_at),
    });

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin/announcements' },
        { label: 'Announcements', href: '/admin/announcements' },
        { label: `Edit: ${announcement.title}` },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/announcements/${announcement.id}`);
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Edit Announcement: ${announcement.title}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/announcements">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Announcement</h1>
                        <p className="text-muted-foreground">
                            Update the announcement details
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Announcement Content</CardTitle>
                                    <CardDescription>
                                        Update the title and content
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter announcement title"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-destructive">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt">Excerpt</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) => setData('excerpt', e.target.value)}
                                            placeholder="A short summary of the announcement (optional)"
                                            rows={2}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Brief summary shown in announcement lists. Max 500 characters.
                                        </p>
                                        {errors.excerpt && (
                                            <p className="text-sm text-destructive">{errors.excerpt}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content">Content *</Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder="Write the full announcement content"
                                            rows={10}
                                        />
                                        {errors.content && (
                                            <p className="text-sm text-destructive">{errors.content}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings</CardTitle>
                                    <CardDescription>
                                        Configure announcement type and visibility
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type *</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) => setData('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(types).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-destructive">{errors.type}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is_published">Published</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Make this announcement visible to the public
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_published"
                                            checked={data.is_published}
                                            onCheckedChange={(checked) => setData('is_published', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is_pinned">Pinned</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Pin this announcement to the top of the list
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_pinned"
                                            checked={data.is_pinned}
                                            onCheckedChange={(checked) => setData('is_pinned', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Schedule</CardTitle>
                                    <CardDescription>
                                        Set publish and expiry dates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="published_at">Publish Date</Label>
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(e) => setData('published_at', e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Leave empty to publish immediately when enabled
                                        </p>
                                        {errors.published_at && (
                                            <p className="text-sm text-destructive">{errors.published_at}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="expires_at">Expiry Date</Label>
                                        <Input
                                            id="expires_at"
                                            type="datetime-local"
                                            value={data.expires_at}
                                            onChange={(e) => setData('expires_at', e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Announcement will be hidden after this date
                                        </p>
                                        {errors.expires_at && (
                                            <p className="text-sm text-destructive">{errors.expires_at}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" asChild>
                            <Link href="/admin/announcements">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
