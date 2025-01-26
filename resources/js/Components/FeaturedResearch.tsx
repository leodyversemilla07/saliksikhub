import { Link } from "@inertiajs/react"

const featuredArticles = [
    {
        title: "Climate Change Impact on Local Agriculture: A Case Study in Mindoro",
        authors: "Dr. Maria Santos, Dr. Juan dela Cruz",
        abstract:
            "This study examines the effects of climate change on agricultural practices in Mindoro, providing insights for sustainable farming strategies.",
        link: "#",
    },
    {
        title: "Biodiversity Assessment of Mindoro's Coastal Ecosystems",
        authors: "Prof. Elena Reyes, Dr. Roberto Tan",
        abstract:
            "A comprehensive survey of marine biodiversity in Mindoro's coastal areas, highlighting the need for conservation efforts.",
        link: "#",
    },
    {
        title: "Socio-Economic Factors Affecting Education in Rural Mindoro",
        authors: "Dr. Ana Lim, Prof. Carlos Bautista",
        abstract:
            "This research investigates the socio-economic challenges faced by students in rural Mindoro and their impact on educational outcomes.",
        link: "#",
    },
]

export default function FeaturedResearch() {
    return (
        <section className="bg-gradient-to-b from-[#f7faf7] to-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Featured Research Studies
                    </h2>
                    <p className="text-lg text-gray-600">
                        Discover groundbreaking research from Mindoro's academic community
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredArticles.map((article, index) => (
                        <article
                            key={index}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 border border-gray-100"
                        >
                            <div className="p-6 h-full flex flex-col">
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 text-sm font-medium text-[#18652c] bg-emerald-50 rounded-full">
                                            Case Study
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-7">
                                        <Link
                                            href={article.link}
                                            className="hover:text-[#1a7432] transition-colors duration-200 after:content-[''] after:absolute after:inset-0"
                                        >
                                            {article.title}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-emerald-700 font-medium mb-3">
                                        {article.authors}
                                    </p>
                                    <p className="text-gray-600 leading-6 line-clamp-3 mb-4">
                                        {article.abstract}
                                    </p>
                                </div>
                                <Link
                                    href={article.link}
                                    className="inline-flex items-center text-[#1a7432] font-medium hover:text-[#3fb65e] transition-colors duration-200"
                                >
                                    Read Full Study
                                    <svg
                                        className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/archives"
                        className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-[#1a7432] hover:bg-[#3fb65e] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        Explore Research Archive
                        <svg
                            className="w-5 h-5 ml-3 -mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section> 
    );
}

