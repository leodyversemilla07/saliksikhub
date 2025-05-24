import Footer from '@/components/landing-pages/site-footer';
import Header from '@/components/landing-pages/site-header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, Eye } from 'lucide-react';
import { Breadcrumb } from '@/components/breadcrumb';

export default function Current({ auth }: PageProps) {
    const currentIssue = {
        volume: "23",
        number: "1",
        year: 2025,
        fullTitle: "Vol. 23 No. 1 (2025): DDMRJ - Current Issue",
        specialIssueTitle: "",
        publicationDate: "2025-05-07",
        coverImageUrl: "images/journal-cover.webp",
        articles: [
            {
                id: 0,
                title: "About this Issue",
                authors: "John Doe",
                abstract: "An introduction to this current issue of the journal.",
                keywords: ["Editorial", "Introduction"],
                url: "#about-this-issue",
                pdfUrl: "",
                doi: "",
                pages: "i-ii",
                citations: 0,
                downloads: 0,
                category: "Editorial",
                institution: "Mindoro State University",
            },
            {
                id: 1,
                title: "Cultural Preservation Efforts Among the Hanunuo Mangyan: A Case Study",
                authors: "Dr. Juan Dela Cruz, Prof. Maria Santos",
                abstract: "This study investigates contemporary cultural preservation initiatives within a Hanunuo Mangyan community in Mindoro, examining the role of elders and youth in maintaining traditions amidst modernization.",
                keywords: ["Mangyan", "Indigenous Studies", "Cultural Preservation", "Hanunuo", "Mindoro"],
                url: "https://ddmrj.minsu.edu.ph/articles/1",
                pdfUrl: "https://ddmrj.minsu.edu.ph/articles/1/pdf",
                doi: "10.xxxx/ddmrj.2025.23.1.1",
                pages: "1-15",
                citations: 0,
                downloads: 0,
                category: "Mangyan and Multidisciplinary Indigenous Studies",
                institution: "Mindoro State University",
            },
            {
                id: 2,
                title: "Optimizing Tilapia Production in Freshwater Ponds using Locally Sourced Feeds",
                authors: "Dr. Ana Reyes, Engr. Pedro Gomez",
                abstract: "This research explores the efficacy of alternative, locally sourced feed formulations for enhancing tilapia growth and yield in small-scale aquaculture systems in the Philippines.",
                keywords: ["Aquaculture", "Tilapia", "Sustainable Agriculture", "Agri-Innovation", "Local Feeds"],
                url: "https://ddmrj.minsu.edu.ph/articles/2",
                pdfUrl: "https://ddmrj.minsu.edu.ph/articles/2/pdf",
                doi: "10.xxxx/ddmrj.2025.23.1.2",
                pages: "16-30",
                citations: 0,
                downloads: 0,
                category: "Agriculture, Aquaculture, and Agri-Innovation",
                institution: "Mindoro State University",
            },
            {
                id: 3,
                title: "Avian Diversity in the Foothills of Mount Halcon: A Preliminary Survey",
                authors: "Prof. Josefa Mercado, Dr. Luisito Fernandez",
                abstract: "A preliminary survey documenting the avian species present in the lower montane forests of Mount Halcon, highlighting endemic and threatened species requiring conservation focus.",
                keywords: ["Biodiversity", "Mount Halcon", "Ornithology", "Conservation", "Endemic Species"],
                url: "https://ddmrj.minsu.edu.ph/articles/3",
                pdfUrl: "https://ddmrj.minsu.edu.ph/articles/3/pdf",
                doi: "10.xxxx/ddmrj.2025.23.1.3",
                pages: "31-45",
                citations: 0,
                downloads: 0,
                category: "Halcon and Highlands Biodiversity Conservation",
                institution: "Mindoro State University",
            },
            {
                id: 4,
                title: "Ethnobotanical Study of Medicinal Plants Used by Iraya Mangyan Communities",
                authors: "Dr. Maria Clara, Prof. Andres Bonifacio",
                abstract: "This research documents the traditional knowledge of medicinal plants used by Iraya Mangyan communities in Oriental Mindoro, aiming to preserve this heritage and explore potential pharmacological applications.",
                keywords: ["Ethnobotany", "Medicinal Plants", "Iraya Mangyan", "Indigenous Knowledge", "Oriental Mindoro"],
                url: "https://ddmrj.minsu.edu.ph/articles/4",
                pdfUrl: "https://ddmrj.minsu.edu.ph/articles/4/pdf",
                doi: "10.xxxx/ddmrj.2025.23.1.4",
                pages: "46-60",
                citations: 0,
                downloads: 0,
                category: "Mangyan and Multidisciplinary Indigenous Studies",
                institution: "Mindoro State University",
            },
            {
                id: 5,
                title: "Impact of Climate Change on Rice Farming in Occidental Mindoro: Farmers' Perspectives and Adaptation Strategies",
                authors: "Dr. Emilio Aguinaldo, Engr. Gabriela Silang",
                abstract: "This study assesses the perceived impacts of climate change on rice farming practices in Occidental Mindoro and identifies the adaptation strategies employed by local farmers.",
                keywords: ["Climate Change", "Rice Farming", "Adaptation Strategies", "Occidental Mindoro", "Sustainable Agriculture"],
                url: "https://ddmrj.minsu.edu.ph/articles/5",
                pdfUrl: "https://ddmrj.minsu.edu.ph/articles/5/pdf",
                doi: "10.xxxx/ddmrj.2025.23.1.5",
                pages: "61-75",
                citations: 0,
                downloads: 0,
                category: "Agriculture, Aquaculture, and Agri-Innovation",
                institution: "Mindoro State University",
            },
            {
                id: 6,
                title: "Renewable Energy Adoption in Off-Grid Communities: A Mindoro Case Study",
                authors: "Dr. Jose Rizal, Engr. Apolinario Mabini",
                abstract: "This paper examines the factors influencing the adoption of renewable energy technologies (solar, micro-hydro) in remote, off-grid communities in Mindoro, and proposes strategies to accelerate their uptake.",
                keywords: ["Renewable Energy", "Off-Grid", "Solar Power", "Micro-Hydro", "Community Development", "Mindoro"],
                url: "https://ddmrj.minsu.edu.ph/articles/6",
                pdfUrl: "https://ddmrj.minsu.edu.ph/articles/6/pdf",
                doi: "10.xxxx/ddmrj.2025.23.1.6",
                pages: "76-90",
                citations: 0,
                downloads: 0,
                category: "Technology and Engineering for Regional Development",
                institution: "Mindoro State University",
            },
            {
                id: 7,
                title: "The Role of Ecotourism in Conserving Tamaraw Habitats in Mounts Iglit-Baco National Park",
                authors: "Prof. Gabriela Silang, Dr. Andres Bonifacio",
                abstract: "This study evaluates the impact of ecotourism activities on the conservation of Tamaraw (Bubalus mindorensis) and their habitats within Mounts Iglit-Baco National Park, offering recommendations for sustainable tourism practices.",
                keywords: ["Ecotourism", "Tamaraw Conservation", "Biodiversity", "Protected Areas", "Sustainable Development", "Mounts Iglit-Baco"],
                url: "https://ddmrj.minsu.edu.ph/articles/7",
                pdfUrl: "https://ddmrj.minsu.edu.ph/articles/7/pdf",
                doi: "10.xxxx/ddmrj.2025.23.1.7",
                pages: "91-105",
                citations: 0,
                downloads: 0,
                category: "Halcon and Highlands Biodiversity Conservation",
                institution: "Mindoro State University",
            },
            {
                id: 8,
                title: "Improving Digital Literacy Skills Among Public School Teachers in Oriental Mindoro",
                authors: "Dr. Clara Barton, Prof. Florence Nightingale",
                abstract: "This action research project details the implementation and outcomes of a professional development program aimed at enhancing the digital literacy skills of public school teachers in Oriental Mindoro.",
                keywords: ["Digital Literacy", "Teacher Training", "Education Technology", "Professional Development", "Oriental Mindoro"],
                url: "https://ddmrj.minsu.edu.ph/articles/8",
                pdfUrl: "https://ddmrj.minsu.edu.ph/articles/8/pdf",
                doi: "10.xxxx/ddmrj.2025.23.1.8",
                pages: "106-120",
                citations: 0,
                downloads: 0,
                category: "Education and Social Sciences",
                institution: "Mindoro State University",
            }
        ] as Article[],
    };

    const breadcrumbItems = [
        { href: '/', label: 'Home' },
        { href: '/archives', label: 'Archives' },
        { href: '', label: currentIssue.fullTitle }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title={`${currentIssue.fullTitle} - Daluyang Dunong MinSU Research Journal`} />
            <Header auth={auth} />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb items={breadcrumbItems} />

                    {/* Page Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                        {currentIssue.fullTitle}
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-2/3">

                            <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
                                <div className="w-full md:w-auto order-2 md:order-1">
                                    <img
                                        src={currentIssue.coverImageUrl}
                                        alt={`Cover of ${currentIssue.fullTitle}`}
                                        className="w-auto h-auto max-w-[150px] sm:max-w-xs object-cover rounded shadow-lg border border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                <div className="order-1 md:order-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                        Published: {currentIssue.publicationDate}
                                    </p>
                                    {/* Add other details here if needed, like ISSN, etc. */}
                                </div>
                            </div>

                            <section className="mb-10">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2">Articles</h2>
                                {currentIssue.articles.length > 0 ? (
                                    <div className="space-y-8">
                                        {currentIssue.articles.map((article) => (
                                            <ArticleCard key={article.id} article={article} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300">Articles for this issue will be listed here.</p>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
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
        <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
                <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        {article.category || 'Research Article'}
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    <Link href={article.url} className="hover:text-[#18652c] dark:hover:text-[#3fb65e] transition-colors duration-300">
                        {article.title}
                    </Link>
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">By: {article.authors}</p>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                    {article.abstract}
                </p>

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>Pages: {article.pages}</span> | <span>DOI: {article.doi}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400"></div>

                    <div className="flex space-x-2">
                        <Link
                            href={article.url}
                            className="text-xs flex items-center px-2.5 py-1 rounded-md text-[#18652c] dark:text-[#3fb65e] hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300"
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                        </Link>
                        <Link
                            href={article.pdfUrl}
                            className="text-xs flex items-center px-2.5 py-1 bg-[#18652c] hover:bg-[#145024] dark:bg-[#3fb65e] dark:hover:bg-[#35a051] text-white rounded-md transition-colors duration-300"
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
