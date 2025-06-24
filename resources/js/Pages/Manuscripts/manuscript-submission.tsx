import { useState, useEffect, useCallback } from 'react';
import { useWindowSize } from '@/hooks/use-window-size';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "sonner";
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { DetailsStep } from '@/components/manuscript-submission/details-step';
import { ContentStep } from '@/components/manuscript-submission/content-step';
import { FileUploadStep } from '@/components/manuscript-submission/file-upload-step';
import { ReviewStep } from '@/components/manuscript-submission/review-step';
import { ProgressIndicator } from '@/components/manuscript-submission/progress-indicator';
import { CircleProgress } from '@/components/manuscript-submission/circle-progress';
import {
    CheckCircle2,
    FileText,
    BookOpen,
    Upload,
    ClipboardCheck,
    ArrowLeft,
    ArrowRight,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { User } from '@/types';

const steps = [
    { id: 'details', title: 'Manuscript Details', icon: FileText, description: "Provide the essential information about your manuscript. This helps editors and reviewers understand your work." },
    { id: 'content', title: 'Research Content', icon: BookOpen, description: "Provide a comprehensive summary of your research and relevant keywords to help readers discover your work." },
    { id: 'file', title: 'Manuscript Upload', icon: Upload, description: "Upload your manuscript document for submission. Ensure it follows our formatting guidelines." },
    { id: 'review', title: 'Review Submission', icon: ClipboardCheck, description: "Please review your submission details carefully. Once submitted, modifications will require editorial approval." },
];

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
            setCompletedSteps(prev => [...prev, currentStep]);
        }
    }, [currentStep, completedSteps]);

    const goToNextStep = useCallback(() => {
        setCurrentStep(prev => Math.min(prev + 1, stepCount - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [stepCount]);

    const goToPrevStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
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
        resetSteps
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useFormCompletion = (form: any) => {
    const [submitProgress, setSubmitProgress] = useState(0);
    const totalFields = 5;

    useEffect(() => {
        const data = form.data;
        let completedFields = 0;

        if (data.title && data.title.length >= 10) completedFields++;
        if (data.authors && data.authors.length >= 3) completedFields++;
        if (data.abstract && data.abstract.length >= 100) completedFields++;
        if (data.keywords && data.keywords.length >= 3) completedFields++;
        if (data.manuscript) completedFields++;

        setSubmitProgress(Math.round((completedFields / totalFields) * 100));
    }, [form.data]);

    return submitProgress;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                form.setError('title', 'The title must be at least 10 characters.');
                isValid = false;
            }

            // Validate authors
            if (!form.data.authors || form.data.authors.trim() === '') {
                form.setError('authors', 'The authors field is required.');
                isValid = false;
            } else if (form.data.authors.trim().length < 3) {
                form.setError('authors', 'The authors must be at least 3 characters.');
                isValid = false;
            }
            break;

        case 'content':
            // Validate abstract
            if (!form.data.abstract || form.data.abstract.trim() === '') {
                form.setError('abstract', 'The abstract field is required.');
                isValid = false;
            } else if (form.data.abstract.trim().length < 100) {
                form.setError('abstract', 'The abstract must be at least 100 characters.');
                isValid = false;
            }

            // Validate keywords
            if (!form.data.keywords || form.data.keywords.trim() === '') {
                form.setError('keywords', 'The keywords field is required.');
                isValid = false;
            } else if (form.data.keywords.trim().length < 3) {
                form.setError('keywords', 'The keywords must be at least 3 characters.');
                isValid = false;
            }
            break;

        case 'file':
            // Validate manuscript
            if (!form.data.manuscript) {
                form.setError('manuscript', 'The manuscript field is required.');
                isValid = false;
            }
            break;

        case 'review':
            return true;
    }

    return isValid;
};

const useManuscriptSubmission = (resetSteps: () => void) => {
    const form = useForm({
        title: '',
        authors: '',
        abstract: '',
        keywords: '',
        manuscript: null,
    });

    const { flash } = usePage<PageProps>().props;

    const handleSubmit = useCallback(() => {
        form.post(route('manuscripts.store'), {
            preserveScroll: true,
            errorBag: 'manuscriptSubmission',
            onSuccess: () => {
                toast.success('Submission Successful', {
                    description: flash?.message || 'Your manuscript has been submitted for review.',
                });
                form.reset();
                resetSteps();
            },
            onError: (errors) => {
                toast.error('Submission Failed', {
                    description: Object.values(errors)[0] as string || 'There was an error submitting your manuscript.'
                });
            },
        });
    }, [form, resetSteps, flash]);

    return { form, processing: form.processing, handleSubmit };
};

export default function ManuscriptSubmissionForm() {
    const { errors: serverErrors } = usePage<PageProps>().props;
    const { width } = useWindowSize();
    const isMobile = width !== undefined && width < 640;

    const {
        currentStep,
        completedSteps,
        isLastStep,
        showValidationAlert,
        setShowValidationAlert,
        markStepCompleted,
        goToNextStep,
        goToPrevStep,
        resetSteps
    } = useStepNavigation(steps.length);

    const { form, processing, handleSubmit } = useManuscriptSubmission(resetSteps);
    const submitProgress = useFormCompletion(form);

    useEffect(() => {
        if (!serverErrors || Object.keys(serverErrors).length === 0) return;

        Object.entries(serverErrors).forEach(([field, message]) => {
            // Use explicit field checks for type safety
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

    const CurrentStepIcon = steps[currentStep].icon;

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
        },
        {
            label: 'Manuscripts',
            href: route('manuscripts.index'),
        },
        {
            label: 'Submit Manuscript',
        }
    ];

    return (
        <AuthenticatedLayout
            breadcrumbItems={breadcrumbItems}
        >
            <Head title='Submit Manuscript' />
            <div>
                <div className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full">
                        <div className="mb-12 text-center">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-3xl rounded-full scale-150"></div>
                                <h1 className="relative text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                                    Submit New Manuscript
                                </h1>
                            </div>
                            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                                Follow our streamlined process to submit your manuscript. Each step is designed to ensure your submission meets our editorial standards and gets the attention it deserves.
                            </p>
                        </div>

                        <div className="mb-8 grid grid-cols-1 xl:grid-cols-4 gap-6">
                            <div className="xl:col-span-3">
                                <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-6 rounded-2xl shadow-lg flex justify-center">
                                    <ProgressIndicator
                                        steps={steps.map(step => step.title)}
                                        currentStep={currentStep}
                                        completedSteps={completedSteps}
                                    />
                                </div>
                            </div>

                            <div className="xl:col-span-1">
                                <div className="flex flex-col items-center bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/30 dark:border-gray-600/30 h-full justify-center">
                                    <CircleProgress
                                        percentage={submitProgress}
                                        size={90}
                                        strokeWidth={8}
                                    />
                                    <span className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {submitProgress}% Complete
                                    </span>
                                </div>
                            </div>
                        </div>

                        {showValidationAlert && (
                            <Alert
                                variant="destructive"
                                className="mb-6 animate-slideDown transition-all shadow-md border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20"
                            >
                                <AlertTitle className="flex items-center gap-2">
                                    <span className="inline-block p-1 rounded-full bg-red-100">
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                    </span>
                                    Validation Error
                                </AlertTitle>
                                <AlertDescription className="pl-6">
                                    Please fix the highlighted fields before proceeding.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Main Form Area */}
                            <div className="lg:col-span-3">
                                <Card className="border-none shadow-xl transition-all duration-200 animate-fadeIn hover:shadow-2xl backdrop-blur bg-background/95 h-fit">
                                    <CardHeader className="border-b bg-muted/50 dark:bg-gray-800/50 dark:border-gray-700 rounded-t-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-full bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                                                <CurrentStepIcon className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                                                    {steps[currentStep].title}
                                                </CardTitle>
                                                <CardDescription className="mt-1 text-base">
                                                    {steps[currentStep].description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-6 pb-2">
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            if (isLastStep) {
                                                handleSubmit();
                                            } else {
                                                nextStep();
                                            }
                                        }} className="space-y-6">
                                            <div className="min-h-[400px] transition-all duration-300 animate-fadeIn">
                                                {currentStep === 0 && (
                                                    <DetailsStep
                                                        data={form.data}
                                                        setData={form.setData}
                                                        errors={form.errors}
                                                        clearErrors={() => form.clearErrors()}
                                                    />
                                                )}
                                                {currentStep === 1 && (
                                                    <ContentStep
                                                        data={form.data}
                                                        setData={form.setData}
                                                        errors={form.errors}
                                                        clearErrors={() => form.clearErrors()}
                                                    />
                                                )}
                                                {currentStep === 2 && (
                                                    <FileUploadStep
                                                        data={form.data}
                                                        setData={form.setData}
                                                        errors={form.errors}
                                                        progress={form.progress}
                                                        clearErrors={() => form.clearErrors()}
                                                    />
                                                )}
                                                {currentStep === 3 && <ReviewStep formValues={form.data} />}
                                            </div>
                                        </form>
                                    </CardContent>

                                    <CardFooter className="flex justify-between py-6 border-t mt-6 bg-gradient-to-r from-muted/20 to-muted/40 dark:border-gray-700 rounded-b-xl backdrop-blur-sm">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={goToPrevStep}
                                            disabled={currentStep === 0}
                                            className={`min-w-[100px] group transition-all duration-300 ${currentStep === 0
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:border-green-500/30 hover:shadow-md'
                                                }`}
                                            aria-label="Previous step"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                                            {isMobile ? '' : 'Previous'}
                                        </Button>

                                        <div className="flex items-center gap-3">
                                            {isLastStep ? (
                                                <Button
                                                    type="button"
                                                    disabled={processing || submitProgress < 100}
                                                    onClick={handleSubmit}
                                                    className="min-w-[120px] gap-2 relative overflow-hidden group transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl disabled:opacity-50"
                                                >
                                                    <span className="relative z-10 flex items-center">
                                                        {processing ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                                Submit Manuscript
                                                            </>
                                                        )}
                                                    </span>
                                                    <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="min-w-[100px] group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                    aria-label="Next step"
                                                >
                                                    {isMobile ? '' : 'Continue'}
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
