import Footer from '@/components/site-footer';
import Header from '@/components/site-header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, Eye, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
            <div className="flex flex-col min-h-screen bg-background">
                <Head title="Current Issue - Daluyang Dunong MinSU Research Journal" />
                <Header auth={auth} />

                <main className="grow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center py-16">
                            <Card className="max-w-md mx-auto">
                                <CardContent className="pt-6">
                                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h1 className="font-serif text-2xl font-bold text-oxford-blue mb-2">
                                        Current Issue
                                    </h1>
                                    <p className="text-muted-foreground mb-4">
                                        No published issue is currently available. Please check back later.
                                    </p>
                                    <Button asChild variant="outline">
                                        <Link href="/archives">View Archives</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Head title={`${currentIssue.fullTitle} - Daluyang Dunong MinSU Research Journal`} />
            <Header auth={auth} />

            <main className="grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-oxford-blue mb-2">
                            {currentIssue.fullTitle}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Current Issue • Published {currentIssue.publicationDate}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Issue Information Sidebar */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-serif flex items-center gap-2 text-oxford-blue">
                                        <BookOpen className="h-5 w-5" />
                                        Issue Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <img
                                            src={currentIssue.coverImageUrl}
                                            alt={`Cover of ${currentIssue.fullTitle}`}
                                            className="w-full max-w-[200px] mx-auto object-cover rounded-md shadow-sm"
                                        />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-sm font-medium text-foreground mb-1">Volume & Issue</div>
                                            <Badge variant="outline">{currentIssue.volume} • {currentIssue.number}</Badge>
                                        </div>
                                        
                                        <div>
                                            <div className="text-sm font-medium text-foreground mb-1">Publication Date</div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {currentIssue.publicationDate}
                                            </div>
                                        </div>
                                        
                                        {currentIssue.specialIssueTitle && (
                                            <div>
                                                <div className="text-sm font-medium text-foreground mb-1">Special Issue</div>
                                                <p className="text-sm text-muted-foreground">{currentIssue.specialIssueTitle}</p>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <div className="text-sm font-medium text-foreground mb-1">Articles</div>
                                            <Badge variant="secondary">{currentIssue.articles.length} Articles</Badge>
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
                                        {currentIssue.articles.length} articles published in this issue
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {currentIssue.articles.length > 0 ? (
                                        <div className="space-y-6">
                                            {currentIssue.articles.map((article) => (
                                                <ArticleCard key={article.id} article={article} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">Articles for this issue will be listed here.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
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
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Article Category */}
                    <Badge variant="secondary">
                        {article.category || 'Research Article'}
                    </Badge>

                    {/* Article Title */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            <Link href={article.url} className="hover:text-primary transition-colors">
                                {article.title}
                            </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            <strong>Authors:</strong> {article.authors}
                        </p>
                    </div>

                    {/* Abstract */}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {article.abstract}
                    </p>

                    {/* Keywords */}
                    {article.keywords && article.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {article.keywords.slice(0, 5).map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {keyword}
                                </Badge>
                            ))}
                            {article.keywords.length > 5 && (
                                <span className="text-xs text-muted-foreground self-center">
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
                            {article.institution && <div>Institution: {article.institution}</div>}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {article.citations !== undefined && (
                                <span>{article.citations} citations</span>
                            )}
                            {article.downloads !== undefined && (
                                <span>{article.downloads} downloads</span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={article.url}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </Link>
                            </Button>
                            {article.pdfUrl && (
                                <Button size="sm" asChild>
                                    <a
                                        href={article.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        PDF
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
