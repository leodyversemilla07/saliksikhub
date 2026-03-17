import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    FileText,
    CheckCircle,
    Clock,
    AlertTriangle,
    TrendingUp,
    Eye,
    Calendar,
    BarChart3,
    Target
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Link } from '@inertiajs/react';

interface Manuscript {
    id: number;
    title: string;
    authors: string;
    author?: { name: string };
    status: string;
    created_at: string;
}

interface Review {
    id: number;
    manuscript_title: string;
    status: string;
    deadline: string | null;
    created_at: string;
    is_overdue: boolean;
}

interface MonthlyStat {
    month: string;
    completed: number;
}

interface ReviewerDashboardProps {
    manuscriptsUnderReview: Manuscript[];
    stats: {
        reviews_completed: number;
        reviews_pending: number;
        reviews_overdue: number;
        avg_review_time: number;
    };
    monthlyStats: MonthlyStat[];
    recentReviews: Review[];
}

const statusColors = {
    'assigned': 'bg-prussian-blue/10 text-prussian-blue',
    'in_progress': 'bg-amber/10 text-amber-dark',
    'completed': 'bg-forest-green/10 text-forest-green',
    'declined': 'bg-crimson/10 text-crimson',
};

const statusLabels = {
    'assigned': 'Assigned',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'declined': 'Declined',
};

export default function ReviewerDashboard({
    manuscriptsUnderReview,
    stats,
    monthlyStats,
    recentReviews
}: ReviewerDashboardProps) {
    const totalReviews = stats.reviews_completed + stats.reviews_pending;
    const completionRate = totalReviews > 0 ? (stats.reviews_completed / totalReviews) * 100 : 0;

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: "#",
        }
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Reviewer Dashboard" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-oxford-blue">Reviewer Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your review assignments and performance
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/reviewer/manuscripts">
                            <Eye className="h-4 w-4 mr-2" />
                            View All Manuscripts
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Reviews Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-2xl font-bold text-forest-green">{stats.reviews_completed}</div>
                            <p className="text-xs text-muted-foreground">
                                Total reviews finished
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Pending Reviews</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-2xl font-bold text-amber">{stats.reviews_pending}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently assigned
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Overdue Reviews</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-2xl font-bold text-crimson">{stats.reviews_overdue}</div>
                            <p className="text-xs text-muted-foreground">
                                Past deadline
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.avg_review_time}</div>
                            <p className="text-xs text-muted-foreground">
                                Days per review
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Review Progress Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Completion Rate</span>
                                    <span>{completionRate.toFixed(1)}%</span>
                                </div>
                                <Progress value={completionRate} className="h-3" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{stats.reviews_completed}</div>
                                    <div className="text-sm text-muted-foreground">Completed</div>
                                </div>
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">{stats.reviews_pending}</div>
                                    <div className="text-sm text-muted-foreground">In Progress</div>
                                </div>
                                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">{stats.reviews_overdue}</div>
                                    <div className="text-sm text-muted-foreground">Overdue</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Review Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Monthly Review Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={monthlyStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="completed"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Reviews Completed"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Recent Reviews */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Recent Reviews
                            </CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/reviewer/reviews">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View All
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentReviews.length > 0 ? (
                                <div className="space-y-3">
                                    {recentReviews.map((review) => (
                                        <div key={review.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm line-clamp-1">{review.manuscript_title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        className={`${statusColors[review.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'} text-xs`}
                                                    >
                                                        {statusLabels[review.status as keyof typeof statusLabels] || review.status}
                                                    </Badge>
                                                    {review.is_overdue && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {review.created_at}
                                                    </span>
                                                    {review.deadline && (
                                                        <span className={`flex items-center gap-1 ${review.is_overdue ? 'text-red-600' : ''}`}>
                                                            <Clock className="h-3 w-3" />
                                                            Due: {review.deadline}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No reviews yet</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your recent review activity will appear here.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Manuscripts Under Review */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Manuscripts Under Review
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/reviewer/manuscripts">
                                <Eye className="h-4 w-4 mr-2" />
                                View All
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {manuscriptsUnderReview && manuscriptsUnderReview.length > 0 ? (
                            <div className="grid gap-4">
                                {manuscriptsUnderReview.map((manuscript: Manuscript) => (
                                    <Card key={manuscript.id} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{manuscript.title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    by {manuscript.authors || manuscript.author?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Submitted: {new Date(manuscript.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className={statusColors[manuscript.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                                                    {statusLabels[manuscript.status as keyof typeof statusLabels] || manuscript.status}
                                                </Badge>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/reviewer/manuscripts/${manuscript.id}`}>
                                                        Review
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">No manuscripts under review</h3>
                                <p className="text-sm text-muted-foreground">
                                    There are currently no manuscripts assigned to you for review.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};