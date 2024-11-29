import React from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Manuscript {
    id: number;
    title: string;
    reviewDate: string;
    overallScore: number;
    plagiarismScore: number;
    aiReviewUrl: string; // URL to view the full AI review
}

interface ManuscriptsDashboardProps {
    manuscripts: Manuscript[];
}

const ManuscriptsDashboard: React.FC<ManuscriptsDashboardProps> = ({ manuscripts }) => {
    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        AI Review Report
                    </h2>
                }
            >
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">AI Pre-review Report</h1>

                    {/* Manuscripts Table */}
                    <div className="bg-white p-6 shadow rounded mb-6">
                        <h2 className="text-xl font-semibold mb-4">My Manuscripts</h2>
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-2 text-left">Title</th>
                                    <th className="px-4 py-2 text-left">Review Date</th>
                                    <th className="px-4 py-2 text-left">Overall Score</th>
                                    <th className="px-4 py-2 text-left">Plagiarism Score</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {manuscripts.map((manuscript) => (
                                    <tr key={manuscript.id} className="border-b">
                                        <td className="px-4 py-2">{manuscript.title}</td>
                                        <td className="px-4 py-2">{new Date(manuscript.reviewDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{manuscript.overallScore}/100</td>
                                        <td className="px-4 py-2">{manuscript.plagiarismScore}%</td>
                                        <td className="px-4 py-2">
                                            <Link
                                                href={manuscript.aiReviewUrl}
                                                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                            >
                                                View Actions
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
};

export default ManuscriptsDashboard;
