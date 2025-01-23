import { Link } from "@inertiajs/react"
import { FileText, Users, Clock, BookOpen } from "lucide-react"

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
        <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-[#18652c] font-semibold tracking-wide uppercase">For Authors</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Publish your research with MinSU Research Journal
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        Join our community of researchers and make your work accessible to a global audience.
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                        {authorFeatures.map((feature) => (
                            <div key={feature.name} className="relative">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#3fb65e] text-white">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/submissions"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#18652c] hover:bg-[#3fb65e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] transition duration-150"
                    >
                        Submit Your Manuscript
                    </Link>
                </div>
            </div>
        </section>
    );
}

