import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    FileText,
    CheckCircle,
    Clock,
    XCircle,
    Plus,
    Eye,
    Calendar,
    BarChart3
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Link } from '@inertiajs/react';

interface Manuscript {
    id: number;
    title: string;
    status: string;
    created_at: string;
    updated_at: string;
    journal: string;
    category: string;
}

interface MonthlyData {
    month: string;
    submissions: number;
    accepted: number;
    rejected: number;
}

interface AuthorDashboardProps {
    manuscripts: Manuscript[];
    monthlySubmissionData: MonthlyData[];
    currentTimeFilter: string;
}

const statusColors = {
    'draft': 'bg-gray-100 text-gray-800',
    'submitted': 'bg-prussian-blue/10 text-prussian-blue',
    'under_review': 'bg-amber/10 text-amber-dark',
    'minor_revision_required': 'bg-amber/20 text-amber-dark',
    'major_revision_required': 'bg-burgundy/10 text-burgundy',
    'accepted': 'bg-forest-green/10 text-forest-green',
    'rejected': 'bg-crimson/10 text-crimson',
    'published': 'bg-oxford-blue/10 text-oxford-blue',
    'ready_for_publication': 'bg-prussian-blue/10 text-prussian-blue',
    'awaiting_author_approval': 'bg-parchment text-oxford-blue',
};

const statusLabels = {
    'draft': 'Draft',
    'submitted': 'Submitted',
    'under_review': 'Under Review',
    'minor_revision_required': 'Minor Revision',
    'major_revision_required': 'Major Revision',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'published': 'Published',
    'ready_for_publication': 'Ready for Publication',
    'awaiting_author_approval': 'Awaiting Approval',
};

export default function AuthorDashboard({ manuscripts, monthlySubmissionData }: AuthorDashboardProps) {
    // Calculate statistics
    const totalSubmissions = manuscripts.length;
    const publishedCount = manuscripts.filter(m => m.status === 'published').length;
    const underReviewCount = manuscripts.filter(m => m.status === 'under_review').length;
    const revisionCount = manuscripts.filter(m => ['minor_revision_required', 'major_revision_required'].includes(m.status)).length;

    // Status distribution for pie chart
    const statusDistribution = Object.entries(
        manuscripts.reduce((acc, manuscript) => {
            const status = manuscript.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([status, count]) => ({
        name: statusLabels[status as keyof typeof statusLabels] || status,
        value: count,
        color: getStatusColor(status)
    }));

    function getStatusColor(status: string): string {
        const colors = {
            'draft': '#6B7280',
            'submitted': '#3B82F6',
            'under_review': '#F59E0B',
            'minor_revision_required': '#F97316',
            'major_revision_required': '#EF4444',
            'accepted': '#10B981',
            'rejected': '#EF4444',
            'published': '#8B5CF6',
            'ready_for_publication': '#6366F1',
            'awaiting_author_approval': '#06B6D4',
        };
        return colors[status as keyof typeof colors] || '#6B7280';
    }

    const recentManuscripts = manuscripts.slice(0, 5);

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: "#",
        }
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Author Dashboard" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-oxford-blue">Author Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your manuscript submissions and review progress
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/author/manuscripts/create">
                            <Plus className="h-4 w-4 mr-2" />
                            New Submission
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Total Submissions</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-2xl font-bold">{totalSubmissions}</div>
                            <p className="text-xs text-muted-foreground">
                                All time submissions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Published</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-2xl font-bold text-forest-green">{publishedCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Successfully published
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Under Review</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-2xl font-bold text-amber">{underReviewCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently being reviewed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide">Revisions Needed</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-2xl font-bold text-burgundy">{revisionCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Require your attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Submission Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Submission Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlySubmissionData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="submissions"
                                        stackId="1"
                                        stroke="#3B82F6"
                                        fill="#3B82F6"
                                        fillOpacity={0.6}
                                        name="Submissions"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="accepted"
                                        stackId="2"
                                        stroke="#10B981"
                                        fill="#10B981"
                                        fillOpacity={0.6}
                                        name="Accepted"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Manuscript Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Manuscripts */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Recent Manuscripts
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/author/manuscripts/index">
                                <Eye className="h-4 w-4 mr-2" />
                                View All
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentManuscripts.length > 0 ? (
                            <div className="space-y-4">
                                {recentManuscripts.map((manuscript) => (
                                    <div key={manuscript.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-foreground">{manuscript.title}</h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(manuscript.created_at).toLocaleDateString()}
                                                </span>
                                                {manuscript.journal && (
                                                    <span>{manuscript.journal}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={statusColors[manuscript.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                                                {statusLabels[manuscript.status as keyof typeof statusLabels] || manuscript.status}
                                            </Badge>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/author/manuscripts/${manuscript.id}`}>
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">No manuscripts yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Start your first submission to see your progress here.
                                </p>
                                <Button asChild>
                                    <Link href="/author/manuscripts/create">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Your First Manuscript
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};
