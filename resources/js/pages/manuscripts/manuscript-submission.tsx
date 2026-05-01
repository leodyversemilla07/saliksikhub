import { Head, useForm, usePage } from '@inertiajs/react';
import {
    FileText,
    Users,
    Tag,
    AlertCircle,
    CheckCircle2,
    Info,
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useWindowSize } from '@/hooks/use-window-size';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { dashboard } from '@/routes';
import manuscriptsRoutes from '@/routes/manuscripts';

export default function ManuscriptSubmissionForm() {
    interface PageProps {
        auth: {
            user: User;
        };
        errors: Record<string, string>;
        flash: {
            message?: string;
            type?: string;
        };
        [key: string]: unknown;
    }

    // Constants
    const steps = [
        {
            id: 'details',
            title: 'Manuscript Details',
            description:
                'Provide the essential information about your manuscript.',
        },
        {
            id: 'content',
            title: 'Research Content',
            description: 'Summary and keywords for your research.',
        },
        {
            id: 'file',
            title: 'Manuscript Upload',
            description: 'Upload your manuscript document.',
        },
        {
            id: 'review',
            title: 'Review Submission',
            description: 'Review your submission details.',
        },
    ];

    // Custom Hooks
    const useStepNavigation = (stepCount: number) => {
        const [currentStep, setCurrentStep] = useState(0);
        const [completedSteps, setCompletedSteps] = useState<number[]>([]);
        const [showValidationAlert, setShowValidationAlert] = useState(false);

        const isLastStep = currentStep === stepCount - 1;

        const resetSteps = useCallback(() => {
            setCurrentStep(0);
            setCompletedSteps([]);
        }, []);

        useEffect(() => {
            let timer: NodeJS.Timeout;

            if (showValidationAlert) {
                timer = setTimeout(() => {
                    setShowValidationAlert(false);
                }, 5000);
            }

            return () => clearTimeout(timer);
        }, [showValidationAlert]);

        const markStepCompleted = useCallback(() => {
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps((prev) => [...prev, currentStep]);
            }
        }, [currentStep, completedSteps]);

        const goToNextStep = useCallback(() => {
            setCurrentStep((prev) => Math.min(prev + 1, stepCount - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, [stepCount]);

        const goToPrevStep = useCallback(() => {
            setCurrentStep((prev) => Math.max(prev - 1, 0));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, []);

        return {
            currentStep,
            completedSteps,
            isLastStep,
            showValidationAlert,
            setShowValidationAlert,
            markStepCompleted,
            goToNextStep,
            goToPrevStep,
            resetSteps,
        };
    };

     
    const useFormCompletion = (form: any) => {
        const [submitProgress, setSubmitProgress] = useState(0);
        const totalFields = 5;

        useEffect(() => {
            const data = form.data;
            let completedFields = 0;

            if (data.title && data.title.length >= 10) {
completedFields++;
}

            if (data.authors && data.authors.length >= 3) {
completedFields++;
}

            if (data.abstract && data.abstract.length >= 100) {
completedFields++;
}

            if (data.keywords && data.keywords.length >= 3) {
completedFields++;
}

            if (data.manuscript) {
completedFields++;
}

            setSubmitProgress(
                Math.round((completedFields / totalFields) * 100),
            );
        }, [form.data]);

        return submitProgress;
    };

     
    const validateStep = async (form: any, stepId: string) => {
        form.clearErrors();
        let isValid = true;

        switch (stepId) {
            case 'details':
                // Validate title
                if (!form.data.title || form.data.title.trim() === '') {
                    form.setError('title', 'The title field is required.');
                    isValid = false;
                } else if (form.data.title.trim().length < 10) {
                    form.setError(
                        'title',
                        'The title must be at least 10 characters.',
                    );
                    isValid = false;
                }

                // Validate authors
                if (!form.data.authors || form.data.authors.trim() === '') {
                    form.setError('authors', 'The authors field is required.');
                    isValid = false;
                } else if (form.data.authors.trim().length < 3) {
                    form.setError(
                        'authors',
                        'The authors must be at least 3 characters.',
                    );
                    isValid = false;
                }

                break;

            case 'content':
                // Validate abstract
                if (!form.data.abstract || form.data.abstract.trim() === '') {
                    form.setError(
                        'abstract',
                        'The abstract field is required.',
                    );
                    isValid = false;
                } else if (form.data.abstract.trim().length < 100) {
                    form.setError(
                        'abstract',
                        'The abstract must be at least 100 characters.',
                    );
                    isValid = false;
                }

                // Validate keywords
                if (!form.data.keywords || form.data.keywords.trim() === '') {
                    form.setError(
                        'keywords',
                        'The keywords field is required.',
                    );
                    isValid = false;
                } else if (form.data.keywords.trim().length < 3) {
                    form.setError(
                        'keywords',
                        'The keywords must be at least 3 characters.',
                    );
                    isValid = false;
                }

                break;

            case 'file':
                // Validate manuscript
                if (!form.data.manuscript) {
                    form.setError(
                        'manuscript',
                        'The manuscript field is required.',
                    );
                    isValid = false;
                }

                break;

            case 'review':
                return true;
        }

        return isValid;
    };

    const useManuscriptSubmission = (resetSteps: () => void) => {
        const form = useForm<{
            title: string;
            authors: string;
            abstract: string;
            keywords: string;
            manuscript: File | null;
        }>({
            title: '',
            authors: '',
            abstract: '',
            keywords: '',
            manuscript: null,
        });

        const { flash } = usePage<PageProps>().props;

        const handleSubmit = useCallback(() => {
            form.post(manuscriptsRoutes.store.url(), {
                preserveScroll: true,
                errorBag: 'manuscriptSubmission',
                onSuccess: () => {
                    toast.success('Submission Successful', {
                        description:
                            flash?.message ||
                            'Your manuscript has been submitted for review.',
                    });
                    form.reset();
                    resetSteps();
                },
                onError: (errors) => {
                    toast.error('Submission Failed', {
                        description:
                            (Object.values(errors)[0] as string) ||
                            'There was an error submitting your manuscript.',
                    });
                },
            });
        }, [form, resetSteps, flash]);

        return { form, processing: form.processing, handleSubmit };
    };

    // Main component logic
    const { errors: serverErrors } = usePage<PageProps>().props;
    const { width } = useWindowSize();
    const isMobile = width !== undefined && width < 640;

    const {
        currentStep,
        isLastStep,
        showValidationAlert,
        setShowValidationAlert,
        markStepCompleted,
        goToNextStep,
        goToPrevStep,
        resetSteps,
    } = useStepNavigation(steps.length);

    const { form, processing, handleSubmit } =
        useManuscriptSubmission(resetSteps);
    const submitProgress = useFormCompletion(form);

    // File upload step specific state and functions
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [validationMessage, setValidationMessage] = useState<string | null>(
        null,
    );

    useEffect(() => {
        if (!form.data.manuscript) {
return;
}

        setValidationMessage(null);
        const maxSize = 10 * 1024 * 1024;

        if (form.data.manuscript.size > maxSize) {
            setValidationMessage('File is too large. Maximum size is 10MB.');
        }

        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedTypes.includes(form.data.manuscript.type)) {
            setValidationMessage('Only DOCX files are allowed.');
        }
    }, [form.data.manuscript]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            form.setData('manuscript', e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        form.setData('manuscript', null);
        setValidationMessage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) {
return '0 Bytes';
}

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };

    const getProgressPercentage = () => {
        if (form.progress === null) {
return 0;
}

        if (typeof form.progress === 'number') {
return form.progress;
}

        return form.progress.percentage || 0;
    };

    // Details step calculations
    const titleLength = form.data.title?.length || 0;
    const authorsArray = form.data.authors
        ? form.data.authors
              .split(',')
              .filter((author: string) => author.trim() !== '')
        : [];
    const authorsLength = form.data.authors?.length || 0;
    const isTitleValid = titleLength >= 10;
    const isAuthorsValid = authorsLength >= 3 && authorsArray.length > 0;

    // Content step calculations
    const abstractLength = form.data.abstract?.length || 0;
    const abstractWordCount = form.data.abstract
        ? form.data.abstract
              .trim()
              .split(/\s+/)
              .filter((word: string) => word.length > 0).length
        : 0;
    const keywordsArray = form.data.keywords
        ? form.data.keywords
              .split(',')
              .filter((keyword: string) => keyword.trim() !== '')
        : [];
    const keywordsLength = form.data.keywords?.length || 0;
    const isAbstractValid = abstractLength >= 100 && abstractWordCount >= 50;
    const isKeywordsValid = keywordsLength >= 3 && keywordsArray.length >= 3;

    // File upload step calculations
    const hasError = !!form.errors.manuscript || !!validationMessage;
    const isFileValid = form.data.manuscript && !hasError;

    // Review step calculations
    const authorCount = form.data.authors
        .split(',')
        .filter((a) => a.trim() !== '').length;
    const keywordCount = form.data.keywords
        .split(',')
        .filter((k) => k.trim() !== '').length;
    const abstractWordCountReview = form.data.abstract
        .split(/\s+/)
        .filter(Boolean).length;
    const formatFileSize = (bytes?: number): string => {
        if (!bytes) {
return '';
}

        if (bytes < 1024) {
return `${bytes} bytes`;
}

        if (bytes < 1024 * 1024) {
return `${(bytes / 1024).toFixed(1)} KB`;
}

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    const isAbstractValidReview =
        abstractWordCountReview >= 50 && abstractWordCountReview <= 300;
    const isFileValidReview = !!form.data.manuscript;
    const allValid =
        form.data.title &&
        form.data.authors &&
        form.data.abstract &&
        form.data.keywords &&
        isFileValidReview;

    useEffect(() => {
        if (!serverErrors || Object.keys(serverErrors).length === 0) {
return;
}

        Object.entries(serverErrors).forEach(([field, message]) => {
            if (field === 'title') {
form.setError('title', message as string);
} else if (field === 'authors') {
form.setError('authors', message as string);
} else if (field === 'abstract') {
form.setError('abstract', message as string);
} else if (field === 'keywords') {
form.setError('keywords', message as string);
} else if (field === 'manuscript') {
form.setError('manuscript', message as string);
}
        });

        if (serverErrors.title || serverErrors.authors) {
resetSteps();
} else if (serverErrors.abstract || serverErrors.keywords) {
            resetSteps();
            goToNextStep();
        } else if (serverErrors.manuscript) {
            resetSteps();
            goToNextStep();
            goToNextStep();
        }

        setShowValidationAlert(true);
    }, [serverErrors, form, goToNextStep, resetSteps, setShowValidationAlert]);

    const nextStep = async () => {
        const currentStepId = steps[currentStep].id;

        if (currentStepId === 'review') {
            markStepCompleted();
            goToNextStep();

            return;
        }

        const isStepValid = await validateStep(form, currentStepId);

        if (isStepValid) {
            markStepCompleted();
            goToNextStep();
        } else {
            setShowValidationAlert(true);
        }
    };

    const breadcrumbItems = [
        { label: 'Dashboard', href: dashboard.url() },
        { label: 'Manuscripts', href: manuscriptsRoutes.index.url() },
        { label: 'Submit Manuscript' },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Submit Manuscript" />
            <div className="mx-auto w-full max-w-2xl px-2 py-8">
                <h1 className="mb-2 text-center text-2xl font-bold">
                    Submit New Manuscript
                </h1>
                <p className="mb-6 text-center">
                    Follow the steps to submit your manuscript.
                </p>
                <div className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold">
                        {steps[currentStep].title}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        {steps[currentStep].description}
                    </div>
                </div>
                {showValidationAlert && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            Validation Error
                        </AlertTitle>
                        <AlertDescription>
                            Please fix the highlighted fields before proceeding.
                        </AlertDescription>
                    </Alert>
                )}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        if (isLastStep) {
                            handleSubmit();
                        } else {
                            nextStep();
                        }
                    }}
                >
                    <div>
                        {currentStep === 0 && (
                            <div className="animate-fadeIn space-y-8">
                                {/* Title Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full border p-2 transition-colors">
                                                {form.errors.title ? (
                                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                                ) : isTitleValid ? (
                                                    <CheckCircle2 className="text-success h-5 w-5" />
                                                ) : (
                                                    <FileText className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="title">
                                                    Manuscript Title
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    A clear, descriptive title
                                                    for your research
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    isTitleValid
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {titleLength}/10+ chars
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Input
                                            id="title"
                                            placeholder="Enter a descriptive and compelling title for your manuscript..."
                                            value={form.data.title}
                                            onChange={(e) =>
                                                form.setData(
                                                    'title',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={!!form.errors.title}
                                            aria-errormessage={
                                                form.errors.title
                                                    ? 'title-error'
                                                    : undefined
                                            }
                                        />
                                        {form.errors.title && (
                                            <div className="flex items-center gap-2 text-destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <p
                                                    id="title-error"
                                                    className="text-sm font-medium"
                                                >
                                                    {form.errors.title}
                                                </p>
                                            </div>
                                        )}
                                        {!form.errors.title && isTitleValid && (
                                            <div className="text-success flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <p className="text-sm font-medium">
                                                    Great! Your title meets the
                                                    requirements.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Authors Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full border p-2 transition-colors">
                                                {form.errors.authors ? (
                                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                                ) : isAuthorsValid ? (
                                                    <CheckCircle2 className="text-success h-5 w-5" />
                                                ) : (
                                                    <Users className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="authors">
                                                    Authors
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    All contributors to this
                                                    research work
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    authorsArray.length > 0
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {authorsArray.length} author
                                                {authorsArray.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Input
                                            id="authors"
                                            placeholder="e.g. Dr. Jane Smith, Prof. John Doe, Dr. Alice Johnson..."
                                            value={form.data.authors}
                                            onChange={(e) =>
                                                form.setData(
                                                    'authors',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={!!form.errors.authors}
                                            aria-errormessage={
                                                form.errors.authors
                                                    ? 'authors-error'
                                                    : undefined
                                            }
                                        />
                                        {/* Author Chips Preview */}
                                        {authorsArray.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Users className="h-4 w-4" />
                                                    Author Preview:
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {authorsArray.map(
                                                        (author, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className="px-3 py-1.5 text-sm"
                                                            >
                                                                <Users className="mr-1.5 h-3 w-3" />
                                                                {author.trim()}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {form.errors.authors && (
                                            <div className="flex items-center gap-2 text-destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <p
                                                    id="authors-error"
                                                    className="text-sm font-medium"
                                                >
                                                    {form.errors.authors}
                                                </p>
                                            </div>
                                        )}
                                        {!form.errors.authors &&
                                            isAuthorsValid && (
                                                <div className="text-success flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <p className="text-sm font-medium">
                                                        Perfect! Author list
                                                        looks good.
                                                    </p>
                                                </div>
                                            )}
                                        <div className="rounded-lg bg-background p-3 text-xs text-muted-foreground">
                                            <strong>Tip:</strong> List authors
                                            in the order they should appear in
                                            the publication. Include full names
                                            and separate each author with a
                                            comma.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentStep === 1 && (
                            <div className="animate-fadeIn space-y-8">
                                {/* Abstract Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full border p-2 transition-colors">
                                                {form.errors.abstract ? (
                                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                                ) : isAbstractValid ? (
                                                    <CheckCircle2 className="text-success h-5 w-5" />
                                                ) : (
                                                    <FileText className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="abstract">
                                                    Research Abstract
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    A comprehensive summary of
                                                    your research work
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    abstractWordCount >= 50
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {abstractWordCount} words
                                            </Badge>
                                            <Badge
                                                variant={
                                                    abstractLength >= 100
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {abstractLength}/100+ chars
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Textarea
                                            id="abstract"
                                            placeholder="Provide a comprehensive summary of your research including objectives, methodology, key findings, and conclusions..."
                                            className="min-h-[240px]"
                                            value={form.data.abstract}
                                            onChange={(e) =>
                                                form.setData(
                                                    'abstract',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={
                                                !!form.errors.abstract
                                            }
                                            aria-errormessage={
                                                form.errors.abstract
                                                    ? 'abstract-error'
                                                    : undefined
                                            }
                                        />
                                        {/* Word count guidance */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className={cn(
                                                        'font-medium',
                                                        abstractWordCount < 50
                                                            ? 'text-orange-600 dark:text-orange-400'
                                                            : abstractWordCount >
                                                                300
                                                              ? 'text-orange-600 dark:text-orange-400'
                                                              : 'text-green-600 dark:text-green-400',
                                                    )}
                                                >
                                                    Word count:{' '}
                                                    {abstractWordCount}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {abstractWordCount < 50 &&
                                                        '• Too short'}
                                                    {abstractWordCount >= 50 &&
                                                        abstractWordCount <=
                                                            300 &&
                                                        '• Perfect length'}
                                                    {abstractWordCount > 300 &&
                                                        '• Too long'}
                                                </span>
                                            </div>
                                        </div>
                                        {form.errors.abstract && (
                                            <div className="flex items-center gap-2 text-destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <p
                                                    id="abstract-error"
                                                    className="text-sm font-medium"
                                                >
                                                    {form.errors.abstract}
                                                </p>
                                            </div>
                                        )}
                                        {!form.errors.abstract &&
                                            isAbstractValid && (
                                                <div className="text-success flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <p className="text-sm font-medium">
                                                        Excellent! Your abstract
                                                        meets all requirements.
                                                    </p>
                                                </div>
                                            )}
                                        <div className="rounded-lg bg-background p-3 text-xs text-muted-foreground">
                                            <strong>
                                                Abstract Guidelines:
                                            </strong>{' '}
                                            Include your research objective,
                                            methodology, key findings, and
                                            conclusions. Avoid citations and
                                            focus on your contribution.
                                        </div>
                                    </div>
                                </div>
                                {/* Keywords Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full border p-2 transition-colors">
                                                {form.errors.keywords ? (
                                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                                ) : isKeywordsValid ? (
                                                    <CheckCircle2 className="text-success h-5 w-5" />
                                                ) : (
                                                    <Tag className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="keywords">
                                                    Keywords
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Separate each keyword with a
                                                    comma
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    keywordsArray.length >= 3
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {keywordsArray.length} keyword
                                                {keywordsArray.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Input
                                            id="keywords"
                                            placeholder="e.g. Machine Learning, Natural Language Processing, Deep Learning, Computer Vision..."
                                            value={form.data.keywords}
                                            onChange={(e) =>
                                                form.setData(
                                                    'keywords',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={
                                                !!form.errors.keywords
                                            }
                                            aria-errormessage={
                                                form.errors.keywords
                                                    ? 'keywords-error'
                                                    : undefined
                                            }
                                        />
                                        {/* Keywords Preview */}
                                        {keywordsArray.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Tag className="h-4 w-4" />
                                                    Keyword Preview:
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {keywordsArray.map(
                                                        (keyword, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className="px-3 py-1.5 text-sm"
                                                            >
                                                                <Tag className="mr-1.5 h-3 w-3" />
                                                                {keyword.trim()}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {form.errors.keywords && (
                                            <div className="flex items-center gap-2 text-destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <p
                                                    id="keywords-error"
                                                    className="text-sm font-medium"
                                                >
                                                    {form.errors.keywords}
                                                </p>
                                            </div>
                                        )}
                                        {!form.errors.keywords &&
                                            isKeywordsValid && (
                                                <div className="text-success flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <p className="text-sm font-medium">
                                                        Great keyword selection!
                                                    </p>
                                                </div>
                                            )}
                                        <div className="rounded-lg bg-background p-3 text-xs text-muted-foreground">
                                            <strong>Keyword Tips:</strong> Use
                                            specific terms from your field,
                                            include both technical and general
                                            terms, and separate each keyword
                                            with a comma.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="animate-fadeIn space-y-8">
                                {/* File Upload Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full border p-2 transition-colors">
                                                {form.errors.manuscript ? (
                                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                                ) : isFileValid ? (
                                                    <CheckCircle2 className="text-success h-5 w-5" />
                                                ) : (
                                                    <FileText className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="manuscript">
                                                    Manuscript File
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Upload your manuscript in
                                                    DOCX format
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {form.data.manuscript && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {form.data.manuscript.name}{' '}
                                                    (
                                                    {formatBytes(
                                                        form.data.manuscript
                                                            .size,
                                                    )}
                                                    )
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div
                                            className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            {form.data.manuscript ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle2 className="text-success h-8 w-8" />
                                                    <span className="font-medium">
                                                        {
                                                            form.data.manuscript
                                                                .name
                                                        }
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatBytes(
                                                            form.data.manuscript
                                                                .size,
                                                        )}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="text-xs text-destructive underline"
                                                        onClick={
                                                            handleRemoveFile
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        Drag and drop your DOCX
                                                        file here, or click to
                                                        select
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Max size: 10MB
                                                    </span>
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                id="manuscript"
                                                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                        {/* Upload Progress */}
                                        {form.progress !== null &&
                                            getProgressPercentage() > 0 &&
                                            getProgressPercentage() < 100 && (
                                                <div className="space-y-2">
                                                    <Progress
                                                        value={getProgressPercentage()}
                                                        className="h-3"
                                                    />
                                                    <p className="text-center text-sm text-muted-foreground">
                                                        Uploading...{' '}
                                                        {getProgressPercentage()}
                                                        %
                                                    </p>
                                                </div>
                                            )}
                                        {/* Validation Messages */}
                                        {validationMessage && (
                                            <div className="flex items-center gap-2 text-destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>{validationMessage}</span>
                                            </div>
                                        )}
                                        {form.errors.manuscript && (
                                            <div className="flex items-center gap-2 text-destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>
                                                    {form.errors.manuscript}
                                                </span>
                                            </div>
                                        )}
                                        {!hasError && isFileValid && (
                                            <div className="text-success flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>
                                                    File is valid and ready for
                                                    upload.
                                                </span>
                                            </div>
                                        )}
                                        <div className="rounded-lg bg-gray-50 p-3 text-xs text-muted-foreground dark:bg-gray-800/50">
                                            <strong>Upload Guidelines:</strong>{' '}
                                            Ensure your manuscript is in DOCX
                                            format, includes all figures and
                                            references, and has identifying
                                            information removed for blind
                                            review.
                                        </div>
                                    </div>
                                </div>
                                {/* Requirements Section */}
                                <div className="rounded-lg border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800 dark:bg-blue-950/20">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            <Info className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                                Manuscript Requirements
                                            </h3>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                Please ensure your manuscript
                                                meets these requirements
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                <span>DOCX format only</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                <span>Max file size: 10MB</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                <span>
                                                    All figures and references
                                                    included
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                <span>
                                                    No identifying information
                                                    (blind review)
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                <span>Readable formatting</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                <span>
                                                    References properly cited
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="animate-fadeIn space-y-8">
                                {/* Overall Status */}
                                <div
                                    className={cn(
                                        'rounded-lg p-6',
                                        allValid
                                            ? 'border-success bg-success/10'
                                            : 'border-warning bg-warning/10',
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                'rounded-full border p-2',
                                                allValid
                                                    ? 'bg-success text-success'
                                                    : 'bg-warning text-warning',
                                            )}
                                        >
                                            {allValid ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                <Info className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {allValid
                                                    ? 'Ready for Submission'
                                                    : 'Review Required'}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {allValid
                                                    ? 'All sections completed successfully'
                                                    : 'Please review the sections below'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Title Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full border p-2">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Manuscript Title
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                The main title of your research
                                                work
                                            </p>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border bg-background p-4">
                                        <p className="text-base leading-relaxed font-medium">
                                            {form.data.title || (
                                                <span className="text-muted-foreground italic">
                                                    No title provided
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {/* Authors Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full border p-2">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    Authors
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Research team members and
                                                    contributors
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {authorCount} author
                                            {authorCount !== 1 ? 's' : ''}
                                        </Badge>
                                    </div>
                                    <div className="rounded-lg border bg-background p-4">
                                        {authorCount > 0 ? (
                                            <div className="space-y-2">
                                                {form.data.authors
                                                    .split(',')
                                                    .map(
                                                        (
                                                            author: string,
                                                            index: number,
                                                        ) => {
                                                            if (
                                                                author.trim() ===
                                                                ''
                                                            ) {
return null;
}

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="text-base"
                                                                >
                                                                    {index + 1}.{' '}
                                                                    {author.trim()}
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">
                                                No authors provided
                                            </span>
                                        )}
                                    </div>
                                    {/* Abstract Section */}
                                    <div
                                        className={cn(
                                            'space-y-4',
                                            !isAbstractValidReview &&
                                                form.data.abstract
                                                ? 'border-warning bg-warning/10'
                                                : '',
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full border p-2">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        Abstract
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Research summary and key
                                                        findings
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {abstractWordCountReview} words
                                            </Badge>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto rounded-lg border bg-background p-4">
                                            {form.data.abstract ? (
                                                <p className="text-base leading-relaxed">
                                                    {form.data.abstract}
                                                </p>
                                            ) : (
                                                <span className="text-muted-foreground italic">
                                                    No abstract provided
                                                </span>
                                            )}
                                        </div>
                                        {!isAbstractValidReview &&
                                            form.data.abstract && (
                                                <div className="text-warning flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        Abstract should be
                                                        50-300 words.
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                    {/* Keywords Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full border p-2">
                                                    <Tag className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        Keywords
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Research area and topic
                                                        tags
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {keywordCount} keyword
                                                {keywordCount !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                        <div className="rounded-lg border bg-background p-4">
                                            {keywordCount > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {form.data.keywords
                                                        .split(',')
                                                        .map(
                                                            (
                                                                keyword: string,
                                                                index: number,
                                                            ) => {
                                                                if (
                                                                    keyword.trim() ===
                                                                    ''
                                                                ) {
return null;
}

                                                                return (
                                                                    <Badge
                                                                        key={
                                                                            index
                                                                        }
                                                                        variant="secondary"
                                                                        className="text-sm"
                                                                    >
                                                                        {keyword.trim()}
                                                                    </Badge>
                                                                );
                                                            },
                                                        )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">
                                                    No keywords provided
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Manuscript File Section */}
                                    <div
                                        className={cn(
                                            'space-y-4',
                                            !isFileValidReview
                                                ? 'border-destructive bg-destructive/10'
                                                : 'border-success bg-success/10',
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full border p-2">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    Manuscript File
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Your research document
                                                    upload
                                                </p>
                                            </div>
                                        </div>
                                        <div className="rounded-lg border bg-background p-4">
                                            {form.data.manuscript ? (
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {
                                                                form.data
                                                                    .manuscript
                                                                    ?.name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {formatFileSize(
                                                                form.data
                                                                    .manuscript
                                                                    ?.size,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">
                                                    No file uploaded
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Important Notices */}
                                <div className="space-y-4">
                                    <Alert className="border-warning bg-warning/10">
                                        <AlertTriangle className="text-warning h-4 w-4" />
                                        <AlertDescription className="text-warning">
                                            <strong>Important:</strong> Once
                                            submitted, you cannot edit your
                                            manuscript information without
                                            contacting the editorial team.
                                        </AlertDescription>
                                    </Alert>
                                    <Alert className="border-info bg-info/10">
                                        <Info className="text-info h-4 w-4" />
                                        <AlertDescription className="text-info">
                                            <strong>Confirmation:</strong> By
                                            submitting this manuscript, you
                                            confirm that this work is original,
                                            not under consideration elsewhere,
                                            and all authors have approved this
                                            submission.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={goToPrevStep}
                            disabled={currentStep === 0}
                            className="min-w-[90px]"
                            aria-label="Previous step"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {isMobile ? '' : 'Previous'}
                        </Button>
                        <div className="flex items-center gap-2">
                            {isLastStep ? (
                                <Button
                                    type="button"
                                    disabled={
                                        processing || submitProgress < 100
                                    }
                                    onClick={handleSubmit}
                                    className="min-w-[120px]"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Submit Manuscript
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="min-w-[90px]"
                                    aria-label="Next step"
                                >
                                    {isMobile ? '' : 'Continue'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
