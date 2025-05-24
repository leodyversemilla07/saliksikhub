import { useState, useEffect, PropsWithChildren, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Moon,
    Sun,
    Menu,
    FileText,
    FilePlus,
    UserCheck,
    LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import { UserDropdown } from '@/components/layout/user-dropdown';
import { AuthenticatedSidebar } from '@/components/layout/authenticated-sidebar';
import { Breadcrumb } from '@/components/breadcrumb';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

const navigationMap = {
    editor: [
        { href: 'editor.dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: 'editor.indexManuscripts', label: 'Submitted Manuscripts', icon: FileText },
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
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebarCollapsed') === 'true';
        }
        return false;
    });
    const [isLayoutTransitioning, setIsLayoutTransitioning] = useState(false);

    const toggleDesktopSidebar = () => {
        const newState = !isDesktopSidebarCollapsed;
        setIsLayoutTransitioning(true);
        setIsDesktopSidebarCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', newState.toString());

        setTimeout(() => {
            setIsLayoutTransitioning(false);
        }, 300);
    };

    return {
        isMobileSidebarOpen,
        isDesktopSidebarCollapsed,
        isLayoutTransitioning,
        openMobileSidebar: () => setIsMobileSidebarOpen(true),
        closeMobileSidebar: () => setIsMobileSidebarOpen(false),
        toggleDesktopSidebar
    };
}

interface HeaderProps {
    header?: ReactNode;
    openMobileSidebar: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    breadcrumbItems?: BreadcrumbItem[];
}

interface HeaderActionsProps {
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

function Header({ header, openMobileSidebar, toggleDarkMode, isDarkMode, breadcrumbItems }: HeaderProps) {
    return (
        <header className="fixed top-0 right-0 left-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm z-20 transition-all duration-300 ease-out"
            style={{
                left: 'var(--sidebar-width, 0px)',
                width: 'calc(100% - var(--sidebar-width, 0px))'
            }}>
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between w-full">
                <div className="flex items-center space-x-4 flex-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        onClick={openMobileSidebar}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                    </Button>

                    <div className="flex flex-col space-y-1 flex-1">
                        {header && (
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                {header}
                            </div>
                        )}
                        {breadcrumbItems && breadcrumbItems.length > 0 && (
                            <Breadcrumb 
                                items={breadcrumbItems} 
                                className="mb-0 text-xl font-bold text-green-600 dark:text-green-400"
                                maxLength={30}
                            />
                        )}
                    </div>
                </div>

                <HeaderActions toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            </div>
        </header>
    );
}

function HeaderActions({ toggleDarkMode, isDarkMode }: HeaderActionsProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    return (
        <div className="flex items-center space-x-3">
            <Tooltip>
                <TooltipTrigger asChild>
                    <NotificationDropdown />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm shadow-lg">
                    <p>Notifications</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDarkMode}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
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
                </TooltipTrigger>
                <TooltipContent
                    side="bottom"
                    align="end"
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm shadow-lg px-3 py-1.5 rounded-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 duration-300"
                    sideOffset={8}
                    avoidCollisions={true}
                >
                    <p className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-200">
                        {isDarkMode ? "Switch to Light mode" : "Switch to Dark mode"}
                    </p>
                </TooltipContent>
            </Tooltip>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <UserDropdown user={user} />
        </div>
    );
}


export default function AuthenticatedLayout({
    header,
    children,
    breadcrumbItems,
}: PropsWithChildren<{ 
    header?: ReactNode;
    breadcrumbItems?: BreadcrumbItem[];
}>) {
    const { auth } = usePage<PageProps>().props;
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const {
        isMobileSidebarOpen,
        isDesktopSidebarCollapsed,
        openMobileSidebar,
        closeMobileSidebar,
        toggleDesktopSidebar
    } = useSidebarState();

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--sidebar-width',
            window.innerWidth < 1024 ? '0px' : (isDesktopSidebarCollapsed ? '5rem' : '20rem')
        );

        const handleResize = () => {
            document.documentElement.style.setProperty(
                '--sidebar-width',
                window.innerWidth < 1024 ? '0px' : (isDesktopSidebarCollapsed ? '5rem' : '20rem')
            );
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isDesktopSidebarCollapsed]);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <AuthenticatedSidebar
                user={auth.user}
                navigationMap={navigationMap}
                isMobileOpen={isMobileSidebarOpen}
                isDesktopCollapsed={isDesktopSidebarCollapsed}
                closeMobileSidebar={closeMobileSidebar}
                toggleDesktopSidebar={toggleDesktopSidebar}
            />

            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300 ease-out",
                isDesktopSidebarCollapsed ? "lg:ml-20" : "lg:ml-80"
            )}
                style={{
                    transitionTimingFunction: isDesktopSidebarCollapsed ?
                        "cubic-bezier(0.4, 0.0, 0.2, 1)" :
                        "cubic-bezier(0.05, 0.7, 0.1, 1.0)"
                }}
            >
                <Header
                    header={header}
                    openMobileSidebar={openMobileSidebar}
                    toggleDarkMode={toggleDarkMode}
                    isDarkMode={isDarkMode}
                    breadcrumbItems={breadcrumbItems}
                />

                <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-16">
                    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 h-full overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

