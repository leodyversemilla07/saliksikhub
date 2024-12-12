import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Bell,
    BookOpen,
    CheckCircle,
    ChevronDown,
    FileText,
    Home,
    Menu,
    Plus,
    Settings,
    Upload,
    User,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState, ComponentType } from 'react';

// Types for Inertia `usePage` props
interface AuthUser {
    firstname: string;
    lastname: string;
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

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const userRoles = auth.roles || [];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const SidebarLink = ({
        href,
        active,
        icon: Icon,
        label,
        roles = [],
    }: {
        href: string;
        active: boolean;
        icon: ComponentType<any>;
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
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
            </NavLink>
        );
    };

    const UserDropdown = ({ user }: { user: AuthUser }) => (
        <Dropdown>
            <Dropdown.Trigger>
                <button className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-5 w-5" />
                    <span className="mx-2 font-medium">{`${user.firstname} ${user.lastname}`}</span>
                    <ChevronDown className="h-4 w-4" />
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

    const links = [
        // Author Links
        { href: 'author.dashboard', label: 'Dashboard', icon: Home, roles: ['author'] },
        { href: 'manuscripts.create', label: 'New Submissions', icon: Plus, roles: ['author'] },
        { href: 'manuscripts.index', label: 'Manuscript Tracking', icon: FileText, roles: ['author'] },
        { href: 'articles.index', label: 'Published Papers', icon: CheckCircle, roles: ['author'] },
        { href: 'manuscripts.revisions', label: 'Revision Required', icon: Upload, roles: ['author'] },
        { href: 'manuscripts.indexAIPrereviewed', label: 'AI Review Reports', icon: Activity, roles: ['author'] },

        // Editor Links
        { href: 'editor.dashboard', label: 'Dashboard', icon: Home, roles: ['editor'] },
        { href: 'editor.indexManuscripts', label: 'Submitted Manuscripts', icon: BookOpen, roles: ['editor'] },
        { href: 'editor.reviewer.assign', label: 'Assign Reviewer', icon: User, roles: ['editor'] },

        // Reviewer Links
        { href: 'reviewer.dashboard', label: 'Dashboard', icon: Home, roles: ['reviewer'] },
        { href: 'reviewer.manuscripts.toReview', label: 'Review Manuscripts', icon: FileText, roles: ['reviewer'] },

        // Admin Links
        { href: 'admin.dashboard', label: 'Dashboard', icon: Home, roles: ['admin'] },
        { href: 'admin.manageUsers', label: 'User Management', icon: User, roles: ['admin'] },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                <div className="flex h-16 items-center justify-between px-4 bg-green-700 text-white">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo className="h-9 w-auto fill-current text-white" />
                        <span className="ml-3 text-lg font-bold">SaliksikHub</span>
                    </Link>
                    <button
                        className="lg:hidden focus:outline-none"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex flex-col mt-4 space-y-1 px-4">
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
                <div className="mt-auto px-4 py-4 border-t border-gray-200">
                    <UserDropdown user={user} />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col lg:ml-64">
                <div className="flex h-16 items-center bg-white shadow-md lg:hidden">
                    <button
                        className="ml-4 focus:outline-none"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="ml-4 text-lg font-medium text-gray-800">{header}</h1>
                </div>
                {header && (
                    <header className="bg-white shadow-md">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}
                <main className="flex-1 p-6 bg-gray-50">{children}</main>
            </div>
        </div>
    );
}
