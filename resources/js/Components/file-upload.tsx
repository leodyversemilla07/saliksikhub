import { useState, useCallback, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Upload, 
    File, 
    X, 
    CheckCircle2, 
    AlertCircle,
    FileText,
    Image as ImageIcon,
    Table as TableIcon,
    Paperclip
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileType, FileRequirements } from '@/types/review';

interface FileUploadProps {
    manuscriptId: number;
    fileType: FileType;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    requirements?: FileRequirements;
}

export function FileUpload({ 
    manuscriptId, 
    fileType, 
    onSuccess, 
    onError,
    requirements 
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
        file_type: fileType,
    });

    const getFileIcon = (type: FileType) => {
        switch (type) {
            case 'main_document':
            case 'cover_letter':
                return <FileText className="h-12 w-12" />;
            case 'figure':
                return <ImageIcon className="h-12 w-12" />;
            case 'table':
                return <TableIcon className="h-12 w-12" />;
            case 'supplementary':
                return <Paperclip className="h-12 w-12" />;
            default:
                return <File className="h-12 w-12" />;
        }
    };

    const validateFile = (file: File): string | null => {
        if (!requirements) return null;

        // Check file size
        if (file.size > requirements.max_file_size) {
            return `File size exceeds maximum of ${requirements.max_file_size_mb}MB`;
        }

        // Check MIME type (if not wildcard)
        if (!requirements.accepted_mime_types.includes('*/*')) {
            if (!requirements.accepted_mime_types.includes(file.type)) {
                return `Invalid file type. Accepted types: ${requirements.accepted_mime_types.join(', ')}`;
            }
        }

        return null;
    };

    const handleFileSelect = (file: File) => {
        const error = validateFile(file);
        if (error) {
            onError?.(error);
            return;
        }

        setData('file', file);
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleUpload = () => {
        if (!data.file) return;

        post(route('manuscripts.files.upload', manuscriptId), {
            onSuccess: () => {
                reset();
                setUploadProgress(0);
                onSuccess?.();
            },
            onError: (errors) => {
                onError?.(Object.values(errors).join(', '));
            },
            onProgress: (progress) => {
                setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
            },
        });
    };

    const handleRemove = () => {
        setData('file', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {getFileIcon(fileType)}
                    <span>{requirements?.label || 'Upload File'}</span>
                </CardTitle>
                {requirements && (
                    <CardDescription>
                        {requirements.description}
                        {requirements.is_required && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Drop Zone */}
                {!data.file && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                            isDragging 
                                ? "border-primary bg-primary/5" 
                                : "border-gray-300 hover:border-primary hover:bg-gray-50"
                        )}
                    >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm font-medium mb-1">
                            Drop file here or click to browse
                        </p>
                        {requirements && (
                            <p className="text-xs text-gray-500">
                                Max size: {requirements.max_file_size_mb}MB
                            </p>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleInputChange}
                            accept={requirements?.accepted_mime_types.join(',')}
                        />
                    </div>
                )}

                {/* Selected File */}
                {data.file && !processing && (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <File className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="font-medium">{data.file.name}</p>
                                <p className="text-sm text-gray-500">
                                    {formatFileSize(data.file.size)}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Upload Progress */}
                {processing && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                    </div>
                )}

                {/* Errors */}
                {errors.file && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.file}</AlertDescription>
                    </Alert>
                )}

                {/* Upload Button */}
                {data.file && !processing && (
                    <Button 
                        onClick={handleUpload} 
                        className="w-full"
                        disabled={processing}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                    </Button>
                )}

                {/* File Requirements */}
                {requirements && !data.file && (
                    <div className="text-xs text-gray-500 space-y-1">
                        <p className="font-medium">Requirements:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Max size: {requirements.max_file_size_mb}MB</li>
                            {requirements.accepted_mime_types.length > 0 && 
                             !requirements.accepted_mime_types.includes('*/*') && (
                                <li>Accepted formats: {requirements.accepted_mime_types.join(', ')}</li>
                            )}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
