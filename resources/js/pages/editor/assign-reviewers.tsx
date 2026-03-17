import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, UserCheck, Calendar as CalendarIcon, Filter } from 'lucide-react';
import editor from '@/routes/editor';

interface Reviewer {
    id: number;
    name: string;
    email: string;
    affiliation: string;
    expertises: string[];
    relevance_score: number;
    completed_reviews: number;
    average_review_time_days: number;
    acceptance_rate: number;
}

interface CurrentReview {
    id: number;
    reviewer_name: string;
    status: string;
    status_label: string;
    invitation_sent_at: string;
    due_date: string;
    review_round: number;
}

interface Props extends PageProps {
    manuscript: {
        id: number;
        title: string;
        abstract: string;
        keywords: string[];
        status: string;
    };
    suitable_reviewers: Reviewer[];
    current_reviews: CurrentReview[];
}

export default function AssignReviewers({ manuscript, suitable_reviewers, current_reviews }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        reviewer_ids: [] as number[],
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 3 weeks
        review_round: 1, // Logic to determine round should be better
    });

    const breadcrumbItems = [
        { label: 'Manuscripts', href: editor.indexManuscripts.url() },
        { label: manuscript.title, href: editor.manuscripts.show.url({ id: manuscript.id }) },
        { label: 'Assign Reviewers' }
    ];

    const filteredReviewers = suitable_reviewers.filter(reviewer => 
        reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reviewer.expertises.some(e => e.toLowerCase().includes(searchTerm.toLowerCase())) ||
        reviewer.affiliation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleReviewer = (id: number) => {
        if (data.reviewer_ids.includes(id)) {
            setData('reviewer_ids', data.reviewer_ids.filter(r => r !== id));
        } else {
            setData('reviewer_ids', [...data.reviewer_ids, id]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(editor.manuscripts.assign_reviewers.store.url({ manuscript: manuscript.id }));
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Assign Reviewers - ${manuscript.title}`} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Assign Reviewers</h1>
                    <p className="text-muted-foreground">Select reviewers for the manuscript.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manuscript Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{manuscript.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {manuscript.keywords.map((keyword, i) => (
                                            <Badge key={i} variant="secondary">{keyword}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Abstract</h4>
                                    <p className="text-sm leading-relaxed">{manuscript.abstract}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Select Reviewers</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                placeholder="Search reviewers..."
                                                className="pl-8 w-[250px]"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <CardDescription>
                                    Reviewers are sorted by relevance score based on expertise match.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {filteredReviewers.length > 0 ? (
                                        filteredReviewers.map((reviewer) => (
                                            <div key={reviewer.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                <Checkbox
                                                    id={`reviewer-${reviewer.id}`}
                                                    checked={data.reviewer_ids.includes(reviewer.id)}
                                                    onCheckedChange={() => toggleReviewer(reviewer.id)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor={`reviewer-${reviewer.id}`} className="font-medium text-base cursor-pointer">
                                                            {reviewer.name}
                                                        </Label>
                                                        {reviewer.relevance_score > 0 && (
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                {reviewer.relevance_score} Relevance
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{reviewer.affiliation}</p>
                                                    <div className="flex flex-wrap gap-1 pt-1">
                                                        {reviewer.expertises.map((exp, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs font-normal">
                                                                {exp}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <UserCheck className="h-3 w-3" />
                                                            {reviewer.completed_reviews} Completed
                                                        </span>
                                                        <span>
                                                            Avg Time: {reviewer.average_review_time_days} days
                                                        </span>
                                                        <span>
                                                            Acceptance: {reviewer.acceptance_rate}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No reviewers found matching your search.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assignment Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="due_date">Due Date</Label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="due_date"
                                                type="date"
                                                className="pl-9"
                                                value={data.due_date}
                                                onChange={e => setData('due_date', e.target.value)}
                                            />
                                        </div>
                                        {errors.due_date && <p className="text-sm text-destructive">{errors.due_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Selected Reviewers ({data.reviewer_ids.length})</Label>
                                        <div className="text-sm text-muted-foreground">
                                            {data.reviewer_ids.length === 0 ? (
                                                <p>No reviewers selected</p>
                                            ) : (
                                                <ul className="list-disc list-inside">
                                                    {suitable_reviewers
                                                        .filter(r => data.reviewer_ids.includes(r.id))
                                                        .map(r => (
                                                            <li key={r.id}>{r.name}</li>
                                                        ))}
                                                </ul>
                                            )}
                                        </div>
                                        {errors.reviewer_ids && <p className="text-sm text-destructive">{errors.reviewer_ids}</p>}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={processing || data.reviewer_ids.length === 0}>
                                        {processing ? 'Assigning...' : 'Assign Reviewers'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {current_reviews.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Reviews</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {current_reviews.map((review) => (
                                            <div key={review.id} className="border rounded p-3 text-sm">
                                                <div className="font-medium">{review.reviewer_name}</div>
                                                <div className="flex justify-between mt-1">
                                                    <Badge variant="outline">{review.status_label}</Badge>
                                                    <span className="text-muted-foreground">Round {review.review_round}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-2">
                                                    Due: {review.due_date}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
