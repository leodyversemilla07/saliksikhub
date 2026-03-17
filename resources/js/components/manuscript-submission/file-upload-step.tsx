import {
    Upload,
    File,
    Info,
    X,
    CheckCircle2,
    AlertCircle,
    FileText,
    HardDrive,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface FileUploadStepProps {
    data: {
        manuscript: File | null;
        [key: string]: string | File | null;
    };
    setData: (name: string, value: File | null) => void;
    errors: {
        manuscript?: string;
        [key: string]: string | undefined;
    };
    progress: { percentage?: number } | number | null;
    clearErrors?: () => void;
}

export function FileUploadStep({
    data,
    setData,
    errors,
    progress,
}: FileUploadStepProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [validationMessage, setValidationMessage] = useState<string | null>(
        null,
    );

    // Validate file when it changes
    useEffect(() => {
        if (!data.manuscript) {
return;
}

        setValidationMessage(null);

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes

        if (data.manuscript.size > maxSize) {
            setValidationMessage(`File is too large. Maximum size is 10MB.`);
        }

        // Validate file type (only DOCX)
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedTypes.includes(data.manuscript.type)) {
            setValidationMessage(`Only DOCX files are allowed.`);
        }
    }, [data.manuscript]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('manuscript', e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('manuscript', e.dataTransfer.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setData('manuscript', null);
        setValidationMessage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) {
return '0 Bytes';
}

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };

    const getProgressPercentage = () => {
        if (progress === null) {
return 0;
}

        if (typeof progress === 'number') {
return progress;
}

        return progress.percentage || 0;
    };

    const hasError = !!errors.manuscript || !!validationMessage;
    const isFileValid = data.manuscript && !hasError;

    return (
        <div className="animate-fadeIn space-y-8">
            {/* File Upload Section */}
            <Card className="border border-2 bg-card text-card-foreground transition-all duration-300">
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full border p-2 transition-colors">
                                {hasError ? (
                                    <AlertCircle className="h-5 w-5" />
                                ) : isFileValid ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <FileText className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="manuscript"
                                    className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                                >
                                    Manuscript Document
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Upload your research manuscript in DOCX
                                    format
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {data.manuscript && (
                                <>
                                    <Badge
                                        variant={
                                            isFileValid
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className="text-xs"
                                    >
                                        {formatBytes(data.manuscript.size)}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        DOCX
                                    </Badge>
                                </>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="cursor-help text-muted-foreground transition-colors hover:text-foreground">
                                        <Info className="h-4 w-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                    <p>
                                        Upload your manuscript in DOCX format.
                                        Maximum file size is 10MB. Remove
                                        identifying information for blind
                                        review.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div
                            className="cursor-pointer rounded-lg border border-2 border-dashed p-8 text-center transition-all duration-300"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {data.manuscript ? (
                                <div className="flex flex-col items-center space-y-4">
                                    <div
                                        className={cn(
                                            'flex h-16 w-16 items-center justify-center rounded-full transition-colors',
                                            hasError
                                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                                        )}
                                    >
                                        {hasError ? (
                                            <AlertCircle className="h-8 w-8" />
                                        ) : (
                                            <CheckCircle2 className="h-8 w-8" />
                                        )}
                                    </div>

                                    <div className="space-y-2 text-center">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {data.manuscript.name}
                                        </div>
                                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <HardDrive className="h-4 w-4" />
                                                {formatBytes(
                                                    data.manuscript.size,
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <File className="h-4 w-4" />
                                                DOCX Document
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFile();
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                        Remove File
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                                        <Upload className="h-8 w-8" />
                                    </div>

                                    <div className="space-y-2 text-center">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {isDragOver
                                                ? 'Drop your file here'
                                                : 'Drag and drop your manuscript'}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            or click to browse your computer
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Supports DOCX format • Maximum 10MB
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Choose File
                                    </Button>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                id="manuscript"
                                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {/* Upload Progress */}
                        {progress !== null &&
                            getProgressPercentage() > 0 &&
                            getProgressPercentage() < 100 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            Uploading manuscript...
                                        </span>
                                        <span className="font-medium text-primary">
                                            {getProgressPercentage()}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={getProgressPercentage()}
                                        className="h-3"
                                    />
                                </div>
                            )}

                        {/* Validation Messages */}
                        {validationMessage && (
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    {validationMessage}
                                </p>
                            </div>
                        )}
                        {errors.manuscript && (
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    {errors.manuscript}
                                </p>
                            </div>
                        )}
                        {!hasError && isFileValid && (
                            <div className="text-success flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    File uploaded successfully and ready for
                                    submission!
                                </p>
                            </div>
                        )}

                        <div className="rounded-lg bg-gray-50 p-3 text-xs text-muted-foreground dark:bg-gray-800/50">
                            <strong>Upload Guidelines:</strong> Ensure your
                            manuscript is in DOCX format, includes all figures
                            and references, and has identifying information
                            removed for blind review.
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Requirements Section */}
            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
                <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Info className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                Manuscript Requirements
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Please ensure your manuscript meets these
                                requirements
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        File Format
                                    </div>
                                    <div className="text-xs text-blue-700 dark:text-blue-300">
                                        Microsoft Word DOCX format only
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        File Size
                                    </div>
                                    <div className="text-xs text-blue-700 dark:text-blue-300">
                                        Maximum 10MB file size
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Content
                                    </div>
                                    <div className="text-xs text-blue-700 dark:text-blue-300">
                                        Include all figures, tables, and
                                        references
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Anonymization
                                    </div>
                                    <div className="text-xs text-blue-700 dark:text-blue-300">
                                        Remove identifying information for blind
                                        review
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Formatting
                                    </div>
                                    <div className="text-xs text-blue-700 dark:text-blue-300">
                                        Follow journal formatting guidelines
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Language
                                    </div>
                                    <div className="text-xs text-blue-700 dark:text-blue-300">
                                        Clear, professional academic writing
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
