import { Settings, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    const metrics = [
        { title: 'Total Submissions', value: '256', trend: 'up', description: 'Last 30 days' },
        { title: 'Pending Review', value: '45', trend: 'down', description: 'Current queue' },
        { title: 'Approved', value: '189', trend: 'up', description: 'Last 30 days' }
    ];

    const submissionData = [
        { month: 'Jan', submitted: 65, aiReviewed: 45, peerReviewed: 35, rejected: 12 },
        { month: 'Feb', submitted: 75, aiReviewed: 55, peerReviewed: 45, rejected: 15 }
    ];

    const activities = [
        { status: 'ai-review', title: 'New Submission', author: 'John Doe', manuscript: 'MS-001', time: '2h ago' }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <main className="space-y-6">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {metrics.map((metric) => (
                                <Card key={metric.title} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                                            <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                                {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Submission Status */}
                        <Card className="shadow-lg">
                            <CardHeader className="border-b bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-semibold">Research Submission Analytics</CardTitle>
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            Filter
                                        </button>
                                        <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={submissionData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }} />
                                        <Legend verticalAlign="top" height={36} />
                                        <Line type="monotone" dataKey="submitted" stroke="#8B5CF6" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                                        <Line type="monotone" dataKey="aiReviewed" stroke="#10B981" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                                        <Line type="monotone" dataKey="peerReviewed" stroke="#3B82F6" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                                        <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="shadow-lg">
                            <CardHeader className="border-b bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All</button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {activities.map((activity) => (
                                        <div key={activity.manuscript} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${activity.status === 'ai-review' ? 'bg-green-400' :
                                                        activity.status === 'pending' ? 'bg-yellow-400' :
                                                            activity.status === 'in-review' ? 'bg-blue-400' : 'bg-purple-400'
                                                    }`} />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {activity.author} • {activity.manuscript}
                                                    </p>
                                                    <span className="text-xs text-gray-400">{activity.time}</span>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors duration-200">
                                                View Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
