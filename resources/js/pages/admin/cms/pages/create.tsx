import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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
import admin from '@/routes/admin';

interface Journal {
    id: number;
    name: string;
}

interface Props {
    journal: Journal;
    pageTypes: Record<string, string>;
}

export default function CreatePage({ journal, pageTypes }: Props) {
    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals', href: admin.journals.index.url() },
        {
            label: journal.name,
            href: admin.journals.edit.url({ journal: journal.id }),
        },
        {
            label: 'CMS - Pages',
            href: `/admin/journals/${journal.id}/cms/pages`,
        },
        { label: 'Create Page' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'custom',
        meta_description: '',
        meta_keywords: '',
        is_published: true,
        show_in_menu: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/journals/${journal.id}/cms/pages`);
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Create Page - ${journal.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/journals/${journal.id}/cms/pages`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Create Page
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new page to {journal.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Page Details</CardTitle>
                                    <CardDescription>
                                        Basic information about your page
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                            placeholder="Enter page title"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-destructive">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Page Type</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) =>
                                                setData('type', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select page type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(pageTypes).map(
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
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO</CardTitle>
                                    <CardDescription>
                                        Search engine optimization settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_description">
                                            Meta Description
                                        </Label>
                                        <Textarea
                                            id="meta_description"
                                            value={data.meta_description}
                                            onChange={(e) =>
                                                setData(
                                                    'meta_description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Brief description for search engines"
                                            rows={3}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Recommended: 150-160 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meta_keywords">
                                            Meta Keywords
                                        </Label>
                                        <Input
                                            id="meta_keywords"
                                            value={data.meta_keywords}
                                            onChange={(e) =>
                                                setData(
                                                    'meta_keywords',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="keyword1, keyword2, keyword3"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publish Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Published</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Make this page visible
                                            </p>
                                        </div>
                                        <Switch
                                            checked={data.is_published}
                                            onCheckedChange={(checked) =>
                                                setData('is_published', checked)
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Show in Menu</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Include in navigation
                                            </p>
                                        </div>
                                        <Switch
                                            checked={data.show_in_menu}
                                            onCheckedChange={(checked) =>
                                                setData('show_in_menu', checked)
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Creating...'
                                            : 'Create Page'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
