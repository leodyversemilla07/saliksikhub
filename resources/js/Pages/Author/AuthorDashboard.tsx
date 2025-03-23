import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Progress } from '@/Components/ui/progress';
import {
    Book, FileText, CheckCircle, Clock, AlertCircle, TrendingUp, TrendingDown,
    ChevronRight, Calendar, ChevronDown, Filter, Download, ArrowRight,
    PenLine, XCircle, Eye, BarChart3, FileSearch
} from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem
} from '@/Components/ui/dropdown-menu';
import { cn } from "@/lib/utils";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { User } from '@/types';

// Types
type ManuscriptStatus =
    | 'Submitted'
    | 'Revision Required'
    | 'Accepted'
    | 'Rejected'
    | 'Published';

interface Manuscript {
    id: number;
    title: string;
    status: ManuscriptStatus;
    created_at: Date | null;
    updated_at: Date;
    category?: string;
    journal?: string;
    co_authors?: string[];
}

// Constants
const STATE_COLORS: Record<ManuscriptStatus, string> = {
    Submitted: '#3B82F6',
    'Revision Required': '#F97316',
    Accepted: '#10B981',
    Rejected: '#EF4444',
    Published: '#8B5CF6'
};

const STATE_ICONS: Record<ManuscriptStatus, React.ElementType> = {
    Submitted: FileText,
    'Revision Required': AlertCircle,
    Accepted: CheckCircle,
    Rejected: XCircle,
    Published: Book
};

// Enhanced Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                        <span className="text-gray-600 dark:text-gray-300">{entry.name}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// Function to determine chart grid color based on theme
const getChartGridColor = () => {
    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains('dark');
    return isDarkMode ? "#374151" : "#e5e7eb";
};

// Function to determine chart axis color based on theme
const getAxisColor = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return isDarkMode ? "#9ca3af" : "#6b7280";
};

// Main Dashboard Component
const AuthorDashboard: React.FC = () => {
    const { props } = usePage<{ manuscripts: Manuscript[], auth: { user: User, role: string } }>();
    const { manuscripts } = props;
    const [activeView, setActiveView] = useState('overview');
    const [timeFilter, setTimeFilter] = useState('6months');

    const transformManuscripts = manuscripts.map(manuscript => ({
        ...manuscript,
        submissionDate: manuscript.created_at ? new Date(manuscript.created_at) : null,
        lastUpdated: new Date(manuscript.updated_at)
    }));

    const activeManuscripts = transformManuscripts.filter(manuscript =>
        ['Submitted', 'Revision Required'].includes(manuscript.status)
    );

    const completedManuscripts = transformManuscripts.filter(manuscript =>
        ['Accepted', 'Published', 'Rejected'].includes(manuscript.status)
    );

    // Dashboard metrics calculation
    const totalManuscripts = transformManuscripts.length;
    const acceptedCount = transformManuscripts.filter(m => m.status === 'Accepted' || m.status === 'Published').length;
    const rejectedCount = transformManuscripts.filter(m => m.status === 'Rejected').length;
    const inProgressCount = transformManuscripts.filter(m =>
        ['Submitted', 'Revision Required'].includes(m.status)
    ).length;
    const acceptanceRate = totalManuscripts > 0
        ? Math.round((acceptedCount / totalManuscripts) * 100)
        : 0;

    // Enhanced metrics for the dashboard cards
    const metrics = [
        {
            title: 'Total Submissions',
            value: totalManuscripts,
            trend: {
                direction: 'up',
                value: '12%'
            },
            description: 'All-time manuscripts',
            icon: FileText,
            color: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'In Progress',
            value: inProgressCount,
            trend: {
                direction: 'up',
                value: '8%'
            },
            description: 'Manuscripts in workflow',
            icon: Clock,
            color: 'from-amber-500 to-yellow-600'
        },
        {
            title: 'Published Papers',
            value: acceptedCount,
            trend: {
                direction: 'up',
                value: '24%'
            },
            description: 'Accepted manuscripts',
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-600'
        },
        {
            title: 'Acceptance Rate',
            value: `${acceptanceRate}%`,
            trend: {
                direction: acceptanceRate >= 50 ? 'up' : 'down',
                value: '5%'
            },
            description: 'Overall success rate',
            icon: BarChart3,
            color: 'from-purple-500 to-violet-600'
        }
    ];

    // Status distribution data for pie chart
    const manuscriptStatusData = Object.keys(STATE_COLORS).map(status => {
        const count = transformManuscripts.filter(m => m.status === status).length;
        return {
            name: status,
            value: count || 0,
            color: STATE_COLORS[status as ManuscriptStatus]
        };
    }).filter(item => item.value > 0);

    // Monthly submission data
    const monthlySubmissionData = [
        { month: 'Jan', submissions: 5, accepted: 3, rejected: 1 },
        { month: 'Feb', submissions: 7, accepted: 4, rejected: 2 },
        { month: 'Mar', submissions: 3, accepted: 2, rejected: 0 },
        { month: 'Apr', submissions: 8, accepted: 5, rejected: 1 },
        { month: 'May', submissions: 12, accepted: 6, rejected: 3 },
        { month: 'Jun', submissions: 10, accepted: 7, rejected: 2 }
    ];

    // Recent manuscripts for the activity feed - updated with fallback icon
    const recentActivity = transformManuscripts
        .slice(0, 5)
        .map((manuscript, index) => ({
            ...manuscript,
            id: manuscript.id,
            title: manuscript.title,
            status: manuscript.status,
            time: manuscript.lastUpdated.toLocaleDateString(),
            description: `${manuscript.journal || 'Journal'} · ${manuscript.category || 'Research'}`,
            // Add fallback icon to ensure it's never undefined
            icon: STATE_ICONS[manuscript.status] || FileText
        }))
        .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

    // Get manuscript state distribution for the pie chart
    const getManuscriptStateDistribution = () => {
        const statusCount = transformManuscripts.reduce((acc, manuscript) => {
            acc[manuscript.status] = (acc[manuscript.status] || 0) + 1;
            return acc;
        }, {} as Record<ManuscriptStatus, number>);

        return Object.keys(STATE_COLORS)
            .filter(key => statusCount[key as ManuscriptStatus] > 0)
            .map(state => ({
                name: state,
                value: statusCount[state as ManuscriptStatus] || 0,
                color: STATE_COLORS[state as ManuscriptStatus]
            }));
    };

    // Get the status badge color
    const getStatusBadge = (status: ManuscriptStatus) => {
        const styles = {
            'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            'Revision Required': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
            'Accepted': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            'Published': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
        };

        return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    };

    return (
        <AuthenticatedLayout header="Author Dashboard">
            <Head title="Author Dashboard" />

            <div className="space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <span className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 flex items-center">
                            <PenLine className="h-4 w-4 mr-1.5" />
                            Author
                        </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400 dark:text-gray-500" />
                    <div className="flex items-center">
                        <span className="font-medium text-green-600 dark:text-green-400">
                            Dashboard
                        </span>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {metrics.map((metric, index) => (
                        <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{metric.title}</p>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
                                            {metric.value}
                                            <span className={cn(
                                                "flex items-center text-xs px-1.5 py-0.5 rounded-full font-medium",
                                                metric.trend.direction === 'up'
                                                    ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40"
                                                    : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40"
                                            )}>
                                                {metric.trend.direction === 'up' ? (
                                                    <TrendingUp className="h-3 w-3 mr-0.5" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 mr-0.5" />
                                                )}
                                                {metric.trend.value}
                                            </span>
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.description}</p>
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-lg bg-gradient-to-br",
                                        metric.color,
                                        "text-white shadow-sm"
                                    )}>
                                        <metric.icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Tabs */}
                <Tabs defaultValue="overview" value={activeView} onValueChange={setActiveView}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                        <TabsList className="h-10">
                            <TabsTrigger value="overview" className="px-4">Overview</TabsTrigger>
                            <TabsTrigger value="manuscripts" className="px-4">My Manuscripts</TabsTrigger>
                            <TabsTrigger value="activity" className="px-4">Recent Activity</TabsTrigger>
                        </TabsList>

                        <div className="flex flex-wrap gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 flex items-center">
                                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                        {timeFilter === '30days' ? 'Last 30 Days' :
                                            timeFilter === '6months' ? 'Last 6 Months' : 'Last Year'}
                                        <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuItem onClick={() => setTimeFilter('30days')}>Last 30 Days</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTimeFilter('6months')}>Last 6 Months</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTimeFilter('1year')}>Last Year</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="outline" size="sm" className="h-8">
                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Overview Tab Content */}
                    <TabsContent value="overview" className="space-y-6 mt-2">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Submissions Analysis Chart - Takes 2/3 width on large screens */}
                            <Card className="lg:col-span-2 shadow-sm">
                                <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                        <div>
                                            <CardTitle className="text-lg font-semibold">Submission Analytics</CardTitle>
                                            <CardDescription>Your manuscript submission history</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 px-2">
                                    <Tabs defaultValue="area" className="w-full">
                                        <div className="mb-4 flex justify-end">
                                            <TabsList className="bg-gray-100 dark:bg-gray-800/50 h-8">
                                                <TabsTrigger value="area" className="text-xs py-0 h-7">Area</TabsTrigger>
                                                <TabsTrigger value="line" className="text-xs py-0 h-7">Line</TabsTrigger>
                                                <TabsTrigger value="bar" className="text-xs py-0 h-7">Bar</TabsTrigger>
                                            </TabsList>
                                        </div>
                                        <TabsContent value="area" className="mt-0">
                                            <div className="h-[350px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart
                                                        data={monthlySubmissionData}
                                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={getChartGridColor()} />
                                                        <XAxis
                                                            dataKey="month"
                                                            stroke={getAxisColor()}
                                                            tickLine={false}
                                                            axisLine={{ stroke: getChartGridColor() }}
                                                        />
                                                        <YAxis
                                                            stroke={getAxisColor()}
                                                            tickLine={false}
                                                            axisLine={{ stroke: getChartGridColor() }}
                                                        />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend
                                                            verticalAlign="top"
                                                            height={36}
                                                            iconType="circle"
                                                            iconSize={8}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            name="Submissions"
                                                            dataKey="submissions"
                                                            fill="url(#colorSubmissions)"
                                                            stroke="#3B82F6"
                                                            strokeWidth={2}
                                                            activeDot={{ r: 6 }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            name="Accepted"
                                                            dataKey="accepted"
                                                            fill="url(#colorAccepted)"
                                                            stroke="#10B981"
                                                            strokeWidth={2}
                                                            activeDot={{ r: 6 }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            name="Rejected"
                                                            dataKey="rejected"
                                                            fill="url(#colorRejected)"
                                                            stroke="#EF4444"
                                                            strokeWidth={2}
                                                            activeDot={{ r: 6 }}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="line" className="mt-0">
                                            <div className="h-[350px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart
                                                        data={monthlySubmissionData}
                                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={getChartGridColor()} />
                                                        <XAxis dataKey="month" stroke={getAxisColor()} tickLine={false} />
                                                        <YAxis stroke={getAxisColor()} tickLine={false} />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend
                                                            verticalAlign="top"
                                                            height={36}
                                                            iconType="circle"
                                                            iconSize={8}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            name="Submissions"
                                                            dataKey="submissions"
                                                            stroke="#3B82F6"
                                                            strokeWidth={2}
                                                            dot={{ r: 4 }}
                                                            activeDot={{ r: 6 }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            name="Accepted"
                                                            dataKey="accepted"
                                                            stroke="#10B981"
                                                            strokeWidth={2}
                                                            dot={{ r: 4 }}
                                                            activeDot={{ r: 6 }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            name="Rejected"
                                                            dataKey="rejected"
                                                            stroke="#EF4444"
                                                            strokeWidth={2}
                                                            dot={{ r: 4 }}
                                                            activeDot={{ r: 6 }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="bar" className="mt-0">
                                            <div className="h-[350px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={monthlySubmissionData}
                                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={getChartGridColor()} />
                                                        <XAxis dataKey="month" stroke={getAxisColor()} tickLine={false} />
                                                        <YAxis stroke={getAxisColor()} tickLine={false} />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend
                                                            verticalAlign="top"
                                                            height={36}
                                                            iconType="circle"
                                                            iconSize={8}
                                                        />
                                                        <Bar
                                                            name="Submissions"
                                                            dataKey="submissions"
                                                            fill="#3B82F6"
                                                            radius={[4, 4, 0, 0]}
                                                            barSize={20}
                                                        />
                                                        <Bar
                                                            name="Accepted"
                                                            dataKey="accepted"
                                                            fill="#10B981"
                                                            radius={[4, 4, 0, 0]}
                                                            barSize={20}
                                                        />
                                                        <Bar
                                                            name="Rejected"
                                                            dataKey="rejected"
                                                            fill="#EF4444"
                                                            radius={[4, 4, 0, 0]}
                                                            barSize={20}
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            {/* Status Distribution - Takes 1/3 width on large screens */}
                            <Card className="shadow-sm">
                                <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                    <CardTitle className="text-lg font-semibold">Manuscript Status</CardTitle>
                                    <CardDescription>Distribution of your manuscripts</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 pb-4">
                                    <div className="h-[300px] w-full">
                                        {getManuscriptStateDistribution().length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                                    <Pie
                                                        data={getManuscriptStateDistribution()}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={65}
                                                        outerRadius={90}
                                                        paddingAngle={2}
                                                        dataKey="value"
                                                        startAngle={90}
                                                        endAngle={-270}
                                                        animationBegin={0}
                                                        animationDuration={1000}
                                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                                            return (
                                                                <text
                                                                    x={x}
                                                                    y={y}
                                                                    fill="white"
                                                                    textAnchor="middle"
                                                                    dominantBaseline="central"
                                                                    className="text-xs font-medium"
                                                                >
                                                                    {`${(percent * 100).toFixed(0)}%`}
                                                                </text>
                                                            );
                                                        }}
                                                    >
                                                        {getManuscriptStateDistribution().map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={entry.color}
                                                                stroke="rgba(255,255,255,0.3)"
                                                                strokeWidth={1}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        content={<CustomTooltip />}
                                                        animationDuration={200}
                                                    />
                                                    {totalManuscripts > 0 && (
                                                        <text
                                                            x="50%"
                                                            y="50%"
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                            className="fill-gray-900 dark:fill-gray-100 text-sm font-medium"
                                                        >
                                                            <tspan x="50%" dy="-0.5em">{totalManuscripts}</tspan>
                                                            <tspan x="50%" dy="1.5em" className="fill-gray-500 dark:fill-gray-400 text-xs">
                                                                Total
                                                            </tspan>
                                                        </text>
                                                    )}
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center">
                                                <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                                                <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        {getManuscriptStateDistribution().length > 0 ? (
                                            getManuscriptStateDistribution().map((status, index) => (
                                                <div key={index} className="flex items-center gap-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800/70 p-1 rounded transition-colors">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }}></div>
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{status.name}</span>
                                                    <span className="text-gray-500 dark:text-gray-400 ml-auto">{status.value}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center py-2">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">No manuscript status data available</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity Section */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Recent Manuscripts</CardTitle>
                                        <CardDescription>Your most recent submissions</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30">
                                        View All
                                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {recentActivity.map((activity, index) => {
                                        const StatusIcon = activity.icon;
                                        return (
                                            <li key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                                                <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: STATE_COLORS[activity.status] + '20' }}>
                                                        <StatusIcon className="h-4 w-4" style={{ color: STATE_COLORS[activity.status] }} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                                                            {activity.description}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <Badge variant="outline" className={`px-1.5 py-0.5 text-xs ${getStatusBadge(activity.status)}`}>
                                                                {activity.status}
                                                            </Badge>
                                                            <span>•</span>
                                                            <span>ID: {activity.id}</span>
                                                            <span>•</span>
                                                            <span>{activity.time}</span>
                                                        </div>
                                                    </div>
                                                    <Link href={`/author/manuscripts/${activity.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="ml-auto whitespace-nowrap h-8 text-xs gap-1"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </CardContent>
                            <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50 py-3 flex justify-center">
                                <Button variant="outline" size="sm">
                                    Load More
                                    <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Manuscripts Tab Content */}
                    <TabsContent value="manuscripts" className="space-y-6 mt-2">
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">My Manuscripts</CardTitle>
                                        <CardDescription>All your manuscript submissions</CardDescription>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Link href="/author/manuscripts/create">
                                            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                                                <PenLine className="h-3.5 w-3.5 mr-1.5" />
                                                New Submission
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-xs uppercase text-gray-600 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left">Title</th>
                                                <th scope="col" className="px-6 py-3 text-left">Status</th>
                                                <th scope="col" className="px-6 py-3 text-left hidden md:table-cell">Date Submitted</th>
                                                <th scope="col" className="px-6 py-3 text-left hidden md:table-cell">Last Updated</th>
                                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {transformManuscripts.map((manuscript, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-[250px] truncate font-medium text-gray-900 dark:text-gray-100">
                                                            {manuscript.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {manuscript.journal || 'Unpublished Journal'} • ID: {manuscript.id}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className={`px-2 py-0.5 text-xs ${getStatusBadge(manuscript.status)}`}>
                                                            {manuscript.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                                            {manuscript.submissionDate ? manuscript.submissionDate.toLocaleDateString() : 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                                            {manuscript.lastUpdated.toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {manuscript.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link href={`/author/manuscripts/${manuscript.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 text-xs"
                                                                >
                                                                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                                    View Details
                                                                </Button>
                                                            </Link>

                                                            {manuscript.status === 'Revision Required' && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 text-xs bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200 hover:border-amber-300 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 dark:text-amber-500 dark:border-amber-800"
                                                                >
                                                                    <PenLine className="h-3.5 w-3.5 mr-1.5" />
                                                                    Revise
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {transformManuscripts.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-3">
                                                                <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                                            </div>
                                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No manuscripts found</h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                You haven't submitted any manuscripts yet
                                                            </p>
                                                            <Link href="/author/manuscripts/create">
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    className="mt-4 bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <PenLine className="h-3.5 w-3.5 mr-1.5" />
                                                                    Create New Submission
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>

                            {transformManuscripts.length > 0 && (
                                <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50 py-3 flex justify-between items-center">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Showing {transformManuscripts.length} manuscripts
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Load More
                                        <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </TabsContent>

                    {/* Activity Tab Content */}
                    <TabsContent value="activity" className="space-y-6 mt-2">
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Submission Timeline</CardTitle>
                                        <CardDescription>Recent activities on your manuscripts</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <Filter className="h-3.5 w-3.5 mr-1.5" />
                                            Filter
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative pl-8 py-1">
                                    {/* Timeline line */}
                                    <div className="absolute left-9 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>

                                    {/* Timeline items */}
                                    <ul className="space-y-4">
                                        {recentActivity.map((activity, index) => {
                                            const StatusIcon = activity.icon;
                                            return (
                                                <li key={index} className="relative pt-4 pb-2 pl-8 pr-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 rounded-r-lg">
                                                    {/* Timeline dot */}
                                                    <div className="absolute left-0 top-5 w-5 h-5 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: STATE_COLORS[activity.status] }}>
                                                        <StatusIcon className="h-3 w-3 text-white" />
                                                    </div>

                                                    {/* Content */}
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                                                <span>{activity.title}</span>
                                                                <Badge variant="outline" className={`ml-2 px-1.5 py-0.5 text-xs ${getStatusBadge(activity.status)}`}>
                                                                    {activity.status}
                                                                </Badge>
                                                            </h3>
                                                            <time className="text-xs text-gray-500 dark:text-gray-400">
                                                                {activity.time}
                                                            </time>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                            {activity.description}
                                                        </p>
                                                        <div className="mt-3 flex justify-end">
                                                            <Link href={`/author/manuscripts/${activity.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-7 text-xs"
                                                                >
                                                                    <Eye className="h-3 w-3 mr-1" />
                                                                    View Details
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}

                                        {recentActivity.length === 0 && (
                                            <li className="py-8 flex flex-col items-center justify-center">
                                                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-3">
                                                    <Clock className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No recent activity</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    When you submit or update manuscripts, activity will appear here
                                                </p>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </CardContent>

                            {recentActivity.length > 0 && (
                                <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50 py-3 flex justify-center">
                                    <Button variant="outline" size="sm">
                                        View Complete History
                                        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>

                        {/* Manuscript Metrics Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                                <CardTitle className="text-lg font-semibold">Submission Metrics</CardTitle>
                                <CardDescription>Performance metrics for your submissions</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Average Review Time */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                                            <span>Average Review Time</span>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                24 days
                                            </Badge>
                                        </h4>
                                        <Progress value={67} className="h-2 bg-gray-100 dark:bg-gray-700" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">67% faster than average</p>
                                    </div>

                                    {/* Acceptance Rate */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                                            <span>Acceptance Rate</span>
                                            <Badge variant="outline" className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                                {acceptanceRate}%
                                            </Badge>
                                        </h4>
                                        <Progress value={acceptanceRate} className="h-2 bg-gray-100 dark:bg-gray-700" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Based on {totalManuscripts} total submissions</p>
                                    </div>

                                    {/* Revision Rounds */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                                            <span>Average Revision Rounds</span>
                                            <Badge variant="outline" className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                                                1.8 rounds
                                            </Badge>
                                        </h4>
                                        <Progress value={60} className="h-2 bg-gray-100 dark:bg-gray-700" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">For accepted manuscripts only</p>
                                    </div>

                                    {/* Time to Publication */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                                            <span>Time to Publication</span>
                                            <Badge variant="outline" className="bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                                                45 days
                                            </Badge>
                                        </h4>
                                        <Progress value={75} className="h-2 bg-gray-100 dark:bg-gray-700" />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">From submission to publication</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
};

export default AuthorDashboard;

