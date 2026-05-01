import { Head } from '@inertiajs/react';
import {
    CheckCircle,
    FileText,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    UserCheck,
} from 'lucide-react';
import * as React from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    CartesianGrid,
    LabelList,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import type {
    ChartConfig} from '@/components/ui/chart';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import editor from '@/routes/editor';

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

const chartConfig = {
    submissions: {
        label: 'Submissions',
        color: 'var(--chart-1)',
    },
    published: {
        label: 'Published',
        color: 'var(--chart-2)',
    },
    rejected: {
        label: 'Rejected',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

export default function EditorDashboard({
    dashboardData,
}: EditorDashboardProps) {
    // Separate state for area, bar, and line chart selection
    const [areaChartRange, setAreaChartRange] = React.useState('12m');
    const [barChartRange, setBarChartRange] = React.useState('submissions');
    const [lineChartRange, setLineChartRange] = React.useState('submissions');

    // Filter monthlySubmissions for AreaChart based on areaChartRange
    const getFilteredMonthlySubmissions = () => {
        const data = dashboardData.monthlySubmissions;

        if (areaChartRange === '12m') {
            return data.slice(-12);
        } else if (areaChartRange === '6m') {
            return data.slice(-6);
        } else if (areaChartRange === '3m') {
            return data.slice(-3);
        }

        return data;
    };
    const filteredMonthlySubmissions = getFilteredMonthlySubmissions();

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: editor.dashboard.url(),
        },
    ];

    // Use backend data for charts
    const currentYear = new Date().getFullYear();
    const allZero = dashboardData.monthlySubmissions.every(
        (m) => m.submissions === 0 && m.published === 0 && m.rejected === 0,
    );

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Editor Dashboard" />

            <div className="space-y-6">
                {/* Stats Overview Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {dashboardData.metrics.map((metric, index) => {
                        const iconMap: Record<
                            string,
                            React.ComponentType<{ className?: string }>
                        > = {
                            'New Submissions': FileText,
                            'Published Articles': CheckCircle,
                            'Active Reviewers': UserCheck,
                            'Total Users': UserCheck,
                        };
                        const Icon = iconMap[metric.title] || FileText;

                        return (
                            <Card
                                key={`metric-${index}`}
                                className="overflow-hidden border-border/50 bg-card transition-colors hover:border-primary/20"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="mb-2 font-sans text-xs tracking-wide text-muted-foreground uppercase">
                                                {metric.title}
                                            </p>
                                            <h3 className="flex items-baseline gap-2 font-serif text-3xl font-bold text-foreground">
                                                {metric.value}
                                                <span
                                                    className={cn(
                                                        'flex items-center px-2 py-0.5 font-sans text-xs font-medium',
                                                        metric.trend === 'up'
                                                            ? 'bg-[oklch(0.45_0.10_145)]/10 text-[oklch(0.45_0.10_145)]'
                                                            : 'bg-[oklch(0.50_0.20_25)]/10 text-[oklch(0.50_0.20_25)]',
                                                    )}
                                                >
                                                    {metric.trend === 'up' ? (
                                                        <TrendingUp className="mr-0.5 h-3 w-3" />
                                                    ) : (
                                                        <TrendingDown className="mr-0.5 h-3 w-3" />
                                                    )}
                                                    {metric.percentage}
                                                </span>
                                            </h3>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {metric.description}
                                            </p>
                                        </div>
                                        <div
                                            className={cn(
                                                'rounded-lg bg-linear-to-br p-3',
                                                metric.color,
                                                'text-white shadow-sm',
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Submission Trends */}
                <Card className="pt-0">
                    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                        <div className="grid flex-1 gap-1">
                            <CardTitle>
                                Submission Trends - Interactive
                            </CardTitle>
                            <CardDescription>
                                Showing manuscript submissions and publications
                                for the year {currentYear}
                            </CardDescription>
                        </div>
                        <Select
                            value={areaChartRange}
                            onValueChange={setAreaChartRange}
                        >
                            <SelectTrigger
                                className="w-40 rounded-lg sm:ml-auto"
                                aria-label="Select a value"
                            >
                                <SelectValue placeholder="Last 12 months" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="12m" className="rounded-lg">
                                    Last 12 months
                                </SelectItem>
                                <SelectItem value="6m" className="rounded-lg">
                                    Last 6 months
                                </SelectItem>
                                <SelectItem value="3m" className="rounded-lg">
                                    Last 3 months
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-[250px] w-full"
                        >
                            <AreaChart data={filteredMonthlySubmissions}>
                                <defs>
                                    <linearGradient
                                        id="fillSubmissions"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-submissions)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-submissions)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="fillPublished"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-published)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-published)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={(value) => {
                                        return value.substring(0, 3);
                                    }}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(value) => {
                                                return value;
                                            }}
                                            indicator="dot"
                                        />
                                    }
                                />
                                <Area
                                    dataKey="published"
                                    type="natural"
                                    fill="url(#fillPublished)"
                                    stroke="var(--color-published)"
                                    stackId="a"
                                />
                                <Area
                                    dataKey="submissions"
                                    type="natural"
                                    fill="url(#fillSubmissions)"
                                    stroke="var(--color-submissions)"
                                    stackId="a"
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                            </AreaChart>
                        </ChartContainer>
                        {allZero && (
                            <div className="mt-2 text-center text-xs text-muted-foreground">
                                No submissions for this year.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
                            <CardTitle>Bar Chart - Interactive</CardTitle>
                            <CardDescription>
                                Showing total submissions for the last 12 months
                            </CardDescription>
                        </div>
                        <div className="flex">
                            {['submissions', 'published', 'rejected'].map(
                                (key) => {
                                    const chart =
                                        key as keyof typeof chartConfig;
                                    const total =
                                        dashboardData.monthlySubmissions.reduce(
                                            (acc, curr) =>
                                                acc + (curr[chart] as number),
                                            0,
                                        );

                                    return (
                                        <button
                                            key={chart}
                                            data-active={
                                                barChartRange === chart
                                            }
                                            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                            onClick={() =>
                                                setBarChartRange(chart)
                                            }
                                        >
                                            <span className="text-xs text-muted-foreground">
                                                {chartConfig[chart].label}
                                            </span>
                                            <span className="text-lg leading-none font-bold sm:text-3xl">
                                                {total.toLocaleString()}
                                            </span>
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 sm:p-6">
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-[250px] w-full"
                        >
                            <BarChart
                                data={dashboardData.monthlySubmissions}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={(value) =>
                                        value.substring(0, 3)
                                    }
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            className="w-[150px]"
                                            nameKey={barChartRange}
                                            labelFormatter={(value) => value}
                                        />
                                    }
                                />
                                <Bar
                                    dataKey={barChartRange}
                                    fill={`var(--color-${barChartRange})`}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="py-4 sm:py-0">
                    <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
                            <CardTitle>Line Chart - Interactive</CardTitle>
                            <CardDescription>
                                Showing total submissions for the last 12 months
                            </CardDescription>
                        </div>
                        <div className="flex">
                            {['submissions', 'published', 'rejected'].map(
                                (key) => {
                                    const chart =
                                        key as keyof typeof chartConfig;
                                    const total =
                                        dashboardData.monthlySubmissions.reduce(
                                            (acc, curr) =>
                                                acc + (curr[chart] as number),
                                            0,
                                        );

                                    return (
                                        <button
                                            key={chart}
                                            data-active={
                                                lineChartRange === chart
                                            }
                                            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                            onClick={() =>
                                                setLineChartRange(chart)
                                            }
                                        >
                                            <span className="text-xs text-muted-foreground">
                                                {chartConfig[chart].label}
                                            </span>
                                            <span className="text-lg leading-none font-bold sm:text-3xl">
                                                {total.toLocaleString()}
                                            </span>
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 sm:p-6">
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-[250px] w-full"
                        >
                            <LineChart
                                data={dashboardData.monthlySubmissions}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={(value) =>
                                        value.substring(0, 3)
                                    }
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            className="w-[150px]"
                                            nameKey={lineChartRange}
                                            labelFormatter={(value) => value}
                                        />
                                    }
                                />
                                <Line
                                    dataKey={lineChartRange}
                                    type="monotone"
                                    stroke={`var(--color-${lineChartRange})`}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Review Status */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Submission Status Pie Chart Card */}
                    <Card className="flex flex-col overflow-hidden">
                        <CardHeader className="items-center pb-0">
                            <CardTitle>Submission Status</CardTitle>
                            <CardDescription>
                                Current Distribution
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0">
                            <ChartContainer
                                config={{
                                    ...dashboardData.statusDistribution.reduce(
                                        (acc, cur) => {
                                            acc[cur.name] = {
                                                label: cur.name,
                                                color: cur.color,
                                            };

                                            return acc;
                                        },
                                        {} as ChartConfig,
                                    ),
                                    value: { label: 'Submissions' },
                                }}
                                className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                nameKey="value"
                                                hideLabel
                                            />
                                        }
                                    />
                                    <Pie
                                        data={dashboardData.statusDistribution}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        labelLine={false}
                                    >
                                        <LabelList
                                            dataKey="name"
                                            className="fill-background"
                                            stroke="none"
                                            fontSize={12}
                                            formatter={(value) =>
                                                String(value ?? '')
                                            }
                                        />
                                        {dashboardData.statusDistribution.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-status-${index}`}
                                                    fill={entry.color}
                                                />
                                            ),
                                        )}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 leading-none font-medium">
                                Trending up by 5.2% this month{' '}
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-muted-foreground">
                                Showing submission status distribution
                            </div>
                        </CardFooter>
                    </Card>
                    {/* Revision Rounds Pie Chart Card */}
                    <Card className="flex flex-col overflow-hidden">
                        <CardHeader className="items-center pb-0">
                            <CardTitle>Revision Rounds</CardTitle>
                            <CardDescription>
                                Current Distribution
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0">
                            <ChartContainer
                                config={{
                                    ...dashboardData.revisionRounds.reduce(
                                        (acc, cur) => {
                                            acc[cur.name] = {
                                                label: cur.name,
                                                color: cur.color,
                                            };

                                            return acc;
                                        },
                                        {} as ChartConfig,
                                    ),
                                    value: { label: 'Revisions' },
                                }}
                                className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                nameKey="value"
                                                hideLabel
                                            />
                                        }
                                    />
                                    <Pie
                                        data={dashboardData.revisionRounds}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        labelLine={false}
                                    >
                                        <LabelList
                                            dataKey="name"
                                            className="fill-background"
                                            stroke="none"
                                            fontSize={12}
                                            formatter={(value) =>
                                                String(value ?? '')
                                            }
                                        />
                                        {dashboardData.revisionRounds.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-revision-${index}`}
                                                    fill={entry.color}
                                                />
                                            ),
                                        )}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 leading-none font-medium">
                                Trending up by 2.8% this month{' '}
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="leading-none text-muted-foreground">
                                Showing revision rounds distribution
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Add vertical space between Manuscript Status and Recent Submissions */}
            <div className="h-8 sm:h-10 lg:h-12" />

            <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="text-base font-medium">
                        Recent Submissions
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                        View All
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <div className="w-full overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4 py-3 text-sm">
                                        ID
                                    </TableHead>
                                    <TableHead className="px-4 py-3 text-sm">
                                        Manuscript
                                    </TableHead>
                                    <TableHead className="px-4 py-3 text-sm">
                                        Status
                                    </TableHead>
                                    <TableHead className="hidden px-4 py-3 text-sm md:table-cell">
                                        Author
                                    </TableHead>
                                    <TableHead className="hidden px-4 py-3 text-sm md:table-cell">
                                        Submitted
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border bg-card">
                                {dashboardData.recentSubmissions.length > 0 ? (
                                    dashboardData.recentSubmissions.map(
                                        (submission, idx, arr) => (
                                            <TableRow
                                                key={`submission-${submission.id}`}
                                                className={`transition-all hover:bg-muted/40 ${idx === 0 ? 'first:rounded-t-lg' : ''} ${idx === arr.length - 1 ? 'last:rounded-b-lg' : ''}`}
                                            >
                                                <TableCell className="px-4 py-3 align-middle">
                                                    {submission.id}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 align-middle">
                                                    {submission.title}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 align-middle">
                                                    <Badge>
                                                        {submission.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 align-middle">
                                                    {submission.author}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 align-middle">
                                                    {submission.submitted_date}
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )
                                ) : (
                                    <TableRow className="rounded-lg">
                                        <TableCell
                                            colSpan={6}
                                            className="rounded-lg px-8 py-16 text-center text-sm text-muted-foreground"
                                        >
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
