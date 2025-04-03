import { Link } from '@inertiajs/react';
import { Mail, ArrowRight, BookOpen } from 'lucide-react';

export default function Cta() {
    return (
        <section className="bg-gradient-to-br from-[#18652c]/90 to-[#0c4017] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <svg className="absolute top-0 left-0 w-96 h-96 text-white/5 transform -translate-x-1/3 -translate-y-1/2" 
                    fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="50" cy="50" r="50" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-[40rem] h-[40rem] text-white/5 transform translate-x-1/3 translate-y-1/3" 
                    fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="50" cy="50" r="50" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white">Advance Academic Knowledge</h2>
                            <p className="mt-4 text-xl text-green-100">
                                Join our community of researchers and contribute to the growing body of scholarly knowledge
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={route('submissions')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-md text-base font-medium text-[#18652c] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-700 focus:ring-white"
                            >
                                <BookOpen className="mr-2 h-5 w-5" />
                                Submit Research
                            </Link>
                            <Link
                                href={route('contact-us')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-green-300 rounded-md shadow-sm text-base font-medium text-white hover:bg-green-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-700 focus:ring-white"
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Contact Editorial Team
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
                        <h3 className="text-xl font-semibold text-white mb-6">Benefits for Researchers</h3>
                        
                        <ul className="space-y-4 text-green-100">
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-800/50 text-white mr-3 flex-shrink-0 mt-1">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                                <span>Double-blind peer review ensuring fair evaluation</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-800/50 text-white mr-3 flex-shrink-0 mt-1">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                                <span>DOI assignment for all published articles</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-800/50 text-white mr-3 flex-shrink-0 mt-1">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                                <span>Indexed in major academic databases for improved visibility</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-800/50 text-white mr-3 flex-shrink-0 mt-1">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                                <span>Open access publication increasing citation potential</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-800/50 text-white mr-3 flex-shrink-0 mt-1">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                                <span>Support throughout the submission and publication process</span>
                            </li>
                        </ul>
                        
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-green-100 font-medium">Next submission deadline</p>
                                    <p className="text-lg text-white font-bold">September 30, 2023</p>
                                </div>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center text-green-100 hover:text-white font-medium"
                                >
                                    Register as an author
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}