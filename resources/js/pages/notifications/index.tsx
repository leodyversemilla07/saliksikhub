import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    CheckCircle,
    MessageSquare,
    FileText,
    Clock,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import notificationsRoutes from '@/routes/notifications';
import type { PageProps } from '@/types';

interface NotificationData {
    message?: string;
    manuscript_id?: string;
    manuscript_title?: string;
    decision_type?: string;
}

interface Notification {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export default function Notifications({
    auth,
    notifications,
}: PageProps<{ notifications: PaginatedData<Notification> }>) {
    const [notificationState, setNotificationState] = useState(
        notifications.data,
    );
    const [activeTab, setActiveTab] = useState('all');

    const markAsRead = async (id: string) => {
        try {
            await axios.post(`/api/notifications/${id}/read`);
            setNotificationState(
                notificationState.map((notif: Notification) =>
                    notif.id === id
                        ? { ...notif, read_at: new Date().toISOString() }
                        : notif,
                ),
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/api/notifications/read-all');
            setNotificationState(
                notificationState.map((notif: Notification) => ({
                    ...notif,
                    read_at: new Date().toISOString(),
                })),
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationType = (data: NotificationData) => {
        if (data.decision_type) {
            switch (data.decision_type) {
                case 'Accept':
                    return 'acceptance';
                case 'Minor Revision':
                case 'Major Revision':
                    return 'revision';
                case 'Reject':
                    return 'review';
                default:
                    return 'system';
            }
        }

        if (data.manuscript_id) {
return 'submission';
}

        return 'system';
    };

    const getNotificationIcon = (type: string) => {
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
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const getActionUrl = (data: NotificationData) => {
        if (data.manuscript_id) {
            // Use the user's role to determine the correct URL path
            const userRole = auth.user.role;

            if (
                userRole === 'editor_in_chief' ||
                userRole === 'managing_editor' ||
                userRole === 'associate_editor' ||
                userRole === 'language_editor'
            ) {
                return `/editor/manuscripts/${data.manuscript_id}`;
            } else if (userRole === 'author') {
                return `/author/manuscripts/${data.manuscript_id}`;
            } else if (userRole === 'reviewer') {
                return `/reviewer/manuscripts/${data.manuscript_id}`;
            }
        }

        return undefined;
    };

    const getActionLabel = (data: NotificationData) => {
        if (data.decision_type) {
            switch (data.decision_type) {
                case 'Accept':
                    return 'View Details';
                case 'Minor Revision':
                case 'Major Revision':
                    return 'Start Revision';
                case 'Reject':
                    return 'View Review';
                default:
                    return 'View Manuscript';
            }
        }

        return 'View Details';
    };

    const getNotificationTitle = (data: NotificationData) => {
        if (data.decision_type) {
            switch (data.decision_type) {
                case 'Accept':
                    return 'Manuscript Accepted';
                case 'Minor Revision':
                    return 'Minor Revision Required';
                case 'Major Revision':
                    return 'Major Revision Required';
                case 'Reject':
                    return 'Manuscript Rejected';
                default:
                    return 'Manuscript Update';
            }
        }

        if (data.manuscript_title) {
            return `Submission Update: ${data.manuscript_title.substring(0, 30)}...`;
        }

        return 'System Notification';
    };

    const filteredNotifications =
        activeTab === 'all'
            ? notificationState
            : notificationState.filter((n: Notification) => n.read_at === null);

    const unreadCount = notificationState.filter(
        (n: Notification) => n.read_at === null,
    ).length;

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: dashboard.url(),
        },
        {
            label: 'Notifications',
            href: notificationsRoutes.index.url(),
            current: true,
        },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Notifications" />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Notifications</CardTitle>
                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
                            onClick={markAllAsRead}
                            className="text-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                            Mark all as read
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <Tabs
                        defaultValue="all"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="unread">
                                Unread{' '}
                                {unreadCount > 0 && (
                                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                                        {unreadCount}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map(
                                    (notification: Notification) => (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                'flex items-start gap-4 rounded-lg border p-4 transition-colors',
                                                notification.read_at
                                                    ? 'bg-white'
                                                    : 'bg-green-50',
                                            )}
                                            onClick={() => {
                                                if (!notification.read_at) {
                                                    markAsRead(notification.id);
                                                }
                                            }}
                                        >
                                            <div className="mt-1 shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                                    {getNotificationIcon(
                                                        getNotificationType(
                                                            notification.data,
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grow">
                                                <div className="flex items-center justify-between">
                                                    <h4
                                                        className={cn(
                                                            'text-base',
                                                            !notification.read_at
                                                                ? 'font-semibold'
                                                                : 'font-medium text-gray-700',
                                                        )}
                                                    >
                                                        {getNotificationTitle(
                                                            notification.data,
                                                        )}
                                                    </h4>
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {new Date(
                                                            notification.created_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-gray-600">
                                                    {notification.data
                                                        .message ||
                                                        (notification.data
                                                            .manuscript_title &&
                                                            `Regarding your manuscript: "${notification.data.manuscript_title}"`)}
                                                </p>

                                                {notification.data &&
                                                    getActionUrl(
                                                        notification.data,
                                                    ) && (
                                                        <a
                                                            href={getActionUrl(
                                                                notification.data,
                                                            )}
                                                            className="mt-2 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                                                        >
                                                            {getActionLabel(
                                                                notification.data,
                                                            )}
                                                        </a>
                                                    )}
                                            </div>

                                            {!notification.read_at && (
                                                <div className="mt-1 shrink-0 self-start">
                                                    <div className="h-3 w-3 rounded-full bg-green-600"></div>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-gray-500">
                                        No notifications found
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="unread" className="space-y-4">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map(
                                    (notification: Notification) => (
                                        <div
                                            key={notification.id}
                                            className="flex items-start gap-4 rounded-lg border bg-green-50 p-4"
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                        >
                                            <div className="mt-1 shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                                    {getNotificationIcon(
                                                        getNotificationType(
                                                            notification.data,
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grow">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-base font-semibold">
                                                        {getNotificationTitle(
                                                            notification.data,
                                                        )}
                                                    </h4>
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {new Date(
                                                            notification.created_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-gray-600">
                                                    {notification.data
                                                        .message ||
                                                        (notification.data
                                                            .manuscript_title &&
                                                            `Regarding your manuscript: "${notification.data.manuscript_title}"`)}
                                                </p>

                                                {notification.data &&
                                                    getActionUrl(
                                                        notification.data,
                                                    ) && (
                                                        <a
                                                            href={getActionUrl(
                                                                notification.data,
                                                            )}
                                                            className="mt-2 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                                                        >
                                                            {getActionLabel(
                                                                notification.data,
                                                            )}
                                                        </a>
                                                    )}
                                            </div>

                                            <div className="mt-1 shrink-0 self-start">
                                                <div className="h-3 w-3 rounded-full bg-green-600"></div>
                                            </div>
                                        </div>
                                    ),
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    </div>
                                    <h4 className="mb-1 text-lg font-medium">
                                        You're all caught up!
                                    </h4>
                                    <p className="text-gray-500">
                                        You have no unread notifications.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
