import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/Components/ui/form';
import { useState, useRef } from 'react';
import { Upload, FileType, X, File as FileIcon, CheckCircle, Paperclip, Trash2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { Progress } from '@/Components/ui/progress';

export function FileUploadStep() {
    const { control, setValue, watch } = useFormContext();
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const manuscriptFile = watch('manuscript');

    // Simulate upload progress for better UX
    const simulateProgress = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                const newProgress = prev + Math.random() * 15;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return newProgress;
            });
        }, 200);

        setTimeout(() => {
            clearInterval(interval);
            setUploadProgress(100);
        }, 1500);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setValue('manuscript', e.dataTransfer.files[0]);
            simulateProgress();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setValue('manuscript', e.target.files[0]);
            simulateProgress();
        }
    };

    const handleRemoveFile = () => {
        setValue('manuscript', null);
        setUploadProgress(0);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = () => {
        if (!manuscriptFile) return null;

        // Always use Word document icon since we only accept .doc/.docx files
        return (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H9C7.9 3 7 3.9 7 5V27C7 28.1 7.9 29 9 29H23C24.1 29 25 28.1 25 27V9L19 3Z" fill="#4285F4" />
                <path d="M19 9H25L19 3V9Z" fill="#1976D2" />
                <path d="M14.55 21L12 13H13.75L15.4 18.65L17.05 13H18.8L16.25 21H14.55Z" fill="white" />
            </svg>
        );
    };

    return (
        <FormField
            control={control}
            name="manuscript"
            render={({ field, fieldState }) => (
                <FormItem className="animate-fadeIn">
                    <FormLabel htmlFor="manuscript" className="flex items-center gap-2 text-base font-semibold mb-2">
                        <span className="flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Upload Manuscript
                        </span>
                    </FormLabel>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="col-span-2">
                            <FormDescription>
                                Upload your manuscript file in DOC/DOCX format. The document should include all figures, tables,
                                and references. Make sure your file follows our formatting guidelines.
                            </FormDescription>
                        </div>
                        <div className="flex items-center justify-center p-2 bg-primary/5 rounded-lg border dark:bg-primary/10">
                            <div className="text-center text-sm">
                                <p className="font-medium text-primary">File Requirements</p>
                                <p className="text-muted-foreground text-xs mt-1">DOC/DOCX format • Max 10MB</p>
                            </div>
                        </div>
                    </div>

                    {manuscriptFile ? (
                        <div className="border rounded-lg overflow-hidden shadow-sm dark:border-gray-700">
                            {uploadProgress < 100 && (
                                <Progress value={uploadProgress} className="h-1 rounded-none" />
                            )}
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-300">
                                        {getFileIcon()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{manuscriptFile.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(manuscriptFile.size)}
                                            </p>
                                            {uploadProgress === 100 && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                                    Ready
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveFile}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <FormControl>
                            <div
                                className={cn(
                                    "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
                                    dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/30 hover:bg-primary/5",
                                    fieldState.error && "border-red-500 bg-red-50",
                                    "dark:border-gray-700 dark:hover:border-primary/30 dark:hover:bg-primary/10"
                                )}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={triggerFileInput}
                            >
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <FileType className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div className="text-center space-y-2">
                                    <div>
                                        <p className="text-sm font-medium">
                                            <span className="text-primary">Click anywhere</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            DOC/DOCX (max 10MB)
                                        </p>
                                    </div>
                                </div>
                                <input
                                    id="manuscript"
                                    ref={inputRef}
                                    type="file"
                                    accept=".doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    tabIndex={-1}
                                    aria-label="Upload manuscript file"
                                />
                            </div>
                        </FormControl>
                    )}

                    {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                </FormItem>
            )}
        />
    );
}

