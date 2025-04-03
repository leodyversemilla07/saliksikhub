import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { ChevronRight, CalendarIcon } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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

    const handleButtonClick = () => {
        const form = document.getElementById('publication-form');
        if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    return (
        <AuthenticatedLayout header="Prepare Publication">
            <Head title="Prepare for Publication" />

            <div className="space-y-8">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
                            <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Dashboard
                        </Link>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400 dark:text-gray-500" />
                    <div className="flex items-center">
                        <Link href={route('editor.indexManuscripts')} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
                            Manuscripts
                        </Link>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400 dark:text-gray-500" />
                    <div className="flex items-center">
                        <span className="font-medium text-green-600 dark:text-green-400">
                            Prepare for Publication
                        </span>
                    </div>
                </div>

                <Card className="shadow-md border border-gray-200/70 dark:border-gray-800">
                    <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white/80 dark:from-gray-900/90 dark:to-gray-800/90 pb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight text-green-700 dark:text-green-400">
                                    Prepare Manuscript for Publication
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Enter publication details to finalize the manuscript
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                        <div className="p-4 bg-green-50/80 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-medium text-green-700 dark:text-green-400">Manuscript Details</h3>
                                    <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 border-green-300 dark:border-green-700">
                                        {manuscript.status}
                                    </Badge>
                                </div>
                                <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{manuscript.title}</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Manuscript ID: #{manuscript.id}
                                </p>
                            </div>
                        </div>

                        <form id="publication-form" onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="manuscript-doi">DOI (Digital Object Identifier)</Label>
                                <Input
                                    id="manuscript-doi"
                                    name="doi"
                                    value={data.doi}
                                    onChange={e => setData('doi', e.target.value)}
                                    placeholder="Enter DOI (e.g., 10.1234/journal.12345)"
                                    className={cn(errors.doi && "border-red-500 focus:ring-red-500")}
                                    aria-describedby="doi-description"
                                />
                                {errors.doi &&
                                    <p className="text-sm text-red-500 mt-1" id="doi-error">{errors.doi}</p>
                                }
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" id="doi-description">
                                    The unique identifier for this publication
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="manuscript-volume">Volume</Label>
                                    <Select
                                        name="volume"
                                        value={data.volume}
                                        onValueChange={(value) => setData('volume', value)}
                                    >
                                        <SelectTrigger
                                            id="manuscript-volume"
                                            className={cn(errors.volume && "border-red-500 focus:ring-red-500")}
                                            aria-describedby={errors.volume ? "volume-error" : undefined}
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
                                                {currentVolumes.length > 0 ? Math.max(...currentVolumes) + 1 : 1} (New)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.volume &&
                                        <p className="text-sm text-red-500 mt-1" id="volume-error">{errors.volume}</p>
                                    }
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="manuscript-issue">Issue</Label>
                                    <Select
                                        name="issue"
                                        value={data.issue}
                                        onValueChange={(value) => setData('issue', value)}
                                    >
                                        <SelectTrigger
                                            id="manuscript-issue"
                                            className={cn(errors.issue && "border-red-500 focus:ring-red-500")}
                                            aria-describedby={errors.issue ? "issue-error" : undefined}
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
                                                {currentIssues.length > 0 ? Math.max(...currentIssues) + 1 : 1} (New)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.issue &&
                                        <p className="text-sm text-red-500 mt-1" id="issue-error">{errors.issue}</p>
                                    }
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="manuscript-page-range">Page Range</Label>
                                <Input
                                    id="manuscript-page-range"
                                    name="page_range"
                                    value={data.page_range}
                                    onChange={e => setData('page_range', e.target.value)}
                                    placeholder="e.g., 123-145"
                                    className={cn(errors.page_range && "border-red-500 focus:ring-red-500")}
                                    aria-describedby="page-range-description"
                                />
                                {errors.page_range &&
                                    <p className="text-sm text-red-500 mt-1" id="page-range-error">{errors.page_range}</p>
                                }
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" id="page-range-description">
                                    Page range in the published issue
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="manuscript-publication-date">Publication Date</Label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="manuscript-publication-date"
                                        name="publication_date"
                                        type="date"
                                        value={data.publication_date}
                                        onChange={e => setData('publication_date', e.target.value)}
                                        className={cn("pl-10", errors.publication_date && "border-red-500 focus:ring-red-500")}
                                        aria-describedby="publication-date-description"
                                    />
                                </div>
                                {errors.publication_date &&
                                    <p className="text-sm text-red-500 mt-1" id="publication-date-error">{errors.publication_date}</p>
                                }
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" id="publication-date-description">
                                    Date when the manuscript will be published
                                </p>
                            </div>

                            {submitError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                                    {submitError}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                <Link href={route('editor.indexManuscripts')} className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                                </Link>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="submit"
                                            onClick={handleButtonClick}
                                            disabled={processing || isSubmitting}
                                            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto mt-2 sm:mt-0"
                                        >
                                            {(processing || isSubmitting) ? 'Publishing...' : 'Publish Manuscript'}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Finalize and publish this manuscript
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            {process.env.NODE_ENV !== 'production' && (
                                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                                    <p>Debug Info:</p>
                                    <p>Form Processing: {processing ? 'Yes' : 'No'}</p>
                                    <p>Is Submitting: {isSubmitting ? 'Yes' : 'No'}</p>
                                    <p>Route: {route('editor.manuscripts.prepare_publication', manuscript.id)}</p>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
