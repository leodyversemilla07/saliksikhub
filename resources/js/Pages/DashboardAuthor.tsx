import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Download, ExternalLink, Eye, FileText, MessageSquare, Plus, Send, Upload } from 'lucide-react';

export default function Dashboard() {
    // Sample data - in a real application, this would come from an API
    const metrics = {
        activeSubmissions: 3,
        publishedPapers: 5,
        underReview: 2,
        needsRevision: 1
    };

    const submissions = [
        {
            id: "MS-2024-156",
            title: "Neural Networks in Climate Prediction",
            status: "Under Review",
            submittedDate: "2024-11-01",
            lastUpdate: "2024-11-08",
            journal: "Journal of Climate Science",
            hasComments: true,
            stage: "Peer Review"
        },
        {
            id: "MS-2024-142",
            title: "Quantum Computing Applications in Cryptography",
            status: "Revision Required",
            submittedDate: "2024-10-15",
            lastUpdate: "2024-11-05",
            journal: "Journal of Quantum Computing",
            hasComments: true,
            stage: "Author Revision",
            revisionDue: "2024-11-19"
        },
        {
            id: "MS-2024-128",
            title: "Machine Learning in Healthcare Systems",
            status: "Published",
            submittedDate: "2024-09-01",
            lastUpdate: "2024-10-30",
            journal: "Healthcare Informatics Journal",
            doi: "10.1234/hij.2024.128"
        }
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
                    {/* Header with New Submission Button */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Author Dashboard</h1>
                            <p className="text-gray-600 mt-2">Research Journal Management System</p>
                        </div>
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            <Plus className="w-5 h-5 mr-2" />
                            New Submission
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-blue-50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600">Active Submissions</p>
                                        <h3 className="text-2xl font-bold text-blue-600">{metrics.activeSubmissions}</h3>
                                    </div>
                                    <FileText className="w-8 h-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600">Published Papers</p>
                                        <h3 className="text-2xl font-bold text-green-600">{metrics.publishedPapers}</h3>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-yellow-50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600">Under Review</p>
                                        <h3 className="text-2xl font-bold text-yellow-600">{metrics.underReview}</h3>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600">Needs Revision</p>
                                        <h3 className="text-2xl font-bold text-orange-600">{metrics.needsRevision}</h3>
                                    </div>
                                    <AlertCircle className="w-8 h-8 text-orange-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Manuscript Tracking */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Manuscript Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {submissions.map((submission) => (
                                    <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-lg">{submission.title}</h4>
                                                    {submission.hasComments && (
                                                        <span className="flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                            <MessageSquare className="w-3 h-3 mr-1" />
                                                            New Comments
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Manuscript ID: {submission.id} | Journal: {submission.journal}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {submission.status === "Revision Required" && (
                                                    <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center">
                                                        <Upload className="w-4 h-4 mr-1" />
                                                        Submit Revision
                                                    </button>
                                                )}
                                                <button className="px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-50">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                            <div>
                                                <p className="text-gray-600">Submitted Date</p>
                                                <p className="font-medium">{submission.submittedDate}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Last Update</p>
                                                <p className="font-medium">{submission.lastUpdate}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Status</p>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${submission.status === 'Under Review'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : submission.status === 'Revision Required'
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : submission.status === 'Published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {submission.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Stage</p>
                                                <p className="font-medium">{submission.stage || 'Completed'}</p>
                                            </div>
                                        </div>

                                        {submission.status === "Published" && (
                                            <div className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                <a href={`https://doi.org/${submission.doi}`} target="_blank" rel="noopener noreferrer">
                                                    {submission.doi}
                                                </a>
                                            </div>
                                        )}

                                        {submission.status === "Revision Required" && (
                                            <div className="mt-2 p-2 bg-orange-50 rounded-md flex items-center justify-between">
                                                <span className="text-sm text-orange-800">
                                                    Revision due by: {submission.revisionDue}
                                                </span>
                                                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View Reviewer Comments
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submission History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center text-sm">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <MessageSquare className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Reviewer comments received for MS-2024-142</p>
                                        <p className="text-gray-600">2 days ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                        <Send className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">New manuscript submitted MS-2024-156</p>
                                        <p className="text-gray-600">1 week ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">MS-2024-128 has been published</p>
                                        <p className="text-gray-600">2 weeks ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
