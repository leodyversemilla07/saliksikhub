import React from 'react';
import {
    Settings,
    FileText,
    Users,
    LayoutDashboard,
    BookOpen,
    ClipboardCheck,
    UserCheck,
    BookMarked,
    Search,
    Bell,
    Bot,
    Brain,
    GitPullRequest
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    const [activePage, setActivePage] = React.useState('Dashboard');

    // Sample data for charts with AI review metrics
    const submissionData = [
        { month: 'Jan', submitted: 65, aiReviewed: 62, peerReviewed: 40, rejected: 25 },
        { month: 'Feb', submitted: 75, aiReviewed: 73, peerReviewed: 45, rejected: 30 },
        { month: 'Mar', submitted: 85, aiReviewed: 82, peerReviewed: 50, rejected: 35 },
        { month: 'Apr', submitted: 70, aiReviewed: 68, peerReviewed: 42, rejected: 28 },
        { month: 'May', submitted: 90, aiReviewed: 87, peerReviewed: 55, rejected: 35 },
        { month: 'Jun', submitted: 95, aiReviewed: 92, peerReviewed: 58, rejected: 37 },
    ];

    const metrics = [
        {
            title: 'AI Pre-review Score',
            value: '8.4/10',
            trend: 'up',
            description: 'Average manuscript quality score'
        },
        {
            title: 'Review Efficiency',
            value: '92%',
            trend: 'up',
            description: 'AI-assisted review completion rate'
        },
        {
            title: 'Avg. Review Time',
            value: '12 days',
            trend: 'down',
            description: 'Enhanced by AI pre-screening'
        },
    ];

    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                }
            >
                <Head title="Admin Dashboard" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {/* Main Content */}
                        <div className="flex-1 overflow-auto">

                            <main className="p-6">
                                {/* Metrics Grid */}
                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    {metrics.map((metric) => (
                                        <Card key={metric.title} className="hover:shadow-lg transition-shadow">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm text-gray-500">{metric.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{metric.value}</div>
                                                <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Submission Status */}
                                <Card className="mb-6">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Research Submission Analytics</CardTitle>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1">
                                                    Filter
                                                </button>
                                                <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1">
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={submissionData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="submitted" stroke="#8B5CF6" name="Submitted" />
                                                <Line type="monotone" dataKey="aiReviewed" stroke="#10B981" name="AI Reviewed" />
                                                <Line type="monotone" dataKey="peerReviewed" stroke="#3B82F6" name="Peer Reviewed" />
                                                <Line type="monotone" dataKey="rejected" stroke="#EF4444" name="Rejected" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                {/* Recent Activity */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Recent Activity</CardTitle>
                                            <button className="text-sm text-purple-600 hover:text-purple-700">View All</button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                {
                                                    title: "AI Pre-review Completed",
                                                    author: "Machine Learning Model",
                                                    manuscript: "Analysis of Philippine Research Trends",
                                                    time: "5 mins ago",
                                                    status: "ai-review"
                                                },
                                                {
                                                    title: "New Manuscript Submission",
                                                    author: "Dr. Juan dela Cruz",
                                                    manuscript: "Indigenous Knowledge Systems",
                                                    time: "2 hours ago",
                                                    status: "pending"
                                                },
                                                {
                                                    title: "Peer Review Assigned",
                                                    author: "Prof. Maria Santos",
                                                    manuscript: "Local Community Research",
                                                    time: "4 hours ago",
                                                    status: "in-review"
                                                },
                                            ].map((activity, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${activity.status === 'ai-review' ? 'bg-green-400' :
                                                            activity.status === 'pending' ? 'bg-yellow-400' :
                                                                activity.status === 'in-review' ? 'bg-blue-400' :
                                                                    'bg-purple-400'
                                                            }`} />
                                                        <div>
                                                            <h3 className="font-medium">{activity.title}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {activity.author} • {activity.manuscript} • {activity.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button className="text-sm text-gray-600 hover:text-purple-600">View Details</button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </main>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}