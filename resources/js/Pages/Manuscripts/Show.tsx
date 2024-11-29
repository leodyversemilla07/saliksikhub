import React from 'react';
import { Head } from '@inertiajs/react';
import { FileText, User, Clock, Tag, FileDown } from 'lucide-react';

interface Manuscript {
    title: string;
    status: string;
    authors: string[];
    abstract: string;
    keywords: string[];
    manuscript_url?: string;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    manuscript: Manuscript;
}

const Show: React.FC<ShowProps> = ({ manuscript }) => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title={`Manuscript: ${manuscript.title}`} />

            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white break-words">{manuscript.title}</h1>
                    <div className="flex items-center mt-3 space-x-3">
                        <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                            {manuscript.status}
                        </span>
                    </div>
                </div>

                {/* Manuscript Details */}
                <div className="p-6 md:p-8 space-y-6">
                    {/* Authors Section */}
                    <div className="flex items-start space-x-4">
                        <User className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Authors</h2>
                            <p className="text-gray-600">{manuscript.authors.join(', ')}</p>
                        </div>
                    </div>

                    {/* Abstract Section */}
                    <div className="flex items-start space-x-4">
                        <FileText className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Abstract</h2>
                            <p className="text-gray-600 leading-relaxed">{manuscript.abstract}</p>
                        </div>
                    </div>

                    {/* Keywords Section */}
                    <div className="flex items-start space-x-4">
                        <Tag className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Keywords</h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {manuscript.keywords.map((keyword) => (
                                    <span
                                        key={keyword}
                                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Manuscript File Section */}
                    {manuscript.manuscript_url ? (
                        <div className="flex items-start space-x-4">
                            <FileDown className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                            <div className="w-full">
                                <h2 className="text-lg font-semibold text-gray-800 mb-3">Manuscript File</h2>
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    <iframe
                                        src={manuscript.manuscript_url}
                                        className="w-full h-[600px]"
                                        style={{ border: 'none' }}
                                    ></iframe>
                                </div>
                                <a
                                    href={manuscript.manuscript_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-block w-full text-center bg-gradient-to-r from-yellow-500 to-green-600 text-white font-medium py-3 rounded-lg hover:from-yellow-600 hover:to-green-700 transition-all duration-300 ease-in-out"
                                >
                                    Download Manuscript
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start space-x-4">
                            <FileDown className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                            <p className="text-red-500 font-medium">No manuscript file available.</p>
                        </div>
                    )}

                    {/* Metadata Section */}
                    <div className="flex items-start space-x-4 pt-6 border-t border-gray-200">
                        <Clock className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Manuscript Metadata</h2>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                    <strong>Created:</strong> {new Date(manuscript.created_at).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Last Updated:</strong> {new Date(manuscript.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Show;