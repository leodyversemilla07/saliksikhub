import { usePage } from '@inertiajs/react';
import { FileText, Calendar, Users, Hash, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import Breadcrumb from '@/components/breadcrumb';
import PublicLayout from '@/layouts/public-layout';
import type { PageProps } from '@/types';

interface Manuscript {
    id: number;
    title: string;
    authors: string[];
    abstract: string;
    keywords: string[];
    pdfUrl: string | null;
    doi: string | null;
    volume: string | null;
    issue: string | null;
    page_range: string | null;
    publication_date: string | null;
    institution: string;
}

interface PublicViewProps extends PageProps {
    manuscript: Manuscript;
}

export default function PublicView({ manuscript }: PublicViewProps) {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';

    return (
        <PublicLayout title={`${manuscript.title} - ${journalName}`}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Archives', href: '/archives' },
                        { label: 'Current Issue', href: '/current' },
                        { label: manuscript.title, href: '#' },
                    ]}
                />
                {/* Article Header */}
                <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
                    <div className="mb-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Research Article
                        </span>
                    </div>

                    <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                        {manuscript.title}
                    </h1>

                    <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            <span className="font-medium">
                                {manuscript.authors.join(', ')}
                            </span>
                        </div>
                    </div>
                </header>
                {/* Two-column layout for better width utilization */}
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Main Content - Left Column */}
                    <div className="w-full lg:w-2/3">
                        <div className="space-y-8">
                            {/* Abstract */}
                            <section>
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                    Abstract
                                </h2>
                                <div className="prose prose-gray dark:prose-invert max-w-none">
                                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                                        {manuscript.abstract}
                                    </p>
                                </div>
                            </section>

                            {/* Keywords */}
                            {manuscript.keywords &&
                                manuscript.keywords.length > 0 && (
                                    <section>
                                        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                            Keywords
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {manuscript.keywords.map(
                                                (keyword, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </section>
                                )}

                            {/* PDF Embed (if available) */}
                            {manuscript.pdfUrl && (
                                <section>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                        Full Text
                                    </h2>
                                    <div
                                        className="overflow-hidden rounded-lg border"
                                        style={{ height: '800px' }}
                                    >
                                        <iframe
                                            src={manuscript.pdfUrl}
                                            className="h-full w-full"
                                            title="Manuscript PDF"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        If the PDF doesn't display properly, you
                                        can{' '}
                                        <a
                                            href={manuscript.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            download it here
                                        </a>
                                        .
                                    </p>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="w-full lg:w-1/3">
                        <div className="space-y-6 lg:sticky lg:top-8">
                            {/* Article Metrics */}
                            <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                    Article Information
                                </h3>
                                <div className="space-y-3">
                                    {manuscript.publication_date && (
                                        <div className="flex items-center text-sm">
                                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-300">
                                                Published:{' '}
                                                {new Date(
                                                    manuscript.publication_date,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {manuscript.volume && manuscript.issue && (
                                        <div className="flex items-center text-sm">
                                            <Hash className="mr-2 h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-300">
                                                Volume {manuscript.volume},
                                                Issue {manuscript.issue}
                                            </span>
                                        </div>
                                    )}
                                    {manuscript.page_range && (
                                        <div className="flex items-center text-sm">
                                            <FileText className="mr-2 h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-300">
                                                Pages: {manuscript.page_range}
                                            </span>
                                        </div>
                                    )}
                                    {manuscript.institution && (
                                        <div className="flex items-center text-sm">
                                            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-300">
                                                {manuscript.institution}
                                            </span>
                                        </div>
                                    )}
                                    {manuscript.doi && (
                                        <div className="text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                DOI:{' '}
                                            </span>
                                            <a
                                                href={`https://doi.org/${manuscript.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="break-all text-primary hover:underline"
                                            >
                                                {manuscript.doi}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Citation */}
                            <section className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                    How to Cite
                                </h3>
                                <div className="rounded border bg-white p-4 dark:bg-gray-700">
                                    <p className="font-mono text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                                        {manuscript.authors.join(', ')} (
                                        {manuscript.publication_date
                                            ? new Date(
                                                  manuscript.publication_date,
                                              ).getFullYear()
                                            : 'n.d.'}
                                        ).
                                        {manuscript.title}.{' '}
                                        <em>{journalName}</em>
                                        {manuscript.volume &&
                                            manuscript.issue &&
                                            `, ${manuscript.volume}(${manuscript.issue})`}
                                        {manuscript.page_range &&
                                            `, ${manuscript.page_range}`}
                                        {manuscript.doi &&
                                            `. https://doi.org/${manuscript.doi}`}
                                        .
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            `${manuscript.authors.join(', ')} (${manuscript.publication_date ? new Date(manuscript.publication_date).getFullYear() : 'n.d.'}). ${manuscript.title}. ${journalName}${manuscript.volume && manuscript.issue ? `, ${manuscript.volume}(${manuscript.issue})` : ''}${manuscript.page_range ? `, ${manuscript.page_range}` : ''}${manuscript.doi ? `. https://doi.org/${manuscript.doi}` : ''}.`,
                                        );
                                        toast.success(
                                            'Citation copied to clipboard!',
                                        );
                                    }}
                                    className="mt-3 w-full rounded bg-gray-100 px-3 py-2 text-xs text-gray-700 transition-colors duration-300 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                >
                                    Copy Citation
                                </button>
                            </section>

                            {/* Download Actions */}
                            {manuscript.pdfUrl && (
                                <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                        Download
                                    </h3>
                                    <a
                                        href={manuscript.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Download PDF
                                    </a>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
