import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

export default function PreparePublication({ manuscript, currentVolumes, currentIssues }: Props) {
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

        toast.loading("Publishing manuscript...", {
            id: "publish-toast"
        });

        try {
            post(route('editor.manuscripts.prepare_publication', manuscript.id), {
                onSuccess: () => {
                    reset();
                    setIsSubmitting(false);
                    toast.success("Manuscript successfully published!", {
                        id: "publish-toast",
                        description: `"${manuscript.title}" has been published and is now available to readers.`
                    });
                    // Redirect to manuscripts index page
                    window.location.href = route('editor.indexManuscripts');
                },
                onError: () => {
                    setIsSubmitting(false);
                    setSubmitError("Form submission failed. Please check the form for errors.");
                    toast.error("Failed to publish manuscript", {
                        id: "publish-toast",
                        description: "Please check the form for errors and try again."
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (error) {
            setIsSubmitting(false);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            setSubmitError(`An unexpected error occurred: ${errorMessage}. Please try again.`);
            toast.error("Unexpected error", {
                id: "publish-toast",
                description: errorMessage
            });
        }
    };

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('editor.dashboard'),
        },
        {
            label: 'Manuscripts',
            href: route('editor.indexManuscripts'),
        },
        {
            label: 'Prepare for Publication',
            href: route('editor.manuscripts.prepare_publication', manuscript.id),
        }
    ];

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Prepare for Publication" />

            <div className="max-w-2xl mx-auto">
                {/* Manuscript Info */}
                <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-3">
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
                <form id="publication-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* DOI Field */}
                    <div className="space-y-2">
                        <Label htmlFor="manuscript-doi" className="text-sm font-medium">
                            DOI
                        </Label>
                        <Input
                            id="manuscript-doi"
                            name="doi"
                            value={data.doi}
                            onChange={e => setData('doi', e.target.value)}
                            placeholder="10.1234/journal.12345"
                            className={cn(
                                "border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-0",
                                errors.doi && "border-red-500 focus:border-red-500"
                            )}
                        />
                        {errors.doi && (
                            <p className="text-sm text-red-600">{errors.doi}</p>
                        )}
                    </div>

                    {/* Volume and Issue */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="manuscript-volume" className="text-sm font-medium">
                                Volume
                            </Label>
                            <Select
                                name="volume"
                                value={data.volume}
                                onValueChange={(value) => setData('volume', value)}
                            >
                                <SelectTrigger
                                    id="manuscript-volume"
                                    className={cn(
                                        "border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-0",
                                        errors.volume && "border-red-500 focus:border-red-500"
                                    )}
                                >
                                    <SelectValue placeholder="Select volume" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentVolumes.map((volume) => (
                                        <SelectItem key={volume} value={volume.toString()}>
                                            Volume {volume}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value={(currentVolumes.length > 0 ? Math.max(...currentVolumes) + 1 : 1).toString()}>
                                        Volume {currentVolumes.length > 0 ? Math.max(...currentVolumes) + 1 : 1} (New)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.volume && (
                                <p className="text-sm text-red-600">{errors.volume}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="manuscript-issue" className="text-sm font-medium">
                                Issue
                            </Label>
                            <Select
                                name="issue"
                                value={data.issue}
                                onValueChange={(value) => setData('issue', value)}
                            >
                                <SelectTrigger
                                    id="manuscript-issue"
                                    className={cn(
                                        "border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-0",
                                        errors.issue && "border-red-500 focus:border-red-500"
                                    )}
                                >
                                    <SelectValue placeholder="Select issue" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentIssues.map((issue) => (
                                        <SelectItem key={issue} value={issue.toString()}>
                                            Issue {issue}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value={(currentIssues.length > 0 ? Math.max(...currentIssues) + 1 : 1).toString()}>
                                        Issue {currentIssues.length > 0 ? Math.max(...currentIssues) + 1 : 1} (New)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.issue && (
                                <p className="text-sm text-red-600">{errors.issue}</p>
                            )}
                        </div>
                    </div>

                    {/* Page Range */}
                    <div className="space-y-2">
                        <Label htmlFor="manuscript-page-range" className="text-sm font-medium">
                            Page Range
                        </Label>
                        <Input
                            id="manuscript-page-range"
                            name="page_range"
                            value={data.page_range}
                            onChange={e => setData('page_range', e.target.value)}
                            placeholder="123-145"
                            className={cn(
                                "border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-0",
                                errors.page_range && "border-red-500 focus:border-red-500"
                            )}
                        />
                        {errors.page_range && (
                            <p className="text-sm text-red-600">{errors.page_range}</p>
                        )}
                    </div>

                    {/* Publication Date */}
                    <div className="space-y-2">
                        <Label htmlFor="manuscript-publication-date" className="text-sm font-medium">
                            Publication Date
                        </Label>
                        <Input
                            id="manuscript-publication-date"
                            name="publication_date"
                            type="date"
                            value={data.publication_date}
                            onChange={e => setData('publication_date', e.target.value)}
                            className={cn(
                                "border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-0",
                                errors.publication_date && "border-red-500 focus:border-red-500"
                            )}
                        />
                        {errors.publication_date && (
                            <p className="text-sm text-red-600">{errors.publication_date}</p>
                        )}
                    </div>

                    {/* Submit Error */}
                    {submitError && (
                        <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-400">{submitError}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link href={route('editor.indexManuscripts')}>
                            <Button
                                variant="outline"
                                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing || isSubmitting}
                            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-0 focus:ring-offset-0"
                        >
                            {(processing || isSubmitting) ? 'Publishing...' : 'Publish'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
