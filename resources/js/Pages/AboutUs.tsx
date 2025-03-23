import Footer from '@/Components/landing-pages/Footer';
import Header from '@/Components/landing-pages/Header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Award, Library, Target, BarChart, Globe, Compass } from "lucide-react";

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

    return (
        <>
            <Head title="About Us" />
            <Header auth={auth} />
            <main className="bg-white min-h-screen">
                {/* Page Header */}
                <div className="bg-gradient-to-br from-[#f0f8f3] to-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl font-bold text-[#18652c] mb-4 text-center">About Us</h1>
                        <p className="text-xl text-[#18652c] text-center max-w-3xl mx-auto">
                            MinSU Research Journal is the official scholarly publication of Mindoro State University, 
                            dedicated to promoting research excellence and knowledge dissemination across disciplines.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-2 gap-12 mb-16">
                        <div>
                            <h2 className="text-3xl font-semibold text-[#18652c] mb-6">Our Journal</h2>
                            <p className="text-gray-700 mb-4 text-justify">
                                Established in 2019, MinSU Research Journal serves as a platform for researchers,
                                academics, and practitioners to share their findings and contribute to the advancement
                                of knowledge across various fields. The journal publishes original research, review
                                articles, case studies, and other scholarly works that meet the highest standards of
                                academic rigor and integrity.
                            </p>
                            <p className="text-gray-700 mb-4 text-justify">
                                As the flagship publication of Mindoro State University, our journal reflects the
                                institution's commitment to excellence in research and its mission to address the
                                developmental needs of Mindoro Island and the broader Philippine society through
                                evidence-based solutions and innovations.
                            </p>
                            <p className="text-gray-700 text-justify">
                                We are committed to ensuring that all published articles undergo a rigorous
                                double-blind peer review process, guaranteeing the quality, originality, and
                                significance of the research presented in our journal.
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="bg-[#f0f8f3] rounded-full p-16 shadow-lg">
                                <BookOpen className="h-32 w-32 text-[#18652c]" />
                            </div>
                        </div>
                    </div>

                    {/* Mission and Vision */}
                    <div className="mb-16">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="bg-[#f0f8f3] rounded-lg p-8 shadow-lg">
                                <div className="flex items-center mb-6">
                                    <Target className="h-8 w-8 text-[#3fb65e] mr-3" />
                                    <h2 className="text-3xl font-semibold text-[#18652c]">Our Mission</h2>
                                </div>
                                <p className="text-gray-700 text-justify">
                                    To publish and disseminate high-quality research that contributes to the advancement
                                    of knowledge and addresses the pressing challenges facing Mindoro Island, the
                                    Philippines, and the global community. We aim to provide a platform for both
                                    established and emerging researchers to share their findings and innovations,
                                    fostering a vibrant culture of inquiry and evidence-based practice.
                                </p>
                            </div>
                            <div className="bg-[#f0f8f3] rounded-lg p-8 shadow-lg">
                                <div className="flex items-center mb-6">
                                    <Compass className="h-8 w-8 text-[#3fb65e] mr-3" />
                                    <h2 className="text-3xl font-semibold text-[#18652c]">Our Vision</h2>
                                </div>
                                <p className="text-gray-700 text-justify">
                                    To be recognized as a leading research journal in the Philippines and beyond,
                                    known for publishing innovative, impactful, and methodologically sound research
                                    across disciplines. We envision a journal that bridges theory and practice,
                                    connects researchers globally, and contributes significantly to sustainable
                                    development and knowledge creation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Core Values */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-8 text-center">Our Core Values</h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="bg-[#f0f8f3] rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                                <Award className="h-12 w-12 text-[#3fb65e] mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-[#18652c] mb-2">Excellence</h3>
                                <p className="text-gray-700">Upholding the highest standards of academic rigor and scholarly integrity</p>
                            </div>
                            <div className="bg-[#f0f8f3] rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                                <Globe className="h-12 w-12 text-[#3fb65e] mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-[#18652c] mb-2">Inclusivity</h3>
                                <p className="text-gray-700">Embracing diverse perspectives, methodologies, and research traditions</p>
                            </div>
                            <div className="bg-[#f0f8f3] rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                                <Library className="h-12 w-12 text-[#3fb65e] mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-[#18652c] mb-2">Relevance</h3>
                                <p className="text-gray-700">Focusing on research that addresses real-world challenges and needs</p>
                            </div>
                            <div className="bg-[#f0f8f3] rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                                <BarChart className="h-12 w-12 text-[#3fb65e] mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-[#18652c] mb-2">Innovation</h3>
                                <p className="text-gray-700">Promoting creative approaches and breakthrough discoveries</p>
                            </div>
                        </div>
                    </div>

                    {/* Scope and Focus */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-8 text-center">Scope and Focus Areas</h2>
                        <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
                            MinSU Research Journal is multidisciplinary in scope, with a special focus on research relevant
                            to the sustainable development of island ecosystems and communities. Our key focus areas include:
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {scopeAreas.map((area, index) => (
                                <div
                                    key={index}
                                    className="bg-[#f0f8f3] rounded-lg p-4 flex items-center border border-[#e6f3eb] shadow-sm"
                                >
                                    <span className="w-3 h-3 bg-[#3fb65e] rounded-full mr-3"></span>
                                    <span className="text-[#18652c]">{area}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* History & Milestones */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-8 text-center">Our Journey</h2>
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-[#3fb65e]"></div>

                            {/* Timeline Items */}
                            <div className="space-y-12 relative">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className={`relative flex items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <div className={`flex md:w-1/2 ${index % 2 === 0 ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'}`}>
                                            <div className="bg-white border-2 border-[#3fb65e] w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg">
                                                <span className="font-bold text-[#18652c]">{milestone.year}</span>
                                            </div>
                                        </div>
                                        <div className={`bg-[#f0f8f3] rounded-lg p-6 shadow-md md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                                            <h3 className="text-xl font-medium text-[#18652c] mb-2">{milestone.title}</h3>
                                            <p className="text-gray-700">{milestone.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA Section - Standardized */}
                    <div className="bg-gradient-to-br from-[#f0f8f3] to-[#e6f3eb] rounded-xl p-8 shadow-lg text-center mt-16">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-4">Join Our Community</h2>
                        <p className="text-xl text-[#18652c] mb-8">
                            Contribute to the advancement of knowledge by submitting your research to MinSU Research Journal.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href={route('submissions')}
                                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-sm text-white bg-[#3fb65e] hover:bg-[#18652c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fb65e] transition-all duration-300"
                            >
                                Submit Your Research
                            </Link>
                            <Link
                                href={route('contact-us')}
                                className="inline-flex items-center justify-center px-8 py-4 border border-[#3fb65e] text-lg font-medium rounded-xl shadow-sm text-[#3fb65e] bg-white hover:bg-[#f0f8f3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fb65e] transition-all duration-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
