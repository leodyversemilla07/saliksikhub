import React, { useState, useEffect, PropsWithChildren, ReactNode } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Moon,
    Sun,
    FileText,
    FilePlus,
    UserCheck,
    LayoutDashboard,
    AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip';
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset
} from '@/components/ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import { AuthenticatedSidebar } from '@/components/layout/authenticated-sidebar';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

const navigationMap = {
    editor: [
        { href: 'editor.dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: 'editor.indexManuscripts', label: 'Submitted Manuscripts', icon: FileText },
        { href: 'issues.index', label: 'Journal Issues', icon: AlertCircle },
        { href: 'editor.users.index', label: 'User Management', icon: UserCheck },
    ],
    author: [
        { href: 'author.dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: 'manuscripts.index', label: 'Manuscript Tracking', icon: FileText },
        { href: 'manuscripts.create', label: 'New Submission', icon: FilePlus },
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

interface HeaderProps {
    header?: ReactNode;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    breadcrumbItems?: BreadcrumbItem[];
}

interface HeaderActionsProps {
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

function Header({ toggleDarkMode, isDarkMode, breadcrumbItems }: HeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-sidebar px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex items-center space-x-4 flex-1">
                <div className="flex flex-col space-y-1 flex-1">
                    {breadcrumbItems && breadcrumbItems.length > 0 && (
                        <Breadcrumb className="mb-0">
                            <BreadcrumbList>
                                {breadcrumbItems.map((item, index) => {
                                    const isLast = index === breadcrumbItems.length - 1;
                                    const maxLength = 30;
                                    const label =
                                        item.label.length > maxLength
                                            ? `${item.label.substring(0, maxLength)}...`
                                            : item.label;

                                    return (
                                        <React.Fragment key={index}>
                                            <BreadcrumbItem>
                                                {item.href && !isLast ? (
                                                    <BreadcrumbLink
                                                        asChild
                                                        className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
                                                        title={item.label}
                                                    >
                                                        <Link href={item.href}>{label}</Link>
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <BreadcrumbPage
                                                        className="text-sidebar-foreground font-medium"
                                                        title={item.label}
                                                    >
                                                        {label}
                                                    </BreadcrumbPage>
                                                )}
                                            </BreadcrumbItem>
                                            {!isLast && (
                                                <BreadcrumbSeparator className="text-sidebar-foreground/50" />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    )}
                </div>
            </div>

            <HeaderActions toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        </header>
    );
}

function HeaderActions({ toggleDarkMode, isDarkMode }: HeaderActionsProps) {
    return (
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
    );
}


export default function AuthenticatedLayout({
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
            <AuthenticatedSidebar
                user={auth.user}
                navigationMap={navigationMap}
            />

            <SidebarInset className="flex flex-col min-h-screen">
                <Header
                    toggleDarkMode={toggleDarkMode}
                    isDarkMode={isDarkMode}
                    breadcrumbItems={breadcrumbItems}
                />

                <main className="flex-1 bg-background transition-colors duration-300 min-h-0">
                    <div className="p-4 sm:p-6 lg:p-8 h-full">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
