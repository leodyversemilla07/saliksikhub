import { useState } from "react"
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from "lucide-react"

interface Milestone {
    year: number
    title: string
    description: string
}

const milestones: Milestone[] = [
    {
        year: 1985,
        title: "Foundation",
        description: "MinSU Research Journal is established as a small, university-based publication.",
    },
    {
        year: 1995,
        title: "Expansion",
        description: "The journal expands its scope to include research from other institutions in Mindoro.",
    },
    {
        year: 2005,
        title: "Digital Transition",
        description: "MinSU Research Journal launches its online platform, making research more accessible.",
    },
    {
        year: 2015,
        title: "International Recognition",
        description: "The journal receives its first international indexing, expanding its global reach.",
    },
    {
        year: 2023,
        title: "Open Access Initiative",
        description: "MinSU Research Journal transitions to a fully open access model, removing barriers to knowledge.",
    },
]

export default function AboutUs({ auth }: PageProps) {
    const [activeTab, setActiveTab] = useState<"mission" | "vision" | "values">("mission")
    const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null)

    return (
        <>
            <Head title="About Us" />
            <Header auth={auth} />
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-bold text-[#18652c] mb-8 text-center">About Us</h1>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h2 className="text-3xl font-semibold text-[#18652c] mb-4">Our History</h2>
                            <p className="text-[#18652c] mb-4">
                                Founded in 1985, the MinSU Research Journal has been at the forefront of academic publishing in Mindoro
                                for over three decades. What began as a small, university-based publication has grown into a respected,
                                peer-reviewed journal that attracts submissions from researchers across the Philippines and beyond.
                            </p>
                            <p className="text-[#18652c]">
                                Over the years, we have published groundbreaking research in fields ranging from environmental science and
                                agriculture to social sciences and public health, always with a focus on issues relevant to Mindoro and
                                the broader Philippine context.
                            </p>
                        </div>
                        <div className="relative h-64 md:h-full">
                            <img
                                src="/images/about.jpg"
                                alt="MinSU campus"
                                className="w-full h-full object-cover rounded-lg shadow-lg"
                            />
                        </div>
                    </div>

                    <div className="mb-16">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-6 text-center">Our Journey</h2>
                        <div className="space-y-4">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="border border-[#3fb65e] rounded-lg overflow-hidden">
                                    <button
                                        className="w-full px-6 py-4 flex justify-between items-center bg-[#f0f8f3] hover:bg-[#e6f3eb] transition-colors duration-200"
                                        onClick={() => setExpandedMilestone(expandedMilestone === index ? null : index)}
                                    >
                                        <span className="text-xl font-semibold text-[#18652c]">
                                            {milestone.year}: {milestone.title}
                                        </span>
                                        {expandedMilestone === index ? (
                                            <ChevronUp className="text-[#3fb65e]" />
                                        ) : (
                                            <ChevronDown className="text-[#3fb65e]" />
                                        )}
                                    </button>
                                    {expandedMilestone === index && (
                                        <div className="px-6 py-4 bg-white">
                                            <p className="text-[#18652c]">{milestone.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-16">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-6 text-center">Our Purpose</h2>
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex rounded-md shadow-sm" role="group">
                                {(["mission", "vision", "values"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? "bg-[#3fb65e] text-white" : "bg-white text-[#18652c] hover:bg-[#f0f8f3]"
                                            } border border-[#3fb65e] ${tab === "mission" ? "rounded-l-lg" : tab === "values" ? "rounded-r-lg" : ""
                                            }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#f0f8f3] p-6 rounded-lg">
                            {activeTab === "mission" && (
                                <div>
                                    <h3 className="text-2xl font-semibold text-[#18652c] mb-4">Our Mission</h3>
                                    <p className="text-[#18652c] mb-4">
                                        The MinSU Research Journal is dedicated to advancing knowledge and fostering academic excellence
                                        through the publication of high-quality, peer-reviewed research. Our mission is to:
                                    </p>
                                    <ul className="list-disc list-inside text-[#18652c] mb-4 space-y-2">
                                        <li>Provide a platform for researchers to share their findings with a global audience</li>
                                        <li>Promote interdisciplinary dialogue and collaboration</li>
                                        <li>Contribute to the development of evidence-based policies and practices</li>
                                        <li>Support the growth of the research community in Mindoro and the Philippines</li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === "vision" && (
                                <div>
                                    <h3 className="text-2xl font-semibold text-[#18652c] mb-4">Our Vision</h3>
                                    <p className="text-[#18652c] mb-4">
                                        We envision MinSU Research Journal as a leading academic publication that:
                                    </p>
                                    <ul className="list-disc list-inside text-[#18652c] mb-4 space-y-2">
                                        <li>Serves as a catalyst for innovative research and scholarly discourse</li>
                                        <li>Bridges the gap between academic research and practical applications</li>
                                        <li>
                                            Fosters a global community of researchers committed to addressing pressing societal challenges
                                        </li>
                                        <li>Sets the standard for research excellence and ethical academic publishing in the region</li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === "values" && (
                                <div>
                                    <h3 className="text-2xl font-semibold text-[#18652c] mb-4">Our Values</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {[
                                            {
                                                title: "Academic Integrity",
                                                description:
                                                    "We uphold the highest standards of academic integrity, ensuring all published research is original, ethical, and rigorously peer-reviewed.",
                                            },
                                            {
                                                title: "Innovation",
                                                description:
                                                    "We encourage innovative research that pushes the boundaries of knowledge and addresses real-world challenges.",
                                            },
                                            {
                                                title: "Inclusivity",
                                                description:
                                                    "We are committed to representing diverse perspectives and promoting inclusivity in academic publishing.",
                                            },
                                            {
                                                title: "Sustainability",
                                                description:
                                                    "We prioritize research that contributes to sustainable development and environmental conservation.",
                                            },
                                        ].map((value, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                                                <h4 className="text-lg font-semibold text-[#18652c] mb-2">{value.title}</h4>
                                                <p className="text-[#18652c]">{value.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#e6f3eb] rounded-lg p-8 shadow-lg text-center">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-4">Join Our Community</h2>
                        <p className="text-xl text-[#18652c] mb-6">
                            Whether you're a seasoned researcher or just starting your academic journey, we invite you to be part of the
                            MinSU Research Journal community. Together, we can advance knowledge and make a positive impact on society.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                href="/submissions"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#3fb65e] hover:bg-[#18652c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fb65e] transition duration-150"
                            >
                                Submit Your Research
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#18652c] bg-white hover:bg-[#f0f8f3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fb65e] transition duration-150"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
