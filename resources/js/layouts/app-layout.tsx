import { useState, useEffect, PropsWithChildren } from 'react';
import type { ReactNode } from 'react';
import Breadcrumb from '@/components/breadcrumb';
import { SidebarTrigger, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '@/components/notification-dropdown';
import { Moon, Sun, FileText, FilePlus, UserCheck, LayoutDashboard, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { AppSidebar } from '@/components/app-sidebar';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

const navigationMap = {
    managing_editor: [
        { href: 'editor.dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: 'editor.indexManuscripts', label: 'Submitted Manuscripts', icon: FileText },
        { href: 'issues.index', label: 'Journal Issues', icon: AlertCircle },
        { href: 'users.index', label: 'User Management', icon: UserCheck },
    ],
    editor_in_chief: [
        { href: 'editor.dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: 'editor.indexManuscripts', label: 'Submitted Manuscripts', icon: FileText },
        { href: 'issues.index', label: 'Journal Issues', icon: AlertCircle },
        { href: 'users.index', label: 'User Management', icon: UserCheck },
    ],
    associate_editor: [
        { href: 'editor.dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: 'editor.indexManuscripts', label: 'Submitted Manuscripts', icon: FileText },
        { href: 'issues.index', label: 'Journal Issues', icon: AlertCircle },
        { href: 'users.index', label: 'User Management', icon: UserCheck },
    ],
    language_editor: [
        { href: 'editor.dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: 'editor.indexManuscripts', label: 'Submitted Manuscripts', icon: FileText },
        { href: 'issues.index', label: 'Journal Issues', icon: AlertCircle },
        { href: 'users.index', label: 'User Management', icon: UserCheck },
    ],
    author: [
        { href: 'author.dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: 'manuscripts.index', label: 'Manuscript Tracking', icon: FileText },
        { href: 'manuscripts.create', label: 'New Submission', icon: FilePlus },
    ],
    reviewer: [
        { href: 'reviewer.dashboard', label: 'Dashboard', icon: LayoutDashboard },
        // Add more reviewer links here as needed
    ]
};

function useDarkMode() {
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

    return { isDarkMode, toggleDarkMode };
}

function useSidebarState() {
    // Read cookie synchronously during initial render to prevent flash
    const getInitialState = () => {
        if (typeof document === 'undefined') return true; // SSR fallback

        const cookies = document.cookie.split(';');
        const sidebarCookie = cookies.find(cookie =>
            cookie.trim().startsWith('sidebar_state=')
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

            <SidebarInset className="flex flex-col min-h-screen">
                {/* Inline Header logic */}
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-sidebar px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="flex flex-col space-y-1 flex-1">
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
                            <TooltipContent side="bottom" className="bg-popover border text-sm shadow-lg">
                                <p>Notifications</p>
                            </TooltipContent>
                        </Tooltip>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/70 rounded-full"
                        >
                            <div className="relative w-5 h-5 flex items-center justify-center">
                                <Sun className={cn(
                                    "absolute transition-transform duration-500 ease-in-out",
                                    isDarkMode ? "scale-0 rotate-[-180deg]" : "scale-100 rotate-0"
                                )} />
                                <Moon className={cn(
                                    "absolute transition-transform duration-500 ease-in-out",
                                    isDarkMode ? "scale-100 rotate-0" : "scale-0 rotate-180"
                                )} />
                            </div>
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 bg-background transition-colors duration-300 min-h-0">
                    <div className="p-4 sm:p-6 lg:p-8 h-full [&:has(.manuscript-viewer)]:p-0">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
