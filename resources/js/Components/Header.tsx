import { useState } from 'react';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
    auth: PageProps['auth'];
}

enum UserRole {
    Admin = 'admin',
    Editor = 'editor',
    Reviewer = 'reviewer',
    Author = 'author',
}

const navItems = [
    { name: "Home", href: "/" },
    { name: "Current", href: "/current" },
    { name: "Submissions", href: "/submissions" },
    { name: "Archives", href: "/archives" },
    { name: "Editorial Board", href: "/editorial-board" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
]

export default function Header({ auth }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const getDashboardRoute = () => {
        const userRoles = auth.roles;

        if (userRoles.includes(UserRole.Admin)) {
            return route('admin.dashboard');
        } else if (userRoles.includes(UserRole.Editor)) {
            return route('editor.dashboard');
        } else if (userRoles.includes(UserRole.Reviewer)) {
            return route('reviewer.dashboard');
        } else if (userRoles.includes(UserRole.Author)) {
            return route('author.dashboard');
        }
        return route('dashboard');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4 md:py-6">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <img
                                src='storage/images/logo.png'
                                alt="MinSU Research Journal Logo"
                                width={40}
                                height={40}
                                className="mr-3"
                            />
                            <span className="text-xl md:text-2xl font-bold text-[#18652c] hover:text-[#3fb65e] transition duration-150">
                                MinSU Research Journal
                            </span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <NavLink key={item.name} href={item.href}>
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={getDashboardRoute()}
                                className="text-sm font-medium text-white bg-[#18652c] hover:bg-[#3fb65e] px-4 py-2 rounded-md transition duration-150"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="text-sm font-medium text-[#18652c] hover:text-[#3fb65e] transition duration-150"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="text-sm font-medium text-white bg-[#18652c] hover:bg-[#3fb65e] px-4 py-2 rounded-md transition duration-150"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-[#18652c] hover:text-[#3fb65e] hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#3fb65e]"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {
                isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <MobileNavLink key={item.name} href={item.href}>
                                    {item.name}
                                </MobileNavLink>
                            ))}
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="px-2 space-y-1">
                                {auth.user ? (
                                    <MobileNavLink href={getDashboardRoute()}>Dashboard</MobileNavLink>
                                ) : (
                                    <>
                                        <MobileNavLink href={route("login")}>Log in</MobileNavLink>
                                        <MobileNavLink href={route("register")}>Register</MobileNavLink>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </header >
    );
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const { url } = usePage();
    const isActive = url === href;

    return (
        <Link
            href={href}
            className={`
                text-sm font-medium text-[#18652c] hover:text-[#3fb65e] transition duration-150
                relative pb-2
                ${isActive ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#18652c]' : ''}
            `}
        >
            {children}
        </Link>
    );
};

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const { url } = usePage();
    const isActive = url === href;

    return (
        <Link
            href={href}
            className={`
                block px-3 py-2 rounded-md text-base font-medium text-[#18652c] hover:text-[#3fb65e] hover:bg-gray-50 transition duration-150
                ${isActive ? 'border-l-4 border-[#18652c]' : ''}
            `}
        >
            {children}
        </Link>
    );
};
