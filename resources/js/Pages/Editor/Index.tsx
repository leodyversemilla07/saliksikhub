import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'

import type { Manuscript } from '@/types'
import { ManuscriptStatus } from '@/types'
import editor from '@/routes/editor'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { MoreVertical, ArrowUpRight, CheckCircle2, Edit3 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

import {
    Eye,
    FileText,
    CalendarDays,
    XCircle,
    Info,
    Upload,
    Loader2
} from 'lucide-react'

interface ManuscriptTableProps {
    manuscripts: Manuscript[]
}

interface AuthorBadgesProps {
    authors: string | string[] | null;
}

const AuthorBadges = ({ authors }: AuthorBadgesProps) => {
    const authorList = Array.isArray(authors)
        ? authors
        : (typeof authors === 'string' && authors.trim() ? authors.split(',').map(author => author.trim()) : []);

    if (authorList.length === 0) {
        return <span className="text-gray-400 dark:text-gray-500">No authors</span>;
    }

    const allAuthorsText = authorList.join(', ');

    return (
        <div className="flex flex-wrap gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex flex-wrap gap-1">
                        {authorList.slice(0, 1).map((author, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {author}
                            </Badge>
                        ))}
                        {authorList.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                                +{authorList.length - 1}
                            </Badge>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm font-medium">All Authors:</p>
                    <p className="text-xs">{allAuthorsText}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

export default function Index({ manuscripts }: ManuscriptTableProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [manuscriptToReview, setManuscriptToReview] = useState<number | null>(null)
    const [showReviewDialog, setShowReviewDialog] = useState(false)
    const [manuscriptToCopyEdit, setManuscriptToCopyEdit] = useState<number | null>(null)
    const [showCopyEditDialog, setShowCopyEditDialog] = useState(false)
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: editor.dashboard.url(),
        },
        {
            label: 'Manuscripts',
            href: editor.indexManuscripts.url(),
        }
    ];

    const handleViewManuscript = (id: number) => {
        setIsLoading(true);
        router.visit(editor.manuscripts.show.url({ id }), {
            onFinish: () => setIsLoading(false)
        });
    };

    const handleSetUnderReviewClick = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click event
        setManuscriptToReview(id);
        setShowReviewDialog(true);
    };

    const handleStartCopyEditingClick = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click event
        setManuscriptToCopyEdit(id);
        setShowCopyEditDialog(true);
    };

    const handleSetUnderReview = () => {
        if (!manuscriptToReview) return;

        setIsLoading(true);
        router.post(editor.manuscripts.set_under_review.url({ id: manuscriptToReview }), {}, {
            onFinish: () => {
                setIsLoading(false);
                setShowReviewDialog(false);
                setManuscriptToReview(null);
            },
            preserveScroll: true,
        });
    };

    const handleStartCopyEditing = () => {
        if (!manuscriptToCopyEdit) return;

        setIsLoading(true);
        console.log('Starting copy editing for manuscript:', manuscriptToCopyEdit);

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        fetch(editor.manuscripts.start_copyediting.url({ id: manuscriptToCopyEdit }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken || '',
            },
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Error starting copy editing');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                window.location.href = editor.indexManuscripts.url();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to start copy editing: ' + error.message);
            })
            .finally(() => {
                setIsLoading(false);
                setShowCopyEditDialog(false);
                setManuscriptToCopyEdit(null);
            });
    };

    const handleEditorialDecision = (id: number) => {
        setIsLoading(true);
        router.visit(editor.manuscripts.create_decision.url({ id }), {
            onFinish: () => setIsLoading(false)
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setUploadFile(file);
        setUploadError(null);
    };

    const handleUploadFinalized = () => {
        if (!manuscriptToCopyEdit || !uploadFile) {
            setUploadError("Please select a file to upload");
            return;
        }

        setIsLoading(true);

        router.post(editor.manuscripts.upload_finalized.url({ id: manuscriptToCopyEdit }), {
            manuscript_file: uploadFile
        }, {
            forceFormData: true, // Ensure FormData is used
            onProgress: (progress) => {
                console.log('Upload progress:', progress);
            },
            onSuccess: () => {
                console.log('Upload successful');
                window.location.href = editor.indexManuscripts.url();
            },
            onError: (errors) => {
                console.error('Upload error:', errors);
                setUploadError(errors.manuscript_file || 'Failed to upload finalized manuscript');
            },
            onFinish: () => {
                setIsLoading(false);
                setShowUploadDialog(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Submitted Manuscripts" />

            <div className="bg-card dark:bg-dark rounded-lg shadow-sm border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author/s</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {manuscripts.map((manuscript) => (
                            <TableRow key={manuscript.id}>
                                <TableCell>{manuscript.id}</TableCell>
                                <TableCell>{manuscript.title}</TableCell>
                                <TableHead>
                                    <AuthorBadges authors={manuscript.authors} />
                                </TableHead>
                                <TableCell>
                                    <Badge variant="secondary">{manuscript.status}</Badge>
                                </TableCell>
                                <TableHead>
                                    {new Date(manuscript.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </TableHead>
                                <TableCell>
                                    {new Date(manuscript.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="p-1">
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleViewManuscript(manuscript.id)}>
                                                <Eye className="h-4 w-4 mr-2" /> View Details
                                            </DropdownMenuItem>
                                            {manuscript.status === ManuscriptStatus.SUBMITTED && (
                                                <DropdownMenuItem onClick={(e) => handleSetUnderReviewClick(manuscript.id, e)}>
                                                    <ArrowUpRight className="h-4 w-4 mr-2" /> Set Under Review
                                                </DropdownMenuItem>
                                            )}
                                            {manuscript.status === ManuscriptStatus.UNDER_REVIEW && (
                                                <DropdownMenuItem onClick={() => handleEditorialDecision(manuscript.id)}>
                                                    <CheckCircle2 className="h-4 w-4 mr-2" /> Editorial Decision
                                                </DropdownMenuItem>
                                            )}
                                            {manuscript.status === ManuscriptStatus.ACCEPTED && (
                                                <DropdownMenuItem onClick={(e) => handleStartCopyEditingClick(manuscript.id, e)}>
                                                    <Edit3 className="h-4 w-4 mr-2" /> Start Copy Editing
                                                </DropdownMenuItem>
                                            )}
                                            {manuscript.status === ManuscriptStatus.IN_COPYEDITING && (
                                                <DropdownMenuItem onClick={() => {
                                                    setManuscriptToCopyEdit(manuscript.id);
                                                    setShowUploadDialog(true);
                                                }}>
                                                    <Upload className="h-4 w-4 mr-2" /> Upload Finalized Manuscript
                                                </DropdownMenuItem>
                                            )}
                                            {manuscript.status === ManuscriptStatus.READY_FOR_PUBLICATION && (
                                                <DropdownMenuItem onClick={() => {
                                                    setIsLoading(true);
                                                    router.visit(editor.manuscripts.prepare_publication_form.url({ id: manuscript.id }), {
                                                        onFinish: () => setIsLoading(false)
                                                    });
                                                }}>
                                                    <CalendarDays className="h-4 w-4 mr-2" /> Prepare Publication
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showReviewDialog} onOpenChange={(open) => {
                setShowReviewDialog(open);
                if (!open) setManuscriptToReview(null);
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Set to Under Review</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                            This will change the manuscript status to "Under Review" and notify relevant parties. Are you sure you want to continue?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start">
                            <Eye className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
                            <span>
                                <span className="font-medium block">
                                    {manuscripts.find(m => m.id === manuscriptToReview)?.title}
                                </span>
                                <span className="text-blue-600 dark:text-blue-400 text-xs mt-1 block">
                                    by {manuscripts.find(m => m.id === manuscriptToReview)?.authors}
                                </span>
                            </span>
                        </p>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowReviewDialog(false)}
                            disabled={isLoading}
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSetUnderReview}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add new Copy Editing dialog */}
            <Dialog open={showCopyEditDialog} onOpenChange={(open) => {
                setShowCopyEditDialog(open);
                if (!open) setManuscriptToCopyEdit(null);
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Start Copy Editing</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                            Copy editing will be conducted outside of this system. Confirm to proceed with the copy editing process.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                            <p className="flex items-start">
                                <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                <span>
                                    Copy editing will be performed <strong>outside</strong> of this system
                                </span>
                            </p>
                            <p className="flex items-start">
                                <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                <span>
                                    The manuscript status will change to "In Copyediting"
                                </span>
                            </p>
                            <p className="flex items-start">
                                <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                <span>
                                    You'll need to upload the final version after the process is complete
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                                <span className="font-medium block">
                                    {manuscripts.find(m => m.id === manuscriptToCopyEdit)?.title}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs mt-1 block">
                                    {/* Fix: authors might be a string, not an array */}
                                    by {manuscripts.find(m => m.id === manuscriptToCopyEdit)?.authors || ''}
                                </span>
                            </span>
                        </p>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowCopyEditDialog(false)}
                            disabled={isLoading}
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStartCopyEditing}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : "Start Copy Editing"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Upload Finalized Manuscript Dialog */}
            <Dialog open={showUploadDialog} onOpenChange={(open) => {
                setShowUploadDialog(open);
                if (!open) {
                    setManuscriptToCopyEdit(null);
                    setUploadFile(null);
                    setUploadError(null);
                }
            }}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">Upload Finalized Manuscript</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                            Upload the finalized manuscript after copy editing. This will be the version sent to the author for final approval.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                                <span className="font-medium block">
                                    {manuscripts.find(m => m.id === manuscriptToCopyEdit)?.title}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs mt-1 block">
                                    by {manuscripts.find(m => m.id === manuscriptToCopyEdit)?.authors || ''}
                                </span>
                            </span>
                        </p>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div className="flex flex-col">
                            <label htmlFor="manuscript-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Finalized Manuscript File (PDF)
                            </label>

                            <div className={`mt-1 border-2 border-dashed rounded-lg transition-colors ${uploadFile
                                ? 'bg-accent/20 border-primary'
                                : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                }`}>
                                <div className="flex flex-col items-center justify-center py-6 px-4">
                                    {!uploadFile ? (
                                        <>
                                            <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-1">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                PDF files only (max. 20MB)
                                            </p>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <FileText className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                                            <p className="text-sm font-medium text-green-700 dark:text-green-300 text-center">
                                                {uploadFile.name}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                {(uploadFile.size / 1024 / 1024).toFixed(2)} MB • PDF
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-3 h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                                                onClick={() => setUploadFile(null)}
                                            >
                                                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                                Remove file
                                            </Button>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="manuscript-file"
                                        name="manuscript_file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${uploadFile ? 'pointer-events-none' : ''}`}
                                    />
                                </div>
                            </div>

                            {!uploadFile && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    The copy-edited manuscript should be properly formatted and ready for author approval
                                </p>
                            )}

                            {uploadError && (
                                <Alert variant="destructive" className="mt-3">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{uploadError}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                            <li className="flex items-start">
                                <Info className="h-4 w-4 mr-1.5 mt-0.5" />
                                <span>The finalized manuscript will be sent to the author for approval.</span>
                            </li>
                            <li className="flex items-start">
                                <Info className="h-4 w-4 mr-1.5 mt-0.5" />
                                <span>This upload should include all copy editing changes and formatting.</span>
                            </li>
                        </ul>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowUploadDialog(false)}
                            disabled={isLoading}
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUploadFinalized}
                            disabled={isLoading || !uploadFile}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                    Uploading...
                                </span>
                            ) : "Upload Finalized Manuscript"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    )
}
