import { Link } from '@inertiajs/react';
import { ArrowRight, Download, ExternalLink } from 'lucide-react';

interface Article {
    id: number;
    title: string;
    authors: string;
    abstract: string;
    category: string;
    date: string;
    doi: string;
    citationCount: number;
    imageUrl: string;
}

// Mock data for latest articles
const latestArticles = [
    {
        id: 1,
        title: "Climate Change Adaptation Strategies for Agricultural Sustainability in Southeast Asia",
        authors: "Maria Santos, John Doe, Sarah Johnson",
        abstract: "This paper examines various adaptation strategies implemented by farmers in Southeast Asia to combat the effects of climate change on agricultural productivity...",
        category: "Environmental Science",
        date: "June 2023",
        doi: "10.1234/minsu.2023.01.0001",
        citationCount: 12,
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        title: "Efficacy of Traditional Herbal Medicine in Treating Common Respiratory Infections",
        authors: "Dr. Robert Chen, Maria Garcia, PhD, Li Wei",
        abstract: "This research investigates the efficacy of selected traditional herbal medicines commonly used in the Philippines for treating respiratory infections...",
        category: "Medical Science",
        date: "June 2023",
        doi: "10.1234/minsu.2023.01.0002",
        citationCount: 8,
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVyYmFsJTIwbWVkaWNpbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        title: "Exploring Sustainable Tourism Models for Rural Communities",
        authors: "Angela Cruz, Michael Smith",
        abstract: "This study explores sustainable tourism development models and their impact on the socioeconomic conditions of rural communities in Oriental Mindoro...",
        category: "Social Sciences",
        date: "June 2023",
        doi: "10.1234/minsu.2023.01.0003",
        citationCount: 5,
        imageUrl: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cnVyYWwlMjB0b3VyaXNtfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    }
];

export default function LatestArticles() {
    return (
        <section className="pb-24">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
                    <p className="mt-2 text-gray-600 max-w-2xl">
                        Explore the most recent research publications across various disciplines
                    </p>
                </div>
                <Link
                    href={route('current')}
                    className="flex items-center text-[#18652c] hover:text-[#145024] font-medium"
                >
                    View all articles
                    <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
}

function ArticleCard({ article }: { article: Article }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2.5 py-1 bg-green-100 text-[#18652c] text-xs font-medium rounded-full">
                        {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.date}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[56px]">
                    {article.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {article.abstract}
                </p>

                <div className="text-sm text-gray-500 mb-4">
                    <p>By: {article.authors}</p>
                    <p className="mt-1">DOI: {article.doi}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Citations: {article.citationCount}
                    </div>

                    <div className="flex space-x-2">
                        <button className="p-1.5 text-gray-500 hover:text-[#18652c] rounded-full hover:bg-green-50 transition-colors">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download PDF</span>
                        </button>
                        <Link
                            href={`#article-${article.id}`}
                            className="p-1.5 text-gray-500 hover:text-[#18652c] rounded-full hover:bg-green-50 transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Article</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
