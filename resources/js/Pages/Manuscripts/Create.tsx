import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/Components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DetailsStep } from '@/Components/DetailsStep';
import { ContentStep } from '@/Components/ContentStep';
import { FileUploadStep } from '@/Components/FileUploadStep';
import { ProgressIndicator } from '@/Components/ProgressIndicator';

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
    { id: 'details', title: 'Details' },
    { id: 'content', title: 'Content' },
    { id: 'file', title: 'File Upload' },
];

export default function ManuscriptSubmissionForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const onSubmit = async (data: FormSchemaType) => {
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
            await axios.post('/author/manuscripts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast({
                title: 'Submission Successful',
                description: 'Your manuscript has been submitted for review.',
            });
            form.reset();
            setCurrentStep(0);
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
    };

    const nextStep = async () => {
        const fields = steps[currentStep].id === 'details'
            ? ['title', 'authors']
            : steps[currentStep].id === 'content'
                ? ['abstract', 'keywords']
                : ['manuscript'];

        const isStepValid = await form.trigger(fields as any);
        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Submissions
                    </h2>
                }>
                <Head title='Submissions' />
                <div className="container mx-auto py-10">
                    <Card className="max-w-3xl mx-auto">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Submit Your Manuscript</CardTitle>
                            <CardDescription>
                                Please fill in all the required information to submit your manuscript for review.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProgressIndicator steps={steps.map(step => step.title)} currentStep={currentStep} />
                            <FormProvider {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {currentStep === 0 && <DetailsStep />}
                                    {currentStep === 1 && <ContentStep />}
                                    {currentStep === 2 && <FileUploadStep />}
                                </form>
                            </FormProvider>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                            >
                                Previous
                            </Button>
                            {currentStep < steps.length - 1 ? (
                                <Button type="button" onClick={nextStep}>
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    onClick={form.handleSubmit(onSubmit)}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

