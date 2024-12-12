import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FileText, User, Clock, Tag, FileDown, ExternalLink } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-card text-card-foreground rounded-lg border shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col space-y-1.5 p-6">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-2xl font-semibold leading-none tracking-tight">{children}</h3>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
    <div className="p-6 pt-0">{children}</div>
);

const Button = ({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`}
        {...props}
    >
        {children}
    </button>
);

export default function Show({ manuscript }: ShowProps): JSX.Element {
    return (
        <AuthenticatedLayout>
            <Head title={`Manuscript: ${manuscript.title}`} />
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-6 md:p-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-white break-words">{manuscript.title}</h1>
                            <div className="flex items-center mt-3 space-x-3">
                                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                                    {manuscript.status}
                                </span>
                            </div>
                        </div>

                        <CardContent>
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="flex items-start space-x-4"
                                >
                                    <User className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Authors</h2>
                                        <p className="text-gray-600">{manuscript.authors.join(', ')}</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="flex items-start space-x-4"
                                >
                                    <FileText className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Abstract</h2>
                                        <p className="text-gray-600 leading-relaxed">{manuscript.abstract}</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="flex items-start space-x-4"
                                >
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
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex items-start space-x-4"
                                >
                                    <FileDown className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                    <div className="w-full">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Manuscript File</h2>
                                        {manuscript.manuscript_url ? (
                                            <>
                                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                                    <iframe
                                                        src={manuscript.manuscript_url}
                                                        className="w-full h-[600px]"
                                                        style={{ border: 'none' }}
                                                        title="Manuscript Preview"
                                                    ></iframe>
                                                </div>
                                                <Button
                                                    onClick={() => window.open(manuscript.manuscript_url, '_blank')}
                                                    className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700"
                                                >
                                                    <FileDown className="w-5 h-5 mr-2" />
                                                    Download Manuscript
                                                </Button>
                                            </>
                                        ) : (
                                            <p className="text-red-500 font-medium">No manuscript file available.</p>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="flex items-start space-x-4 pt-6 border-t border-gray-200"
                                >
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
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}

