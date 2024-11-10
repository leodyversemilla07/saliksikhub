import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

interface JournalIssue {
    id: number;
    title: string;
    volume: number;
    issueNumber: number;
    publicationDate: string;
    articles: number; // Number of articles in the issue
    coverImage: string; // URL to the cover image
}

export default function Archives({ auth }: PageProps) {
    const journalName = "MinSU Research Journal";
    const logoUrl = "https://minsu.edu.ph/template/images/logo.png";

    const [issues, setIssues] = useState<JournalIssue[]>([]);
    const [loading, setLoading] = useState(true);

    // Simulating fetching archived issues
    useEffect(() => {
        // Replace this with an API call when ready
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

            <Header
                auth={auth}
                journalName={journalName}
                logoUrl={logoUrl}
            />

            <div className="max-w-screen-xl mx-auto px-0">
                <div className="flex-grow bg-white from-blue-50 to-white text-black p-8">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Archives of MinSU Research Journal</h1>
                        <p className="text-lg text-gray-600">
                            Explore our collection of past journal issues and research articles.
                        </p>
                    </header>

                    <div className="space-y-8">
                        {loading ? (
                            <div className="text-center text-gray-500">Loading archived issues...</div>
                        ) : issues.length === 0 ? (
                            <div className="text-center text-gray-500">No archived issues available.</div>
                        ) : (
                            issues.map((issue) => (
                                <div key={issue.id} className="bg-white p-6 rounded-xl shadow-md">
                                    {/* Cover Image */}
                                    <div className="mb-4">
                                        <img
                                            src={issue.coverImage}
                                            alt={`Cover of ${issue.title}`}
                                            className="w-48 h-72 object-cover rounded-md" // Adjusted to a book-like aspect ratio
                                        />
                                    </div>

                                    <h2 className="text-2xl font-semibold text-gray-800">{issue.title}</h2>
                                    <div className="text-gray-500 text-sm mb-4">
                                        <span>Volume {issue.volume}, Issue {issue.issueNumber}</span> |{' '}
                                        <span>Published: {new Date(issue.publicationDate).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        {issue.articles} articles published in this issue.
                                    </p>
                                    <Link
                                        href={`/journals/${issue.id}`}
                                        className="text-green-500 hover:underline"
                                    >
                                        View Issue Details
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="text-center mt-8">
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600"
                            onClick={() => alert('Implement pagination or load more functionality')}
                        >
                            Load More Issues
                        </button>
                    </div>
                </div>
            </div>

            <Footer
                journalName={journalName}
            />
        </>
    );
}
