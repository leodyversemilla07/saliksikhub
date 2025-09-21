import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { FileText, Users, CheckCircle, Clock } from 'lucide-react';

const breadcrumbItems = [
    {
        label: 'Dashboard',
        href: "#",
    }
];

interface Manuscript {
    id: number;
    title: string;
    authors: string;
    author?: { name: string };
    status: string;
    created_at: string;
}

export default function ReviewerDashboard({ manuscriptsUnderReview }: { manuscriptsUnderReview: Manuscript[] }) {
    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Reviewer Dashboard" />
            <div className="min-h-screen w-full flex flex-col space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Manuscripts Under Review */}
                    <Card className="h-full border-l-4 border-l-blue-500">
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <h2 className="text-xl font-semibold text-blue-700">Under Review</h2>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">{manuscriptsUnderReview?.length || 0}</p>
                            <p className="text-sm text-muted-foreground">Manuscripts awaiting review</p>
                        </div>
                    </Card>

                    {/* Reviews Completed */}
                    <Card className="h-full border-l-4 border-l-green-500">
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <h2 className="text-xl font-semibold text-green-700">Completed</h2>
                            </div>
                            <p className="text-3xl font-bold text-green-600">0</p>
                            <p className="text-sm text-muted-foreground">Reviews completed this month</p>
                        </div>
                    </Card>

                    {/* Pending Reviews */}
                    <Card className="h-full border-l-4 border-l-orange-500">
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-5 w-5 text-orange-500" />
                                <h2 className="text-xl font-semibold text-orange-700">Pending</h2>
                            </div>
                            <p className="text-3xl font-bold text-orange-600">{manuscriptsUnderReview?.length || 0}</p>
                            <p className="text-sm text-muted-foreground">Reviews pending</p>
                        </div>
                    </Card>

                    {/* Average Review Time */}
                    <Card className="h-full border-l-4 border-l-purple-500">
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-5 w-5 text-purple-500" />
                                <h2 className="text-xl font-semibold text-purple-700">Avg Time</h2>
                            </div>
                            <p className="text-3xl font-bold text-purple-600">--</p>
                            <p className="text-sm text-muted-foreground">Days per review</p>
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">Manuscripts for Review</h2>
                    {manuscriptsUnderReview && manuscriptsUnderReview.length > 0 ? (
                        <div className="grid gap-4">
                            {manuscriptsUnderReview.map((manuscript: Manuscript) => (
                                <Card key={manuscript.id} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">{manuscript.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                by {manuscript.authors || manuscript.author?.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Submitted: {new Date(manuscript.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {manuscript.status}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No manuscripts for review</h3>
                            <p className="text-sm text-muted-foreground">
                                There are currently no manuscripts assigned to you for review.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};