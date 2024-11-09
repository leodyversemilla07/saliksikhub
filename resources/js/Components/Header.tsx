import { useState } from 'react';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"

interface HeaderProps {
    auth: PageProps['auth'];
    journalName: string;
    logoUrl: string;
}

export default function Header({ auth, journalName, logoUrl }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Toggle mobile menu visibility
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prevState => !prevState);
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Handle form submission for search
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle the search logic (e.g., redirect to search results page)
        console.log('Searching for:', searchQuery);
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
                                src={logoUrl} // Dynamically set the logo URL
                                alt={`${journalName} Logo`} // Use journal name for alt text
                                className="h-16 max-w-full object-contain" // Ensure the logo maintains its aspect ratio without stretching
                            />
                        </Link>
                        <Link href='/'>
                            <div className="text-black font-bold text-2xl">{journalName}</div> {/* Dynamically set the journal name */}
                        </Link>
                    </div>

                    {/* Right section: Search bar (Hidden on small screens) */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="hidden lg:flex items-center space-x-2"
                    >
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
                    <button
                        className="lg:hidden p-2 text-green-600"
                        onClick={toggleMobileMenu}
                    >
                        <Menu />
                    </button>
                </div>
            </div>

            {/* Navigation bar */}
            <nav className="bg-white py-4 px-6 border-b">
                <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                    {/* Left section: Navigation links */}
                    <div className="hidden lg:flex space-x-6">
                        <Link href="/" className="text-green-600 hover:text-green-800">Home</Link>
                        <Link href="#" className="text-gray-600 hover:text-green-600">Current</Link>
                        <Link href="#" className="text-gray-600 hover:text-green-600">Submissions</Link>
                        <Link href="#" className="text-gray-600 hover:text-green-600">Archives</Link>
                        <Link href="#" className="text-gray-600 hover:text-green-600">Editorial Board</Link>
                        <Link href="#" className="text-gray-600 hover:text-green-600">About Us</Link>
                        <Link href="#" className="text-gray-600 hover:text-green-600">Contact Us</Link>
                    </div>

                    {/* Right section: Auth buttons */}
                    <div className="hidden lg:flex space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
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

            {/* Mobile menu (visible on smaller screens) */}
            <div
                className={`lg:hidden flex flex-col items-center space-y-4 mt-4 px-6 bg-gray-50 w-full ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            >
                <Link href="/" className="text-green-600 hover:text-green-800">Home</Link>
                <Link href="#" className="text-gray-600 hover:text-green-600">Current</Link>
                <Link href="#" className="text-gray-600 hover:text-green-600">Submissions</Link>
                <Link href="#" className="text-gray-600 hover:text-green-600">Archives</Link>
                <Link href="#" className="text-gray-600 hover:text-green-600">Editorial Board</Link>
                <Link href="#" className="text-gray-600 hover:text-green-600">About Us</Link>
                <Link href="#" className="text-gray-600 hover:text-green-600">Contact Us</Link>

                {/* Auth buttons */}
                {auth.user ? (
                    <Link
                        href={route('dashboard')}
                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                    >
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
