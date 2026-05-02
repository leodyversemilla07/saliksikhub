import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

interface Props {
    types: Record<string, string>;
}

export default function CreateAnnouncement({ types }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        excerpt: '',
        type: 'general',
        is_pinned: false,
        is_published: false,
        published_at: '',
        expires_at: '',
    });

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin/announcements' },
        { label: 'Announcements', href: '/admin/announcements' },
        { label: 'Create' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/announcements');
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Create Announcement" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        render={<Link href="/admin/announcements" />}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Create Announcement
                        </h1>
                        <p className="text-muted-foreground">
                            Create a new announcement for the current journal
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Announcement Content</CardTitle>
                                    <CardDescription>
                                        Enter the title and content for the
                                        announcement
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                            placeholder="Enter announcement title"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-destructive">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt">Excerpt</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) =>
                                                setData(
                                                    'excerpt',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="A short summary of the announcement (optional)"
                                            rows={2}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Brief summary shown in announcement
                                            lists. Max 500 characters.
                                        </p>
                                        {errors.excerpt && (
                                            <p className="text-sm text-destructive">
                                                {errors.excerpt}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content">
                                            Content *
                                        </Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) =>
                                                setData(
                                                    'content',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Write the full announcement content"
                                            rows={10}
                                        />
                                        {errors.content && (
                                            <p className="text-sm text-destructive">
                                                {errors.content}
                                            </p>
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
                                        Configure announcement type and
                                        visibility
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type *</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) =>
                                                setData('type', value ?? '')
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(types).map(
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
                                        {errors.type && (
                                            <p className="text-sm text-destructive">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is_published">
                                                Published
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Make this announcement visible
                                                to the public
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_published"
                                            checked={data.is_published}
                                            onCheckedChange={(checked) =>
                                                setData('is_published', checked)
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is_pinned">
                                                Pinned
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Pin this announcement to the top
                                                of the list
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_pinned"
                                            checked={data.is_pinned}
                                            onCheckedChange={(checked) =>
                                                setData('is_pinned', checked)
                                            }
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
                                        <Label htmlFor="published_at">
                                            Publish Date
                                        </Label>
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(e) =>
                                                setData(
                                                    'published_at',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Leave empty to publish immediately
                                            when enabled
                                        </p>
                                        {errors.published_at && (
                                            <p className="text-sm text-destructive">
                                                {errors.published_at}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="expires_at">
                                            Expiry Date
                                        </Label>
                                        <Input
                                            id="expires_at"
                                            type="datetime-local"
                                            value={data.expires_at}
                                            onChange={(e) =>
                                                setData(
                                                    'expires_at',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Announcement will be hidden after
                                            this date
                                        </p>
                                        {errors.expires_at && (
                                            <p className="text-sm text-destructive">
                                                {errors.expires_at}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <Button
                            variant="outline"
                            render={<Link href="/admin/announcements" />}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Announcement'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
