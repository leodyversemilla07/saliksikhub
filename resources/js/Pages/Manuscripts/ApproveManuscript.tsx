import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, FileText, AlertTriangle } from 'lucide-react';

interface Author {
    name: string;
}

interface ManuscriptProps {
    id: number;
    title: string;
    authors: string[];
    status: string;
    final_pdf_url: string | null;
}

const ApproveManuscript: React.FC<PageProps<{ manuscript: ManuscriptProps }>> = ({ auth, manuscript }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { post, processing } = useForm({});

    const handleApprove = () => {
        setIsSubmitting(true);

        post(route('manuscripts.approve.submit', manuscript.id), {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Manuscript has been approved for publication.",
                });
            },
            onError: (errors) => {
                console.error(errors);
                toast({
                    title: "Error",
                    description: "Failed to approve the manuscript. Please try again.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <AuthenticatedLayout header="Approve Manuscript">
            <Head title="Approve Manuscript" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">Approve Manuscript for Publication</h1>
                        <Badge
                            variant="outline"
                            className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium ${getStatusColor(manuscript.status)}`}
                        >
                            {manuscript.status}
                        </Badge>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-xl">
                                        <FileText className="h-5 w-5 mr-2" />
                                        Manuscript Details
                                    </CardTitle>
                                    <CardDescription>Review the finalized manuscript</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-5">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                                            <p className="text-lg font-semibold text-gray-900">{manuscript.title}</p>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Authors</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {manuscript.authors.map((author, index) => (
                                                    <Badge key={index} variant="secondary" className="text-sm">
                                                        {author}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col pt-0">
                                    <Button
                                        onClick={handleApprove}
                                        disabled={processing || isSubmitting || !manuscript.final_pdf_url}
                                        className="w-full"
                                        variant="default"
                                        size="lg"
                                    >
                                        {processing || isSubmitting ? (
                                            <>Processing...</>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Approve for Publication
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Alert className="bg-amber-50 border-amber-200 text-amber-800 shadow-sm">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <AlertTitle>Important Notice</AlertTitle>
                                <AlertDescription className="mt-2">
                                    By approving this manuscript, you confirm that it's ready for publication in the journal.
                                    This action cannot be undone.
                                </AlertDescription>
                            </Alert>
                        </div>

                        <div className="lg:col-span-2">
                            <Card className="h-full shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl">Final Manuscript PDF</CardTitle>
                                    <CardDescription>Review the final version before approval</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[700px]">
                                    {manuscript.final_pdf_url ? (
                                        <div className="h-full flex flex-col">
                                            <div className="bg-gray-100 p-2 flex justify-between items-center mb-2 rounded">
                                                <span className="text-sm font-medium truncate">
                                                    {manuscript.title}
                                                </span>
                                                <a
                                                    href={manuscript.final_pdf_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Open in new tab
                                                </a>
                                            </div>
                                            <div className="flex-1 border border-gray-200 rounded bg-white">
                                                <iframe
                                                    src={manuscript.final_pdf_url}
                                                    className="w-full h-full rounded"
                                                    title={`Finalized manuscript: ${manuscript.title}`}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500 rounded border-2 border-dashed border-gray-300 p-8">
                                            <FileText size={48} className="text-gray-400 mb-3" />
                                            <p className="text-center font-medium">No finalized PDF available for this manuscript</p>
                                            <p className="text-sm text-gray-400 mt-2 text-center">The author needs to upload the final version before approval.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ApproveManuscript;
