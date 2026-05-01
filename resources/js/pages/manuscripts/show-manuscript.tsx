import { Head, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import DocumentViewer from '@/components/document-viewer';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { ManuscriptStatus } from '@/types';
import type { Manuscript} from '@/types';
import type { PageProps } from '@/types';
import { dashboard } from '@/routes';
import editor from '@/routes/editor';
import manuscriptsRoutes from '@/routes/manuscripts';

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
                status: 'completed',
            },
        ];

        // Add status-specific timeline items
        if (manuscript.status === ManuscriptStatus.UNDER_REVIEW) {
            items.push({
                label: 'Under Review',
                date: manuscript.updated_at,
                description:
                    'Manuscript is being reviewed by our editorial team',
                status: 'active',
            });
        } else if (manuscript.status === ManuscriptStatus.ACCEPTED) {
            items.push(
                {
                    label: 'Review Completed',
                    date: manuscript.updated_at,
                    description: 'Editorial review process completed',
                    status: 'completed',
                },
                {
                    label: 'Manuscript Approved',
                    date: manuscript.updated_at,
                    description: 'Approved for publication',
                    status: 'completed',
                },
            );
        } else if (
            manuscript.status === ManuscriptStatus.PUBLISHED ||
            manuscript.status === ManuscriptStatus.READY_FOR_PUBLICATION
        ) {
            items.push(
                {
                    label: 'Review Completed',
                    date: manuscript.updated_at,
                    description: 'Editorial review process completed',
                    status: 'completed',
                },
                {
                    label: 'Manuscript Approved',
                    date: manuscript.updated_at,
                    description: 'Approved for publication',
                    status: 'completed',
                },
                {
                    label: 'Published',
                    date: manuscript.updated_at,
                    description: 'Manuscript is now publicly available',
                    status: 'completed',
                },
            );
        } else if (manuscript.status === ManuscriptStatus.REJECTED) {
            items.push({
                label: 'Review Completed',
                date: manuscript.updated_at,
                description: 'Manuscript review completed with feedback',
                status: 'rejected',
            });
        }

        // Always add last updated if different from status updates
        if (manuscript.updated_at !== manuscript.created_at) {
            items.push({
                label: 'Last Updated',
                date: manuscript.updated_at,
                description: 'Most recent changes to the manuscript',
                status: 'info',
            });
        }

        return items;
    }, [manuscript.created_at, manuscript.updated_at, manuscript.status]);

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href:
                user &&
                (user.role === 'managing_editor' ||
                    user.role === 'editor_in_chief' ||
                    user.role === 'associate_editor' ||
                    user.role === 'language_editor')
                    ? editor.dashboard.url()
                    : dashboard.url(),
        },
        {
            label: 'Manuscripts',
            href:
                user &&
                (user.role === 'managing_editor' ||
                    user.role === 'editor_in_chief' ||
                    user.role === 'associate_editor' ||
                    user.role === 'language_editor')
                    ? editor.indexManuscripts.url()
                    : manuscriptsRoutes.index.url(),
        },
        {
            label: manuscript.title,
            href: manuscriptsRoutes.show.url({ id: manuscript.id }),
            current: true,
        },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Manuscript: ${manuscript.title}`} />
            <div className="manuscript-viewer min-h-screen bg-background text-foreground">
                <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-5">
                        {/* Left: Info Panel */}
                        <div className="space-y-6 xl:col-span-2">
                            {/* Header Section */}
                            <div className="space-y-4">
                                <h1 className="text-oxford-blue font-serif text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
                                    {manuscript.title}
                                </h1>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        <span>Last updated </span>
                                        <time className="font-medium text-foreground">
                                            {new Date(
                                                manuscript.updated_at,
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
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
                                    <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                                        Authors
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {manuscript.authors.map((author) => (
                                            <Badge
                                                key={author}
                                                variant="outline"
                                                className="text-sm"
                                            >
                                                {author}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Abstract */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                                        Abstract
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {manuscript.abstract}
                                    </p>
                                </div>

                                {/* Keywords */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                                        Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {manuscript.keywords.map((keyword) => (
                                            <Badge
                                                key={keyword}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                                        Timeline
                                    </h3>
                                    <div className="space-y-3">
                                        {timelineItems.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                                            >
                                                <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"></div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-1 flex items-center justify-between">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {item.label}
                                                        </span>
                                                        <time className="text-xs text-muted-foreground">
                                                            {new Date(
                                                                item.date,
                                                            ).toLocaleDateString()}
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
                                <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                                    <div className="border-b border-border p-4">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Document Preview
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <DocumentViewer
                                            pdfPath={
                                                manuscript.final_pdf_path
                                                    ?.toLowerCase()
                                                    .includes('.pdf')
                                                    ? manuscript.final_pdf_path
                                                    : manuscript.manuscript_path
                                                            ?.toLowerCase()
                                                            .includes('.pdf')
                                                      ? manuscript.manuscript_path
                                                      : null
                                            }
                                            docxPath={
                                                manuscript.final_pdf_path
                                                    ?.toLowerCase()
                                                    .includes('.docx')
                                                    ? manuscript.final_pdf_path
                                                    : manuscript.manuscript_path
                                                            ?.toLowerCase()
                                                            .includes('.docx')
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
        </AppLayout>
    );
}
