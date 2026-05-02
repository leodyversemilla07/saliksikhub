import { Head, Link, useForm } from '@inertiajs/react';
import {
    FileText,
    Upload,
    Download,
    Eye,
    Trash2,
    CheckCircle,
    Clock,
    FileCode,
    Book,
    File,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import galleysRoutes from '@/routes/galleys';

interface Publication {
    id: number;
    version: string;
    title: string;
    manuscript_id: number;
}

interface Galley {
    id: number;
    label: string;
    locale: string;
    mime_type: string;
    file_size: number;
    formatted_size: string;
    sequence: number;
    is_approved: boolean;
    download_count: number;
    last_downloaded_at: string | null;
    created_at: string;
    icon: string;
    can_view_inline: boolean;
}

interface Stats {
    total: number;
    approved: number;
    pending: number;
    total_downloads: number;
    formats: string[];
}

interface Props {
    publication: Publication;
    galleys: Galley[];
    stats: Stats;
}

export default function GalleyIndex({ publication, galleys, stats }: Props) {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const uploadForm = useForm({
        file: null as File | null,
        label: '',
        locale: 'en',
    });
    const approveForm = useForm({});
    const deleteForm = useForm({});

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        uploadForm.post(galleysRoutes.store.url(publication.id), {
            onSuccess: () => {
                uploadForm.reset();
                setIsUploadOpen(false);
            },
        });
    };

    const handleApprove = (galley: Galley) => {
        if (confirm(`Approve galley "${galley.label}" for public access?`)) {
            approveForm.post(galleysRoutes.approve.url(galley.id));
        }
    };

    const handleDelete = (galley: Galley) => {
        if (
            confirm(
                `Delete galley "${galley.label}"? This action cannot be undone.`,
            )
        ) {
            deleteForm.delete(galleysRoutes.destroy.url(galley.id));
        }
    };

    const getIconComponent = (icon: string) => {
        const icons: Record<string, ReactElement> = {
            'file-pdf': <FileText className="h-5 w-5 text-red-500" />,
            'file-code': <FileCode className="h-5 w-5 text-blue-500" />,
            book: <Book className="h-5 w-5 text-green-500" />,
            file: <File className="h-5 w-5 text-gray-500" />,
        };

        return icons[icon] || icons.file;
    };

    const getMimeTypeBadge = (mimeType: string) => {
        const types: Record<
            string,
            {
                label: string;
                variant: 'default' | 'secondary' | 'destructive' | 'outline';
            }
        > = {
            'application/pdf': { label: 'PDF', variant: 'destructive' },
            'text/html': { label: 'HTML', variant: 'default' },
            'application/xhtml+xml': { label: 'XHTML', variant: 'default' },
            'application/epub+zip': { label: 'EPUB', variant: 'secondary' },
            'application/xml': { label: 'XML', variant: 'outline' },
            'text/xml': { label: 'XML', variant: 'outline' },
            'application/x-mobipocket-ebook': {
                label: 'MOBI',
                variant: 'secondary',
            },
        };
        const type = types[mimeType] || {
            label: 'Unknown',
            variant: 'outline' as const,
        };

        return <Badge variant={type.variant}>{type.label}</Badge>;
    };

    return (
        <AppLayout>
            <Head title={`Galleys - ${publication.title}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                Galley Management
                            </h1>
                            <p className="text-gray-600">
                                {publication.title} - Version{' '}
                                {publication.version}
                            </p>
                        </div>
                        <Dialog
                            open={isUploadOpen}
                            onOpenChange={setIsUploadOpen}
                        >
                            <DialogTrigger render={<Button />}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Galley
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload New Galley</DialogTitle>
                                    <DialogDescription>
                                        Upload a publication file (PDF, HTML,
                                        ePub, XML, etc.)
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleUpload}
                                    className="space-y-4"
                                >
                                    <div>
                                        <Label htmlFor="file">File</Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            accept=".pdf,.html,.htm,.xhtml,.epub,.xml,.mobi"
                                            onChange={(e) =>
                                                uploadForm.setData(
                                                    'file',
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            required
                                        />
                                        {uploadForm.errors.file && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {uploadForm.errors.file}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Max size: 50MB. Allowed: PDF, HTML,
                                            ePub, XML, MOBI
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="label">Label</Label>
                                        <Input
                                            id="label"
                                            value={uploadForm.data.label}
                                            onChange={(e) =>
                                                uploadForm.setData(
                                                    'label',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., PDF, HTML Full Text"
                                            required
                                        />
                                        {uploadForm.errors.label && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {uploadForm.errors.label}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="locale">Language</Label>
                                        <Input
                                            id="locale"
                                            value={uploadForm.data.locale}
                                            onChange={(e) =>
                                                uploadForm.setData(
                                                    'locale',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="en"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsUploadOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={uploadForm.processing}
                                        >
                                            {uploadForm.processing
                                                ? 'Uploading...'
                                                : 'Upload'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">
                                    Total Galleys
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">
                                    Approved
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.approved}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">
                                    Pending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">
                                    {stats.pending}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">
                                    Total Downloads
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total_downloads}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Galleys List */}
                    {galleys.length > 0 ? (
                        <div className="space-y-3">
                            {galleys.map((galley) => (
                                <Card
                                    key={galley.id}
                                    className="transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-1 items-center gap-4">
                                                <div>
                                                    {getIconComponent(
                                                        galley.icon,
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <h3 className="font-semibold">
                                                            {galley.label}
                                                        </h3>
                                                        {getMimeTypeBadge(
                                                            galley.mime_type,
                                                        )}
                                                        {galley.is_approved ? (
                                                            <Badge
                                                                variant="default"
                                                                className="bg-green-500"
                                                            >
                                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                                Approved
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                Pending
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span>
                                                            {
                                                                galley.formatted_size
                                                            }
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {
                                                                galley.download_count
                                                            }{' '}
                                                            downloads
                                                        </span>
                                                        {galley.last_downloaded_at && (
                                                            <>
                                                                <span>•</span>
                                                                <span>
                                                                    Last:{' '}
                                                                    {new Date(
                                                                        galley.last_downloaded_at,
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {galley.can_view_inline && (
                                                    <Link
                                                        href={galleysRoutes.view.url(
                                                            galley.id,
                                                        )}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Eye className="mr-1 h-3 w-3" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link
                                                    href={galleysRoutes.download.url(
                                                        galley.id,
                                                    )}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Download className="mr-1 h-3 w-3" />
                                                        Download
                                                    </Button>
                                                </Link>
                                                {!galley.is_approved && (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() =>
                                                            handleApprove(
                                                                galley,
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Approve
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(galley)
                                                    }
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                    No Galleys Yet
                                </h3>
                                <p className="mb-4 text-gray-600">
                                    Upload publication files to make them
                                    available for readers
                                </p>
                                <Button onClick={() => setIsUploadOpen(true)}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload First Galley
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
