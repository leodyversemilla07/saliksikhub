import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Tag, Info, CheckCircle2, AlertCircle, Hash } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
    const abstractWordCount = data.abstract ? data.abstract.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
    const keywordsArray = data.keywords ? data.keywords.split(',').filter((keyword: string) => keyword.trim() !== '') : [];
    const keywordsLength = data.keywords?.length || 0;

    const isAbstractValid = abstractLength >= 100 && abstractWordCount >= 50;
    const isKeywordsValid = keywordsLength >= 3 && keywordsArray.length >= 3;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Abstract Section */}
            <Card className={cn(
                "transition-all duration-300 border-2",
                errors.abstract ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20" :
                    isAbstractValid ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" :
                        "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-full transition-colors",
                                errors.abstract ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                    isAbstractValid ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                                        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            )}>
                                {errors.abstract ? (
                                    <AlertCircle className="w-5 h-5" />
                                ) : isAbstractValid ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <FileText className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <label htmlFor="abstract" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Research Abstract
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    A comprehensive summary of your research work
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant={abstractWordCount >= 50 ? "default" : "secondary"} className="text-xs">
                                {abstractWordCount} words
                            </Badge>
                            <Badge variant={abstractLength >= 100 ? "default" : "secondary"} className="text-xs">
                                {abstractLength}/100+ chars
                            </Badge>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground cursor-help hover:text-foreground transition-colors">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                    <p>Your abstract should include: research objectives, methodology, key findings, and conclusions. Aim for 100-300 words.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Textarea
                            id="abstract"
                            placeholder="Provide a comprehensive summary of your research including objectives, methodology, key findings, and conclusions..."
                            className={cn(
                                "min-h-[180px] text-base resize-none transition-all duration-300 focus:ring-2",
                                errors.abstract ? "border-red-300 focus:border-red-400 focus:ring-red-200" :
                                    isAbstractValid ? "border-green-300 focus:border-green-400 focus:ring-green-200" :
                                        "border-gray-300 focus:border-primary focus:ring-primary/20"
                            )}
                            value={data.abstract}
                            onChange={(e) => setData('abstract', e.target.value)}
                            aria-invalid={!!errors.abstract}
                            aria-errormessage={errors.abstract ? "abstract-error" : undefined}
                        />

                        {/* Word count guidance */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "font-medium",
                                    abstractWordCount < 50 ? "text-orange-600 dark:text-orange-400" :
                                        abstractWordCount > 300 ? "text-orange-600 dark:text-orange-400" :
                                            "text-green-600 dark:text-green-400"
                                )}>
                                    Word count: {abstractWordCount}
                                </span>
                                <span className="text-muted-foreground">
                                    {abstractWordCount < 50 && "• Too short"}
                                    {abstractWordCount >= 50 && abstractWordCount <= 300 && "• Perfect length"}
                                    {abstractWordCount > 300 && "• Consider shortening"}
                                </span>
                            </div>
                        </div>

                        {errors.abstract && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <p id="abstract-error" className="text-sm font-medium">{errors.abstract}</p>
                            </div>
                        )}

                        {!errors.abstract && isAbstractValid && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <p className="text-sm font-medium">Excellent! Your abstract meets all requirements.</p>
                            </div>
                        )}

                        <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            <strong>Abstract Guidelines:</strong> Include your research objective, methodology, key findings, and conclusions. Avoid citations and focus on your contribution.
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Keywords Section */}
            <Card className={cn(
                "transition-all duration-300 border-2",
                errors.keywords ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20" :
                    isKeywordsValid ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" :
                        "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-full transition-colors",
                                errors.keywords ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                    isKeywordsValid ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                                        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            )}>
                                {errors.keywords ? (
                                    <AlertCircle className="w-5 h-5" />
                                ) : isKeywordsValid ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <Tag className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <label htmlFor="keywords" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Research Keywords
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Terms that help readers discover your research
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant={keywordsArray.length >= 3 ? "default" : "secondary"} className="text-xs">
                                {keywordsArray.length} keyword{keywordsArray.length !== 1 ? 's' : ''}
                            </Badge>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground cursor-help hover:text-foreground transition-colors">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                    <p>Choose 3-6 specific keywords that accurately represent your research. Include both broad and specific terms.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            id="keywords"
                            placeholder="e.g. Machine Learning, Natural Language Processing, Deep Learning, Computer Vision..."
                            className={cn(
                                "h-12 text-base transition-all duration-300 focus:ring-2",
                                errors.keywords ? "border-red-300 focus:border-red-400 focus:ring-red-200" :
                                    isKeywordsValid ? "border-green-300 focus:border-green-400 focus:ring-green-200" :
                                        "border-gray-300 focus:border-primary focus:ring-primary/20"
                            )}
                            value={data.keywords}
                            onChange={(e) => setData('keywords', e.target.value)}
                            aria-invalid={!!errors.keywords}
                            aria-errormessage={errors.keywords ? "keywords-error" : undefined}
                        />

                        {/* Keywords Preview */}
                        {keywordsArray.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Hash className="w-4 h-4" />
                                    Keywords Preview:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {keywordsArray.map((keyword: string, index: number) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <Tag className="w-3 h-3 mr-1.5" />
                                            {keyword.trim()}
                                        </Badge>
                                    ))}
                                </div>

                                {keywordsArray.length < 3 && (
                                    <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Add {3 - keywordsArray.length} more keyword{3 - keywordsArray.length !== 1 ? 's' : ''} (minimum 3 required)
                                    </p>
                                )}

                                {keywordsArray.length > 6 && (
                                    <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Consider reducing to 6 or fewer keywords for better focus
                                    </p>
                                )}
                            </div>
                        )}

                        {errors.keywords && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <p id="keywords-error" className="text-sm font-medium">{errors.keywords}</p>
                            </div>
                        )}

                        {!errors.keywords && isKeywordsValid && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <p className="text-sm font-medium">Perfect! Your keywords will help readers find your research.</p>
                            </div>
                        )}

                        <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            <strong>Keyword Tips:</strong> Use specific terms from your field, include both technical and general terms, and separate each keyword with a comma.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

