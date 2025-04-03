import React from 'react';
import { Link } from '@inertiajs/react';
import { FileText, BookOpen, CheckCircle2, Info, ArrowRight, CalendarDays } from 'lucide-react';

export default function ForAuthors() {
    return (
        <section className="py-24 border-t border-gray-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Information for Authors</h2>
                        <p className="mt-4 text-gray-600">
                            MinSU Research Journal welcomes submissions from researchers across all disciplines. 
                            Our publication process is designed to ensure rigorous peer review while providing authors 
                            with a supportive and efficient experience.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Publication Timeline</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 p-1 bg-green-100 rounded-full mt-1">
                                    <CheckCircle2 className="h-5 w-5 text-[#18652c]" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Initial Review</p>
                                    <p className="text-sm text-gray-600">2-3 weeks after submission</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="flex-shrink-0 p-1 bg-green-100 rounded-full mt-1">
                                    <CheckCircle2 className="h-5 w-5 text-[#18652c]" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Peer Review Process</p>
                                    <p className="text-sm text-gray-600">4-6 weeks</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="flex-shrink-0 p-1 bg-green-100 rounded-full mt-1">
                                    <CheckCircle2 className="h-5 w-5 text-[#18652c]" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Revision Period</p>
                                    <p className="text-sm text-gray-600">2-4 weeks for author revisions</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="flex-shrink-0 p-1 bg-green-100 rounded-full mt-1">
                                    <CheckCircle2 className="h-5 w-5 text-[#18652c]" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Publication</p>
                                    <p className="text-sm text-gray-600">4-8 weeks after acceptance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={route('submissions')}
                            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Submission Guidelines
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Author Resources
                        </Link>
                    </div>
                </div>
                
                <div className="space-y-6">
                    {/* Key information cards */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 p-1 bg-green-100 rounded-md">
                                <FileText className="h-6 w-6 text-[#18652c]" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Manuscript Requirements</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    We accept original research articles, review papers, case studies, and short communications.
                                    Manuscripts should follow APA style and include structured abstracts.
                                </p>
                                <Link 
                                    href="#"
                                    className="mt-2 inline-flex items-center text-sm font-medium text-[#18652c] hover:text-[#145024]"
                                >
                                    View formatting guidelines
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 p-1 bg-green-100 rounded-md">
                                <BookOpen className="h-6 w-6 text-[#18652c]" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Open Access Policy</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    MinSU Research Journal is committed to open access publishing. All published articles are 
                                    immediately and permanently free for everyone to read and download.
                                </p>
                                <Link 
                                    href="#"
                                    className="mt-2 inline-flex items-center text-sm font-medium text-[#18652c] hover:text-[#145024]"
                                >
                                    Read our full policy
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 p-1 bg-green-100 rounded-md">
                                <CalendarDays className="h-6 w-6 text-[#18652c]" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Publication Schedule</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    The journal is published quarterly (March, June, September, December). 
                                    Special issues are announced separately with specific submission deadlines.
                                </p>
                                <Link 
                                    href="#"
                                    className="mt-2 inline-flex items-center text-sm font-medium text-[#18652c] hover:text-[#145024]"
                                >
                                    View upcoming issues
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                        <div className="flex items-start">
                            <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                            <p className="ml-3 text-sm text-amber-800">
                                <span className="font-medium">Note:</span> Submissions for the December 2023 special issue on 
                                "Sustainable Development and Climate Resilience" are now being accepted until September 30, 2023.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

