import { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import {
    CheckCircle, FileText, TrendingUp, TrendingDown,
    Download, ArrowRight, UserCheck
} from 'lucide-react';

import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

// TypeScript interface definitions
interface Metric {
    title: string;
    value: string;
    trend: 'up' | 'down';
    percentage: string;
    description: string;
    color: string;
}

interface ChartDataPoint {
    name: string;
    value: number;
    color: string;
}

interface MonthlySubmission {
    month: string;
    submissions: number;
    published: number;
    rejected: number;
}

interface RecentSubmission {
    id: number;
    title: string;
    author: string;
    status: string;
    submitted_date: string;
    days_since_submission: number;
}

interface Alert {
    type: 'warning' | 'info' | 'success';
    title: string;
    message: string;
    count?: number;
    action: string;
}

interface DashboardData {
    metrics: Metric[];
    monthlySubmissions: MonthlySubmission[];
    statusDistribution: ChartDataPoint[];
    revisionRounds: ChartDataPoint[];
    recentSubmissions: RecentSubmission[];
    alerts: Alert[];
    stats: {
        total_manuscripts: number;
        pending_reviews: number;
        pending_decisions: number;
    };
}

interface EditorDashboardProps {
    dashboardData: DashboardData;
}

export default function EditorDashboard({ dashboardData }: EditorDashboardProps) {
    const [activeTab, setActiveTab] = useState("area");

    // Handle tab change
    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value);
    }, []);

    // Custom tooltip for charts
    const CustomTooltip = ({
        active,
        payload,
        label
    }: {
        active?: boolean;
        payload?: Array<{
            name?: string;
            value?: number;
            color?: string;
            dataKey?: string;
            fill?: string;
            stroke?: string;
        }>;
        label?: string;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-popover p-3 border rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-popover-foreground mb-1">{label}</p>
                    {payload.map((entry, index: number) => (
                        <div key={`tooltip-item-${index}`} className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill || entry.stroke || '#888' }}></div>
                            <span className="text-muted-foreground">{entry.name || entry.dataKey || 'Value'}:</span>
                            <span className="font-medium text-popover-foreground">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('editor.dashboard'),
        }
    ];

    // Use backend data for charts
    const currentYear = new Date().getFullYear();
    const allZero = dashboardData.monthlySubmissions.every(
        m => m.submissions === 0 && m.published === 0 && m.rejected === 0
    );

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Editor Dashboard" />

            <div className="space-y-6">
                {/* Stats Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {dashboardData.metrics.map((metric, index) => {
                        const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                            'New Submissions': FileText,
                            'Published Articles': CheckCircle,
                            'Active Reviewers': UserCheck,
                            'Total Users': UserCheck,
                        };
                        const Icon = iconMap[metric.title] || FileText;

                        return (
                            <Card key={`metric-${index}`} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</p>
                                            <h3 className="text-2xl sm:text-3xl font-bold text-foreground flex items-baseline gap-2">
                                                {metric.value}
                                                <span className={cn(
                                                    "flex items-center text-xs px-1.5 py-0.5 rounded-full font-medium",
                                                    metric.trend === 'up'
                                                        ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40"
                                                        : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40"
                                                )}>
                                                    {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                                                    {metric.percentage}
                                                </span>
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-lg bg-gradient-to-br",
                                            metric.color,
                                            "text-white shadow-sm"
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Submission Trends */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                        <CardTitle className="text-base font-medium">Submission Trends <span className="text-muted-foreground text-xs font-normal">({currentYear})</span></CardTitle>
                        <Button variant="outline" className="w-full sm:w-auto text-xs h-8">
                            <Download className="h-3 w-3 mr-1.5" />
                            Export Data
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-6 h-[350px]">
                            <Tabs
                                value={activeTab}
                                onValueChange={handleTabChange}
                                className="h-full"
                            >
                                <div className="flex justify-end mb-4">
                                    <TabsList className="h-8 p-0.5">
                                        <TabsTrigger value="area" className="text-xs px-2 h-7">Area</TabsTrigger>
                                        <TabsTrigger value="bar" className="text-xs px-2 h-7">Bar</TabsTrigger>
                                        <TabsTrigger value="line" className="text-xs px-2 h-7">Line</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="area" className="h-[90%] mt-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={dashboardData.monthlySubmissions}
                                            margin={{ top: 30, right: 30, left: 0, bottom: 30 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorPublished" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                label={{ value: 'Month', position: 'insideBottom', offset: -10, fontSize: 13 }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${value}`}
                                                label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 10, fontSize: 13 }}
                                            />
                                            <RechartsTooltip
                                                cursor={{ stroke: '#d1d5db', strokeDasharray: '3 3' }}
                                                content={<CustomTooltip />}
                                            />
                                            <Legend
                                                verticalAlign="top"
                                                height={36}
                                                formatter={(value) => <span className="text-xs">{value}</span>}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="submissions"
                                                stroke="#3B82F6"
                                                fill="url(#colorSubmissions)"
                                                activeDot={{ r: 6 }}
                                                name="Submissions"
                                                color="#3B82F6"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="published"
                                                stroke="#10B981"
                                                fill="url(#colorPublished)"
                                                activeDot={{ r: 6 }}
                                                name="Published"
                                                color="#10B981"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                    {allZero && (
                                        <div className="text-center text-muted-foreground text-xs mt-2">No submissions for this year.</div>
                                    )}
                                </TabsContent>

                                <TabsContent value="bar" className="h-[90%] mt-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={dashboardData.monthlySubmissions}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${value}`}
                                            />
                                            <RechartsTooltip
                                                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                                                content={<CustomTooltip />}
                                            />
                                            <Legend
                                                verticalAlign="top"
                                                height={36}
                                                formatter={(value) => <span className="text-xs">{value}</span>}
                                            />
                                            <Bar
                                                dataKey="submissions"
                                                fill="#3B82F6"
                                                radius={[4, 4, 0, 0]}
                                                name="Submissions"
                                                color="#3B82F6"
                                            />
                                            <Bar
                                                dataKey="published"
                                                fill="#10B981"
                                                radius={[4, 4, 0, 0]}
                                                name="Published"
                                                color="#10B981"
                                            />
                                            <Bar
                                                dataKey="rejected"
                                                fill="#EF4444"
                                                radius={[4, 4, 0, 0]}
                                                name="Rejected"
                                                color="#EF4444"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </TabsContent>

                                <TabsContent value="line" className="h-[90%] mt-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={dashboardData.monthlySubmissions}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${value}`}
                                            />
                                            <RechartsTooltip
                                                cursor={{ stroke: '#d1d5db', strokeDasharray: '3 3' }}
                                                content={<CustomTooltip />}
                                            />
                                            <Legend
                                                verticalAlign="top"
                                                height={36}
                                                formatter={(value) => <span className="text-xs">{value}</span>}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="submissions"
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                dot={{ r: 4, strokeWidth: 1 }}
                                                activeDot={{ r: 6 }}
                                                name="Submissions"
                                                color="#3B82F6"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="published"
                                                stroke="#10B981"
                                                strokeWidth={2}
                                                dot={{ r: 4, strokeWidth: 1 }}
                                                activeDot={{ r: 6 }}
                                                name="Published"
                                                color="#10B981"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="rejected"
                                                stroke="#EF4444"
                                                strokeWidth={2}
                                                dot={{ r: 4, strokeWidth: 1 }}
                                                activeDot={{ r: 6 }}
                                                name="Rejected"
                                                color="#EF4444"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>

                {/* Review Status */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                        <CardTitle className="text-base font-medium">Manuscript Status</CardTitle>
                        <div className="flex flex-row items-center gap-4">
                            <Select>
                                <SelectTrigger className="w-[150px] h-9 text-xs px-3 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" size="sm">
                                    <SelectValue placeholder="Current" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem value="current">Current Status</SelectItem>
                                    <SelectItem value="30days">Last 30 Days</SelectItem>
                                    <SelectItem value="quarter">Last Quarter</SelectItem>
                                    <SelectItem value="year">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="text-xs h-9 px-4 py-2 ml-2">
                                <Download className="h-3 w-3 mr-1.5" />
                                Export Data
                            </Button>
                            <Button variant="ghost" className="h-9 text-xs ml-2">View All Analytics</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                            {/* Distribution Pie Charts */}
                            <div className="p-6 h-[350px] border-r border-border">
                                <h4 className="text-sm text-center font-medium mb-4">Submission Status</h4>
                                <ResponsiveContainer width="100%" height="80%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.statusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            nameKey="name"
                                        >
                                            {dashboardData.statusDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend
                                            verticalAlign="bottom"
                                            formatter={(value) => <span className="text-xs">{value}</span>}
                                            iconType="circle"
                                            iconSize={8}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="p-6 h-[350px]">
                                <h4 className="text-sm text-center font-medium mb-4">Revision Rounds</h4>
                                <ResponsiveContainer width="100%" height="80%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.revisionRounds}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            innerRadius={55}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            nameKey="name"
                                        >
                                            {dashboardData.revisionRounds.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend
                                            verticalAlign="bottom"
                                            formatter={(value) => <span className="text-xs">{value}</span>}
                                            iconType="circle"
                                            iconSize={8}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add vertical space between Manuscript Status and Recent Submissions */}
            <div className="h-8 sm:h-10 lg:h-12" />

            <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-row items-center justify-between pb-3 space-y-0">
                    <div className="text-base font-medium">Recent Submissions</div>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                        View All
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <div className="w-full rounded-lg border border-border shadow-sm bg-background overflow-hidden">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4 py-3 text-sm">ID</TableHead>
                                    <TableHead className="px-4 py-3 text-sm">Manuscript</TableHead>
                                    <TableHead className="px-4 py-3 text-sm">Status</TableHead>
                                    <TableHead className="hidden md:table-cell px-4 py-3 text-sm">Author</TableHead>
                                    <TableHead className="hidden md:table-cell px-4 py-3 text-sm">Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-card divide-y divide-border">
                                {dashboardData.recentSubmissions.length > 0 ? (
                                    dashboardData.recentSubmissions.map((submission, idx, arr) => (
                                        <TableRow
                                            key={`submission-${submission.id}`}
                                            className={
                                                `hover:bg-muted/40 transition-all ${idx === 0 ? 'first:rounded-t-lg' : ''} ${idx === arr.length - 1 ? 'last:rounded-b-lg' : ''}`
                                            }
                                        >
                                            <TableCell className="px-4 py-3 align-middle">{submission.id}</TableCell>
                                            <TableCell className="px-4 py-3 align-middle">{submission.title}</TableCell>
                                            <TableCell className="px-4 py-3 align-middle">
                                                <Badge>{submission.status}</Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 align-middle">{submission.author}</TableCell>
                                            <TableCell className="px-4 py-3 align-middle">{submission.submitted_date}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow className="rounded-lg">
                                        <TableCell colSpan={6} className="px-8 py-16 text-center text-sm text-muted-foreground rounded-lg">
                                            No recent submissions
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
