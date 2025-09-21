import { useState, useEffect } from 'react';
import { PageProps } from '@/types';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import {
    Menu,
    Search,
    Sun,
    Moon,
    BookOpen,
    Globe
} from 'lucide-react';

// Import shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    { name: "About", href: route('about-journal'), icon: <Globe className="w-4 h-4" /> },
];

// Main site header component with modern responsive design
export default function SiteHeader({ auth }: SiteHeaderProps) {
    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

    // Use Inertia's useForm for search functionality
    const searchForm = useForm({
        query: '',
    });

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
        if (searchForm.data.query.trim()) {
            // Navigate to search results page with the query
            router.visit(route('search'), {
                method: 'get',
                data: { q: searchForm.data.query },
                preserveState: true,
            });
        }
    };

    // Reusable UI components with improved naming
    const SearchForm = ({
        searchForm,
        onSubmit
    }: {
        searchForm: ReturnType<typeof useForm<{ query: string }>>;
        onSubmit: (event: React.FormEvent) => void;
    }) => (
        <form onSubmit={onSubmit} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
                type="text"
                placeholder="Search articles, authors, topics..."
                value={searchForm.data.query}
                onChange={(event) => searchForm.setData('query', event.target.value)}
                className="pl-10"
                disabled={searchForm.processing}
            />
        </form>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
            {/* Single Simplified Header Bar - Full Width */}
            <div className="bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Brand Section */}
                        <Link href={route('home')} prefetch="hover" className="flex items-center gap-3 group shrink-0">
                            <img
                                src="https://www.daluyangdunong.minsu.edu.ph/img/mrj1.3083946c.png"
                                className="h-8 w-auto transition-transform group-hover:scale-105"
                                alt="Research Journal Manager"
                            />
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
                                                    prefetch="hover"
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
                                    searchForm={searchForm}
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
                                <Button asChild>
                                    <Link href={getDashboardRoute(auth.user.role ?? '')} prefetch="hover">
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" asChild>
                                        <Link href={route('login')} prefetch="hover">
                                            Login
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')} prefetch="hover">
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
                                                            prefetch="hover"
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
                                                searchForm={searchForm}
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