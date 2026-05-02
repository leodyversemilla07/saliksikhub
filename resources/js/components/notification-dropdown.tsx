import { Link, router } from '@inertiajs/react';
import {
    Bell,
    BellOff,
    Check,
    FileText,
    MessageSquare,
    Clock,
    AlertCircle,
    CheckCircle,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { forwardRef, useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: 'review' | 'revision' | 'acceptance' | 'submission' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
}

const REFRESH_INTERVAL_MS = 30000;
const NOTIFICATION_GROUPS = ['Today', 'Yesterday', 'Earlier'];

export const NotificationDropdown = forwardRef<HTMLButtonElement>((_, ref) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const fetchNotifications = async (showLoadingIndicator = true) => {
        try {
            if (showLoadingIndicator) {
                setIsLoading(true);
            }

            setErrorMessage(null);

            const response = await fetch('/api/notifications', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setNotifications(data.notifications as Notification[]);
            setUnreadCount(data.unreadCount as number);
        } catch (error) {
            setErrorMessage('Failed to load notifications');
            console.error('Error fetching notifications:', error);
        } finally {
            if (showLoadingIndicator) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();

        const intervalId = isDropdownOpen
            ? setInterval(() => fetchNotifications(false), REFRESH_INTERVAL_MS)
            : undefined;

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isDropdownOpen]);

    const markNotificationAsRead = async (notificationId: string) => {
        const notificationToUpdate = notifications.find(
            (notification) => notification.id === notificationId,
        );

        if (!notificationToUpdate || notificationToUpdate.read) {
            return;
        }

        try {
            const updatedNotifications = notifications.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification,
            );

            setNotifications(updatedNotifications);
            setUnreadCount(Math.max(0, unreadCount - 1));

            router.post(
                `/api/notifications/${notificationId}/read`,
                {},
                {
                    preserveState: true,
                    onError: () => {
                        setNotifications(notifications);
                        setUnreadCount(unreadCount);
                        displayErrorToast(
                            'Failed to mark notification as read',
                        );
                    },
                },
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
            displayErrorToast('Failed to mark notification as read');
        }
    };

    const markAllNotificationsAsRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        try {
            const originalNotifications = [...notifications];

            const updatedNotifications = notifications.map((notification) => ({
                ...notification,
                read: true,
            }));
            setNotifications(updatedNotifications);
            setUnreadCount(0);

            router.post(
                '/api/notifications/read-all',
                {},
                {
                    preserveState: true,
                    onError: () => {
                        setNotifications(originalNotifications);
                        setUnreadCount(
                            originalNotifications.filter((n) => !n.read).length,
                        );
                        displayErrorToast(
                            'Failed to mark all notifications as read',
                        );
                    },
                },
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            displayErrorToast('Failed to mark all notifications as read');
        }
    };

    const displayErrorToast = (message: string) => {
        toast.error(message, {
            description: 'Please try again later',
        });
    };

    const getFilteredNotifications = () => {
        return activeTab === 'all'
            ? notifications
            : notifications.filter((notification) => !notification.read);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'review':
                return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case 'revision':
                return <Clock className="h-4 w-4 text-amber-500" />;
            case 'acceptance':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'submission':
                return <FileText className="h-4 w-4 text-purple-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const groupNotificationsByDate = (notificationsToGroup: Notification[]) => {
        return notificationsToGroup.reduce(
            (groups, notification) => {
                const timeText = notification.time.toLowerCase();
                let group = 'Earlier';

                const isToday =
                    timeText.includes('just now') ||
                    timeText.includes('min ago') ||
                    timeText.includes('mins ago') ||
                    (timeText.includes('hour ago') &&
                        !timeText.includes('hours ago')) ||
                    timeText.includes('today');

                const isYesterday =
                    timeText.includes('day ago') ||
                    timeText.includes('yesterday');

                if (isToday) {
                    group = 'Today';
                } else if (isYesterday) {
                    group = 'Yesterday';
                }

                if (!groups[group]) {
                    groups[group] = [];
                }

                groups[group].push(notification);

                return groups;
            },
            {} as Record<string, Notification[]>,
        );
    };

    const filteredNotifications = getFilteredNotifications();
    const groupedNotifications = groupNotificationsByDate(
        filteredNotifications,
    );

    const NotificationItem = ({
        notification,
    }: {
        notification: Notification;
    }) => (
        <div
            onClick={() => markNotificationAsRead(notification.id)}
            className={cn(
                'cursor-pointer px-4 py-3 transition-colors duration-150 hover:bg-popover',
                !notification.read && 'bg-accent/40',
            )}
        >
            <div className="flex gap-3">
                <div className="mt-1 flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card">
                        {getNotificationIcon(notification.type)}
                    </div>
                </div>

                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h4
                            className={cn(
                                'text-sm',
                                !notification.read
                                    ? 'font-semibold text-foreground'
                                    : 'font-medium text-muted-foreground',
                            )}
                        >
                            {notification.title}
                        </h4>
                        <span className="ml-2 text-xs text-muted-foreground">
                            {notification.time}
                        </span>
                    </div>

                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                        {notification.message}
                    </p>

                    {notification.actionUrl && (
                        <Link
                            href={notification.actionUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1.5 inline-flex items-center text-xs font-medium text-primary hover:text-primary-foreground"
                        >
                            {notification.actionLabel || 'View details'}
                            <ChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                    )}
                </div>

                {!notification.read && (
                    <div className="mt-0.5 flex-shrink-0 self-start">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                )}
            </div>
        </div>
    );

    const EmptyState = ({ message }: { message: string }) => (
        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card">
                {activeTab === 'unread' ? (
                    <CheckCircle className="h-6 w-6 text-primary" />
                ) : (
                    <BellOff className="h-6 w-6 text-muted-foreground" />
                )}
            </div>
            <h4 className="mb-1 text-base font-medium text-foreground">
                {activeTab === 'unread'
                    ? "You're all caught up!"
                    : 'No notifications'}
            </h4>
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );

    const LoadingState = () => (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
                Loading notifications...
            </p>
        </div>
    );

    const ErrorState = () => (
        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive">
                <AlertCircle className="h-6 w-6 text-destructive-foreground" />
            </div>
            <h4 className="mb-1 text-base font-medium text-foreground">
                Something went wrong
            </h4>
            <p className="mb-4 text-sm text-muted-foreground">{errorMessage}</p>
            <Button
                size="sm"
                onClick={() => fetchNotifications()}
                variant="outline"
            >
                Try again
            </Button>
        </div>
    );

    const NotificationContent = () => {
        if (isLoading) {
            return <LoadingState />;
        }

        if (errorMessage) {
            return <ErrorState />;
        }

        if (filteredNotifications.length === 0) {
            const emptyMessage =
                activeTab === 'unread'
                    ? 'You have no unread notifications.'
                    : "You don't have any notifications yet.";

            return <EmptyState message={emptyMessage} />;
        }

        return (
            <div className="py-1">
                {NOTIFICATION_GROUPS.map(
                    (group) =>
                        groupedNotifications[group] && (
                            <div key={group} className="mb-2">
                                <div className="bg-popover px-4 py-1.5 text-xs font-medium text-muted-foreground">
                                    {group}
                                </div>
                                <div className="divide-y divide-border">
                                    {groupedNotifications[group].map(
                                        (notification) => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        ),
                )}
            </div>
        );
    };

    return (
        <DropdownMenu
            onOpenChange={(open) => {
                setIsDropdownOpen(open);

                if (open) {
                    fetchNotifications();
                }
            }}
        >
            <DropdownMenuTrigger
                render={
                    <Button
                        ref={ref}
                        variant="ghost"
                        size="icon"
                        className={cn(
                            'relative rounded-full',
                            unreadCount > 0 &&
                                'after:absolute after:top-1 after:right-1 after:h-2 after:w-2 after:rounded-full after:bg-primary after:ring-2 after:ring-card',
                        )}
                    />
                }
            >
                <Bell
                    className={cn(
                        'h-5 w-5 transition-colors duration-300',
                        unreadCount > 0
                            ? 'text-foreground'
                            : 'text-muted-foreground',
                    )}
                />

                {unreadCount > 0 && (
                    <span className="sr-only">
                        {unreadCount} unread notifications
                    </span>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-[380px] border-border bg-popover p-0"
                align="end"
                sideOffset={8}
            >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h3 className="text-lg font-semibold text-foreground">
                        Notifications
                    </h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                markAllNotificationsAsRead();
                            }}
                            className="h-8 gap-1.5 text-xs text-primary hover:bg-accent hover:text-primary-foreground"
                        >
                            <Check className="h-3.5 w-3.5" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                <Tabs
                    defaultValue="all"
                    value={activeTab}
                    onValueChange={(value) => {
                        if (value !== null) {
                            setActiveTab(value);
                        }
                    }}
                    className="flex h-[400px] w-full flex-col"
                >
                    <div className="border-b border-border px-4">
                        <TabsList className="h-12 justify-start gap-6 border-none bg-transparent p-0 shadow-none">
                            <TabsTrigger
                                value="all"
                                className="rounded-none border-b-2 border-transparent px-2 py-3 font-medium text-foreground transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:border-primary data-[state=active]:text-primary"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="unread"
                                className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-2 py-3 font-medium text-foreground transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:border-primary data-[state=active]:text-primary"
                            >
                                Unread
                                {unreadCount > 0 && (
                                    <Badge className="h-5 border-0 bg-accent text-primary">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="relative flex-1 overflow-hidden">
                        <TabsContent
                            value="all"
                            className="absolute inset-0 m-0"
                        >
                            <ScrollArea className="h-full w-full">
                                <NotificationContent />
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent
                            value="unread"
                            className="absolute inset-0 m-0"
                        >
                            <ScrollArea className="h-full w-full">
                                <NotificationContent />
                            </ScrollArea>
                        </TabsContent>
                    </div>

                    <div className="mt-auto border-t border-border bg-popover p-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-center bg-popover text-primary hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring"
                            render={
                                <Link
                                    href="/notifications"
                                    className="flex w-full items-center justify-center rounded py-2 hover:text-primary-foreground"
                                />
                            }
                        >
                            View all notifications
                        </Button>
                    </div>
                </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    );
});
