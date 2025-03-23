import Footer from '@/Components/landing-pages/Footer';
import Header from '@/Components/landing-pages/Header';
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
            <Head title="Current Issue" />
            <Header auth={auth} />

            <main className="bg-white min-h-screen">
                {/* Page Header */}
                <div className="bg-gradient-to-br from-[#f0f8f3] to-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl font-bold text-[#18652c] mb-4 text-center">Current Issue</h1>
                        <p className="text-xl text-[#18652c] text-center max-w-3xl mx-auto">
                            Stay up to date with our latest research publications. Our current issue features groundbreaking studies
                            and important findings across various scientific and technological domains.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-[#f0f8f3] rounded-xl shadow-lg p-8 mb-16 transition-all duration-300 hover:shadow-xl">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <img
                                src={currentIssue.coverImageUrl}
                                alt={`Cover of ${currentIssue.volume} - ${currentIssue.issue}`}
                                className="w-64 h-80 object-cover rounded-xl shadow-md"
                            />
                            <div className="flex-1">
                                <div className="mb-4">
                                    <span className="inline-block bg-[#e6f3eb] text-[#18652c] px-4 py-1 rounded-full text-sm font-medium">
                                        Latest Issue
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-[#18652c] mb-2">
                                    {currentIssue.volume}, {currentIssue.issue}
                                </h2>
                                <div className="flex items-center gap-4 text-[#18652c]">
                                    <span className="text-lg">{currentIssue.year}</span>
                                    <span className="h-1 w-1 bg-[#3fb65e] rounded-full"></span>
                                    <span className="text-lg">Published {currentIssue.publicationDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Articles Grid */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-[#18652c] mb-8 border-l-4 border-[#3fb65e] pl-4">
                            Featured Articles
                        </h2>

                        <div className="grid gap-8 md:grid-cols-2">
                            {currentIssue.articles.map((article) => (
                                <article
                                    key={article.id}
                                    className="bg-[#f0f8f3] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <Link href={article.url} className="group">
                                            <h3 className="text-xl font-bold text-[#18652c] mb-3 group-hover:text-[#3fb65e] transition-colors">
                                                {article.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-[#18652c]/70 mb-4">By {article.authors}</p>
                                        <p className="text-[#18652c]/80 mb-5 text-justify">{article.abstract}</p>

                                        <div className="flex items-center justify-between border-t border-[#3fb65e]/20 pt-4">
                                            <Link
                                                href={article.url}
                                                className="flex items-center text-[#3fb65e] hover:text-[#18652c] font-medium transition-colors"
                                                target="_blank"
                                            >
                                                View Article
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </Link>
                                            <Link
                                                href={article.pdfUrl}
                                                className="flex items-center bg-[#e6f3eb] text-[#18652c] px-4 py-2 rounded-lg hover:bg-[#d0e9dc] transition-colors"
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

                    {/* Standardized CTA Section */}
                    <div className="bg-gradient-to-br from-[#f0f8f3] to-[#e6f3eb] rounded-xl p-8 shadow-lg text-center mt-16">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-4">Access Previous Issues</h2>
                        <p className="text-xl text-[#18652c] mb-8">
                            Explore our archive of past issues to discover more valuable research in your field of interest.
                        </p>
                        <Link
                            href={route('archives')}
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-sm text-white bg-[#3fb65e] hover:bg-[#18652c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fb65e] transition-all duration-300"
                        >
                            Browse Archives
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}