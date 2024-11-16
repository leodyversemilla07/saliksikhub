import { useState } from 'react';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

interface HeaderProps {
    auth: PageProps['auth'];
    journalName: string;
    logoUrl: string;
}

export default function Header({ auth, journalName, logoUrl }: HeaderProps) {
    const { url } = usePage(); // Get the current URL
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prevState => !prevState);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    // Helper function to determine if a link is active
    const isActive = (href: string) => url === href ? 'text-green-800 font-bold' : 'text-gray-600';

    // Function to determine the correct dashboard route based on user roles
    const getDashboardRoute = () => {
        const userRoles = auth.roles; // Get user roles from auth props

        if (userRoles.includes('admin')) {
            return route('admin.dashboard'); // Admin dashboard route
        } else if (userRoles.includes('editor')) {
            return route('editor.dashboard'); // Editor dashboard route
        } else if (userRoles.includes('reviewer')) {
            return route('reviewer.dashboard'); // Reviewer dashboard route
        } else if (userRoles.includes('author')) {
            return route('author.dashboard'); // Author dashboard route
        }

        return route('dashboard'); // Default dashboard route
    };

    return (
        <div>
            {/* Logo, Journal name, and Search bar */}
            <div className="bg-white py-6 px-6 border-b">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center space-x-6">
                    {/* Left section: Logo and Journal Name */}
                    <div className="flex items-center space-x-4">
                        <Link href='/'>
                            <img
                                src={logoUrl}
                                alt={`${journalName} Logo`}
                                className="h-16 max-w-full object-contain"
                            />
                        </Link>
                        <Link href='/'>
                            <div className="text-black font-bold text-2xl">{journalName}</div>
                        </Link>
                    </div>

                    {/* Right section: Search bar */}
                    <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center space-x-2">
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search journals or articles..."
                                className="p-2 border rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <Button type="submit" className="ml-2 text-white bg-green-600 p-2 rounded-md hover:bg-green-700">
                                Search <Search />
                            </Button>
                        </div>
                    </form>

                    {/* Hamburger menu icon for mobile */}
                    <button className="lg:hidden p-2 text-green-600" onClick={toggleMobileMenu}>
                        <Menu />
                    </button>
                </div>
            </div>

            {/* Navigation bar */}
            <nav className="bg-white py-4 px-6 border-b">
                <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                    {/* Left section: Navigation links */}
                    <div className="hidden lg:flex space-x-6">
                        <Link href="/" className={`${isActive('/')} hover:text-green-800`}>Home</Link>
                        <Link href="/current" className={`${isActive('/current')} hover:text-green-800`}>Current</Link>
                        <Link href="/submissions" className={`${isActive('/submissions')} hover:text-green-800`}>Submissions</Link>
                        <Link href="/archives" className={`${isActive('/archives')} hover:text-green-800`}>Archives</Link>
                        <Link href="/editorial-board" className={`${isActive('/editorial-board')} hover:text-green-800`}>Editorial Board</Link>
                        <Link href="/about-us" className={`${isActive('/about-us')} hover:text-green-800`}>About Us</Link>
                        <Link href="/contact-us" className={`${isActive('/contact-us')} hover:text-green-800`}>Contact Us</Link>
                    </div>

                    {/* Right section: Auth buttons */}
                    <div className="hidden lg:flex space-x-4">
                        {auth.user ? (
                            <Link href={getDashboardRoute()}>
                                <Button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route("login")}>
                                    <Button className="flex-1 px-4 py-2 border bg-white border-green-600 text-green-600 hover:text-green-600 hover:border-green-600 hover:bg-gray-100 rounded-md">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href={route("register")}>
                                    <Button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 hover:text-white hover:border-green-600">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`lg:hidden flex flex-col items-center space-y-4 mt-4 px-6 bg-gray-50 w-full ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <Link href="/" className={`${isActive('/')} hover:text-green-800`}>Home</Link>
                <Link href="/current" className={`${isActive('/current')} hover:text-green-800`}>Current</Link>
                <Link href="/submissions" className={`${isActive('/submissions')} hover:text-green-800`}>Submissions</Link>
                <Link href="/archives" className={`${isActive('/archives')} hover:text-green-800`}>Archives</Link>
                <Link href="/editorial-board" className={`${isActive('/editorial-board')} hover:text-green-800`}>Editorial Board</Link>
                <Link href="/about-us" className={`${isActive('/about-us')} hover:text-green-800`}>About Us</Link>
                <Link href="/contact-us" className={`${isActive('/contact-us')} hover:text-green-800`}>Contact Us</Link>

                {/* Auth buttons */}
                {auth.user ? (
                    <Link href={getDashboardRoute()}>
                        <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            Dashboard
                        </button>
                    </Link>
                ) : (
                    <>
                        <Link href={route("login")}>
                            <button className="flex-1 px-4 py-2 border border-green-600 text-green-600 hover:text-green-900 hover:border-green-900 rounded-md">
                                Log in
                            </button>
                        </Link>
                        <Link href={route("register")}>
                            <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                Register
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
