import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/components/site-header';
import Footer from '@/components/site-footer';
import { Book, Calendar, ListChecks, Archive } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface JournalArticle {
    id: number;
    title: string;
    authors: string;
    abstract: string;
    keywords: string[];
    doi: string;
    pages: string;
    pdfUrl: string;
}

interface JournalIssue {
    id: number;
    volume: number;
    issue: number;
    title: string;
    description: string;
    coverImageUrl: string;
    publicationDate: string;
    articles: JournalArticle[];
}

interface VolumeYear {
    year: number;
    volumes: {
        volume: number;
        issues: JournalIssue[];
    }[];
}

export default function Archives({ auth }: PageProps) {
    const archiveSections = useMemo(() => [
        { id: "2024-archives", title: "Published Issues" },
        { id: "search-archives", title: "Search Archives" },
        { id: "archive-statistics", title: "Statistics" },
    ], []);

    const [activeSection, setActiveSection] = useState<string>("2024-archives");

    // Handle smooth scrolling when clicking nav links
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 96; // Account for sticky header
            const elementPosition = element.offsetTop - headerOffset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    // Scroll spy functionality
    useEffect(() => {
        const handleScroll = () => {
            const sections = archiveSections.map(section => ({
                id: section.id,
                element: document.getElementById(section.id)
            })).filter(section => section.element);

            // Get the current scroll position
            const scrollY = window.scrollY;
            const headerOffset = 96; // Account for sticky header height

            // Find the current section
            let currentSection = sections[0]?.id || "2024-archives";

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.element) {
                    const sectionTop = section.element.offsetTop - headerOffset;
                    if (scrollY >= sectionTop) {
                        currentSection = section.id;
                        break;
                    }
                }
            }

            setActiveSection(currentSection);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Call once to set initial state
        handleScroll();

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, [archiveSections]);

    const archiveData: VolumeYear[] = [
        {
            year: 2024,
            volumes: [
                {
                    volume: 22,
                    issues: [
                        {
                            id: 1,
                            volume: 22,
                            issue: 2,
                            title: "DDMRJ Special Issue on the International Conference on Research, Innovation, and Investment (ICRII) 2024",
                            description: "Vol. 22 No. S1 (2024)",
                            coverImageUrl: "/images/journal-cover.webp",
                            publicationDate: "2024",
                            articles: []
                        },
                        {
                            id: 2,
                            volume: 22,
                            issue: 1,
                            title: "July - December 2024",
                            description: "Vol. 22 No. 2 (2024)",
                            coverImageUrl: "/images/journal-cover.webp",
                            publicationDate: "2024",
                            articles: []
                        }
                    ]
                }
            ]
        },
        {
            year: 2023,
            volumes: [
                {
                    volume: 21,
                    issues: [
                        {
                            id: 3,
                            volume: 21,
                            issue: 2,
                            title: "July - December 2023",
                            description: "Vol. 21 No. 2 (2023)",
                            coverImageUrl: "/images/journal-cover.webp",
                            publicationDate: "2023",
                            articles: []
                        }
                    ]
                }
            ]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Archives | Daluyang Dunong" />
            <Header auth={auth} />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-[#18652c] dark:text-[#3fb65e]">Archives</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Page Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                        Archives
                    </h1>

                    {/* Flex container for sidebar and main content */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 flex-shrink-0 md:sticky md:top-24 self-start">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <ListChecks className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                                    On this page
                                </h2>
                                <nav>
                                    <ul className="space-y-2">
                                        {archiveSections.map((section) => (
                                            <li key={section.id}>
                                                <a
                                                    href={`#${section.id}`}
                                                    onClick={(e) => handleNavClick(e, section.id)}
                                                    className={`flex items-center gap-2 text-sm py-2 px-3 rounded-md transition-colors duration-200 ${activeSection === section.id
                                                        ? 'bg-[#18652c] dark:bg-[#3fb65e] text-white dark:text-gray-900 font-medium'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-[#18652c] dark:hover:text-[#3fb65e] hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {activeSection === section.id && (
                                                        <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900 flex-shrink-0"></div>
                                                    )}
                                                    <span className={activeSection !== section.id ? 'ml-4' : ''}>{section.title}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        {/* Main content wrapper */}
                        <div className="flex-1 min-w-0">
                            {/* 2024 Archives Section */}
                            <section id="2024-archives" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <Calendar className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Published Issues
                                </h2>

                                <div className="space-y-12">
                                    {archiveData.map((yearData) => (
                                        <div key={yearData.year}>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                                {yearData.year}
                                            </h3>
                                            {yearData.volumes.map((volumeData) => (
                                                <div key={volumeData.volume} className="space-y-6">
                                                    {volumeData.issues.map((issue) => (
                                                        <div key={issue.id} className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                                                            <div className="w-32 flex-shrink-0">
                                                                <img
                                                                    src={issue.coverImageUrl}
                                                                    alt={`Cover for ${issue.title}`}
                                                                    className="w-full rounded-sm shadow-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Link
                                                                    href={`/issue/${issue.id}`}
                                                                    className="text-[#18652c] dark:text-[#3fb65e] hover:text-[#145024] dark:hover:text-[#3fb65e] font-medium block mb-2 transition-colors duration-300"
                                                                >
                                                                    {issue.title}
                                                                </Link>
                                                                <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                                                                    {issue.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {archiveData.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">No archives found.</p>
                                    </div>
                                )}
                            </section>

                            {/* Search Archives Section */}
                            <section id="search-archives" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <Book className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Search Archives
                                </h2>
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                                    <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                                        Use our advanced search to find specific articles, authors, or research topics across all published issues.
                                    </p>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="Search articles, authors, keywords..."
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#18652c] dark:focus:ring-[#3fb65e] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-300"
                                        />
                                        <button className="px-6 py-2 bg-[#18652c] hover:bg-[#145024] dark:bg-[#3fb65e] dark:hover:bg-[#3fb65e] text-white rounded-lg transition-colors duration-300">
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Archive Statistics Section */}
                            <section id="archive-statistics" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <Archive className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Archive Statistics
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
                                        <div className="text-3xl font-bold text-[#18652c] dark:text-[#3fb65e] mb-2 transition-colors duration-300">
                                            {archiveData.reduce((total, year) =>
                                                total + year.volumes.reduce((volTotal, vol) => volTotal + vol.issues.length, 0), 0
                                            )}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Issues</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
                                        <div className="text-3xl font-bold text-[#18652c] dark:text-[#3fb65e] mb-2 transition-colors duration-300">
                                            {archiveData.length}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Years Published</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
                                        <div className="text-3xl font-bold text-[#18652c] dark:text-[#3fb65e] mb-2 transition-colors duration-300">
                                            {archiveData.reduce((total, year) => total + year.volumes.length, 0)}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Volumes</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
