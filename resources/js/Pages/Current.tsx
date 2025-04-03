import Footer from '@/components/landing-pages/site-footer';
import Header from '@/components/landing-pages/site-header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, ExternalLink, Download, Calendar, Book, Users, FileSearch, ArrowRight, BookOpen } from 'lucide-react';

export default function Current({ auth }: PageProps) {
    const currentIssue = {
        volume: "Volume 5",
        issue: "Issue 3",
        year: 2024,
        publicationDate: "November 7, 2024",
        description: "This issue features research on sustainable development, artificial intelligence applications, public health interventions, and advances in agricultural technology.",
        coverImageUrl: "https://static.wixstatic.com/media/b6a543_4a6c63aa384542f3af11ebe63616055f~mv2.jpeg/v1/fill/w_952,h_1212,al_c,q_85,enc_auto/b6a543_4a6c63aa384542f3af11ebe63616055f~mv2.jpeg",
        metrics: {
            articles: 12,
            contributors: 28,
            institutions: 9,
            downloads: 1457,
        },
        editorial: {
            title: "Advancing Sustainable Solutions Through Research Collaboration",
            author: "Dr. Maricel Santos",
            role: "Editor-in-Chief",
            excerpt: "In this issue, we explore the critical intersection of research innovation and sustainable development...",
        },
        articles: [
            {
                id: 1,
                title: "The Impact of AI on Data Security in Modern Applications",
                authors: "John Doe, Jane Smith",
                abstract: "This study explores the transformative effects of artificial intelligence on data security, examining both the benefits and risks that AI technologies bring to contemporary cybersecurity frameworks. The research identifies emerging patterns in AI-enabled attacks and proposes novel countermeasures.",
                keywords: ["Artificial Intelligence", "Data Security", "Cybersecurity", "Machine Learning"],
                url: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1952",
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1952/279",
                doi: "10.1234/minsu.2023.05.03.001",
                pages: "103-128",
                citations: 8,
                downloads: 342,
                category: "Information Technology",
                institution: "Mindoro State University"
            },
            {
                id: 2,
                title: "Sustainable Practices in Urban Development: A Global Perspective",
                authors: "Emily White, Michael Brown, Robert Chen, PhD",
                abstract: "An analysis of sustainable practices in urban planning and development, with a focus on environmental impacts and future directions. This comparative study examines case studies from Southeast Asian cities and identifies transferable strategies for sustainable urban growth.",
                keywords: ["Urban Planning", "Sustainability", "Environmental Impact", "Smart Cities"],
                url: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1953",
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1953/280",
                doi: "10.1234/minsu.2023.05.03.002",
                pages: "129-156",
                citations: 12,
                downloads: 417,
                category: "Urban Planning",
                institution: "Asian Development Research Institute"
            },
            {
                id: 3,
                title: "Climate Change Adaptation in Coastal Communities of Oriental Mindoro",
                authors: "Maria Santos, PhD, Gabriel Reyes",
                abstract: "This research documents indigenous knowledge and innovative adaptation strategies developed by coastal communities in Oriental Mindoro in response to climate change effects. The study highlights the integration of local ecological knowledge with scientific approaches to enhance community resilience.",
                keywords: ["Climate Change", "Coastal Communities", "Adaptation Strategies", "Indigenous Knowledge"],
                url: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1954",
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1954/281",
                doi: "10.1234/minsu.2023.05.03.003",
                pages: "157-183",
                citations: 6,
                downloads: 298,
                category: "Environmental Science",
                institution: "Mindoro State University"
            },
            {
                id: 4,
                title: "Public Health Interventions in Rural Settings: A Case Study from the Philippines",
                authors: "Dr. Anna Cruz, Manuel Garcia, Lisa Tan, MPH",
                abstract: "A comprehensive examination of public health intervention strategies in rural Philippine communities, analyzing effectiveness, challenges, and community engagement models. This study provides evidence-based recommendations for improving healthcare access and outcomes in resource-limited settings.",
                keywords: ["Public Health", "Rural Healthcare", "Community Engagement", "Health Interventions"],
                url: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1955",
                pdfUrl: "https://mjst.ustp.edu.ph/index.php/mjst/article/view/1955/282",
                doi: "10.1234/minsu.2023.05.03.004",
                pages: "184-210",
                citations: 5,
                downloads: 362,
                category: "Public Health",
                institution: "National Institute for Health Research"
            },
        ],
    };

    return (
        <>
            <Head title={`Current Issue - ${currentIssue.volume}, ${currentIssue.issue}`} />
            <Header auth={auth} />

            <main className="bg-white min-h-screen">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="w-full md:w-2/3">
                                <div className="mb-3 flex items-center">
                                    <Calendar className="h-5 w-5 text-[#18652c] mr-2" />
                                    <span className="text-sm text-gray-500">Published: {currentIssue.publicationDate}</span>
                                </div>
                                
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Current Issue</h1>
                                <div className="flex items-center text-[#18652c] font-medium text-xl mb-4">
                                    <Book className="h-5 w-5 mr-2" />
                                    <span>{currentIssue.volume}, {currentIssue.issue} ({currentIssue.year})</span>
                                </div>
                                
                                <p className="text-gray-600 max-w-3xl mb-6">
                                    {currentIssue.description}
                                </p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                                        <div className="text-2xl font-bold text-[#18652c]">{currentIssue.metrics.articles}</div>
                                        <div className="text-gray-600 text-sm">Articles</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                                        <div className="text-2xl font-bold text-[#18652c]">{currentIssue.metrics.contributors}</div>
                                        <div className="text-gray-600 text-sm">Contributors</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                                        <div className="text-2xl font-bold text-[#18652c]">{currentIssue.metrics.institutions}</div>
                                        <div className="text-gray-600 text-sm">Institutions</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                                        <div className="text-2xl font-bold text-[#18652c]">{currentIssue.metrics.downloads}</div>
                                        <div className="text-gray-600 text-sm">Downloads</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-1/3">
                                <div className="relative">
                                    <div className="absolute -top-3 -left-3 w-full h-full bg-[#18652c]/10 rounded-lg"></div>
                                    <img
                                        src={currentIssue.coverImageUrl}
                                        alt={`Cover of ${currentIssue.volume} - ${currentIssue.issue}`}
                                        className="relative z-10 w-full h-auto max-w-xs mx-auto object-cover rounded-lg shadow-md border border-gray-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Editorial Note */}
                    <section className="mb-16 bg-gradient-to-br from-[#f8f9fa] to-[#f0f8f3] p-6 md:p-8 rounded-xl border border-gray-200">
                        <div className="flex items-center mb-4">
                            <BookOpen className="h-6 w-6 text-[#18652c] mr-2" />
                            <h2 className="text-2xl font-bold text-gray-900">From the Editor</h2>
                        </div>
                        
                        <div className="prose max-w-none text-gray-600">
                            <h3 className="text-xl font-bold text-[#18652c] mb-2">{currentIssue.editorial.title}</h3>
                            <p className="mb-4">{currentIssue.editorial.excerpt}</p>
                            <div className="text-sm text-gray-500 italic mt-4">
                                — {currentIssue.editorial.author}, {currentIssue.editorial.role}
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <Link
                                href="#"
                                className="text-[#18652c] hover:text-[#145024] font-medium inline-flex items-center"
                            >
                                Read full editorial
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </section>

                    {/* Articles Section */}
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <FileSearch className="h-6 w-6 text-[#18652c] mr-2" />
                                <h2 className="text-2xl font-bold text-gray-900">Published Articles</h2>
                            </div>
                            <div>
                                <Link
                                    href="#"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Issue
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {currentIssue.articles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>

                    {/* Call to Action */}
                    <div className="grid md:grid-cols-2 gap-8 mt-16">
                        <div className="bg-gradient-to-br from-[#18652c] to-[#0f4b1e] text-white p-8 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-4">Submit to Our Next Issue</h3>
                            <p className="mb-6">
                                We invite researchers to contribute to our upcoming issue. Submit your original research 
                                articles, case studies, or review papers for peer review consideration.
                            </p>
                            <div className="flex items-center text-sm mb-4">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Submission deadline: January 15, 2025</span>
                            </div>
                            <Link
                                href={route('submissions')}
                                className="inline-flex items-center px-5 py-2.5 border border-white rounded-md text-sm font-medium text-white hover:bg-white hover:text-[#18652c] transition-colors duration-300"
                            >
                                Learn more about submissions
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                        
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Previous Issues</h3>
                            <p className="text-gray-600 mb-6">
                                Explore our journal archives to access previous volumes and issues. Our repository 
                                contains research dating back to 2010.
                            </p>
                            <div className="space-y-3 mb-6">
                                <Link 
                                    href="#" 
                                    className="flex items-center text-[#18652c] hover:text-[#0f4b1e]"
                                >
                                    <Book className="h-4 w-4 mr-2" />
                                    Volume 5, Issue 2 (July 2024)
                                </Link>
                                <Link 
                                    href="#" 
                                    className="flex items-center text-[#18652c] hover:text-[#0f4b1e]"
                                >
                                    <Book className="h-4 w-4 mr-2" />
                                    Volume 5, Issue 1 (March 2024)
                                </Link>
                                <Link 
                                    href="#" 
                                    className="flex items-center text-[#18652c] hover:text-[#0f4b1e]"
                                >
                                    <Book className="h-4 w-4 mr-2" />
                                    Volume 4, Issue 4 (December 2023)
                                </Link>
                            </div>
                            <Link
                                href={route('archives')}
                                className="inline-flex items-center px-5 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                            >
                                Browse complete archives
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

interface Article {
    id: number;
    title: string;
    authors: string;
    abstract: string;
    keywords: string[];
    url: string;
    pdfUrl: string;
    doi: string;
    pages: string;
    citations: number;
    downloads: number;
    category: string;
    institution: string;
}

function ArticleCard({ article }: { article: Article }) {
    return (
        <article className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-md">
            <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-[#18652c]">
                        {article.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Research Article
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group">
                    <Link href={article.url} className="hover:text-[#18652c] transition-colors">
                        {article.title}
                    </Link>
                </h3>
                
                <div className="text-sm text-gray-600 mb-4">
                    <p className="font-medium">By: {article.authors}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                        <span>{article.institution}</span>
                        <span>Pages: {article.pages}</span>
                        <span>DOI: {article.doi}</span>
                    </div>
                </div>
                
                <div className="text-gray-700 mb-5">
                    <p className="line-clamp-3">{article.abstract}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {article.keywords.map((keyword: string, idx: number) => (
                        <span 
                            key={idx}
                            className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center text-gray-500 text-sm">
                            <Users className="h-4 w-4 mr-1" />
                            {article.citations} citations
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            {article.downloads} downloads
                        </div>
                    </div>
                    
                    <div className="flex space-x-2">
                        <Link
                            href={article.url}
                            className="flex items-center px-3 py-1.5 rounded-md text-[#18652c] hover:bg-green-50 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                        </Link>
                        <Link
                            href={article.pdfUrl}
                            className="flex items-center px-3 py-1.5 bg-[#18652c] text-white rounded-md hover:bg-[#145024] transition-colors"
                        >
                            <FileText className="w-4 h-4 mr-1" />
                            PDF
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}