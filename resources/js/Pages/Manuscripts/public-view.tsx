import Footer from '@/components/site-footer';
import Header from '@/components/site-header';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText, Calendar, Users, Hash, MapPin } from 'lucide-react';
import { Breadcrumb } from '@/components/breadcrumb';
import { toast } from 'sonner';

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

export default function PublicView({ auth, manuscript }: PublicViewProps) {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title={`${manuscript.title} - Daluyang Dunong MinSU Research Journal`} />
            <Header auth={auth} />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Archives', href: '/archives' },
                            { label: 'Current Issue', href: '/current' },
                            { label: manuscript.title, href: '#' },
                        ]}
                        className="mb-6"
                    />                    {/* Article Header */}
                    <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                Research Article
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {manuscript.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span className="font-medium">{manuscript.authors.join(', ')}</span>
                            </div>
                        </div>
                    </header>{/* Two-column layout for better width utilization */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content - Left Column */}
                        <div className="w-full lg:w-2/3">
                            <div className="space-y-8">
                                {/* Abstract */}
                                <section>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Abstract</h2>
                                    <div className="prose prose-gray dark:prose-invert max-w-none">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {manuscript.abstract}
                                        </p>
                                    </div>
                                </section>

                                {/* Keywords */}
                                {manuscript.keywords && manuscript.keywords.length > 0 && (
                                    <section>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Keywords</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {manuscript.keywords.map((keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* PDF Embed (if available) */}
                                {manuscript.pdfUrl && (
                                    <section>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Full Text</h2>
                                        <div className="border rounded-lg overflow-hidden" style={{ height: '800px' }}>
                                            <iframe
                                                src={manuscript.pdfUrl}
                                                className="w-full h-full"
                                                title="Manuscript PDF"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            If the PDF doesn't display properly, you can{' '}
                                            <a
                                                href={manuscript.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#18652c] dark:text-[#3fb65e] hover:underline"
                                            >
                                                download it here
                                            </a>.
                                        </p>
                                    </section>
                                )}
                            </div>
                        </div>

                        {/* Sidebar - Right Column */}
                        <div className="w-full lg:w-1/3">
                            <div className="space-y-6 lg:sticky lg:top-8">
                                {/* Article Metrics */}
                                <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Article Information</h3>
                                    <div className="space-y-3">
                                        {manuscript.publication_date && (
                                            <div className="flex items-center text-sm">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    Published: {new Date(manuscript.publication_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                        {manuscript.volume && manuscript.issue && (
                                            <div className="flex items-center text-sm">
                                                <Hash className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    Volume {manuscript.volume}, Issue {manuscript.issue}
                                                </span>
                                            </div>
                                        )}
                                        {manuscript.page_range && (
                                            <div className="flex items-center text-sm">
                                                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    Pages: {manuscript.page_range}
                                                </span>
                                            </div>
                                        )}
                                        {manuscript.institution && (
                                            <div className="flex items-center text-sm">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {manuscript.institution}
                                                </span>
                                            </div>
                                        )}
                                        {manuscript.doi && (
                                            <div className="text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">DOI: </span>
                                                <a
                                                    href={`https://doi.org/${manuscript.doi}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#18652c] dark:text-[#3fb65e] hover:underline break-all"
                                                >
                                                    {manuscript.doi}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Citation */}
                                <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How to Cite</h3>
                                    <div className="bg-white dark:bg-gray-700 rounded border p-4">
                                        <p className="text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
                                            {manuscript.authors.join(', ')} ({manuscript.publication_date ? new Date(manuscript.publication_date).getFullYear() : 'n.d.'}).
                                            {manuscript.title}. <em>Daluyang Dunong MinSU Research Journal</em>
                                            {manuscript.volume && manuscript.issue && `, ${manuscript.volume}(${manuscript.issue})`}
                                            {manuscript.page_range && `, ${manuscript.page_range}`}
                                            {manuscript.doi && `. https://doi.org/${manuscript.doi}`}.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${manuscript.authors.join(', ')} (${manuscript.publication_date ? new Date(manuscript.publication_date).getFullYear() : 'n.d.'}). ${manuscript.title}. Daluyang Dunong MinSU Research Journal${manuscript.volume && manuscript.issue ? `, ${manuscript.volume}(${manuscript.issue})` : ''}${manuscript.page_range ? `, ${manuscript.page_range}` : ''}${manuscript.doi ? `. https://doi.org/${manuscript.doi}` : ''}.`
                                            );
                                            toast.success('Citation copied to clipboard!');
                                        }}
                                        className="mt-3 w-full text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded transition-colors duration-300"
                                    >
                                        Copy Citation
                                    </button>
                                </section>

                                {/* Download Actions */}
                                {manuscript.pdfUrl && (
                                    <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Download</h3>
                                        <a
                                            href={manuscript.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#18652c] hover:bg-[#145024] dark:bg-[#3fb65e] dark:hover:bg-[#35a051] text-white text-sm font-medium rounded-md transition-colors duration-300"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            Download PDF
                                        </a>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
