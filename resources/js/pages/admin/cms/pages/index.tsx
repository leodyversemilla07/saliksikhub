import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    GripVertical,
    ArrowLeft,
    FileText,
    Menu,
    Palette,
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

interface Page {
    id: number;
    title: string;
    slug: string;
    type: string;
    is_published: boolean;
    show_in_menu: boolean;
    menu_order: number;
    sections_count: number;
}

interface Journal {
    id: number;
    name: string;
}

interface Props {
    journal: Journal;
    pages: Page[];
    pageTypes: Record<string, string>;
}

export default function PagesIndex({ journal, pages, pageTypes }: Props) {
    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals', href: admin.journals.index.url() },
        {
            label: journal.name,
            href: admin.journals.edit.url({ journal: journal.id }),
        },
        { label: 'CMS - Pages' },
    ];

    const handleDelete = (pageId: number) => {
        router.delete(`/admin/journals/${journal.id}/cms/pages/${pageId}`);
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`CMS Pages - ${journal.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            render={
                                <Link
                                    href={admin.journals.edit.url({
                                        journal: journal.id,
                                    })}
                                />
                            }
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Content Management
                            </h1>
                            <p className="text-muted-foreground">
                                Manage pages and content for {journal.name}
                            </p>
                        </div>
                    </div>
                    <Button
                        render={
                            <Link
                                href={`/admin/journals/${journal.id}/cms/pages/create`}
                            />
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Page
                    </Button>
                </div>

                {/* CMS Navigation */}
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        render={
                            <Link
                                href={`/admin/journals/${journal.id}/cms/pages`}
                            />
                        }
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        Pages
                    </Button>
                    <Button
                        variant="outline"
                        render={
                            <Link
                                href={`/admin/journals/${journal.id}/cms/menus`}
                            />
                        }
                    >
                        <Menu className="mr-2 h-4 w-4" />
                        Menus
                    </Button>
                    <Button
                        variant="outline"
                        render={
                            <Link
                                href={`/admin/journals/${journal.id}/cms/theme`}
                            />
                        }
                    >
                        <Palette className="mr-2 h-4 w-4" />
                        Theme
                    </Button>
                </div>

                {/* Pages Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pages</CardTitle>
                        <CardDescription>
                            Manage your journal website pages
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pages.length === 0 ? (
                            <div className="py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">
                                    No pages yet
                                </h3>
                                <p className="text-muted-foreground">
                                    Create your first page to get started.
                                </p>
                                <Button
                                    className="mt-4"
                                    render={
                                        <Link
                                            href={`/admin/journals/${journal.id}/cms/pages/create`}
                                        />
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Page
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-8"></TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Sections</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>In Menu</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pages.map((page) => (
                                        <TableRow key={page.id}>
                                            <TableCell>
                                                <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {page.title}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        /{page.slug}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {pageTypes[page.type] ||
                                                        page.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {page.sections_count} sections
                                            </TableCell>
                                            <TableCell>
                                                {page.is_published ? (
                                                    <Badge
                                                        variant="default"
                                                        className="bg-green-500"
                                                    >
                                                        <Eye className="mr-1 h-3 w-3" />
                                                        Published
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <EyeOff className="mr-1 h-3 w-3" />
                                                        Draft
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {page.show_in_menu ? (
                                                    <Badge variant="outline">
                                                        Yes
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-muted-foreground"
                                                    >
                                                        No
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        render={
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            />
                                                        }
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            render={
                                                                <Link
                                                                    href={`/admin/journals/${journal.id}/cms/pages/${page.id}`}
                                                                />
                                                            }
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        {page.type !==
                                                            'home' && (
                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    render={
                                                                        <DropdownMenuItem
                                                                            onSelect={(
                                                                                e,
                                                                            ) =>
                                                                                e.preventDefault()
                                                                            }
                                                                            className="text-destructive"
                                                                        />
                                                                    }
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            Delete
                                                                            Page
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are
                                                                            you
                                                                            sure
                                                                            you
                                                                            want
                                                                            to
                                                                            delete
                                                                            "
                                                                            {
                                                                                page.title
                                                                            }
                                                                            "?
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
                                                                                    page.id,
                                                                                )
                                                                            }
                                                                            className="bg-destructive text-destructive-foreground"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
