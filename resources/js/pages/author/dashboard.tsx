import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Mail,
    Plus,
    RefreshCw,
    Users,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

// ──────────────── Types ────────────────

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

interface ActionItem {
    id: number;
    title: string;
    status: string;
    updated_at: string;
    days_since?: number;
}

interface CoAuthor {
    id: number;
    name: string;
    email: string;
    manuscript_count: number;
    is_corresponding: boolean;
}

interface TimelineEvent {
    type: string;
    label: string;
    date: string;
    manuscript_id: number;
    manuscript_title: string;
}

interface Props {
    manuscripts: Manuscript[];
    monthlySubmissionData: MonthlyData[];
    currentTimeFilter: string;
    actionItems: {
        revisions_needed: ActionItem[];
        awaiting_approval: ActionItem[];
        under_review: ActionItem[];
    };
    coAuthors: CoAuthor[];
    timelineEvents: TimelineEvent[];
}

// ──────────────── Constants ────────────────

const STATUS_CONFIG: Record<
    string,
    {
        label: string;
        color: string;
        bg: string;
        dot: string;
        icon: React.ElementType;
    }
> = {
    draft: {
        label: 'Draft',
        color: 'text-gray-600',
        bg: 'bg-gray-100',
        dot: 'bg-gray-400',
        icon: FileText,
    },
    submitted: {
        label: 'Submitted',
        color: 'text-blue-700',
        bg: 'bg-blue-100',
        dot: 'bg-blue-500',
        icon: Clock,
    },
    under_review: {
        label: 'Under Review',
        color: 'text-amber-700',
        bg: 'bg-amber-100',
        dot: 'bg-amber-500',
        icon: Eye,
    },
    minor_revision: {
        label: 'Minor Revision',
        color: 'text-orange-700',
        bg: 'bg-orange-100',
        dot: 'bg-orange-500',
        icon: RefreshCw,
    },
    major_revision: {
        label: 'Major Revision',
        color: 'text-red-700',
        bg: 'bg-red-100',
        dot: 'bg-red-500',
        icon: AlertTriangle,
    },
    accepted: {
        label: 'Accepted',
        color: 'text-green-700',
        bg: 'bg-green-100',
        dot: 'bg-green-500',
        icon: CheckCircle,
    },
    rejected: {
        label: 'Rejected',
        color: 'text-rose-700',
        bg: 'bg-rose-100',
        dot: 'bg-rose-500',
        icon: XCircle,
    },
    published: {
        label: 'Published',
        color: 'text-purple-700',
        bg: 'bg-purple-100',
        dot: 'bg-purple-500',
        icon: BookOpen,
    },
    awaiting_author_approval: {
        label: 'Awaiting Approval',
        color: 'text-cyan-700',
        bg: 'bg-cyan-100',
        dot: 'bg-cyan-500',
        icon: AlertCircle,
    },
    in_copyediting: {
        label: 'In Copyediting',
        color: 'text-indigo-700',
        bg: 'bg-indigo-100',
        dot: 'bg-indigo-500',
        icon: FileText,
    },
    ready_for_publication: {
        label: 'Ready for Publication',
        color: 'text-violet-700',
        bg: 'bg-violet-100',
        dot: 'bg-violet-500',
        icon: CheckCircle,
    },
};

function sc(key: string) {
    return (
        STATUS_CONFIG[key] ?? {
            label: key,
            color: 'text-gray-700',
            bg: 'bg-gray-100',
            dot: 'bg-gray-400',
            icon: FileText,
        }
    );
}

function getChartColor(status: string): string {
    const map: Record<string, string> = {
        draft: '#6B7280',
        submitted: '#3B82F6',
        under_review: '#F59E0B',
        minor_revision: '#F97316',
        major_revision: '#EF4444',
        accepted: '#10B981',
        rejected: '#EF4444',
        published: '#8B5CF6',
        awaiting_author_approval: '#06B6D4',
        in_copyediting: '#6366F1',
        ready_for_publication: '#8B5CF6',
    };

    return map[status] ?? '#6B7280';
}

const TIMELINE_ICONS: Record<string, React.ElementType> = {
    submitted: Clock,
    under_review: Eye,
    revision: RefreshCw,
    accepted: CheckCircle,
    published: BookOpen,
    rejected: XCircle,
};

const TIMELINE_DOT_COLORS: Record<string, string> = {
    submitted: 'bg-blue-500',
    under_review: 'bg-amber-500',
    revision: 'bg-orange-500',
    accepted: 'bg-green-500',
    published: 'bg-purple-500',
    rejected: 'bg-rose-500',
};

// ──────────────── Component ────────────────

export default function AuthorDashboard({
    manuscripts,
    monthlySubmissionData,
    currentTimeFilter,
    actionItems,
    coAuthors,
    timelineEvents,
}: Props) {
    const [timeFilter, setTimeFilter] = useState(currentTimeFilter);

    // ── computed stats ──

    const totalSubmissions = manuscripts.length;
    const publishedCount = manuscripts.filter(
        (m) => m.status === 'published',
    ).length;
    const underReviewCount = manuscripts.filter(
        (m) => m.status === 'under_review',
    ).length;
    const revisionCount = manuscripts.filter(
        (m) => m.status === 'minor_revision' || m.status === 'major_revision',
    ).length;
    const totalActions =
        actionItems.revisions_needed.length +
        actionItems.awaiting_approval.length;

    // Status distribution for pie chart
    const statusDistribution = Object.entries(
        manuscripts.reduce(
            (acc, m) => {
                const status = m.status;
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        ),
    ).map(([status, count]) => ({
        name: sc(status).label,
        value: count,
        color: getChartColor(status),
    }));

    const recentManuscripts = manuscripts.slice(0, 5);

    // ── handlers ──

    function handleTimeFilterChange(value: string) {
        setTimeFilter(value);
        router.visit(`/author?timeFilter=${value}`, {
            preserveState: true,
            replace: true,
        });
    }

    // ── render helpers ──

    function ActionCard({
        title,
        count,
        items,
        icon: Icon,
        accentClass,
        emptyMsg,
        actionLabel,
        actionHref,
    }: {
        title: string;
        count: number;
        items: ActionItem[];
        icon: React.ElementType;
        accentClass: string;
        emptyMsg: string;
        actionLabel: string;
        actionHref: string;
    }) {
        return (
            <Card className={cn(count > 0 && 'border-l-4', accentClass)}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Icon className="h-4 w-4" />
                            {title}
                        </CardTitle>
                        {count > 0 && (
                            <Badge variant="destructive" className="h-6 px-2">
                                {count}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {items.length > 0 ? (
                        <div className="space-y-2">
                            {items.slice(0, 3).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-sm"
                                >
                                    <Link
                                        href={`/author/manuscripts/${item.id}`}
                                        className="flex-1 truncate font-medium hover:text-primary hover:underline"
                                    >
                                        {item.title}
                                    </Link>
                                    {'days_since' in item &&
                                        item.days_since !== undefined &&
                                        item.days_since > 0 && (
                                            <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                                                {item.days_since}d
                                            </span>
                                        )}
                                </div>
                            ))}
                            {items.length > 3 && (
                                <Link
                                    href={actionHref}
                                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                >
                                    View all {items.length} items
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            )}
                        </div>
                    ) : (
                        <p className="py-3 text-center text-sm text-muted-foreground">
                            {emptyMsg}
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    // ── render ──

    return (
        <AppLayout breadcrumbItems={[{ label: 'Dashboard', href: '#' }]}>
            <Head title="Author Dashboard" />

            <div className="space-y-6">
                {/* ── Header ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold tracking-tight">
                            Author Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Track your manuscript submissions and review
                            progress
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select
                            value={timeFilter}
                            onValueChange={handleTimeFilterChange}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30days">
                                    Last 30 Days
                                </SelectItem>
                                <SelectItem value="6months">
                                    Last 6 Months
                                </SelectItem>
                                <SelectItem value="1year">Last Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            render={<Link href="/author/manuscripts/create" />}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Submission
                        </Button>
                    </div>
                </div>

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {totalSubmissions}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Submissions
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {publishedCount}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Published
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                                    <Eye className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {underReviewCount}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Under Review
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                                    <RefreshCw className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {revisionCount}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Revisions Needed
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                                    <AlertCircle className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {totalActions}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Needs Attention
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Action Items Row ── */}
                {totalActions > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <ActionCard
                            title="Revisions Required"
                            count={actionItems.revisions_needed.length}
                            items={actionItems.revisions_needed}
                            icon={RefreshCw}
                            accentClass="border-l-orange-500"
                            emptyMsg="No revisions needed"
                            actionLabel="View all"
                            actionHref="/author/manuscripts/index"
                        />
                        <ActionCard
                            title="Awaiting Your Approval"
                            count={actionItems.awaiting_approval.length}
                            items={actionItems.awaiting_approval}
                            icon={AlertCircle}
                            accentClass="border-l-cyan-500"
                            emptyMsg="Nothing awaiting approval"
                            actionLabel="View all"
                            actionHref="/author/manuscripts/index"
                        />
                    </div>
                )}

                {/* ── Charts & Co-Authors ── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Submission Trends */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Submission Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlySubmissionData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            className="stroke-border"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 11 }}
                                        />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <RechartsTooltip
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid hsl(var(--border))',
                                                background: 'hsl(var(--card))',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="submissions"
                                            stackId="1"
                                            stroke="#3B82F6"
                                            fill="#3B82F6"
                                            fillOpacity={0.3}
                                            name="Submissions"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="accepted"
                                            stackId="2"
                                            stroke="#10B981"
                                            fill="#10B981"
                                            fillOpacity={0.3}
                                            name="Accepted"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="rejected"
                                            stackId="3"
                                            stroke="#EF4444"
                                            fill="#EF4444"
                                            fillOpacity={0.3}
                                            name="Rejected"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Co-Authors Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Users className="h-5 w-5 text-primary" />
                                Your Co-Authors
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {coAuthors.length > 0 ? (
                                <div className="space-y-3">
                                    {coAuthors.map((author) => (
                                        <div
                                            key={author.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {author.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {author.email}
                                                </p>
                                            </div>
                                            <div className="ml-3 flex shrink-0 items-center gap-2">
                                                {author.is_corresponding && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                render={
                                                                    <span className="cursor-default" />
                                                                }
                                                            >
                                                                <Mail className="h-3.5 w-3.5 text-primary" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Corresponding
                                                                Author
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                                <Badge variant="secondary">
                                                    {author.manuscript_count}{' '}
                                                    {author.manuscript_count ===
                                                    1
                                                        ? 'ms'
                                                        : 'ms'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                    <p>
                                        No co-authors yet. Add collaborators
                                        when you submit a manuscript.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Status Distribution + Recent Activity ── */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Status Pie */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Status Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {statusDistribution.length > 0 ? (
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={statusDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                                                }
                                                outerRadius={80}
                                                dataKey="value"
                                            >
                                                {statusDistribution.map(
                                                    (entry, i) => (
                                                        <Cell
                                                            key={i}
                                                            fill={entry.color}
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    No manuscript data to display.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Activity Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Clock className="h-5 w-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {timelineEvents.length > 0 ? (
                                <div className="space-y-0">
                                    {timelineEvents.map((event, i) => {
                                        const Icon =
                                            TIMELINE_ICONS[event.type] ?? Clock;
                                        const dotColor =
                                            TIMELINE_DOT_COLORS[event.type] ??
                                            'bg-gray-400';

                                        return (
                                            <div
                                                key={`${event.manuscript_id}-${event.type}-${i}`}
                                                className="relative flex gap-4 pb-6 last:pb-0"
                                            >
                                                {/* Timeline line */}
                                                {i <
                                                    timelineEvents.length -
                                                        1 && (
                                                    <div className="absolute top-8 bottom-0 left-[15px] w-px bg-border" />
                                                )}

                                                {/* Dot */}
                                                <div
                                                    className={cn(
                                                        'mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                                                        dotColor.replace(
                                                            'bg-',
                                                            'bg-/20 ',
                                                        ),
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'flex h-8 w-8 items-center justify-center rounded-full',
                                                            dotColor.replace(
                                                                'bg-',
                                                                'bg-',
                                                            ) + '/20',
                                                        )}
                                                    >
                                                        <Icon
                                                            className={cn(
                                                                'h-4 w-4',
                                                                dotColor.replace(
                                                                    'bg-',
                                                                    'text-',
                                                                ),
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                            {event.label}
                                                        </span>
                                                        <span className="shrink-0 text-xs text-muted-foreground">
                                                            {timeAgo(
                                                                event.date,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <Link
                                                        href={`/author/manuscripts/${event.manuscript_id}`}
                                                        className="mt-0.5 line-clamp-1 text-sm font-medium hover:text-primary hover:underline"
                                                    >
                                                        {event.manuscript_title}
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    No activity to show yet. Submit a manuscript
                                    to get started.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Recent Manuscripts ── */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="h-5 w-5 text-primary" />
                            Recent Manuscripts
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            render={<Link href="/author/manuscripts/index" />}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentManuscripts.length > 0 ? (
                            <div className="space-y-3">
                                {recentManuscripts.map((m) => {
                                    const cfg = sc(m.status);

                                    return (
                                        <div
                                            key={m.id}
                                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/author/manuscripts/${m.id}`}
                                                    className="font-medium hover:text-primary hover:underline"
                                                >
                                                    {m.title}
                                                </Link>
                                                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(
                                                            m.created_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    {m.journal && (
                                                        <span>{m.journal}</span>
                                                    )}
                                                    {m.category && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            {m.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="ml-4 flex shrink-0 items-center gap-2">
                                                <Badge
                                                    className={cn(
                                                        cfg.bg,
                                                        cfg.color,
                                                        'border-0',
                                                    )}
                                                >
                                                    {cfg.label}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    render={
                                                        <Link
                                                            href={`/author/manuscripts/${m.id}`}
                                                        />
                                                    }
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium">
                                    No manuscripts yet
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Start your first submission to see your
                                    progress here.
                                </p>
                                <Button
                                    render={
                                        <Link href="/author/manuscripts/create" />
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Manuscript
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

// ──────────────── Helpers ────────────────

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}
