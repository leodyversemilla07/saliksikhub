import { ClipboardList, FileText, Users, BookOpen, Tag, FileUp, Check, AlertTriangle } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { Alert, AlertDescription } from '@/Components/ui/alert';

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

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-center mb-6">
                <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20">
                    <ClipboardList className="h-7 w-7 text-primary" />
                </div>
            </div>

            <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
                Please review your submission details carefully. Once submitted, modifications
                will require contacting the editorial team.
            </p>

            <div className="space-y-8 rounded-lg border p-6 shadow-sm bg-white/50 dark:bg-gray-800/20">
                <div className="space-y-3">
                    <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-sm font-medium">Manuscript Title</h3>
                    </div>
                    <div className="ml-7 bg-white dark:bg-gray-800 p-3 rounded-md border shadow-sm">
                        <p className="text-base font-medium">{formValues.title}</p>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-primary" />
                            <h3 className="text-sm font-medium">Authors</h3>
                        </div>
                        <Badge variant="outline" className="text-xs font-normal">
                            {authorCount} author{authorCount !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                    <div className="ml-7 bg-white dark:bg-gray-800 p-3 rounded-md border shadow-sm">
                        <div className="space-y-2">
                            {formValues.authors.split(',').map((author, index) => {
                                if (author.trim() === '') return null;
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                            {index + 1}
                                        </div>
                                        <span className="text-sm font-medium">{author.trim()}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            <h3 className="text-sm font-medium">Abstract</h3>
                        </div>
                        <Badge
                            variant={abstractWordCount < 100 || abstractWordCount > 300 ? "destructive" : "outline"}
                            className="text-xs font-normal"
                        >
                            {abstractWordCount} words
                        </Badge>
                    </div>
                    <div className="ml-7 max-h-40 overflow-auto bg-white dark:bg-gray-800 p-3 rounded-md border shadow-sm text-sm">
                        {formValues.abstract}
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Tag className="h-5 w-5 mr-2 text-primary" />
                            <h3 className="text-sm font-medium">Keywords</h3>
                        </div>
                        <Badge variant="outline" className="text-xs font-normal">
                            {keywordCount} keyword{keywordCount !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                    <div className="ml-7 flex flex-wrap gap-2">
                        {formValues.keywords.split(',').map((keyword, index) => {
                            if (keyword.trim() === '') return null;

                            return (
                                <Badge key={index} variant="secondary" className="px-3 py-1">
                                    {keyword.trim()}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                    <div className="flex items-center">
                        <FileUp className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-sm font-medium">Manuscript File</h3>
                    </div>
                    <div className="ml-7">
                        {formValues.manuscript ? (
                            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-md border shadow-sm">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                    <Check className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{formValues.manuscript.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(formValues.manuscript.size)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-600/30 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                                <span className="text-sm text-amber-800 dark:text-amber-200">No file uploaded</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Alert className="bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-600/30 mt-8">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                    Once submitted, you cannot edit your manuscript information without contacting the editorial team.
                </AlertDescription>
            </Alert>

            <Alert className="mt-4 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-600/30">
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                    By submitting this manuscript, you confirm that this work is original, not under consideration elsewhere,
                    and all authors have approved this submission.
                </AlertDescription>
            </Alert>
        </div>
    );
}
