import { Link } from '@inertiajs/react'
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { LuMail, LuPhone, LuMapPin } from "react-icons/lu";

const footerNavItems = [
    { name: "Home", href: route('home') },
    { name: "Current", href: route('current') },
    { name: "Submissions", href: route('submissions') },
    { name: "Archives", href: route('archives') },
    { name: "Editorial Board", href: route('editorial-board') },
    { name: "About Us", href: route('about-us') },
    { name: "Contact Us", href: route('contact-us') },
]

const socialLinks = [
    { name: "Facebook", icon: FaFacebook, href: "https://www.facebook.com/MinSUResearchJournal" },
    { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/minsuresearchjournal" },
    { name: "Twitter", icon: FaXTwitter, href: "https://www.x.com/MinSUResearchJ" },
    { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/company/minsu-research-journal" },
    { name: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/@MinSUResearchJournal" },
]

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-4 xl:gap-12">
                    <div className="space-y-6 xl:col-span-1">
                        <Link href={route('home')} className="inline-flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#3fb65e] to-[#18652c] bg-clip-text text-transparent">
                                MinSU Research Journal
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Advancing academic knowledge through innovative research publication.
                            Leading the way in scholarly communication and research excellence.
                        </p>

                        <div className="flex space-x-4">
                            {socialLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-[#18652c] transition-all duration-300 group"
                                >
                                    <item.icon
                                        className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors"
                                        aria-hidden="true"
                                    />
                                    <span className="sr-only">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 xl:mt-0 xl:col-span-3">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                                    Quick Links
                                </h3>
                                <ul className="space-y-3">
                                    {footerNavItems.slice(0, 4).map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                                            >
                                                <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                                    Support
                                </h3>
                                <ul className="space-y-3">
                                    {footerNavItems.slice(4).map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                                            >
                                                <span className="w-1 h-1 bg-gray-500 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                                    Contact Info
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <LuMail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                                        <span className="ml-3 text-gray-400 text-sm">
                                            contact@minsurj.online
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <LuPhone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                                        <span className="ml-3 text-gray-400 text-sm">
                                            +63 123 456 7890
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <LuMapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                                        <span className="ml-3 text-gray-400 text-sm">
                                            Bongabong, Oriental Mindoro
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="md:flex md:items-center md:justify-between">
                        <p className="text-center md:text-left text-gray-500 text-sm">
                            &copy; {currentYear} MinSU Research Journal. All rights reserved.
                        </p>
                        <div className="mt-4 md:mt-0 flex justify-center space-x-6">
                            <Link href="#" className="text-gray-500 hover:text-[#3fb65e] text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-[#3fb65e] text-sm">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-[#3fb65e] text-sm">
                                Copyright Notice
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}