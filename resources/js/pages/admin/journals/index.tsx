import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import admin from '@/routes/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Pencil, Trash2, Building2, Power, FileText, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface Institution {
    id: number;
    name: string;
    abbreviation?: string | null;
}

interface Journal {
    id: number;
    name: string;
    slug: string;
    abbreviation?: string | null;
    issn?: string | null;
    eissn?: string | null;
    logo_path?: string | null;
    is_active: boolean;
    manuscripts_count: number;
    institution: Institution;
}

interface PaginatedJournals {
    data: Journal[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    journals: PaginatedJournals;
}

export default function JournalsIndex({ journals }: Props) {
    const handleDelete = (journal: Journal) => {
        router.delete(`/admin/journals/${journal.id}`, {
            preserveScroll: true,
        });
    };

    const handleToggleStatus = (journal: Journal) => {
        router.post(`/admin/journals/${journal.id}/toggle-status`, {}, {
            preserveScroll: true,
        });
    };

    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals' },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Journals Management" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-serif text-2xl font-bold tracking-tight text-oxford-blue">Journals</h1>
                        <p className="text-muted-foreground">
                            Manage journals in the research journal system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/journals/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Journal
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            All Journals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {journals.data.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">No journals yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Get started by creating your first journal.
                                </p>
                                <Button asChild>
                                    <Link href="/admin/journals/create">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Journal
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Journal</TableHead>
                                            <TableHead>Institution</TableHead>
                                            <TableHead>ISSN</TableHead>
                                            <TableHead>Manuscripts</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {journals.data.map((journal) => (
                                            <TableRow key={journal.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {journal.logo_path ? (
                                                            <img
                                                                src={`/storage/${journal.logo_path}`}
                                                                alt={journal.name}
                                                                className="h-10 w-10 rounded object-contain"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium">{journal.name}</div>
                                                            {journal.abbreviation && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    {journal.abbreviation}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {journal.institution.abbreviation || journal.institution.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {journal.issn ? (
                                                        <div className="text-sm">
                                                            <div>Print: {journal.issn}</div>
                                                            {journal.eissn && (
                                                                <div className="text-muted-foreground">
                                                                    Online: {journal.eissn}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        <FileText className="h-3 w-3 mr-1" />
                                                        {journal.manuscripts_count}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={journal.is_active ? 'default' : 'secondary'}>
                                                        {journal.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleToggleStatus(journal)}
                                                            title={journal.is_active ? 'Deactivate' : 'Activate'}
                                                        >
                                                            <Power className={`h-4 w-4 ${journal.is_active ? 'text-green-500' : 'text-muted-foreground'}`} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild title="Settings">
                                                            <Link href={`/admin/journals/${journal.id}/settings`}>
                                                                <Settings className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild title="Edit">
                                                            <Link href={`/admin/journals/${journal.id}/edit`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive hover:text-destructive"
                                                                    disabled={journal.manuscripts_count > 0}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Journal</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete "{journal.name}"?
                                                                        This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(journal)}
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
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">
                                            Page {journals.current_page} of {journals.last_page}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {journals.links.map((link, index) => {
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
                                                                <Link href={link.url} preserveScroll>
                                                                    <ChevronLeft className="h-4 w-4" />
                                                                </Link>
                                                            ) : (
                                                                <span><ChevronLeft className="h-4 w-4" /></span>
                                                            )}
                                                        </Button>
                                                    );
                                                }
                                                if (index === journals.links.length - 1) {
                                                    return (
                                                        <Button
                                                            key="next"
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={!link.url}
                                                            asChild={!!link.url}
                                                        >
                                                            {link.url ? (
                                                                <Link href={link.url} preserveScroll>
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </Link>
                                                            ) : (
                                                                <span><ChevronRight className="h-4 w-4" /></span>
                                                            )}
                                                        </Button>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
