import { useForm, Link, Head } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import editor from '@/routes/editor';

interface Manuscript {
    id: number;
    title: string;
    abstract: string;
    status: string;
    author_id: number;
}

interface Props {
    manuscript: Manuscript;
    currentVolumes: number[];
    currentIssues: number[];
    errors?: Record<string, string>;
}

export default function PreparePublication({
    manuscript,
    currentVolumes,
    currentIssues,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        doi: '',
        volume: currentVolumes.length > 0 ? currentVolumes[0].toString() : '1',
        issue: currentIssues.length > 0 ? currentIssues[0].toString() : '1',
        page_range: '',
        publication_date: new Date().toISOString().split('T')[0],
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        toast.loading('Publishing manuscript...', {
            id: 'publish-toast',
        });

        try {
            post(
                editor.manuscripts.prepare_publication.url({
                    id: manuscript.id,
                }),
                {
                    onSuccess: () => {
                        reset();
                        setIsSubmitting(false);
                        toast.success('Manuscript successfully published!', {
                            id: 'publish-toast',
                            description: `"${manuscript.title}" has been published and is now available to readers.`,
                        });
                        // Redirect to manuscripts index page
                        window.location.href = editor.indexManuscripts.url();
                    },
                    onError: () => {
                        setIsSubmitting(false);
                        setSubmitError(
                            'Form submission failed. Please check the form for errors.',
                        );
                        toast.error('Failed to publish manuscript', {
                            id: 'publish-toast',
                            description:
                                'Please check the form for errors and try again.',
                        });
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                },
            );
        } catch (error) {
            setIsSubmitting(false);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred';
            setSubmitError(
                `An unexpected error occurred: ${errorMessage}. Please try again.`,
            );
            toast.error('Unexpected error', {
                id: 'publish-toast',
                description: errorMessage,
            });
        }
    };

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: editor.dashboard.url(),
        },
        {
            label: 'Manuscripts',
            href: editor.indexManuscripts.url(),
        },
        {
            label: 'Prepare for Publication',
            href: editor.manuscripts.prepare_publication.url({
                id: manuscript.id,
            }),
        },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Prepare for Publication" />

            <div className="mx-auto max-w-2xl">
                {/* Manuscript Info */}
                <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-3 flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {manuscript.title}
                        </h2>
                        <Badge variant="secondary" className="ml-4 shrink-0">
                            {manuscript.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {manuscript.id}
                    </p>
                </div>

                {/* Publication Form */}
                <form
                    id="publication-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* DOI Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="manuscript-doi"
                            className="text-sm font-medium"
                        >
                            DOI
                        </Label>
                        <Input
                            id="manuscript-doi"
                            name="doi"
                            value={data.doi}
                            onChange={(e) => setData('doi', e.target.value)}
                            placeholder="10.1234/journal.12345"
                            className={cn(
                                'border-gray-300 focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:focus:border-gray-100',
                                errors.doi &&
                                    'border-red-500 focus:border-red-500',
                            )}
                        />
                        {errors.doi && (
                            <p className="text-sm text-red-600">{errors.doi}</p>
                        )}
                    </div>

                    {/* Volume and Issue */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="manuscript-volume"
                                className="text-sm font-medium"
                            >
                                Volume
                            </Label>
                            <Select
                                name="volume"
                                value={data.volume}
                                onValueChange={(value) =>
                                    setData('volume', value)
                                }
                            >
                                <SelectTrigger
                                    id="manuscript-volume"
                                    className={cn(
                                        'border-gray-300 focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:focus:border-gray-100',
                                        errors.volume &&
                                            'border-red-500 focus:border-red-500',
                                    )}
                                >
                                    <SelectValue placeholder="Select volume" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentVolumes.map((volume) => (
                                        <SelectItem
                                            key={volume}
                                            value={volume.toString()}
                                        >
                                            Volume {volume}
                                        </SelectItem>
                                    ))}
                                    <SelectItem
                                        value={(currentVolumes.length > 0
                                            ? Math.max(...currentVolumes) + 1
                                            : 1
                                        ).toString()}
                                    >
                                        Volume{' '}
                                        {currentVolumes.length > 0
                                            ? Math.max(...currentVolumes) + 1
                                            : 1}{' '}
                                        (New)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.volume && (
                                <p className="text-sm text-red-600">
                                    {errors.volume}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="manuscript-issue"
                                className="text-sm font-medium"
                            >
                                Issue
                            </Label>
                            <Select
                                name="issue"
                                value={data.issue}
                                onValueChange={(value) =>
                                    setData('issue', value)
                                }
                            >
                                <SelectTrigger
                                    id="manuscript-issue"
                                    className={cn(
                                        'border-gray-300 focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:focus:border-gray-100',
                                        errors.issue &&
                                            'border-red-500 focus:border-red-500',
                                    )}
                                >
                                    <SelectValue placeholder="Select issue" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentIssues.map((issue) => (
                                        <SelectItem
                                            key={issue}
                                            value={issue.toString()}
                                        >
                                            Issue {issue}
                                        </SelectItem>
                                    ))}
                                    <SelectItem
                                        value={(currentIssues.length > 0
                                            ? Math.max(...currentIssues) + 1
                                            : 1
                                        ).toString()}
                                    >
                                        Issue{' '}
                                        {currentIssues.length > 0
                                            ? Math.max(...currentIssues) + 1
                                            : 1}{' '}
                                        (New)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.issue && (
                                <p className="text-sm text-red-600">
                                    {errors.issue}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Page Range */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="manuscript-page-range"
                            className="text-sm font-medium"
                        >
                            Page Range
                        </Label>
                        <Input
                            id="manuscript-page-range"
                            name="page_range"
                            value={data.page_range}
                            onChange={(e) =>
                                setData('page_range', e.target.value)
                            }
                            placeholder="123-145"
                            className={cn(
                                'border-gray-300 focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:focus:border-gray-100',
                                errors.page_range &&
                                    'border-red-500 focus:border-red-500',
                            )}
                        />
                        {errors.page_range && (
                            <p className="text-sm text-red-600">
                                {errors.page_range}
                            </p>
                        )}
                    </div>

                    {/* Publication Date */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="manuscript-publication-date"
                            className="text-sm font-medium"
                        >
                            Publication Date
                        </Label>
                        <Input
                            id="manuscript-publication-date"
                            name="publication_date"
                            type="date"
                            value={data.publication_date}
                            onChange={(e) =>
                                setData('publication_date', e.target.value)
                            }
                            className={cn(
                                'border-gray-300 focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:focus:border-gray-100',
                                errors.publication_date &&
                                    'border-red-500 focus:border-red-500',
                            )}
                        />
                        {errors.publication_date && (
                            <p className="text-sm text-red-600">
                                {errors.publication_date}
                            </p>
                        )}
                    </div>

                    {/* Submit Error */}
                    {submitError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                            <p className="text-sm text-red-700 dark:text-red-400">
                                {submitError}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                        <Link href={editor.indexManuscripts.url()}>
                            <Button
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing || isSubmitting}
                            className="bg-gray-900 text-white hover:bg-gray-800 focus:ring-0 focus:ring-offset-0 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            {processing || isSubmitting
                                ? 'Publishing...'
                                : 'Publish'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
