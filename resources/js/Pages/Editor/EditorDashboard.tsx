import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BarChart3, Bell, CheckCircle, Clock, FileText, Filter, Users, XCircle } from 'lucide-react';

type Metrics = {
    newSubmissions: number;
    inReview: number;
    awaitingRevision: number;
    publishedThisMonth: number;
    rejectedThisMonth: number;
    averageReviewTime: string;
    activeReviewers: number;
};

type Submission = {
    id: string;
    title: string;
    status: string;
    submitted: string;
};

type StatusLabelProps = {
    status: string;
};

const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
    const statusClasses: Record<string, string> = {
        "New Submission": "bg-blue-100 text-blue-800",
        "Under Review": "bg-yellow-100 text-yellow-800",
        "Revision Required": "bg-orange-100 text-orange-800",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-sm ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

type MetricsCardProps = {
    icon: React.ElementType;
    colorClass: string;
    title: string;
    value: string | number;
};

const MetricsCard: React.FC<MetricsCardProps> = ({ icon: Icon, colorClass, title, value }) => (
    <Card className={`${colorClass} hover:brightness-105 cursor-pointer transition-all`}>
        <CardContent className="flex items-center p-4">
            <Icon className="w-8 h-8 mr-4" />
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </CardContent>
    </Card>
);

const EditorDashboard: React.FC = ( ) => {
    const metrics: Metrics = {
        newSubmissions: 12,
        inReview: 28,
        awaitingRevision: 8,
        publishedThisMonth: 15,
        rejectedThisMonth: 6,
        averageReviewTime: "18 days",
        activeReviewers: 42,
    };

    const recentSubmissions: Submission[] = [
        { id: "MS-2024-123", title: "Advanced Machine Learning Applications", status: "Under Review", submitted: "2024-11-08" },
        { id: "MS-2024-122", title: "Quantum Computing Developments", status: "Revision Required", submitted: "2024-11-07" },
        { id: "MS-2024-121", title: "Climate Change Impact Analysis", status: "New Submission", submitted: "2024-11-06" },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Editor Dashboard</h1>
                        <p className="text-gray-600 mt-2">Research Journal Management System</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <MetricsCard
                            icon={Bell}
                            colorClass="bg-blue-50 text-blue-600"
                            title="New Submissions"
                            value={metrics.newSubmissions}
                        />
                        <MetricsCard
                            icon={Clock}
                            colorClass="bg-yellow-50 text-yellow-600"
                            title="In Review"
                            value={metrics.inReview}
                        />
                        <MetricsCard
                            icon={FileText}
                            colorClass="bg-green-50 text-green-600"
                            title="Awaiting Revision"
                            value={metrics.awaitingRevision}
                        />
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <MetricsCard
                            icon={CheckCircle}
                            colorClass="text-green-500"
                            title="Published Articles"
                            value={metrics.publishedThisMonth}
                        />
                        <MetricsCard
                            icon={XCircle}
                            colorClass="text-red-500"
                            title="Rejected Articles"
                            value={metrics.rejectedThisMonth}
                        />
                        <MetricsCard
                            icon={BarChart3}
                            colorClass="text-purple-500"
                            title="Average Review Time"
                            value={metrics.averageReviewTime}
                        />
                        <MetricsCard
                            icon={Users}
                            colorClass="text-blue-500"
                            title="Active Reviewers"
                            value={metrics.activeReviewers}
                        />
                    </div>

                    {/* Recent Submissions Table */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Submissions</CardTitle>
                                <button
                                    className="flex items-center px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-50"
                                    aria-label="Filter submissions"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b">
                                            <th className="pb-3 px-4">Manuscript ID</th>
                                            <th className="pb-3 px-4">Title</th>
                                            <th className="pb-3 px-4">Status</th>
                                            <th className="pb-3 px-4">Submitted</th>
                                            <th className="pb-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentSubmissions.map((submission) => (
                                            <tr key={submission.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{submission.id}</td>
                                                <td className="py-3 px-4">{submission.title}</td>
                                                <td className="py-3 px-4">
                                                    <StatusLabel status={submission.status} />
                                                </td>
                                                <td className="py-3 px-4">{submission.submitted}</td>
                                                <td className="py-3 px-4">
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditorDashboard;
