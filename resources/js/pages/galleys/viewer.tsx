import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import galleys from '@/routes/galleys';

interface Galley {
    id: number;
    label: string;
    mime_type: string;
    view_url: string;
}

interface Publication {
    id: number;
    version: string;
    title: string;
}

interface Props {
    galley: Galley;
    publication: Publication;
}

export default function GalleyViewer({ galley, publication }: Props) {
    const isPdf = galley.mime_type === 'application/pdf';
    const isHtml =
        galley.mime_type === 'text/html' ||
        galley.mime_type === 'application/xhtml+xml';

    return (
        <>
            <Head title={`${galley.label} - ${publication.title}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="sticky top-0 z-10 border-b bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={galleys.index.url(publication.id)}
                                >
                                    <Button variant="outline" size="sm">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-900">
                                        {galley.label}
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        {publication.title} - Version{' '}
                                        {publication.version}
                                    </p>
                                </div>
                            </div>
                            <Link href={galleys.download.url(galley.id)}>
                                <Button variant="default">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Viewer */}
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardContent className="p-0">
                            {isPdf && (
                                <iframe
                                    src={galley.view_url}
                                    className="w-full"
                                    style={{
                                        height: 'calc(100vh - 200px)',
                                        minHeight: '600px',
                                    }}
                                    title={galley.label}
                                />
                            )}

                            {isHtml && (
                                <iframe
                                    src={galley.view_url}
                                    className="w-full"
                                    style={{
                                        height: 'calc(100vh - 200px)',
                                        minHeight: '600px',
                                    }}
                                    title={galley.label}
                                    sandbox="allow-same-origin"
                                />
                            )}

                            {!isPdf && !isHtml && (
                                <div className="py-12 text-center">
                                    <p className="mb-4 text-gray-600">
                                        This file type cannot be previewed.
                                        Please download to view.
                                    </p>
                                    <Link
                                        href={galleys.download.url(galley.id)}
                                    >
                                        <Button>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download File
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
