import { Bell } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
}
export const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', title: 'New Review', message: 'Your manuscript has received a new review.', time: '5 min ago', read: false },
        { id: '2', title: 'Revision Required', message: 'Please revise your manuscript based on reviewer comments.', time: '1 hour ago', read: false },
        { id: '3', title: 'Manuscript Accepted', message: 'Congratulations! Your manuscript has been accepted for publication.', time: '1 day ago', read: true },
    ]);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map((notif: Notification) =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const unreadCount = notifications.filter((n: Notification) => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold">Notifications</span>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <DropdownMenuItem key={notif.id} onSelect={() => markAsRead(notif.id)}>
                                <div className={cn("flex flex-col gap-1 w-full", !notif.read && "font-medium")}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">{notif.title}</span>
                                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">No new notifications</div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                    <Link href="/notifications" className="w-full text-sm font-medium">
                        View all notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};