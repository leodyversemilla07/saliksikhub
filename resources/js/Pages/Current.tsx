import Footer from '@/components/site-footer';
import Header from '@/components/site-header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, Eye } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface Article {
    id: number;
    title: string;
    authors: string;
    abstract: string;
    keywords: string[];
    url: string;
    pdfUrl: string;
    doi: string;
    pages: string;
    citations: number;
    downloads: number;
    category: string;
    institution: string;
}

interface CurrentIssue {
    volume: string;
    number: string;
    year: number;
    fullTitle: string;
    specialIssueTitle: string;
    publicationDate: string;
    coverImageUrl: string;
    articles: Article[];
}

interface CurrentPageProps extends PageProps {
    currentIssue: CurrentIssue | null;
}

export default function Current({ auth, currentIssue }: CurrentPageProps) {
    // If no current issue is available, show a message
    if (!currentIssue) {
        return (
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Head title="Current Issue - Daluyang Dunong MinSU Research Journal" />
                <Header auth={auth} />

                <main className="flex-grow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center py-16">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Current Issue
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                No published issue is currently available. Please check back later.
                            </p>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title={`${currentIssue.fullTitle} - Daluyang Dunong MinSU Research Journal`} />
            <Header auth={auth} />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/archives">Archives</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-[#18652c] dark:text-[#3fb65e]">{currentIssue.fullTitle}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Page Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                        {currentIssue.fullTitle}
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-2/3">

                            <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
                                <div className="w-full md:w-auto order-2 md:order-1">
                                    <img
                                        src={currentIssue.coverImageUrl}
                                        alt={`Cover of ${currentIssue.fullTitle}`}
                                        className="w-auto h-auto max-w-[150px] sm:max-w-xs object-cover rounded shadow-lg border border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                <div className="order-1 md:order-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                        Published: {currentIssue.publicationDate}
                                    </p>
                                    {currentIssue.specialIssueTitle && (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                            Special Issue: {currentIssue.specialIssueTitle}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <section className="mb-10">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2">Articles</h2>
                                {currentIssue.articles.length > 0 ? (
                                    <div className="space-y-8">
                                        {currentIssue.articles.map((article) => (
                                            <ArticleCard key={article.id} article={article} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300">Articles for this issue will be listed here.</p>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ArticleCard({ article }: { article: Article }) {
    return (
        <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
                <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        {article.category || 'Research Article'}
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    <Link href={article.url} className="hover:text-[#18652c] dark:hover:text-[#3fb65e] transition-colors duration-300">
                        {article.title}
                    </Link>
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">By: {article.authors}</p>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                    {article.abstract}
                </p>

                {article.keywords && article.keywords.length > 0 && (
                    <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                            {article.keywords.slice(0, 5).map((keyword, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                >
                                    {keyword}
                                </span>
                            ))}
                            {article.keywords.length > 5 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{article.keywords.length - 5} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {(article.pages || article.doi) && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {article.pages && <span>Pages: {article.pages}</span>}
                        {article.pages && article.doi && <span> | </span>}
                        {article.doi && <span>DOI: {article.doi}</span>}
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {article.institution && (
                            <span>{article.institution}</span>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <Link
                            href={article.url}
                            className="text-xs flex items-center px-2.5 py-1 rounded-md text-[#18652c] dark:text-[#3fb65e] hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300"
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                        </Link>
                        {article.pdfUrl && (
                            <a
                                href={article.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs flex items-center px-2.5 py-1 bg-[#18652c] hover:bg-[#145024] dark:bg-[#3fb65e] dark:hover:bg-[#35a051] text-white rounded-md transition-colors duration-300"
                            >
                                <FileText className="w-4 h-4 mr-1" />
                                PDF
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
