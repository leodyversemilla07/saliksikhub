import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, User, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import issuesRoutes from '@/routes/issues';

interface JournalIssue {
    id: number;
    volume_number: number;
    issue_number: number;
    issue_title: string | null;
    description: string | null;
    publication_date: string | null;
    status: 'draft' | 'in_review' | 'published' | 'archived';
    theme: string | null;
}

interface Manuscript {
    id: number;
    title: string;
    authors: string;
    abstract: string;
    status: string;
    submission_date: string;
    user: {
        id: number;
        name: string;
    };
}

interface AssignManuscriptsProps {
    issue: JournalIssue;
    availableManuscripts: Manuscript[];
}

export default function AssignManuscripts({ issue, availableManuscripts }: AssignManuscriptsProps) {
    const [selectedManuscripts, setSelectedManuscripts] = useState<number[]>([]);    const { setData, post, processing } = useForm({
        data: {
            manuscript_ids: [] as number[]
        }
    });    const handleManuscriptToggle = (manuscriptId: number) => {
        const updatedManuscripts = selectedManuscripts.includes(manuscriptId)
            ? selectedManuscripts.filter(id => id !== manuscriptId)
            : [...selectedManuscripts, manuscriptId];

        setSelectedManuscripts(updatedManuscripts);
        setData('data.manuscript_ids', updatedManuscripts);
    };    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedManuscripts.length === 0) {
            alert('Please select at least one manuscript to assign.');
            return;
        }

        // Ensure form data is up to date before submission
        setData('data.manuscript_ids', selectedManuscripts);

        post(issuesRoutes.assignManuscripts.url({ id: issue.id }), {
            onSuccess: () => {
                router.visit(issuesRoutes.show.url({ id: issue.id }));
            }
        });
    };

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: dashboard.url(),
        },
        {
            label: 'Journal Issues',
            href: issuesRoutes.index.url(),
        },
        {
            label: `Vol. ${issue.volume_number}, Issue ${issue.issue_number}`,
            href: issuesRoutes.show.url({ id: issue.id }),
        },
        {
            label: 'Assign Manuscripts',
            href: issuesRoutes.assignManuscripts.url({ id: issue.id }),
        }
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Assign Manuscripts - Vol. ${issue.volume_number}, Issue ${issue.issue_number}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Assign Manuscripts
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Volume {issue.volume_number}, Issue {issue.issue_number}
                                {issue.issue_title && ` - ${issue.issue_title}`}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-6 w-6" />
                                Available Manuscripts ({availableManuscripts.length})
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Select manuscripts that are ready for publication to assign to this issue.
                            </p>
                        </CardHeader>
                        <CardContent>
                            {availableManuscripts.length > 0 ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-4">
                                        {availableManuscripts.map((manuscript) => (
                                            <div
                                                key={manuscript.id}
                                                className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <Checkbox
                                                    id={`manuscript-${manuscript.id}`}
                                                    checked={selectedManuscripts.includes(manuscript.id)}
                                                    onCheckedChange={() => handleManuscriptToggle(manuscript.id)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <label
                                                        htmlFor={`manuscript-${manuscript.id}`}
                                                        className="block cursor-pointer"
                                                    >
                                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                            {manuscript.title}
                                                        </h4>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                            <span className="flex items-center gap-1">
                                                                <User className="h-4 w-4" />
                                                                {manuscript.user.name}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4" />
                                                                {new Date(manuscript.submission_date).toLocaleDateString()}
                                                            </span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {manuscript.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Authors: {manuscript.authors}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">
                                                            {manuscript.abstract}
                                                        </p>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedManuscripts.length} manuscript(s) selected
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.visit(issuesRoutes.show.url({ id: issue.id }))}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing || selectedManuscripts.length === 0}
                                            >
                                                {processing ? 'Assigning...' : `Assign ${selectedManuscripts.length} Manuscript(s)`}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No manuscripts available
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        There are no manuscripts ready for publication that can be assigned to this issue.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => router.visit(issuesRoutes.show.url({ id: issue.id }))}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Issue
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
