import { Head, usePage } from '@inertiajs/react';
import {
    FileText, User as UserIcon, Clock, Tag,
    FileDown, AlertCircle, Download, ShieldAlert
} from 'lucide-react';
import React, { useState, useCallback, useMemo } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { cn } from '@/lib/utils';
import { Manuscript, ManuscriptStatus } from '@/types/manuscript';
import { PageProps } from '@/types';
import { PublicationStatusBadge } from '@/components/manuscripts/publication-status-badge';

interface ShowProps {
    manuscript: Manuscript;
}

const KeywordBadge = ({ keyword }: { keyword: string }) => (
    <span
        className="inline-flex items-center px-3 py-2 rounded-lg
                  bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50
                  dark:from-emerald-900/40 dark:via-green-900/40 dark:to-teal-900/40
                  text-emerald-700 dark:text-emerald-200 font-medium text-sm
                  border border-emerald-200/60 dark:border-emerald-700/50 
                  shadow-sm"
    >
        <Tag className="w-4 h-4 mr-2 stroke-[2] text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
        {keyword}
    </span>
);

const AuthorBadge = ({ author }: { author: string }) => (
    <span
        className="inline-flex items-center px-4 py-2.5 rounded-xl
                 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50
                 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40
                 text-blue-800 dark:text-blue-100
                 font-semibold text-sm border border-blue-200/60 dark:border-blue-700/50
                 shadow-sm"
    >
        <UserIcon className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-300" aria-hidden="true" />
        {author}
    </span>
);

const DocumentViewer = ({ url, title, viewerError, onError, manuscript }: {
    url: string | null,
    title: string,
    viewerError: boolean,
    onError: () => void,
    manuscript: Manuscript
}) => {
    // Check for any available document (either manuscript or final PDF)
    const hasDocument = url ||
        (manuscript?.manuscript_path || manuscript?.final_pdf_path);

    // Use final PDF for published/ready manuscripts, otherwise use manuscript file
    const documentUrl = manuscript?.status === ManuscriptStatus.PUBLISHED ||
        manuscript?.status === ManuscriptStatus.READY_FOR_PUBLICATION ?
        manuscript?.final_pdf_path :
        (url || manuscript?.manuscript_path);

    // Check if document is PDF (for direct embedding)
    const isPdf = documentUrl &&
        (documentUrl.toLowerCase().endsWith('.pdf') ||
            manuscript?.status === ManuscriptStatus.PUBLISHED ||
            manuscript?.status === ManuscriptStatus.READY_FOR_PUBLICATION ||
            manuscript?.status === ManuscriptStatus.AWAITING_AUTHOR_APPROVAL);

    // Document type indicator (for UI purposes)
    const isFinalized = manuscript?.status === ManuscriptStatus.PUBLISHED ||
        manuscript?.status === ManuscriptStatus.READY_FOR_PUBLICATION ||
        manuscript?.status === ManuscriptStatus.AWAITING_AUTHOR_APPROVAL;

    if (!hasDocument) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg p-3 sm:p-4 flex items-center gap-2 border border-red-100 dark:border-red-800/50">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400" aria-hidden="true" />
                <p className="text-sm sm:text-base font-medium">No manuscript file available.</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 
                       dark:from-gray-800/70 dark:via-gray-800/80 dark:to-gray-800/90 
                       rounded-2xl p-3 sm:p-6 border border-gray-200/60 dark:border-gray-700/50 
                       shadow-lg hover:shadow-xl transition-all duration-300 w-full">
            {isFinalized && (
                <div className="mb-4 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 
                               dark:from-blue-400/20 dark:to-indigo-400/20 
                               border border-blue-200/40 dark:border-blue-700/40 
                               rounded-xl text-blue-700 dark:text-blue-300">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Finalized Document</h4>
                            <p className="text-xs opacity-80">
                                Viewing the {manuscript?.status === ManuscriptStatus.PUBLISHED ? 'published' : 'finalized'} version of this manuscript
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!viewerError ? (
                <div className="relative w-full group">
                    {isPdf ? (
                        // Directly embed PDF files with full width and responsive height
                        <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-600 w-full">
                            <iframe
                                src={documentUrl || ''}
                                width="100%"
                                height="100%"
                                className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] 
                                         min-h-[400px] max-h-[1200px] rounded-xl
                                         bg-white dark:bg-gray-900 transition-all duration-300
                                         group-hover:shadow-2xl"
                                frameBorder="0"
                                onError={onError}
                                id="manuscript-viewer"
                                name="manuscript-viewer"
                                title={`${title} document viewer`}
                                aria-label="Document viewer for manuscript"
                                loading="lazy"
                                style={{
                                    aspectRatio: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                            <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1">
                                <span className="text-white text-xs font-medium">PDF Document</span>
                            </div>
                            {/* Fullscreen button */}
                            <button
                                onClick={() => window.open(documentUrl || '', '_blank')}
                                className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 
                                         hover:bg-black/30 transition-all duration-200 group/btn"
                                title="Open in full screen"
                            >
                                <svg className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        // Try Microsoft viewer for non-PDF files with enhanced sizing
                        <>
                            <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-600 w-full">
                                <iframe
                                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documentUrl || '')}`}
                                    width="100%"
                                    height="100%"
                                    className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] 
                                             min-h-[400px] max-h-[1200px] rounded-xl
                                             bg-white dark:bg-gray-900 transition-all duration-300
                                             group-hover:shadow-2xl"
                                    frameBorder="0"
                                    onError={onError}
                                    id="manuscript-viewer"
                                    name="manuscript-viewer"
                                    title={`${title} document viewer`}
                                    aria-label="Document viewer for manuscript"
                                    loading="lazy"
                                    style={{
                                        aspectRatio: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                                <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1">
                                    <span className="text-white text-xs font-medium">Word Document</span>
                                </div>
                                {/* Fullscreen button */}
                                <button
                                    onClick={() => window.open(documentUrl || '', '_blank')}
                                    className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 
                                             hover:bg-black/30 transition-all duration-200 group/btn"
                                    title="Open in full screen"
                                >
                                    <svg className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-3 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 
                                          dark:from-amber-900/20 dark:to-orange-900/20 
                                          border border-amber-200/60 dark:border-amber-800/40 
                                          rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className="p-1 bg-amber-100 dark:bg-amber-800/40 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                                            Document Preview
                                        </p>
                                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                            If the document doesn't display properly, try downloading it or opening in a new tab.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="border-2 border-amber-200/80 dark:border-amber-800/60 rounded-2xl 
                               bg-gradient-to-br from-amber-50 via-orange-50 to-red-50
                               dark:from-amber-900/30 dark:via-orange-900/30 dark:to-red-900/30 
                               p-6 mb-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 
                                       dark:from-amber-800/40 dark:to-orange-800/40 
                                       rounded-2xl shadow-sm">
                            <ShieldAlert className="w-8 h-8 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-amber-800 dark:text-amber-300 mb-2">
                                Document Viewer Unavailable
                            </h3>
                            <p className="text-amber-700 dark:text-amber-400 mb-3 leading-relaxed">
                                We couldn't display the document in the browser due to access restrictions or file format limitations.
                                Please download the document to view it on your device.
                            </p>
                            <div className="bg-amber-100/50 dark:bg-amber-800/20 rounded-lg p-3">
                                <p className="text-sm text-amber-600 dark:text-amber-500 font-medium">
                                    ⚠️ Error: File cannot be accessed by the online viewer
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
                <a
                    href={documentUrl}
                    download
                    className={cn(
                        "inline-flex items-center px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg",
                        isFinalized ?
                            "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" :
                            "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                    )}
                >
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                    Download {isFinalized ? 'Final PDF' : 'Document'}
                </a>

                {/* Show both document versions if we're in a published/ready state and have both */}
                {isFinalized && manuscript?.manuscript_path && manuscript?.manuscript_path !== documentUrl && (
                    <a
                        href={manuscript.manuscript_path}
                        download
                        className="inline-flex items-center px-6 py-3 text-sm font-semibold
                               bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 
                               text-gray-800 dark:text-gray-200 rounded-xl 
                               transition-all duration-200 shadow-lg"
                    >
                        <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                        Original Manuscript
                    </a>
                )}

                {/* Remove external Microsoft Viewer link as it won't work with private files */}
            </div>

            <div className="mt-4 px-4 py-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 
                           dark:from-blue-900/20 dark:to-indigo-900/20 
                           border border-blue-200/30 dark:border-blue-700/30 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    💡 {isPdf
                        ? "If you're having trouble viewing the PDF, try downloading it directly for the best experience."
                        : "Word documents are best viewed locally. Download the file to access all formatting and features."}
                </p>
            </div>
        </div>
    );
};

const TimelineItem = ({
    label,
    date,
    description,
    status
}: {
    label: string;
    date: string;
    description?: string;
    status?: string;
}) => {
    const getStatusConfig = (status?: string) => {
        switch (status) {
            case 'completed':
                return {
                    bgGradient: 'from-green-50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/10',
                    border: 'border-green-200/60 dark:border-green-800/30',
                    circle: 'bg-gradient-to-r from-green-500 to-emerald-500',
                    ring: 'ring-green-500/20 dark:ring-green-400/40'
                };
            case 'active':
                return {
                    bgGradient: 'from-blue-50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10',
                    border: 'border-blue-200/60 dark:border-blue-800/30',
                    circle: 'bg-gradient-to-r from-blue-500 to-indigo-500',
                    ring: 'ring-blue-500/20 dark:ring-blue-400/40'
                };
            case 'rejected':
                return {
                    bgGradient: 'from-red-50 to-rose-50/30 dark:from-red-900/20 dark:to-rose-900/10',
                    border: 'border-red-200/60 dark:border-red-800/30',
                    circle: 'bg-gradient-to-r from-red-500 to-rose-500',
                    ring: 'ring-red-500/20 dark:ring-red-400/40'
                };
            case 'info':
                return {
                    bgGradient: 'from-amber-50 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10',
                    border: 'border-amber-200/60 dark:border-amber-800/30',
                    circle: 'bg-gradient-to-r from-amber-500 to-orange-500',
                    ring: 'ring-amber-500/20 dark:ring-amber-400/40'
                };
            default:
                return {
                    bgGradient: 'from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/20',
                    border: 'border-gray-200/60 dark:border-gray-700/40',
                    circle: 'bg-gradient-to-r from-primary to-blue-500',
                    ring: 'ring-primary/20 dark:ring-primary/40'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div className={`flex items-start gap-4 p-5 bg-gradient-to-r ${config.bgGradient} 
                       rounded-xl border ${config.border}`}>
            <div className="flex-shrink-0 mt-1">
                <div className={`w-4 h-4 ${config.circle} rounded-full shadow-sm 
                               ring-4 ${config.ring}`}></div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">{label}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {new Date(date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
                {description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                        {description}
                    </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>
        </div>
    );
};

export default function Show({ manuscript }: ShowProps): React.ReactElement {
    const [viewerError, setViewerError] = useState(false);
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleIframeError = useCallback(() => {
        setViewerError(true);
    }, []);

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

            <div className="w-full max-w-none">
                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg md:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 dark:from-green-800 dark:via-emerald-700 dark:to-teal-700 p-8 md:p-12">
                        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
                        <div className="relative">
                            <div className="mb-4">
                                <PublicationStatusBadge status={manuscript.status} />
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 
                                         break-words leading-tight tracking-tight drop-shadow-lg">
                                {manuscript.title}
                            </h1>
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        Last updated {new Date(manuscript.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 lg:p-10">
                        {/* Grid layout with responsive columns for better document display */}
                        <div className="grid gap-8 lg:gap-12 grid-cols-1">
                            {/* Authors Section */}
                            <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 
                                                   dark:from-gray-800/60 dark:via-blue-900/20 dark:to-indigo-900/20 
                                                   rounded-2xl p-6 shadow-lg border border-blue-100/60 dark:border-blue-800/30">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                        <UserIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Authors</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {manuscript.authors.map((author) => (
                                        <AuthorBadge key={author} author={author} />
                                    ))}
                                </div>
                            </div>

                            {/* Information Grid */}
                            <div className="grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-2">
                                {/* Abstract Section */}
                                <div className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 
                                                       dark:from-gray-800/60 dark:via-green-900/20 dark:to-emerald-900/20 
                                                       rounded-2xl p-6 shadow-lg border border-green-100/60 dark:border-green-800/30">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Abstract</h3>
                                    </div>
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-base">
                                            {manuscript.abstract}
                                        </p>
                                    </div>
                                </div>

                                {/* Keywords Section */}
                                <div className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 
                                                       dark:from-gray-800/60 dark:via-emerald-900/20 dark:to-teal-900/20 
                                                       rounded-2xl p-6 shadow-lg border border-emerald-100/60 dark:border-emerald-800/30">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                                            <Tag className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Keywords</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {manuscript.keywords.map((keyword) => (
                                            <KeywordBadge key={keyword} keyword={keyword} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Document Section - Full Width Layout */}
                            <div className="col-span-full bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 
                                                   dark:from-gray-800/60 dark:via-purple-900/20 dark:to-pink-900/20 
                                                   rounded-2xl p-6 shadow-lg border border-purple-100/60 dark:border-purple-800/30">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                        <FileDown className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {manuscript.status === ManuscriptStatus.PUBLISHED || manuscript.status === ManuscriptStatus.READY_FOR_PUBLICATION ?
                                            "Published Document" : "Manuscript File"}
                                    </h3>
                                </div>
                                <DocumentViewer
                                    url={manuscript.manuscript_path || null}
                                    title={manuscript.title}
                                    viewerError={viewerError}
                                    onError={handleIframeError}
                                    manuscript={manuscript}
                                />
                            </div>

                            {/* Timeline Section */}
                            <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 
                                                   dark:from-gray-800/60 dark:via-orange-900/20 dark:to-amber-900/20 
                                                   rounded-2xl p-6 shadow-lg border border-orange-100/60 dark:border-orange-800/30">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Timeline</h3>
                                </div>
                                <div className="space-y-4">
                                    {timelineItems.map((item, index) => (
                                        <TimelineItem
                                            key={`${item.label}-${index}`}
                                            label={item.label}
                                            date={item.date}
                                            description={item.description}
                                            status={item.status}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
