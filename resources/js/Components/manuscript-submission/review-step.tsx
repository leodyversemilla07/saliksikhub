import { FileText, Users, BookOpen, Tag, FileUp, Check, AlertTriangle, CheckCircle2, User, Hash, HardDrive, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ReviewStepProps {
    formValues: {
        title: string;
        authors: string;
        abstract: string;
        keywords: string;
        manuscript?: File | null;
    };
}

export function ReviewStep({ formValues }: ReviewStepProps) {
    const authorCount = formValues.authors.split(',').filter(a => a.trim() !== '').length;
    const keywordCount = formValues.keywords.split(',').filter(k => k.trim() !== '').length;
    const abstractWordCount = formValues.abstract.split(/\s+/).filter(Boolean).length;

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const isAbstractValid = abstractWordCount >= 50 && abstractWordCount <= 300;
    const isFileValid = !!formValues.manuscript;
    const allValid = formValues.title && formValues.authors && formValues.abstract && formValues.keywords && isFileValid;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Overall Status */}
            <Card className={cn(
                "border-2",
                allValid ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" :
                    "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
            )}>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-full",
                            allValid ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                                "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        )}>
                            {allValid ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {allValid ? "Ready for Submission" : "Review Required"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {allValid ? "All sections completed successfully" : "Please review the sections below"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Title Section */}
            <Card className="transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Manuscript Title
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                The main title of your research work
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                            {formValues.title || <span className="text-muted-foreground italic">No title provided</span>}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Authors Section */}
            <Card className="transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Authors
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Research team members and contributors
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {authorCount} author{authorCount !== 1 ? 's' : ''}
                        </Badge>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border">
                        {authorCount > 0 ? (
                            <div className="space-y-3">
                                {formValues.authors.split(',').map((author, index) => {
                                    if (author.trim() === '') return null;
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <Badge variant="secondary" className="font-medium">
                                                    {author.trim()}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {index === 0 ? "Primary Author" : `Co-author ${index}`}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">No authors provided</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Abstract Section */}
            <Card className={cn(
                "transition-all duration-300 border-2",
                !isAbstractValid && formValues.abstract ? "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20" :
                    "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-full",
                                !isAbstractValid && formValues.abstract ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                                    "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            )}>
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Research Abstract
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Summary of your research work
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant={!isAbstractValid && formValues.abstract ? "secondary" : "default"}
                            className="text-xs"
                        >
                            {abstractWordCount} words
                        </Badge>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border max-h-48 overflow-y-auto">
                        {formValues.abstract ? (
                            <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                                {formValues.abstract}
                            </p>
                        ) : (
                            <p className="text-muted-foreground italic">No abstract provided</p>
                        )}
                    </div>

                    {!isAbstractValid && formValues.abstract && (
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-4 h-4" />
                            <p className="text-sm font-medium">
                                {abstractWordCount < 50 ? "Abstract is too short (minimum 50 words)" : "Abstract is too long (maximum 300 words)"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Keywords Section */}
            <Card className="transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Research Keywords
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Terms that help readers discover your work
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {keywordCount} keyword{keywordCount !== 1 ? 's' : ''}
                        </Badge>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border">
                        {keywordCount > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {formValues.keywords.split(',').map((keyword, index) => {
                                    if (keyword.trim() === '') return null;
                                    return (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                        >
                                            <Hash className="w-3 h-3 mr-1.5" />
                                            {keyword.trim()}
                                        </Badge>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">No keywords provided</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Manuscript File Section */}
            <Card className={cn(
                "transition-all duration-300 border-2",
                !isFileValid ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20" :
                    "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
            )}>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-full",
                            !isFileValid ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        )}>
                            {!isFileValid ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Manuscript File
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Your research document for review
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border">
                        {formValues.manuscript ? (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                                    <FileUp className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formValues.manuscript.name}
                                    </p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <HardDrive className="w-4 h-4" />
                                            {formatFileSize(formValues.manuscript.size)}
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            DOCX
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-green-600 dark:text-green-400">
                                    <Check className="w-6 h-6" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-red-700 dark:text-red-300">No file uploaded</p>
                                    <p className="text-sm text-red-600 dark:text-red-400">Please upload your manuscript document</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Important Notices */}
            <div className="space-y-4">
                <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                        <strong>Important:</strong> Once submitted, you cannot edit your manuscript information without contacting the editorial team.
                    </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                        <strong>Confirmation:</strong> By submitting this manuscript, you confirm that this work is original, not under consideration elsewhere, and all authors have approved this submission.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    );
}
