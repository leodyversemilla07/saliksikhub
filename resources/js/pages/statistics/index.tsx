import { Head, Link, router } from '@inertiajs/react';
import {
    Eye,
    Download,
    Users,
    FileText,
    Globe,
    TrendingUp,
    Calendar,
    ArrowUpDown,
    DownloadCloud,
} from 'lucide-react';
import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from 'recharts';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { PageProps } from '@/types';

interface OverviewData {
    totalInvestigations: number;
    totalRequests: number;
    uniqueVisitors: number;
    avgPerArticle: number;
    totalPublished: number;
}

interface MonthlyTrend {
    month: string;
    investigations: number;
    requests: number;
}

interface TopManuscript {
    manuscript_id: number;
    title: string;
    author: string;
    count: number;
}

interface GeoStat {
    country: string;
    count: number;
}

interface AnalyticsProps extends PageProps {
    overview: OverviewData;
    monthlyTrends: MonthlyTrend[];
    topInvestigations: TopManuscript[];
    topRequests: TopManuscript[];
    geoStats: GeoStat[];
    periodType: string;
    startDate: string;
    endDate: string;
}

const countryNames: Record<string, string> = {
    US: 'United States',
    GB: 'United Kingdom',
    CA: 'Canada',
    AU: 'Australia',
    DE: 'Germany',
    FR: 'France',
    JP: 'Japan',
    CN: 'China',
    IN: 'India',
    BR: 'Brazil',
    NL: 'Netherlands',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    FI: 'Finland',
    IT: 'Italy',
    ES: 'Spain',
    KR: 'South Korea',
    SG: 'Singapore',
    HK: 'Hong Kong',
};

const countryColors: Record<string, string> = {
    US: '#3B82F6',
    GB: '#EF4444',
    CA: '#F59E0B',
    AU: '#10B981',
    DE: '#8B5CF6',
    FR: '#EC4899',
    JP: '#06B6D4',
    CN: '#F97316',
    IN: '#6366F1',
    BR: '#14B8A6',
};

export default function AnalyticsIndex({
    overview,
    monthlyTrends,
    topInvestigations,
    topRequests,
    geoStats,
    periodType,
    startDate,
    endDate,
}: AnalyticsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState(periodType);

    function updatePeriod(period: string) {
        setSelectedPeriod(period);
        router.visit(`/statistics?period=${period}`, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <AppLayout
            breadcrumbItems={[
                { label: 'Dashboard', href: dashboard.url() },
                { label: 'Analytics' },
            ]}
        >
            <Head title="Analytics Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            Analytics Dashboard
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Usage statistics and performance metrics for your
                            journal
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select
                            value={selectedPeriod}
                            onValueChange={updatePeriod}
                        >
                            <SelectTrigger className="w-[140px]">
                                <Calendar className="mr-2 h-4 w-4" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                router.visit('/statistics/counter-report', {
                                    method: 'post',
                                    data: {
                                        report_type: 'TR_J1',
                                        start_date: startDate,
                                        end_date: endDate,
                                    },
                                })
                            }
                        >
                            <DownloadCloud className="mr-1.5 h-4 w-4" />
                            COUNTER Report
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                                <Eye className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {overview.totalInvestigations.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Abstract Views
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                                <Download className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {overview.totalRequests.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Full-text Downloads
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {overview.uniqueVisitors.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Unique Visitors
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                                <FileText className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {overview.avgPerArticle}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Avg. per Article
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Monthly Usage Trends
                        </CardTitle>
                        <CardDescription>
                            Abstract views and full-text downloads over the last
                            12 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyTrends}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        className="text-xs text-muted-foreground"
                                        tick={{ fontSize: 11 }}
                                    />
                                    <YAxis className="text-xs text-muted-foreground" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: '1px solid hsl(var(--border))',
                                            background: 'hsl(var(--card))',
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="investigations"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        name="Abstract Views"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="requests"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        name="Downloads"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Two-column: Top View & Top Downloads */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Top Investigated */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Eye className="h-5 w-5 text-blue-600" />
                                Most Viewed Articles
                            </CardTitle>
                            <CardDescription>
                                Top 10 manuscripts by abstract views
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topInvestigations.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-8">
                                                #
                                            </TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Author</TableHead>
                                            <TableHead className="text-right">
                                                Views
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topInvestigations.map(
                                            (item, index) => (
                                                <TableRow
                                                    key={item.manuscript_id}
                                                >
                                                    <TableCell className="text-muted-foreground">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate font-medium">
                                                        <Link
                                                            href={`/editor/manuscripts/${item.manuscript_id}`}
                                                            className="hover:text-primary hover:underline"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {item.author}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        {item.count.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No view data available for this period.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Requested */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Download className="h-5 w-5 text-emerald-600" />
                                Most Downloaded Articles
                            </CardTitle>
                            <CardDescription>
                                Top 10 manuscripts by full-text downloads
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topRequests.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-8">
                                                #
                                            </TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Author</TableHead>
                                            <TableHead className="text-right">
                                                Downloads
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topRequests.map((item, index) => (
                                            <TableRow key={item.manuscript_id}>
                                                <TableCell className="text-muted-foreground">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate font-medium">
                                                    <Link
                                                        href={`/editor/manuscripts/${item.manuscript_id}`}
                                                        className="hover:text-primary hover:underline"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {item.author}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {item.count.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No download data available for this period.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Geographic Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Globe className="h-5 w-5 text-primary" />
                            Geographic Distribution
                        </CardTitle>
                        <CardDescription>
                            Top countries by total usage
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {geoStats.length > 0 ? (
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Bar chart */}
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={geoStats.map((g) => ({
                                                ...g,
                                                country:
                                                    countryNames[g.country] ??
                                                    g.country,
                                                fill:
                                                    countryColors[g.country] ??
                                                    '#6B7280',
                                            }))}
                                            layout="vertical"
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="stroke-border"
                                            />
                                            <XAxis
                                                type="number"
                                                className="text-xs text-muted-foreground"
                                            />
                                            <YAxis
                                                dataKey="country"
                                                type="category"
                                                width={120}
                                                className="text-xs text-muted-foreground"
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: '1px solid hsl(var(--border))',
                                                    background:
                                                        'hsl(var(--card))',
                                                }}
                                            />
                                            <Bar
                                                dataKey="count"
                                                radius={[0, 4, 4, 0]}
                                            >
                                                {geoStats.map((g) => (
                                                    <Cell
                                                        key={g.country}
                                                        fill={
                                                            countryColors[
                                                                g.country
                                                            ] ?? '#6B7280'
                                                        }
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Table */}
                                <div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Country</TableHead>
                                                <TableHead className="text-right">
                                                    Usage
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Share
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {geoStats.map((g) => {
                                                const total = geoStats.reduce(
                                                    (s, x) => s + x.count,
                                                    0,
                                                );

                                                return (
                                                    <TableRow key={g.country}>
                                                        <TableCell className="flex items-center gap-2 font-medium">
                                                            <span
                                                                className="inline-block h-3 w-3 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        countryColors[
                                                                            g
                                                                                .country
                                                                        ] ??
                                                                        '#6B7280',
                                                                }}
                                                            />
                                                            {countryNames[
                                                                g.country
                                                            ] ?? g.country}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {g.count.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground">
                                                            {total > 0
                                                                ? `${((g.count / total) * 100).toFixed(1)}%`
                                                                : '0%'}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No geographic data available yet. This
                                information is collected when viewers access
                                your manuscripts.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Views vs Downloads comparison chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ArrowUpDown className="h-5 w-5 text-primary" />
                            Views vs. Downloads Comparison
                        </CardTitle>
                        <CardDescription>
                            Monthly comparison of abstract views and full-text
                            downloads
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyTrends}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        className="text-xs text-muted-foreground"
                                        tick={{ fontSize: 11 }}
                                    />
                                    <YAxis className="text-xs text-muted-foreground" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: '1px solid hsl(var(--border))',
                                            background: 'hsl(var(--card))',
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="investigations"
                                        fill="#3B82F6"
                                        radius={[4, 4, 0, 0]}
                                        name="Abstract Views"
                                    />
                                    <Bar
                                        dataKey="requests"
                                        fill="#10B981"
                                        radius={[4, 4, 0, 0]}
                                        name="Downloads"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
