import { Head, Link, useForm } from '@inertiajs/react';
import {
    FileText,
    Download,
    FileEdit,
    ChevronLeft,
    Upload,
    Calendar,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import manuscriptsRoutes from '@/routes/manuscripts';

interface Decision {
    id: string;
    comments: string;
    decision_type: string;
    decision_date: string;
    revision_deadline: string | null;
}

interface Manuscript {
    id: number;
    title: string;
    authors: string[];
    abstract: string;
    keywords: string[];
    manuscript_url: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

interface RevisionProps {
    manuscript: Manuscript;
    decision: Decision | null;
}

export default function Revision({ manuscript, decision }: RevisionProps) {
    const [fileError, setFileError] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        revised_manuscript: null as File | null,
        revision_comments: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileError(null);

        if (file) {
            // Validate file type
            const validTypes = [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];

            if (!validTypes.includes(file.type)) {
                setFileError('Only .doc and .docx files are allowed');

                return;
            }

            // Validate file size (20MB max)
            if (file.size > 20 * 1024 * 1024) {
                setFileError('File size must be less than 20MB');

                return;
            }

            setData('revised_manuscript', file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!data.revised_manuscript) {
            setFileError('Please select a file to upload');

            return;
        }

        post(manuscriptsRoutes.revision.submit.url({ id: manuscript.id }));
    };

    const getRemainingDays = () => {
        if (!decision?.revision_deadline) {
return null;
}

        const deadline = new Date(decision.revision_deadline);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const remainingDays = getRemainingDays();
    const isDeadlinePassed = remainingDays !== null && remainingDays < 0;

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: dashboard.url(),
        },
        {
            label: 'Manuscripts',
            href: manuscriptsRoutes.index.url(),
        },
        {
            label: manuscript.title,
            href: manuscriptsRoutes.show.url({ id: manuscript.id }),
        },
        {
            label: 'Submit Revision',
            href: manuscriptsRoutes.revision.form.url({ id: manuscript.id }),
            current: true,
        },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Revise: ${manuscript.title}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 dark:from-gray-900 dark:to-gray-950">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-6">
                        <Link
                            href={manuscriptsRoutes.show.url({
                                id: manuscript.id,
                            })}
                            className="inline-flex items-center text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary-foreground"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Back to manuscript
                        </Link>
                    </div>

                    <div className="w-full">
                        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md sm:rounded-xl sm:shadow-lg md:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <div className="relative bg-amber-600 p-5 sm:p-6 md:p-8 dark:bg-amber-800">
                                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm dark:bg-black/40"></div>
                                <div className="relative">
                                    <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 shadow-sm dark:border-amber-800/30 dark:bg-amber-900/30 dark:text-amber-300">
                                        <FileEdit className="mr-1 h-3.5 w-3.5" />
                                        Revision Required
                                    </div>

                                    <h1 className="mt-2 text-xl leading-tight font-bold tracking-tight break-words text-white drop-shadow-md sm:mt-3 sm:text-2xl md:text-3xl">
                                        {manuscript.title}
                                    </h1>
                                </div>
                            </div>

                            {decision?.revision_deadline && (
                                <div
                                    className={cn(
                                        'border-b p-4 sm:p-6',
                                        isDeadlinePassed
                                            ? 'border-red-100 bg-red-50 dark:border-red-800/30 dark:bg-red-900/20'
                                            : 'border-amber-100 bg-amber-50 dark:border-amber-800/30 dark:bg-amber-900/20',
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={cn(
                                                'rounded-full p-2',
                                                isDeadlinePassed
                                                    ? 'bg-red-100 dark:bg-red-800/30'
                                                    : 'bg-amber-100 dark:bg-amber-800/30',
                                            )}
                                        >
                                            <Calendar
                                                className={cn(
                                                    'h-5 w-5',
                                                    isDeadlinePassed
                                                        ? 'text-red-600 dark:text-red-400'
                                                        : 'text-amber-600 dark:text-amber-400',
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <h3
                                                className={cn(
                                                    'font-medium',
                                                    isDeadlinePassed
                                                        ? 'text-red-800 dark:text-red-300'
                                                        : 'text-amber-800 dark:text-amber-300',
                                                )}
                                            >
                                                {isDeadlinePassed
                                                    ? 'Revision Deadline Passed'
                                                    : 'Revision Deadline'}
                                            </h3>
                                            <p
                                                className={cn(
                                                    'text-sm',
                                                    isDeadlinePassed
                                                        ? 'text-red-700 dark:text-red-400'
                                                        : 'text-amber-700 dark:text-amber-400',
                                                )}
                                            >
                                                {isDeadlinePassed
                                                    ? `The deadline for submission was ${new Date(decision.revision_deadline).toLocaleDateString()}. Please submit as soon as possible.`
                                                    : `Please submit your revision by ${new Date(decision.revision_deadline).toLocaleDateString()} (${Math.abs(remainingDays || 0)} days ${remainingDays && remainingDays > 0 ? 'remaining' : 'overdue'}).`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                                <div className="grid gap-6 sm:gap-7 md:gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                Editor Comments
                                            </h3>
                                        </div>
                                        {decision ? (
                                            <Card className="p-4">
                                                <div className="prose dark:prose-invert max-w-none">
                                                    <p className="text-sm whitespace-pre-line text-gray-800 sm:text-base dark:text-gray-100">
                                                        {decision.comments}
                                                    </p>
                                                </div>
                                            </Card>
                                        ) : (
                                            <p className="text-gray-600 italic dark:text-gray-400">
                                                No specific comments provided by
                                                the editor.
                                            </p>
                                        )}
                                    </div>

                                    {manuscript.manuscript_url && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                    Current Manuscript
                                                </h3>
                                            </div>
                                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700/50 dark:bg-gray-800/70">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                                        Download your current
                                                        manuscript to make the
                                                        requested revisions:
                                                    </div>

                                                    <a
                                                        href={
                                                            manuscript.manuscript_url
                                                        }
                                                        download
                                                        className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground shadow-sm transition-colors duration-150 hover:bg-primary/90"
                                                    >
                                                        <Download className="mr-1.5 h-3.5 w-3.5" />
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Upload className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                Submit Revised Manuscript
                                            </h3>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        Upload Revised
                                                        Manuscript
                                                    </label>
                                                    <div className="flex w-full flex-col items-center justify-center">
                                                        <label
                                                            htmlFor="dropzone-file"
                                                            className={cn(
                                                                'flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed',
                                                                errors.revised_manuscript ||
                                                                    fileError
                                                                    ? 'border-red-300 bg-red-50 dark:border-red-700/50 dark:bg-red-950/20'
                                                                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700/30 dark:hover:bg-gray-700/50',
                                                            )}
                                                        >
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload
                                                                    className={cn(
                                                                        'mb-3 h-8 w-8',
                                                                        errors.revised_manuscript ||
                                                                            fileError
                                                                            ? 'text-red-500 dark:text-red-400'
                                                                            : 'text-gray-500 dark:text-gray-400',
                                                                    )}
                                                                />

                                                                {data.revised_manuscript ? (
                                                                    <div className="text-center">
                                                                        <p className="mb-1 text-sm font-semibold text-green-600 dark:text-green-400">
                                                                            File
                                                                            selected:
                                                                        </p>
                                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                            {
                                                                                data
                                                                                    .revised_manuscript
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                            {(
                                                                                data
                                                                                    .revised_manuscript
                                                                                    .size /
                                                                                (1024 *
                                                                                    1024)
                                                                            ).toFixed(
                                                                                2,
                                                                            )}{' '}
                                                                            MB
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center">
                                                                        <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                            Click
                                                                            to
                                                                            upload
                                                                            or
                                                                            drag
                                                                            and
                                                                            drop
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            MS
                                                                            Word
                                                                            (.doc
                                                                            or
                                                                            .docx)
                                                                            files
                                                                            only,
                                                                            max
                                                                            20MB
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <input
                                                                id="dropzone-file"
                                                                type="file"
                                                                className="hidden"
                                                                onChange={
                                                                    handleFileChange
                                                                }
                                                                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                            />
                                                        </label>

                                                        {(fileError ||
                                                            errors.revised_manuscript) && (
                                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                                {fileError ||
                                                                    errors.revised_manuscript}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="revision-comments"
                                                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
                                                    >
                                                        Revision Comments
                                                    </label>

                                                    <Textarea
                                                        id="revision-comments"
                                                        placeholder="Describe the changes you've made in response to the editor's comments..."
                                                        value={
                                                            data.revision_comments
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'revision_comments',
                                                                e.target.value,
                                                            )
                                                        }
                                                        rows={6}
                                                        className={cn(
                                                            errors.revision_comments &&
                                                                'border-red-500 focus:ring-red-500',
                                                        )}
                                                    />

                                                    {errors.revision_comments && (
                                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                            {
                                                                errors.revision_comments
                                                            }
                                                        </p>
                                                    )}

                                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                        Please explain how
                                                        you've addressed the
                                                        feedback from the editor
                                                        and reviewers.
                                                    </p>
                                                </div>

                                                <div className="mt-8 flex justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="mr-3"
                                                        onClick={() =>
                                                            window.history.back()
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                                                    >
                                                        {processing
                                                            ? 'Submitting...'
                                                            : 'Submit Revision'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
