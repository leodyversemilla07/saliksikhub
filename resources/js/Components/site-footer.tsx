import { Link } from '@inertiajs/react'
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { LuMail, LuMapPin, LuArrowRight } from "react-icons/lu";

const footerQuickLinks = [
    { name: "Home", href: route('home') },
    { name: "Current Issue", href: route('current') },
    { name: "Submissions", href: route('submissions') },
    { name: "Archives", href: route('archives') },
    { name: "Editorial Board", href: route('editorial-board') },
    { name: "Announcements", href: route('announcements') },
    { name: "About the Journal", href: route('about-journal') }, // From header: About -> About the Journal
    { name: "Aims & Scope", href: route('about-aims-scope') }, // From header: About -> Aims & Scope
    { name: "Contact", href: route('contact-us') }, // From header utility bar
];

const socialLinks = [
    { name: "Facebook", icon: FaFacebook, href: "https://www.facebook.com/DaluyangDunong" },
    { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/daluyangdunong" },
    { name: "Twitter", icon: FaXTwitter, href: "https://www.x.com/DaluyangDunong" },
    { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/company/daluyang-dunong" },
    { name: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/@DaluyangDunong" },
]

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-12">
                    {/* Column 1: About & Newsletter */}
                    <div className="space-y-8">
                        <Link href={route('home')} className="inline-block">
                            <span className="text-2xl font-bold text-[#18652c] dark:text-[#3fb65e]">
                                Daluyang Dunong
                            </span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">
                            Daluyang Dunong (/daˈlujaŋ ˈdunoŋ/, Channel of Knowledge) is the internationally peer-reviewed, open-access, multidisciplinary journal of Mindoro State University (MinSU), dedicated to advancing knowledge through rigorous research across diverse academic fields.
                        </p>

                        {/* Newsletter Signup */}
                        <div className="pt-4">
                            <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-4 transition-colors duration-300">
                                Subscribe to Our Newsletter
                            </h4>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 min-w-0 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#18652c] dark:focus:ring-[#3fb65e] focus:border-transparent dark:bg-gray-800 dark:text-white"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#18652c] hover:bg-[#18652c]/90 dark:bg-[#3fb65e] dark:hover:bg-[#3fb65e]/90 transition-colors duration-300"
                                >
                                    <LuArrowRight className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-8 transition-colors duration-300">Quick Links</h3>
                        <ul className="space-y-4">
                            {footerQuickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-600 dark:text-gray-400 hover:text-[#18652c] dark:hover:text-[#3fb65e] transition-colors duration-200 text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Call to Action */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-8 transition-colors duration-300">For Authors</h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-[#18652c]/5 dark:bg-[#18652c]/10 rounded-2xl hover:bg-[#18652c]/10 dark:hover:bg-[#18652c]/20 transition-all duration-300">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Submit Your Research</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Ready to publish? Submit your manuscript for peer review.</p>
                                <Link
                                    href={route('submissions')}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#18652c] dark:text-[#3fb65e] hover:underline"
                                >
                                    Submit Now
                                    <LuArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="p-6 bg-[#18652c]/5 dark:bg-[#18652c]/10 rounded-2xl hover:bg-[#18652c]/10 dark:hover:bg-[#18652c]/20 transition-all duration-300">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Review Guidelines</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Learn about our peer review process and guidelines.</p>
                                <Link
                                    href="#"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#18652c] dark:text-[#3fb65e] hover:underline"
                                >
                                    Learn More
                                    <LuArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Contact & Social */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-8 transition-colors duration-300">Contact Us</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#18652c]/5 dark:bg-[#18652c]/10 rounded-xl">
                                    <LuMail className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e]" />
                                </div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">contact@ddmrj.minsu.edu.ph</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-[#18652c]/5 dark:bg-[#18652c]/10 rounded-xl">
                                    <LuMapPin className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e]" />
                                </div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">Mindoro State University, Main Campus, Victoria, Oriental Mindoro</span>
                            </div>

                            {/* Social Media Links */}
                            <div className="pt-6">
                                <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-4 transition-colors duration-300">
                                    Follow Us
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                    {socialLinks.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="p-2.5 rounded-xl bg-[#18652c]/5 dark:bg-[#18652c]/10 hover:bg-[#18652c]/10 dark:hover:bg-[#18652c]/20 transition-all duration-300 group"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <item.icon
                                                className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e] transition-colors"
                                                aria-hidden="true"
                                            />
                                            <span className="sr-only">{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright and Legal Section */}
                <div className="mt-12 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="md:flex md:items-center md:justify-between pb-4">
                        <div className="text-center md:text-left">
                            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                                &copy; {currentYear} Daluyang Dunong. All rights reserved.
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1 transition-colors duration-300">
                                ISSN: 2094-7577 | e-ISSN: 2023-5678
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-8">
                            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#18652c] dark:hover:text-[#3fb65e] text-sm transition-colors duration-300">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#18652c] dark:hover:text-[#3fb65e] text-sm transition-colors duration-300">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#18652c] dark:hover:text-[#3fb65e] text-sm transition-colors duration-300">
                                Copyright Notice
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}