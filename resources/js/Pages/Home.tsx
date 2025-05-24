import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Header from '@/components/landing-pages/site-header';
import Footer from '@/components/landing-pages/site-footer';
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, FilePlus2, Check } from 'lucide-react';

export default function Home({ auth }: PageProps) {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Daluyang Dunong - Channel of Knowledge" />
            <Header auth={auth} />
            <main className="flex-grow">
                <div className="relative isolate min-h-[calc(85vh-7.5rem)]"> {/* 7.5rem = h-20 (header) + h-10 (top bar) */}
                    {/* Background with gradient overlay */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#18652c]/5 to-transparent dark:from-[#18652c]/2" />
                    </div>

                    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:flex items-center lg:px-8 lg:py-32">
                        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
                            {/* Badge */}
                            <div className="mb-8 inline-flex items-center gap-x-2 rounded-full bg-[#18652c]/10 dark:bg-[#18652c]/20 px-4 py-1.5 transition-colors duration-300">
                                <span className="text-xs font-medium text-[#18652c] dark:text-[#3fb65e]">New Issue</span>
                                <span className="h-1 w-1 rounded-full bg-[#18652c] dark:bg-[#3fb65e] transition-colors duration-300"></span>
                                <span className="text-xs font-medium text-[#18652c] dark:text-[#3fb65e]">Vol. 15, Issue 2</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl transition-colors duration-300">
                                <span className="block">Daluyang Dunong</span>
                                <span className="block mt-2 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300 text-3xl sm:text-4xl">/daˈlujaŋ ˈdunoŋ/ - Channel of Knowledge</span>
                            </h1>

                            {/* Description */}
                            <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                The internationally peer-reviewed, open-access, multidisciplinary journal of Mindoro State University,
                                fostering vibrant academic dialogue across disciplines. We aim to advance knowledge addressing issues
                                of local, national, and global significance through rigorous peer review and scholarly excellence.
                            </p>

                            {/* CTA Buttons */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route('current')}
                                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#18652c] to-[#3fb65e] px-6 py-3 text-base font-semibold text-white shadow-sm hover:from-[#145024] hover:to-[#35a051] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105"
                                >
                                    Current Issue
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    href={route('submissions')}
                                    className="inline-flex items-center justify-center rounded-xl border-2 border-[#18652c] dark:border-[#3fb65e] px-6 py-3 text-base font-medium text-[#18652c] dark:text-[#3fb65e] hover:bg-[#18652c]/5 dark:hover:bg-[#3fb65e]/10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105"
                                >
                                    Submit Research
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Journal Cover Image */}
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:ml-auto">
                            <div className="relative w-[320px] h-[440px] sm:w-[360px] sm:h-[495px] transform lg:translate-x-10">
                                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl dark:shadow-gray-800/30">
                                    <img
                                        src="/images/journal-cover.webp"
                                        alt="Latest Journal Cover"
                                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                                {/* Volume Badge */}
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-transform duration-300 hover:scale-105">
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-[#18652c] dark:text-[#3fb65e]">Current Volume</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">Vol. 15</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Issue 2</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Indexing Section */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="border-t border-gray-200 dark:border-gray-800 py-6 transition-colors duration-300">
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Indexed in</p>
                                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                                        {[
                                            { name: 'Scopus', src: 'https://images.seeklogo.com/logo-png/33/1/scopus-logo-png_seeklogo-335404.png' },
                                            { name: 'Web of Science', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTSNQT4WbDCvutFbffjkankp9wTvkgNlF_TA&s' },
                                            { name: 'PubMed', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYqz4FG10Xc5Q6v7Q6NdA74wdS0ojkUzMKWw&s' },
                                            { name: 'DOAJ', src: 'https://imgs.search.brave.com/TCamsE_7PgheFulyAgFTSoEtySFPNmUC-8XwQumQYlM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi85LzlkL0RP/QUpfbG9nby1ibGFj/ay13aGl0ZXNwYWNl/LnN2Zy81MTJweC1E/T0FKX2xvZ28tYmxh/Y2std2hpdGVzcGFj/ZS5zdmcucG5n' },
                                            { name: 'Google Scholar', src: 'https://scholar.google.com/intl/en/scholar/images/1x/scholar_logo_64dp.png' }
                                        ].map((index) => (
                                            <img
                                                key={index.name}
                                                src={index.src}
                                                alt={`${index.name} logo`}
                                                className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="py-16 lg:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-3xl overflow-hidden transition-colors duration-300">
                            <div className="px-8 py-12 sm:px-12 lg:px-16 lg:py-16">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                                    <div className="space-y-8">
                                        {/* Header Section */}
                                        <div className="space-y-6">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#3fb65e] text-white shadow-sm">
                                                📢 Call for Papers
                                            </span>
                                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300 leading-tight">
                                                Special Issue: Indigenous Knowledge and Sustainable Development
                                            </h2>
                                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 transition-colors duration-300">
                                                We invite submissions exploring Indigenous knowledge systems and sustainable development,
                                                with particular focus on the Mangyan communities of Mindoro and their contributions to
                                                environmental conservation, cultural preservation, and sustainable practices.
                                            </p>
                                        </div>

                                        {/* Timeline and Details */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                                                Important Dates & Requirements
                                            </h3>
                                            <div className="grid gap-4">
                                                <div className="flex items-start space-x-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl transition-colors duration-300">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-[#18652c]/10 dark:bg-[#3fb65e]/20 rounded-lg flex items-center justify-center">
                                                        <Calendar className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Submission Deadline</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">September 30, 2025</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start space-x-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl transition-colors duration-300">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-[#18652c]/10 dark:bg-[#3fb65e]/20 rounded-lg flex items-center justify-center">
                                                        <Calendar className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Expected Publication</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">December 2025</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start space-x-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl transition-colors duration-300">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-[#18652c]/10 dark:bg-[#3fb65e]/20 rounded-lg flex items-center justify-center">
                                                        <FilePlus2 className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Article Types</p>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-1">
                                                            <p>• Original Research (6,000-8,000 words)</p>
                                                            <p>• Review Papers (up to 10,000 words)</p>
                                                            <p>• Case Studies (4,000-6,000 words)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="pt-4">
                                            <Link
                                                href={route('submissions')}
                                                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-[#18652c] to-[#3fb65e] rounded-xl shadow-lg hover:from-[#145024] hover:to-[#35a051] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] dark:focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Submit Your Manuscript
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Thematic Areas Card */}
                                    <div className="lg:sticky lg:top-8">
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                            <div className="flex items-center space-x-3 mb-8">
                                                <div className="w-10 h-10 bg-[#18652c]/10 dark:bg-[#3fb65e]/20 rounded-lg flex items-center justify-center">
                                                    <Check className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e]" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                                                    Key Thematic Areas
                                                </h3>
                                            </div>
                                            <ul className="space-y-4">
                                                {[
                                                    'Indigenous knowledge systems and traditional practices',
                                                    'Sustainable resource management and conservation',
                                                    'Cultural heritage and preservation',
                                                    'Community-based development initiatives',
                                                    'Environmental protection strategies',
                                                    'Local governance and leadership',
                                                    'Sustainable agriculture and food security',
                                                    'Indigenous education and knowledge transfer',
                                                    'Biodiversity and ecosystem services',
                                                    'Social enterprises and local economies'
                                                ].map((topic, index) => (
                                                    <li key={index} className="flex items-start space-x-3 group">
                                                        <div className="flex-shrink-0 w-6 h-6 bg-[#18652c]/10 dark:bg-[#3fb65e]/20 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-[#18652c]/20 dark:group-hover:bg-[#3fb65e]/30 transition-colors duration-200">
                                                            <Check className="h-3 w-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                                        </div>
                                                        <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 leading-relaxed">
                                                            {topic}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
