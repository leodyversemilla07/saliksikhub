import { useState, useEffect, useRef } from 'react';
import { PageProps, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, ChevronDown, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface HeaderProps {
    auth?: PageProps['auth'];
}

const navItems = [
    { name: "Home", href: route('home') },
    { name: "Current", href: route('current') },
    {
        name: "About",
        children: [
            { name: "Submissions", href: route('submissions') },
            { name: "Editorial Board", href: route('editorial-board') },
            { name: "About Us", href: route('about-us') },
            { name: "Contact Us", href: route('contact-us') },
        ]
    },
    { name: "Archives", href: route('archives') },
]

const UserAvatar = ({ user }: { user: User }) => (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#18652c] to-[#3fb65e] flex items-center justify-center text-white font-semibold">
        {`${user.firstname?.charAt(0).toUpperCase() || ''}${user.lastname?.charAt(0).toUpperCase() || 'U'}`}
    </div>
);

export default function Header({ auth }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [navDropdownOpen, setNavDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navDropdownRef = useRef<HTMLDivElement>(null);
    const { url } = usePage();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
            if (navDropdownRef.current && !navDropdownRef.current.contains(event.target as Node)) {
                setNavDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    const getDashboardRoute = (userRole: string) => {
        try {
            if (userRole === 'editor') {
                return route('editor.dashboard');
            } else if (userRole === 'author') {
                return route('author.dashboard');
            } else {
                return route('dashboard');
            }
        } catch (error) {
            console.warn('Dashboard route error:', error);
            return userRole === 'editor' ? '/editor/dashboard' : '/manuscripts';
        }
    };

    const isNavLinkActive = (href: string): boolean => url.startsWith(href.split('?')[0]);

    const isNavDropdownActive = (children: { name: string, href: string }[]): boolean => {
        return children.some(child => isNavLinkActive(child.href));
    };

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link
                        href={route('home')}
                        className="flex flex-col items-center group focus:outline-none"
                    >
                        <ApplicationLogo
                            className="transition-transform group-hover:scale-105"
                            width={42}
                            height={42}
                            alt="MinSU Research Journal Logo"
                        />
                        <span className="text-sm font-bold bg-gradient-to-r from-[#18652c] via-[#2a8d44] to-[#3fb65e] bg-clip-text text-transparent mt-1">
                            MinSU Research Journal
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            'children' in item ? (
                                <NavDropdown
                                    key={item.name}
                                    name={item.name}
                                    children={item.children as { name: string, href: string }[]}
                                    isActive={isNavDropdownActive(item.children as { name: string, href: string }[])}
                                    isOpen={navDropdownOpen}
                                    setIsOpen={setNavDropdownOpen}
                                    dropdownRef={navDropdownRef}
                                    isNavLinkActive={isNavLinkActive}
                                />
                            ) : (
                                <NavLink
                                    key={item.name}
                                    href={item.href}
                                    isActive={isNavLinkActive(item.href)}
                                >
                                    {item.name}
                                </NavLink>
                            )
                        ))}

                        <div className="ml-4 flex items-center gap-4">
                            {auth?.user ? (
                                <UserDropdown
                                    user={auth.user}
                                    dropdownOpen={dropdownOpen}
                                    setDropdownOpen={setDropdownOpen}
                                    dropdownRef={dropdownRef}
                                    getDashboardRoute={getDashboardRoute}
                                />
                            ) : (
                                <AuthButtons />
                            )}
                        </div>
                    </nav>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-[#18652c] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-50"
                        aria-expanded={isMenuOpen}
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
                <MobileMenu
                    navItems={navItems}
                    auth={auth}
                    closeMenu={() => setIsMenuOpen(false)}
                    getDashboardRoute={getDashboardRoute}
                    isNavLinkActive={isNavLinkActive}
                />
            )}
        </header>
    );
}


const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
    <Link
        href={href}
        className={`
            relative font-medium transition-all duration-300 px-2 py-1.5 rounded-md text-center
            ${isActive ? 'text-[#18652c] font-semibold' : 'text-gray-600 hover:text-[#18652c]'}
            before:absolute before:-bottom-1 before:left-1/2 before:w-0 before:h-[2px] 
            before:bg-[#3fb65e] before:transition-all before:duration-500 before:-translate-x-1/2
            hover:before:w-full active:before:w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-100
            ${isActive ? 'before:w-full' : ''}
        `}
        aria-current={isActive ? 'page' : undefined}
    >
        {children}
    </Link>
);

const NavDropdown = ({
    name,
    children,
    isActive,
    isOpen,
    setIsOpen,
    dropdownRef,
    isNavLinkActive
}: {
    name: string;
    children: { name: string, href: string }[];
    isActive: boolean;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    isNavLinkActive: (href: string) => boolean;
}) => (
    <div className="relative" ref={dropdownRef}>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
                relative flex items-center gap-1 font-medium transition-all duration-300 px-2 py-1.5 rounded-md
                ${isActive ? 'text-[#18652c] font-semibold' : 'text-gray-600 hover:text-[#18652c]'}
                before:absolute before:-bottom-1 before:left-1/2 before:w-0 before:h-[2px] 
                before:bg-[#3fb65e] before:transition-all before:duration-500 before:-translate-x-1/2
                hover:before:w-full active:before:w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-100
                ${isActive ? 'before:w-full' : ''}
            `}
            aria-expanded={isOpen}
            aria-haspopup="true"
        >
            {name}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
            <div className="absolute left-0 mt-1 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 py-1 animate-fadeIn">
                {children.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`
                            block px-4 py-2 text-sm focus:outline-none focus-visible:bg-gray-50
                            ${isNavLinkActive(item.href)
                                ? 'text-[#18652c] font-semibold bg-gray-50'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#18652c]'
                            }
                        `}
                        onClick={() => setIsOpen(false)}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        )}
    </div>
);

const MobileNavLink = ({ href, children, isActive, onClick }: {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
    onClick?: () => void
}) => (
    <Link
        href={href}
        className={`
            flex items-center px-4 py-3 rounded-xl font-medium transition-colors duration-300
            ${isActive
                ? 'bg-[#18652c] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-50
        `}
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
    >
        {children}
    </Link>
);

const MobileDropdown = ({
    name,
    children,
    isNavLinkActive,
    closeMenu
}: {
    name: string;
    children: { name: string, href: string }[];
    isNavLinkActive: (href: string) => boolean;
    closeMenu: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const isActive = children.some(item => isNavLinkActive(item.href));

    return (
        <div className="space-y-1.5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-colors duration-300
                    ${isActive ? 'text-[#18652c] font-semibold' : 'text-gray-700'}
                    hover:bg-gray-50 active:bg-gray-100
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-50
                `}
            >
                <span>{name}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="pl-4 space-y-1.5 animate-fadeIn">
                    {children.map((item) => (
                        <MobileNavLink
                            key={item.name}
                            href={item.href}
                            isActive={isNavLinkActive(item.href)}
                            onClick={closeMenu}
                        >
                            {item.name}
                        </MobileNavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

const AuthButtons = () => (
    <>
        <Link
            href={route("login")}
            className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-[#18652c] transition-all duration-300 border-2 border-transparent hover:border-gray-200 active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-50"
        >
            Log in
        </Link>
        <Link
            href={route("register")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-[#18652c] to-[#3fb65e] text-white font-semibold transition-all duration-300 hover:from-[#145024] hover:to-[#35a051] shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-50"
        >
            Register
        </Link>
    </>
);

const UserDropdown = ({ user, dropdownOpen, setDropdownOpen, dropdownRef, getDashboardRoute }: {
    user: any;
    dropdownOpen: boolean;
    setDropdownOpen: (open: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    getDashboardRoute: (userRole: string) => string;
}) => {
    const dashboardUrl = user ? getDashboardRoute(user.role) : '#';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300 border border-transparent hover:border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-50"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
            >
                <div className="w-8 h-8">
                    <UserAvatar user={user} />
                </div>
                <span className="max-w-[100px] truncate">{`${user.firstname} ${user.lastname}`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 py-1 animate-fadeIn">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        <p className="font-medium text-gray-800 truncate">{user.firstname} {user.lastname}</p>
                        <p className="truncate">{user.email}</p>
                    </div>
                    <DropdownLink href={dashboardUrl} icon={<LayoutDashboard className="w-4 h-4 mr-2" />}>
                        Dashboard
                    </DropdownLink>
                    <DropdownLink href={route('profile.edit')} icon={<UserIcon className="w-4 h-4 mr-2" />}>
                        Profile
                    </DropdownLink>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 focus:outline-none focus-visible:bg-red-50"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                    </Link>
                </div>
            )}
        </div>
    );
};

const DropdownLink = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Link
        href={href}
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#18652c] focus:outline-none focus-visible:bg-gray-50"
    >
        {icon}
        {children}
    </Link>
);

const MobileMenu = ({ navItems, auth, closeMenu, getDashboardRoute, isNavLinkActive }: {
    navItems: any[];
    auth: any;
    closeMenu: () => void;
    getDashboardRoute: (userRole: string) => string;
    isNavLinkActive: (href: string) => boolean;
}) => (
    <div className="md:hidden animate-slideDownFade">
        <div className="px-4 pb-6 space-y-1.5 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
                'children' in item ? (
                    <MobileDropdown
                        key={item.name}
                        name={item.name}
                        children={item.children}
                        isNavLinkActive={isNavLinkActive}
                        closeMenu={closeMenu}
                    />
                ) : (
                    <MobileNavLink
                        key={item.name}
                        href={item.href}
                        isActive={isNavLinkActive(item.href)}
                        onClick={closeMenu}
                    >
                        {item.name}
                    </MobileNavLink>
                )
            ))}

            <div className="pt-4 space-y-1.5 border-t border-gray-200 mt-4">
                {auth?.user ? (
                    <MobileUserSection
                        user={auth.user}
                        closeMenu={closeMenu}
                        getDashboardRoute={getDashboardRoute}
                    />
                ) : (
                    <MobileAuthButtons closeMenu={closeMenu} />
                )}
            </div>
        </div>
    </div>
);

const MobileUserSection = ({ user, closeMenu, getDashboardRoute }: {
    user: any;
    closeMenu: () => void;
    getDashboardRoute: (userRole: string) => string;
}) => (
    <>
        <div className="px-4 py-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10">
                    <UserAvatar user={user} />
                </div>
                <div>
                    <p className="font-medium text-gray-800">{`${user.firstname} ${user.lastname}`}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
            </div>
        </div>
        <MobileNavLink href={getDashboardRoute(user.role)} isActive={false} onClick={closeMenu}>
            <LayoutDashboard className="w-5 h-5 mr-3" />
            {user.role === 'editor' ? 'Dashboard' : 'Dashboard'}
        </MobileNavLink>
        <MobileNavLink href={route('profile.edit')} isActive={false} onClick={closeMenu}>
            <UserIcon className="w-5 h-5 mr-3" />
            Profile
        </MobileNavLink>
        <Link
            href={route('logout')}
            method="post"
            as="button"
            className="w-full text-left flex items-center px-4 py-3 rounded-xl font-medium transition-colors duration-300 text-red-600 hover:bg-red-50 active:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-opacity-50"
            onClick={closeMenu}
        >
            <LogOut className="w-5 h-5 mr-3" />
            Log out
        </Link>
    </>
);

const MobileAuthButtons = ({ closeMenu }: { closeMenu: () => void }) => (
    <>
        <MobileNavLink href={route("login")} isActive={false} onClick={closeMenu}>
            Log in
        </MobileNavLink>
        <Link
            href={route("register")}
            className="block w-full px-4 py-3 rounded-xl font-medium text-center bg-gradient-to-br from-[#18652c] to-[#3fb65e] text-white shadow-sm hover:from-[#145024] hover:to-[#35a051] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-50"
            onClick={closeMenu}
        >
            Register
        </Link>
    </>
);