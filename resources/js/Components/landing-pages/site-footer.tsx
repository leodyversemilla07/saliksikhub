import { Link } from '@inertiajs/react'
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { LuMail, LuMapPin, LuBookOpen, LuCalendarDays, LuUsers } from "react-icons/lu";

const journalLinks = [
    { name: "Current Issue", href: route('current') },
    { name: "Archives", href: route('archives') },
    { name: "Special Issues", href: "#" },
    { name: "Most Cited", href: "#" },
]

const authorLinks = [
    { name: "Submission Guidelines", href: route('submissions') },
    { name: "Author Resources", href: "#" },
    { name: "Publication Ethics", href: "#" },
    { name: "Copyright & Licensing", href: "#" },
]

const aboutLinks = [
    { name: "About the Journal", href: route('about-us') },
    { name: "Editorial Board", href: route('editorial-board') },
    { name: "Peer Review Process", href: "#" },
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
        <footer className="bg-gray-900">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                {/* Journal info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-gray-700">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-800 rounded-lg">
                            <LuBookOpen className="h-6 w-6 text-[#3fb65e]" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-2">Peer-Reviewed Journal</h3>
                            <p className="text-gray-400 text-sm">Adhering to rigorous academic standards with double-blind peer review process</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-800 rounded-lg">
                            <LuCalendarDays className="h-6 w-6 text-[#3fb65e]" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-2">Quarterly Publication</h3>
                            <p className="text-gray-400 text-sm">Published four times annually with special issues on emerging research topics</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-800 rounded-lg">
                            <LuUsers className="h-6 w-6 text-[#3fb65e]" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-2">Global Contributors</h3>
                            <p className="text-gray-400 text-sm">Featuring diverse research from scholars across various disciplines worldwide</p>
                        </div>
                    </div>
                </div>

                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-12">
                    <div className="space-y-8">
                        <Link href={route('home')} className="inline-flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#3fb65e] to-[#18652c] bg-clip-text text-transparent">
                                MinSU Research Journal
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A multidisciplinary academic journal dedicated to advancing knowledge through rigorous research and scholarly communication.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-[#18652c] transition-all duration-300 group"
                                    target="_blank"
                                    rel="noopener noreferrer"
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

                    <div>
                        <h3 className="text-white font-semibold mb-6">Journal</h3>
                        <ul className="space-y-4">
                            {journalLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-[#3fb65e] transition-colors duration-200 text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">For Authors</h3>
                        <ul className="space-y-4">
                            {authorLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-[#3fb65e] transition-colors duration-200 text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">About</h3>
                        <ul className="space-y-4">
                            {aboutLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-[#3fb65e] transition-colors duration-200 text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <LuMail className="h-5 w-5 text-[#3fb65e]" />
                                <span className="text-gray-400 text-sm">contact@minsurj.online</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <LuMapPin className="h-5 w-5 text-[#3fb65e]" />
                                <span className="text-gray-400 text-sm">Bongabong, Oriental Mindoro</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="text-center md:text-left">
                            <p className="text-gray-500 text-sm">
                                &copy; {currentYear} MinSU Research Journal. All rights reserved.
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                                ISSN: 2094-7577 | e-ISSN: 2023-5678
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
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