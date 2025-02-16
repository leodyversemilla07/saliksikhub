import { useState } from 'react';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface HeaderProps {
    auth?: PageProps['auth'];
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
        const userRoles = auth?.roles || [];
        if (userRoles.includes(UserRole.Admin)) return route('admin.dashboard');
        if (userRoles.includes(UserRole.Editor)) return route('editor.dashboard');
        if (userRoles.includes(UserRole.Reviewer)) return route('reviewer.dashboard');
        if (userRoles.includes(UserRole.Author)) return route('author.dashboard');
        return route('dashboard');
    };

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                    >
                        <ApplicationLogo
                            className="transition-transform"
                            width={48}
                            height={48}
                            alt="MinSU Research Journal Logo"
                        />
                        <span className="text-xl font-bold bg-gradient-to-r from-[#18652c] via-[#2a8d44] to-[#3fb65e] bg-clip-text text-transparent">
                            MinSU Research Journal
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <NavLink key={item.name} href={item.href}>
                                {item.name}
                            </NavLink>
                        ))}

                        <div className="ml-4 flex items-center gap-4">
                            {auth?.user ? (
                                <Link
                                    href={getDashboardRoute()}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-[#18652c] to-[#3fb65e] text-white font-semibold transition-colors duration-300 hover:from-[#145024] hover:to-[#35a051]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-[#18652c] transition-colors duration-300 border-2 border-transparent hover:border-gray-200 active:bg-gray-100"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-[#18652c] to-[#3fb65e] text-white font-semibold transition-colors duration-300 hover:from-[#145024] hover:to-[#35a051]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-[#18652c] transition-colors duration-300"
                        aria-label="Navigation menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-7 h-7 stroke-[2.5]" />
                        ) : (
                            <Menu className="w-7 h-7 stroke-[2.5]" />
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden animate-slideDownFade">
                    <div className="px-4 pb-4 space-y-1">
                        {navItems.map((item) => (
                            <MobileNavLink key={item.name} href={item.href}>
                                {item.name}
                            </MobileNavLink>
                        ))}

                        <div className="pt-4 space-y-1 border-t border-gray-200">
                            {auth?.user ? (
                                <MobileNavLink href={getDashboardRoute()}>
                                    Dashboard
                                </MobileNavLink>
                            ) : (
                                <>
                                    <MobileNavLink href={route("login")}>
                                        Log in
                                    </MobileNavLink>
                                    <MobileNavLink href={route("register")}>
                                        Register
                                    </MobileNavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const { url } = usePage();
    const isActive = url === href;

    return (
        <Link
            href={href}
            className={`
                relative font-medium transition-all duration-300 px-2 py-1
                ${isActive ? 'text-[#18652c] font-semibold' : 'text-gray-600 hover:text-[#18652c]'}
                before:absolute before:-bottom-1 before:left-1/2 before:w-0 before:h-[2px] 
                before:bg-[#3fb65e] before:transition-all before:duration-500 before:-translate-x-1/2
                hover:before:w-full
                ${isActive ? 'before:w-full' : ''}
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
                block px-4 py-3 rounded-xl font-medium transition-colors duration-300
                ${isActive
                    ? 'bg-[#18652c] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'}
            `}
        >
            {children}
        </Link>
    );
};