import { useState, useEffect, PropsWithChildren, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    FileText,
    FilePlus,
    UserCheck,
    LayoutDashboard,
    AlertCircle,
} from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AuthenticatedSidebar } from '@/components/layout/authenticated-sidebar';
import { Header } from '@/components/layout/header';

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
                    <div className="p-4 sm:p-6 lg:p-8 h-full [&:has(.manuscript-viewer)]:p-0">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
