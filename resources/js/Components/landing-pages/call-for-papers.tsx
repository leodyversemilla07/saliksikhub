import { Link } from '@inertiajs/react';
import { Calendar, FileText, Clock } from 'lucide-react';

export default function CallForPapers() {
    return (
        <section className="py-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Call for Papers</h2>
            
            <div className="bg-gradient-to-br from-gray-50 to-green-50 border border-gray-200 rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-10 lg:p-12 space-y-6">
                        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-[#18652c] rounded-full text-sm font-medium">
                            <Calendar className="h-4 w-4 mr-2" />
                            Special Issue
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            Sustainable Development and Climate Resilience in Island Communities
                        </h3>
                        
                        <p className="text-gray-600">
                            We invite original research articles that address various aspects of sustainable development and climate resilience specifically focused on island communities.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center">
                                <FileText className="h-5 w-5 text-[#18652c] mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Submission Deadline</p>
                                    <p className="text-sm text-gray-500">September 30, 2023</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 text-[#18652c] mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Publication Date</p>
                                    <p className="text-sm text-gray-500">December 15, 2023</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-4">
                            <Link
                                href={route('submissions')}
                                className="inline-flex items-center px-5 py-2.5 bg-[#18652c] text-white rounded-md hover:bg-[#145024] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Submit your manuscript
                            </Link>
                        </div>
                    </div>
                    
                    <div className="hidden md:block bg-gray-200">
                        <img 
                            src="https://images.unsplash.com/photo-1559827291-72ee739d0d9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGlzbGFuZCUyMGNsaW1hdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80" 
                            alt="Island community" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 border border-gray-200 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-3">Focus Area 1</h4>
                    <h3 className="text-lg font-semibold text-[#18652c] mb-3">Climate Change Adaptation</h3>
                    <p className="text-gray-600 text-sm mb-3">Research on innovative strategies for adapting to climate change impacts in coastal and island environments.</p>
                    <div className="pt-2 border-t border-gray-100 text-sm text-gray-500">Deadline: September 30, 2023</div>
                </div>
                
                <div className="bg-white p-6 border border-gray-200 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-3">Focus Area 2</h4>
                    <h3 className="text-lg font-semibold text-[#18652c] mb-3">Sustainable Resource Management</h3>
                    <p className="text-gray-600 text-sm mb-3">Studies on approaches to managing natural resources in sustainable ways within island contexts.</p>
                    <div className="pt-2 border-t border-gray-100 text-sm text-gray-500">Deadline: September 30, 2023</div>
                </div>
                
                <div className="bg-white p-6 border border-gray-200 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-3">Focus Area 3</h4>
                    <h3 className="text-lg font-semibold text-[#18652c] mb-3">Community Resilience</h3>
                    <p className="text-gray-600 text-sm mb-3">Examination of social, economic, and cultural factors that contribute to community resilience in island settings.</p>
                    <div className="pt-2 border-t border-gray-100 text-sm text-gray-500">Deadline: September 30, 2023</div>
                </div>
            </div>
        </section>
    );
}
