import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    UserPlus, 
    Search, 
    CheckCircle2, 
    Clock,
    TrendingUp,
    Mail,
    Building,
    AlertCircle
} from 'lucide-react';
import type { Reviewer } from '@/types/review';

interface ReviewerAssignmentProps {
    manuscriptId: number;
    suitableReviewers: Reviewer[];
    currentReviews?: any[];
    onSuccess?: () => void;
}

export function ReviewerAssignment({
    manuscriptId,
    suitableReviewers,
    currentReviews = [],
    onSuccess,
}: ReviewerAssignmentProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReviewers, setSelectedReviewers] = useState<number[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        reviewer_ids: [] as number[],
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0], // 3 weeks from now
        review_round: 1,
        invitation_message: '',
    });

    const filteredReviewers = suitableReviewers.filter((reviewer) =>
        reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reviewer.affiliation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleReviewer = (reviewerId: number) => {
        const newSelection = selectedReviewers.includes(reviewerId)
            ? selectedReviewers.filter((id) => id !== reviewerId)
            : [...selectedReviewers, reviewerId];

        setSelectedReviewers(newSelection);
        setData('reviewer_ids', newSelection);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('editor.manuscripts.assign_reviewers.store', manuscriptId), {
            onSuccess: () => {
                setSelectedReviewers([]);
                onSuccess?.();
            },
        });
    };

    const getReviewerScore = (reviewer: Reviewer): number => {
        // Simple scoring algorithm
        const timeScore = Math.max(0, 10 - reviewer.average_review_time_days / 3);
        const rateScore = reviewer.acceptance_rate / 10;
        const experienceScore = Math.min(10, reviewer.completed_reviews / 2);
        
        return Math.round((timeScore + rateScore + experienceScore) / 3);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Reviews */}
            {currentReviews.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Current Reviewers</CardTitle>
                        <CardDescription>
                            Reviewers already assigned to this manuscript
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {currentReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-medium">
                                                R{review.review_round}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{review.reviewer_name}</p>
                                            <p className="text-sm text-gray-500">
                                                Round {review.review_round}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline">{review.status_label}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Find Reviewers</CardTitle>
                    <CardDescription>
                        Search and select suitable reviewers for this manuscript
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by name, email, or affiliation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {selectedReviewers.length > 0 && (
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                                {selectedReviewers.length} reviewer{selectedReviewers.length !== 1 ? 's' : ''} selected
                            </AlertDescription>
                        </Alert>
                    )}

                    {errors.reviewer_ids && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.reviewer_ids}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Reviewer List */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Reviewers ({filteredReviewers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {filteredReviewers.map((reviewer) => {
                            const score = getReviewerScore(reviewer);
                            const isSelected = selectedReviewers.includes(reviewer.id);

                            return (
                                <div
                                    key={reviewer.id}
                                    onClick={() => handleToggleReviewer(reviewer.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        isSelected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleToggleReviewer(reviewer.id)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold">{reviewer.name}</h4>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {reviewer.email}
                                                        </div>
                                                        {reviewer.affiliation && (
                                                            <div className="flex items-center gap-1">
                                                                <Building className="h-3 w-3" />
                                                                {reviewer.affiliation}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-primary">
                                                            {score}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Score</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 mt-3">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {reviewer.completed_reviews}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Completed</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="h-4 w-4 text-blue-500" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {reviewer.average_review_time_days}d
                                                        </div>
                                                        <div className="text-xs text-gray-500">Avg Time</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <TrendingUp className="h-4 w-4 text-purple-500" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {reviewer.acceptance_rate}%
                                                        </div>
                                                        <div className="text-xs text-gray-500">Accept Rate</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredReviewers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No reviewers found matching your search</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Review Settings */}
            {selectedReviewers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Review Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="due_date">Review Due Date</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.due_date && (
                                    <p className="text-sm text-red-500">{errors.due_date}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review_round">Review Round</Label>
                                <Input
                                    id="review_round"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={data.review_round}
                                    onChange={(e) => setData('review_round', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="invitation_message">
                                Custom Invitation Message (Optional)
                            </Label>
                            <Textarea
                                id="invitation_message"
                                value={data.invitation_message}
                                onChange={(e) => setData('invitation_message', e.target.value)}
                                placeholder="Add a personalized message to the review invitation email..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Submit */}
            {selectedReviewers.length > 0 && (
                <div className="flex justify-end">
                    <Button type="submit" disabled={processing} size="lg">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign {selectedReviewers.length} Reviewer
                        {selectedReviewers.length !== 1 ? 's' : ''}
                    </Button>
                </div>
            )}
        </form>
    );
}
