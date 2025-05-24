import React, { useState } from 'react';
import { Head, Link, usePage, router as inertiaRouter } from '@inertiajs/react'; // Import router as inertiaRouter
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

import {
    Book, FileText, CheckCircle, Clock, AlertCircle, TrendingUp, TrendingDown,
    Calendar, ChevronDown, Filter, Download, ArrowRight,
    PenLine, XCircle, Eye, BarChart3, Search, Edit3, Edit, Scissors, UserCheck, Send
} from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { cn } from "@/lib/utils";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { User } from '@/types';

// Enhanced TypeScript interfaces
type ManuscriptStatus =
    | 'Submitted'
    | 'Under Review'
    | 'Minor Revision'
    | 'Major Revision'
    | 'Revision Required'
    | 'Accepted'
    | 'Copyediting'
    | 'Awaiting Approval'
    | 'Ready to Publish'
    | 'Rejected'
    | 'Published';

interface Manuscript {
    id: number;
    title: string;
    status: ManuscriptStatus;
    created_at: string | null; // API returns date as string
    updated_at: string;
    category?: string;
    journal?: string;
    co_authors?: string[];
}

interface TransformedManuscript extends Manuscript {
    submissionDate: Date | null;
    lastUpdated: Date;
}

interface ChartDataPoint {
    month: string;
    submissions: number;
    accepted: number;
    rejected: number;
}

interface ActivityItem {
    id: number;
    title: string;
    status: ManuscriptStatus;
    time: string;
    description: string;
    icon: React.ElementType;
    lastUpdated: Date;
}

interface DashboardMetric {
    title: string;
    value: number | string;
    trend: {
        direction: 'up' | 'down';
        value: string;
    };
    description: string;
    icon: React.ElementType;
    color: string;
}

interface StatusDistribution {
    name: string;
    value: number;
    color: string;
}

// Visual style constants
const STATUS_COLORS: Record<ManuscriptStatus, string> = {
    Submitted: '#3B82F6',
    'Under Review': '#A855F7',
    'Minor Revision': '#F59E0B',
    'Major Revision': '#EAB308',
    'Revision Required': '#F97316',
    Accepted: '#10B981',
    Copyediting: '#06B6D4',
    'Awaiting Approval': '#6366F1',
    'Ready to Publish': '#EC4899',
    Rejected: '#EF4444',
    Published: '#8B5CF6'
};

const STATUS_ICONS: Record<ManuscriptStatus, React.ElementType> = {
    Submitted: FileText,
    'Under Review': Search,
    'Minor Revision': Edit3,
    'Major Revision': Edit,
    'Revision Required': AlertCircle,
    Accepted: CheckCircle,
    Copyediting: Scissors,
    'Awaiting Approval': UserCheck,
    'Ready to Publish': Send,
    Rejected: XCircle,
    Published: Book
};

function getStatusBadgeStyle(status: ManuscriptStatus): string {
    const styles: Partial<Record<ManuscriptStatus, string>> = {
        'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        'Revision Required': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        'Accepted': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
        'Published': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
        'Under Review': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        'Minor Revision': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        'Major Revision': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
        'Copyediting': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
        'Awaiting Approval': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
        'Ready to Publish': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800',
    };

    return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
}

// UI Components
import { TooltipProps } from 'recharts';

// Define entry type for better type safety
interface TooltipEntry {
    name?: string;
    value?: number | string;
    color?: string;
    fill?: string;
    [key: string]: number | string | undefined;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) { // Simplified conditional
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{label}</p>
            {payload.map((entry, index) => {
                const typedEntry = entry as unknown as TooltipEntry;
                return (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typedEntry.color || typedEntry.fill || '#ccc' }}></div>
                        <span className="text-gray-600 dark:text-gray-300">{typedEntry.name ?? ''}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            {typeof typedEntry.value === 'number' ? typedEntry.value.toLocaleString() : typedEntry.value}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// Theme-aware utilities
function getChartGridColor(): string {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return isDarkMode ? "#374151" : "#e5e7eb";
}

function getAxisColor(): string {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return isDarkMode ? "#9ca3af" : "#6b7280";
}

// Main Dashboard Component
export default function AuthorDashboard(): React.ReactElement {
    const { props } = usePage<{ 
        manuscripts: Manuscript[], 
        auth: { user: User, role: string },
        monthlySubmissionData: ChartDataPoint[], // Add this
        currentTimeFilter: string // Add this
    }>();
    const { manuscripts, monthlySubmissionData: initialMonthlySubmissionData, currentTimeFilter: initialTimeFilter } = props;
    const [activeView, setActiveView] = useState('overview');
    // Use the currentTimeFilter from props to initialize, and allow frontend to change it
    const [timeFilter, setTimeFilter] = useState(initialTimeFilter || '6months');
    const [currentMonthlyData, setCurrentMonthlyData] = useState(initialMonthlySubmissionData || []);

    const transformedManuscripts: TransformedManuscript[] = manuscripts.map(manuscript => ({
        ...manuscript,
        submissionDate: manuscript.created_at ? new Date(manuscript.created_at) : null,
        lastUpdated: new Date(manuscript.updated_at)
    }));

    // Manuscript status counts
    const totalManuscripts = transformedManuscripts.length;
    const acceptedCount = transformedManuscripts.filter(m => ['Accepted', 'Published', 'Ready to Publish'].includes(m.status)).length;
    const inProgressCount = transformedManuscripts.filter(m => ['Submitted', 'Revision Required', 'Under Review', 'Minor Revision', 'Major Revision', 'Copyediting', 'Awaiting Approval'].includes(m.status)).length;
    const acceptanceRate = totalManuscripts > 0 ? Math.round((acceptedCount / totalManuscripts) * 100) : 0;

    // Dashboard metrics
    const dashboardMetrics: DashboardMetric[] = [
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

    // Chart data preparation
    const statusDistribution: StatusDistribution[] = Object.keys(STATUS_COLORS)
        .map(status => {
            const statusKey = status as ManuscriptStatus;
            // Filter based on the currently displayed manuscripts (which are already time-filtered by backend)
            const count = transformedManuscripts.filter(m => m.status === statusKey).length;
            return {
                name: status,
                value: count || 0,
                color: STATUS_COLORS[statusKey]
            };
        })
        .filter(item => item.value > 0);

    // Activity feed data
    const recentActivity: ActivityItem[] = transformedManuscripts
        .slice(0, 5)
        .map(manuscript => ({
            ...manuscript,
            id: manuscript.id,
            title: manuscript.title,
            status: manuscript.status,
            time: manuscript.lastUpdated.toLocaleDateString(),
            description: `${manuscript.journal || 'Journal'} · ${manuscript.category || 'Research'}`,
            icon: STATUS_ICONS[manuscript.status] || FileText,
            lastUpdated: manuscript.lastUpdated
        }))
        .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

    // Add useEffect to update chart data when props change (e.g., due to timeFilter)
    React.useEffect(() => {
        setCurrentMonthlyData(initialMonthlySubmissionData || []);
    }, [initialMonthlySubmissionData]);

    // Dashboard sections
    const renderMetricsCards = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardMetrics.map((metric, index) => (
                <Card key={index} className="group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/20 dark:to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={cn(
                                        "p-2.5 rounded-xl bg-gradient-to-br shadow-lg transform group-hover:scale-110 transition-transform duration-300",
                                        metric.color,
                                        "text-white"
                                    )}>
                                        <metric.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wide">{metric.title}</p>
                                        <span className={cn(
                                            "inline-flex items-center text-xs px-2 py-1 rounded-full font-medium bg-gradient-to-r shadow-sm",
                                            metric.trend.direction === 'up'
                                                ? "from-emerald-100 to-green-100 text-emerald-700 dark:from-emerald-900/40 dark:to-green-900/40 dark:text-emerald-300"
                                                : "from-red-100 to-pink-100 text-red-700 dark:from-red-900/40 dark:to-pink-900/40 dark:text-red-300"
                                        )}>
                                            {metric.trend.direction === 'up' ? (
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 mr-1" />
                                            )}
                                            {metric.trend.value}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                                    {metric.value}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Card>
            ))}
        </div>
    );

    const renderOverviewTab = () => (
        <TabsContent value="overview" className="space-y-6 mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Submissions Analysis Chart */}
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

                            {/* Area Chart */}
                            <TabsContent value="area" className="mt-0">
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={currentMonthlyData} // Use currentMonthlyData
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

                            {/* Line Chart */}
                            <TabsContent value="line" className="mt-0">
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={currentMonthlyData} // Use currentMonthlyData
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

                            {/* Bar Chart */}
                            <TabsContent value="bar" className="mt-0">
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={currentMonthlyData} // Use currentMonthlyData
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

                {/* Status Distribution */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                        <CardTitle className="text-lg font-semibold">Manuscript Status</CardTitle>
                        <CardDescription>Distribution of your manuscripts</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 pb-4">
                        <div className="h-[300px] w-full">
                            {statusDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                        <Pie
                                            data={statusDistribution}
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
                                            {statusDistribution.map((entry, index) => (
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
                            {statusDistribution.length > 0 ? (
                                statusDistribution.map((status, index) => (
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
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: STATUS_COLORS[activity.status] + '20' }}>
                                            <StatusIcon className="h-4 w-4" style={{ color: STATUS_COLORS[activity.status] }} />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                                                {activity.description}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Badge variant="outline" className={`px-1.5 py-0.5 text-xs ${getStatusBadgeStyle(activity.status)}`}>
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
    );

    const renderManuscriptsTab = () => (
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
                                {transformedManuscripts.map((manuscript, index) => (
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
                                            <Badge variant="outline" className={`px-2 py-0.5 text-xs ${getStatusBadgeStyle(manuscript.status)}`}>
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

                                {transformedManuscripts.length === 0 && (
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

                {transformedManuscripts.length > 0 && (
                    <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50 py-3 flex justify-between items-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Showing {transformedManuscripts.length} manuscripts
                        </div>
                        <Button variant="outline" size="sm">
                            Load More
                            <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </TabsContent>
    );

    const renderActivityTab = () => (
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
                                        <div className="absolute left-0 top-5 w-5 h-5 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: STATUS_COLORS[activity.status] }}>
                                            <StatusIcon className="h-3 w-3 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                                    <span>{activity.title}</span>
                                                    <Badge variant="outline" className={`ml-2 px-1.5 py-0.5 text-xs ${getStatusBadgeStyle(activity.status)}`}>
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
    );

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('author.dashboard'),
        }
    ];

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Overview */}
                {renderMetricsCards()}

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
                                    <DropdownMenuItem onClick={() => {
                                        setTimeFilter('30days');
                                        inertiaRouter.get(route('author.dashboard'), { timeFilter: '30days' }, { preserveState: true, preserveScroll: true });
                                    }}>Last 30 Days</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        setTimeFilter('6months');
                                        inertiaRouter.get(route('author.dashboard'), { timeFilter: '6months' }, { preserveState: true, preserveScroll: true });
                                    }}>Last 6 Months</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        setTimeFilter('1year');
                                        inertiaRouter.get(route('author.dashboard'), { timeFilter: '1year' }, { preserveState: true, preserveScroll: true });
                                    }}>Last Year</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="outline" size="sm" className="h-8">
                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Tab Contents */}
                    {renderOverviewTab()}
                    {renderManuscriptsTab()}
                    {renderActivityTab()}
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
};
