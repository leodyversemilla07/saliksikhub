import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Define the structure of AI review data
interface LanguageQuality {
    word_count: number;
    unique_words: number;
    sentence_count: number;
    named_entities: number;
    grammar_issues: number;
    readability_score: number;
}

interface AiReview {
    summary: string;
    keywords: string[];
    language_quality: LanguageQuality;
}

interface Manuscript {
    id: number;
    title: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    status: 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected';
    authors: string | string[] | null;
    aiReview: AiReview; // AI review should be part of the manuscript
}

interface ManuscriptsDashboardProps {
    manuscripts: Manuscript[]; // Array of manuscripts to be displayed
}

const ManuscriptsDashboard: React.FC<ManuscriptsDashboardProps> = ({ manuscripts }) => {
    console.log(manuscripts); // Debugging: Check the data being passed

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    AI Review Report
                </h2>
            }
        >
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Pre-review Report</h1>

                {/* Manuscripts Table */}
                <div className="bg-white p-6 shadow rounded mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">My Manuscripts</h2>
                    <table className="min-w-full table-auto border-collapse text-left">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="px-4 py-2 font-semibold text-gray-700">Title</th>
                                <th className="px-4 py-2 font-semibold text-gray-700">Review Date</th>
                                <th className="px-4 py-2 font-semibold text-gray-700">AI Review Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {manuscripts.map((manuscript) => {
                                const aiReview = manuscript.aiReview;

                                if (!aiReview) {
                                    return (
                                        <tr key={manuscript.id} className="border-b hover:bg-gray-50 transition duration-200">
                                            <td className="px-4 py-2">{manuscript.title}</td>
                                            <td className="px-4 py-2">{new Date(manuscript.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 text-red-600">No AI Review Available</td>
                                        </tr>
                                    );
                                }

                                // Parse the stringified JSON fields
                                const keywords = aiReview.keywords;
                                const languageQuality = aiReview.language_quality;

                                return (
                                    <tr key={manuscript.id} className="border-b hover:bg-gray-50 transition duration-200">
                                        <td className="px-4 py-2">{manuscript.title}</td>
                                        <td className="px-4 py-2">{new Date(manuscript.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 text-green-600">
                                            AI Review Available
                                            <div>
                                                <strong>Summary:</strong> {aiReview.summary}
                                            </div>
                                            <div>
                                                <strong>Keywords:</strong> {keywords.join(', ')}
                                            </div>
                                            <div>
                                                <strong>Language Quality:</strong> 
                                                <ul>
                                                    <li>Word Count: {languageQuality.word_count}</li>
                                                    <li>Unique Words: {languageQuality.unique_words}</li>
                                                    <li>Sentence Count: {languageQuality.sentence_count}</li>
                                                    <li>Named Entities: {languageQuality.named_entities}</li>
                                                    <li>Grammar Issues: {languageQuality.grammar_issues}</li>
                                                    <li>Readability Score: {languageQuality.readability_score}</li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ManuscriptsDashboard;
