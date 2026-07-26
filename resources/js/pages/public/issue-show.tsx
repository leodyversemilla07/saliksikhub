import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    FileText,
    Hash,
    Users,
    Download,
    ExternalLink,
    ArrowLeft,
    Quote,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import type { PageProps } from '@/types';

interface ArticleData {
    id: number;
    title: string;
    slug: string;
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

interface IssueData {
    id: number;
    slug: string;
    volume: number;
    number: number;
    title: string | null;
    description: string | null;
    year: number;
    fullTitle: string;
    publicationDate: string;
    coverImageUrl: string | null;
    doi: string | null;
    theme: string | null;
    editorial_note: string | null;
    articles: ArticleData[];
}

interface IssueShowProps extends PageProps {
    issue: IssueData;
}

export default function IssueShow({ issue }: IssueShowProps) {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';

    return (
        <PublicLayout title={`${issue.fullTitle} | ${journalName}`}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back link */}
                <Link
                    href="/archives"
                    className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Archives
                </Link>

                {/* Issue Header */}
                <div className="mb-8 grid gap-6 md:grid-cols-[240px_1fr]">
                    {/* Cover Image */}
                    <div>
                        {issue.coverImageUrl ? (
                            <img
                                src={issue.coverImageUrl}
                                alt={`Cover for Vol. ${issue.volume} No. ${issue.number}`}
                                className="w-full rounded-lg border object-cover shadow-sm"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border bg-muted">
                                <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                            </div>
                        )}
                    </div>

                    {/* Issue Details */}
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                                Volume {issue.volume}, Number {issue.number}
                            </h1>
                            {issue.title && (
                                <p className="mt-2 text-lg text-muted-foreground">
                                    {issue.title}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Badge variant="secondary" className="gap-1">
                                <Calendar className="h-3 w-3" />
                                {issue.publicationDate}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <FileText className="h-3 w-3" />
                                {issue.articles.length} article
                                {issue.articles.length !== 1 ? 's' : ''}
                            </Badge>
                            {issue.theme && (
                                <Badge variant="outline">{issue.theme}</Badge>
                            )}
                            {issue.doi && (
                                <Badge variant="outline" className="gap-1">
                                    <Hash className="h-3 w-3" />
                                    {issue.doi}
                                </Badge>
                            )}
                        </div>

                        {issue.description && (
                            <p className="leading-relaxed text-muted-foreground">
                                {issue.description}
                            </p>
                        )}

                        {issue.editorial_note && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <Quote className="mt-1 h-5 w-5 shrink-0 text-primary/60" />
                                        <div>
                                            <p className="mb-1 text-sm font-medium text-foreground">
                                                Editorial Note
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {issue.editorial_note}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                <Separator className="mb-8" />

                {/* Articles Section */}
                <div>
                    <h2 className="mb-6 text-xl font-semibold text-foreground">
                        Articles in this Issue
                    </h2>

                    {issue.articles.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium">
                                    No Articles Yet
                                </h3>
                                <p className="text-muted-foreground">
                                    This issue has no published articles yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {issue.articles.map((article, index) => (
                                <Card
                                    key={article.id}
                                    className="transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="p-6">
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                                {index + 1}
                                            </span>
                                            {article.category && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {article.category}
                                                </Badge>
                                            )}
                                        </div>

                                        <h3 className="mb-2 text-lg leading-snug font-semibold text-foreground">
                                            <Link
                                                href={article.url}
                                                className="hover:text-primary hover:underline"
                                            >
                                                {article.title}
                                            </Link>
                                        </h3>

                                        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-3.5 w-3.5" />
                                            <span>{article.authors}</span>
                                        </div>

                                        {article.abstract && (
                                            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                                {article.abstract}
                                            </p>
                                        )}

                                        {article.keywords.length > 0 && (
                                            <div className="mb-4 flex flex-wrap gap-1.5">
                                                {article.keywords.map((kw) => (
                                                    <Badge
                                                        key={kw}
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {kw}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                            {article.doi && (
                                                <a
                                                    href={`https://doi.org/${article.doi}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-primary hover:underline"
                                                >
                                                    <Hash className="h-3 w-3" />
                                                    {article.doi}
                                                </a>
                                            )}
                                            {article.pages && (
                                                <span className="inline-flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    pp. {article.pages}
                                                </span>
                                            )}
                                            {article.institution && (
                                                <span>
                                                    {article.institution}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <Link href={article.url}>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="gap-1.5"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    View Article
                                                </Button>
                                            </Link>
                                            {article.pdfUrl && (
                                                <a
                                                    href={article.pdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1.5"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        PDF
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
