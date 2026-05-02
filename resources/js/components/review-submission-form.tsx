import { useForm } from '@inertiajs/react';
import { AlertCircle, Info, Send, Save } from 'lucide-react';
import { useState } from 'react';
import { Rating } from '@/components/rating';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import reviewer from '@/routes/reviewer';
import type {
    ReviewFormData,
    ReviewRecommendation,
    RecommendationOption,
} from '@/types';

interface ReviewSubmissionFormProps {
    reviewId: number;
    manuscriptTitle: string;
    onSuccess?: () => void;
    onSaveDraft?: () => void;
    initialData?: Partial<ReviewFormData>;
}

const recommendationOptions: RecommendationOption[] = [
    {
        value: 'accept',
        label: 'Accept',
        description: 'Manuscript is suitable for publication as is',
        color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
        value: 'minor_revision',
        label: 'Minor Revision',
        description: 'Accept pending minor revisions',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
        value: 'major_revision',
        label: 'Major Revision',
        description: 'Significant revisions required before acceptance',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    },
    {
        value: 'reject',
        label: 'Reject',
        description: 'Manuscript is not suitable for publication',
        color: 'text-red-600 bg-red-50 border-red-200',
    },
];

export function ReviewSubmissionForm({
    reviewId,
    onSuccess,
    onSaveDraft,
    initialData,
}: ReviewSubmissionFormProps) {
    const [characterCount, setCharacterCount] = useState(
        initialData?.author_comments?.length || 0,
    );

    const { data, setData, post, processing, errors, isDirty } =
        useForm<ReviewFormData>({
            recommendation: initialData?.recommendation || '',
            author_comments: initialData?.author_comments || '',
            confidential_comments: initialData?.confidential_comments || '',
            quality_rating: initialData?.quality_rating || 5,
            originality_rating: initialData?.originality_rating || 5,
            methodology_rating: initialData?.methodology_rating || 5,
            significance_rating: initialData?.significance_rating || 5,
            annotated_file: null,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(reviewer.reviews.submit.url({ id: reviewId }), {
            onSuccess: () => {
                onSuccess?.();
            },
        });
    };

    const handleSaveDraft = () => {
        post(reviewer.reviews.saveDraft.url({ id: reviewId }), {
            onSuccess: () => {
                onSaveDraft?.();
            },
        });
    };

    const isFormValid = () => {
        return (
            data.recommendation !== '' &&
            data.author_comments.length >= 100 &&
            data.quality_rating > 0 &&
            data.originality_rating > 0 &&
            data.methodology_rating > 0 &&
            data.significance_rating > 0
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recommendation */}
            <Card>
                <CardHeader>
                    <CardTitle>Recommendation</CardTitle>
                    <CardDescription>
                        Select your overall recommendation for this manuscript
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={data.recommendation}
                        onValueChange={(value) =>
                            setData(
                                'recommendation',
                                value as ReviewRecommendation,
                            )
                        }
                    >
                        <div className="space-y-3">
                            {recommendationOptions.map((option) => (
                                <div key={option.value}>
                                    <div className="flex items-start space-x-3">
                                        <RadioGroupItem
                                            value={option.value}
                                            id={option.value}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <Label
                                                htmlFor={option.value}
                                                className="cursor-pointer"
                                            >
                                                <div
                                                    className={`rounded-lg border-2 p-3 transition-colors ${
                                                        data.recommendation ===
                                                        option.value
                                                            ? option.color
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="font-semibold">
                                                        {option.label}
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-600">
                                                        {option.description}
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                    {errors.recommendation && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {errors.recommendation}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Ratings */}
            <Card>
                <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                    <CardDescription>
                        Rate the manuscript on a scale of 1-10
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="quality">Quality of Work</Label>
                        <Rating
                            value={data.quality_rating}
                            onChange={(value) =>
                                setData('quality_rating', value ?? '')
                            }
                            max={10}
                            size="lg"
                        />
                        {errors.quality_rating && (
                            <p className="text-sm text-red-500">
                                {errors.quality_rating}
                            </p>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="originality">
                            Originality & Novelty
                        </Label>
                        <Rating
                            value={data.originality_rating}
                            onChange={(value) =>
                                setData('originality_rating', value ?? '')
                            }
                            max={10}
                            size="lg"
                        />
                        {errors.originality_rating && (
                            <p className="text-sm text-red-500">
                                {errors.originality_rating}
                            </p>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="methodology">Methodology & Rigor</Label>
                        <Rating
                            value={data.methodology_rating}
                            onChange={(value) =>
                                setData('methodology_rating', value ?? '')
                            }
                            max={10}
                            size="lg"
                        />
                        {errors.methodology_rating && (
                            <p className="text-sm text-red-500">
                                {errors.methodology_rating}
                            </p>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="significance">
                            Significance & Impact
                        </Label>
                        <Rating
                            value={data.significance_rating}
                            onChange={(value) =>
                                setData('significance_rating', value ?? '')
                            }
                            max={10}
                            size="lg"
                        />
                        {errors.significance_rating && (
                            <p className="text-sm text-red-500">
                                {errors.significance_rating}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Comments to Author */}
            <Card>
                <CardHeader>
                    <CardTitle>Comments to Author</CardTitle>
                    <CardDescription>
                        Provide detailed feedback that will be shared with the
                        author
                        <span className="ml-1 text-red-500">*</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Textarea
                            id="author_comments"
                            value={data.author_comments}
                            onChange={(e) => {
                                setData('author_comments', e.target.value);
                                setCharacterCount(e.target.value.length);
                            }}
                            placeholder="Provide constructive feedback on strengths, weaknesses, and areas for improvement..."
                            className="min-h-[200px]"
                        />
                        <div className="flex justify-between text-sm">
                            <span
                                className={
                                    characterCount < 100
                                        ? 'text-red-500'
                                        : 'text-gray-500'
                                }
                            >
                                Minimum 100 characters required
                            </span>
                            <span className="text-gray-500">
                                {characterCount} characters
                            </span>
                        </div>
                        {errors.author_comments && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {errors.author_comments}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            These comments will be shared with the author. Be
                            constructive and professional.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Confidential Comments */}
            <Card>
                <CardHeader>
                    <CardTitle>Confidential Comments to Editor</CardTitle>
                    <CardDescription>
                        Optional comments that will only be seen by the editor
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        id="confidential_comments"
                        value={data.confidential_comments}
                        onChange={(e) =>
                            setData('confidential_comments', e.target.value)
                        }
                        placeholder="Any additional comments or concerns for the editor only..."
                        className="min-h-[100px]"
                    />
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={processing || !isDirty}
                >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                </Button>
                <Button type="submit" disabled={processing || !isFormValid()}>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Review
                </Button>
            </div>

            {/* Validation Summary */}
            {!isFormValid() && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        <p className="mb-2 font-semibold">
                            Please complete the following:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                            {!data.recommendation && (
                                <li>Select a recommendation</li>
                            )}
                            {data.author_comments.length < 100 && (
                                <li>
                                    Write at least 100 characters in comments to
                                    author
                                </li>
                            )}
                            {data.quality_rating === 0 && (
                                <li>Rate quality of work</li>
                            )}
                            {data.originality_rating === 0 && (
                                <li>Rate originality & novelty</li>
                            )}
                            {data.methodology_rating === 0 && (
                                <li>Rate methodology & rigor</li>
                            )}
                            {data.significance_rating === 0 && (
                                <li>Rate significance & impact</li>
                            )}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
        </form>
    );
}
