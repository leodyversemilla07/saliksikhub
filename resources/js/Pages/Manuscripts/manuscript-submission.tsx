import { useState, useEffect, useCallback } from 'react';
import { useWindowSize } from '@/hooks/use-window-size';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from "sonner";
import { Breadcrumb } from '@/components/breadcrumb';
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
    Info,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { User } from '@/types';

const steps = [
    { id: 'details', title: 'Details', icon: FileText, description: "Basic information about your manuscript" },
    { id: 'content', title: 'Content', icon: BookOpen, description: "Abstract and keywords for your research" },
    { id: 'file', title: 'File Upload', icon: Upload, description: "Upload your manuscript document" },
    { id: 'review', title: 'Review', icon: ClipboardCheck, description: "Verify submission details" },
];

interface FormSchemaType {
    title: string;
    authors: string;
    abstract: string;
    keywords: string;
    manuscript: File | null;
    [key: string]: string | File | null;
}

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

const useFormCompletion = (form: ReturnType<typeof useForm<FormSchemaType>>) => {
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

const validateStep = async (form: ReturnType<typeof useForm<FormSchemaType>>, stepId: string) => {
    form.clearErrors();

    let fields: string[] = [];
    let validationRules: Record<string, { required: boolean; minLength?: number; }> = {};

    switch (stepId) {
        case 'details':
            validationRules = {
                'title': { required: true, minLength: 10 },
                'authors': { required: true, minLength: 3 }
            };
            fields = Object.keys(validationRules);
            break;
        case 'content':
            validationRules = {
                'abstract': { required: true, minLength: 100 },
                'keywords': { required: true, minLength: 3 }
            };
            fields = Object.keys(validationRules);
            break;
        case 'file':
            validationRules = {
                'manuscript': { required: true }
            };
            fields = Object.keys(validationRules);
            break;
        case 'review':
            return true;
    }

    let isValid = true;
    fields.forEach(field => {
        const value = form.data[field];
        const rules = validationRules[field];

        if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
            form.setError(field, `The ${field} field is required.`);
            isValid = false;
        } else if (rules.minLength && typeof value === 'string' && value.trim().length < rules.minLength) {
            form.setError(field, `The ${field} must be at least ${rules.minLength} characters.`);
            isValid = false;
        }
    });

    return isValid;
};

const HelpContent = ({ stepId }: { stepId: string }) => {
    return (
        <p className="text-sm text-muted-foreground">
            {stepId === 'details' && (
                "In this step, provide the basic information about your manuscript including the title and authors. Make sure the title is descriptive and accurately represents your research."
            )}
            {stepId === 'content' && (
                "Provide an abstract that summarizes your research and keywords that will help others find your work. The abstract should clearly state your research objectives, methods, results, and conclusions."
            )}
            {stepId === 'file' && (
                "Upload your manuscript file in PDF format. Ensure that your document follows all formatting guidelines and includes all necessary sections (introduction, methodology, results, discussion, references)."
            )}
            {stepId === 'review' && (
                "Review all the information you've provided before final submission. Once submitted, you won't be able to make changes without contacting the editorial team."
            )}
        </p>
    );
};

const useManuscriptSubmission = (resetSteps: () => void) => {
    const form = useForm<FormSchemaType>({
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
    const [showHelpDialog, setShowHelpDialog] = useState(false);

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
            form.setError(field, message as string);
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
            label: 'My Manuscripts',
            href: route('manuscripts.index'),
        },
        {
            label: 'New Manuscript',
        }
    ];

    return (
        <AuthenticatedLayout header="Manuscript Submission">
            <Head title='Submit Manuscript' />
            <Breadcrumb items={breadcrumbItems} />
            <div className="container mx-auto py-6 sm:py-10 px-4 animate-fadeIn">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 text-center mt-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Submit New Manuscript
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Follow our step-by-step process to submit your manuscript. Each section helps ensure your submission meets our requirements.
                        </p>
                    </div>

                    <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/30 p-4 rounded-lg">
                        <div className="flex-1 w-full">
                            <ProgressIndicator
                                steps={steps.map(step => step.title)}
                                currentStep={currentStep}
                                completedSteps={completedSteps}
                            />
                        </div>

                        <div className="flex flex-col items-center bg-background p-4 rounded-lg shadow-sm">
                            <CircleProgress
                                percentage={submitProgress}
                                size={80}
                                strokeWidth={6}
                            />
                            <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {submitProgress}% Complete
                            </span>
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

                    <Card className="border-none shadow-xl transition-all duration-200 animate-fadeIn hover:shadow-2xl backdrop-blur bg-background/95">
                        <CardHeader className="border-b bg-muted/50 dark:bg-gray-800/50 dark:border-gray-700 rounded-t-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                                    <CurrentStepIcon className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2">
                                        {steps[currentStep].title}
                                        <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-full"
                                                >
                                                    <Info className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2">
                                                        <CurrentStepIcon className="w-5 h-5 text-primary" />
                                                        About "{steps[currentStep].title}" Step
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="py-3">
                                                    <HelpContent stepId={steps[currentStep].id} />
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={() => setShowHelpDialog(false)}>
                                                        Got it
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
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
                                <div className="min-h-[300px] transition-all duration-300 animate-fadeIn">
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

                        <CardFooter className="flex justify-between py-6 border-t mt-6 bg-muted/30 dark:border-gray-700 rounded-b-xl">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goToPrevStep}
                                disabled={currentStep === 0}
                                className={`min-w-[100px] group transition-all duration-200 ${currentStep === 0 ? 'opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                aria-label="Previous step"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                {isMobile ? '' : 'Previous'}
                            </Button>

                            <div className="flex items-center gap-3">
                                {isLastStep ? (
                                    <Button
                                        type="button"
                                        disabled={processing || submitProgress < 100}
                                        onClick={handleSubmit}
                                        className="min-w-[120px] gap-2 relative overflow-hidden group transition-all duration-300"
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
                                                    Submit
                                                </>
                                            )}
                                        </span>
                                        <span className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="min-w-[100px] group bg-primary hover:bg-primary/90 transition-all duration-300"
                                        aria-label="Next step"
                                    >
                                        {isMobile ? '' : 'Next'}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>

                    <div className="mt-8 p-6 bg-blue-50/50 backdrop-blur border border-blue-100 rounded-xl shadow-sm dark:bg-blue-900/10 dark:border-blue-800/30">
                        <h3 className="text-base font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                            <Info className="h-5 w-5 mr-2" />
                            Submission Guidelines
                        </h3>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2.5 list-none pl-7">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                Follow formatting guidelines outlined in the author instructions
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                Ensure your abstract (100-300 words) highlights the significance of your research
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                Choose specific keywords that accurately represent your paper's content
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                Remove all identifying information for blind peer review
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                Check references for accuracy and proper formatting before submission
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
