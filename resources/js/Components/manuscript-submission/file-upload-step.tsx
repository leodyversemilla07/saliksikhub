import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, Info, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

export function FileUploadStep({ data, setData, errors, progress }: FileUploadStepProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    // Validate file when it changes
    useEffect(() => {
        if (!data.manuscript) return;
        
        setValidationMessage(null);
        
        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (data.manuscript.size > maxSize) {
            setValidationMessage(`File is too large. Maximum size is 10MB.`);
        }
        
        // Validate file type (only DOCX)
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const getProgressPercentage = () => {
        if (progress === null) return 0;
        if (typeof progress === 'number') return progress;
        return progress.percentage || 0;
    };
    
    const hasError = !!errors.manuscript || !!validationMessage;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className={hasError ? 'form-error space-y-2' : 'space-y-2'}>
                <div className="flex items-center justify-between">
                    <label htmlFor="manuscript" className="flex items-center gap-2 font-medium">
                        <span className="flex items-center gap-2">
                            <File className="w-4 h-4 text-primary" />
                            Manuscript Document
                        </span>
                    </label>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="text-muted-foreground cursor-help">
                                <Info className="w-4 h-4" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-sm text-xs">
                            <p>Upload your manuscript in DOCX format. Maximum file size is 10MB.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg p-6 transition-colors duration-200 cursor-pointer text-center",
                        isDragOver ? "border-primary bg-primary/5" :
                            hasError ? "border-red-500 bg-red-50 dark:bg-red-900/10" :
                                data.manuscript ? "border-green-500 bg-green-50 dark:bg-green-900/10" :
                                    "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {data.manuscript ? (
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "mb-3 w-12 h-12 rounded-full flex items-center justify-center",
                                hasError 
                                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            )}>
                                {hasError ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                            </div>
                            <div className="font-medium">{data.manuscript.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {formatBytes(data.manuscript.size)} · {data.manuscript.type}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 gap-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile();
                                }}
                            >
                                <X className="w-4 h-4" /> Remove File
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:bg-primary/20">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div className="font-medium">Drag and drop your file here</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                or click to browse (DOCX format, max 10MB)
                            </div>
                            <Button variant="outline" size="sm" className="mt-3">
                                Browse Files
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

                {progress !== null && getProgressPercentage() > 0 && getProgressPercentage() < 100 && (
                    <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span>Uploading...</span>
                            <span>{getProgressPercentage()}%</span>
                        </div>
                        <Progress value={getProgressPercentage()} className="h-2" />
                    </div>
                )}

                <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">
                        Upload your manuscript in DOCX format.
                    </p>
                </div>

                {validationMessage && (
                    <Alert variant="destructive" className="mt-3 py-2 text-sm">
                        <AlertDescription className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {validationMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {errors.manuscript && <p id="manuscript-error" className="text-sm text-red-500 mt-1">{errors.manuscript}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 dark:bg-blue-900/20 dark:border-blue-800/50">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Manuscript Requirements
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc pl-5">
                    <li>File format: DOCX (Microsoft Word)</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Include all figures, tables, and references</li>
                    <li>Remove any identifying information for blind peer review</li>
                    <li>Follow the formatting guidelines in the author instructions</li>
                </ul>
            </div>
        </div>
    );
}

