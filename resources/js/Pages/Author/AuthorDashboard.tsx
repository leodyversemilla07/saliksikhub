import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Book, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Define TypeScript types
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
    created_at: string | null;
    updated_at: string;
}

// State Colors and Icons
const STATE_COLORS: Record<ManuscriptStatus, string> = {
    'Submitted': '#3B82F6',
    'Under Review': '#F59E0B',
    'Revision Required': '#F97316',
    'Accepted': '#10B981',
    'Rejected': '#EF4444',
    'Published': '#8B5CF6'
};

const STATE_ICONS: Record<ManuscriptStatus, React.ElementType> = {
    'Submitted': FileText,
    'Under Review': Clock,
    'Revision Required': AlertCircle,
    'Accepted': CheckCircle,
    'Rejected': AlertCircle,
    'Published': Book
};

// Main Dashboard Component
const AuthorDashboard: React.FC = () => {
    const { props } = usePage<{ manuscripts: Manuscript[], auth: { user: User, roles: string[] } }>();
    const { manuscripts } = props;

    // Process Manuscripts
    const transformManuscripts = manuscripts.map(manuscript => ({
        ...manuscript,
        submissionDate: manuscript.created_at ? new Date(manuscript.created_at) : null,
        lastUpdated: new Date(manuscript.updated_at)
    }));

    const activeManuscripts = transformManuscripts.filter(({ status }) =>
        ['Submitted', 'Under Review', 'Revision Required'].includes(status)
    );

    const completedManuscripts = transformManuscripts.filter(({ status }) =>
        ['Accepted', 'Published'].includes(status)
    );

    const getManuscriptStateDistribution = () => {
        const statusCount = transformManuscripts.reduce((acc, { status }) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<ManuscriptStatus, number>);

        return Object.entries(STATE_COLORS).map(([state, color]) => ({
            name: state,
            value: statusCount[state as ManuscriptStatus] || 0,
            color
        }));
    };

    const getManuscriptsByMonth = () => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const monthlyManuscripts = transformManuscripts.reduce((acc, { submissionDate }) => {
            if (submissionDate) {
                const month = monthNames[submissionDate.getMonth()];
                acc[month] = (acc[month] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(monthlyManuscripts).map(([month, submissions]) => ({ month, submissions }));
    };

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
                        {manuscript.status}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <StateIcon className="h-5 w-5" style={{ color: STATE_COLORS[manuscript.status] }} />
                        <p className="text-sm text-muted-foreground">ID: {manuscript.id}</p>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const SubmissionDistributionChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({
        data
    }) => (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {data.map(entry => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );

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

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}>
            <Head title="Author Dashboard" />
            <div className="min-h-screen bg-background p-8">
                <div className="container mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Manuscript Dashboard</h1>
                        <p className="text-muted-foreground">Track your submissions and progress.</p>
                    </header>

                    <div className="grid md:grid-cols-3 gap-8">
                        <SubmissionDistributionChart data={getManuscriptStateDistribution()} />
                        <div className="md:col-span-2">
                            <SubmissionsByMonthChart data={getManuscriptsByMonth()} />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Active Manuscripts</h2>
                            {activeManuscripts.length > 0 ? (
                                activeManuscripts.map(manuscript => (
                                    <ManuscriptCard key={manuscript.id} manuscript={manuscript} />
                                ))
                            ) : (
                                <p className="text-muted-foreground">No active manuscripts found.</p>
                            )}
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Completed Manuscripts</h2>
                            {completedManuscripts.length > 0 ? (
                                completedManuscripts.map(manuscript => (
                                    <ManuscriptCard key={manuscript.id} manuscript={manuscript} />
                                ))
                            ) : (
                                <p className="text-muted-foreground">No completed manuscripts found.</p>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AuthorDashboard;
