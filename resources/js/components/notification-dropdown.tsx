import { forwardRef, useEffect } from 'react';
import { Bell, BellOff, Check, FileText, MessageSquare, Clock, AlertCircle, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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
    const [activeTab, setActiveTab] = useState<string>("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const fetchNotifications = async (showLoadingIndicator = true) => {
        try {
            if (showLoadingIndicator) setIsLoading(true);
            setErrorMessage(null);

            const response = await fetch('/api/notifications', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
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
            if (showLoadingIndicator) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const intervalId = isDropdownOpen ?
            setInterval(() => fetchNotifications(false), REFRESH_INTERVAL_MS) :
            undefined;

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isDropdownOpen]);

    const markNotificationAsRead = async (notificationId: string) => {
        const notificationToUpdate = notifications.find(notification => notification.id === notificationId);
        if (!notificationToUpdate || notificationToUpdate.read) return;

        try {
            const updatedNotifications = notifications.map((notification) =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            );

            setNotifications(updatedNotifications);
            setUnreadCount(Math.max(0, unreadCount - 1));

            router.post(`/api/notifications/${notificationId}/read`, {}, {
                preserveState: true,
                onError: () => {
                    setNotifications(notifications);
                    setUnreadCount(unreadCount);
                    displayErrorToast("Failed to mark notification as read");
                }
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            displayErrorToast("Failed to mark notification as read");
        }
    };

    const markAllNotificationsAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            const originalNotifications = [...notifications];

            const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
            setNotifications(updatedNotifications);
            setUnreadCount(0);

            router.post('/api/notifications/read-all', {}, {
                preserveState: true,
                onError: () => {
                    setNotifications(originalNotifications);
                    setUnreadCount(originalNotifications.filter(n => !n.read).length);
                    displayErrorToast("Failed to mark all notifications as read");
                }
            });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            displayErrorToast("Failed to mark all notifications as read");
        }
    };

    const displayErrorToast = (message: string) => {
        toast.error(message, {
            description: "Please try again later",
        });
    };

    const getFilteredNotifications = () => {
        return activeTab === "all"
            ? notifications
            : notifications.filter(notification => !notification.read);
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
        return notificationsToGroup.reduce((groups, notification) => {
            const timeText = notification.time.toLowerCase();
            let group = 'Earlier';

            const isToday = timeText.includes('just now') ||
                timeText.includes('min ago') ||
                timeText.includes('mins ago') ||
                (timeText.includes('hour ago') && !timeText.includes('hours ago')) ||
                timeText.includes('today');

            const isYesterday = timeText.includes('day ago') ||
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
        }, {} as Record<string, Notification[]>);
    };

    const filteredNotifications = getFilteredNotifications();
    const groupedNotifications = groupNotificationsByDate(filteredNotifications);

    const NotificationItem = ({ notification }: { notification: Notification }) => (
        <div
            onClick={() => markNotificationAsRead(notification.id)}
            className={cn(
                "px-4 py-3 hover:bg-popover transition-colors duration-150 cursor-pointer",
                !notification.read && "bg-accent/40"
            )}
        >
            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-card">
                        {getNotificationIcon(notification.type)}
                    </div>
                </div>

                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h4 className={cn(
                            "text-sm",
                            !notification.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                        )}>
                            {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground ml-2">
                            {notification.time}
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
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
                    <div className="flex-shrink-0 self-start mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                )}
            </div>
        </div>
    );

    const EmptyState = ({ message }: { message: string }) => (
        <div className="py-8 flex flex-col items-center justify-center px-4 text-center">
            <div className="h-12 w-12 rounded-full bg-card flex items-center justify-center mb-3">
                {activeTab === "unread" ?
                    <CheckCircle className="h-6 w-6 text-primary" /> :
                    <BellOff className="h-6 w-6 text-muted-foreground" />
                }
            </div>
            <h4 className="text-base font-medium text-foreground mb-1">
                {activeTab === "unread" ? "You're all caught up!" : "No notifications"}
            </h4>
            <p className="text-sm text-muted-foreground">
                {message}
            </p>
        </div>
    );

    const LoadingState = () => (
        <div className="py-12 flex flex-col items-center justify-center px-4 text-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Loading notifications...</p>
        </div>
    );

    const ErrorState = () => (
        <div className="py-8 flex flex-col items-center justify-center px-4 text-center">
            <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center mb-3">
                <AlertCircle className="h-6 w-6 text-destructive-foreground" />
            </div>
            <h4 className="text-base font-medium text-foreground mb-1">Something went wrong</h4>
            <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
            <Button size="sm" onClick={() => fetchNotifications()} variant="outline">Try again</Button>
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
            const emptyMessage = activeTab === "unread"
                ? "You have no unread notifications."
                : "You don't have any notifications yet.";

            return <EmptyState message={emptyMessage} />;
        }

        return (
            <div className="py-1">
                {NOTIFICATION_GROUPS.map(group => (
                    groupedNotifications[group] && (
                        <div key={group} className="mb-2">
                            <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground bg-popover">
                                {group}
                            </div>
                            <div className="divide-y divide-border">
                                {groupedNotifications[group].map((notification) => (
                                    <NotificationItem key={notification.id} notification={notification} />
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        );
    };

    return (
        <DropdownMenu onOpenChange={(open) => {
            setIsDropdownOpen(open);
            if (open) fetchNotifications();
        }}>
            <DropdownMenuTrigger asChild>
                <Button
                    ref={ref}
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "relative rounded-full",
                        unreadCount > 0 && "after:absolute after:top-1 after:right-1 after:w-2 after:h-2 after:bg-primary after:rounded-full after:ring-2 after:ring-card"
                    )}
                >
                    <Bell className={cn(
                        "h-5 w-5 transition-colors duration-300",
                        unreadCount > 0 ? "text-foreground" : "text-muted-foreground"
                    )} />

                    {unreadCount > 0 && (
                        <span className="sr-only">{unreadCount} unread notifications</span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[380px] p-0 bg-popover border-border" align="end" sideOffset={8}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-lg text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                markAllNotificationsAsRead();
                            }}
                            className="h-8 text-xs gap-1.5 text-primary hover:text-primary-foreground hover:bg-accent"
                        >
                            <Check className="h-3.5 w-3.5" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-[400px]">
                    <div className="border-b border-border px-4">
                        <TabsList className="h-12 bg-transparent gap-6 justify-start border-none shadow-none p-0">
                            <TabsTrigger
                                value="all"
                                className="py-3 px-2 rounded-none border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary text-foreground font-medium transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="unread"
                                className="py-3 px-2 rounded-none border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary text-foreground font-medium transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring flex gap-2 items-center"
                            >
                                Unread
                                {unreadCount > 0 && (
                                    <Badge className="h-5 bg-accent text-primary border-0">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        <TabsContent value="all" className="absolute inset-0 m-0">
                            <ScrollArea className="h-full w-full" type="always">
                                <NotificationContent />
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="unread" className="absolute inset-0 m-0">
                            <ScrollArea className="h-full w-full" type="always">
                                <NotificationContent />
                            </ScrollArea>
                        </TabsContent>
                    </div>

                    <div className="border-t border-border p-2 mt-auto bg-popover">
                        <Button
                            variant="ghost"
                            className="w-full justify-center text-primary focus-visible:ring-2 focus-visible:ring-ring bg-popover hover:bg-accent/60"
                            asChild
                        >
                            <Link
                                href="/notifications"
                                className="hover:text-primary-foreground w-full flex justify-center items-center py-2 rounded"
                            >
                                View all notifications
                            </Link>
                        </Button>
                    </div>
                </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    );
});
