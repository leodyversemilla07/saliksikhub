import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Clock,
    CheckCircle,
    AlertCircle,
    FileText,
    Search,
    Calendar,
    BarChart3,
    Filter,
    Download
} from 'lucide-react';


export default function ReviewerDashboard() {
    // Sample data - in a real application, this would come from an API
    const metrics = {
        activeReviews: 3,
        completedThisMonth: 4,
        upcomingDeadlines: 2,
        averageCompletionTime: "12 days"
    };

    const activeAssignments = [
        {
            id: "MS-2024-123",
            title: "Advanced Machine Learning Applications in Healthcare",
            assignedDate: "2024-11-01",
            deadline: "2024-11-15",
            status: "In Progress",
            progress: 60,
            daysLeft: 4
        },
        {
            id: "MS-2024-128",
            title: "Quantum Computing: Latest Developments and Future Prospects",
            assignedDate: "2024-11-05",
            deadline: "2024-11-19",
            status: "Not Started",
            progress: 0,
            daysLeft: 8
        },
        {
            id: "MS-2024-130",
            title: "Climate Change Impact on Marine Ecosystems",
            assignedDate: "2024-11-07",
            deadline: "2024-11-21",
            status: "In Progress",
            progress: 30,
            daysLeft: 10
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Reviewer Dashboard</h1>
                <p className="text-gray-600 mt-2">Research Journal Management System</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Active Reviews</p>
                                <h3 className="text-2xl font-bold text-blue-600">{metrics.activeReviews}</h3>
                            </div>
                            <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Completed This Month</p>
                                <h3 className="text-2xl font-bold text-green-600">{metrics.completedThisMonth}</h3>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-yellow-50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Upcoming Deadlines</p>
                                <h3 className="text-2xl font-bold text-yellow-600">{metrics.upcomingDeadlines}</h3>
                            </div>
                            <Calendar className="w-8 h-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Avg. Completion Time</p>
                                <h3 className="text-2xl font-bold text-purple-600">{metrics.averageCompletionTime}</h3>
                            </div>
                            <Clock className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Reviews Section */}
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Active Review Assignments</CardTitle>
                        <div className="flex space-x-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search manuscripts..."
                                    className="pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-2 top-3" />
                            </div>
                            <button className="flex items-center px-3 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activeAssignments.map((assignment) => (
                            <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-semibold text-lg mb-1">{assignment.title}</h4>
                                        <p className="text-sm text-gray-600">Manuscript ID: {assignment.id}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                                            Continue Review
                                        </button>
                                        <button className="px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-50">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Assigned Date</p>
                                        <p className="font-medium">{assignment.assignedDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Deadline</p>
                                        <p className="font-medium">{assignment.deadline}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Status</p>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${assignment.status === 'In Progress'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {assignment.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Days Left</p>
                                        <p className={`font-medium ${assignment.daysLeft <= 5 ? 'text-red-600' : 'text-gray-800'
                                            }`}>
                                            {assignment.daysLeft} days
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${assignment.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-4 text-sm text-gray-600">{assignment.progress}% Complete</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center text-sm">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium">Completed review for MS-2024-119</p>
                                <p className="text-gray-600">2 days ago</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium">Received new review assignment MS-2024-130</p>
                                <p className="text-gray-600">4 days ago</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                                <p className="font-medium">Deadline reminder for MS-2024-123</p>
                                <p className="text-gray-600">5 days ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
