import React, { useState, useEffect } from 'react';
import {
    Book,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Pen
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Constants for Submission States
const SUBMISSION_STATES = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    REVISION_REQUESTED: 'REVISION_REQUESTED',
    ACCEPTED: 'ACCEPTED',
    PUBLISHED: 'PUBLISHED'
} as const;

// Define Submission Interface
interface Submission {
    id: string;
    title: string;
    journal: string;
    state: keyof typeof SUBMISSION_STATES;
    submissionDate: Date | null;
    lastUpdated: Date;
}

// Define Active and Completed Submission State Types
type ActiveSubmissionStates = 'DRAFT' | 'UNDER_REVIEW' | 'REVISION_REQUESTED';
type CompletedSubmissionStates = 'ACCEPTED' | 'PUBLISHED';

// Color Mapping for Submission States
const STATE_COLORS: Record<Submission['state'], string> = {
    [SUBMISSION_STATES.DRAFT]: '#6B7280', // Gray
    [SUBMISSION_STATES.SUBMITTED]: '#3B82F6', // Blue
    [SUBMISSION_STATES.UNDER_REVIEW]: '#F59E0B', // Yellow
    [SUBMISSION_STATES.REVISION_REQUESTED]: '#F97316', // Orange
    [SUBMISSION_STATES.ACCEPTED]: '#10B981', // Green
    [SUBMISSION_STATES.PUBLISHED]: '#8B5CF6' // Purple
};

const AuthorDashboard: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [activeSubmissions, setActiveSubmissions] = useState<Submission[]>([]);
    const [completedSubmissions, setCompletedSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const mockSubmissions: Submission[] = [
                {
                    id: 'MS2024-001',
                    title: 'Quantum Entanglement in Neural Networks',
                    journal: 'Computational Neuroscience Quarterly',
                    state: 'UNDER_REVIEW',
                    submissionDate: new Date('2024-02-15'),
                    lastUpdated: new Date('2024-03-20')
                },
                {
                    id: 'MS2024-002',
                    title: 'Epistemic Foundations of Machine Learning',
                    journal: 'Philosophical Perspectives in Technology',
                    state: 'DRAFT',
                    submissionDate: null,
                    lastUpdated: new Date('2024-04-10')
                },
                {
                    id: 'MS2024-003',
                    title: 'Cognitive Architectures in AI',
                    journal: 'Advanced Computational Cognition',
                    state: 'ACCEPTED',
                    submissionDate: new Date('2024-01-10'),
                    lastUpdated: new Date('2024-05-01')
                },
                {
                    id: 'MS2024-004',
                    title: 'Ethical Implications of Generative Models',
                    journal: 'Technology and Ethics Quarterly',
                    state: 'PUBLISHED',
                    submissionDate: new Date('2023-12-05'),
                    lastUpdated: new Date('2024-02-15')
                }
            ];

            setSubmissions(mockSubmissions);

            setActiveSubmissions(
                mockSubmissions.filter(submission =>
                    ['DRAFT', 'UNDER_REVIEW', 'REVISION_REQUESTED'].includes(submission.state)
                ) as Submission[]
            );

            setCompletedSubmissions(
                mockSubmissions.filter(submission =>
                    ['ACCEPTED', 'PUBLISHED'].includes(submission.state)
                ) as Submission[]
            );
        };

        fetchSubmissions();
    }, []);

    // Compute Submission State Distribution
    const getSubmissionStateDistribution = () => {
        const stateCount = submissions.reduce((acc, submission) => {
            acc[submission.state] = (acc[submission.state] || 0) + 1;
            return acc;
        }, {} as Record<Submission['state'], number>);

        return Object.entries(stateCount).map(([state, count]) => ({
            name: state.replace('_', ' '),
            value: count,
            color: STATE_COLORS[state as Submission['state']]
        }));
    };

    // Compute Submissions by Month
    const getSubmissionsByMonth = () => {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const monthlySubmissions = submissions.reduce((acc, submission) => {
            if (submission.submissionDate) {
                const month = monthNames[submission.submissionDate.getMonth()];
                acc[month] = (acc[month] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(monthlySubmissions).map(([month, count]) => ({
            month,
            submissions: count
        }));
    };

    // State Icon Mapping
    const getStateIcon = (state: Submission['state']) => {
        const stateIcons: Record<Submission['state'], JSX.Element> = {
            [SUBMISSION_STATES.DRAFT]: <Pen className="text-gray-500" />,
            [SUBMISSION_STATES.SUBMITTED]: <FileText className="text-blue-500" />,
            [SUBMISSION_STATES.UNDER_REVIEW]: <Clock className="text-yellow-500" />,
            [SUBMISSION_STATES.REVISION_REQUESTED]: <AlertCircle className="text-orange-500" />,
            [SUBMISSION_STATES.ACCEPTED]: <CheckCircle className="text-green-500" />,
            [SUBMISSION_STATES.PUBLISHED]: <Book className="text-purple-500" />
        };
        return stateIcons[state] || null;
    };

    // Submission Card Component
    const SubmissionCard: React.FC<{ submission: Submission }> = ({ submission }) => (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center space-x-4">
                {getStateIcon(submission.state)}
                <div>
                    <h3 className="font-semibold text-lg">{submission.title}</h3>
                    <p className="text-gray-600">{submission.journal}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-500">
                    Submission ID: {submission.id}
                </p>
                <p className="text-sm text-gray-500">
                    Status: {submission.state.replace('_', ' ')}
                </p>
            </div>
        </div>
    );

    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                }
            >
                <Head title="Author Dashboard" />
                <div className="min-h-screen bg-gray-50 p-8">
                    <div className="container mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Research Submission Dashboard</h1>
                            <p className="text-gray-600">Navigating the Intellectual Landscape of Academic Publishing</p>
                        </header>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white shadow-md rounded-lg p-4">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">Submission State Distribution</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={getSubmissionStateDistribution()}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {getSubmissionStateDistribution().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" verticalAlign="bottom" align="center" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white shadow-md rounded-lg p-4 col-span-2">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">Submissions by Month</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={getSubmissionsByMonth()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="submissions" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Active Submissions</h2>
                                {activeSubmissions.length > 0 ? (
                                    activeSubmissions.map(submission => (
                                        <SubmissionCard
                                            key={submission.id}
                                            submission={submission}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500">No active submissions found.</p>
                                )}
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Completed Submissions</h2>
                                {completedSubmissions.length > 0 ? (
                                    completedSubmissions.map(submission => (
                                        <SubmissionCard
                                            key={submission.id}
                                            submission={submission}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500">No completed submissions found.</p>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
};

export default AuthorDashboard;
