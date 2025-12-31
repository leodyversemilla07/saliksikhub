/**
 * SiteHeader Component
 * 
 * The main navigation header for the Saliksikhub Research Journal Management System.
 * This component provides the primary navigation interface for the public-facing
 * journal website, supporting both authenticated and guest users.
 * 
 * ## Features
 * - **Institutional Identity Bar**: Displays university/journal name and ISSN
 * - **Responsive Navigation**: Desktop horizontal menu, mobile slide-out drawer
 * - **Search Integration**: Expandable search bar for articles, authors, and keywords
 * - **Theme Toggle**: Light/dark mode support with localStorage persistence
 * - **Role-Based Dashboard Links**: Routes authenticated users to appropriate dashboards
 * - **Scroll Effects**: Visual feedback when page is scrolled
 * 
 * ## Customization for Institutions
 * To customize for your institution:
 * 1. Update the institution name in the top identity bar
 * 2. Replace the ISSN number with your journal's ISSN
 * 3. Update the logo image URL
 * 4. Modify the journal name and tagline
 * 
 * ## Navigation Items
 * The navigation menu includes:
 * - Home: Landing page
 * - Current Issue: Latest published articles
 * - Submissions: Author submission guidelines and portal
 * - Archives: Past issues and articles
 * - Editorial Board: Journal leadership and reviewers
 * - About: Journal scope, policies, and information
 * 
 * @module components/site-header
 * @see {@link SiteFooter} for the corresponding footer component
 */
import { useState, useEffect } from 'react';
import { PageProps, Journal, Institution } from '@/types';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import {
    Menu,
    Search,
    Sun,
    Moon,
    BookOpen,
    FileText,
    Users,
    Archive,
    Info,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import JournalSwitcher from '@/components/journal-switcher';
import {
    home,
    current,
    submissions,
    archives,
    editorialBoard,
    aboutJournal,
    login as loginRoute,
    register as registerRoute,
} from '@/routes';
import editor from '@/routes/editor';
import author from '@/routes/author';
import { dashboard } from '@/routes';

/**
 * Navigation item configuration for the site header menu.
 * Each item represents a link in the main navigation.
 * 
 * @interface NavigationItem
 * @property {string} name - Display text for the navigation link
 * @property {string} [href] - URL path for the navigation link
 * @property {React.ReactNode} [icon] - Optional icon component (used in mobile menu)
 * @property {string} [description] - Optional description (shown in mobile menu)
 */
interface NavigationItem {
    name: string;
    href?: string;
    icon?: React.ReactNode;
    description?: string;
}

/**
 * Props for the SiteHeader component.
 * 
 * @interface SiteHeaderProps
 * @property {PageProps['auth']} [auth] - Authentication state containing user info
 * @property {Journal} [currentJournal] - Current journal context for dynamic branding
 * @property {Institution} [currentInstitution] - Current institution context
 */
interface SiteHeaderProps {
    auth?: PageProps['auth'];
    currentJournal?: Journal | null;
    currentInstitution?: Institution | null;
}

const navigationItems: NavigationItem[] = [
    {
        name: 'Home',
        href: home.url(),
    },
    {
        name: 'Current Issue',
        href: current.url(),
        icon: <BookOpen className="h-4 w-4" />,
        description: 'Browse the latest published articles',
    },
    {
        name: 'Submissions',
        href: submissions.url(),
        icon: <FileText className="h-4 w-4" />,
        description: 'Submit your manuscript for review',
    },
    {
        name: 'Archives',
        href: archives.url(),
        icon: <Archive className="h-4 w-4" />,
        description: 'Access past issues and publications',
    },
    {
        name: 'Editorial Board',
        href: editorialBoard.url(),
        icon: <Users className="h-4 w-4" />,
        description: 'Meet our editorial team',
    },
    {
        name: 'About',
        href: aboutJournal.url(),
        icon: <Info className="h-4 w-4" />,
        description: 'Learn about the journal',
    },
];

export default function SiteHeader({ auth }: SiteHeaderProps) {
    const { currentJournal, currentInstitution } = usePage<PageProps>().props;
    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const searchForm = useForm({
        query: '',
    });

    const { url: currentUrl } = usePage();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isMobileNavigationOpen) {
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
            if (userRole === 'editor') return editor.dashboard.url();
            if (userRole === 'author') return author.dashboard.url();
            return dashboard.url();
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
            router.visit('/search', {
                method: 'get',
                data: { q: searchForm.data.query },
                preserveState: true,
            });
            setIsSearchOpen(false);
        }
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'bg-background/95 backdrop-blur-md shadow-sm border-b'
                    : 'bg-background border-b'
            }`}
            role="banner"
        >
            {/* Top Bar - Journal Identity */}
            <div className="bg-primary text-primary-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-10 text-sm">
                        <div className="flex items-center gap-2">
                            <JournalSwitcher className="text-primary-foreground hover:bg-primary-foreground/10" />
                            {currentJournal?.issn && (
                                <>
                                    <span className="hidden sm:inline text-primary-foreground/70">|</span>
                                    <span className="hidden sm:inline text-primary-foreground/70">ISSN: {currentJournal.issn}</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleThemeMode}
                                className="h-7 w-7 p-0 text-primary-foreground hover:bg-primary-foreground/10"
                                title={isDarkModeEnabled ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {isDarkModeEnabled ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo & Brand */}
                        <Link
                            href={home.url()}
                            prefetch="hover"
                            className="flex items-center gap-4 group shrink-0"
                        >
                            <div className="relative">
                                <img
                                    src={currentJournal?.logo_url ?? currentInstitution?.logo_url ?? '/images/logo.png'}
                                    className="h-12 w-auto transition-transform group-hover:scale-105"
                                    alt={currentJournal?.name ?? currentInstitution?.name ?? 'Research Journal'}
                                />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-foreground leading-tight">
                                    {currentJournal?.abbreviation ?? currentJournal?.name ?? currentInstitution?.abbreviation ?? currentInstitution?.name ?? 'Saliksikhub'}
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    {currentJournal?.settings?.tagline ?? 'Research Journal Management System'}
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-0">
                                    {navigationItems.map((item) => (
                                        <NavigationMenuItem key={item.name}>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={item.href!}
                                                    prefetch="hover"
                                                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent ${
                                                        isNavigationLinkActive(item.href!)
                                                            ? 'text-primary'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    {item.name}
                                                    {isNavigationLinkActive(item.href!) && (
                                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                                    )}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                            </Button>

                            {/* Auth Buttons */}
                            {auth?.user ? (
                                <Button asChild size="sm">
                                    <Link href={getDashboardRoute(auth.user.role ?? '')} prefetch="hover">
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={loginRoute.url()} prefetch="hover">
                                            Sign In
                                        </Link>
                                    </Button>
                                    <Button size="sm" asChild>
                                        <Link href={registerRoute.url()} prefetch="hover">
                                            Register
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Menu */}
                            <div className="lg:hidden">
                                <Sheet open={isMobileNavigationOpen} onOpenChange={setIsMobileNavigationOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Menu className="h-5 w-5" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-full max-w-sm">
                                        <SheetHeader className="text-left pb-6">
                                            <SheetTitle className="text-lg font-bold">Navigation</SheetTitle>
                                        </SheetHeader>

                                        <div className="flex flex-col gap-1">
                                            {navigationItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href!}
                                                    prefetch="hover"
                                                    onClick={() => setIsMobileNavigationOpen(false)}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                                        isNavigationLinkActive(item.href!)
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'hover:bg-accent text-foreground'
                                                    }`}
                                                >
                                                    {item.icon}
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        {item.description && (
                                                            <div className="text-xs text-muted-foreground">
                                                                {item.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        <Separator className="my-6" />

                                        {/* Mobile Auth */}
                                        {!auth?.user && (
                                            <div className="flex flex-col gap-2">
                                                <Button variant="outline" asChild className="w-full">
                                                    <Link href={loginRoute.url()}>Sign In</Link>
                                                </Button>
                                                <Button asChild className="w-full">
                                                    <Link href={registerRoute.url()}>Register</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Search Bar */}
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isSearchOpen ? 'max-h-20 border-t' : 'max-h-0'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <form onSubmit={handleSearchFormSubmit} className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search articles, authors, keywords, DOI..."
                            value={searchForm.data.query}
                            onChange={(e) => searchForm.setData('query', e.target.value)}
                            className="pl-12 pr-4 h-12 text-base"
                            disabled={searchForm.processing}
                            autoFocus={isSearchOpen}
                        />
                        <Button
                            type="submit"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            disabled={searchForm.processing || !searchForm.data.query.trim()}
                        >
                            Search
                        </Button>
                    </form>
                </div>
            </div>
        </header>
    );
}