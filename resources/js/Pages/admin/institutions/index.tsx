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
import { Building2, Plus, Pencil, Trash2, Globe, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
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
    slug: string;
    abbreviation?: string | null;
    domain?: string | null;
    logo_path?: string | null;
    contact_email?: string | null;
    website?: string | null;
    is_active: boolean;
    journals_count: number;
}

interface PaginatedInstitutions {
    data: Institution[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    institutions: PaginatedInstitutions;
}

export default function InstitutionsIndex({ institutions }: Props) {
    const handleDelete = (institution: Institution) => {
        router.delete(`/admin/institutions/${institution.id}`, {
            preserveScroll: true,
        });
    };

    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Institutions' },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Institutions Management" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Institutions</h1>
                        <p className="text-muted-foreground">
                            Manage institutions in the research journal system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/institutions/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Institution
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            All Institutions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {institutions.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">No institutions yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Get started by creating your first institution.
                                </p>
                                <Button asChild>
                                    <Link href="/admin/institutions/create">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Institution
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Institution</TableHead>
                                            <TableHead>Domain</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Journals</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {institutions.data.map((institution) => (
                                            <TableRow key={institution.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {institution.logo_path ? (
                                                            <img
                                                                src={`/storage/${institution.logo_path}`}
                                                                alt={institution.name}
                                                                className="h-10 w-10 rounded object-contain"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium">{institution.name}</div>
                                                            {institution.abbreviation && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    {institution.abbreviation}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {institution.domain ? (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Globe className="h-3 w-3" />
                                                            {institution.domain}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {institution.contact_email ? (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Mail className="h-3 w-3" />
                                                            {institution.contact_email}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {institution.journals_count} journal{institution.journals_count !== 1 ? 's' : ''}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={institution.is_active ? 'default' : 'secondary'}>
                                                        {institution.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/admin/institutions/${institution.id}/edit`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive hover:text-destructive"
                                                                    disabled={institution.journals_count > 0}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Institution</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete "{institution.name}"?
                                                                        This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(institution)}
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
                                            Page {institutions.current_page} of {institutions.last_page}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {institutions.links.map((link, index) => {
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
                                                if (index === institutions.links.length - 1) {
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
