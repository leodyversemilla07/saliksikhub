import { Head, Link } from '@inertiajs/react';
import Header from '@/components/site-header';
import Footer from '@/components/site-footer';
import { Breadcrumb } from '@/components/breadcrumb';
import { PageProps } from '@/types';

export default function Announcements({ auth }: PageProps) {
    const breadcrumbItems = [
        { href: '/', label: 'Home' },
        { href: '', label: 'Announcements' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Announcements | Daluyang Dunong" />
            <Header auth={auth} />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb items={breadcrumbItems} />

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                        Announcements
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">Stay updated with the latest news, events, and updates from Daluyang Dunong.</p>                    <div className="space-y-6">
                        {/* Featured Announcement */}
                        <div className="bg-gradient-to-r from-[#18652c] to-[#2d7738] text-white rounded-lg overflow-hidden shadow-lg">
                            <div className="p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold mr-3">Featured</span>
                                    <span className="text-green-100 text-sm">May 15, 2025</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-3">Call for Submissions: Special Issue on Sustainable Agriculture</h2>
                                <p className="text-green-100 mb-4">We are excited to announce a special issue focusing on innovative approaches to sustainable agriculture and food security. Submissions are now open for research papers, review articles, and case studies.</p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <span className="bg-white/20 px-3 py-1 rounded">Deadline: July 30, 2025</span>
                                    <span className="bg-white/20 px-3 py-1 rounded">Research Papers</span>
                                    <span className="bg-white/20 px-3 py-1 rounded">Peer Review</span>
                                </div>
                                <Link href="#" className="inline-block mt-4 bg-white text-[#18652c] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                    Submit Your Work
                                </Link>
                            </div>
                        </div>

                        {/* System Update */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg">
                            <div className="p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold mr-3">System Update</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">May 10, 2025</span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Platform Maintenance and New Features</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    We've completed scheduled maintenance and introduced several new features including enhanced manuscript tracking, 
                                    improved search functionality, and a redesigned reviewer dashboard. The platform is now running more efficiently 
                                    than ever.
                                </p>
                                <ul className="text-gray-600 dark:text-gray-300 mb-4 space-y-1">
                                    <li>• Enhanced manuscript submission workflow</li>
                                    <li>• Real-time collaboration tools for editors</li>
                                    <li>• Mobile-responsive design improvements</li>
                                    <li>• Advanced analytics for journal metrics</li>
                                </ul>
                                <Link href="#" className="text-[#18652c] dark:text-[#3fb65e] hover:underline font-medium">
                                    View Full Release Notes →
                                </Link>
                            </div>
                        </div>

                        {/* Workshop Announcement */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg">
                            <div className="p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-semibold mr-3">Workshop</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">May 5, 2025</span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Free Workshop: Academic Writing for Agricultural Sciences</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Join our upcoming virtual workshop designed for emerging researchers in agricultural sciences. Learn best practices 
                                    for academic writing, manuscript preparation, and publication strategies from experienced editors and published authors.
                                </p>
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <strong className="text-gray-900 dark:text-white">Date:</strong>
                                            <span className="text-gray-600 dark:text-gray-300 ml-2">June 15, 2025</span>
                                        </div>
                                        <div>
                                            <strong className="text-gray-900 dark:text-white">Time:</strong>
                                            <span className="text-gray-600 dark:text-gray-300 ml-2">2:00 PM - 5:00 PM PST</span>
                                        </div>
                                        <div>
                                            <strong className="text-gray-900 dark:text-white">Format:</strong>
                                            <span className="text-gray-600 dark:text-gray-300 ml-2">Virtual (Zoom)</span>
                                        </div>
                                        <div>
                                            <strong className="text-gray-900 dark:text-white">Registration:</strong>
                                            <span className="text-gray-600 dark:text-gray-300 ml-2">Free</span>
                                        </div>
                                    </div>
                                </div>
                                <Link href="#" className="text-[#18652c] dark:text-[#3fb65e] hover:underline font-medium">
                                    Register Now →
                                </Link>
                            </div>
                        </div>

                        {/* Policy Update */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg">
                            <div className="p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-semibold mr-3">Policy Update</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">April 28, 2025</span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Updated Editorial Guidelines and Open Access Policies</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    We have updated our editorial guidelines to align with the latest international standards for agricultural research 
                                    publication. These changes will take effect from June 1, 2025, and apply to all new submissions.
                                </p>
                                <div className="text-gray-600 dark:text-gray-300 mb-4">
                                    <strong className="text-gray-900 dark:text-white">Key Updates:</strong>
                                    <ul className="mt-2 space-y-1">
                                        <li>• Enhanced data sharing requirements</li>
                                        <li>• New conflict of interest disclosure forms</li>
                                        <li>• Revised author contribution statements</li>
                                        <li>• Updated open access fee structure</li>
                                    </ul>
                                </div>
                                <Link href="#" className="text-[#18652c] dark:text-[#3fb65e] hover:underline font-medium">
                                    Read Full Guidelines →
                                </Link>
                            </div>
                        </div>

                        {/* Success Story */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg">
                            <div className="p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold mr-3">Success Story</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">April 20, 2025</span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Milestone Achievement: 1000+ Published Articles</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    We're proud to announce that Daluyang Dunong has reached a significant milestone with over 1,000 published 
                                    research articles! This achievement reflects our commitment to advancing agricultural science and supporting 
                                    researchers worldwide.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-[#18652c] dark:text-[#3fb65e]">1,000+</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Published Articles</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-[#18652c] dark:text-[#3fb65e]">500+</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Active Authors</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-[#18652c] dark:text-[#3fb65e]">50+</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Countries</div>
                                    </div>
                                </div>
                                <Link href="#" className="text-[#18652c] dark:text-[#3fb65e] hover:underline font-medium">
                                    Explore Our Archives →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
