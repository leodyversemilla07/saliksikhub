import React from 'react';

interface AiReviewSection {
    title: string;
    description: string;
    suggestions: string[];
}

interface AiReviewReportProps {
    manuscriptTitle: string;
    reviewDate: string;
    overallScore: number;
    plagiarismScore: number;
    sections: AiReviewSection[];
    downloadUrl: string;
}

const AiReviewReport: React.FC<AiReviewReportProps> = ({
    manuscriptTitle,
    reviewDate,
    overallScore,
    plagiarismScore,
    sections,
    downloadUrl,
}) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">AI Review Report</h1>

            {/* Manuscript Overview */}
            <div className="bg-white p-6 shadow rounded mb-6">
                <h2 className="text-xl font-semibold mb-4">Manuscript: {manuscriptTitle}</h2>
                <p><strong>Review Date:</strong> {new Date(reviewDate).toLocaleDateString()}</p>
                <p><strong>Overall Score:</strong> {overallScore}/100</p>
                <p><strong>Plagiarism Score:</strong> {plagiarismScore}%</p>
            </div>

            {/* AI Review Table */}
            <div className="bg-white p-6 shadow rounded mb-6">
                <h2 className="text-xl font-semibold mb-4">Detailed Review</h2>
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-left">Section</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Suggestions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map((section, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{section.title}</td>
                                <td className="px-4 py-2">{section.description}</td>
                                <td className="px-4 py-2">
                                    <ul className="list-disc pl-4">
                                        {section.suggestions.map((suggestion, i) => (
                                            <li key={i}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Download Report */}
            <div className="flex justify-end">
                <a
                    href={downloadUrl}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                >
                    Download Report
                </a>
            </div>
        </div>
    );
};

export default AiReviewReport;
