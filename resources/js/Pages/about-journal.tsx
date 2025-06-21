import Footer from '@/components/site-footer';
import Header from '@/components/site-header';
import { Breadcrumb } from '@/components/breadcrumb';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Target, Eye, Star, Unlock, Users, BookCopy, Globe, ShieldCheck, LifeBuoy } from 'lucide-react';

export default function AboutJournal({ auth }: PageProps) {
    const breadcrumbItems = [
        { href: '/', label: 'Home' },
        { href: '', label: 'About the Journal' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="About the Journal | Daluyang Dunong" />
            <Header auth={auth} />            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb items={breadcrumbItems} />

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                        About the Journal
                    </h1>

                    {/* Journal Overview Section */}
                    <section className="mb-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <BookOpen className="h-8 w-8 text-[#18652c] dark:text-[#3fb65e] mr-4 transition-colors duration-300" />
                            Journal Overview
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            Daluyang Dunong: Multidisciplinary Research Journal (DDMRJ) is a distinguished, open-access, peer-reviewed scholarly publication committed to advancing knowledge and fostering intellectual discourse across a wide spectrum of disciplines. Published by Mindoro State University (MinSU), DDMRJ serves as a vital platform for researchers, academics, and practitioners to disseminate original research, innovative ideas, and insightful analyses. The journal upholds rigorous academic standards through a meticulous double-blind peer-review process, ensuring the quality, validity, and significance of every published article. DDMRJ is dedicated to promoting interdisciplinary collaboration and addressing contemporary issues with local, national, and global relevance.
                        </p>
                    </section>

                    {/* Mission and Vision Section */}
                    <section className="mb-12 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Mission */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <Target className="h-7 w-7 text-[#18652c] dark:text-[#3fb65e] mr-3 transition-colors duration-300" />
                                    Mission
                                </h2>
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                    To be a leading multidisciplinary journal that champions academic excellence, ethical research, and the widespread dissemination of knowledge, contributing to societal development and global understanding.
                                </p>
                            </div>
                            {/* Vision */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <Eye className="h-7 w-7 text-[#18652c] dark:text-[#3fb65e] mr-3 transition-colors duration-300" />
                                    Vision
                                </h2>
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                    To provide a dynamic and inclusive platform for scholarly communication, fostering critical inquiry, innovation, and collaboration across diverse fields of study to address complex challenges and inspire positive change.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Key Features Section */}
                    <section className="mb-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center justify-center">
                            <Star className="h-8 w-8 text-yellow-500 dark:text-yellow-400 mr-4" />
                            Key Features
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[                                { title: "Open Access", description: "Ensuring free and unrestricted access to all published articles, promoting wider readership and knowledge sharing.", icon: <Unlock className="h-10 w-10 text-[#18652c] dark:text-[#3fb65e] mb-3 transition-colors duration-300" /> },
                                { title: "Peer Review", description: "Employing a rigorous double-blind peer-review process to maintain high academic standards and integrity.", icon: <Users className="h-10 w-10 text-[#18652c] dark:text-[#3fb65e] mb-3 transition-colors duration-300" /> },
                                { title: "Multidisciplinary Scope", description: "Welcoming contributions from a broad range of disciplines, encouraging cross-pollination of ideas.", icon: <BookCopy className="h-10 w-10 text-[#18652c] dark:text-[#3fb65e] mb-3 transition-colors duration-300" /> },
                                { title: "Global Reach", description: "Disseminating research to a worldwide audience, fostering international collaboration and impact.", icon: <Globe className="h-10 w-10 text-[#18652c] dark:text-[#3fb65e] mb-3 transition-colors duration-300" /> },
                                { title: "Ethical Standards", description: "Adhering to the highest ethical guidelines in publishing, ensuring transparency and accountability.", icon: <ShieldCheck className="h-10 w-10 text-[#18652c] dark:text-[#3fb65e] mb-3 transition-colors duration-300" /> },
                                { title: "Author Support", description: "Providing comprehensive support to authors throughout the submission and publication process.", icon: <LifeBuoy className="h-10 w-10 text-[#18652c] dark:text-[#3fb65e] mb-3 transition-colors duration-300" /> }
                            ].map((feature, index) => (
                                <div key={index} className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                    {feature.icon}
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-md text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
