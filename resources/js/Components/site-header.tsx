import { useState, useEffect } from 'react';
import { PageProps, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Menu,
    ChevronDown,
    LogOut,
    User as UserIcon,
    LayoutDashboard,
    Search,
    Sun,
    Moon,
    BookOpen,
    Globe,
    Bell
} from 'lucide-react';

// Import shadcn/ui components
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

// Define the navigation item interface for type safety
interface NavigationItem {
    name: string;
    href?: string;
    children?: { name: string; href: string }[];
    icon?: React.ReactNode;
}

// Props for the SiteHeader component
interface SiteHeaderProps {
    auth?: PageProps['auth'];
}

// Main navigation items configuration for the journal system
const navigationItems: NavigationItem[] = [
    { name: "Home", href: route('home') },
    { name: "Current", href: route('current'), icon: <BookOpen className="w-4 h-4" /> },
    { name: "Submissions", href: route('submissions') },
    { name: "Archives", href: route('archives') },
    { name: "Editorial Board", href: route('editorial-board') },
    { name: "Announcements", href: route('announcements'), icon: <Bell className="w-4 h-4" /> },
    { name: "About", href: route('about-journal'), icon: <Globe className="w-4 h-4" /> },
];

// Main site header component with modern responsive design
export default function SiteHeader({ auth }: SiteHeaderProps) {
    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

    const { url: currentUrl } = usePage();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMobileNavigationOpen) {
                setIsMobileNavigationOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileNavigationOpen]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkModeEnabled(savedTheme === 'dark');
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);

    const toggleThemeMode = () => {
        const newTheme = isDarkModeEnabled ? 'light' : 'dark';
        setIsDarkModeEnabled(!isDarkModeEnabled);
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

    const isNavigationLinkActive = (href: string): boolean => {
        const targetPath = new URL(href, window.location.origin).pathname;
        const currentPath = new URL(currentUrl, window.location.origin).pathname;
        if (targetPath === '/' || targetPath === '/home') return currentPath === '/' || currentPath === '/home';
        if (targetPath.includes('/current')) return currentPath.includes('/current');
        return currentPath === targetPath || (targetPath !== '/' && currentPath.startsWith(targetPath));
    };

    const handleSearchFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    // UserAvatar component using shadcn Avatar
    const UserAvatar = ({ user }: { user: User }) => (
        <div className="relative">
            <Avatar className="h-9 w-9">
                <AvatarImage src="#" alt={`${user.firstname} ${user.lastname}`} />
                <AvatarFallback className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
                    {`${(user.firstname?.[0] || '').toUpperCase()}${(user.lastname?.[0] || 'U').toUpperCase()}`}
                </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
        </div>
    );

    // Reusable UI components with improved naming
    const SearchForm = ({
        searchQuery,
        setSearchQuery,
        onSubmit
    }: {
        searchQuery: string;
        setSearchQuery: (query: string) => void;
        onSubmit: (event: React.FormEvent) => void;
    }) => (
        <form onSubmit={onSubmit} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
                type="text"
                placeholder="Search articles, authors, topics..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
            />
        </form>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
            {/* Single Simplified Header Bar - Full Width */}
            <div className="bg-background">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Brand Section */}
                        <Link href={route('home')} className="flex items-center gap-3 group flex-shrink-0">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Logo_du_journal_l%27Infomane.jpg"
                                className="h-8 w-auto transition-transform group-hover:scale-105"
                                alt="Research Journal Manager"
                            />
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold text-foreground">Research Journal Manager</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation - Full Width Distribution */}
                        <div className="hidden md:flex items-center justify-between flex-1 mx-8">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-2">
                                    {navigationItems.map((navigationItem) => (
                                        <NavigationMenuItem key={navigationItem.name}>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={navigationItem.href!}
                                                    className={`px-3 py-2 text-sm font-medium transition-colors hover:text-accent-foreground ${isNavigationLinkActive(navigationItem.href!)
                                                        ? 'text-primary'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                >
                                                    {navigationItem.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* Search - Positioned on the right side with full width */}
                            <div className="hidden lg:flex items-center ml-8">
                                <SearchForm
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    onSubmit={handleSearchFormSubmit}
                                />
                            </div>
                        </div>

                        {/* Right side - User menu and actions */}
                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleThemeMode}
                                title={isDarkModeEnabled ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                {isDarkModeEnabled ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>

                            {auth?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2">
                                            <UserAvatar user={auth.user} />
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-48" align="end">
                                        <DropdownMenuLabel>
                                            <p className="text-sm font-medium truncate">
                                                {`${auth.user.firstname} ${auth.user.lastname}`}
                                            </p>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href={getDashboardRoute(auth.user.role ?? '')} className="flex items-center gap-2">
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('profile.edit')} className="flex items-center gap-2">
                                                <UserIcon className="h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="flex items-center gap-2 text-destructive focus:text-destructive"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign out
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" asChild>
                                        <Link href={route('login')}>
                                            Login
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')}>
                                            Register
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <div className="md:hidden">
                                <Sheet open={isMobileNavigationOpen} onOpenChange={setIsMobileNavigationOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Menu className="h-5 w-5" />
                                            <span className="sr-only">Toggle navigation menu</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-full max-w-xs">
                                        <div className="flex flex-col gap-4 py-4">
                                            <div className="flex flex-col gap-2">
                                                {navigationItems.map((navigationItem) => (
                                                    <Button key={navigationItem.name} variant="ghost" className="justify-start" asChild>
                                                        <Link
                                                            href={navigationItem.href!}
                                                            onClick={() => setIsMobileNavigationOpen(false)}
                                                            className={isNavigationLinkActive(navigationItem.href!) ? 'text-primary' : ''}
                                                        >
                                                            {navigationItem.name}
                                                        </Link>
                                                    </Button>
                                                ))}
                                            </div>

                                            <Separator />

                                            {/* Mobile Search Form */}
                                            <SearchForm
                                                searchQuery={searchQuery}
                                                setSearchQuery={setSearchQuery}
                                                onSubmit={handleSearchFormSubmit}
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}