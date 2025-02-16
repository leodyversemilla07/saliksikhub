import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { CalendarDays, BookOpen, ArrowRight, LibraryBig } from 'lucide-react';

interface JournalIssue {
    id: number;
    title: string;
    volume: number;
    issueNumber: number;
    publicationDate: string;
    articles: number;
    coverImage: string;
}

export default function Archives({ auth }: PageProps) {
    const [issues, setIssues] = useState<JournalIssue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            const mockData: JournalIssue[] = [
                {
                    id: 1,
                    title: "Exploring AI in Education",
                    volume: 5,
                    issueNumber: 2,
                    publicationDate: "2023-06-15",
                    articles: 8,
                    coverImage: "https://static.wixstatic.com/media/b6a543_4a6c63aa384542f3af11ebe63616055f~mv2.jpeg/v1/fill/w_952,h_1212,al_c,q_85,enc_auto/b6a543_4a6c63aa384542f3af11ebe63616055f~mv2.jpeg", // Example cover image URL
                },
                {
                    id: 2,
                    title: "Innovations in Sustainable Agriculture",
                    volume: 4,
                    issueNumber: 3,
                    publicationDate: "2022-11-20",
                    articles: 6,
                    coverImage: "https://www.journalijar.com/wp-content/uploads/2024/10/Sep_24_Src.jpg", // Example cover image URL
                },
                {
                    id: 3,
                    title: "Advances in Renewable Energy Systems",
                    volume: 3,
                    issueNumber: 1,
                    publicationDate: "2022-04-10",
                    articles: 7,
                    coverImage: "https://sciendo-parsed.s3.eu-central-1.amazonaws.com/647114832b88470fbea14e46/cover-image.jpg", // Example cover image URL
                },
                {
                    id: 4,
                    title: "Blockchain and Its Impact on Finance",
                    volume: 2,
                    issueNumber: 4,
                    publicationDate: "2021-09-05",
                    articles: 5,
                    coverImage: "https://www.journalijar.com/wp-content/uploads/2024/08/Aug-2024_src.jpg", // Example cover image URL
                },
                {
                    id: 5,
                    title: "Machine Learning in Healthcare",
                    volume: 1,
                    issueNumber: 2,
                    publicationDate: "2021-03-22",
                    articles: 10,
                    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5uyfp4euEVt0AIKi2Qs-u8HWhitMnjUSgA&s", // Example cover image URL
                },
            ];

            setIssues(mockData);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <>
            <Head title="Archives" />
            <Header auth={auth} />

            <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <header className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-[#18652c] mb-8 text-center">Journal Archives</h1>
                        <p className="text-xl text-[#18652c] mb-12 text-center max-w-3xl mx-auto">
                            Explore our comprehensive collection of past journal issues. Browse through years of academic research,
                            scholarly articles, and groundbreaking studies published in MinSU Research Journal. Access historical
                            publications and trace the evolution of knowledge in various fields.
                        </p>

                        <div className="mt-6 flex justify-center items-center space-x-4 text-[#18652c]">
                            <LibraryBig className="w-8 h-8" />
                            <span className="text-sm font-medium">
                                {issues.length} Issues Archived
                            </span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            [...Array(3)].map((_, index) => (
                                <div key={index} className="animate-pulse bg-white rounded-2xl p-6 shadow-lg">
                                    <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                                </div>
                            ))
                        ) : issues.length === 0 ? (
                            <div className="col-span-full text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <LibraryBig className="w-16 h-16 mx-auto" />
                                </div>
                                <p className="text-gray-500 text-lg">No archived issues found</p>
                            </div>
                        ) : (
                            issues.map((issue) => (
                                <div
                                    key={issue.id}
                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="relative h-80 perspective-1000 px-6 pt-6">
                                        <div className="relative h-full w-full transform-style-preserve-3d transition-transform duration-500 group-hover:rotate-y-10">
                                            <div className="absolute inset-0 bg-gray-100 shadow-book overflow-hidden">
                                                <img
                                                    src={issue.coverImage}
                                                    alt={`Cover of ${issue.title}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gray-800 to-gray-900">
                                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold transform -rotate-90 origin-center whitespace-nowrap">
                                                        Vol. {issue.volume}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-4 left-4 right-4 h-4 bg-gradient-to-t from-black/20 to-transparent blur-md opacity-50 transition-opacity group-hover:opacity-30"></div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-4 flex items-center space-x-2 text-sm text-emerald-600">
                                            <CalendarDays className="w-4 h-4" />
                                            <span>
                                                {new Date(issue.publicationDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                            {issue.title}
                                        </h2>

                                        <div className="flex items-center space-x-4 text-gray-500 mb-4">
                                            <div className="flex items-center space-x-1">
                                                <BookOpen className="w-4 h-4" />
                                                <span>Vol. {issue.volume}</span>
                                            </div>
                                            <span className="text-gray-300">|</span>
                                            <div className="flex items-center space-x-1">
                                                <span>Issue {issue.issueNumber}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/journals/${issue.id}`}
                                                className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                            >
                                                Explore Issue
                                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                                                {issue.articles} {issue.articles === 1 ? 'Article' : 'Articles'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {!loading && issues.length > 0 && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={() => alert('Implement pagination')}
                                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Load More Issues
                                <ArrowRight className="w-5 h-5 ml-2 transform rotate-90" />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}