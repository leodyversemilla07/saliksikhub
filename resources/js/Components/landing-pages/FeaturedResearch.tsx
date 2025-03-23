import { Link } from "@inertiajs/react"
import { FaArrowRightLong } from "react-icons/fa6";

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
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out border border-gray-100"
                        >
                            <div className="p-8 h-full flex flex-col bg-gradient-to-br from-white to-emerald-50/30">
                                <div className="flex-1">
                                    <div className="mb-5">
                                        <span className="inline-block px-4 py-1.5 text-sm font-semibold text-[#18652c] bg-emerald-100/80 rounded-full shadow-sm">
                                            Case Study
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-[#1a7432] transition-all duration-300">
                                        <Link
                                            href={article.link}
                                            className="relative after:content-[''] after:absolute after:inset-0"
                                        >
                                            {article.title}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-emerald-800 font-semibold mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        {article.authors}
                                    </p>
                                    <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">
                                        {article.abstract}
                                    </p>
                                </div>
                                <Link
                                    href={article.link}
                                    className="inline-flex items-center gap-2 text-[#1a7432] font-semibold hover:text-[#3fb65e] transition-all duration-300"
                                >
                                    Read Full Study
                                    <FaArrowRightLong className="transition-transform duration-300" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/archives"
                        className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-br from-[#18652c] to-[#3fb65e] hover:from-[#145225] hover:to-[#35a051] rounded-xl shadow-md transition-all duration-300"
                    >
                        Explore Research Archive
                        <FaArrowRightLong />
                    </Link>
                </div>
            </div>
        </section>
    );
}

