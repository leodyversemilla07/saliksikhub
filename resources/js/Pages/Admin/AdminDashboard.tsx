import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import {
    BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Activity, Users, FileText, Clock, TrendingUp, AlertCircle,
    LayoutDashboard, Settings, BookOpen, UserCheck, LogOut,
    Mail, BellRing, BookMarked, FileSpreadsheet
} from 'lucide-react';

// Simple utility function to join classNames
function joinClassNames(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}

interface SidebarProps {
    className?: string;
}

const Sidebar: FC<SidebarProps> = ({ className }) => {
    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", active: true },
        { icon: BookOpen, label: "Submissions" },
        { icon: UserCheck, label: "Reviewers" },
        { icon: FileSpreadsheet, label: "Reports" },
        { icon: Mail, label: "Messages" },
        { icon: BellRing, label: "Notifications" },
        { icon: BookMarked, label: "Archives" },
        { icon: Settings, label: "Settings" },
    ];

    return (
        <div className={joinClassNames("pb-12 min-h-screen", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold">Journal Admin</h2>
                    <div className="space-y-1">
                        {menuItems.map((item, index) => (
                            <Button
                                key={index}
                                variant={item.active ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 px-3 w-full">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
};


export default function AdminDashboard() {
    // Sample data - in a real application, this would come from an API
    const submissionData = [
        { month: 'Jan', submissions: 45, accepted: 28, rejected: 17 },
        { month: 'Feb', submissions: 52, accepted: 32, rejected: 20 },
        { month: 'Mar', submissions: 38, accepted: 25, rejected: 13 },
        { month: 'Apr', submissions: 65, accepted: 40, rejected: 25 },
        { month: 'May', submissions: 48, accepted: 30, rejected: 18 },
        { month: 'Jun', submissions: 55, accepted: 35, rejected: 20 },
    ];

    const reviewerMetrics = [
        { name: 'Week 1', averageTime: 5.2, activeReviewers: 28 },
        { name: 'Week 2', averageTime: 4.8, activeReviewers: 32 },
        { name: 'Week 3', averageTime: 6.1, activeReviewers: 25 },
        { name: 'Week 4', averageTime: 4.5, activeReviewers: 30 },
    ];

    const pendingSubmissions = [
        { id: 1, title: "Machine Learning Applications in Healthcare", status: "Under Review", daysInSystem: 12 },
        { id: 2, title: "Quantum Computing: Recent Advances", status: "Pending Reviewer Assignment", daysInSystem: 3 },
        { id: 3, title: "Climate Change Impact Analysis", status: "Revision Required", daysInSystem: 25 },
    ];

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar className="w-64 border-r bg-gray-50/50" />

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-50">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
                    <p className="text-gray-600">Research Journal Management System</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="flex items-center p-4">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Submissions</p>
                                <h3 className="text-2xl font-bold">303</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center p-4">
                            <div className="bg-green-100 p-3 rounded-full mr-4">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Active Reviewers</p>
                                <h3 className="text-2xl font-bold">115</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center p-4">
                            <div className="bg-yellow-100 p-3 rounded-full mr-4">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Avg. Review Time</p>
                                <h3 className="text-2xl font-bold">5.2 days</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center p-4">
                            <div className="bg-purple-100 p-3 rounded-full mr-4">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Acceptance Rate</p>
                                <h3 className="text-2xl font-bold">64.3%</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="submissions" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="submissions">Submissions Overview</TabsTrigger>
                        <TabsTrigger value="reviewers">Reviewer Metrics</TabsTrigger>
                        <TabsTrigger value="pending">Pending Actions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="submissions">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Submissions Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={submissionData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="submissions" fill="#3b82f6" name="Total Submissions" />
                                            <Bar dataKey="accepted" fill="#22c55e" name="Accepted" />
                                            <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reviewers">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reviewer Performance Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={reviewerMetrics}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="averageTime"
                                                stroke="#3b82f6"
                                                name="Avg. Review Time (days)"
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="activeReviewers"
                                                stroke="#22c55e"
                                                name="Active Reviewers"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pending">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Actions Required</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {pendingSubmissions.map((submission) => (
                                        <Card key={submission.id}>
                                            <CardContent className="flex items-center justify-between p-4">
                                                <div className="flex items-center space-x-4">
                                                    <AlertCircle className={
                                                        submission.daysInSystem > 20
                                                            ? "text-red-500"
                                                            : submission.daysInSystem > 10
                                                                ? "text-yellow-500"
                                                                : "text-green-500"
                                                    } />
                                                    <div>
                                                        <h4 className="font-semibold">{submission.title}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            Status: {submission.status} | Days in system: {submission.daysInSystem}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button>Take Action</Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
