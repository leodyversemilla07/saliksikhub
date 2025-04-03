import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, FileText, Users } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-12 md:py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left column - Journal information */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                <span className="block">MinSU Research</span>
                                <span className="block text-[#18652c]">Journal</span>
                            </h1>
                            <p className="mt-4 text-xl text-gray-600 max-w-lg">
                                A multidisciplinary peer-reviewed journal promoting scholarly research across diverse academic fields
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href={route('current')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Current Issue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link 
                                href={route('submissions')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Submit Manuscript
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 p-2 bg-green-100 rounded-md">
                                    <BookOpen className="h-5 w-5 text-[#18652c]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Open Access</p>
                                    <p className="text-xs text-gray-500">Free for readers</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 p-2 bg-green-100 rounded-md">
                                    <FileText className="h-5 w-5 text-[#18652c]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Peer Reviewed</p>
                                    <p className="text-xs text-gray-500">Double-blind process</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 p-2 bg-green-100 rounded-md">
                                    <Users className="h-5 w-5 text-[#18652c]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Multidisciplinary</p>
                                    <p className="text-xs text-gray-500">All research fields</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right column - Featured image */}
                    <div className="relative h-full">
                        <div className="relative">
                            <div className="absolute -left-4 -top-4 w-24 h-24 bg-green-100 rounded-full opacity-70"></div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-100 rounded-full opacity-70"></div>
                            
                            <div className="relative z-10 bg-white p-3 rounded-xl shadow-lg">
                                <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
                                    <img 
                                        src="https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                                        alt="Latest journal issue" 
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent p-6">
                                        <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-[#18652c] rounded-full mb-2">
                                            Volume 5, Issue 2
                                        </span>
                                        <h3 className="text-xl font-bold text-white">Latest Issue: June 2023</h3>
                                        <p className="text-sm text-gray-200">Special focus on sustainable development research</p>
                                        
                                        <Link
                                            href={route('current')}
                                            className="mt-3 inline-flex items-center text-sm font-medium text-white hover:text-green-200 transition-colors"
                                        >
                                            Read this issue
                                            <ArrowRight className="ml-1.5 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Journal metrics section */}
            <div className="border-t border-b border-gray-200 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-3xl font-bold text-[#18652c]">4.2</p>
                            <p className="text-sm text-gray-600">Impact Factor</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#18652c]">14</p>
                            <p className="text-sm text-gray-600">Volumes Published</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#18652c]">450+</p>
                            <p className="text-sm text-gray-600">Articles</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#18652c]">30+</p>
                            <p className="text-sm text-gray-600">Countries</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}