import { FileText, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ContentStepProps {
    data: {
        abstract: string;
        keywords: string;
        [key: string]: string | File | null;
    };
    setData: (name: string, value: string) => void;
    errors: {
        abstract?: string;
        keywords?: string;
        [key: string]: string | undefined;
    };
    clearErrors?: () => void;
}

export function ContentStep({ data, setData, errors }: ContentStepProps) {
    const abstractLength = data.abstract?.length || 0;
    const abstractWordCount = data.abstract
        ? data.abstract
              .trim()
              .split(/\s+/)
              .filter((word) => word.length > 0).length
        : 0;
    const keywordsArray = data.keywords
        ? data.keywords
              .split(',')
              .filter((keyword: string) => keyword.trim() !== '')
        : [];
    const keywordsLength = data.keywords?.length || 0;

    const isAbstractValid = abstractLength >= 100 && abstractWordCount >= 50;
    const isKeywordsValid = keywordsLength >= 3 && keywordsArray.length >= 3;

    return (
        <div className="animate-fadeIn space-y-8">
            {/* Abstract Section */}
            <Card className="border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full border p-2 transition-colors">
                                {errors.abstract ? (
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                ) : isAbstractValid ? (
                                    <CheckCircle2 className="text-success h-5 w-5" />
                                ) : (
                                    <FileText className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="abstract"
                                    className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                                >
                                    Research Abstract
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    A comprehensive summary of your research
                                    work
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    abstractWordCount >= 50
                                        ? 'default'
                                        : 'secondary'
                                }
                                className="text-xs"
                            >
                                {abstractWordCount} words
                            </Badge>
                            <Badge
                                variant={
                                    abstractLength >= 100
                                        ? 'default'
                                        : 'secondary'
                                }
                                className="text-xs"
                            >
                                {abstractLength}/100+ chars
                            </Badge>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Textarea
                            id="abstract"
                            placeholder="Provide a comprehensive summary of your research including objectives, methodology, key findings, and conclusions..."
                            className={cn(
                                'min-h-[180px] resize-none border text-base transition-all duration-300 focus:ring-2',
                                errors.abstract
                                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                                    : isAbstractValid
                                      ? 'border-success focus:border-success focus:ring-success/20'
                                      : 'border focus:border-primary focus:ring-primary/20',
                            )}
                            value={data.abstract}
                            onChange={(e) =>
                                setData('abstract', e.target.value)
                            }
                            aria-invalid={!!errors.abstract}
                            aria-errormessage={
                                errors.abstract ? 'abstract-error' : undefined
                            }
                        />

                        {/* Word count guidance */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                                <span
                                    className={cn(
                                        'font-medium',
                                        abstractWordCount < 50
                                            ? 'text-orange-600 dark:text-orange-400'
                                            : abstractWordCount > 300
                                              ? 'text-orange-600 dark:text-orange-400'
                                              : 'text-green-600 dark:text-green-400',
                                    )}
                                >
                                    Word count: {abstractWordCount}
                                </span>
                                <span className="text-muted-foreground">
                                    {abstractWordCount < 50 && '• Too short'}
                                    {abstractWordCount >= 50 &&
                                        abstractWordCount <= 300 &&
                                        '• Perfect length'}
                                    {abstractWordCount > 300 &&
                                        '• Consider shortening'}
                                </span>
                            </div>
                        </div>

                        {errors.abstract && (
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <p
                                    id="abstract-error"
                                    className="text-sm font-medium"
                                >
                                    {errors.abstract}
                                </p>
                            </div>
                        )}

                        {!errors.abstract && isAbstractValid && (
                            <div className="text-success flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    Excellent! Your abstract meets all
                                    requirements.
                                </p>
                            </div>
                        )}

                        <div className="rounded-lg bg-background p-3 text-xs text-muted-foreground">
                            <strong>Abstract Guidelines:</strong> Include your
                            research objective, methodology, key findings, and
                            conclusions. Avoid citations and focus on your
                            contribution.
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Keywords Section */}
            <Card className="border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full border p-2 transition-colors">
                                {errors.keywords ? (
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                ) : isKeywordsValid ? (
                                    <CheckCircle2 className="text-success h-5 w-5" />
                                ) : (
                                    <Tag className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="keywords"
                                    className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                                >
                                    Research Keywords
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Terms that help readers discover your
                                    research
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    keywordsArray.length >= 3
                                        ? 'default'
                                        : 'secondary'
                                }
                                className="text-xs"
                            >
                                {keywordsArray.length} keyword
                                {keywordsArray.length !== 1 ? 's' : ''}
                            </Badge>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Input
                            id="keywords"
                            placeholder="e.g. Machine Learning, Natural Language Processing, Deep Learning, Computer Vision..."
                            className={cn(
                                'h-12 border text-base transition-all duration-300 focus:ring-2',
                                errors.keywords
                                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                                    : isKeywordsValid
                                      ? 'border-success focus:border-success focus:ring-success/20'
                                      : 'border focus:border-primary focus:ring-primary/20',
                            )}
                            value={data.keywords}
                            onChange={(e) =>
                                setData('keywords', e.target.value)
                            }
                            aria-invalid={!!errors.keywords}
                            aria-errormessage={
                                errors.keywords ? 'keywords-error' : undefined
                            }
                        />

                        {/* Keywords Preview */}
                        {keywordsArray.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Tag className="h-4 w-4" />
                                    Keywords Preview:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {keywordsArray.map(
                                        (keyword: string, index: number) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                                            >
                                                <Tag className="mr-1.5 h-3 w-3" />
                                                {keyword.trim()}
                                            </Badge>
                                        ),
                                    )}
                                </div>

                                {keywordsArray.length < 3 && (
                                    <p className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400">
                                        <AlertCircle className="h-4 w-4" />
                                        Add {3 - keywordsArray.length} more
                                        keyword
                                        {3 - keywordsArray.length !== 1
                                            ? 's'
                                            : ''}{' '}
                                        (minimum 3 required)
                                    </p>
                                )}

                                {keywordsArray.length > 6 && (
                                    <p className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400">
                                        <AlertCircle className="h-4 w-4" />
                                        Consider reducing to 6 or fewer keywords
                                        for better focus
                                    </p>
                                )}
                            </div>
                        )}

                        {errors.keywords && (
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <p
                                    id="keywords-error"
                                    className="text-sm font-medium"
                                >
                                    {errors.keywords}
                                </p>
                            </div>
                        )}

                        {!errors.keywords && isKeywordsValid && (
                            <div className="text-success flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    Perfect! Your keywords will help readers
                                    find your research.
                                </p>
                            </div>
                        )}

                        <div className="rounded-lg bg-background p-3 text-xs text-muted-foreground">
                            <strong>Keyword Tips:</strong> Use specific terms
                            from your field, include both technical and general
                            terms, and separate each keyword with a comma.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
