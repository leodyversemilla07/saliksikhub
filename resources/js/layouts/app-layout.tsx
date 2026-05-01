import { usePage } from '@inertiajs/react';
import {
    Moon,
    Sun,
    FileText,
    FilePlus,
    UserCheck,
    LayoutDashboard,
    AlertCircle,
    Building2,
    BookOpen,
    Puzzle,
    Megaphone,
    Settings,
    Users,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ReactNode , PropsWithChildren } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import Breadcrumb from '@/components/breadcrumb';
import { NotificationDropdown } from '@/components/notification-dropdown';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    SidebarTrigger,
    SidebarProvider,
    SidebarInset,
} from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { PageProps } from '@/types';
import admin from '@/routes/admin';
import author from '@/routes/author';
import editor from '@/routes/editor';
import issues from '@/routes/issues';
import manuscripts from '@/routes/manuscripts';
import reviewer from '@/routes/reviewer';
import users from '@/routes/users';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

const navigationMap = {
    super_admin: [
        {
            href: admin.institutions.index.url(),
            label: 'Institutions',
            icon: Building2,
        },
        { href: admin.journals.index.url(), label: 'Journals', icon: BookOpen },
        {
            href: '/admin/announcements',
            label: 'Announcements',
            icon: Megaphone,
        },
        { href: '/admin/journal-users', label: 'Journal Users', icon: Users },
        { href: '/admin/plugins', label: 'Plugins', icon: Puzzle },
        { href: users.index.url(), label: 'User Management', icon: UserCheck },
        {
            href: '/admin/platform-settings',
            label: 'Platform Settings',
            icon: Settings,
        },
    ],
    managing_editor: [
        {
            href: editor.dashboard.url(),
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            href: editor.indexManuscripts.url(),
            label: 'Submitted Manuscripts',
            icon: FileText,
        },
        {
            href: issues.index.url(),
            label: 'Journal Issues',
            icon: AlertCircle,
        },
        {
            href: '/admin/announcements',
            label: 'Announcements',
            icon: Megaphone,
        },
        { href: '/admin/journal-users', label: 'Journal Users', icon: Users },
        { href: users.index.url(), label: 'User Management', icon: UserCheck },
    ],
    editor_in_chief: [
        {
            href: editor.dashboard.url(),
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            href: editor.indexManuscripts.url(),
            label: 'Submitted Manuscripts',
            icon: FileText,
        },
        {
            href: issues.index.url(),
            label: 'Journal Issues',
            icon: AlertCircle,
        },
        {
            href: '/admin/announcements',
            label: 'Announcements',
            icon: Megaphone,
        },
        { href: '/admin/journal-users', label: 'Journal Users', icon: Users },
        { href: users.index.url(), label: 'User Management', icon: UserCheck },
    ],
    associate_editor: [
        {
            href: editor.dashboard.url(),
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            href: editor.indexManuscripts.url(),
            label: 'Submitted Manuscripts',
            icon: FileText,
        },
        {
            href: issues.index.url(),
            label: 'Journal Issues',
            icon: AlertCircle,
        },
        { href: users.index.url(), label: 'User Management', icon: UserCheck },
    ],
    language_editor: [
        {
            href: editor.dashboard.url(),
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            href: editor.indexManuscripts.url(),
            label: 'Submitted Manuscripts',
            icon: FileText,
        },
        {
            href: issues.index.url(),
            label: 'Journal Issues',
            icon: AlertCircle,
        },
        { href: users.index.url(), label: 'User Management', icon: UserCheck },
    ],
    author: [
        {
            href: author.dashboard.url(),
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            href: manuscripts.index.url(),
            label: 'Manuscript Tracking',
            icon: FileText,
        },
        {
            href: manuscripts.create.url(),
            label: 'New Submission',
            icon: FilePlus,
        },
    ],
    reviewer: [
        {
            href: reviewer.dashboard.url(),
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            href: reviewer.manuscripts.index.url(),
            label: 'Manuscripts for Review',
            icon: FileText,
        },
    ],
};

function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(() =>
        typeof window !== 'undefined'
            ? localStorage.getItem('theme') === 'dark'
            : false,
    );

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return { isDarkMode, toggleDarkMode };
}

function useSidebarState() {
    // Read cookie synchronously during initial render to prevent flash
    const getInitialState = () => {
        if (typeof document === 'undefined') {
return true;
} // SSR fallback

        const cookies = document.cookie.split(';');
        const sidebarCookie = cookies.find((cookie) =>
            cookie.trim().startsWith('sidebar_state='),
        );

        if (sidebarCookie) {
            const value = sidebarCookie.split('=')[1];

            return value === 'true';
        }

        return true; // Default to open if no cookie found
    };

    return getInitialState();
}

export default function AppLayout({
    children,
    breadcrumbItems,
}: PropsWithChildren<{
    header?: ReactNode;
    breadcrumbItems?: BreadcrumbItem[];
}>) {
    const { auth } = usePage<PageProps>().props;
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const sidebarDefaultOpen = useSidebarState();

    return (
        <SidebarProvider defaultOpen={sidebarDefaultOpen}>
            <AppSidebar
                user={{
                    ...auth.user,
                    role: auth.user.role ?? 'author',
                }}
                navigationMap={navigationMap}
            />

            <SidebarInset className="flex min-h-screen flex-col">
                {/* Inline Header logic */}
                <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 supports-backdrop-filter:bg-background/60">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <div className="flex flex-1 items-center space-x-4">
                        <div className="flex flex-1 flex-col space-y-1">
                            {breadcrumbItems && breadcrumbItems.length > 0 && (
                                <Breadcrumb items={breadcrumbItems} />
                            )}
                        </div>
                    </div>

                    {/* Inline HeaderActions logic */}
                    <div className="flex items-center space-x-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NotificationDropdown />
                            </TooltipTrigger>
                            <TooltipContent
                                side="bottom"
                                className="border bg-popover text-sm shadow-lg"
                            >
                                <p>Notifications</p>
                            </TooltipContent>
                        </Tooltip>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            title={
                                isDarkMode
                                    ? 'Switch to light mode'
                                    : 'Switch to dark mode'
                            }
                        >
                            {isDarkMode ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </header>

                <main className="min-h-0 flex-1 bg-background transition-colors duration-300">
                    <div className="h-full p-4 sm:p-6 lg:p-8 [&:has(.manuscript-viewer)]:p-0">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
