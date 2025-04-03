import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    CalendarIcon, CheckCircle, AlertCircle, InfoIcon, FileCheck, MessageSquare, User,
    FileText, ClipboardCheck, Clock, CheckCheck, X
} from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Manuscript } from '@/types/manuscript';
import { User as UserType } from '@/types';

interface DecisionTypes {
    [key: string]: string;
}

interface Props {
    authors: UserType;
    manuscript: Manuscript;
    decisionTypes: DecisionTypes;
}

type FormDataConvertible = string | number | boolean | File | Blob | null | undefined;

interface DecisionFormData {
    decision: string;
    comments: string;
    revision_deadline: string;
    [key: string]: string | FormDataConvertible;
}

export default function CreateDecision({ manuscript }: Props) {
    const { data, setData, errors, post, processing, reset, setError } = useForm<DecisionFormData>({
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
        accept: "Manuscript will be published as is, with no further revisions required.",
        minor_revision: "Minor changes needed before acceptance. Author will need to address specific points.",
        major_revision: "Substantial changes required. The manuscript needs significant improvements.",
        reject: "Manuscript does not meet the journal's standards for publication."
    };

    const decisionLabels = {
        'accept': 'Accept',
        'minor_revision': 'Minor Revision',
        'major_revision': 'Major Revision',
        'reject': 'Reject'
    };

    const decisionIcons = {
        accept: <CheckCheck className="h-5 w-5 text-green-600" />,
        minor_revision: <FileCheck className="h-5 w-5 text-amber-500" />,
        major_revision: <ClipboardCheck className="h-5 w-5 text-orange-500" />,
        reject: <X className="h-5 w-5 text-red-500" />
    };

    const handleDecisionChange = (value: string) => {
        setData('decision', value);
        setShowDeadline(value === 'minor_revision' || value === 'major_revision');
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setData('comments', value);
        setCommentLength(value.length);
    };

    const validateForm = () => {
        const formErrors: Record<string, string> = {};

        if (!data.decision) {
            formErrors.decision = "Please select a decision type";
        }

        if (showDeadline && !data.revision_deadline) {
            formErrors.revision_deadline = "Please select a revision deadline";
        }

        if (!data.comments || data.comments.length < 10) {
            formErrors.comments = "Comments must be at least 10 characters long";
        }

        return formErrors;
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            for (const [field, message] of Object.entries(validationErrors)) {
                setError(field, message);
            }
            return;
        }

        setIsConfirmDialogOpen(true);
    };

    const handleSubmit = () => {
        post(route('editor.manuscripts.decision', manuscript.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast("Decision submitted successfully");
                setIsConfirmDialogOpen(false);
            },
            onError: () => {
                toast("Submission failed: Please check the form for errors");
                setIsConfirmDialogOpen(false);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Editorial Decision">
            <Head title="Editorial Decision" />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center w-full max-w-3xl justify-between">
                            {[
                                { step: 1, title: "Review Info", icon: <FileText className="h-4 w-4" /> },
                                { step: 2, title: "Make Decision", icon: <ClipboardCheck className="h-4 w-4" /> },
                                { step: 3, title: "Add Comments", icon: <MessageSquare className="h-4 w-4" /> }
                            ].map((item, index) => (
                                <React.Fragment key={item.step}>
                                    <div className="flex flex-col items-center relative">
                                        <div
                                            className={cn(
                                                "w-12 h-12 flex flex-col items-center justify-center rounded-full border-2 shadow-sm transition-all",
                                                currentStep >= item.step
                                                    ? "bg-primary text-white border-primary"
                                                    : "border-gray-300 bg-gray-50 text-gray-400"
                                            )}
                                        >
                                            {item.icon}
                                            <span className="text-xs mt-1 font-semibold">{item.step}</span>
                                        </div>
                                        <span
                                            className={cn(
                                                "mt-3 text-xs font-medium",
                                                currentStep >= item.step ? "text-primary" : "text-gray-500"
                                            )}
                                        >
                                            {item.title}
                                        </span>
                                    </div>
                                    {index < 2 && (
                                        <div className={cn(
                                            "flex-1 h-[3px] relative top-[-8px]",
                                            currentStep > item.step ? "bg-primary" : "bg-gray-300"
                                        )} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <Card className="shadow-lg border-t-4 border-t-primary mb-8">
                    <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center text-primary">
                                    <FileText className="h-5 w-5 mr-2 text-primary" />
                                    Editorial Decision
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Make a decision for manuscript:
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs font-mono bg-white dark:bg-gray-800 shadow-sm">
                                ID: {manuscript.id}
                            </Badge>
                        </div>

                        <div className="mt-4 p-5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-primary leading-tight line-clamp-2 break-words">
                                {manuscript.title}
                            </h3>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <div className="flex items-center text-muted-foreground">
                                    <User className="h-4 w-4 mr-1 text-primary/70" />
                                    <div className="flex flex-wrap gap-1 items-center">
                                        {typeof manuscript.authors === 'string' ? (
                                            <span
                                                className="inline-flex items-center bg-white/80 dark:bg-gray-800/60 text-primary border border-primary/20 
                                                            transition-colors duration-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm"
                                            >
                                                {manuscript.authors}
                                            </span>
                                        ) : Array.isArray(manuscript.authors) ? (
                                            manuscript.authors.map((author) => (
                                                <span
                                                    key={author}
                                                    className="inline-flex items-center bg-white/80 dark:bg-gray-800/60 text-primary border border-primary/20
                                                              transition-colors duration-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm"
                                                >
                                                    {author}
                                                </span>
                                            ))
                                        ) : (
                                            <span
                                                className="inline-flex items-center bg-white/80 dark:bg-gray-800/60 text-primary border border-primary/20
                                                          transition-colors duration-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm"
                                            >
                                                {JSON.stringify(manuscript.authors)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {manuscript.created_at && (
                                    <div className="flex gap-2 items-center ml-auto">
                                        <Badge variant="secondary" className="text-xs flex items-center gap-1 shadow-sm bg-white/80 dark:bg-gray-800/60">
                                            <Clock className="h-3 w-3" />
                                            {new Date(manuscript.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center p-3 bg-white/80 dark:bg-gray-800/40 rounded-md border shadow-sm">
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse mr-2 shadow-sm"></span>
                                        <span className="font-medium">Awaiting Decision</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleFormSubmit}>
                        <CardContent className="space-y-8 pt-8">
                            <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800/40 shadow-sm">
                                <InfoIcon className="h-4 w-4" />
                                <AlertDescription>
                                    Your decision will be communicated to the author. Please ensure your comments are clear and constructive.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-5 bg-muted/20 p-7 rounded-xl border shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium flex items-center text-primary/90">
                                        <FileCheck className="h-5 w-5 mr-2 text-primary" />
                                        Decision Type
                                    </h3>
                                    {errors.decision && (
                                        <span className="text-sm text-destructive flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
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
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {Object.entries({
                                        accept: "Accept",
                                        minor_revision: "Minor Revision",
                                        major_revision: "Major Revision",
                                        reject: "Reject"
                                    }).map(([value, label]) => (
                                        <Tooltip key={value}>
                                            <TooltipTrigger asChild>
                                                <div className={cn(
                                                    "flex items-center space-x-2 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                                    data.decision === value
                                                        ? "bg-primary/10 border-primary shadow-md transform scale-[1.02]"
                                                        : "hover:bg-muted/50 border-muted/40 hover:border-primary/30 hover:shadow"
                                                )}>
                                                    <RadioGroupItem value={value} id={value} className={cn(
                                                        data.decision === value ? "border-primary" : ""
                                                    )} />
                                                    <div className="flex items-center justify-between w-full">
                                                        <Label htmlFor={value} className="font-medium cursor-pointer flex-grow text-base">
                                                            {label}
                                                        </Label>
                                                        <span className={cn(
                                                            "ml-2 p-1.5 rounded-full",
                                                            data.decision === value ? "bg-primary/10" : "bg-muted/40"
                                                        )}>
                                                            {value in decisionIcons && decisionIcons[value as keyof typeof decisionIcons]}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs bg-primary text-primary-foreground border-0 shadow-lg">
                                                <p>{decisionDescriptions[value as keyof typeof decisionDescriptions]}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </RadioGroup>
                            </div>

                            <Separator className="my-3" />

                            {showDeadline && (
                                <div className="space-y-4 bg-amber-50 dark:bg-amber-950/20 p-7 rounded-xl border border-amber-200 dark:border-amber-800/30 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="revision_deadline" className="text-base font-medium flex items-center text-amber-800 dark:text-amber-300">
                                            <CalendarIcon className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
                                            Revision Deadline
                                        </Label>
                                        {errors.revision_deadline && (
                                            <span className="text-sm text-destructive flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                {errors.revision_deadline}
                                            </span>
                                        )}
                                    </div>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal py-6 text-base",
                                                    !data.revision_deadline && "text-muted-foreground",
                                                    data.revision_deadline && "bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-5 w-5" />
                                                {data.revision_deadline ? format(new Date(data.revision_deadline), "PPP") : <span>Select deadline date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(selectedDate: Date | undefined) => {
                                                    setDate(selectedDate);
                                                    if (selectedDate) {
                                                        setData('revision_deadline', format(selectedDate, 'yyyy-MM-dd'));
                                                        setCurrentStep(3);
                                                    }
                                                }}
                                                disabled={(date: Date) =>
                                                    date < new Date() ||
                                                    date < new Date(new Date().setDate(new Date().getDate() + 1))
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <div className="flex items-center p-3 bg-white/70 dark:bg-gray-800/30 rounded-md text-sm text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/20 shadow-sm">
                                        <InfoIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <p>Select a date by which the author should submit their revised manuscript.</p>
                                    </div>
                                </div>
                            )}

                            <Separator className="my-3" />

                            <div className="space-y-5 bg-muted/20 p-7 rounded-xl border shadow-sm">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="comments" className="text-base font-medium flex items-center text-primary/90">
                                        <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                                        Comments to Author
                                    </Label>
                                    {errors.comments && (
                                        <span className="text-sm text-destructive flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.comments}
                                        </span>
                                    )}
                                </div>

                                <Textarea
                                    id="comments"
                                    value={data.comments}
                                    className={cn("min-h-[220px] resize-y text-base p-4 leading-relaxed",
                                        errors.comments && "border-red-500 focus-visible:ring-red-500")}
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

                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground">
                                        Provide clear and constructive feedback. Minimum 10 characters required.
                                    </p>
                                    <div className="text-xs bg-muted/50 px-2 py-1 rounded-md font-mono">
                                        Characters: {commentLength}
                                        {commentLength < 10 && commentLength > 0 && (
                                            <span className="text-destructive ml-1">
                                                (need {10 - commentLength} more)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <Progress
                                        value={commentLength >= 10 ? 100 : (commentLength / 10) * 100}
                                        className={cn(
                                            "h-2 transition-all duration-300",
                                            commentLength >= 10 ? "bg-green-500" : "bg-orange-500"
                                        )}
                                    />
                                </div>
                            </div>

                            {data.decision && data.comments && data.comments.length >= 10 && (!showDeadline || data.revision_deadline) && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm">
                                    <h4 className="font-medium text-green-800 dark:text-green-300 flex items-center mb-3">
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Decision Summary
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-white/70 dark:bg-gray-800/30 rounded-md border flex items-start">
                                            <span className="font-medium min-w-[100px] text-green-800 dark:text-green-300">Decision:</span>
                                            <span className="flex items-center">
                                                <span className="mr-2">
                                                    {data.decision in decisionIcons &&
                                                        decisionIcons[data.decision as keyof typeof decisionIcons]}
                                                </span>
                                                <span className="font-semibold">
                                                    {decisionLabels[data.decision as keyof typeof decisionLabels] || data.decision}
                                                </span>
                                            </span>
                                        </div>

                                        {showDeadline && data.revision_deadline && (
                                            <div className="p-3 bg-white/70 dark:bg-gray-800/30 rounded-md border flex items-start">
                                                <span className="font-medium min-w-[100px] text-green-800 dark:text-green-300">Deadline:</span>
                                                <span className="flex items-center font-semibold">
                                                    <CalendarIcon className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                                                    {format(new Date(data.revision_deadline), "PPPP")}
                                                </span>
                                            </div>
                                        )}

                                        <div className="p-3 bg-white/70 dark:bg-gray-800/30 rounded-md border flex items-start">
                                            <span className="font-medium min-w-[100px] text-green-800 dark:text-green-300">Comments:</span>
                                            <span className="font-semibold">{data.comments.length} characters</span>
                                        </div>
                                    </div>
                                    <p className="text-sm mt-4 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-800/30 p-3 rounded-md border border-green-200 dark:border-green-700/30">
                                        <CheckCircle className="h-4 w-4 inline-block mr-2" />
                                        All required information provided. You can now submit your decision.
                                    </p>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-between gap-4 border-t py-6 px-7 bg-muted/10">
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
                                    "min-w-[150px] px-5",
                                    data.decision && data.comments && data.comments.length >= 10 && (!showDeadline || data.revision_deadline)
                                        ? "bg-green-600 hover:bg-green-700"
                                        : ""
                                )}
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center text-primary">
                            <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                            Confirm Decision
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Please confirm your decision for this manuscript.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-3 py-1 max-h-[60vh] overflow-y-auto">
                        <div className="text-sm font-medium mb-2 border-b pb-2">
                            <span className="block text-xs uppercase text-muted-foreground">Manuscript Title</span>
                            <span className="text-primary line-clamp-2">{manuscript.title}</span>
                        </div>

                        {data.decision && (
                            <div className="space-y-3">
                                <div>
                                    <span className="block text-xs uppercase text-muted-foreground mb-1">Your Decision</span>
                                    <div className={cn(
                                        "p-3 rounded flex items-center gap-2",
                                        data.decision === 'accept' && "bg-green-100 border border-green-200 text-green-800",
                                        data.decision === 'minor_revision' && "bg-amber-100 border border-amber-200 text-amber-800",
                                        data.decision === 'major_revision' && "bg-orange-100 border border-orange-200 text-orange-800",
                                        data.decision === 'reject' && "bg-red-100 border border-red-200 text-red-800"
                                    )}>
                                        {data.decision in decisionIcons && (
                                            <span className="flex-shrink-0">{decisionIcons[data.decision as keyof typeof decisionIcons]}</span>
                                        )}
                                        <div className="font-bold">
                                            {decisionLabels[data.decision as keyof typeof decisionLabels] || data.decision}
                                        </div>
                                    </div>
                                </div>

                                {showDeadline && data.revision_deadline && (
                                    <div>
                                        <span className="block text-xs uppercase text-muted-foreground mb-1">Revision Deadline</span>
                                        <div className="flex items-center p-2 bg-muted/20 rounded text-sm">
                                            <CalendarIcon className="h-4 w-4 mr-2 text-amber-600" />
                                            <span className="font-medium">{format(new Date(data.revision_deadline), "MMMM d, yyyy")}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="text-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs uppercase text-muted-foreground">Comfments to Author</span>
                                        <span className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                                            {data.comments.length} chars
                                        </span>
                                    </div>
                                    <div className="p-2 bg-muted/20 rounded border text-xs max-h-24 overflow-y-auto">
                                        {data.comments}
                                    </div>
                                </div>

                                <div className="text-xs p-2 bg-muted/10 rounded">
                                    <span className="block font-medium mb-1">This means:</span>
                                    <p className="text-muted-foreground">
                                        {data.decision === 'accept' && "The manuscript will be accepted for publication with no further revisions required."}
                                        {data.decision === 'minor_revision' && "The author will need to make minor revisions before the manuscript can be accepted."}
                                        {data.decision === 'major_revision' && "The author will need to make significant revisions for the manuscript to be reconsidered."}
                                        {data.decision === 'reject' && "The manuscript will not be accepted for publication in its current form."}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/30 rounded text-xs mt-2">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            <div>The author will be notified of this decision immediately.</div>
                        </div>
                    </div>

                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="border-gray-300 text-sm">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSubmit}
                            className={cn(
                                "text-white text-sm",
                                data.decision === 'accept' && "bg-green-600 hover:bg-green-700",
                                data.decision === 'minor_revision' && "bg-amber-600 hover:bg-amber-700",
                                data.decision === 'major_revision' && "bg-orange-600 hover:bg-orange-700",
                                data.decision === 'reject' && "bg-red-600 hover:bg-red-700",
                            )}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm {data.decision === 'reject' ? 'Rejection' : 'Decision'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
