import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Info, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DetailsStepProps {
    data: {
        title: string;
        authors: string;
        [key: string]: string | File | null;
    };
    setData: (name: string, value: string) => void;
    errors: {
        title?: string;
        authors?: string;
        [key: string]: string | undefined;
    };
    clearErrors?: () => void;
}

export function DetailsStep({ data, setData, errors }: DetailsStepProps) {
    const titleLength = data.title?.length || 0;
    const authorsArray = data.authors ? data.authors.split(',').filter((author: string) => author.trim() !== '') : [];
    const authorsLength = data.authors?.length || 0;
    
    const isTitleValid = titleLength >= 10;
    const isAuthorsValid = authorsLength >= 3 && authorsArray.length > 0;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Title Section */}
            <Card className={cn(
                "transition-all duration-300 border-2",
                errors.title ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20" :
                isTitleValid ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" :
                "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-full transition-colors",
                                errors.title ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                isTitleValid ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                                "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            )}>
                                {errors.title ? (
                                    <AlertCircle className="w-5 h-5" />
                                ) : isTitleValid ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <FileText className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <label htmlFor="title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Manuscript Title
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    A clear, descriptive title for your research
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant={isTitleValid ? "default" : "secondary"} className="text-xs">
                                {titleLength}/10+ chars
                            </Badge>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground cursor-help hover:text-foreground transition-colors">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                    <p>The title should be concise yet descriptive, accurately reflecting your research content and scope.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Input
                            id="title"
                            placeholder="Enter a descriptive and compelling title for your manuscript..."
                            className={cn(
                                "h-12 text-base transition-all duration-300 focus:ring-2",
                                errors.title ? "border-red-300 focus:border-red-400 focus:ring-red-200" :
                                isTitleValid ? "border-green-300 focus:border-green-400 focus:ring-green-200" :
                                "border-gray-300 focus:border-primary focus:ring-primary/20"
                            )}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            aria-invalid={!!errors.title}
                            aria-errormessage={errors.title ? "title-error" : undefined}
                        />

                        {errors.title && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <p id="title-error" className="text-sm font-medium">{errors.title}</p>
                            </div>
                        )}

                        {!errors.title && isTitleValid && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <p className="text-sm font-medium">Great! Your title meets the requirements.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Authors Section */}
            <Card className={cn(
                "transition-all duration-300 border-2",
                errors.authors ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20" :
                isAuthorsValid ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" :
                "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-full transition-colors",
                                errors.authors ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                isAuthorsValid ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                                "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            )}>
                                {errors.authors ? (
                                    <AlertCircle className="w-5 h-5" />
                                ) : isAuthorsValid ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <Users className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <label htmlFor="authors" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Authors
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    All contributors to this research work
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant={authorsArray.length > 0 ? "default" : "secondary"} className="text-xs">
                                {authorsArray.length} author{authorsArray.length !== 1 ? 's' : ''}
                            </Badge>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground cursor-help hover:text-foreground transition-colors">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                    <p>List all authors who made significant contributions to this work. Separate names with commas.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            id="authors"
                            placeholder="e.g. Dr. Jane Smith, Prof. John Doe, Dr. Alice Johnson..."
                            className={cn(
                                "h-12 text-base transition-all duration-300 focus:ring-2",
                                errors.authors ? "border-red-300 focus:border-red-400 focus:ring-red-200" :
                                isAuthorsValid ? "border-green-300 focus:border-green-400 focus:ring-green-200" :
                                "border-gray-300 focus:border-primary focus:ring-primary/20"
                            )}
                            value={data.authors}
                            onChange={(e) => setData('authors', e.target.value)}
                            aria-invalid={!!errors.authors}
                            aria-errormessage={errors.authors ? "authors-error" : undefined}
                        />

                        {/* Author Chips Preview */}
                        {authorsArray.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <User className="w-4 h-4" />
                                    Author Preview:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {authorsArray.map((author: string, index: number) => (
                                        <Badge 
                                            key={index} 
                                            variant="outline" 
                                            className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <User className="w-3 h-3 mr-1.5" />
                                            {author.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {errors.authors && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <p id="authors-error" className="text-sm font-medium">{errors.authors}</p>
                            </div>
                        )}

                        {!errors.authors && isAuthorsValid && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <p className="text-sm font-medium">Perfect! All authors have been listed.</p>
                            </div>
                        )}

                        <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            <strong>Tip:</strong> List authors in the order they should appear in the publication. Include full names and separate each author with a comma.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
