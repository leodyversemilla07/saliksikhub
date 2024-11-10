import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';

export default function Current({ auth }: PageProps) {
    const journalName = "MinSU Research Journal";
    const logoUrl = "https://minsu.edu.ph/template/images/logo.png";

    // Sample data - Replace with dynamic data from your backend
    const currentIssue = {
        volume: "Volume 5",
        issue: "Issue 3",
        year: 2024,
        publicationDate: "November 7, 2024",
        coverImageUrl: "https://static.wixstatic.com/media/b6a543_4a6c63aa384542f3af11ebe63616055f~mv2.jpeg/v1/fill/w_952,h_1212,al_c,q_85,enc_auto/b6a543_4a6c63aa384542f3af11ebe63616055f~mv2.jpeg",
        articles: [
            {
                id: 1,
                title: "The Impact of AI on Data Security in Modern Applications",
                authors: "John Doe, Jane Smith",
                abstract: "This study explores the transformative effects of artificial intelligence on data security, examining both the benefits and risks...",
                url: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1952",
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1952/279",  // Link to the article PDF
            },
            {
                id: 2,
                title: "Sustainable Practices in Urban Development: A Global Perspective",
                authors: "Emily White, Michael Brown",
                abstract: "An analysis of sustainable practices in urban planning and development, with a focus on environmental impacts and future directions...",
                url: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1953",
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1953/280",  // Link to the article PDF
            },
            // Add more articles as needed
        ],
    };

    return (
        <>
            <Head title="Current" />

            <Header
                auth={auth}
                journalName={journalName}
                logoUrl={logoUrl}
            />
            <div className="max-w-screen-lg mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Current Issue</h1>

                {/* Issue Information */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4">
                        <img
                            src={currentIssue.coverImageUrl}
                            alt={`Cover of ${currentIssue.volume} - ${currentIssue.issue}`}
                            className="w-40 h-52 object-cover shadow-md rounded-md"
                        />
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {currentIssue.volume}, {currentIssue.issue} ({currentIssue.year})
                            </h2>
                            <p className="text-gray-600 mt-2">Published on {currentIssue.publicationDate}</p>
                        </div>
                    </div>
                </div>

                {/* Articles List */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Articles</h2>
                    <ul className="space-y-6">
                        {currentIssue.articles.map((article) => (
                            <li key={article.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <Link href={article.url}>
                                    <h3 className="text-xl font-bold text-green-700 hover:underline">
                                        {article.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-600 text-sm mb-2">By: {article.authors}</p>
                                <p className="text-gray-700 mb-4">{article.abstract}</p>
                                <div className="flex items-center space-x-4">
                                    {/* View PDF link */}
                                    <Link href={article.pdfUrl} className="text-green-600 font-semibold hover:text-green-800 flex items-center space-x-2" target="_blank">
                                        <span>View PDF</span>
                                        <FileText className="w-5 h-5 text-green-600" />
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
            <Footer
                journalName={journalName}
            />
        </>
    );
}
