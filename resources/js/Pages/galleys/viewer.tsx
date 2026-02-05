import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';

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
    const isHtml = galley.mime_type === 'text/html' || galley.mime_type === 'application/xhtml+xml';

    return (
        <>
            <Head title={`${galley.label} - ${publication.title}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link href={route('galleys.index', publication.id)}>
                                    <Button variant="outline" size="sm">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-900">{galley.label}</h1>
                                    <p className="text-sm text-gray-600">
                                        {publication.title} - Version {publication.version}
                                    </p>
                                </div>
                            </div>
                            <Link href={route('galleys.download', galley.id)}>
                                <Button variant="default">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Viewer */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Card>
                        <CardContent className="p-0">
                            {isPdf && (
                                <iframe
                                    src={galley.view_url}
                                    className="w-full"
                                    style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
                                    title={galley.label}
                                />
                            )}

                            {isHtml && (
                                <iframe
                                    src={galley.view_url}
                                    className="w-full"
                                    style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
                                    title={galley.label}
                                    sandbox="allow-same-origin"
                                />
                            )}

                            {!isPdf && !isHtml && (
                                <div className="py-12 text-center">
                                    <p className="text-gray-600 mb-4">
                                        This file type cannot be previewed. Please download to view.
                                    </p>
                                    <Link href={route('galleys.download', galley.id)}>
                                        <Button>
                                            <Download className="w-4 h-4 mr-2" />
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
