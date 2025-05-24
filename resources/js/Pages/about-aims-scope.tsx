import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import Header from '@/components/landing-pages/site-header';
import Footer from '@/components/landing-pages/site-footer';
import { Breadcrumb } from '@/components/breadcrumb';
import { ClipboardCheck, Search } from "lucide-react";

export default function AboutAimsScope({ auth }: PageProps) {
    const breadcrumbItems = [
        { href: '/', label: 'Home' },
        { href: '/about-journal', label: 'About the Journal' },
        { href: '', label: 'Aims & Scope' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Aims & Scope | Daluyang Dunong" />
            <Header auth={auth} />
            <main className="flex-grow"> {/* Styles moved to outer div, main is just flex-grow */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb items={breadcrumbItems} />

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                        Aims & Scope
                    </h1>

                    {/* Aims Section - Enhanced Styling */}
                    <section className="mb-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <ClipboardCheck className="h-8 w-8 text-[#18652c] dark:text-[#3fb65e] mr-4 transition-colors duration-300" />
                            Aims
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            DDMRJ serves as a primary multidisciplinary channel for disseminating high-quality original research and scholarly communications. It aims to nurture vibrant academic dialogue, encourage cross-disciplinary approaches, and advance knowledge addressing issues of local, national (Philippines), and global significance, ensuring impact and rigor through robust peer review.
                        </p>
                    </section>

                    {/* Scope Section - Enhanced Styling */}
                    <section className="mb-12 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <Search className="h-8 w-8 text-[#18652c] dark:text-[#3fb65e] mr-4 transition-colors duration-300" />
                            Scope
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            Daluyang Dunong welcomes submissions of original research articles, review papers, and case studies that fall within its broad multidisciplinary mandate. The journal is particularly interested in contributions addressing, but not limited to, the following key thematic areas:
                        </p>
                        <ul className="space-y-4">
                            {[
                                { title: "Mangyan and Multidisciplinary Indigenous Studies", description: "Research focusing on the Mangyan peoples of Mindoro, as well as broader studies concerning Indigenous communities, cultures, rights, and knowledge systems." },
                                { title: "Agriculture, Aquaculture, and Agri-Innovation", description: "Studies on sustainable farming practices, fisheries management, food security, agricultural technology, and innovations in the agri-food sector." },
                                { title: "Halcon and Highlands Biodiversity Conservation", description: "Research related to the unique ecosystems of Mount Halcon and other highland areas, focusing on biodiversity assessment, conservation strategies, and environmental protection." },
                                { title: "AI, Automation, and Advanced Technologies", description: "Exploration of artificial intelligence, machine learning, automation, robotics, data science, and other emerging technologies and their applications across various sectors." },
                                { title: "Livelihood, Local Economy, and Sustainable Enterprises", description: "Studies on community development, poverty alleviation, local economic growth, entrepreneurship, sustainable business models, and social enterprises." },
                                { title: "Tamaraw and Terrestrial Wildlife Protection", description: "Research dedicated to the conservation of the endangered Tamaraw, other terrestrial wildlife, habitat management, and human-wildlife interactions." },
                                { title: "Arts, Humanities, and Anthropological Studies", description: "Contributions exploring culture, history, language, literature, philosophy, ethics, visual and performing arts, and anthropological perspectives on human societies." },
                                { title: "Naujan Lake and National Resources Management", description: "Research concerning the ecology, conservation, and sustainable management of Naujan Lake National Park and other vital natural resources (water, forests, minerals)." },
                                { title: "Advancement in Health, Human Security, and Holistic Well-being", description: "Studies focusing on public health, healthcare systems, disease prevention, community health, human security challenges, mental health, and approaches to holistic well-being." }
                            ].map((item, index) => (
                                <li key={index} className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <span className="flex-shrink-0 h-6 w-6 bg-[#18652c] dark:bg-[#3fb65e] rounded-full flex items-center justify-center text-white dark:text-gray-900 font-semibold text-xs mr-4 mt-1 transition-colors duration-300">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{item.title}</h3>
                                        <p className="text-md text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            The journal encourages interdisciplinary research that connects these themes and welcomes contributions offering novel insights, methodologies, and solutions that significantly contribute to the advancement of the Sustainable Development Goals (SDGs) in both local and international contexts.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
