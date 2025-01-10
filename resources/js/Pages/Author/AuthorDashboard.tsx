import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Book, FileText, CheckCircle, Clock, AlertCircle, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// Types
type ManuscriptStatus =
    | 'Submitted'
    | 'Under Review'
    | 'Revision Required'
    | 'Accepted'
    | 'Rejected'
    | 'Published';

interface User {
    id: number;
    name: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string[];
}

interface Manuscript {
    id: number;
    title: string;
    status: ManuscriptStatus;
    created_at: Date | null;
    updated_at: Date;
}

// Constants
const STATE_COLORS: Record<ManuscriptStatus, string> = {
    Submitted: '#3B82F6',
    'Under Review': '#F59E0B',
    'Revision Required': '#F97316',
    Accepted: '#10B981',
    Rejected: '#EF4444',
    Published: '#8B5CF6'
};

const STATE_ICONS: Record<ManuscriptStatus, React.ElementType> = {
    Submitted: FileText,
    'Under Review': Clock,
    'Revision Required': AlertCircle,
    Accepted: CheckCircle,
    Rejected: AlertCircle,
    Published: Book
};

// Components
const SubmissionDistributionChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={activeIndex === index ? '#fff' : 'none'}
                            strokeWidth={activeIndex === index ? 2 : 0}
                        />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value, name) => [`${value} manuscripts`, name]}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

const SubmissionsByMonthChart: React.FC<{ data: { month: string; submissions: number }[] }> = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="submissions" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
);

const ManuscriptCard: React.FC<{ manuscript: Manuscript }> = ({ manuscript }) => {
    const StateIcon = STATE_ICONS[manuscript.status];

    return (
        <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{manuscript.title}</CardTitle>
                <Badge
                    variant="outline"
                    style={{ backgroundColor: STATE_COLORS[manuscript.status], color: 'white' }}
                >
                    {manuscript.status.replace('_', ' ')}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <StateIcon className="h-5 w-5" style={{ color: STATE_COLORS[manuscript.status] }} />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ID: {manuscript.id}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Last updated: {new Date(manuscript.updated_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">
                        View Details <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    trend: {
        value: number;
        icon: React.ElementType;
        isUpward: boolean;
    };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend }) => {
    const TrendIcon = trend.icon;
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    <TrendIcon className={`inline mr-1 h-4 w-4 ${trend.isUpward ? 'text-green-500' : 'text-red-500'}`} />
                    {trend.value}% from last month
                </p>
            </CardContent>
        </Card>
    );
};

// Main Dashboard Component
const AuthorDashboard: React.FC = () => {
    const { props } = usePage<{ manuscripts: Manuscript[], auth: { user: User, roles: string[] } }>();
    const { manuscripts } = props;

    const transformManuscripts = manuscripts.map(manuscript => ({
        ...manuscript,
        submissionDate: manuscript.created_at ? new Date(manuscript.created_at) : null,
        lastUpdated: new Date(manuscript.updated_at)
    }));

    const activeManuscripts = transformManuscripts.filter(manuscript =>
        ['Submitted', 'Under Review', 'Revision Required'].includes(manuscript.status)
    );

    const completedManuscripts = transformManuscripts.filter(manuscript =>
        ['Accepted', 'Published'].includes(manuscript.status)
    );

    const getManuscriptStateDistribution = () => {
        const statusCount = transformManuscripts.reduce((acc, manuscript) => {
            acc[manuscript.status] = (acc[manuscript.status] || 0) + 1;
            return acc;
        }, {} as Record<ManuscriptStatus, number>);

        return Object.keys(STATE_COLORS).map(state => ({
            name: state,
            value: statusCount[state as ManuscriptStatus] || 0,
            color: STATE_COLORS[state as ManuscriptStatus]
        }));
    };

    const getManuscriptsByMonth = () => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const monthlyManuscripts = transformManuscripts.reduce((acc, manuscript) => {
            if (manuscript.submissionDate) {
                const month = monthNames[manuscript.submissionDate.getMonth()];
                acc[month] = (acc[month] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(monthlyManuscripts).map(([month, count]) => ({
            month,
            submissions: count
        }));
    };

    const totalManuscripts = transformManuscripts.length;
    const acceptanceRate = (completedManuscripts.length / totalManuscripts * 100).toFixed(1);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Dashboard</h2>}
        >
            <Head title="Author Dashboard" />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
                <div className="container mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manuscript Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Track your submissions and progress.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Manuscripts"
                            value={totalManuscripts}
                            icon={FileText}
                            trend={{
                                value: 5,
                                icon: TrendingUp,
                                isUpward: true
                            }}
                        />
                        <StatCard
                            title="Active Manuscripts"
                            value={activeManuscripts.length}
                            icon={Clock}
                            trend={{
                                value: 2,
                                icon: TrendingUp,
                                isUpward: true
                            }}
                        />
                        <StatCard
                            title="Completed Manuscripts"
                            value={completedManuscripts.length}
                            icon={CheckCircle}
                            trend={{
                                value: 1,
                                icon: TrendingDown,
                                isUpward: false
                            }}
                        />
                        <StatCard
                            title="Acceptance Rate"
                            value={`${acceptanceRate}%`}
                            icon={TrendingUp}
                            trend={{
                                value: 0.5,
                                icon: TrendingUp,
                                isUpward: true
                            }}
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Manuscript Distribution</CardTitle>
                                <CardDescription>Status breakdown of your manuscripts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SubmissionDistributionChart data={getManuscriptStateDistribution()} />
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Monthly Submissions</CardTitle>
                                <CardDescription>Number of manuscripts submitted per month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SubmissionsByMonthChart data={getManuscriptsByMonth()} />
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="active" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="active">Active Manuscripts</TabsTrigger>
                            <TabsTrigger value="completed">Completed Manuscripts</TabsTrigger>
                        </TabsList>
                        <TabsContent value="active">
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                {activeManuscripts.length > 0 ? (
                                    activeManuscripts.map(manuscript => (
                                        <ManuscriptCard key={manuscript.id} manuscript={manuscript} />
                                    ))
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400 col-span-2">No active manuscripts found.</p>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="completed">
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                {completedManuscripts.length > 0 ? (
                                    completedManuscripts.map(manuscript => (
                                        <ManuscriptCard key={manuscript.id} manuscript={manuscript} />
                                    ))
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400 col-span-2">No completed manuscripts found.</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AuthorDashboard;

