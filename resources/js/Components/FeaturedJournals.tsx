interface FeaturedJournalsProps {
    topJournals: { title: string; description: string; link: string }[];
    latestArticles: { title: string; abstract: string; link: string }[];
    categories: string[];
}

export default function FeaturedJournals({
    topJournals,
    latestArticles,
    categories,
}: FeaturedJournalsProps) {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-4">
                {/* Section Heading */}
                <h2 className="text-3xl font-bold text-center mb-10">Featured Journals & Research</h2>

                {/* Featured Journals */}
                <div className="mb-12">
                    <h3 className="text-2xl font-semibold mb-6">Top Journals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {topJournals.map((journal, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                                <h4 className="text-xl font-semibold mb-4">{journal.title}</h4>
                                <p className="text-gray-600 mb-4">{journal.description}</p>
                                <a
                                    href={journal.link}
                                    className="text-green-600 hover:text-green-800 font-semibold"
                                >
                                    Read More
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Latest Articles */}
                <div className="mb-12">
                    <h3 className="text-2xl font-semibold mb-6">Latest Articles</h3>
                    <div className="space-y-6">
                        {latestArticles.map((article, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                                <h4 className="text-xl font-semibold mb-4">{article.title}</h4>
                                <p className="text-gray-600 mb-4">{article.abstract}</p>
                                <a
                                    href={article.link}
                                    className="text-green-600 hover:text-green-800 font-semibold"
                                >
                                    Read Full Article
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Filters */}
                <div className="mb-12">
                    <h3 className="text-2xl font-semibold mb-6">Browse by Categories</h3>
                    <div className="flex flex-wrap space-x-4">
                        {categories.map((category, index) => (
                            <a
                                key={index}
                                href={`#${category}`}
                                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-800 transition"
                            >
                                {category}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
