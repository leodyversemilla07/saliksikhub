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
        <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8 text-center">Featured Research</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredArticles.map((article, index) => (
                        <div
                            key={index}
                            className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition duration-300"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-[#3fb65e] transition duration-150">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">{article.authors}</p>
                                <p className="text-gray-700 mb-4">{article.abstract}</p>
                                <Link
                                    href={article.link}
                                    className="text-[#18652c] hover:text-[#3fb65e] font-medium transition duration-150"
                                >
                                    Read full article
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <Link
                        href="/archives"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#18652c] hover:bg-[#3fb65e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] transition duration-150"
                    >
                        Explore All Research
                    </Link>
                </div>
            </div>
        </section>
    );
}

