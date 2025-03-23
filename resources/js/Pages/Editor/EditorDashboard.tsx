import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem
} from '@/Components/ui/dropdown-menu';
import {
    BarChart3, Bell, CheckCircle, Clock, FileText, Filter, Users, XCircle, TrendingUp, TrendingDown,
    Calendar, ChevronDown, Download, ArrowRight, AlertTriangle, BookOpen, UserCheck, FileSearch, ChevronRight
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import { cn } from "@/lib/utils";

export default function EditorDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    // Sample data for metrics
    const metrics = [
        {
            title: 'New Submissions',
            value: '24',
            trend: 'up',
            percentage: '16%',
            description: 'Last 30 days',
            icon: FileText,
            color: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'Published Articles',
            value: '15',
            trend: 'up',
            percentage: '12%',
            description: 'Last 30 days',
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-600'
        },
        {
            title: 'Active Reviewers',
            value: '42',
            trend: 'down',
            percentage: '4%',
            description: 'Available reviewers',
            icon: UserCheck,
            color: 'from-purple-500 to-violet-600'
        }
    ];

    // Sample data for charts
    const monthlySubmissionsData = [
        { month: 'Jan', submissions: 34, published: 12, rejected: 5 },
        { month: 'Feb', submissions: 42, published: 14, rejected: 8 },
        { month: 'Mar', submissions: 50, published: 18, rejected: 7 },
        { month: 'Apr', submissions: 38, published: 12, rejected: 10 },
        { month: 'May', submissions: 45, published: 15, rejected: 9 },
        { month: 'Jun', submissions: 55, published: 20, rejected: 8 },
        { month: 'Jul', submissions: 48, published: 16, rejected: 7 },
        { month: 'Aug', submissions: 41, published: 13, rejected: 6 },
        { month: 'Sep', submissions: 52, published: 19, rejected: 8 },
        { month: 'Oct', submissions: 58, published: 21, rejected: 9 },
        { month: 'Nov', submissions: 47, published: 18, rejected: 7 },
        { month: 'Dec', submissions: 36, published: 14, rejected: 6 }
    ];

    const reviewTimeData = [
        { day: '0', time: 0 },
        { day: '5', time: 8 },
        { day: '10', time: 15 },
        { day: '15', time: 22 },
        { day: '20', time: 28 },
        { day: '25', time: 32 },
        { day: '30', time: 18 }
    ];

    // Distribution data for pie charts
    const submissionStatusData = [
        { name: 'Ready for Decision', value: 12, color: '#3B82F6' },
        { name: 'Revisions Required', value: 18, color: '#8B5CF6' },
        { name: 'Decision Made', value: 32, color: '#10B981' }
    ];

    const revisionRoundsData = [
        { name: 'No Revision', value: 45, color: '#10B981' },
        { name: '1 Round', value: 30, color: '#3B82F6' },
        { name: '2 Rounds', value: 15, color: '#F59E0B' },
        { name: '3+ Rounds', value: 10, color: '#EF4444' }
    ];

    // Recent submissions data
    const recentSubmissions = [
        {
            id: 'MS-2024-128',
            title: 'Quantum Computing: Latest Developments and Future Applications',
            status: 'New Submission',
            submitted: '2024-05-15',
            author: 'Dr. Michael Chen',
            category: 'Computer Science',
            statusColor: 'bg-blue-500'
        },
        {
            id: 'MS-2024-126',
            title: 'Impact of Climate Change on Agricultural Sustainability',
            status: 'Revision Required',
            submitted: '2024-05-10',
            author: 'Prof. David Williams',
            category: 'Agriculture',
            statusColor: 'bg-purple-500'
        },
        {
            id: 'MS-2024-125',
            title: 'Machine Learning Algorithms for Healthcare Diagnostics',
            status: 'Ready for Decision',
            submitted: '2024-05-08',
            author: 'Dr. Emily Rodriguez',
            category: 'Healthcare',
            statusColor: 'bg-green-500'
        },
        {
            id: 'MS-2024-124',
            title: 'Novel Approaches to Renewable Energy Storage',
            status: 'Published',
            submitted: '2024-05-05',
            author: 'Prof. Robert Garcia',
            category: 'Energy',
            statusColor: 'bg-teal-500'
        }
    ];

    // Review assignments data
    const pendingReviews = [
        {
            manuscriptId: 'MS-2024-127',
            title: 'AI-Driven Solutions for Environmental Monitoring',
            reviewer: 'Dr. Karen Wilson',
            assignedDate: '2024-05-12',
            deadline: '2024-05-26',
            progress: 25
        },
        {
            manuscriptId: 'MS-2024-126',
            title: 'Impact of Climate Change on Agricultural Sustainability',
            reviewer: 'Prof. James Moore',
            assignedDate: '2024-05-10',
            deadline: '2024-05-24',
            progress: 50
        },
        {
            manuscriptId: 'MS-2024-128',
            title: 'Quantum Computing: Latest Developments and Future Applications',
            reviewer: 'Dr. Lisa Zhang',
            assignedDate: '2024-05-15',
            deadline: '2024-05-29',
            progress: 0
        }
    ];

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-gray-600 dark:text-gray-300">{entry.name}:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Get status badge style based on status
    const getStatusBadge = (status: string) => {
        const styles = {
            'New Submission': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            'Revision Required': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            'Ready for Decision': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            'Published': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
            'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
        };

        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    };

    return (
        <AuthenticatedLayout header="Editor Dashboard">
            <Head title="Editor Dashboard" />

            <div className="space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                        <span className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 flex items-center">
                            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                            Editor
                        </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400 dark:text-gray-500" />
                    <div className="flex items-center">
                        <span className="font-medium text-green-600 dark:text-green-400">
                            Dashboard
                        </span>
                    </div>
                </div>

                {/* Stats Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{metric.title}</p>
                                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
                                                {metric.value}
                                                <span className={cn(
                                                    "flex items-center text-xs px-1.5 py-0.5 rounded-full font-medium",
                                                    metric.trend === 'up'
                                                        ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40"
                                                        : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40"
                                                )}>
                                                    {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                                                    {metric.percentage}
                                                </span>
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.description}</p>
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-lg bg-gradient-to-br",
                                            metric.color,
                                            "text-white shadow-sm"
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Monthly Submissions Chart - Takes 2/3 of width on large screens */}
                    <Card className="lg:col-span-2 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <div>
                                    <CardTitle className="text-lg font-semibold">Monthly Submission Analytics</CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manuscript submission trends and outcomes</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 flex items-center">
                                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                                Last 6 Months
                                                <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-36">
                                            <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                                            <DropdownMenuItem>Last 6 Months</DropdownMenuItem>
                                            <DropdownMenuItem>Last Year</DropdownMenuItem>
                                            <DropdownMenuItem>All Time</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button variant="outline" size="sm" className="h-8">
                                        <Download className="h-3.5 w-3.5 mr-1.5" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <Tabs defaultValue="area">
                                <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800/50">
                                    <TabsTrigger value="area">Area</TabsTrigger>
                                    <TabsTrigger value="bar">Bar</TabsTrigger>
                                    <TabsTrigger value="line">Line</TabsTrigger>
                                </TabsList>

                                <TabsContent value="area" className="space-y-4">
                                    <div className="h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={monthlySubmissionsData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="month" stroke="#6b7280" />
                                                <YAxis stroke="#6b7280" />
                                                <RechartsTooltip content={<CustomTooltip />} />
                                                <Legend verticalAlign="top" height={36} />
                                                <Area type="monotone" name="Submissions" dataKey="submissions" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                                                <Area type="monotone" name="Published" dataKey="published" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                                                <Area type="monotone" name="Rejected" dataKey="rejected" stackId="3" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </TabsContent>

                                <TabsContent value="bar" className="space-y-4">
                                    <div className="h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlySubmissionsData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="month" stroke="#6b7280" />
                                                <YAxis stroke="#6b7280" />
                                                <RechartsTooltip content={<CustomTooltip />} />
                                                <Legend verticalAlign="top" height={36} />
                                                <Bar name="Submissions" dataKey="submissions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                                <Bar name="Published" dataKey="published" fill="#10B981" radius={[4, 4, 0, 0]} />
                                                <Bar name="Rejected" dataKey="rejected" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </TabsContent>

                                <TabsContent value="line" className="space-y-4">
                                    <div className="h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={monthlySubmissionsData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="month" stroke="#6b7280" />
                                                <YAxis stroke="#6b7280" />
                                                <RechartsTooltip content={<CustomTooltip />} />
                                                <Legend verticalAlign="top" height={36} />
                                                <Line type="monotone" name="Submissions" dataKey="submissions" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" name="Published" dataKey="published" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" name="Rejected" dataKey="rejected" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Review Time and Distribution Charts - Takes 1/3 of width on large screens */}
                    <div className="space-y-6">
                        {/* Average Review Time Chart */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                <CardTitle className="text-lg font-semibold">Review Cycle Time</CardTitle>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Average days from submission to decision</p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={reviewTimeData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="day" stroke="#6b7280" label={{ value: 'Days', position: 'insideBottomRight', offset: -5 }} />
                                            <YAxis stroke="#6b7280" label={{ value: 'Completed Reviews', angle: -90, position: 'insideLeft' }} />
                                            <RechartsTooltip content={<CustomTooltip />} />
                                            <Line type="monotone" name="Review Time" dataKey="time" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex items-center justify-center mt-3">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-md">
                                        <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Average: 18 days</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Manuscript Status Distribution */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Manuscript Status</CardTitle>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Current distribution</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <ChevronDown className="h-3.5 w-3.5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                                            <DropdownMenuItem>Last Quarter</DropdownMenuItem>
                                            <DropdownMenuItem>This Year</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 pb-4">
                                <div className="h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={submissionStatusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {submissionStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {submissionStatusData.map((status, index) => (
                                        <div key={index} className="flex items-center gap-2 text-xs">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }}></div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{status.name}</span>
                                            <span className="text-gray-500 dark:text-gray-400 ml-auto">{status.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Submissions and Review Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Submissions - Takes 2/3 width on large screens */}
                    <Card className="lg:col-span-2 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg font-semibold">Recent Submissions</CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Recently submitted manuscripts</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30">
                                    View All
                                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-xs uppercase text-gray-600 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3 text-left">ID</th>
                                            <th className="px-4 py-3 text-left">Title</th>
                                            <th className="px-4 py-3 text-left">Status</th>
                                            <th className="px-4 py-3 text-left hidden md:table-cell">Author</th>
                                            <th className="px-4 py-3 text-left hidden md:table-cell">Submitted</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {recentSubmissions.map((submission, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {submission.id}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[250px]">
                                                            {submission.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {submission.category}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className={`px-2 py-0.5 text-xs ${getStatusBadge(submission.status)}`}>
                                                        {submission.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {submission.author}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {submission.submitted}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button size="sm" variant="outline" className="h-8 text-xs">
                                                        <FileSearch className="h-3.5 w-3.5 mr-1" />
                                                        Review
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50 py-3 flex justify-center">
                            <Button variant="outline" size="sm">
                                Load More
                                <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pending Reviews & Revision Stats */}
                    <div className="space-y-6">
                        {/* Pending Review Assignments */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                <CardTitle className="text-lg font-semibold">Pending Review Assignments</CardTitle>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manuscripts awaiting review</p>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-xs uppercase text-gray-600 dark:text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3 text-left">ID</th>
                                                <th className="px-4 py-3 text-left">Title</th>
                                                <th className="px-4 py-3 text-left">Reviewer</th>
                                                <th className="px-4 py-3 text-left hidden md:table-cell">Assigned</th>
                                                <th className="px-4 py-3 text-left hidden md:table-cell">Deadline</th>
                                                <th className="px-4 py-3 text-right">Progress</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {pendingReviews.map((review, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {review.manuscriptId}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[250px]">
                                                                {review.title}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                        {review.reviewer}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                        {review.assignedDate}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                        {review.deadline}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-sm text-gray-600 dark:text-gray-300">{review.progress}%</span>
                                                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                <div className="h-full bg-green-500" style={{ width: `${review.progress}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50 py-3 flex justify-center">
                                <Button variant="outline" size="sm">
                                    Load More
                                    <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Revision Rounds Distribution */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                <CardTitle className="text-lg font-semibold">Revision Rounds</CardTitle>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Distribution of revision rounds</p>
                            </CardHeader>
                            <CardContent className="pt-6 pb-4">
                                <div className="h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={revisionRoundsData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {revisionRoundsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {revisionRoundsData.map((round, index) => (
                                        <div key={index} className="flex items-center gap-2 text-xs">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: round.color }}></div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{round.name}</span>
                                            <span className="text-gray-500 dark:text-gray-400 ml-auto">{round.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};
