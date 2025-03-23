import { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/Components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DetailsStep } from '@/Components/submission-page/DetailsStep';
import { ContentStep } from '@/Components/submission-page/ContentStep';
import { FileUploadStep } from '@/Components/submission-page/FileUploadStep';
import { ProgressIndicator } from '@/Components/submission-page/ProgressIndicator';
import { ReviewStep } from '@/Components/submission-page/ReviewStep';
import { CheckCircle2, FileText, BookOpen, Upload, ClipboardCheck, ArrowLeft, ArrowRight, Info, ChevronRight, X } from 'lucide-react';
import { useWindowSize } from '@/hooks/use-window-size';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { CircleProgress } from '@/Components/submission-page/CircleProgress';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

const formSchema = z.object({
    title: z.string().min(10, { message: 'Title must be at least 10 characters.' }),
    authors: z.string().min(3, { message: 'Please enter at least one author.' }),
    abstract: z.string().min(100, { message: 'Abstract must be at least 100 characters.' }),
    keywords: z.string().min(3, { message: 'Please enter at least one keyword.' }),
    manuscript: z
        .custom<File | null | undefined>((value) => value instanceof File || value == null, { message: 'Invalid file.' })
        .refine((file) => !file || file.size <= 10_000_000, { message: 'File must be less than 10MB.' })
        .optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const steps = [
    { id: 'details', title: 'Details', icon: FileText, description: "Basic information about your manuscript" },
    { id: 'content', title: 'Content', icon: BookOpen, description: "Abstract and keywords for your research" },
    { id: 'file', title: 'File Upload', icon: Upload, description: "Upload your manuscript document" },
    { id: 'review', title: 'Review', icon: ClipboardCheck, description: "Verify submission details" },
];

const useManuscriptSubmission = (form: any, resetSteps: () => void) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (data: FormSchemaType) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('authors', data.authors);
        formData.append('abstract', data.abstract);
        formData.append('keywords', data.keywords);

        if (data.manuscript) {
            formData.append('manuscript', data.manuscript);
        }

        try {
            // Use the named route instead of hardcoded path
            await router.post(route('manuscripts.store'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onProgress: (progress) => {
                    if (progress && typeof progress.total === 'number') {
                        const percentage = Math.round((progress.loaded / progress.total) * 100);
                        console.log(`Upload progress: ${percentage}%`);
                    }
                },
            });

            toast({
                title: 'Submission Successful',
                description: 'Your manuscript has been submitted for review.',
                variant: "default",
            });

            form.reset();
            resetSteps();
            
            // Navigate to the manuscripts index after successful submission
            setTimeout(() => {
                router.visit(route('manuscripts.index'));
            }, 1500);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'There was an error submitting your manuscript.';
            toast({
                title: 'Submission Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [form, resetSteps]);

    return { isSubmitting, handleSubmit };
};

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

const useFormCompletion = (form: any) => {
    const [submitProgress, setSubmitProgress] = useState(0);
    const totalFields = 5;

    useEffect(() => {
        const watchAllFields = form.watch();
        let completedFields = 0;

        if (watchAllFields.title && watchAllFields.title.length >= 10) completedFields++;
        if (watchAllFields.authors && watchAllFields.authors.length >= 3) completedFields++;
        if (watchAllFields.abstract && watchAllFields.abstract.length >= 100) completedFields++;
        if (watchAllFields.keywords && watchAllFields.keywords.length >= 3) completedFields++;
        if (watchAllFields.manuscript) completedFields++;

        setSubmitProgress(Math.round((completedFields / totalFields) * 100));
    }, [form.watch()]);

    return submitProgress;
};

const validateStep = async (form: any, stepId: string) => {
    let fields: string[] = [];

    switch (stepId) {
        case 'details':
            fields = ['title', 'authors'];
            break;
        case 'content':
            fields = ['abstract', 'keywords'];
            break;
        case 'file':
            fields = ['manuscript'];
            break;
        case 'review':
            return true;
    }

    return await form.trigger(fields as any);
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

const BreadcrumbNav = ({ userRole }: { userRole: string }) => (
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
            <Link
                href={userRole === 'editor' ? route('editor.dashboard') : route('dashboard')}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
            >
                <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                {userRole === 'editor' ? 'Dashboard' : 'Home'}
            </Link>
        </div>
        <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400 dark:text-gray-500" />
        <div className="flex items-center">
            <Link
                href={route('manuscripts.index')}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
            >
                My Manuscripts
            </Link>
        </div>
        <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400 dark:text-gray-500" />
        <div className="flex items-center">
            <span className="font-medium text-green-600 dark:text-green-400">
                New Manuscript
            </span>
        </div>
    </div>
);

export default function ManuscriptSubmissionForm() {
    const { width } = useWindowSize();
    const isMobile = width !== undefined && width < 640;
    const [showHelpDialog, setShowHelpDialog] = useState(false);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            authors: '',
            abstract: '',
            keywords: '',
            manuscript: null,
        },
    });

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

    const { isSubmitting, handleSubmit } = useManuscriptSubmission(form, resetSteps);
    const submitProgress = useFormCompletion(form);

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

    return (
        <AuthenticatedLayout header="Manuscript Submission">
            <Head title='Submit Manuscript' />

            <div className="container mx-auto py-6 sm:py-10 px-4 animate-fadeIn">
                <div className="max-w-4xl mx-auto">
                    <BreadcrumbNav userRole="author" />

                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Submit New Manuscript
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Complete all steps to submit your manuscript for review
                        </p>
                    </div>

                    <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-1 w-full">
                            <ProgressIndicator
                                steps={steps.map(step => step.title)}
                                currentStep={currentStep}
                                completedSteps={completedSteps}
                            />
                        </div>

                        <div className="flex flex-col items-center">
                            <CircleProgress
                                percentage={submitProgress}
                                size={60}
                                strokeWidth={5}
                            />
                            <span className="mt-1 text-xs font-medium text-gray-500">
                                {submitProgress}% Complete
                            </span>
                        </div>
                    </div>

                    <div className="md:hidden mb-6">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-sm font-medium text-gray-700">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                            <span className="text-sm font-medium text-primary">
                                {steps[currentStep].title}
                            </span>
                        </div>
                        <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300 ease-in-out"
                                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {showValidationAlert && (
                        <Alert
                            variant="destructive"
                            className="mb-4 animate-slideDown transition-all shadow-md border-l-4 border-l-red-500"
                        >
                            <AlertTitle className="flex items-center gap-2">
                                <span className="inline-block p-1 rounded-full bg-red-100">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 5V9M8 11.01L8.01 10.999M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                Validation Error
                            </AlertTitle>
                            <AlertDescription className="pl-6">
                                Please fix the highlighted fields before proceeding.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card className="border shadow-lg transition-all duration-200 animate-fadeIn hover:shadow-xl dark:bg-gray-800 dark:border-gray-700">
                        <CardHeader className="border-b bg-muted/40 dark:bg-gray-700/50 dark:border-gray-600">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                                    <CurrentStepIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
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
                                    <CardDescription className="mt-1">
                                        {steps[currentStep].description}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6 pb-2">
                            <FormProvider {...form}>
                                <form onSubmit={form.handleSubmit((data) => handleSubmit(data))} className="space-y-6">
                                    <div className="min-h-[300px] transition-all duration-300 animate-fadeIn">
                                        {currentStep === 0 && <DetailsStep />}
                                        {currentStep === 1 && <ContentStep />}
                                        {currentStep === 2 && <FileUploadStep />}
                                        {currentStep === 3 && <ReviewStep formValues={form.getValues()} />}
                                    </div>
                                </form>
                            </FormProvider>
                        </CardContent>

                        <CardFooter className="flex justify-between py-5 border-t mt-6 dark:border-gray-700">
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
                                        type="submit"
                                        disabled={isSubmitting || submitProgress < 100}
                                        onClick={form.handleSubmit((data) => handleSubmit(data))}
                                        className="min-w-[120px] gap-2 relative overflow-hidden group transition-all duration-300"
                                    >
                                        <span className="relative z-10 flex items-center">
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
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

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm dark:bg-blue-900/20 dark:border-blue-700/50">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submission Guidelines
                        </h3>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-disc pl-5">
                            <li>Follow formatting guidelines outlined in the author instructions</li>
                            <li>Ensure your abstract (100-300 words) highlights the significance of your research</li>
                            <li>Choose specific keywords that accurately represent your paper's content</li>
                            <li>Remove all identifying information for blind peer review</li>
                            <li>Check references for accuracy and proper formatting before submission</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

