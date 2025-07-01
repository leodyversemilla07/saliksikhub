import { Head, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Manuscript, ManuscriptStatus } from '@/types/manuscript';
import { PageProps } from '@/types';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';

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
            <div className="bg-background text-foreground min-h-screen w-full">
                <div className="w-full max-w-none grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 px-0">
                    {/* Left: Info Panel */}
                    <div className="col-span-1 flex flex-col gap-4 px-6 lg:px-12 xl:px-20">
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-foreground)' }}>{manuscript.title}</h1>
                        <div className="text-sm flex items-center gap-2" style={{ color: 'var(--color-muted-foreground)' }}>
                            <span>Last updated</span>
                            <span className="font-semibold text-foreground" style={{ color: 'var(--color-foreground)' }}>
                                {new Date(manuscript.updated_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </span>
                        </div>
                        <StatusBadge status={manuscript.status} className="mb-2" />
                        <div>
                            <strong style={{ color: 'var(--color-foreground)' }}>Authors:</strong>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {manuscript.authors.map((author) => (
                                    <Badge key={author} variant="outline">{author}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--color-foreground)' }}>Abstract:</strong>
                            <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{manuscript.abstract}</p>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--color-foreground)' }}>Keywords:</strong>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {manuscript.keywords.map((keyword) => (
                                    <Badge key={keyword} variant="secondary">{keyword}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--color-foreground)' }}>Timeline:</strong>
                            <ul className="ml-4 mt-2 list-disc text-sm">
                                {timelineItems.map((item, idx) => (
                                    <li key={idx} className="mb-1" style={{ color: 'var(--color-muted-foreground)' }}>
                                        <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>{item.label}:</span> {new Date(item.date).toLocaleDateString()} <span>{item.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* Right: Document Viewer */}
                    <div className="col-span-1 lg:col-span-2 flex items-center justify-center min-h-[60vh] px-0">
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            {(() => {
                                const pdfPath = manuscript.final_pdf_path && manuscript.final_pdf_path.toLowerCase().endsWith('.pdf')
                                    ? manuscript.final_pdf_path
                                    : manuscript.manuscript_path && manuscript.manuscript_path.toLowerCase().endsWith('.pdf')
                                        ? manuscript.manuscript_path
                                        : null;
                                const docxPath = manuscript.final_pdf_path && manuscript.final_pdf_path.toLowerCase().endsWith('.docx')
                                    ? manuscript.final_pdf_path
                                    : manuscript.manuscript_path && manuscript.manuscript_path.toLowerCase().endsWith('.docx')
                                        ? manuscript.manuscript_path
                                        : null;
                                if (pdfPath) {
                                    return (
                                        <object data={pdfPath} type="application/pdf" className="w-full h-[80vh] rounded-lg shadow border" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                                            <div className="mb-4 text-center text-base" style={{ color: 'var(--color-muted-foreground)' }}>
                                                PDF preview is not available in-browser.<br />
                                                <a href={pdfPath} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }} className="underline text-sm">Open PDF in New Tab</a>
                                                <span className="mx-2">|</span>
                                                <a href={pdfPath} download style={{ color: 'var(--color-accent)' }} className="underline text-xs">Download PDF</a>
                                            </div>
                                        </object>
                                    );
                                } else if (docxPath) {
                                    return (
                                        <iframe
                                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + docxPath)}`}
                                            title="Word Document Viewer"
                                            className="w-full h-[80vh] rounded-lg shadow border"
                                            style={{ border: 'none', background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
                                            allowFullScreen
                                        />
                                    );
                                } else {
                                    return (
                                        <div className="text-center p-8 w-full" style={{ color: 'var(--color-muted-foreground)' }}>
                                            {manuscript.final_pdf_path || manuscript.manuscript_path ? (
                                                <>
                                                    <div className="mb-2">No PDF or DOCX document available for preview.</div>
                                                    <div className="mt-4">
                                                        <a href={manuscript.final_pdf_path || manuscript.manuscript_path} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }} className="underline text-sm">View Document</a>
                                                        <span className="mx-2">|</span>
                                                        <a href={manuscript.final_pdf_path || manuscript.manuscript_path} download style={{ color: 'var(--color-accent)' }} className="underline text-xs">Download</a>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>No document available.</div>
                                            )}
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
