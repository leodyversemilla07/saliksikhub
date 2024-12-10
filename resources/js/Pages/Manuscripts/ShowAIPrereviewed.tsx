import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { File, Tags, User, Clock, AlertCircle, Bot } from 'lucide-react';

interface ManuscriptData {
    id: number;
    user_id: number;
    title: string;
    authors: string;
    status: string;
    manuscript_path?: string;
    ai_review?: {
        id: number;
        manuscript_id: number;
        summary: string;
        keywords: string[];
        language_quality: {
            word_count: number;
            unique_words: number;
            sentence_count: number;
            named_entities: number;
            grammar_issues: number;
            readability_score: number;
        };
        created_at: string;
        updated_at: string;
    };
}

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const ManuscriptDetailsView: React.FC<{ manuscript: ManuscriptData }> = ({ manuscript }) => {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="w-full shadow-lg border rounded-lg">
                <CardHeader className="bg-blue-50 border-b p-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold flex items-center text-blue-800">
                            <File className="mr-2" />
                            {manuscript.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-base text-center text-white border-white bg-blue-600 hover:text-blue-500 hover:border-blue-500 hover:bg-white">
                            AI-Assisted Pre-reviewed
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    {/* Manuscript Metadata */}
                    <section className="mb-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-800 flex items-center mb-1">
                                    <User className="mr-2 text-gray-600" size={16} />
                                    Authors
                                </h3>
                                <p className="text-gray-700">{manuscript.authors}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 flex items-center mb-1">
                                    <Clock className="mr-2 text-gray-600" size={16} />
                                    Pre-reviewed Date
                                </h3>
                                <p className="text-gray-700">{formatDate(manuscript.ai_review?.created_at ?? '')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Abstract */}
                    <section className="mb-8">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <Tags className="mr-2 text-gray-600" size={16} />
                            Generated Summary
                        </h3>
                        <p className="text-gray-800 italic">{manuscript.ai_review?.summary}</p>
                    </section>

                    {/* Keywords and Status */}
                    <section className="mb-8">
                        <div className="flex items-center space-x-6">
                            <div>
                                <h3 className="font-semibold text-gray-800">Extracted Keywords</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {manuscript.ai_review?.keywords.map((keyword, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {keyword.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="ml-auto">
                                <Badge
                                    variant={manuscript.status === 'Submitted' ? 'default' : 'outline'}
                                    className={`text-sm ${manuscript.status === 'Submitted' ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-800'
                                        }`}
                                >
                                    {manuscript.status}
                                </Badge>
                            </div>
                        </div>
                    </section>

                    {/* AI Review Insights */}
                    {manuscript.ai_review && (
                        <section className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <Bot className="mr-2 text-blue-600" size={18} />
                                AI Review Insights
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600">Word Count: {manuscript.ai_review.language_quality.word_count}</p>
                                    <p className="text-sm text-gray-600">Unique Words: {manuscript.ai_review.language_quality.unique_words}</p>
                                    <p className="text-sm text-gray-600">Sentence Count: {manuscript.ai_review.language_quality.sentence_count}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Grammar Issues: {manuscript.ai_review.language_quality.grammar_issues}</p>
                                    <p className="text-sm text-gray-600">
                                        Readability Score: {manuscript.ai_review.language_quality.readability_score.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}
                </CardContent>

                <CardFooter className="bg-blue-50 border-t flex justify-between items-center p-4">
                    <span className="text-xs text-gray-500">Manuscript ID: {manuscript.id}</span>
                    {manuscript.manuscript_path && (
                        <a
                            href={`/view-manuscript/${manuscript.manuscript_path}`}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View Full Manuscript
                        </a>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

const ManuscriptDetailsPage: React.FC = () => {
    const manuscriptData: ManuscriptData = {
        // Sample manuscript data (replace with actual data source)
        "id": 7,
        "user_id": 1,
        "title": "The Impact of Urban Green Spaces on Air Quality: A Case Study in Metropolitan Areas",
        "authors": "John Doe, Jane Smith, Emily Johnson, LeoBriel Zilvrak",
        "status": "Submitted",
        "manuscript_path": "manuscripts/ULbIbegTICwJupEIemyyctSRsRiESASnnGMLj5gQ.pdf",
        "ai_review": {
            "id": 1,
            "manuscript_id": 7,
            "summary": "This study investigates the relationship between the presence of parks and gardens and the levels of air pollutants in urban environments. Data were collected from three major cities over a period of six months. The results indicate that areas with higher green space coverage exhibit significantly lower levels of particulate matter and nitrogen dioxide.",
            "keywords": ["urban", "green", "air", "quality", "city", "areas", "spaces", "environmental", "data", "research"],
            "language_quality": {
                "word_count": 468,
                "unique_words": 263,
                "sentence_count": 33,
                "named_entities": 46,
                "grammar_issues": 3,
                "readability_score": 114.16737762237761
            },
            "created_at": "2024-12-09T16:34:17.000000Z",
            "updated_at": "2024-12-09T16:34:17.000000Z"
        }
    };
    return <ManuscriptDetailsView manuscript={manuscriptData} />;
};

export default ManuscriptDetailsPage;
