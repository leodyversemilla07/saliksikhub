import Footer from '@/components/landing-pages/site-footer';
import Header from '@/components/landing-pages/site-header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, Award, Library, Target, BarChart2, Globe, Compass, 
    FileText, Check, Calendar, Search, ClipboardCheck, 
    GraduationCap, ArrowRight
} from "lucide-react";

export default function AboutUs({ auth }: PageProps) {
    const scopeAreas = [
        "Environmental Science and Sustainability",
        "Agricultural Innovation and Food Security",
        "Marine Biology and Coastal Management",
        "Public Health and Community Wellness",
        "Educational Technology and Pedagogy",
        "Indigenous Knowledge and Cultural Studies",
        "Renewable Energy and Climate Change",
        "Biodiversity Conservation",
    ];

    const milestones = [
        {
            year: 2019,
            title: "Journal Launch",
            description: "MinSU Research Journal was established with the goal of publishing high-quality research from Mindoro and beyond."
        },
        {
            year: 2020,
            title: "First Volume Published",
            description: "Successfully released our inaugural volume featuring research from across various disciplines."
        },
        {
            year: 2021,
            title: "Digital Repository",
            description: "Launched our online repository, making all publications accessible to researchers worldwide."
        },
        {
            year: 2022,
            title: "Expanded Editorial Board",
            description: "Welcomed distinguished scholars from various institutions to strengthen our peer review process."
        },
        {
            year: 2023,
            title: "Indexing Achievement",
            description: "The journal was successfully indexed in multiple academic databases, increasing its visibility and impact."
        },
        {
            year: 2024,
            title: "International Collaboration",
            description: "Established partnerships with international research institutions to foster global knowledge exchange."
        },
    ];

    const affiliations = [
        { name: "Asian Association of Academic Journals", logo: "https://via.placeholder.com/100x60?text=AAAJ" },
        { name: "International Scientific Indexing", logo: "https://via.placeholder.com/100x60?text=ISI" },
        { name: "Philippine Commission on Higher Education", logo: "https://via.placeholder.com/100x60?text=CHED" },
        { name: "National Research Council of the Philippines", logo: "https://via.placeholder.com/100x60?text=NRCP" },
    ];

    return (
        <>
            <Head title="About the Journal | MinSU Research Journal" />
            <Header auth={auth} />
            <main className="bg-white min-h-screen">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About the Journal</h1>
                            <p className="text-xl text-gray-600">
                                MinSU Research Journal is the official scholarly publication of Mindoro State University, 
                                dedicated to promoting research excellence and knowledge dissemination across disciplines.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Journal Overview Section */}
                    <section className="mb-24">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            <div className="space-y-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Journal Overview</h2>
                                <p className="text-gray-700">
                                    Established in 2019, MinSU Research Journal serves as a platform for researchers,
                                    academics, and practitioners to share their findings and contribute to the advancement
                                    of knowledge across various fields. The journal publishes original research, review
                                    articles, case studies, and other scholarly works that meet the highest standards of
                                    academic rigor and integrity.
                                </p>
                                <p className="text-gray-700">
                                    As the flagship publication of Mindoro State University, our journal reflects the
                                    institution's commitment to excellence in research and its mission to address the
                                    developmental needs of Mindoro Island and the broader Philippine society through
                                    evidence-based solutions and innovations.
                                </p>
                                <p className="text-gray-700">
                                    We are committed to ensuring that all published articles undergo a rigorous
                                    double-blind peer review process, guaranteeing the quality, originality, and
                                    significance of the research presented in our journal.
                                </p>
                                
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mt-8">
                                    <div className="flex items-center mb-3">
                                        <FileText className="h-5 w-5 text-[#18652c] mr-3" />
                                        <h3 className="font-semibold text-gray-900">Journal Information</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Frequency:</span>
                                            <span className="text-gray-900 ml-2">Quarterly</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">First Published:</span>
                                            <span className="text-gray-900 ml-2">2019</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">ISSN (Print):</span>
                                            <span className="text-gray-900 ml-2">2023-1234</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">ISSN (Online):</span>
                                            <span className="text-gray-900 ml-2">2023-5678</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Language:</span>
                                            <span className="text-gray-900 ml-2">English</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Access:</span>
                                            <span className="text-gray-900 ml-2">Open Access</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="relative">
                                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#18652c]/10 rounded-full z-0"></div>
                                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#18652c]/10 rounded-full z-0"></div>
                                    
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md relative z-10">
                                        <div className="flex flex-col items-center justify-center mb-6">
                                            <BookOpen className="h-16 w-16 text-[#18652c] mb-4" />
                                            <h3 className="text-xl font-bold text-gray-900">Journal Metrics</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-[#18652c]">4.2</div>
                                                <div className="text-sm text-gray-600">Impact Factor</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-[#18652c]">14</div>
                                                <div className="text-sm text-gray-600">Volumes</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-[#18652c]">450+</div>
                                                <div className="text-sm text-gray-600">Published Articles</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-[#18652c]">30+</div>
                                                <div className="text-sm text-gray-600">Countries</div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <h4 className="font-medium text-gray-900 mb-3">Indexing & Abstracting</h4>
                                            <ul className="space-y-2 text-sm text-gray-700">
                                                <li className="flex items-start">
                                                    <Check className="h-4 w-4 text-[#18652c] mt-0.5 mr-2 flex-shrink-0" />
                                                    <span>Web of Science (Emerging Sources)</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <Check className="h-4 w-4 text-[#18652c] mt-0.5 mr-2 flex-shrink-0" />
                                                    <span>Scopus (Q3)</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <Check className="h-4 w-4 text-[#18652c] mt-0.5 mr-2 flex-shrink-0" />
                                                    <span>ASEAN Citation Index</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <Check className="h-4 w-4 text-[#18652c] mt-0.5 mr-2 flex-shrink-0" />
                                                    <span>Directory of Open Access Journals</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mission, Vision, and Values Section */}
                    <section className="mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                Guided by clear principles and goals, MinSU Research Journal strives to be a leading platform for scholarly communication
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            <div className="bg-gradient-to-br from-[#f8f9fa] to-[#f0f8f3] rounded-xl p-8 border border-gray-200 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="p-3 bg-white rounded-md shadow-sm">
                                        <Target className="h-8 w-8 text-[#18652c]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 ml-4">Our Mission</h3>
                                </div>
                                <p className="text-gray-700">
                                    To publish and disseminate high-quality research that contributes to the advancement
                                    of knowledge and addresses the pressing challenges facing Mindoro Island, the
                                    Philippines, and the global community. We aim to provide a platform for both
                                    established and emerging researchers to share their findings and innovations,
                                    fostering a vibrant culture of inquiry and evidence-based practice.
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-[#f8f9fa] to-[#f0f8f3] rounded-xl p-8 border border-gray-200 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="p-3 bg-white rounded-md shadow-sm">
                                        <Compass className="h-8 w-8 text-[#18652c]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 ml-4">Our Vision</h3>
                                </div>
                                <p className="text-gray-700">
                                    To be recognized as a leading research journal in the Philippines and beyond,
                                    known for publishing innovative, impactful, and methodologically sound research
                                    across disciplines. We envision a journal that bridges theory and practice,
                                    connects researchers globally, and contributes significantly to sustainable
                                    development and knowledge creation.
                                </p>
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Core Values</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg p-6 text-center border border-gray-200 h-full flex flex-col">
                                <Award className="h-10 w-10 text-[#18652c] mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h4>
                                <p className="text-gray-600 text-sm">
                                    Upholding the highest standards of academic rigor and scholarly integrity
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-6 text-center border border-gray-200 h-full flex flex-col">
                                <Globe className="h-10 w-10 text-[#18652c] mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Inclusivity</h4>
                                <p className="text-gray-600 text-sm">
                                    Embracing diverse perspectives, methodologies, and research traditions
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-6 text-center border border-gray-200 h-full flex flex-col">
                                <Library className="h-10 w-10 text-[#18652c] mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Relevance</h4>
                                <p className="text-gray-600 text-sm">
                                    Focusing on research that addresses real-world challenges and needs
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-6 text-center border border-gray-200 h-full flex flex-col">
                                <BarChart2 className="h-10 w-10 text-[#18652c] mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h4>
                                <p className="text-gray-600 text-sm">
                                    Promoting creative approaches and breakthrough discoveries
                                </p>
                            </div>
                        </div>
                    </section>
                    
                    {/* Publication Process Section */}
                    <section className="mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Publication Process</h2>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                Our rigorous academic publication process ensures high-quality, peer-reviewed research
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="md:w-2/3">
                                    <div className="flex space-x-4 relative pb-10">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-[#18652c] text-white flex items-center justify-center font-bold text-lg z-10">1</div>
                                            <div className="h-full w-1 bg-gray-200 absolute top-10"></div>
                                        </div>
                                        <div className="pb-8">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Submission</h4>
                                            <p className="text-gray-600 text-sm">Authors submit manuscripts through our online submission system following the journal's guidelines and formatting requirements.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-4 relative pb-10">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-[#18652c] text-white flex items-center justify-center font-bold text-lg z-10">2</div>
                                            <div className="h-full w-1 bg-gray-200 absolute top-10"></div>
                                        </div>
                                        <div className="pb-8">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Initial Screening</h4>
                                            <p className="text-gray-600 text-sm">Editors review submissions for scope, originality, and adherence to publication standards before sending to peer review.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-4 relative pb-10">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-[#18652c] text-white flex items-center justify-center font-bold text-lg z-10">3</div>
                                            <div className="h-full w-1 bg-gray-200 absolute top-10"></div>
                                        </div>
                                        <div className="pb-8">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Peer Review</h4>
                                            <p className="text-gray-600 text-sm">Qualified reviewers evaluate the manuscript through a double-blind review process, providing detailed feedback.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-4 relative pb-10">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-[#18652c] text-white flex items-center justify-center font-bold text-lg z-10">4</div>
                                            <div className="h-full w-1 bg-gray-200 absolute top-10"></div>
                                        </div>
                                        <div className="pb-8">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Revision</h4>
                                            <p className="text-gray-600 text-sm">Authors revise their manuscript based on reviewer feedback and editorial recommendations.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-[#18652c] text-white flex items-center justify-center font-bold text-lg">5</div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Publication</h4>
                                            <p className="text-gray-600 text-sm">Accepted manuscripts are edited, formatted, assigned a DOI, and published in the next appropriate issue.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="md:w-1/3 bg-white p-6 rounded-lg border border-gray-200 self-start">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <ClipboardCheck className="h-5 w-5 text-[#18652c] mr-2" />
                                        Publication Timeline
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Initial Screening</span>
                                            <span className="text-sm font-medium text-gray-900">1-2 weeks</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                                            <div className="bg-[#3fb65e] w-1/4 h-full"></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Peer Review</span>
                                            <span className="text-sm font-medium text-gray-900">4-6 weeks</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                                            <div className="bg-[#3fb65e] w-1/2 h-full"></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Author Revision</span>
                                            <span className="text-sm font-medium text-gray-900">2-4 weeks</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                                            <div className="bg-[#3fb65e] w-1/3 h-full"></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Final Decision</span>
                                            <span className="text-sm font-medium text-gray-900">2-3 weeks</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                                            <div className="bg-[#3fb65e] w-1/4 h-full"></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Publication</span>
                                            <span className="text-sm font-medium text-gray-900">4-8 weeks</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                                            <div className="bg-[#3fb65e] w-2/3 h-full"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <Link 
                                            href={route('submissions')} 
                                            className="text-[#18652c] hover:text-[#145024] text-sm font-medium flex items-center"
                                        >
                                            View detailed submission guidelines
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Scope and Focus Areas */}
                    <section className="mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Scope and Focus Areas</h2>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                MinSU Research Journal is multidisciplinary in scope, with a special focus on research relevant
                                to the sustainable development of island ecosystems and communities.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {scopeAreas.map((area, index) => (
                                <div
                                    key={index}
                                    className="group hover:bg-[#18652c] bg-white rounded-lg p-4 flex flex-col items-center border border-gray-200 text-center transition-colors duration-300 shadow-sm hover:shadow"
                                >
                                    <span className="w-3 h-3 bg-[#3fb65e] rounded-full mb-3 group-hover:bg-white transition-colors"></span>
                                    <span className="text-gray-800 group-hover:text-white transition-colors">{area}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-6 mt-12 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <Search className="h-5 w-5 text-[#18652c] mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Research Topics of Interest</h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-6">
                                While we publish research across multiple disciplines, we particularly welcome submissions addressing:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-start">
                                    <Check className="h-4 w-4 text-[#18652c] mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Sustainable development strategies for island communities</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="h-4 w-4 text-[#18652c] mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Climate change adaptation and mitigation in tropical regions</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="h-4 w-4 text-[#18652c] mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Indigenous knowledge systems and their applications</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="h-4 w-4 text-[#18652c] mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Coastal resource management and marine conservation</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="h-4 w-4 text-[#18652c] mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Educational innovations in developing regions</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="h-4 w-4 text-[#18652c] mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700">Public health interventions in rural communities</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Journal History and Milestones */}
                    <section className="mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Journal History</h2>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                Tracing our development from foundation to our current position in academic publishing
                            </p>
                        </div>
                        
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-[#18652c] opacity-30"></div>

                            {/* Timeline Items */}
                            <div className="space-y-12 relative">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className={`relative flex items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <div className={`flex md:w-1/2 ${index % 2 === 0 ? 'md:justify-end md:pr-8' : 'md:justify-start md:pl-8'}`}>
                                            <div className="bg-white rounded-full shadow-lg z-10 flex items-center px-4 py-2 border-2 border-[#18652c]">
                                                <Calendar className="h-5 w-5 text-[#18652c] mr-1" />
                                                <span className="font-bold text-[#18652c]">{milestone.year}</span>
                                            </div>
                                        </div>
                                        <div className={`bg-white rounded-lg p-6 shadow md:w-1/2 border border-gray-200 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                                            <h3 className="text-lg font-bold text-[#18652c] mb-2">{milestone.title}</h3>
                                            <p className="text-gray-700">{milestone.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    
                    {/* Academic Affiliations */}
                    <section className="mb-24">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Academic Affiliations</h2>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                MinSU Research Journal is proud to be affiliated with these prestigious academic institutions and organizations
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-8 py-6 mb-8">
                            {affiliations.map((affiliation, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                        <img src={affiliation.logo} alt={affiliation.name} className="h-12 w-auto" />
                                    </div>
                                    <span className="mt-2 text-sm text-gray-600">{affiliation.name}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-[#18652c] text-white rounded-lg p-8 text-center shadow">
                            <GraduationCap className="h-10 w-10 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-4">Academic Partnerships</h3>
                            <p className="max-w-2xl mx-auto mb-6">
                                We are actively seeking partnerships with academic institutions and research organizations 
                                interested in collaborative publishing initiatives and knowledge exchange.
                            </p>
                            <Link
                                href={route('contact-us')}
                                className="inline-flex items-center justify-center px-6 py-2.5 border border-white rounded-lg font-medium hover:bg-white hover:text-[#18652c] transition-colors duration-300"
                            >
                                Contact for Collaboration Opportunities
                            </Link>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-[#f0f8f3] rounded-xl p-8 shadow-md mt-16 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Research Community</h2>
                        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                            Contribute to the advancement of knowledge by submitting your research to MinSU Research Journal.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href={route('submissions')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c]"
                            >
                                Submit Your Research
                            </Link>
                            <Link
                                href={route('editorial-board')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-[#18652c] text-base font-medium rounded-lg shadow-sm text-[#18652c] bg-white hover:bg-[#f0f8f3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c]"
                            >
                                Meet our Editorial Board
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
