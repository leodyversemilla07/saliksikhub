import { Head, router } from '@inertiajs/react';
import { MoreVertical, ArrowUpRight, CheckCircle2, Edit3 } from 'lucide-react';
import {
    Eye,
    FileText,
    CalendarDays,
    XCircle,
    Info,
    Upload,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';

import type { Manuscript } from '@/types';
import { ManuscriptStatus } from '@/types';
import editor from '@/routes/editor';



interface ManuscriptTableProps {
    manuscripts: Manuscript[];
}

interface AuthorBadgesProps {
    authors: string | string[] | null;
}

const AuthorBadges = ({ authors }: AuthorBadgesProps) => {
    const authorList = Array.isArray(authors)
        ? authors
        : typeof authors === 'string' && authors.trim()
          ? authors.split(',').map((author) => author.trim())
          : [];

    if (authorList.length === 0) {
        return (
            <span className="text-gray-400 dark:text-gray-500">No authors</span>
        );
    }

    const allAuthorsText = authorList.join(', ');

    return (
        <div className="flex flex-wrap gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex flex-wrap gap-1">
                        {authorList.slice(0, 1).map((author, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                            >
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
    const [isLoading, setIsLoading] = useState(false);
    const [manuscriptToReview, setManuscriptToReview] = useState<number | null>(
        null,
    );
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [manuscriptToCopyEdit, setManuscriptToCopyEdit] = useState<
        number | null
    >(null);
    const [showCopyEditDialog, setShowCopyEditDialog] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: editor.dashboard.url(),
        },
        {
            label: 'Manuscripts',
            href: editor.indexManuscripts.url(),
        },
    ];

    const handleViewManuscript = (id: number) => {
        setIsLoading(true);
        router.visit(editor.manuscripts.show.url({ id }), {
            onFinish: () => setIsLoading(false),
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
        if (!manuscriptToReview) {
return;
}

        setIsLoading(true);
        router.post(
            editor.manuscripts.set_under_review.url({ id: manuscriptToReview }),
            {},
            {
                onFinish: () => {
                    setIsLoading(false);
                    setShowReviewDialog(false);
                    setManuscriptToReview(null);
                },
                preserveScroll: true,
            },
        );
    };

    const handleStartCopyEditing = () => {
        if (!manuscriptToCopyEdit) {
return;
}

        setIsLoading(true);

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

        fetch(
            editor.manuscripts.start_copyediting.url({
                id: manuscriptToCopyEdit,
            }),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'same-origin',
            },
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(
                            err.message || 'Error starting copy editing',
                        );
                    });
                }

                return response.json();
            })
            .then(() => {
                window.location.href = editor.indexManuscripts.url();
            })
            .catch((error) => {
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
            onFinish: () => setIsLoading(false),
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setUploadFile(file);
        setUploadError(null);
    };

    const handleUploadFinalized = () => {
        if (!manuscriptToCopyEdit || !uploadFile) {
            setUploadError('Please select a file to upload');

            return;
        }

        setIsLoading(true);

        router.post(
            editor.manuscripts.upload_finalized.url({
                id: manuscriptToCopyEdit,
            }),
            {
                manuscript_file: uploadFile,
            },
            {
                forceFormData: true, // Ensure FormData is used
                onSuccess: () => {
                    window.location.href = editor.indexManuscripts.url();
                },
                onError: (errors) => {
                    console.error('Upload error:', errors);
                    setUploadError(
                        errors.manuscript_file ||
                            'Failed to upload finalized manuscript',
                    );
                },
                onFinish: () => {
                    setIsLoading(false);
                    setShowUploadDialog(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Submitted Manuscripts" />

            <div className="dark:bg-dark overflow-hidden rounded-lg border border-border bg-card shadow-sm">
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
                                    <AuthorBadges
                                        authors={manuscript.authors}
                                    />
                                </TableHead>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {manuscript.status}
                                    </Badge>
                                </TableCell>
                                <TableHead>
                                    {new Date(
                                        manuscript.created_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </TableHead>
                                <TableCell>
                                    {new Date(
                                        manuscript.updated_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </TableCell>
                                <TableCell
                                    className="text-right"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="p-1"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleViewManuscript(
                                                        manuscript.id,
                                                    )
                                                }
                                            >
                                                <Eye className="mr-2 h-4 w-4" />{' '}
                                                View Details
                                            </DropdownMenuItem>
                                            {manuscript.status ===
                                                ManuscriptStatus.SUBMITTED && (
                                                <DropdownMenuItem
                                                    onClick={(e) =>
                                                        handleSetUnderReviewClick(
                                                            manuscript.id,
                                                            e,
                                                        )
                                                    }
                                                >
                                                    <ArrowUpRight className="mr-2 h-4 w-4" />{' '}
                                                    Set Under Review
                                                </DropdownMenuItem>
                                            )}
                                            {manuscript.status ===
                                                ManuscriptStatus.UNDER_REVIEW && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleEditorialDecision(
                                                            manuscript.id,
                                                        )
                                                    }
                                                >
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                                    Editorial Decision
                                                </DropdownMenuItem>
                                            )}
                                            {manuscript.status ===
                                                ManuscriptStatus.ACCEPTED && (
                                                <DropdownMenuItem
                                                    onClick={(e) =>
                                                        handleStartCopyEditingClick(
                                                            manuscript.id,
                                                            e,
                                                        )
                                                    }
                                                >
                                                    <Edit3 className="mr-2 h-4 w-4" />{' '}
                                                    Start Copy Editing
                                                </DropdownMenuItem>
                                            )}
                                            {manuscript.status ===
                                                ManuscriptStatus.IN_COPYEDITING && (
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setManuscriptToCopyEdit(
                                                            manuscript.id,
                                                        );
                                                        setShowUploadDialog(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />{' '}
                                                    Upload Finalized Manuscript
                                                </DropdownMenuItem>
                                            )}
                                            {manuscript.status ===
                                                ManuscriptStatus.READY_FOR_PUBLICATION && (
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setIsLoading(true);
                                                        router.visit(
                                                            editor.manuscripts.prepare_publication_form.url(
                                                                {
                                                                    id: manuscript.id,
                                                                },
                                                            ),
                                                            {
                                                                onFinish: () =>
                                                                    setIsLoading(
                                                                        false,
                                                                    ),
                                                            },
                                                        );
                                                    }}
                                                >
                                                    <CalendarDays className="mr-2 h-4 w-4" />{' '}
                                                    Prepare Publication
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

            <Dialog
                open={showReviewDialog}
                onOpenChange={(open) => {
                    setShowReviewDialog(open);

                    if (!open) {
setManuscriptToReview(null);
}
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Set to Under Review
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            This will change the manuscript status to "Under
                            Review" and notify relevant parties. Are you sure
                            you want to continue?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <p className="flex items-start text-sm text-blue-700 dark:text-blue-300">
                            <Eye className="mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                            <span>
                                <span className="block font-medium">
                                    {
                                        manuscripts.find(
                                            (m) => m.id === manuscriptToReview,
                                        )?.title
                                    }
                                </span>
                                <span className="mt-1 block text-xs text-blue-600 dark:text-blue-400">
                                    by{' '}
                                    {
                                        manuscripts.find(
                                            (m) => m.id === manuscriptToReview,
                                        )?.authors
                                    }
                                </span>
                            </span>
                        </p>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowReviewDialog(false)}
                            disabled={isLoading}
                            className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSetUnderReview}
                            disabled={isLoading}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg
                                        className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : (
                                'Confirm'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add new Copy Editing dialog */}
            <Dialog
                open={showCopyEditDialog}
                onOpenChange={(open) => {
                    setShowCopyEditDialog(open);

                    if (!open) {
setManuscriptToCopyEdit(null);
}
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Start Copy Editing
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            Copy editing will be conducted outside of this
                            system. Confirm to proceed with the copy editing
                            process.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                            <p className="flex items-start">
                                <Info className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                                <span>
                                    Copy editing will be performed{' '}
                                    <strong>outside</strong> of this system
                                </span>
                            </p>
                            <p className="flex items-start">
                                <Info className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                                <span>
                                    The manuscript status will change to "In
                                    Copyediting"
                                </span>
                            </p>
                            <p className="flex items-start">
                                <Info className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                                <span>
                                    You'll need to upload the final version
                                    after the process is complete
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                        <p className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                            <FileText className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                            <span>
                                <span className="block font-medium">
                                    {
                                        manuscripts.find(
                                            (m) =>
                                                m.id === manuscriptToCopyEdit,
                                        )?.title
                                    }
                                </span>
                                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                                    {/* Fix: authors might be a string, not an array */}
                                    by{' '}
                                    {manuscripts.find(
                                        (m) => m.id === manuscriptToCopyEdit,
                                    )?.authors || ''}
                                </span>
                            </span>
                        </p>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowCopyEditDialog(false)}
                            disabled={isLoading}
                            className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStartCopyEditing}
                            disabled={isLoading}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg
                                        className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : (
                                'Start Copy Editing'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Upload Finalized Manuscript Dialog */}
            <Dialog
                open={showUploadDialog}
                onOpenChange={(open) => {
                    setShowUploadDialog(open);

                    if (!open) {
                        setManuscriptToCopyEdit(null);
                        setUploadFile(null);
                        setUploadError(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Upload Finalized Manuscript
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
                            Upload the finalized manuscript after copy editing.
                            This will be the version sent to the author for
                            final approval.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                        <p className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                            <FileText className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                            <span>
                                <span className="block font-medium">
                                    {
                                        manuscripts.find(
                                            (m) =>
                                                m.id === manuscriptToCopyEdit,
                                        )?.title
                                    }
                                </span>
                                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                                    by{' '}
                                    {manuscripts.find(
                                        (m) => m.id === manuscriptToCopyEdit,
                                    )?.authors || ''}
                                </span>
                            </span>
                        </p>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div className="flex flex-col">
                            <label
                                htmlFor="manuscript-file"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Finalized Manuscript File (PDF)
                            </label>

                            <div
                                className={`mt-1 rounded-lg border-2 border-dashed transition-colors ${
                                    uploadFile
                                        ? 'border-primary bg-accent/20'
                                        : 'border-gray-300 hover:border-primary dark:border-gray-600'
                                }`}
                            >
                                <div className="flex flex-col items-center justify-center px-4 py-6">
                                    {!uploadFile ? (
                                        <>
                                            <Upload className="mb-3 h-10 w-10 text-gray-400 dark:text-gray-500" />
                                            <p className="mb-1 text-center text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{' '}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                PDF files only (max. 20MB)
                                            </p>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <FileText className="mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                                            <p className="text-center text-sm font-medium text-green-700 dark:text-green-300">
                                                {uploadFile.name}
                                            </p>
                                            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                                {(
                                                    uploadFile.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{' '}
                                                MB • PDF
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-3 h-8 border-red-200 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                                                onClick={() =>
                                                    setUploadFile(null)
                                                }
                                            >
                                                <XCircle className="mr-1.5 h-3.5 w-3.5" />
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
                                        className={`absolute inset-0 h-full w-full cursor-pointer opacity-0 ${uploadFile ? 'pointer-events-none' : ''}`}
                                    />
                                </div>
                            </div>

                            {!uploadFile && (
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    The copy-edited manuscript should be
                                    properly formatted and ready for author
                                    approval
                                </p>
                            )}

                            {uploadError && (
                                <Alert variant="destructive" className="mt-3">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        {uploadError}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                            <li className="flex items-start">
                                <Info className="mt-0.5 mr-1.5 h-4 w-4" />
                                <span>
                                    The finalized manuscript will be sent to the
                                    author for approval.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <Info className="mt-0.5 mr-1.5 h-4 w-4" />
                                <span>
                                    This upload should include all copy editing
                                    changes and formatting.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowUploadDialog(false)}
                            disabled={isLoading}
                            className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUploadFinalized}
                            disabled={isLoading || !uploadFile}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <Loader2 className="mr-2 -ml-1 h-4 w-4 animate-spin text-white" />
                                    Uploading...
                                </span>
                            ) : (
                                'Upload Finalized Manuscript'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
