import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarIcon,
    CheckCircle,
    AlertCircle,
    InfoIcon,
    FileCheck,
    MessageSquare,
    User,
    FileText,
    ClipboardCheck,
    Clock,
    CheckCheck,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { Manuscript, User as UserType } from '@/types';
import editor from '@/routes/editor';

interface DecisionTypes {
    [key: string]: string;
}

interface Props {
    authors: UserType;
    manuscript: Manuscript;
    decisionTypes: DecisionTypes;
}

export default function CreateDecision({ manuscript }: Props) {
    const { data, setData, errors, post, processing, reset, setError } =
        useForm({
            decision: '',
            comments: '',
            revision_deadline: '',
        });

    const [showDeadline, setShowDeadline] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [commentLength, setCommentLength] = useState(0);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const decisionDescriptions = {
        accept: 'Manuscript will be published as is, with no further revisions required.',
        minor_revision:
            'Minor changes needed before acceptance. Author will need to address specific points.',
        major_revision:
            'Substantial changes required. The manuscript needs significant improvements.',
        reject: "Manuscript does not meet the journal's standards for publication.",
    };

    const decisionLabels = {
        accept: 'Accept',
        minor_revision: 'Minor Revision',
        major_revision: 'Major Revision',
        reject: 'Reject',
    };

    const decisionIcons = {
        accept: <CheckCheck className="h-5 w-5 text-green-600" />,
        minor_revision: <FileCheck className="h-5 w-5 text-amber-500" />,
        major_revision: <ClipboardCheck className="h-5 w-5 text-orange-500" />,
        reject: <X className="h-5 w-5 text-red-500" />,
    };

    const handleDecisionChange = (value: string) => {
        setData('decision', value);
        setShowDeadline(
            value === 'minor_revision' || value === 'major_revision',
        );
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setData('comments', value);
        setCommentLength(value.length);
    };

    const validateForm = () => {
        const formErrors: Record<string, string> = {};

        if (!data.decision) {
            formErrors.decision = 'Please select a decision type';
        }

        if (showDeadline && !data.revision_deadline) {
            formErrors.revision_deadline = 'Please select a revision deadline';
        }

        if (!data.comments || data.comments.length < 10) {
            formErrors.comments =
                'Comments must be at least 10 characters long';
        }

        return formErrors;
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
            label: 'Editorial Decision',
            href: editor.manuscripts.decision.url({ id: manuscript.id }),
        },
    ];

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            for (const [field, message] of Object.entries(validationErrors)) {
                setError(field as keyof typeof data, message);
            }

            return;
        }

        setIsConfirmDialogOpen(true);
    };

    const handleSubmit = () => {
        post(editor.manuscripts.decision.url({ id: manuscript.id }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast('Decision submitted successfully');
                setIsConfirmDialogOpen(false);
            },
            onError: () => {
                toast('Submission failed: Please check the form for errors');
                setIsConfirmDialogOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Editorial Decision" />

            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        <div className="flex w-full max-w-6xl items-center justify-between px-4">
                            {[
                                {
                                    step: 1,
                                    title: 'Review Info',
                                    icon: <FileText className="h-4 w-4" />,
                                },
                                {
                                    step: 2,
                                    title: 'Make Decision',
                                    icon: (
                                        <ClipboardCheck className="h-4 w-4" />
                                    ),
                                },
                                {
                                    step: 3,
                                    title: 'Add Comments',
                                    icon: <MessageSquare className="h-4 w-4" />,
                                },
                            ].map((item, index) => (
                                <React.Fragment key={item.step}>
                                    <div className="relative flex flex-col items-center">
                                        <div
                                            className={cn(
                                                'flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 shadow-sm transition-all',
                                                currentStep >= item.step
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-gray-300 bg-gray-50 text-gray-400',
                                            )}
                                        >
                                            {item.icon}
                                            <span className="mt-1 text-xs font-semibold">
                                                {item.step}
                                            </span>
                                        </div>
                                        <span
                                            className={cn(
                                                'mt-3 text-xs font-medium',
                                                currentStep >= item.step
                                                    ? 'text-primary'
                                                    : 'text-gray-500',
                                            )}
                                        >
                                            {item.title}
                                        </span>
                                    </div>
                                    {index < 2 && (
                                        <div
                                            className={cn(
                                                'relative top-[-8px] h-[3px] flex-1',
                                                currentStep > item.step
                                                    ? 'bg-primary'
                                                    : 'bg-gray-300',
                                            )}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <Card className="mx-auto mb-8 max-w-7xl border-t-4 border-t-primary shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center text-primary">
                                    <FileText className="mr-2 h-5 w-5 text-primary" />
                                    Editorial Decision
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Make a decision for manuscript:
                                </CardDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className="bg-white font-mono text-xs shadow-sm dark:bg-gray-800"
                            >
                                ID: {manuscript.id}
                            </Badge>
                        </div>

                        <div className="mt-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-5 shadow-sm">
                            <h3 className="line-clamp-2 text-xl leading-tight font-semibold break-words text-primary">
                                {manuscript.title}
                            </h3>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <div className="flex items-center text-muted-foreground">
                                    <User className="mr-1 h-4 w-4 text-primary/70" />
                                    <div className="flex flex-wrap items-center gap-1">
                                        {typeof manuscript.authors ===
                                        'string' ? (
                                            <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/80 px-2 py-1 text-xs font-medium text-primary shadow-sm transition-colors duration-200 sm:px-3 sm:text-sm dark:bg-gray-800/60">
                                                {manuscript.authors}
                                            </span>
                                        ) : Array.isArray(
                                              manuscript.authors,
                                          ) ? (
                                            manuscript.authors.map((author) => (
                                                <span
                                                    key={author}
                                                    className="inline-flex items-center rounded-full border border-primary/20 bg-white/80 px-2 py-1 text-xs font-medium text-primary shadow-sm transition-colors duration-200 sm:px-3 sm:text-sm dark:bg-gray-800/60"
                                                >
                                                    {author}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/80 px-2 py-1 text-xs font-medium text-primary shadow-sm transition-colors duration-200 sm:px-3 sm:text-sm dark:bg-gray-800/60">
                                                {JSON.stringify(
                                                    manuscript.authors,
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {manuscript.created_at && (
                                    <div className="ml-auto flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1 bg-white/80 text-xs shadow-sm dark:bg-gray-800/60"
                                        >
                                            <Clock className="h-3 w-3" />
                                            {new Date(
                                                manuscript.created_at,
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center rounded-md border bg-white/80 p-3 shadow-sm dark:bg-gray-800/40">
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center">
                                        <span className="mr-2 h-3 w-3 animate-pulse rounded-full bg-yellow-400 shadow-sm"></span>
                                        <span className="font-medium">
                                            Awaiting Decision
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleFormSubmit}>
                        <CardContent className="space-y-8 pt-8">
                            <Alert
                                variant="default"
                                className="border-blue-200 bg-blue-50 text-blue-800 shadow-sm dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-200"
                            >
                                <InfoIcon className="h-4 w-4" />
                                <AlertDescription>
                                    Your decision will be communicated to the
                                    author. Please ensure your comments are
                                    clear and constructive.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-5 rounded-xl border bg-muted/20 p-7 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center text-lg font-medium text-primary/90">
                                        <FileCheck className="mr-2 h-5 w-5 text-primary" />
                                        Decision Type
                                    </h3>
                                    {errors.decision && (
                                        <span className="flex items-center text-sm text-destructive">
                                            <AlertCircle className="mr-1 h-4 w-4" />
                                            {errors.decision}
                                        </span>
                                    )}
                                </div>

                                <RadioGroup
                                    value={data.decision}
                                    onValueChange={(value) => {
                                        handleDecisionChange(value);
                                        setCurrentStep(2);
                                    }}
                                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                >
                                    {Object.entries({
                                        accept: 'Accept',
                                        minor_revision: 'Minor Revision',
                                        major_revision: 'Major Revision',
                                        reject: 'Reject',
                                    }).map(([value, label]) => (
                                        <Tooltip key={value}>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className={cn(
                                                        'flex cursor-pointer items-center space-x-2 rounded-xl border-2 p-5 transition-all duration-200',
                                                        data.decision === value
                                                            ? 'scale-[1.02] transform border-primary bg-primary/10 shadow-md'
                                                            : 'border-muted/40 hover:border-primary/30 hover:bg-muted/50 hover:shadow',
                                                    )}
                                                >
                                                    <RadioGroupItem
                                                        value={value}
                                                        id={value}
                                                        className={cn(
                                                            data.decision ===
                                                                value
                                                                ? 'border-primary'
                                                                : '',
                                                        )}
                                                    />
                                                    <div className="flex w-full items-center justify-between">
                                                        <Label
                                                            htmlFor={value}
                                                            className="flex-grow cursor-pointer text-base font-medium"
                                                        >
                                                            {label}
                                                        </Label>
                                                        <span
                                                            className={cn(
                                                                'ml-2 rounded-full p-1.5',
                                                                data.decision ===
                                                                    value
                                                                    ? 'bg-primary/10'
                                                                    : 'bg-muted/40',
                                                            )}
                                                        >
                                                            {value in
                                                                decisionIcons &&
                                                                decisionIcons[
                                                                    value as keyof typeof decisionIcons
                                                                ]}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs border-0 bg-primary text-primary-foreground shadow-lg">
                                                <p>
                                                    {
                                                        decisionDescriptions[
                                                            value as keyof typeof decisionDescriptions
                                                        ]
                                                    }
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </RadioGroup>
                            </div>

                            <Separator className="my-3" />

                            {showDeadline && (
                                <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-7 shadow-sm dark:border-amber-800/30 dark:bg-amber-950/20">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="revision_deadline"
                                            className="flex items-center text-base font-medium text-amber-800 dark:text-amber-300"
                                        >
                                            <CalendarIcon className="mr-2 h-5 w-5 text-amber-600 dark:text-amber-400" />
                                            Revision Deadline
                                        </Label>
                                        {errors.revision_deadline && (
                                            <span className="flex items-center text-sm text-destructive">
                                                <AlertCircle className="mr-1 h-4 w-4" />
                                                {errors.revision_deadline}
                                            </span>
                                        )}
                                    </div>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full justify-start py-6 text-left text-base font-normal',
                                                    !data.revision_deadline &&
                                                        'text-muted-foreground',
                                                    data.revision_deadline &&
                                                        'border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200',
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-5 w-5" />
                                                {data.revision_deadline ? (
                                                    format(
                                                        new Date(
                                                            data.revision_deadline,
                                                        ),
                                                        'PPP',
                                                    )
                                                ) : (
                                                    <span>
                                                        Select deadline date
                                                    </span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(
                                                    selectedDate:
                                                        | Date
                                                        | undefined,
                                                ) => {
                                                    setDate(selectedDate);

                                                    if (selectedDate) {
                                                        setData(
                                                            'revision_deadline',
                                                            format(
                                                                selectedDate,
                                                                'yyyy-MM-dd',
                                                            ),
                                                        );
                                                        setCurrentStep(3);
                                                    }
                                                }}
                                                disabled={(date: Date) =>
                                                    date < new Date() ||
                                                    date <
                                                        new Date(
                                                            new Date().setDate(
                                                                new Date().getDate() +
                                                                    1,
                                                            ),
                                                        )
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <div className="flex items-center rounded-md border border-amber-200/50 bg-white/70 p-3 text-sm text-amber-800 shadow-sm dark:border-amber-800/20 dark:bg-gray-800/30 dark:text-amber-300">
                                        <InfoIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                                        <p>
                                            Select a date by which the author
                                            should submit their revised
                                            manuscript.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Separator className="my-3" />

                            <div className="space-y-5 rounded-xl border bg-muted/20 p-7 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="comments"
                                        className="flex items-center text-base font-medium text-primary/90"
                                    >
                                        <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                                        Comments to Author
                                    </Label>
                                    {errors.comments && (
                                        <span className="flex items-center text-sm text-destructive">
                                            <AlertCircle className="mr-1 h-4 w-4" />
                                            {errors.comments}
                                        </span>
                                    )}
                                </div>

                                <Textarea
                                    id="comments"
                                    value={data.comments}
                                    className={cn(
                                        'min-h-[220px] resize-y p-4 text-base leading-relaxed',
                                        errors.comments &&
                                            'border-red-500 focus-visible:ring-red-500',
                                    )}
                                    onChange={(e) => {
                                        handleCommentChange(e);

                                        if (e.target.value.length > 0) {
                                            setCurrentStep(3);
                                        }
                                    }}
                                    required
                                    minLength={10}
                                    placeholder="Provide detailed feedback to the author..."
                                />

                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        Provide clear and constructive feedback.
                                        Minimum 10 characters required.
                                    </p>
                                    <div className="rounded-md bg-muted/50 px-2 py-1 font-mono text-xs">
                                        Characters: {commentLength}
                                        {commentLength < 10 &&
                                            commentLength > 0 && (
                                                <span className="ml-1 text-destructive">
                                                    (need {10 - commentLength}{' '}
                                                    more)
                                                </span>
                                            )}
                                    </div>
                                </div>

                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <Progress
                                        value={
                                            commentLength >= 10
                                                ? 100
                                                : (commentLength / 10) * 100
                                        }
                                        className={cn(
                                            'h-2 transition-all duration-300',
                                            commentLength >= 10
                                                ? 'bg-green-500'
                                                : 'bg-orange-500',
                                        )}
                                    />
                                </div>
                            </div>

                            {data.decision &&
                                data.comments &&
                                data.comments.length >= 10 &&
                                (!showDeadline || data.revision_deadline) && (
                                    <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm dark:border-green-800 dark:bg-green-900/20">
                                        <h4 className="mb-3 flex items-center font-medium text-green-800 dark:text-green-300">
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Decision Summary
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start rounded-md border bg-white/70 p-3 dark:bg-gray-800/30">
                                                <span className="min-w-[100px] font-medium text-green-800 dark:text-green-300">
                                                    Decision:
                                                </span>
                                                <span className="flex items-center">
                                                    <span className="mr-2">
                                                        {data.decision in
                                                            decisionIcons &&
                                                            decisionIcons[
                                                                data.decision as keyof typeof decisionIcons
                                                            ]}
                                                    </span>
                                                    <span className="font-semibold">
                                                        {decisionLabels[
                                                            data.decision as keyof typeof decisionLabels
                                                        ] || data.decision}
                                                    </span>
                                                </span>
                                            </div>

                                            {showDeadline &&
                                                data.revision_deadline && (
                                                    <div className="flex items-start rounded-md border bg-white/70 p-3 dark:bg-gray-800/30">
                                                        <span className="min-w-[100px] font-medium text-green-800 dark:text-green-300">
                                                            Deadline:
                                                        </span>
                                                        <span className="flex items-center font-semibold">
                                                            <CalendarIcon className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                                                            {format(
                                                                new Date(
                                                                    data.revision_deadline,
                                                                ),
                                                                'PPPP',
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                            <div className="flex items-start rounded-md border bg-white/70 p-3 dark:bg-gray-800/30">
                                                <span className="min-w-[100px] font-medium text-green-800 dark:text-green-300">
                                                    Comments:
                                                </span>
                                                <span className="font-semibold">
                                                    {data.comments.length}{' '}
                                                    characters
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mt-4 rounded-md border border-green-200 bg-green-100 p-3 text-sm text-green-700 dark:border-green-700/30 dark:bg-green-800/30 dark:text-green-400">
                                            <CheckCircle className="mr-2 inline-block h-4 w-4" />
                                            All required information provided.
                                            You can now submit your decision.
                                        </p>
                                    </div>
                                )}
                        </CardContent>

                        <CardFooter className="flex justify-between gap-4 border-t bg-muted/10 px-7 py-6">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-5"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className={cn(
                                    'min-w-[150px] px-5',
                                    data.decision &&
                                        data.comments &&
                                        data.comments.length >= 10 &&
                                        (!showDeadline ||
                                            data.revision_deadline)
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : '',
                                )}
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="mr-2 -ml-1 h-4 w-4 animate-spin"
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
                                        Submitting...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Submit Decision
                                    </span>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>

            <AlertDialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
            >
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center text-primary">
                            <ClipboardCheck className="mr-2 h-5 w-5 text-primary" />
                            Confirm Decision
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Please confirm your decision for this manuscript.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="max-h-[60vh] space-y-3 overflow-y-auto py-1">
                        <div className="mb-2 border-b pb-2 text-sm font-medium">
                            <span className="block text-xs text-muted-foreground uppercase">
                                Manuscript Title
                            </span>
                            <span className="line-clamp-2 text-primary">
                                {manuscript.title}
                            </span>
                        </div>

                        {data.decision && (
                            <div className="space-y-3">
                                <div>
                                    <span className="mb-1 block text-xs text-muted-foreground uppercase">
                                        Your Decision
                                    </span>
                                    <div
                                        className={cn(
                                            'flex items-center gap-2 rounded p-3',
                                            data.decision === 'accept' &&
                                                'border border-green-200 bg-green-100 text-green-800',
                                            data.decision ===
                                                'minor_revision' &&
                                                'border border-amber-200 bg-amber-100 text-amber-800',
                                            data.decision ===
                                                'major_revision' &&
                                                'border border-orange-200 bg-orange-100 text-orange-800',
                                            data.decision === 'reject' &&
                                                'border border-red-200 bg-red-100 text-red-800',
                                        )}
                                    >
                                        {data.decision in decisionIcons && (
                                            <span className="flex-shrink-0">
                                                {
                                                    decisionIcons[
                                                        data.decision as keyof typeof decisionIcons
                                                    ]
                                                }
                                            </span>
                                        )}
                                        <div className="font-bold">
                                            {decisionLabels[
                                                data.decision as keyof typeof decisionLabels
                                            ] || data.decision}
                                        </div>
                                    </div>
                                </div>

                                {showDeadline && data.revision_deadline && (
                                    <div>
                                        <span className="mb-1 block text-xs text-muted-foreground uppercase">
                                            Revision Deadline
                                        </span>
                                        <div className="flex items-center rounded bg-muted/20 p-2 text-sm">
                                            <CalendarIcon className="mr-2 h-4 w-4 text-amber-600" />
                                            <span className="font-medium">
                                                {format(
                                                    new Date(
                                                        data.revision_deadline,
                                                    ),
                                                    'MMMM d, yyyy',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="text-sm">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground uppercase">
                                            Comments to Author
                                        </span>
                                        <span className="rounded bg-muted/50 px-1.5 py-0.5 text-xs">
                                            {data.comments.length} chars
                                        </span>
                                    </div>
                                    <div className="max-h-24 overflow-y-auto rounded border bg-muted/20 p-2 text-xs">
                                        {data.comments}
                                    </div>
                                </div>

                                <div className="rounded bg-muted/10 p-2 text-xs">
                                    <span className="mb-1 block font-medium">
                                        This means:
                                    </span>
                                    <p className="text-muted-foreground">
                                        {data.decision === 'accept' &&
                                            'The manuscript will be accepted for publication with no further revisions required.'}
                                        {data.decision === 'minor_revision' &&
                                            'The author will need to make minor revisions before the manuscript can be accepted.'}
                                        {data.decision === 'major_revision' &&
                                            'The author will need to make significant revisions for the manuscript to be reconsidered.'}
                                        {data.decision === 'reject' &&
                                            'The manuscript will not be accepted for publication in its current form.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-2 flex items-center rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-200">
                            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                            <div>
                                The author will be notified of this decision
                                immediately.
                            </div>
                        </div>
                    </div>

                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="border-gray-300 text-sm">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSubmit}
                            className={cn(
                                'text-sm text-white',
                                data.decision === 'accept' &&
                                    'bg-green-600 hover:bg-green-700',
                                data.decision === 'minor_revision' &&
                                    'bg-amber-600 hover:bg-amber-700',
                                data.decision === 'major_revision' &&
                                    'bg-orange-600 hover:bg-orange-700',
                                data.decision === 'reject' &&
                                    'bg-red-600 hover:bg-red-700',
                            )}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm{' '}
                            {data.decision === 'reject'
                                ? 'Rejection'
                                : 'Decision'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
