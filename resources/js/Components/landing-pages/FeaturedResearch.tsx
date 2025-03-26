import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Download, FileText, ExternalLink } from 'lucide-react';

// Featured research categories with sample articles
const categories = [
    {
        id: "most-cited",
        name: "Most Cited",
        description: "Research with significant impact and high citation counts",
    },
    {
        id: "recent-publications",
        name: "Recent Publications",
        description: "Latest research articles across various disciplines",
    },
    {
        id: "special-issues",
        name: "Special Issues",
        description: "Themed collections addressing specific research areas",
    }
];

// Mock articles data
const articles = {
    "most-cited": [
        {
            title: "Biodiversity Conservation in Southeast Asian Marine Ecosystems: A Systematic Review",
            authors: "Maria Santos, John Smith, Anh Nguyen",
            journal: "Volume 4, Issue 2 - June 2022",
            citations: 48,
            downloads: 1204,
            abstract: "This comprehensive review examines conservation strategies for marine biodiversity across Southeast Asia, identifying effective approaches for sustainable ecosystem management...",
            doi: "10.1234/minsu.2022.04.02.001",
            imageUrl: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1hcmluZSUyMGJpb2RpdmVyc2l0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
        },
        {
            title: "Traditional Knowledge and Sustainable Agriculture: Case Studies from Rural Philippines",
            authors: "Roberto Cruz, Anna Lee, Michael Garcia",
            journal: "Volume 3, Issue 3 - September 2021",
            citations: 36,
            downloads: 987,
            abstract: "This paper explores how traditional agricultural knowledge contributes to sustainable farming practices across rural communities in the Philippines...",
            doi: "10.1234/minsu.2021.03.03.002",
            imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
        },
    ],
    "recent-publications": [
        {
            title: "Effect of Climate Change on Agricultural Productivity in Oriental Mindoro: A Longitudinal Study",
            authors: "Dr. James Rodriguez, Maria Santos",
            journal: "Volume 5, Issue 2 - June 2023",
            citations: 3,
            downloads: 214,
            abstract: "This longitudinal study examines the impact of changing climate patterns on agricultural yield and sustainability in Oriental Mindoro over a ten-year period...",
            doi: "10.1234/minsu.2023.05.02.003",
            imageUrl: "https://images.unsplash.com/photo-1536657464919-892534f79d9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZhcm1pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
        },
        {
            title: "Digital Transformation in Higher Education: Post-Pandemic Perspectives from the Philippines",
            authors: "Dr. Lisa Chan, Prof. Robert Santos, Emily Garcia",
            journal: "Volume 5, Issue 1 - March 2023",
            citations: 7,
            downloads: 482,
            abstract: "This research investigates the adoption of digital technologies in Philippine higher education institutions following the COVID-19 pandemic...",
            doi: "10.1234/minsu.2023.05.01.006",
            imageUrl: "https://images.unsplash.com/photo-1517245386807-9b4b0c84882b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZGlnaXRhbCUyMGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
        },
    ],
    "special-issues": [
        {
            title: "Mental Health Among Rural Communities: Challenges and Interventions",
            authors: "Dr. Anna Cruz, Manuel Santos, PhD",
            journal: "Special Issue: Health in Rural Settings - December 2022",
            citations: 15,
            downloads: 631,
            abstract: "This special issue article examines the unique mental health challenges facing rural communities and evaluates various intervention strategies...",
            doi: "10.1234/minsu.2022.s01.002",
            imageUrl: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1lbnRhbCUyMGhlYWx0aHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
        },
        {
            title: "Renewable Energy Implementation in Island Communities: Barriers and Opportunities",
            authors: "Dr. Michael Lee, Sarah Johnson",
            journal: "Special Issue: Sustainable Island Development - December 2022",
            citations: 22,
            downloads: 745,
            abstract: "This research explores the challenges and potential solutions for implementing renewable energy systems in geographically isolated island communities...",
            doi: "10.1234/minsu.2022.s01.004",
            imageUrl: "https://images.unsplash.com/photo-1509391618207-32b5cd53e74c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVuZXdhYmxlJTIwZW5lcmd5JTIwaXNsYW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
        },
    ],
};

export default function FeaturedResearch() {
    const [activeCategory, setActiveCategory] = useState("most-cited");
    
    return (
        <section className="py-24 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-6 md:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Featured Research</h2>
                    <p className="mt-2 text-gray-600 max-w-2xl">
                        Highlighting exceptional scholarship and influential research from our journal
                    </p>
                </div>
                <Link 
                    href={route('archives')}
                    className="flex items-center text-[#18652c] hover:text-[#145024] font-medium"
                >
                    Browse all research
                    <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
            
            {/* Category tabs */}
            <div className="border-b border-gray-200 mb-8">
                <div className="flex overflow-x-auto space-x-8">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`pb-4 px-1 text-sm font-medium whitespace-nowrap transition-colors ${
                                activeCategory === category.id 
                                    ? 'text-[#18652c] border-b-2 border-[#18652c]' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Category description */}
            <p className="mb-8 text-gray-600">
                {categories.find(cat => cat.id === activeCategory)?.description}
            </p>
            
            {/* Article cards */}
            <div className="grid md:grid-cols-2 gap-8">
                {articles[activeCategory as keyof typeof articles].map((article, idx) => (
                    <div 
                        key={idx} 
                        className="flex flex-col md:flex-row bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="md:w-2/5 h-48 md:h-auto">
                            <img 
                                src={article.imageUrl} 
                                alt={article.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-3/5 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                                {article.authors}
                            </p>
                            <p className="text-xs text-[#18652c] font-medium mb-3">
                                {article.journal}
                            </p>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {article.abstract}
                            </p>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                <div className="flex space-x-4">
                                    <div className="flex items-center text-xs text-gray-500">
                                        <FileText className="h-3 w-3 mr-1" />
                                        {article.citations} citations
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Download className="h-3 w-3 mr-1" />
                                        {article.downloads} downloads
                                    </div>
                                </div>
                                
                                <Link 
                                    href="#"
                                    className="flex items-center text-xs font-medium text-[#18652c] hover:text-[#145024]"
                                >
                                    Read article
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

