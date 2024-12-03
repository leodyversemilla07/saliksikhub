import React, { useState } from 'react';
import { UserCheck, CheckCircle, XCircle, Book, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

type Manuscript = {
    id: number;
    title: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    status: 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected';
    authors: string | string[] | null;
};

type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
};

type Reviewer = User;

export default function ManuscriptReviewerAssignment({
    manuscripts,
    reviewers,
}: {
    manuscripts: Manuscript[];
    reviewers: Reviewer[];
}) {
    const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
    const [reviewerAssignments, setReviewerAssignments] = useState<{
        [manuscriptId: number]: Reviewer[];
    }>({});
    const [availableReviewers, setAvailableReviewers] = useState<Reviewer[]>(reviewers);
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState<any>({});

    const assignReviewer = (reviewer: Reviewer) => {
        if (selectedManuscript) {
            const manuscriptId = selectedManuscript.id;
            const currentAssignments = reviewerAssignments[manuscriptId] || [];
            if (currentAssignments.length < 3) {
                setReviewerAssignments({
                    ...reviewerAssignments,
                    [manuscriptId]: [...currentAssignments, reviewer],
                });
                setAvailableReviewers(availableReviewers.filter((r) => r.id !== reviewer.id));
            }
        }
    };

    const removeReviewer = (reviewer: Reviewer) => {
        if (selectedManuscript) {
            const manuscriptId = selectedManuscript.id;
            const currentAssignments = reviewerAssignments[manuscriptId] || [];
            setReviewerAssignments({
                ...reviewerAssignments,
                [manuscriptId]: currentAssignments.filter((r) => r.id !== reviewer.id),
            });
            setAvailableReviewers([...availableReviewers, reviewer]);
        }
    };

    const submitReviewerAssignments = async () => {
        if (selectedManuscript) {
            const manuscriptId = selectedManuscript.id;
            const assignedReviewers = reviewerAssignments[manuscriptId] || [];

            // Submit the data using Inertia
            try {
                await Inertia.post(route('assign.reviewer', manuscriptId), {
                    reviewer_id: assignedReviewers.map((reviewer) => reviewer.id),
                });

                // Reset selected manuscript after submission
                setSelectedManuscript(null);
            } catch (error: any) {
                // Type error as any to access response data
                if (error.response) {
                    setErrors(error.response.data.errors); // Capture validation errors
                }
            }
        }
    };

    const getAssignedReviewers = (manuscriptId: number) => {
        return reviewerAssignments[manuscriptId] || [];
    };

    const filteredReviewers = availableReviewers.filter(
        (reviewer) =>
            reviewer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reviewer.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reviewer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manuscript Review Assignment
                </h2>
            }
        >
            <Head title="Manuscript Review Assignment" />
            <div className="p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                            <Book className="inline-block mr-3 text-primary" />
                            Manuscripts Awaiting Review
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-muted text-muted-foreground">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Title</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {manuscripts.map((manuscript) => (
                                        <tr
                                            key={manuscript.id}
                                            className={`border-b transition-colors hover:bg-muted/50 ${selectedManuscript?.id === manuscript.id ? 'bg-primary/10' : ''
                                                }`}
                                        >
                                            <td className="p-4">{manuscript.id}</td>
                                            <td className="p-4 font-medium">{manuscript.title}</td>
                                            <td className="p-4">
                                                <Badge variant={manuscript.status === 'Accepted' ? 'secondary' : 'default'}>
                                                    {manuscript.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Button
                                                    variant={selectedManuscript?.id === manuscript.id ? "secondary" : "outline"}
                                                    size="sm"
                                                    onClick={() => setSelectedManuscript(manuscript)}
                                                >
                                                    <UserCheck className="w-4 h-4 mr-2" />
                                                    {selectedManuscript?.id === manuscript.id ? 'Selected' : 'Assign Reviewers'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {selectedManuscript && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl">
                                <UserCheck className="inline-block mr-3 text-primary" />
                                Assign Reviewers for: {selectedManuscript.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 space-y-4">
                                    <h4 className="font-semibold text-lg mb-3">Selected Reviewers</h4>
                                    {getAssignedReviewers(selectedManuscript.id).map((reviewer) => (
                                        <Card key={reviewer.id}>
                                            <CardContent className="p-4 flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">
                                                        {reviewer.firstname} {reviewer.lastname}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{reviewer.email}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeReviewer(reviewer)}
                                                    className="text-destructive hover:text-destructive/90"
                                                >
                                                    <XCircle size={20} />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="md:col-span-2 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Search className="text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Search reviewers..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-grow"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {filteredReviewers.map((reviewer) => (
                                            <Card
                                                key={reviewer.id}
                                                className="cursor-pointer transition-shadow hover:shadow-md"
                                                onClick={() => assignReviewer(reviewer)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h5 className="font-semibold">
                                                                {reviewer.firstname} {reviewer.lastname}
                                                            </h5>
                                                            <p className="text-sm text-muted-foreground">{reviewer.email}</p>
                                                        </div>
                                                        <CheckCircle className="text-green-500" size={20} />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setSelectedManuscript(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={submitReviewerAssignments}
                                    disabled={getAssignedReviewers(selectedManuscript.id).length === 0}
                                >
                                    Confirm Assignments
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
