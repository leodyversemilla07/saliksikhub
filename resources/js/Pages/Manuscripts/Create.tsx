'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { FileText, Users, BookOpen, Tag, Upload } from 'lucide-react';
import { Toast } from '@/Components/ui/toast';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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

export default function ManuscriptSubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            authors: '',
            abstract: '',
            keywords: '',
            manuscript: null,
        },
    });

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
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
            await axios.post('/manuscripts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast({
                title: 'Submission Successful',
                description: 'Your manuscript has been submitted for review.',
            });
            form.reset();
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

    return (
        <>
            <Head title='Submissions' />
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Submissions
                    </h2>
                }>
                <div className="container mx-auto py-10">
                    <Card className="max-w-3xl mx-auto">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Submit Your Manuscript</CardTitle>
                            <CardDescription>
                                Please fill in all the required information to submit your manuscript for review.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <fieldset disabled={isSubmitting} className="space-y-6">
                                        <Tabs defaultValue="details" className="w-full">
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="details">Details</TabsTrigger>
                                                <TabsTrigger value="content">Content</TabsTrigger>
                                                <TabsTrigger value="file">File Upload</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="details" className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <FileText className="w-4 h-4" />
                                                                Manuscript Title
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input id="title" placeholder="Enter the title of your manuscript" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Provide a concise and descriptive title for your manuscript.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                <FormField
                                                    control={form.control}
                                                    name="authors"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel htmlFor="authors" className="flex items-center gap-2">
                                                                <Users className="w-4 h-4" />
                                                                Authors
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input id="authors" placeholder="Enter authors' names" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                List all authors, separated by commas (e.g., John Doe, Jane Smith).
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                            </TabsContent>
                                            <TabsContent value="content" className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="abstract"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel htmlFor="abstract" className="flex items-center gap-2">
                                                                <BookOpen className="w-4 h-4" />
                                                                Abstract
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    id="abstract"
                                                                    placeholder="Enter your manuscript's abstract"
                                                                    className="resize-none h-40"
                                                                    rows={5}
                                                                    {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Provide a brief summary of your research (100-300 words).
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                <FormField
                                                    control={form.control}
                                                    name="keywords"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel htmlFor="keywords" className="flex items-center gap-2">
                                                                <Tag className="w-4 h-4" />
                                                                Keywords
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input id="keywords" placeholder="Enter keywords" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Enter keywords related to your research, separated by commas.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                            </TabsContent>
                                            <TabsContent value="file" className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="manuscript"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel htmlFor="manuscript" className="flex items-center gap-2">
                                                                <Upload className="w-4 h-4" />
                                                                Manuscript File
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    id="manuscript"
                                                                    type="file"
                                                                    accept=".pdf,.doc,.docx"
                                                                    onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Upload your manuscript file (PDF, DOC, or DOCX format, max 10MB).
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                            </TabsContent>
                                        </Tabs>
                                    </fieldset>
                                </form>
                            </Form>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)} className="w-full bg-green-600 hover:bg-green-700">
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
