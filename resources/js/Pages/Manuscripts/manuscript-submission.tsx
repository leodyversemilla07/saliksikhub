import { useState, useEffect, useCallback } from 'react';
import { useWindowSize } from '@/hooks/use-window-size';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "sonner";
import AppLayout from '@/layouts/app-layout';
import { DetailsStep } from '@/components/manuscript-submission/details-step';
import { ContentStep } from '@/components/manuscript-submission/content-step';
import { FileUploadStep } from '@/components/manuscript-submission/file-upload-step';
import { ReviewStep } from '@/components/manuscript-submission/review-step';
import {
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { User } from '@/types';

const steps = [
    { id: 'details', title: 'Manuscript Details', description: "Provide the essential information about your manuscript." },
    { id: 'content', title: 'Research Content', description: "Summary and keywords for your research." },
    { id: 'file', title: 'Manuscript Upload', description: "Upload your manuscript document." },
    { id: 'review', title: 'Review Submission', description: "Review your submission details." },
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
            if (field === 'title') form.setError('title', message as string);
            else if (field === 'authors') form.setError('authors', message as string);
            else if (field === 'abstract') form.setError('abstract', message as string);
            else if (field === 'keywords') form.setError('keywords', message as string);
            else if (field === 'manuscript') form.setError('manuscript', message as string);
        });

        if (serverErrors.title || serverErrors.authors) resetSteps();
        else if (serverErrors.abstract || serverErrors.keywords) { resetSteps(); goToNextStep(); }
        else if (serverErrors.manuscript) { resetSteps(); goToNextStep(); goToNextStep(); }

        setShowValidationAlert(true);
    }, [serverErrors, form, goToNextStep, resetSteps, setShowValidationAlert]);

    const nextStep = async () => {
        const currentStepId = steps[currentStep].id;

        if (currentStepId === 'review') { markStepCompleted(); goToNextStep(); return; }

        const isStepValid = await validateStep(form, currentStepId);
        if (isStepValid) { markStepCompleted(); goToNextStep(); } else { setShowValidationAlert(true); }
    };

    const breadcrumbItems = [
        { label: 'Dashboard', href: route('dashboard') },
        { label: 'Manuscripts', href: route('manuscripts.index') },
        { label: 'Submit Manuscript' }
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title='Submit Manuscript' />
            <div className="w-full max-w-2xl mx-auto py-8 px-2">
                <h1 className="text-2xl font-bold mb-2 text-center">Submit New Manuscript</h1>
                <p className="text-center mb-6">Follow the steps to submit your manuscript.</p>
                <Card className="shadow-none border bg-card text-card-foreground">
                    <CardHeader className="border-b bg-transparent rounded-t">
                        <CardTitle className="text-lg font-semibold">{steps[currentStep].title}</CardTitle>
                        <div className="text-sm">{steps[currentStep].description}</div>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                        {showValidationAlert && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-destructive" />
                                    Validation Error
                                </AlertTitle>
                                <AlertDescription>
                                    Please fix the highlighted fields before proceeding.
                                </AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={e => { 
                            e.preventDefault(); 
                            if (isLastStep) {
                                handleSubmit();
                            } else {
                                nextStep();
                            }
                        }}>
                            <div>
                                {currentStep === 0 && (
                                    <DetailsStep data={form.data} setData={form.setData} errors={form.errors} clearErrors={() => form.clearErrors()} />
                                )}
                                {currentStep === 1 && (
                                    <ContentStep data={form.data} setData={form.setData} errors={form.errors} clearErrors={() => form.clearErrors()} />
                                )}
                                {currentStep === 2 && (
                                    <FileUploadStep data={form.data} setData={form.setData} errors={form.errors} progress={form.progress} clearErrors={() => form.clearErrors()} />
                                )}
                                {currentStep === 3 && <ReviewStep formValues={form.data} />}
                            </div>
                            <CardFooter className="flex justify-between items-center gap-2 px-0 pt-6 border-t bg-transparent rounded-b">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={goToPrevStep}
                                    disabled={currentStep === 0}
                                    className="min-w-[90px]"
                                    aria-label="Previous step"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {isMobile ? '' : 'Previous'}
                                </Button>
                                <div className="flex items-center gap-2">
                                    {isLastStep ? (
                                        <Button
                                            type="button"
                                            disabled={processing || submitProgress < 100}
                                            onClick={handleSubmit}
                                            className="min-w-[120px]"
                                        >
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
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={nextStep}
                                            className="min-w-[90px]"
                                            aria-label="Next step"
                                        >
                                            {isMobile ? '' : 'Continue'}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
