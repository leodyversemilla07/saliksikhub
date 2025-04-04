import { Head, Link, usePage } from '@inertiajs/react';
import {
    FileText, User as UserIcon, Clock, Tag,
    FileDown, AlertCircle, Download, ShieldAlert
} from 'lucide-react';
import React, { useState, useCallback, useMemo } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { cn } from '@/lib/utils';
import { Manuscript } from '@/types/manuscript';
import { PageProps } from '@/types';
import { PublicationStatusBadge } from '@/components/manuscripts/publication-status-badge';

interface ShowProps {
    manuscript: Manuscript;
}

const KeywordBadge = ({ keyword }: { keyword: string }) => (
    <span
        className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full
                  bg-gradient-to-r from-green-50 to-yellow-50
                  dark:from-green-900/60 dark:to-yellow-900/60
                  text-green-800 dark:text-green-100 font-medium text-xs sm:text-sm
                  border border-green-200 dark:border-green-700/70 shadow-sm"
    >
        <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 stroke-[2.5] text-green-600 dark:text-green-300" aria-hidden="true" />
        {keyword}
    </span>
);

const AuthorBadge = ({ author }: { author: string }) => (
    <span
        className="bg-gray-100 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 
                 transition-colors duration-200 text-gray-900 dark:text-gray-100
                 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium
                 border border-gray-200 dark:border-gray-600/80
                 shadow-sm dark:shadow-gray-900/30"
    >
        <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 inline-block text-gray-700 dark:text-gray-300" aria-hidden="true" />
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
    const documentUrl = manuscript?.status === 'Published' ||
        manuscript?.status === 'Ready to Publish' ?
        manuscript?.final_pdf_path :
        (url || manuscript?.manuscript_path);

    // Check if document is PDF (for direct embedding)
    const isPdf = documentUrl &&
        (documentUrl.toLowerCase().endsWith('.pdf') ||
            manuscript?.status === 'Published' ||
            manuscript?.status === 'Ready to Publish' ||
            manuscript?.status === 'Awaiting Approval');

    // Document type indicator (for UI purposes)
    const isFinalized = manuscript?.status === 'Published' ||
        manuscript?.status === 'Ready to Publish' ||
        manuscript?.status === 'Awaiting Approval';

    if (!hasDocument) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg p-3 sm:p-4 flex items-center gap-2 border border-red-100 dark:border-red-800/50">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400" aria-hidden="true" />
                <p className="text-sm sm:text-base font-medium">No manuscript file available.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-700/50">
            {isFinalized && (
                <div className="mb-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded text-blue-700 dark:text-blue-300 text-sm">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Viewing the {manuscript?.status === 'Published' ? 'published' : 'finalized'} version of this manuscript</span>
                    </div>
                </div>
            )}

            {!viewerError ? (
                <div className="relative w-full">
                    {isPdf ? (
                        // Directly embed PDF files
                        <iframe
                            src={documentUrl || ''}
                            width="100%"
                            height="400px"
                            className="border dark:border-gray-600 rounded h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-white dark:bg-gray-900"
                            frameBorder="0"
                            onError={onError}
                            id="manuscript-viewer"
                            name="manuscript-viewer"
                            title={`${title} document viewer`}
                            aria-label="Document viewer for manuscript"
                            loading="lazy"
                        />
                    ) : (
                        // Try Microsoft viewer for non-PDF files, but provide fallback
                        <>
                            <iframe
                                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documentUrl || '')}`}
                                width="100%"
                                height="400px"
                                className="border dark:border-gray-600 rounded h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-white dark:bg-gray-900"
                                frameBorder="0"
                                onError={onError}
                                id="manuscript-viewer"
                                name="manuscript-viewer"
                                title={`${title} document viewer`}
                                aria-label="Document viewer for manuscript"
                                loading="lazy"
                            />
                            <div className="mt-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded text-amber-700 dark:text-amber-300 text-xs">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span>If the document doesn't load, please use the download button below to view it.</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="border border-amber-200 dark:border-amber-800/50 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 sm:p-6 mb-4">
                    <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-800/30 rounded-full">
                            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Viewer Unavailable</h3>
                            <p className="text-sm sm:text-base text-amber-700 dark:text-amber-400 mb-2">
                                We couldn't display the document in the browser due to access restrictions.
                                Please download the document to view it on your device.
                            </p>
                            <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-500">
                                Error: File cannot be accessed by the online viewer
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                <a
                    href={documentUrl}
                    download
                    className={cn(
                        "inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-md transition-colors duration-150 shadow-sm",
                        isFinalized ?
                            "bg-blue-600 text-white hover:bg-blue-700" :
                            "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                    Download {isFinalized ? 'Final PDF' : 'Document'}
                </a>

                {/* Show both document versions if we're in a published/ready state and have both */}
                {isFinalized && manuscript?.manuscript_path && manuscript?.manuscript_path !== documentUrl && (
                    <a
                        href={manuscript.manuscript_path}
                        download
                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm 
                               bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                               rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 shadow-sm"
                    >
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                        Original Manuscript
                    </a>
                )}

                {/* Remove external Microsoft Viewer link as it won't work with private files */}
            </div>

            <p className="mt-2 sm:mt-3 text-xs text-gray-600 dark:text-gray-400">
                {isPdf
                    ? "If you're having trouble viewing the PDF, try downloading it directly."
                    : "Word documents can't be viewed directly in the browser. Please download to view."}
            </p>
        </div>
    );
};

const TimelineItem = ({ label, date }: { label: string, date: string }) => (
    <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full shadow-sm"></div>
        <div className="flex-1">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
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

const BreadcrumbNav = ({ title, userRole }: { title: string, userRole: string }) => (
    <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
                <div className="flex items-center">
                    <FileText className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" />
                    <Link
                        href={userRole === 'editor' ?
                            route('editor.indexManuscripts') :
                            route('manuscripts.index')}
                        className="ml-1 text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
                    >
                        Manuscripts
                    </Link>
                </div>
            </li>
            <li aria-current="page">
                <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-primary dark:text-primary-foreground">{title}</span>
                </div>
            </li>
        </ol>
    </nav>
);

export default function Show({ manuscript }: ShowProps): React.ReactElement {
    const [viewerError, setViewerError] = useState(false);
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleIframeError = useCallback(() => {
        setViewerError(true);
    }, []);

    const timelineItems = useMemo(() => [
        { label: 'Created', date: manuscript.created_at },
        { label: 'Last Updated', date: manuscript.updated_at }
    ], [manuscript.created_at, manuscript.updated_at]);

    return (
        <AuthenticatedLayout header="Manuscript Details">
            <Head title={`Manuscript: ${manuscript.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-full max-w-5xl mx-auto">
                    <BreadcrumbNav title={manuscript.title} userRole={user.role} />

                    <div className="w-full">
                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg md:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 dark:from-green-800 dark:via-green-700 dark:to-yellow-700 p-5 sm:p-6 md:p-8 lg:p-10">
                                <div className="absolute inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-sm"></div>
                                <div className="relative">
                                    <PublicationStatusBadge status={manuscript.status} />
                                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-2 sm:mt-3 md:mt-4 break-words leading-tight tracking-tight drop-shadow-md">
                                        {manuscript.title}
                                    </h1>
                                </div>
                            </div>

                            <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                                <div className="grid gap-6 sm:gap-7 md:gap-8 lg:gap-12">
                                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <UserIcon className="w-5 h-5 text-primary" />
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Authors</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                {manuscript.authors.map((author) => (
                                                    <AuthorBadge key={author} author={author} />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <FileText className="w-5 h-5 text-primary" />
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Abstract</h3>
                                            </div>
                                            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-100 leading-relaxed">
                                                {manuscript.abstract}
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Tag className="w-5 h-5 text-primary" />
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Keywords</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                {manuscript.keywords.map((keyword) => (
                                                    <KeywordBadge key={keyword} keyword={keyword} />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <FileDown className="w-5 h-5 text-primary" />
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {manuscript.status === 'Published' || manuscript.status === 'Ready to Publish' ?
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

                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Clock className="w-5 h-5 text-primary" />
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Timeline</h3>
                                            </div>
                                            <div className="space-y-3 sm:space-y-4">
                                                {timelineItems.map(item => (
                                                    <TimelineItem key={item.label} label={item.label} date={item.date} />
                                                ))}
                                            </div>
                                        </div>
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
