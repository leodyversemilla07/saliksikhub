import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Bell,
    CheckCircle,
    ChevronDown,
    FileText,
    Home,
    Menu,
    Plus,
    Settings,
    Upload,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState, ComponentType } from 'react';

// Types for Inertia `usePage` props
interface AuthUser {
    firstname: string;
    lastname: string;
}

interface AuthProps {
    user: AuthUser; // Ensure 'user' is required to avoid undefined errors
    roles?: string[];
}

interface CustomPageProps {
    auth: AuthProps;
}

// Override Inertia default `PageProps` to include custom types
declare module '@inertiajs/core' {
    interface PageProps extends CustomPageProps { }
}

const Authenticated = ({ header, children }: PropsWithChildren<{ header?: ReactNode }>) => {
    const { auth } = usePage<PageProps>().props; // Use the extended type
    const user = auth.user; // `user` is now guaranteed to exist
    const userRoles = auth.roles || [];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const dashboardRoutes: Record<string, string> = {
        admin: route('admin.dashboard'),
        editor: route('editor.dashboard'),
        reviewer: route('reviewer.dashboard'),
        author: route('author.dashboard'),
    };

    const getDashboardRoute = () => {
        for (const role of userRoles) {
            if (dashboardRoutes[role]) return dashboardRoutes[role];
        }
        return route('dashboard');
    };

    const SidebarLink = ({
        href,
        active,
        icon: Icon,
        label,
        roles = [],
    }: {
        href: string;
        active: boolean;
        icon: ComponentType;
        label: string;
        roles?: string[];
    }) => {
        const isAccessible = roles.length === 0 || roles.some((role) => userRoles.includes(role));
        if (!isAccessible) return null;
        return (
            <NavLink
                href={href}
                active={active}
                className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-700"
            >
                <Icon />
                {label}
            </NavLink>
        );
    };

    const UserDropdown = ({ user }: { user: AuthUser }) => (
        <Dropdown>
            <Dropdown.Trigger>
                <button className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings />
                    {`${user.firstname} ${user.lastname}`}
                    <ChevronDown />
                </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                <Dropdown.Link href={route('logout')} method="post" as="button">
                    Log Out
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                <div className="flex h-16 items-center justify-between px-4 bg-green-600 text-white">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo className="h-9 w-auto fill-current text-white" />
                        <span className="ml-3 text-lg font-bold">SaliksikHub</span>
                    </Link>
                    <button
                        className="lg:hidden focus:outline-none"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <Menu />
                    </button>
                </div>
                <nav className="flex flex-col mt-4 space-y-1 px-4">
                    <SidebarLink
                        href={route('author.dashboard')}
                        active={route().current('author.dashboard')}
                        icon={Home}
                        label="Dashboard"
                        roles={['author']}
                    />
                    <SidebarLink
                        href={route('manuscripts.create')}
                        active={route().current('manuscripts.create')}
                        icon={Plus}
                        label="New Submissions"
                        roles={['author']}
                    />
                    <SidebarLink
                        href={route('manuscripts.index')}
                        active={route().current('manuscripts.index')}
                        icon={FileText}
                        label="Manuscript Tracking"
                        roles={['author']}
                    />
                    <SidebarLink
                        href={route('articles.index')}
                        active={route().current('articles.index')}
                        icon={CheckCircle}
                        label="Published Papers"
                        roles={['author']}
                    />
                    <SidebarLink
                        href={route('manuscripts.revisions')}
                        active={route().current('manuscripts.revisions')}
                        icon={Upload}
                        label="Revision Required"
                        roles={['author']}
                    >
                    </SidebarLink>
                    <SidebarLink
                        href={route('manuscripts.indexAIPrereviewed')}
                        active={route().current('manuscripts.indexAIPrereviewed')}
                        icon={Activity}
                        label="AI Review Reports"
                        roles={['author']}
                    >
                    </SidebarLink>
                    {/* <SidebarLink
                        href={route('manuscripts.revisions')}
                        active={route().current('manuscripts.revisions')}
                        icon={Bell}
                        label="Notifications"
                        roles={['author']}
                    >
                    </SidebarLink> */}
                </nav>
                <div className="mt-auto px-4 py-4 border-t border-gray-200">
                    <UserDropdown user={user} />
                </div>
            </div>
            <div className="flex flex-1 flex-col lg:ml-64">
                <div className="flex h-16 items-center bg-white shadow lg:hidden">
                    <button
                        className="ml-4 focus:outline-none"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <Menu />
                    </button>
                    <h1 className="ml-4 text-lg font-medium text-gray-800">{header}</h1>
                </div>
                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}
                <main className="flex-1 p-4">{children}</main>
            </div>
        </div>
    );
};

export default Authenticated;
