import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, GripVertical, MoreHorizontal, Plus, Pencil, Trash2, Eye, Copy, MoveUp, MoveDown } from 'lucide-react';
import admin from '@/routes/admin';
import { useState } from 'react';

interface Section {
    id: number;
    type: string;
    name: string;
    content: Record<string, unknown>;
    settings: Record<string, unknown>;
    order: number;
    is_visible: boolean;
}

interface Page {
    id: number;
    title: string;
    slug: string;
    type: string;
    meta_description: string | null;
    meta_keywords: string | null;
    is_published: boolean;
    show_in_menu: boolean;
    menu_order: number;
    sections: Section[];
}

interface Journal {
    id: number;
    name: string;
}

interface Props {
    journal: Journal;
    page: Page;
    pageTypes: Record<string, string>;
    sectionTypes: Record<string, string>;
}

export default function EditPage({ journal, page, pageTypes, sectionTypes }: Props) {
    const [showAddSection, setShowAddSection] = useState(false);
    const [deletingSectionId, setDeletingSectionId] = useState<number | null>(null);

    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals', href: admin.journals.index.url() },
        { label: journal.name, href: admin.journals.edit.url({ journal: journal.id }) },
        { label: 'CMS - Pages', href: `/admin/journals/${journal.id}/cms/pages` },
        { label: page.title },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: page.title,
        type: page.type,
        meta_description: page.meta_description || '',
        meta_keywords: page.meta_keywords || '',
        is_published: page.is_published,
        show_in_menu: page.show_in_menu,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/journals/${journal.id}/cms/pages/${page.id}`);
    };

    const handleAddSection = (type: string) => {
        router.post(`/admin/journals/${journal.id}/cms/pages/${page.id}/sections`, {
            type,
        }, {
            preserveScroll: true,
            onSuccess: () => setShowAddSection(false),
        });
    };

    const handleDeleteSection = (sectionId: number) => {
        router.delete(`/admin/journals/${journal.id}/cms/pages/${page.id}/sections/${sectionId}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingSectionId(null),
        });
    };

    const handleToggleSectionVisibility = (section: Section) => {
        router.put(`/admin/journals/${journal.id}/cms/pages/${page.id}/sections/${section.id}`, {
            is_visible: !section.is_visible,
        }, {
            preserveScroll: true,
        });
    };

    const handleMoveSection = (sectionId: number, direction: 'up' | 'down') => {
        const currentIndex = page.sections.findIndex(s => s.id === sectionId);
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === page.sections.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const newOrder = [...page.sections];
        const [removed] = newOrder.splice(currentIndex, 1);
        newOrder.splice(newIndex, 0, removed);

        router.put(`/admin/journals/${journal.id}/cms/pages/${page.id}/sections/reorder`, {
            sections: newOrder.map((s, i) => ({ id: s.id, order: i })),
        }, {
            preserveScroll: true,
        });
    };

    const getSectionTypeLabel = (type: string) => {
        return sectionTypes[type] || type;
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Edit ${page.title} - ${journal.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/journals/${journal.id}/cms/pages`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Edit Page</h1>
                            <p className="text-muted-foreground">
                                {page.title} - {journal.name}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <a
                            href={`/journals/${journal.id}/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                        </a>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Page Details Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit}>
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
                                            onChange={(e) => setData('title', e.target.value)}
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-destructive">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Page Type</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) => setData('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(pageTypes).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meta_description">Meta Description</Label>
                                        <Textarea
                                            id="meta_description"
                                            value={data.meta_description}
                                            onChange={(e) => setData('meta_description', e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meta_keywords">Meta Keywords</Label>
                                        <Input
                                            id="meta_keywords"
                                            value={data.meta_keywords}
                                            onChange={(e) => setData('meta_keywords', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-8">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="is_published"
                                                checked={data.is_published}
                                                onCheckedChange={(checked) => setData('is_published', checked)}
                                            />
                                            <Label htmlFor="is_published">Published</Label>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="show_in_menu"
                                                checked={data.show_in_menu}
                                                onCheckedChange={(checked) => setData('show_in_menu', checked)}
                                            />
                                            <Label htmlFor="show_in_menu">Show in Menu</Label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>

                        {/* Page Sections */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Page Sections</CardTitle>
                                    <CardDescription>
                                        Add and arrange content sections for this page
                                    </CardDescription>
                                </div>
                                <Dialog open={showAddSection} onOpenChange={setShowAddSection}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Section
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Add Section</DialogTitle>
                                            <DialogDescription>
                                                Choose a section type to add to this page
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-2 gap-3 py-4">
                                            {Object.entries(sectionTypes).map(([type, label]) => (
                                                <Button
                                                    key={type}
                                                    variant="outline"
                                                    className="h-auto py-4 justify-start"
                                                    onClick={() => handleAddSection(type)}
                                                >
                                                    <div className="text-left">
                                                        <div className="font-medium">{label}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {getSectionDescription(type)}
                                                        </div>
                                                    </div>
                                                </Button>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                {page.sections.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>No sections yet. Add your first section to start building this page.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {page.sections.map((section, index) => (
                                            <div
                                                key={section.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border ${
                                                    section.is_visible ? 'bg-background' : 'bg-muted/50'
                                                }`}
                                            >
                                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium truncate">
                                                            {section.name || getSectionTypeLabel(section.type)}
                                                        </span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {getSectionTypeLabel(section.type)}
                                                        </Badge>
                                                        {!section.is_visible && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Hidden
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleMoveSection(section.id, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <MoveUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleMoveSection(section.id, 'down')}
                                                        disabled={index === page.sections.length - 1}
                                                    >
                                                        <MoveDown className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/journals/${journal.id}/cms/pages/${page.id}/sections/${section.id}/edit`}>
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit Content
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleToggleSectionVisibility(section)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                {section.is_visible ? 'Hide' : 'Show'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => setDeletingSectionId(section.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-muted-foreground">Slug</Label>
                                    <p className="font-mono text-sm">{page.slug}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Type</Label>
                                    <p>{pageTypes[page.type] || page.type}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Sections</Label>
                                    <p>{page.sections.length}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={`/admin/journals/${journal.id}/cms/pages/create`}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Create New Page
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Section Dialog */}
            <AlertDialog open={deletingSectionId !== null} onOpenChange={() => setDeletingSectionId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Section</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this section? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deletingSectionId && handleDeleteSection(deletingSectionId)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

function getSectionDescription(type: string): string {
    const descriptions: Record<string, string> = {
        hero: 'Large banner with title, subtitle, and call-to-action',
        text: 'Rich text content block',
        cards: 'Grid of feature or info cards',
        statistics: 'Display key numbers and metrics',
        cta: 'Call-to-action section with button',
        image_text: 'Image alongside text content',
        accordion: 'Collapsible FAQ or content sections',
        contact_form: 'Contact form with configurable fields',
        editorial_board: 'List of editorial board members',
        recent_issues: 'Display recent journal issues',
        recent_articles: 'Display recently published articles',
        announcements: 'News and announcements list',
        custom_html: 'Custom HTML content block',
    };
    return descriptions[type] || 'Custom content section';
}
