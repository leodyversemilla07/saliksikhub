import { Link } from '@inertiajs/react'
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"

const footerNavItems = [
    { name: "Home", href: "/" },
    { name: "Current", href: "/current" },
    { name: "Submissions", href: "/submissions" },
    { name: "Archives", href: "/archives" },
    { name: "Editorial Board", href: "/editorial-board" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
]

const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
]

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* Logo and Social Links Section */}
                    <div className="space-y-8 xl:col-span-1">
                        <Link href="/" className="inline-flex items-center space-x-2">
                            <span className="text-2xl font-bold text-white hover:text-gray-200 transition">
                                MinSU Research Journal
                            </span>
                        </Link>
                        <p className="text-gray-300 text-base max-w-md">
                            Advancing academic knowledge through innovative research publication.
                            Leading the way in scholarly communication and research excellence.
                        </p>
                        <div className="flex space-x-6">
                            {socialLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-400 hover:text-gray-300 transition duration-150"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Mail className="h-5 w-5" />
                                <span>contact@minsurj.online</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Phone className="h-5 w-5" />
                                <span>+63 123 456 7890</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <MapPin className="h-5 w-5" />
                                <span>Bongabong, Oriental Mindoro</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                                    Quick Links
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    {footerNavItems.slice(0, 4).map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-base text-gray-300 hover:text-white transition duration-150"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                                    Support
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    {footerNavItems.slice(4).map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-base text-gray-300 hover:text-white transition duration-150"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                                Legal
                            </h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <Link href="#" className="text-base text-gray-300 hover:text-white transition duration-150">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-300 hover:text-white transition duration-150">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-300 hover:text-white transition duration-150">
                                        Copyright Notice
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        &copy; {currentYear} MinSU Research Journal. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}