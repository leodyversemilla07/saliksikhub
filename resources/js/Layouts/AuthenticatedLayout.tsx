import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { Activity, Bell, CheckCircle, ChevronDown, FilePlus, FileText, Home, LayoutDashboard, Menu, Plus, Settings, Upload } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const userRoles = usePage().props.auth.roles; // Get user roles
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Determine dashboard route based on user roles
    const getDashboardRoute = () => {
        if (userRoles.includes('admin')) {
            return route('admin.dashboard'); // Admin dashboard
        } else if (userRoles.includes('editor')) {
            return route('editor.dashboard'); // Editor dashboard
        } else if (userRoles.includes('reviewer')) {
            return route('reviewer.dashboard'); // Reviewer dashboard
        } else if (userRoles.includes('author')) {
            return route('author.dashboard'); // Author dashboard
        }
        return route('dashboard'); // Default dashboard
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 z-30 w-64 bg-white shadow-md transform transition-transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between px-4 bg-green-600 text-white">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo className="h-9 w-auto fill-current text-white" />
                        <span className="ml-3 text-lg font-bold">
                            SaliksikHub
                        </span>
                    </Link>
                    <button
                        className="lg:hidden focus:outline-none"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Sidebar Links */}
                <nav className="flex flex-col mt-4 space-y-1 px-4">
                    <NavLink
                        href={getDashboardRoute()}
                        active={route().current(getDashboardRoute())}
                        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-700"
                    >
                        <Home />
                        Dashboard
                    </NavLink>
                    <NavLink
                        href={route('manuscripts.create')}
                        active={route().current('manuscripts.create')}
                        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-700"
                    >
                        <Plus />
                        New Submissions
                    </NavLink>
                    <NavLink
                        href={route('manuscripts.index')}
                        active={route().current('manuscripts.index')}
                        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-700"
                    >
                        <FileText />
                        Manuscript Tracking
                    </NavLink>
                    <NavLink
                        href=''
                        active={route().current('manuscripts.show')}
                        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-700"
                    >
                        <CheckCircle  />
                        Published Papers
                    </NavLink>
                    <NavLink
                        href=''
                        active={route().current('manuscripts.show')}
                        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-700"
                    >
                        <Upload />
                        Revision Required
                    </NavLink>
                    <NavLink
                        href=''
                        active={route().current('manuscripts.show')}
                        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-700"
                    >
                        <Activity  />
                        AI Review Reports
                    </NavLink>
                    <NavLink
                        href=''
                        active={route().current('manuscripts.show')}
                        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-700"
                    >
                        <Bell  />
                        Notifications
                    </NavLink>
                </nav>

                {/* Sidebar Footer */}
                <div className="mt-auto px-4 py-4 border-t border-gray-200">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Settings />
                                {`${user.firstname} ${user.lastname}`}
                                <ChevronDown />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col lg:ml-64">
                {/* Mobile Header */}
                <div className="flex h-16 items-center bg-white shadow lg:hidden">
                    <button
                        className="ml-4 focus:outline-none"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu />
                    </button>
                    <h1 className="ml-4 text-lg font-medium text-gray-800">
                        {header}
                    </h1>
                </div>

                {/* Header */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4">{children}</main>
            </div>
        </div>
    );
}
