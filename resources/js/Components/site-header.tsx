import { useState, useEffect, useRef } from 'react';
import { PageProps, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, ChevronDown, LogOut, User as UserIcon, LayoutDashboard, Search, Sun, Moon } from 'lucide-react';

// Define the NavItem interface for type safety
interface NavItem {
    name: string;
    href?: string;
    children?: { name: string; href: string }[];
}

// Props for the Header component
interface HeaderProps {
    auth?: PageProps['auth'];
}

// Updated Navigation items to match OJS structure
const navItems: NavItem[] = [
    { name: "Home", href: route('home') },
    { name: "Current", href: route('current') },
    { name: "Submissions", href: route('submissions') },
    { name: "Archives", href: route('archives') },
    { name: "Editorial Board", href: route('editorial-board') },
    { name: "Announcements", href: route('announcements') },
    {
        name: "About",
        children: [
            { name: "About the Journal", href: route('about-journal') },
            { name: "Aims & Scope", href: route('about-aims-scope') },
            { name: "Contact", href: route('contact-us') },
        ]
    },
];

// UserAvatar component (updated for circular shape and better layout)
const UserAvatar = ({ user }: { user: User }) => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#18652c] to-[#3fb65e] flex items-center justify-center text-white font-semibold overflow-hidden flex-shrink-0">
        {`${(user.firstname?.[0] || '').toUpperCase()}${(user.lastname?.[0] || 'U').toUpperCase()}`}
    </div>
);

// Main Header component
export default function Header({ auth }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const userDropdownRef = useRef<HTMLDivElement | null>(null);
    const aboutDropdownRef = useRef<HTMLDivElement | null>(null);
    const { url } = usePage();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setUserDropdownOpen(false);
            }
            if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
                setAboutDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const getDashboardRoute = (userRole: string) => {
        try {
            if (userRole === 'editor') return route('editor.dashboard');
            if (userRole === 'author') return route('author.dashboard');
            return route('dashboard');
        } catch (error) {
            console.warn('Dashboard route error:', error);
            return userRole === 'editor' ? '/editor/dashboard' : '/manuscripts';
        }
    };

    const isNavLinkActive = (href: string): boolean => {
        const hrefPath = new URL(href, window.location.origin).pathname;
        const currentPath = new URL(url, window.location.origin).pathname;
        if (hrefPath === '/' || hrefPath === '/home') return currentPath === '/' || currentPath === '/home';
        if (hrefPath.includes('/current')) return currentPath.includes('/current');
        return currentPath === hrefPath || (hrefPath !== '/' && currentPath.startsWith(hrefPath));
    };

    const isNavDropdownActive = (children: { name: string, href: string }[]): boolean => {
        return children.some(child => isNavLinkActive(child.href));
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    return (
        <header className={`w-full top-0 z-50 text-gray-800 dark:text-slate-100`} role="banner">
            {/* Top Utility Bar */}
            <div className={`bg-[#18652c]/5 dark:bg-[#18652c]/2 text-xs transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10 space-x-4">
                    <button
                        onClick={toggleDarkMode}
                        className="h-10 w-10 flex items-center justify-center rounded-full text-[#18652c] dark:text-[#3fb65e] hover:bg-[#18652c]/10 dark:hover:bg-[#18652c]/20 transition-colors duration-300"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <div className="flex items-center space-x-4">
                        {auth?.user ? (
                            <div className="relative h-full" ref={userDropdownRef}>
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className={`h-full flex items-center gap-2 px-3 rounded text-[#18652c] dark:text-[#3fb65e] hover:bg-[#18652c]/10 dark:hover:bg-[#18652c]/20 transition-colors duration-300 min-w-0`}
                                >
                                    <UserAvatar user={auth.user} />
                                    <span className="hidden sm:block truncate max-w-[150px]">{`${auth.user.firstname} ${auth.user.lastname}`}</span>
                                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                                </button>
                                {userDropdownOpen && (
                                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-black dark:ring-opacity-20 py-1 z-50 transition-colors duration-300`}>
                                        <DropdownLink href={getDashboardRoute(auth.user.role ?? '')} icon={<LayoutDashboard className="w-4 h-4 mr-2" />}>Dashboard</DropdownLink>
                                        <DropdownLink href={route('profile.edit')} icon={<UserIcon className="w-4 h-4 mr-2" />}>Profile</DropdownLink>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className={`flex items-center w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300`}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> Log out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href={route('register')} className={`h-full flex items-center px-2 rounded text-[#18652c] dark:text-[#3fb65e] hover:bg-[#18652c]/10 dark:hover:bg-[#18652c]/20 transition-colors duration-300`}>Register</Link>
                                <Link href={route('login')} className={`h-full flex items-center px-2 rounded text-[#18652c] dark:text-[#3fb65e] hover:bg-[#18652c]/10 dark:hover:bg-[#18652c]/20 transition-colors duration-300`}>Login</Link>
                            </>
                        )}
                        <Link href={route('contact-us')} className={`h-full flex items-center px-2 rounded text-[#18652c] dark:text-[#3fb65e] hover:bg-[#18652c]/10 dark:hover:bg-[#18652c]/20 transition-colors duration-300`}>Contact</Link>
                    </div>
                </div>
            </div>

            {/* Main Branding Area */}
            <div className={`bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center h-auto md:h-24">
                    <Link href={route('home')} className="flex items-center gap-3 mb-4 md:mb-0">
                        <img
                            src="/images/daluyang-dunong-logo.png"
                            className="transition-transform h-12 w-auto md:h-16"
                            alt="Daluyang Dunong Logo"
                        />
                        <div className="hidden md:block">
                            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Daluyang Dunong</span>
                            <span className="block text-sm text-gray-500 dark:text-slate-300">/daˈlujaŋ ˈdunoŋ/ - Channel of Knowledge</span>
                        </div>
                    </Link>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-md text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500`}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-main-menu"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar (Desktop) */}
            <nav className={`bg-white dark:bg-gray-900 hidden md:block border-b border-gray-200 dark:border-gray-800 transition-colors duration-300`} aria-label="Main navigation">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
                    <ul className="flex items-center space-x-1">
                        {!auth?.user && (
                            <NavLinkOJS href={route('login')} isActive={isNavLinkActive(route('login'))}>Login</NavLinkOJS>
                        )}
                        {navItems.map((item) => (
                            item.children ? (
                                <NavDropdownOJS
                                    key={item.name}
                                    name={item.name}
                                    children={item.children}
                                    isOpen={item.name === "About" && aboutDropdownOpen}
                                    setIsOpen={item.name === "About" ? setAboutDropdownOpen : () => { }}
                                    dropdownRef={item.name === "About" ? aboutDropdownRef : null}
                                    isActive={isNavDropdownActive(item.children)}
                                    isNavLinkActive={isNavLinkActive}
                                />
                            ) : (
                                <NavLinkOJS key={item.name} href={item.href!} isActive={isNavLinkActive(item.href!)}>
                                    {item.name}
                                </NavLinkOJS>
                            )
                        ))}
                    </ul>
                    <div className="flex items-center">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center group">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 group-focus-within:text-green-500 transition-colors duration-200" />
                                <input
                                    type="text"
                                    placeholder="Search articles, authors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-10 pr-12 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 hover:bg-white dark:hover:bg-slate-700 shadow-sm"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium shadow-sm transition-colors duration-200 flex items-center gap-1"
                                >
                                    Go
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div id="mobile-main-menu" className={`md:hidden bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[calc(100vh-180px)] overflow-y-auto">
                        {!auth?.user && (
                            <MobileNavLinkOJS href={route('login')} isActive={isNavLinkActive(route('login'))} onClick={() => setIsMobileMenuOpen(false)}>Login</MobileNavLinkOJS>
                        )}
                        {navItems.map((item) => (
                            item.children ? (
                                <MobileDropdownOJS
                                    key={item.name}
                                    name={item.name}
                                    children={item.children}
                                    isNavLinkActive={isNavLinkActive}
                                    closeMenu={() => setIsMobileMenuOpen(false)}
                                />
                            ) : (
                                <MobileNavLinkOJS key={item.name} href={item.href!} isActive={isNavLinkActive(item.href!)} onClick={() => setIsMobileMenuOpen(false)}>
                                    {item.name}
                                </MobileNavLinkOJS>
                            )
                        ))}
                        <div className="p-3 border-t border-gray-200 dark:border-slate-600">
                            <form onSubmit={handleSearchSubmit} className="relative group">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500 group-focus-within:text-green-500 transition-colors duration-200" />
                                    <input
                                        type="text"
                                        placeholder="Search articles, authors..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-16 py-3 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 shadow-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium shadow-sm transition-colors duration-200"
                                    >
                                        Go
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

// Styled sub-components for OJS theme with dark mode support
const ojsLinkClasses = (isActive: boolean) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive
        ? 'bg-green-600 text-white'
        : 'text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
    }`;

const NavLinkOJS = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
    <Link href={href} className={ojsLinkClasses(isActive)} aria-current={isActive ? 'page' : undefined}>
        {children}
    </Link>
);

interface NavDropdownOJSProps {
    name: string;
    children: { name: string, href: string }[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null> | null;
    isActive: boolean;
    isNavLinkActive: (href: string) => boolean;
}

const NavDropdownOJS = ({ name, children, isOpen, setIsOpen, dropdownRef, isActive, isNavLinkActive }: NavDropdownOJSProps) => (
    <div className="relative" ref={dropdownRef}>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${ojsLinkClasses(isActive)} flex items-center gap-1`}
            aria-expanded={isOpen}
            aria-haspopup="true"
        >
            {name}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-700 dark:text-slate-200`} />
        </button>
        {isOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-gray-200 dark:ring-black dark:ring-opacity-20 py-1 z-50">
                {children.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-3 py-2 text-sm ${isNavLinkActive(item.href)
                            ? 'bg-green-600 text-white'
                            : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        onClick={() => setIsOpen(false)}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        )}
    </div>
);

const MobileNavLinkOJS = ({ href, children, isActive, onClick }: { href: string; children: React.ReactNode; isActive: boolean; onClick?: () => void; }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive
            ? 'bg-green-600 text-white'
            : 'text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
            }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {children}
    </Link>
);

const MobileDropdownOJS = ({ name, children, isNavLinkActive, closeMenu }: {
    name: string;
    children: { name: string, href: string }[];
    isNavLinkActive: (href: string) => boolean;
    closeMenu: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const isActive = children.some(item => isNavLinkActive(item.href));

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${isActive && !isOpen
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                {name}
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-700 dark:text-slate-200`} />
            </button>
            {isOpen && (
                <div className="pl-3 mt-1 space-y-1">
                    {children.map((item) => (
                        <MobileNavLinkOJS
                            key={item.name}
                            href={item.href}
                            isActive={isNavLinkActive(item.href)}
                            onClick={closeMenu}
                        >
                            {item.name}
                        </MobileNavLinkOJS>
                    ))}
                </div>
            )}
        </div>
    );
};

const DropdownLink = ({ href, icon, children }: { href: string; icon?: React.ReactNode; children: React.ReactNode }) => (
    <Link
        href={href}
        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
    >
        {icon}{children}
    </Link>
);