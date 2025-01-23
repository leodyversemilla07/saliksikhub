// React and Inertia imports
import { useState, useEffect, PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

// Icons
import {
    Moon,
    Sun,
    Menu,
    X,
    Activity,
    BookOpen,
    CheckCircle,
    FileText,
    Home,
    Plus,
    Upload,
    User
} from 'lucide-react';

// Utilities
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/Components/ui/tooltip';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { NotificationDropdown } from '@/Components/layout/NotificationDropdown';
import { UserDropdown } from '@/Components/layout/UserDropdown';

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

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const userRoles = auth.roles || [];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

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

