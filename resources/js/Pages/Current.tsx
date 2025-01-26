import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, ExternalLink } from 'lucide-react';

export default function Current({ auth }: PageProps) {
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
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1952/279",
            },
            {
                id: 2,
                title: "Sustainable Practices in Urban Development: A Global Perspective",
                authors: "Emily White, Michael Brown",
                abstract: "An analysis of sustainable practices in urban planning and development, with a focus on environmental impacts and future directions...",
                url: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1953",
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1953/280",
            },
            {
                id: 3,
                title: "The Impact of AI on Data Security in Modern Applications",
                authors: "John Doe, Jane Smith",
                abstract: "This study explores the transformative effects of artificial intelligence on data security, examining both the benefits and risks...",
                url: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1952",
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1952/279",
            },
            {
                id: 4,
                title: "Sustainable Practices in Urban Development: A Global Perspective",
                authors: "Emily White, Michael Brown",
                abstract: "An analysis of sustainable practices in urban planning and development, with a focus on environmental impacts and future directions...",
                url: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1953",
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1953/280",
            },

        ],
    };

    return (
        <>
            <Head title="Current" />
            <Header auth={auth} />

            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                            Current Issue
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-700"></span>
                        </h1>
                    </div>

                    {/* Issue Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 transition-all duration-300 hover:shadow-xl">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <img
                                src={currentIssue.coverImageUrl}
                                alt={`Cover of ${currentIssue.volume} - ${currentIssue.issue}`}
                                className="w-64 h-80 object-cover rounded-xl shadow-md transform hover:scale-105 transition-transform"
                            />
                            <div className="flex-1">
                                <div className="mb-4">
                                    <span className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
                                        Latest Issue
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {currentIssue.volume}, {currentIssue.issue}
                                </h2>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <span className="text-lg">{currentIssue.year}</span>
                                    <span className="h-1 w-1 bg-gray-400 rounded-full"></span>
                                    <span className="text-lg">Published {currentIssue.publicationDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Articles Grid */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-green-500 pl-4">
                            Featured Articles
                        </h2>

                        <div className="grid gap-8 md:grid-cols-2">
                            {currentIssue.articles.map((article) => (
                                <article
                                    key={article.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <Link href={article.url} className="group">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                                                {article.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mb-4">By {article.authors}</p>
                                        <p className="text-gray-600 mb-5 text-justify">{article.abstract}</p>

                                        <div className="flex items-center justify-between border-t pt-4">
                                            <Link
                                                href={article.url}
                                                className="flex items-center text-green-600 hover:text-green-700 font-medium"
                                                target="_blank"
                                            >
                                                View Article
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </Link>
                                            <Link
                                                href={article.pdfUrl}
                                                className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
                                                target="_blank"
                                            >
                                                <FileText className="w-5 h-5 mr-2" />
                                                PDF
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}