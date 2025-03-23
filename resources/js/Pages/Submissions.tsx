import Footer from '@/Components/landing-pages/Footer';
import Header from '@/Components/landing-pages/Header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, FileText, Users, Clock, BookOpen } from "lucide-react"

const guidelines = [
    "Original research: All submissions must be original and not previously published or under consideration elsewhere.",
    "Language: Manuscripts should be written in clear, concise English.",
    "Length: Research articles should not exceed 8,000 words, including abstract, tables, figures, and references.",
    "Format: Use double-spacing, 12-point Times New Roman font, and 1-inch margins.",
    "Abstract: Include a structured abstract of no more than 250 words.",
    "Keywords: Provide 4-6 keywords that best describe your research.",
    "References: Use APA 7th edition format for all citations and references.",
    "Figures and Tables: Include high-quality figures and tables with clear captions.",
    "Ethical considerations: Include a statement on ethical approval and informed consent where applicable.",
    "Conflict of Interest: Disclose any potential conflicts of interest.",
]

const steps = [
    {
        title: "Prepare Your Manuscript",
        description: "Ensure your manuscript adheres to our submission guidelines.",
        icon: FileText,
    },
    {
        title: "Create an Account",
        description: "Register on our online submission system if you haven't already.",
        icon: Users,
    },
    {
        title: "Submit Your Manuscript",
        description: "Log in to the submission system and follow the steps to upload your manuscript and related files.",
        icon: FileText,
    },
    {
        title: "Initial Screening",
        description: "Our editorial team will review your submission for completeness and adherence to guidelines.",
        icon: CheckCircle,
    },
    {
        title: "Peer Review",
        description: "If your manuscript passes initial screening, it will be sent for peer review (typically 4-6 weeks).",
        icon: Users,
    },
    {
        title: "Editorial Decision",
        description: "Based on reviewer feedback, the editor will make a decision (accept, revise, or reject).",
        icon: CheckCircle,
    },
    {
        title: "Revision (if required)",
        description: "If revisions are requested, you'll have the opportunity to address reviewer comments.",
        icon: Clock,
    },
    {
        title: "Final Decision",
        description: "After reviewing any revisions, the editor will make a final decision on your manuscript.",
        icon: CheckCircle,
    },
    {
        title: "Publication",
        description: "If accepted, your article will be prepared for publication in the next available issue.",
        icon: BookOpen,
    },
]

export default function Submissions({ auth }: PageProps) {
    return (
        <>
            <Head title="Submissions" />
            <Header auth={auth} />
            <div className="bg-white min-h-screen">
                {/* Page Header */}
                <div className="bg-gradient-to-br from-[#f0f8f3] to-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-5xl font-bold text-[#18652c] mb-4 text-center">Submissions</h1>
                        <p className="text-xl text-[#18652c] text-center max-w-3xl mx-auto">
                            Thank you for considering MinSU Research Journal for your manuscript submission. We welcome high-quality
                            research papers from various disciplines.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-[#f0f8f3] rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <h2 className="text-3xl font-semibold text-[#18652c] mb-6">Submission Guidelines</h2>
                            <ul className="space-y-4">
                                {guidelines.map((guideline, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-[#3fb65e] mr-3 flex-shrink-0 mt-1" />
                                        <span className="text-[#18652c]">{guideline}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-[#f0f8f3] rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <h2 className="text-3xl font-semibold text-[#18652c] mb-6">Submission Process</h2>
                            <ol className="space-y-6">
                                {steps.map((step, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#3fb65e] text-white mr-4 flex-shrink-0 mt-1">
                                            <step.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-[#18652c]">{step.title}</h3>
                                            <p className="text-[#18652c]">{step.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Standardized CTA Section */}
                    <div className="bg-gradient-to-br from-[#f0f8f3] to-[#e6f3eb] rounded-xl p-8 shadow-lg text-center mt-16">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-4">Ready to Submit?</h2>
                        <p className="text-xl text-[#18652c] mb-8">
                            We look forward to receiving your manuscript and contributing to the advancement of knowledge in your field.
                        </p>
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-sm text-white bg-[#3fb65e] hover:bg-[#18652c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fb65e] transition-all duration-300"
                        >
                            Start Your Submission
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
