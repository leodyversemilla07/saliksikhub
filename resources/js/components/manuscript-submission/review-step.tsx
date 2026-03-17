import {
    FileText,
    Users,
    AlertTriangle,
    CheckCircle2,
    Info,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    const authorCount = formValues.authors
        .split(',')
        .filter((a) => a.trim() !== '').length;
    const keywordCount = formValues.keywords
        .split(',')
        .filter((k) => k.trim() !== '').length;
    const abstractWordCount = formValues.abstract
        .split(/\s+/)
        .filter(Boolean).length;

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) {
return '';
}

        if (bytes < 1024) {
return `${bytes} bytes`;
}

        if (bytes < 1024 * 1024) {
return `${(bytes / 1024).toFixed(1)} KB`;
}

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const isAbstractValid = abstractWordCount >= 50 && abstractWordCount <= 300;
    const isFileValid = !!formValues.manuscript;
    const allValid =
        formValues.title &&
        formValues.authors &&
        formValues.abstract &&
        formValues.keywords &&
        isFileValid;

    return (
        <div className="animate-fadeIn space-y-8">
            {/* Overall Status */}
            <Card
                className={cn(
                    'border bg-card text-card-foreground',
                    allValid
                        ? 'border-success bg-success/10'
                        : 'border-warning bg-warning/10',
                )}
            >
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                'rounded-full border p-2',
                                allValid
                                    ? 'bg-success text-success'
                                    : 'bg-warning text-warning',
                            )}
                        >
                            {allValid ? (
                                <CheckCircle2 className="h-5 w-5" />
                            ) : (
                                <Info className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                {allValid
                                    ? 'Ready for Submission'
                                    : 'Review Required'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {allValid
                                    ? 'All sections completed successfully'
                                    : 'Please review the sections below'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Title Section */}
            <Card className="border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full border p-2">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                Manuscript Title
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                The main title of your research work
                            </p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-background p-4">
                        <p className="text-base leading-relaxed font-medium">
                            {formValues.title || (
                                <span className="text-muted-foreground italic">
                                    No title provided
                                </span>
                            )}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Authors Section */}
            <Card className="border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full border p-2">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
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
                    <div className="rounded-lg border bg-background p-4">
                        {authorCount > 0 ? (
                            <div className="space-y-3">
                                {formValues.authors
                                    .split(',')
                                    .map((author, index) => {
                                        if (author.trim() === '') {
return null;
}

                                        return (
                                            <span key={index}>
                                                {author.trim()}
                                            </span>
                                        );
                                    })}
                            </div>
                        ) : (
                            <span className="text-muted-foreground italic">
                                No authors provided
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Abstract Section */}
            <Card
                className={cn(
                    'border bg-card text-card-foreground transition-all duration-300',
                    !isAbstractValid && formValues.abstract
                        ? 'border-warning bg-warning/10'
                        : '',
                )}
            >
                <CardContent className="space-y-4 p-6">
                    <h3 className="text-lg font-semibold">Abstract</h3>
                    <div className="max-h-48 overflow-y-auto rounded-lg border bg-background p-4">
                        {formValues.abstract ? (
                            <span>{formValues.abstract}</span>
                        ) : (
                            <span className="text-muted-foreground italic">
                                No abstract provided
                            </span>
                        )}
                    </div>
                    {!isAbstractValid && formValues.abstract && (
                        <div className="text-warning flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Abstract should be 50-300 words.</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Keywords Section */}
            <Card className="border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="space-y-4 p-6">
                    <h3 className="text-lg font-semibold">Keywords</h3>
                    <div className="rounded-lg border bg-background p-4">
                        {keywordCount > 0 ? (
                            <span>{formValues.keywords}</span>
                        ) : (
                            <span className="text-muted-foreground italic">
                                No keywords provided
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Manuscript File Section */}
            <Card
                className={cn(
                    'border bg-card text-card-foreground transition-all duration-300',
                    !isFileValid
                        ? 'border-destructive bg-destructive/10'
                        : 'border-success bg-success/10',
                )}
            >
                <CardContent className="space-y-4 p-6">
                    <h3 className="text-lg font-semibold">Manuscript File</h3>
                    <div className="rounded-lg border bg-background p-4">
                        {formValues.manuscript ? (
                            <span>
                                {formValues.manuscript.name} (
                                {formatFileSize(formValues.manuscript.size)})
                            </span>
                        ) : (
                            <span className="text-muted-foreground italic">
                                No file uploaded
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Important Notices */}
            <div className="space-y-4">
                <Alert className="border-warning bg-warning/10">
                    <AlertTriangle className="text-warning h-4 w-4" />
                    <AlertDescription className="text-warning">
                        <strong>Important:</strong> Once submitted, you cannot
                        edit your manuscript information without contacting the
                        editorial team.
                    </AlertDescription>
                </Alert>
                <Alert className="border-info bg-info/10">
                    <Info className="text-info h-4 w-4" />
                    <AlertDescription className="text-info">
                        <strong>Confirmation:</strong> By submitting this
                        manuscript, you confirm that this work is original, not
                        under consideration elsewhere, and all authors have
                        approved this submission.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    );
}
