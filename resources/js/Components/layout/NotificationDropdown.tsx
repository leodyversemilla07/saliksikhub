import React, { forwardRef, useEffect } from 'react';
import { Bell, BellOff, Check, FileText, MessageSquare, Clock, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from "@inertiajs/react";
import { useState } from "react";
import axios from 'axios';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

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

function NotificationDropdownComponent(props: {}, ref: React.Ref<HTMLButtonElement>) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<string>("all");

    // Fetch notifications on component mount and when dropdown is opened
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/notifications');
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Set up interval to check for new notifications
        const intervalId = setInterval(fetchNotifications, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await axios.post(`/api/notifications/${id}/read`);
            setNotifications(notifications.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/api/notifications/read-all');
            setNotifications(notifications.map(notif => ({ ...notif, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const filteredNotifications = activeTab === "all"
        ? notifications
        : notifications.filter(n => !n.read);

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

    // Group notifications by date
    const groupedNotifications = filteredNotifications.reduce((groups, notif) => {
        let group = 'Earlier';

        if (notif.time.includes('min ago') || notif.time.includes('hour ago') || notif.time === 'Just now') {
            group = 'Today';
        } else if (notif.time.includes('day ago')) {
            group = 'Yesterday';
        }

        if (!groups[group]) {
            groups[group] = [];
        }

        groups[group].push(notif);
        return groups;
    }, {} as Record<string, Notification[]>);

    const groupOrder = ['Today', 'Yesterday', 'Earlier'];

    return (
        <DropdownMenu onOpenChange={(open) => {
            if (open) fetchNotifications();
        }}>
            <DropdownMenuTrigger asChild>
                <Button
                    ref={ref}
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "relative rounded-full",
                        unreadCount > 0 && "after:absolute after:top-1 after:right-1 after:w-2 after:h-2 after:bg-green-500 after:rounded-full after:ring-2 after:ring-white dark:after:ring-gray-800"
                    )}
                >
                    <Bell className={cn(
                        "h-5 w-5 transition-colors duration-300",
                        unreadCount > 0 ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                    )} />

                    {unreadCount > 0 && (
                        <span className="sr-only">{unreadCount} unread notifications</span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[380px] p-0" align="end" sideOffset={8}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-8 text-xs gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                        >
                            <Check className="h-3.5 w-3.5" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-[400px]">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-4">
                        <TabsList className="h-12 bg-transparent gap-6 justify-start">
                            <TabsTrigger
                                value="all"
                                className="py-3 data-[state=active]:text-green-600 data-[state=active]:border-green-600 dark:data-[state=active]:text-green-400 dark:data-[state=active]:border-green-400 border-b-2 border-transparent px-2 rounded-none"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="unread"
                                className="py-3 data-[state=active]:text-green-600 data-[state=active]:border-green-600 dark:data-[state=active]:text-green-400 dark:data-[state=active]:border-green-400 border-b-2 border-transparent px-2 rounded-none flex gap-2 items-center"
                            >
                                Unread
                                {unreadCount > 0 && (
                                    <Badge className="h-5 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-0">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        <TabsContent value="all" className="absolute inset-0 m-0">
                            <ScrollArea className="h-full w-full" type="always">
                                {filteredNotifications.length > 0 ? (
                                    <div className="py-1">
                                        {groupOrder.map(group => (
                                            groupedNotifications[group] && (
                                                <div key={group} className="mb-2">
                                                    <div className="px-4 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60">
                                                        {group}
                                                    </div>

                                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                                        {groupedNotifications[group].map((notif) => (
                                                            <div
                                                                key={notif.id}
                                                                onClick={() => markAsRead(notif.id)}
                                                                className={cn(
                                                                    "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150 cursor-pointer",
                                                                    !notif.read && "bg-green-50/40 dark:bg-green-900/10"
                                                                )}
                                                            >
                                                                <div className="flex gap-3">
                                                                    <div className="flex-shrink-0 mt-1">
                                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                                            {getNotificationIcon(notif.type)}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <h4 className={cn(
                                                                                "text-sm",
                                                                                !notif.read ? "font-semibold text-gray-900 dark:text-gray-100" : "font-medium text-gray-700 dark:text-gray-300"
                                                                            )}>
                                                                                {notif.title}
                                                                            </h4>
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                                                {notif.time}
                                                                            </span>
                                                                        </div>

                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                                                                            {notif.message}
                                                                        </p>

                                                                        {notif.actionUrl && (
                                                                            <Link
                                                                                href={notif.actionUrl}
                                                                                className="mt-1.5 inline-flex items-center text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                                                            >
                                                                                {notif.actionLabel}
                                                                                <ChevronRight className="ml-1 h-3 w-3" />
                                                                            </Link>
                                                                        )}
                                                                    </div>

                                                                    {!notif.read && (
                                                                        <div className="flex-shrink-0 self-start mt-0.5">
                                                                            <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 flex flex-col items-center justify-center px-4 text-center">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                            <BellOff className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">No notifications</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {activeTab === "unread" ?
                                                "You're all caught up! No unread notifications." :
                                                "You don't have any notifications yet."
                                            }
                                        </p>
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="unread" className="absolute inset-0 m-0">
                            <ScrollArea className="h-full w-full" type="always">
                                {filteredNotifications.length > 0 ? (
                                    <div className="py-1">
                                        {groupOrder.map(group => (
                                            groupedNotifications[group] && (
                                                <div key={group} className="mb-2">
                                                    <div className="px-4 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60">
                                                        {group}
                                                    </div>

                                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                                        {groupedNotifications[group].map((notif) => (
                                                            <div
                                                                key={notif.id}
                                                                onClick={() => markAsRead(notif.id)}
                                                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors duration-150 cursor-pointer bg-green-50/40 dark:bg-green-900/10"
                                                            >
                                                                <div className="flex gap-3">
                                                                    <div className="flex-shrink-0 mt-1">
                                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                                            {getNotificationIcon(notif.type)}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex-grow">
                                                                        <div className="flex items-center justify-between">
                                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                                {notif.title}
                                                                            </h4>
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                                                {notif.time}
                                                                            </span>
                                                                        </div>

                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                                                                            {notif.message}
                                                                        </p>

                                                                        {notif.actionUrl && (
                                                                            <Link
                                                                                href={notif.actionUrl}
                                                                                className="mt-1.5 inline-flex items-center text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                                                            >
                                                                                {notif.actionLabel}
                                                                                <ChevronRight className="ml-1 h-3 w-3" />
                                                                            </Link>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex-shrink-0 self-start mt-0.5">
                                                                        <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 flex flex-col items-center justify-center px-4 text-center">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                            <CheckCircle className="h-6 w-6 text-green-500" />
                                        </div>
                                        <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">You're all caught up!</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            You have no unread notifications.
                                        </p>
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 p-2 mt-auto">
                        <Button
                            variant="ghost"
                            className="w-full justify-center text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                            asChild
                        >
                            <Link href="/notifications">
                                View all notifications
                            </Link>
                        </Button>
                    </div>
                </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const NotificationDropdown = forwardRef(NotificationDropdownComponent);
NotificationDropdown.displayName = "NotificationDropdown";