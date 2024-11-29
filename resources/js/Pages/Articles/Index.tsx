import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';

// Sample initial data with only published articles
const publishedArticles = [
    {
        id: 1,
        title: 'Introduction to React Hooks',
        author: 'Jane Doe',
        publishDate: '2024-01-15',
        category: 'Web Development'
    },
    {
        id: 2,
        title: 'Machine Learning Basics',
        author: 'John Smith',
        publishDate: '2024-02-20',
        category: 'Artificial Intelligence'
    },
    {
        id: 3,
        title: 'Cybersecurity Trends',
        author: 'Alice Johnson',
        publishDate: '2024-03-10',
        category: 'Security'
    }
];

const PublishedArticlesTable = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter articles based on the search query
    const filteredArticles = publishedArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Published Articles
                </h2>
            }
        >
            <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Published Articles</h2>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publish Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredArticles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No articles found.
                                    </td>
                                </tr>
                            ) : (
                                filteredArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.author}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.publishDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.category}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default PublishedArticlesTable;
