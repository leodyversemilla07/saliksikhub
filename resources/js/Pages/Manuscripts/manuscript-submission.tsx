import { useState, useEffect, useCallback } from 'react';
import { useWindowSize } from '@/hooks/use-window-size';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    Info,
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
                                                                    <CurrentStepIcon className="w-5 h-5 text-green-600" />
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

                            {/* Sidebar Area */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Submission Guidelines */}
                                <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur border border-green-100 shadow-lg dark:from-green-900/20 dark:to-emerald-900/10 dark:border-green-800/30 sticky top-6">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                                            <Info className="h-5 w-5" />
                                            Submission Guidelines
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-3">
                                            <li className="flex items-start gap-3 p-2 rounded-lg bg-white/50 dark:bg-green-900/20">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                                <span>Follow formatting guidelines outlined in the author instructions</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-2 rounded-lg bg-white/50 dark:bg-green-900/20">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                                <span>Ensure your abstract (100-300 words) highlights the significance of your research</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-2 rounded-lg bg-white/50 dark:bg-green-900/20">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                                <span>Choose specific keywords that accurately represent your paper's content</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-2 rounded-lg bg-white/50 dark:bg-green-900/20">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                                <span>Remove all identifying information for blind peer review</span>
                                            </li>
                                            <li className="flex items-start gap-3 p-2 rounded-lg bg-white/50 dark:bg-green-900/20">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                                <span>Check references for accuracy and proper formatting before submission</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* Help & Support Card */}
                                <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur border border-blue-100 shadow-lg dark:from-blue-900/20 dark:to-indigo-900/10 dark:border-blue-800/30">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                            <Info className="h-5 w-5" />
                                            Need Help?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-4">
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Having trouble with your submission? Our editorial team is here to help.
                                        </p>
                                        <div className="space-y-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full justify-start text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-900/20"
                                            >
                                                📧 Contact Editorial Team
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full justify-start text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-900/20"
                                            >
                                                📋 View Author Guidelines
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full justify-start text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-900/20"
                                            >
                                                💬 Live Chat Support
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Progress Summary Card */}
                                <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/60 backdrop-blur border border-amber-100 shadow-lg dark:from-amber-900/20 dark:to-orange-900/10 dark:border-amber-800/30">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                            <ClipboardCheck className="h-5 w-5" />
                                            Progress Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-4">
                                        <div className="space-y-2">
                                            {steps.map((step, index) => (
                                                <div key={step.id} className="flex items-center gap-2 text-sm">
                                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${completedSteps.includes(index)
                                                        ? 'bg-green-500'
                                                        : currentStep === index
                                                            ? 'bg-amber-500'
                                                            : 'bg-gray-200 dark:bg-gray-600'
                                                        }`}>
                                                        {completedSteps.includes(index) && (
                                                            <CheckCircle2 className="w-2 h-2 text-white" />
                                                        )}
                                                    </div>
                                                    <span className={`${completedSteps.includes(index)
                                                        ? 'text-green-700 dark:text-green-300 font-medium'
                                                        : currentStep === index
                                                            ? 'text-amber-700 dark:text-amber-300 font-medium'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                        {step.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                                {completedSteps.length} of {steps.length} steps completed
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
