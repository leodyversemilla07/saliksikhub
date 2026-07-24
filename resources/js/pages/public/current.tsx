import { Link, usePage } from '@inertiajs/react';
import { FileText, Eye, Calendar, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import type { PageProps } from '@/types';

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

export default function Current({ currentIssue }: CurrentPageProps) {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';

    // If no current issue is available, show a message
    if (!currentIssue) {
        return (
            <PublicLayout title={`Current Issue - ${journalName}`}>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="py-16 text-center">
                        <Card className="mx-auto max-w-md">
                            <CardContent className="pt-6">
                                <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h1 className="text-oxford-blue mb-2 font-serif text-2xl font-bold">
                                    Current Issue
                                </h1>
                                <p className="mb-4 text-muted-foreground">
                                    No published issue is currently available.
                                    Please check back later.
                                </p>
                                <Button
                                    variant="outline"
                                    render={<Link href="/archives" />}
                                >
                                    View Archives
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout title={`${currentIssue.fullTitle} - ${journalName}`}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-oxford-blue mb-2 font-serif text-3xl font-bold md:text-4xl">
                        {currentIssue.fullTitle}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Current Issue • Published {currentIssue.publicationDate}
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Issue Information Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-oxford-blue flex items-center gap-2 font-serif">
                                    <BookOpen className="h-5 w-5" />
                                    Issue Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <img
                                        src={currentIssue.coverImageUrl}
                                        alt={`Cover of ${currentIssue.fullTitle}`}
                                        className="mx-auto w-full max-w-[200px] rounded-md object-cover shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="mb-1 text-sm font-medium text-foreground">
                                            Volume & Issue
                                        </div>
                                        <Badge variant="outline">
                                            {currentIssue.volume} •{' '}
                                            {currentIssue.number}
                                        </Badge>
                                    </div>

                                    <div>
                                        <div className="mb-1 text-sm font-medium text-foreground">
                                            Publication Date
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {currentIssue.publicationDate}
                                        </div>
                                    </div>

                                    {currentIssue.specialIssueTitle && (
                                        <div>
                                            <div className="mb-1 text-sm font-medium text-foreground">
                                                Special Issue
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {currentIssue.specialIssueTitle}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <div className="mb-1 text-sm font-medium text-foreground">
                                            Articles
                                        </div>
                                        <Badge variant="secondary">
                                            {currentIssue.articles.length}{' '}
                                            Articles
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Articles List */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Articles in this Issue</CardTitle>
                                <CardDescription>
                                    {currentIssue.articles.length} articles
                                    published in this issue
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {currentIssue.articles.length > 0 ? (
                                    <div className="space-y-6">
                                        {currentIssue.articles.map(
                                            (article) => (
                                                <ArticleCard
                                                    key={article.id}
                                                    article={article}
                                                />
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground">
                                            Articles for this issue will be
                                            listed here.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function ArticleCard({ article }: { article: Article }) {
    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Article Category */}
                    <Badge variant="secondary">
                        {article.category || 'Research Article'}
                    </Badge>

                    {/* Article Title */}
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                            <Link
                                href={article.url}
                                className="transition-colors hover:text-primary"
                            >
                                {article.title}
                            </Link>
                        </h3>
                        <p className="mb-3 text-sm text-muted-foreground">
                            <strong>Authors:</strong> {article.authors}
                        </p>
                    </div>

                    {/* Abstract */}
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {article.abstract}
                    </p>

                    {/* Keywords */}
                    {article.keywords && article.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {article.keywords
                                .slice(0, 5)
                                .map((keyword, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {keyword}
                                    </Badge>
                                ))}
                            {article.keywords.length > 5 && (
                                <span className="self-center text-xs text-muted-foreground">
                                    +{article.keywords.length - 5} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Article Details */}
                    {(article.pages || article.doi || article.institution) && (
                        <div className="space-y-1 text-xs text-muted-foreground">
                            {article.pages && <div>Pages: {article.pages}</div>}
                            {article.doi && <div>DOI: {article.doi}</div>}
                            {article.institution && (
                                <div>Institution: {article.institution}</div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {article.citations !== undefined && (
                                <span>{article.citations} citations</span>
                            )}
                            {article.downloads !== undefined && (
                                <span>{article.downloads} downloads</span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                render={<Link href={article.url} />}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </Button>
                            {article.pdfUrl && (
                                <Button
                                    size="sm"
                                    render={
                                        <a
                                            href={article.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    }
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    PDF
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
