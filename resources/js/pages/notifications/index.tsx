import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import {
    Bell,
    BellOff,
    Check,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    Inbox,
    MessageSquare,
    MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

// ──────────────── Types ────────────────

interface NotificationData {
    message?: string;
    manuscript_id?: string;
    manuscript_title?: string;
    decision_type?: string;
    type?: string;
    previous_status?: string;
    new_status?: string;
}

interface NotificationItem {
    id: string;
    type: 'review' | 'revision' | 'acceptance' | 'submission' | 'system';
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props extends PageProps {
    notifications: {
        data: NotificationItem[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

// ──────────────── Helpers ────────────────

function classifyNotification(
    data: NotificationData,
): NotificationItem['type'] {
    if (data.decision_type === 'Accept') return 'acceptance';
    if (
        data.decision_type === 'Minor Revision' ||
        data.decision_type === 'Major Revision'
    )
        return 'revision';
    if (data.decision_type === 'Reject') return 'review';
    if (data.type === 'status_change' || data.manuscript_id)
        return 'submission';
    return 'system';
}

function notificationTitle(data: NotificationData): string {
    if (data.type === 'status_change' && data.new_status) {
        return `Status Changed: ${data.new_status}`;
    }
    if (data.decision_type === 'Accept') return 'Manuscript Accepted';
    if (data.decision_type === 'Minor Revision')
        return 'Minor Revision Required';
    if (data.decision_type === 'Major Revision')
        return 'Major Revision Required';
    if (data.decision_type === 'Reject') return 'Manuscript Rejected';
    if (data.manuscript_title) {
        const t = data.manuscript_title;
        return t.length > 40 ? `${t.slice(0, 40)}…` : t;
    }
    return 'System Notification';
}

function notificationMessage(data: NotificationData): string {
    if (
        data.type === 'status_change' &&
        data.previous_status &&
        data.new_status &&
        data.manuscript_title
    ) {
        return `"${data.manuscript_title}" changed from ${data.previous_status} to ${data.new_status}.`;
    }
    if (data.decision_type && data.manuscript_title) {
        const title = data.manuscript_title;
        switch (data.decision_type) {
            case 'Accept':
                return `Congratulations! "${title}" has been accepted for publication.`;
            case 'Minor Revision':
                return `"${title}" requires minor revisions.`;
            case 'Major Revision':
                return `"${title}" requires major revisions.`;
            case 'Reject':
                return `"${title}" has not been accepted for publication.`;
        }
    }
    return data.message ?? 'You have a new notification.';
}

function actionUrl(data: NotificationData, role?: string): string | null {
    if (!data.manuscript_id) return null;
    const id = data.manuscript_id;
    if (
        role === 'editor_in_chief' ||
        role === 'managing_editor' ||
        role === 'associate_editor' ||
        role === 'language_editor'
    )
        return `/editor/manuscripts/${id}`;
    if (role === 'author') return `/author/manuscripts/${id}`;
    if (role === 'reviewer') return `/reviewer/manuscripts/${id}`;
    return null;
}

function actionLabel(data: NotificationData): string {
    if (data.type === 'status_change') return 'View Manuscript';
    if (
        data.decision_type === 'Minor Revision' ||
        data.decision_type === 'Major Revision'
    )
        return 'Start Revision';
    if (data.decision_type === 'Reject') return 'View Review';
    return 'View Details';
}

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

function typeIcon(type: NotificationItem['type']) {
    switch (type) {
        case 'review':
            return <MessageSquare className="h-5 w-5 text-blue-500" />;
        case 'revision':
            return <Clock className="h-5 w-5 text-amber-500" />;
        case 'acceptance':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'submission':
            return <FileText className="h-5 w-5 text-purple-500" />;
        default:
            return <Bell className="h-5 w-5 text-gray-500" />;
    }
}

const FILTER_TABS = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'submission', label: 'Submissions' },
    { value: 'acceptance', label: 'Acceptances' },
    { value: 'review', label: 'Reviews' },
] as const;

// ──────────────── Component ────────────────

export default function NotificationsPage({ auth, notifications }: Props) {
    const [items, setItems] = useState(notifications.data);
    const [activeTab, setActiveTab] = useState<string>('all');

    const pagination: PaginationMeta = {
        current_page: notifications.current_page,
        from: notifications.from,
        last_page: notifications.last_page,
        per_page: notifications.per_page,
        to: notifications.to,
        total: notifications.total,
        links: notifications.links,
    };

    const unreadCount = items.filter((n) => n.read_at === null).length;

    // ── mark as read ──

    async function handleMarkRead(id: string) {
        try {
            await axios.post(`/api/notifications/${id}/read`);
            setItems((prev) =>
                prev.map((n) =>
                    n.id === id
                        ? { ...n, read_at: new Date().toISOString() }
                        : n,
                ),
            );
        } catch {
            // silently fail
        }
    }

    async function handleMarkAllRead() {
        try {
            await axios.post('/api/notifications/read-all');
            setItems((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
            );
        } catch {
            // silently fail
        }
    }

    // ── filtering ──

    function matchesTab(n: NotificationItem): boolean {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return n.read_at === null;
        const type = classifyNotification(n.data);
        return type === activeTab;
    }

    const filtered = items.filter(matchesTab);

    // ── navigation ──

    function goToPage(url: string | null) {
        if (!url) return;
        router.visit(url, { preserveState: true, preserveScroll: true });
    }

    // ── render ──

    return (
        <AppLayout
            breadcrumbItems={[
                { label: 'Dashboard', href: '/' },
                { label: 'Notifications' },
            ]}
        >
            <Head title="Notifications" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Notifications
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Stay updated on manuscript status changes and
                            editorial decisions
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <div className="flex items-center gap-2">
                            <Badge variant="default" className="gap-1">
                                <Bell className="h-3.5 w-3.5" />
                                {unreadCount} unread
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllRead}
                            >
                                <Check className="mr-1.5 h-4 w-4" />
                                Mark all as read
                            </Button>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {FILTER_TABS.map((tab) => {
                        const count =
                            tab.value === 'all'
                                ? items.length
                                : tab.value === 'unread'
                                  ? unreadCount
                                  : items.filter(
                                        (n) =>
                                            classifyNotification(n.data) ===
                                            tab.value,
                                    ).length;

                        return (
                            <Button
                                key={tab.value}
                                variant={
                                    activeTab === tab.value
                                        ? 'default'
                                        : 'secondary'
                                }
                                size="sm"
                                onClick={() => {
                                    setActiveTab(tab.value);
                                }}
                                className="relative"
                            >
                                {tab.label}
                                {tab.value !== 'all' && count > 0 && (
                                    <span className="ml-1.5 text-xs opacity-70">
                                        ({count})
                                    </span>
                                )}
                            </Button>
                        );
                    })}
                </div>

                {/* Content */}
                <Card>
                    {filtered.length > 0 ? (
                        <div className="divide-y">
                            {filtered.map((n) => {
                                const type = classifyNotification(n.data);
                                const isUnread = n.read_at === null;

                                return (
                                    <div
                                        key={n.id}
                                        className={cn(
                                            'flex items-start gap-4 px-6 py-4 transition-colors',
                                            isUnread
                                                ? 'bg-primary/[0.03]'
                                                : 'bg-card',
                                        )}
                                    >
                                        {/* Icon */}
                                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                                            {typeIcon(type)}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4
                                                    className={cn(
                                                        'text-sm',
                                                        isUnread
                                                            ? 'font-semibold text-foreground'
                                                            : 'font-medium text-muted-foreground',
                                                    )}
                                                >
                                                    {notificationTitle(n.data)}
                                                </h4>
                                                <span className="shrink-0 text-xs text-muted-foreground">
                                                    {timeAgo(n.created_at)}
                                                </span>
                                            </div>

                                            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                                                {notificationMessage(n.data)}
                                            </p>

                                            <div className="mt-2 flex items-center gap-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wider uppercase',
                                                        type === 'acceptance'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : type ===
                                                                'revision'
                                                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                              : type ===
                                                                  'review'
                                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                : type ===
                                                                    'submission'
                                                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
                                                    )}
                                                >
                                                    {type}
                                                </span>

                                                {actionUrl(
                                                    n.data,
                                                    auth?.user?.role,
                                                ) && (
                                                    <a
                                                        href={
                                                            actionUrl(
                                                                n.data,
                                                                auth?.user
                                                                    ?.role,
                                                            ) ?? undefined
                                                        }
                                                        className="text-xs font-medium text-primary hover:underline"
                                                    >
                                                        {actionLabel(n.data)}
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex shrink-0 items-center gap-2">
                                            {isUnread && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleMarkRead(n.id)
                                                    }
                                                    className="flex h-6 w-6 items-center justify-center rounded-full border text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        />
                                                    }
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {isUnread && (
                                                        <DropdownMenuItem
                                                            tabIndex={0}
                                                            onSelect={() =>
                                                                handleMarkRead(
                                                                    n.id,
                                                                )
                                                            }
                                                        >
                                                            <Check className="mr-2 h-4 w-4" />
                                                            Mark as read
                                                        </DropdownMenuItem>
                                                    )}
                                                    {actionUrl(
                                                        n.data,
                                                        auth?.user?.role,
                                                    ) && (
                                                        <DropdownMenuItem
                                                            tabIndex={0}
                                                            onSelect={() => {
                                                                const url =
                                                                    actionUrl(
                                                                        n.data,
                                                                        auth
                                                                            ?.user
                                                                            ?.role,
                                                                    );
                                                                if (url)
                                                                    window.location.href =
                                                                        url;
                                                            }}
                                                        >
                                                            {actionLabel(
                                                                n.data,
                                                            )}
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    {activeTab === 'unread' ? (
                                        <BellOff className="h-8 w-8 text-muted-foreground" />
                                    ) : (
                                        <Inbox className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold">
                                    {activeTab === 'unread'
                                        ? "You're all caught up!"
                                        : 'No notifications'}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {activeTab === 'unread'
                                        ? 'You have no unread notifications.'
                                        : 'Notifications about manuscript status changes and editorial decisions will appear here.'}
                                </p>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing{' '}
                            <span className="font-medium">
                                {pagination.from}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">{pagination.to}</span>{' '}
                            of{' '}
                            <span className="font-medium">
                                {pagination.total}
                            </span>{' '}
                            notifications
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    pagination.current_page <= 1 ||
                                    !pagination.links[0]?.url
                                }
                                onClick={() =>
                                    goToPage(pagination.links[0]?.url)
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            {/* Page numbers */}
                            <div className="hidden gap-1 sm:flex">
                                {pagination.links
                                    .filter(
                                        (l, i) =>
                                            i > 0 &&
                                            i < pagination.links.length - 1,
                                    )
                                    .map((link, i) => (
                                        <Button
                                            key={`${link.label}-${i}`}
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className="min-w-[32px]"
                                            disabled={!link.url}
                                            onClick={() => goToPage(link.url)}
                                        >
                                            {link.label}
                                        </Button>
                                    ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    pagination.current_page >=
                                        pagination.last_page ||
                                    !pagination.links[
                                        pagination.links.length - 1
                                    ]?.url
                                }
                                onClick={() =>
                                    goToPage(
                                        pagination.links[
                                            pagination.links.length - 1
                                        ]?.url,
                                    )
                                }
                            >
                                Next
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
