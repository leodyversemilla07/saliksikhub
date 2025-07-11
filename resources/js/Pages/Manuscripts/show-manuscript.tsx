import { Head, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Manuscript, ManuscriptStatus } from '@/types/manuscript';
import { PageProps } from '@/types';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import DocumentViewer from '@/components/document-viewer';

interface ShowProps {
    manuscript: Manuscript;
}

export default function Show({ manuscript }: ShowProps): React.ReactElement {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const timelineItems = useMemo(() => {
        const items = [
            {
                label: 'Manuscript Created',
                date: manuscript.created_at,
                description: 'Initial manuscript submission',
                status: 'completed'
            },
        ];

        // Add status-specific timeline items
        if (manuscript.status === ManuscriptStatus.UNDER_REVIEW) {
            items.push({
                label: 'Under Review',
                date: manuscript.updated_at,
                description: 'Manuscript is being reviewed by our editorial team',
                status: 'active'
            });
        } else if (manuscript.status === ManuscriptStatus.ACCEPTED) {
            items.push(
                {
                    label: 'Review Completed',
                    date: manuscript.updated_at,
                    description: 'Editorial review process completed',
                    status: 'completed'
                },
                {
                    label: 'Manuscript Approved',
                    date: manuscript.updated_at,
                    description: 'Approved for publication',
                    status: 'completed'
                }
            );
        } else if (manuscript.status === ManuscriptStatus.PUBLISHED || manuscript.status === ManuscriptStatus.READY_FOR_PUBLICATION) {
            items.push(
                {
                    label: 'Review Completed',
                    date: manuscript.updated_at,
                    description: 'Editorial review process completed',
                    status: 'completed'
                },
                {
                    label: 'Manuscript Approved',
                    date: manuscript.updated_at,
                    description: 'Approved for publication',
                    status: 'completed'
                },
                {
                    label: 'Published',
                    date: manuscript.updated_at,
                    description: 'Manuscript is now publicly available',
                    status: 'completed'
                }
            );
        } else if (manuscript.status === ManuscriptStatus.REJECTED) {
            items.push({
                label: 'Review Completed',
                date: manuscript.updated_at,
                description: 'Manuscript review completed with feedback',
                status: 'rejected'
            });
        }

        // Always add last updated if different from status updates
        if (manuscript.updated_at !== manuscript.created_at) {
            items.push({
                label: 'Last Updated',
                date: manuscript.updated_at,
                description: 'Most recent changes to the manuscript',
                status: 'info'
            });
        }

        return items;
    }, [manuscript.created_at, manuscript.updated_at, manuscript.status]);

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: user.role === 'editor' ? route('editor.dashboard') : route('dashboard'),
        },
        {
            label: 'Manuscripts',
            href: user.role === 'editor' ? route('editor.indexManuscripts') : route('manuscripts.index'),
        },
        {
            label: manuscript.title,
            href: route('manuscripts.show', manuscript.id),
            current: true,
        },
    ];

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Manuscript: ${manuscript.title}`} />
            <div className="manuscript-viewer bg-background text-foreground min-h-screen">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8">
                        {/* Left: Info Panel */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* Header Section */}
                            <div className="space-y-4">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
                                    {manuscript.title}
                                </h1>
                                
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        <span>Last updated </span>
                                        <time className="font-medium text-foreground">
                                            {new Date(manuscript.updated_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </time>
                                    </div>
                                    <StatusBadge status={manuscript.status} />
                                </div>
                            </div>

                            {/* Metadata Section */}
                            <div className="space-y-6">
                                {/* Authors */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                        Authors
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {manuscript.authors.map((author) => (
                                            <Badge key={author} variant="outline" className="text-sm">
                                                {author}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Abstract */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                        Abstract
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {manuscript.abstract}
                                    </p>
                                </div>

                                {/* Keywords */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                        Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {manuscript.keywords.map((keyword) => (
                                            <Badge key={keyword} variant="secondary" className="text-xs">
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                        Timeline
                                    </h3>
                                    <div className="space-y-3">
                                        {timelineItems.map((item, idx) => (
                                            <div key={idx} className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {item.label}
                                                        </span>
                                                        <time className="text-xs text-muted-foreground">
                                                            {new Date(item.date).toLocaleDateString()}
                                                        </time>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Document Viewer */}
                        <div className="xl:col-span-3">
                            <div className="sticky top-6">
                                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                                    <div className="p-4 border-b border-border">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Document Preview
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <DocumentViewer
                                            pdfPath={manuscript.final_pdf_path?.toLowerCase().includes('.pdf')
                                                ? manuscript.final_pdf_path
                                                : manuscript.manuscript_path?.toLowerCase().includes('.pdf')
                                                    ? manuscript.manuscript_path
                                                    : null
                                            }
                                            docxPath={manuscript.final_pdf_path?.toLowerCase().includes('.docx')
                                                ? manuscript.final_pdf_path
                                                : manuscript.manuscript_path?.toLowerCase().includes('.docx')
                                                    ? manuscript.manuscript_path
                                                    : null
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
