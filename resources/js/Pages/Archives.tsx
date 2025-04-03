import React, { useState } from 'react';
import Footer from '@/components/landing-pages/site-footer';
import Header from '@/components/landing-pages/site-header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    Book, Calendar, Download, FileText, Search, 
    ChevronDown, ChevronRight, Filter, X, BookOpen,
    Check
} from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

    // Sample archive data structure
    const archiveData: VolumeYear[] = [
        {
            year: 2024,
            volumes: [
                {
                    volume: 5,
                    issues: [
                        {
                            id: 1,
                            volume: 5,
                            issue: 2,
                            title: "Sustainable Development",
                            description: "Special issue exploring sustainable development practices in island ecosystems.",
                            coverImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&q=80&w=1613&auto=format&fit=crop",
                            publicationDate: "July 2024",
                            articles: [
                                {
                                    id: 101,
                                    title: "Community-Based Management of Marine Protected Areas in Oriental Mindoro",
                                    authors: "Maria Santos, Gabriel Reyes, Anna Lee",
                                    abstract: "This study evaluates the effectiveness of community-based management approaches for marine protected areas in coastal communities of Oriental Mindoro...",
                                    keywords: ["Marine Conservation", "Community Management", "Protected Areas"],
                                    doi: "10.1234/minsu.2024.05.02.001",
                                    pages: "103-125",
                                    pdfUrl: "#"
                                },
                                {
                                    id: 102,
                                    title: "Assessment of Renewable Energy Potential in Rural Philippines",
                                    authors: "Robert Chen, Elena Cruz",
                                    abstract: "A comprehensive analysis of renewable energy options for rural electrification in the Philippines, with focus on solar and micro-hydro applications...",
                                    keywords: ["Renewable Energy", "Rural Electrification", "Sustainability"],
                                    doi: "10.1234/minsu.2024.05.02.002",
                                    pages: "126-148",
                                    pdfUrl: "#"
                                }
                            ]
                        },
                        {
                            id: 2,
                            volume: 5,
                            issue: 1,
                            title: "Technology and Education",
                            description: "Focused on technological innovations in educational contexts.",
                            coverImageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&q=80&w=1374&auto=format&fit=crop",
                            publicationDate: "March 2024",
                            articles: [
                                {
                                    id: 103,
                                    title: "Digital Literacy Among Rural Teachers: Challenges and Opportunities",
                                    authors: "Manuel Garcia, Lisa Kim",
                                    abstract: "This research investigates the state of digital literacy among teachers in rural schools of Mindoro and identifies key challenges and opportunities...",
                                    keywords: ["Digital Literacy", "Rural Education", "Teacher Training"],
                                    doi: "10.1234/minsu.2024.05.01.001",
                                    pages: "5-27",
                                    pdfUrl: "#"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            year: 2023,
            volumes: [
                {
                    volume: 4,
                    issues: [
                        {
                            id: 3,
                            volume: 4,
                            issue: 4,
                            title: "Health and Wellness",
                            description: "Research on health interventions and wellness practices.",
                            coverImageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&q=80&w=1470&auto=format&fit=crop",
                            publicationDate: "December 2023",
                            articles: [
                                {
                                    id: 104,
                                    title: "Traditional Herbal Medicine Usage in Rural Philippine Communities",
                                    authors: "Dr. Anna Cruz, Miguel Santos",
                                    abstract: "This study documents the use of traditional herbal remedies in rural communities and analyzes their integration with modern healthcare practices...",
                                    keywords: ["Traditional Medicine", "Healthcare", "Ethnobotany"],
                                    doi: "10.1234/minsu.2023.04.04.001",
                                    pages: "203-225",
                                    pdfUrl: "#"
                                }
                            ]
                        },
                        {
                            id: 4,
                            volume: 4,
                            issue: 3,
                            title: "Agricultural Innovation",
                            description: "Advances in agricultural techniques and practices.",
                            coverImageUrl: "https://images.unsplash.com/photo-1463123081488-789f998ac9c4?ixlib=rb-4.0.3&q=80&w=1470&auto=format&fit=crop",
                            publicationDate: "September 2023",
                            articles: [
                                {
                                    id: 105,
                                    title: "Climate-Resilient Crop Varieties for Small-Scale Farmers",
                                    authors: "Roberto Tan, Sarah Johnson",
                                    abstract: "This research evaluates various crop varieties for their resilience to changing climate conditions in Oriental Mindoro...",
                                    keywords: ["Agriculture", "Climate Resilience", "Food Security"],
                                    doi: "10.1234/minsu.2023.04.03.001",
                                    pages: "153-179",
                                    pdfUrl: "#"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            year: 2022,
            volumes: [
                {
                    volume: 3,
                    issues: [
                        {
                            id: 5,
                            volume: 3,
                            issue: 4,
                            title: "Environmental Conservation",
                            description: "Research on preserving natural resources and ecosystems.",
                            coverImageUrl: "https://images.unsplash.com/photo-1569060368644-4b88894a8f94?ixlib=rb-4.0.3&q=80&w=1470&auto=format&fit=crop",
                            publicationDate: "December 2022",
                            articles: [
                                {
                                    id: 106,
                                    title: "Mangrove Forest Restoration Techniques in Coastal Areas",
                                    authors: "Gabriel Reyes, Maria Santos",
                                    abstract: "A comparative study of different mangrove restoration approaches and their long-term effectiveness in coastal ecosystems of Mindoro...",
                                    keywords: ["Mangrove Restoration", "Coastal Ecosystems", "Conservation"],
                                    doi: "10.1234/minsu.2022.03.04.001",
                                    pages: "203-228",
                                    pdfUrl: "#"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    // For demo purposes, collect all unique categories from all articles
    const allCategories = Array.from(
        new Set(
            archiveData.flatMap(year => 
                year.volumes.flatMap(vol => 
                    vol.issues.flatMap(issue => 
                        issue.articles.flatMap(article => article.keywords)
                    )
                )
            )
        )
    );

    // Filter logic
    const filteredArchives = archiveData
        .map(yearData => {
            // Year filter
            if (selectedYear !== null && yearData.year !== selectedYear) {
                return null;
            }
            
            const filteredVolumes = yearData.volumes
                .map(vol => {
                    // Volume filter
                    if (selectedVolume !== null && vol.volume !== selectedVolume) {
                        return null;
                    }
                    
                    const filteredIssues = vol.issues
                        .map(issue => {
                            let filteredArticles = issue.articles;
                            
                            // Keyword filter
                            if (activeFilters.length > 0) {
                                filteredArticles = filteredArticles.filter(article => 
                                    article.keywords.some(keyword => 
                                        activeFilters.includes(keyword)
                                    )
                                );
                            }
                            
                            // Search query filter
                            if (searchQuery.trim() !== '') {
                                const query = searchQuery.toLowerCase();
                                filteredArticles = filteredArticles.filter(article => 
                                    article.title.toLowerCase().includes(query) ||
                                    article.authors.toLowerCase().includes(query) ||
                                    article.abstract.toLowerCase().includes(query)
                                );
                            }
                            
                            // If no articles match, skip this issue
                            if (filteredArticles.length === 0) {
                                return null;
                            }
                            
                            return {
                                ...issue,
                                articles: filteredArticles
                            };
                        })
                        .filter(Boolean) as JournalIssue[];
                    
                    // If no issues match, skip this volume
                    if (filteredIssues.length === 0) {
                        return null;
                    }
                    
                    return {
                        ...vol,
                        issues: filteredIssues
                    };
                })
                .filter(Boolean) as { volume: number; issues: JournalIssue[] }[];
            
            // If no volumes match, skip this year
            if (filteredVolumes.length === 0) {
                return null;
            }
            
            return {
                ...yearData,
                volumes: filteredVolumes
            };
        })
        .filter(Boolean) as VolumeYear[];

    const toggleFilter = (filter: string) => {
        setActiveFilters(prev => 
            prev.includes(filter) 
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const clearFilters = () => {
        setActiveFilters([]);
        setSelectedYear(null);
        setSelectedVolume(null);
        setSearchQuery("");
    };

    // The function below is not needed as we're using the onChange event directly in the select
    // const handleVolumeSelect = (volume: number) => {
    //     setSelectedVolume(prev => prev === volume ? null : volume);
    // };

    const toggleIssueExpand = (issueId: number) => {
        setExpandedIssue(prev => prev === issueId ? null : issueId);
    };

    return (
        <>
            <Head title="Archives | MinSU Research Journal" />
            <Header auth={auth} />
            <main className="bg-white min-h-screen">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Journal Archives</h1>
                            <p className="text-xl text-gray-600">
                                Access our complete collection of published research articles organized by volume, issue, and publication date.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Search and filter section */}
                    <div className="mb-12">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                            <div className="md:flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0 flex items-center">
                                    <Search className="h-6 w-6 mr-3 text-[#18652c]" />
                                    Find Publications
                                </h2>
                                
                                {(activeFilters.length > 0 || selectedYear !== null || selectedVolume !== null || searchQuery) && (
                                    <button 
                                        onClick={clearFilters}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <X className="h-4 w-4 mr-1.5" />
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                            
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                        Search articles
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            id="search"
                                            placeholder="Search by title, author, or keyword"
                                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                                        Publication Year
                                    </label>
                                    <select
                                        id="year"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20"
                                        value={selectedYear || ""}
                                        onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                                    >
                                        <option value="">All Years</option>
                                        {archiveData.map(year => (
                                            <option key={year.year} value={year.year}>{year.year}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2">
                                        Volume
                                    </label>
                                    <select
                                        id="volume"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20"
                                        value={selectedVolume || ""}
                                        onChange={(e) => setSelectedVolume(e.target.value ? parseInt(e.target.value) : null)}
                                    >
                                        <option value="">All Volumes</option>
                                        {Array.from(new Set(archiveData.flatMap(y => y.volumes.map(v => v.volume)))).sort((a, b) => b - a).map(vol => (
                                            <option key={vol} value={vol}>Volume {vol}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Filter className="h-4 w-4 mr-1.5" />
                                    Filter by research area
                                </label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {allCategories.map((category, index) => (
                                        <button
                                            key={index}
                                            onClick={() => toggleFilter(category)}
                                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${
                                                activeFilters.includes(category)
                                                    ? 'bg-[#18652c] text-white'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            } transition-colors duration-200`}
                                        >
                                            {activeFilters.includes(category) && (
                                                <Check className="h-3.5 w-3.5 mr-1" />
                                            )}
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Archives display */}
                    <div className="space-y-16">
                        {filteredArchives.length > 0 ? (
                            filteredArchives.map((yearData) => (
                                <div key={yearData.year} className="space-y-8">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center border-b border-gray-200 pb-3">
                                        <Calendar className="h-6 w-6 mr-3 text-[#18652c]" />
                                        {yearData.year}
                                    </h2>
                                    
                                    <div className="space-y-12">
                                        {yearData.volumes.map((volumeData) => (
                                            <div key={volumeData.volume} className="space-y-8 pl-6 border-l-2 border-gray-100">
                                                <h3 className="text-xl font-bold text-gray-900 -ml-6 flex items-center">
                                                    <Book className="h-5 w-5 mr-2 text-[#18652c]" />
                                                    Volume {volumeData.volume}
                                                </h3>
                                                
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    {volumeData.issues.map((issue) => (
                                                        <div 
                                                            key={issue.id} 
                                                            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                                                        >
                                                            <div className="md:flex">
                                                                <div className="md:w-1/3 h-48 md:h-auto">
                                                                    <img 
                                                                        src={issue.coverImageUrl} 
                                                                        alt={`Cover for ${issue.title}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="p-6 md:w-2/3">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <p className="text-[#18652c] text-sm font-medium mb-1">
                                                                                Volume {issue.volume}, Issue {issue.issue} • {issue.publicationDate}
                                                                            </p>
                                                                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                                                                                {issue.title}
                                                                            </h4>
                                                                        </div>
                                                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                                            {issue.articles.length} articles
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    <p className="text-gray-600 text-sm mb-4">
                                                                        {issue.description}
                                                                    </p>
                                                                    
                                                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                                                                        <button 
                                                                            onClick={() => toggleIssueExpand(issue.id)} 
                                                                            className="text-[#18652c] hover:text-[#145024] text-sm font-medium flex items-center"
                                                                        >
                                                                            {expandedIssue === issue.id ? 'Hide articles' : 'View articles'}
                                                                            {expandedIssue === issue.id ? 
                                                                                <ChevronDown className="ml-1 h-4 w-4" /> : 
                                                                                <ChevronRight className="ml-1 h-4 w-4" />
                                                                            }
                                                                        </button>
                                                                        <button className="text-sm text-gray-500 hover:text-[#18652c] flex items-center">
                                                                            <Download className="h-4 w-4 mr-1" />
                                                                            Issue PDF
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {expandedIssue === issue.id && (
                                                                <div className="border-t border-gray-200 bg-gray-50 p-4">
                                                                    <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                                                        <FileText className="h-4 w-4 mr-2 text-[#18652c]" />
                                                                        Articles in this issue
                                                                    </h5>
                                                                    <div className="space-y-4">
                                                                        {issue.articles.map((article) => (
                                                                            <div key={article.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                                                                <h6 className="font-semibold text-gray-900 mb-1">
                                                                                    {article.title}
                                                                                </h6>
                                                                                <p className="text-sm text-gray-600 mb-3">
                                                                                    {article.authors} • Pages: {article.pages} • DOI: {article.doi}
                                                                                </p>
                                                                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                                                                    {article.abstract}
                                                                                </p>
                                                                                <div className="flex flex-wrap gap-2 mb-3">
                                                                                    {article.keywords.map((keyword, kidx) => (
                                                                                        <span 
                                                                                            key={kidx} 
                                                                                            className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                                                                        >
                                                                                            {keyword}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                                <div className="flex justify-end">
                                                                                    <Link 
                                                                                        href={article.pdfUrl}
                                                                                        className="inline-flex items-center text-xs px-3 py-1.5 bg-[#18652c] text-white rounded-md hover:bg-[#145024] transition-colors"
                                                                                    >
                                                                                        <FileText className="h-3.5 w-3.5 mr-1" />
                                                                                        View Article
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No matching publications found</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    We couldn't find any issues matching your search criteria. 
                                    Try adjusting your filters or search query.
                                </p>
                                <button 
                                    onClick={clearFilters}
                                    className="mt-6 px-4 py-2 bg-[#18652c] text-white rounded-md hover:bg-[#145024] transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Additional Resources Section */}
                    <section className="mt-20 bg-gradient-to-br from-[#f8f9fa] to-[#f0f8f3] rounded-xl p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <BookOpen className="h-5 w-5 mr-2 text-[#18652c]" />
                                    Special Collections
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Access our curated collections of articles on specific research themes and topics.
                                </p>
                                <Link
                                    href="#"
                                    className="text-[#18652c] hover:text-[#145024] font-medium text-sm inline-flex items-center"
                                >
                                    Browse special collections
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <Download className="h-5 w-5 mr-2 text-[#18652c]" />
                                    Complete Archives
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Download complete volumes and annual collections in convenient formats.
                                </p>
                                <Link
                                    href="#"
                                    className="text-[#18652c] hover:text-[#145024] font-medium text-sm inline-flex items-center"
                                >
                                    View downloadable archives
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-[#18652c]" />
                                    Publication Schedule
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Learn about our publication timeline and upcoming special issues.
                                </p>
                                <Link
                                    href="#"
                                    className="text-[#18652c] hover:text-[#145024] font-medium text-sm inline-flex items-center"
                                >
                                    See publication calendar
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <div className="mt-16 bg-[#18652c] text-white p-8 rounded-xl shadow-md">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="md:max-w-2xl">
                                <h2 className="text-2xl font-bold mb-4">Contribute to Our Journal</h2>
                                <p className="text-green-100 mb-6 md:mb-0">
                                    Join our community of researchers by submitting your original research for publication 
                                    in MinSU Research Journal. We welcome high-quality submissions across all our focus areas.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route('submissions')}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg bg-white text-[#18652c] hover:bg-green-50 font-medium transition-colors"
                                >
                                    Submission Guidelines
                                </Link>
                                <Link
                                    href={route('contact-us')}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-white rounded-lg bg-transparent hover:bg-white/10 text-white font-medium transition-colors"
                                >
                                    Contact Editorial Team
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}