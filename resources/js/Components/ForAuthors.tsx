import { Link } from "@inertiajs/react"
import { FileText, Users, Clock, BookOpen, ArrowRight } from "lucide-react"

const authorFeatures = [
    {
        name: "Easy Submission Process",
        description:
            "Our streamlined online submission system makes it simple to submit your research for publication in MinSU Research Journal.",
        icon: FileText,
    },
    {
        name: "Rigorous Peer Review",
        description: "All submissions undergo a thorough, fair, and timely peer review process by experts in the field.",
        icon: Users,
    },
    {
        name: "Rapid Publication",
        description: "We are committed to quick turnaround times from submission to publication of accepted articles.",
        icon: Clock,
    },
    {
        name: "Wide Readership",
        description:
            "Published articles gain exposure to our diverse readership of researchers, students, and professionals.",
        icon: BookOpen,
    },
]

export default function ForAuthors() {
    return (
        <section className="bg-gradient-to-b from-[#f7faf7] to-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center space-y-6 mb-16">
                    <span className="inline-block bg-gradient-to-r from-[#18652c] to-[#3fb65e] text-white px-6 py-2 rounded-full text-sm font-medium">
                        For Authors
                    </span>
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        Publish Your Research with<br className="hidden lg:block" /> MinSU Research Journal
                    </h2>
                    <p className="mx-auto mt-6 text-xl text-gray-600 max-w-3xl leading-relaxed">
                        Join our prestigious community of researchers and amplify your work's impact through our global academic network.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {authorFeatures.map((feature) => (
                        <div
                            key={feature.name}
                            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-2"
                        >
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#18652c] to-[#3fb65e] text-white">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.name}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Link
                        href="/submissions"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#18652c] to-[#3fb65e] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:gap-3 gap-2"
                    >
                        Submit Your Manuscript
                        <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1" />
                    </Link>
                    <p className="mt-4 text-sm text-gray-500">
                        Average processing time: 28 days from submission to first decision
                    </p>
                </div>
            </div>
        </section>
    );
}

