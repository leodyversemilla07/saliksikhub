import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BarChart3, Bell, CheckCircle, Clock, FileText, Filter, Users, XCircle } from 'lucide-react';

export default function Dashboard() {
    // Sample data - in a real application, this would come from an API
    const metrics = {
        newSubmissions: 12,
        inReview: 28,
        awaitingRevision: 8,
        publishedThisMonth: 15,
        rejectedThisMonth: 6,
        averageReviewTime: "18 days"
    };

    const recentSubmissions = [
        { id: "MS-2024-123", title: "Advanced Machine Learning Applications", status: "Under Review", submitted: "2024-11-08" },
        { id: "MS-2024-122", title: "Quantum Computing Developments", status: "Revision Required", submitted: "2024-11-07" },
        { id: "MS-2024-121", title: "Climate Change Impact Analysis", status: "New Submission", submitted: "2024-11-06" }
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
                        <Card className="bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
                            <CardContent className="flex items-center p-4">
                                <Bell className="w-8 h-8 text-blue-600 mr-4" />
                                <div>
                                    <h3 className="font-semibold">New Submissions</h3>
                                    <p className="text-2xl font-bold text-blue-600">{metrics.newSubmissions}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-yellow-50 hover:bg-yellow-100 cursor-pointer transition-colors">
                            <CardContent className="flex items-center p-4">
                                <Clock className="w-8 h-8 text-yellow-600 mr-4" />
                                <div>
                                    <h3 className="font-semibold">In Review</h3>
                                    <p className="text-2xl font-bold text-yellow-600">{metrics.inReview}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 hover:bg-green-100 cursor-pointer transition-colors">
                            <CardContent className="flex items-center p-4">
                                <FileText className="w-8 h-8 text-green-600 mr-4" />
                                <div>
                                    <h3 className="font-semibold">Awaiting Revision</h3>
                                    <p className="text-2xl font-bold text-green-600">{metrics.awaitingRevision}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    <span className="text-sm text-gray-500">This Month</span>
                                </div>
                                <h3 className="text-xl font-bold">{metrics.publishedThisMonth}</h3>
                                <p className="text-gray-600">Published Articles</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <XCircle className="w-6 h-6 text-red-500" />
                                    <span className="text-sm text-gray-500">This Month</span>
                                </div>
                                <h3 className="text-xl font-bold">{metrics.rejectedThisMonth}</h3>
                                <p className="text-gray-600">Rejected Articles</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <BarChart3 className="w-6 h-6 text-purple-500" />
                                    <span className="text-sm text-gray-500">Average</span>
                                </div>
                                <h3 className="text-xl font-bold">{metrics.averageReviewTime}</h3>
                                <p className="text-gray-600">Review Time</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Users className="w-6 h-6 text-blue-500" />
                                    <span className="text-sm text-gray-500">Active</span>
                                </div>
                                <h3 className="text-xl font-bold">42</h3>
                                <p className="text-gray-600">Active Reviewers</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Submissions Table */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Submissions</CardTitle>
                                <button className="flex items-center px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-50">
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
                                                    <span className={`px-2 py-1 rounded-full text-sm ${submission.status === 'New Submission' ? 'bg-blue-100 text-blue-800' :
                                                        submission.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-orange-100 text-orange-800'
                                                        }`}>
                                                        {submission.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">{submission.submitted}</td>
                                                <td className="py-3 px-4">
                                                    <button className="text-blue-600 hover:text-blue-800">View Details</button>
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
}
