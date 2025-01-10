import { useState, useEffect, PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Moon, Sun, Menu, X, Activity, Bell, BookOpen, CheckCircle, FileText, Home, Plus, Settings, Upload, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface AuthUser {
    firstname: string;
    lastname: string;
    email: string;
    avatar?: string;
}

interface AuthProps {
    user: AuthUser;
    roles?: string[];
}

interface CustomPageProps {
    auth: AuthProps;
}

declare module '@inertiajs/core' {
    interface PageProps extends CustomPageProps { }
}

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const links = [
    { href: 'author.dashboard', label: 'Dashboard', icon: Home, roles: ['author'] },
    { href: 'manuscripts.create', label: 'New Submissions', icon: Plus, roles: ['author'] },
    { href: 'manuscripts.index', label: 'Manuscript Tracking', icon: FileText, roles: ['author'] },
    { href: 'articles.index', label: 'Published Papers', icon: CheckCircle, roles: ['author'] },
    { href: 'manuscripts.revisions', label: 'Revision Required', icon: Upload, roles: ['author'] },
    { href: 'manuscripts.indexAIPrereviewed', label: 'AI Review Reports', icon: Activity, roles: ['author'] },
    { href: 'editor.dashboard', label: 'Dashboard', icon: Home, roles: ['editor'] },
    { href: 'editor.indexManuscripts', label: 'Submitted Manuscripts', icon: BookOpen, roles: ['editor'] },
    { href: 'editor.reviewer.assign', label: 'Assign Reviewer', icon: User, roles: ['editor'] },
    { href: 'reviewer.dashboard', label: 'Dashboard', icon: Home, roles: ['reviewer'] },
    { href: 'reviewer.manuscripts.toReview', label: 'Review Manuscripts', icon: FileText, roles: ['reviewer'] },
    { href: 'admin.dashboard', label: 'Dashboard', icon: Home, roles: ['admin'] },
    { href: 'admin.manageUsers', label: 'User Management', icon: User, roles: ['admin'] },
];

const sampleNotifications: Notification[] = [
    { id: '1', title: 'New Review', message: 'Your manuscript has received a new review.', time: '5 min ago', read: false },
    { id: '2', title: 'Revision Required', message: 'Please revise your manuscript based on reviewer comments.', time: '1 hour ago', read: false },
    { id: '3', title: 'Manuscript Accepted', message: 'Congratulations! Your manuscript has been accepted for publication.', time: '1 day ago', read: true },
];

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const userRoles = auth.roles || [];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        document.documentElement.classList.toggle('dark', newDarkMode);
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const SidebarLink = ({ href, active, icon: Icon, label, roles = [] }: {
        href: string;
        active: boolean;
        icon: React.ComponentType<any>;
        label: string;
        roles?: string[];
    }) => {
        const isAccessible = roles.length === 0 || roles.some((role) => userRoles.includes(role));
        if (!isAccessible) return null;

        return (
            <Link
                href={href}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out",
                    active
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 shadow-sm"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-600 dark:text-gray-200 dark:hover:bg-green-900/50 dark:hover:text-green-300"
                )}
            >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
            </Link>
        );
    };

    const UserDropdown = ({ user }: { user: AuthUser }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || '/placeholder.svg?height=40&width=40'} alt={`${user.firstname} ${user.lastname}`} />
                        <AvatarFallback>{user.firstname[0]}{user.lastname[0]}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{`${user.firstname} ${user.lastname}`}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={route('profile.edit')} className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={route('logout')} method="post" as="button" className="w-full flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const NotificationDropdown = () => {
        const unreadCount = notifications.filter(n => !n.read).length;

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

    return (
        <div className={cn("flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200",
            { "overflow-hidden": isSidebarOpen })}>
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0"
                )}
            >
                <div className="flex items-center justify-between h-16 px-4 bg-green-600 dark:bg-green-700 text-white">
                    <Link href="/" className="flex items-center space-x-2">
                        <ApplicationLogo className="h-8 w-auto fill-current text-white" />
                        <span className="text-lg font-bold">SaliksikHub</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-white hover:text-green-200"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="space-y-1">
                        {links.map(({ href, label, icon, roles }) => (
                            <SidebarLink
                                key={href}
                                href={route(href)}
                                active={route().current(href)}
                                icon={icon}
                                label={label}
                                roles={roles}
                            />
                        ))}
                    </nav>
                </ScrollArea>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden mr-2"
                                    onClick={() => setIsSidebarOpen(true)}
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{header}</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <NotificationDropdown />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Notifications</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={toggleDarkMode}
                                            >
                                                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isDarkMode ? 'Light mode' : 'Dark mode'}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <UserDropdown user={user} />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

