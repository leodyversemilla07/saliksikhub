import Footer from '@/Components/landing-pages/Footer';
import Header from '@/Components/landing-pages/Header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    CheckCircle, FileText, Users, Clock, BookOpen, 
    Calendar, ArrowRight, Download, Info, CheckSquare, 
    AlertCircle, FileQuestion, Award, Edit3, Search, Mail
} from "lucide-react";

const guidelines = [
    {
        category: "General Requirements",
        items: [
            "Original research: All submissions must be original and not previously published or under consideration elsewhere.",
            "Language: Manuscripts should be written in clear, concise English.",
            "Length: Research articles should not exceed 8,000 words, including abstract, tables, figures, and references.",
            "Format: Use double-spacing, 12-point Times New Roman font, and 1-inch margins.",
        ]
    },
    {
        category: "Manuscript Structure",
        items: [
            "Abstract: Include a structured abstract of no more than 250 words.",
            "Keywords: Provide 4-6 keywords that best describe your research.",
            "Introduction: Clearly state the research problem, objectives, and significance.",
            "Literature Review: Provide a comprehensive review of relevant literature.",
            "Methodology: Detail your research approach, data collection methods, and analysis procedures.",
            "Results: Present findings clearly with appropriate tables and figures.",
            "Discussion: Interpret results in the context of your research questions and existing literature.",
            "Conclusion: Summarize key findings and their implications.",
        ]
    },
    {
        category: "References & Citations",
        items: [
            "References: Use APA 7th edition format for all citations and references.",
            "Citations: Ensure all in-text citations are included in the reference list and vice versa.",
            "DOIs: Include DOIs for all references where available.",
        ]
    },
    {
        category: "Ethical Considerations",
        items: [
            "Ethical approval: Include a statement on ethical approval and informed consent where applicable.",
            "Conflict of Interest: Disclose any potential conflicts of interest.",
            "Acknowledgments: Include funding sources and contributors not qualifying for authorship.",
            "Permissions: Obtain permission for any copyrighted material used.",
        ]
    },
];

const steps = [
    {
        title: "Prepare Your Manuscript",
        description: "Format your manuscript according to our guidelines and prepare all required files.",
        icon: FileText,
        details: [
            "Follow our formatting requirements (APA 7th edition style)",
            "Prepare a blinded manuscript version with no author information",
            "Ensure high-quality tables and figures (300 dpi minimum for images)",
            "Compile supplementary materials if applicable"
        ]
    },
    {
        title: "Account Registration",
        description: "Create an account on our online submission system if you haven't already.",
        icon: Users,
        details: [
            "Complete your profile with academic affiliation",
            "Add ORCID identifier if available",
            "Select relevant expertise keywords",
            "Register as an author"
        ]
    },
    {
        title: "Manuscript Submission",
        description: "Log in to the submission system and upload your manuscript and related files.",
        icon: FileText,
        details: [
            "Complete the submission metadata form",
            "Upload main manuscript file (MS Word or LaTeX)",
            "Add all co-authors with correct affiliations",
            "Submit cover letter addressed to the Editor-in-Chief"
        ]
    },
    {
        title: "Editorial Screening",
        description: "Our editorial team will review your submission for completeness and fit with journal scope.",
        icon: Search,
        details: [
            "Compliance with submission guidelines",
            "Relevance to journal scope and focus",
            "Assessment of academic quality and originality",
            "Verification of ethical compliance"
        ]
    },
    {
        title: "Peer Review Process",
        description: "Submissions that pass initial screening are sent to expert reviewers in your field.",
        icon: Users,
        details: [
            "Double-blind peer review by 2-3 field experts",
            "Evaluation of methodology, results, and conclusions",
            "Assessment of academic contribution",
            "Typical duration: 4-6 weeks"
        ]
    },
    {
        title: "Editorial Decision",
        description: "Based on reviewer feedback, the editor will make a decision on your manuscript.",
        icon: CheckSquare,
        details: [
            "Accept without revisions (rare)",
            "Accept with minor revisions",
            "Major revisions required",
            "Reject but encourage resubmission",
            "Reject"
        ]
    },
    {
        title: "Revision Process",
        description: "If revisions are requested, you'll have time to address reviewer comments.",
        icon: Edit3,
        details: [
            "Typically 2-4 weeks for revisions",
            "Must submit point-by-point response to reviewers",
            "Highlight changes in revised manuscript",
            "May undergo additional review rounds if needed"
        ]
    },
    {
        title: "Final Decision",
        description: "After reviewing revisions, the editor will make a final decision on publication.",
        icon: Award,
        details: [
            "Final checks for compliance with requirements",
            "Copyediting suggestions if needed",
            "Final approval for publication",
            "Assignment to upcoming issue"
        ]
    },
    {
        title: "Publication",
        description: "Accepted manuscripts are prepared for publication in the next available issue.",
        icon: BookOpen,
        details: [
            "Copyediting and typesetting",
            "Author proof review (48-hour turnaround)",
            "DOI assignment",
            "Online publication ahead of print"
        ]
    },
];

const articleTypes = [
    {
        name: "Research Articles",
        description: "Original empirical research presenting new findings and analyses",
        wordCount: "5,000-8,000 words",
        structure: "Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Conclusion"
    },
    {
        name: "Review Articles",
        description: "Critical evaluations of existing literature on a specific topic",
        wordCount: "6,000-10,000 words",
        structure: "Abstract, Introduction, Methodology, Literature Analysis, Discussion, Conclusion"
    },
    {
        name: "Case Studies",
        description: "Detailed analyses of specific cases with broader implications",
        wordCount: "3,000-5,000 words",
        structure: "Abstract, Introduction, Case Background, Analysis, Discussion, Conclusion"
    },
    {
        name: "Short Communications",
        description: "Brief reports of significant new findings warranting rapid publication",
        wordCount: "2,000-3,000 words",
        structure: "Abstract, Introduction, Methods, Results & Discussion, Conclusion"
    }
];

export default function Submissions({ auth }: PageProps) {
    return (
        <>
            <Head title="Submission Guidelines | MinSU Research Journal" />
            <Header auth={auth} />
            <main className="bg-white min-h-screen">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Author Guidelines</h1>
                            <p className="text-xl text-gray-600">
                                Information for authors interested in submitting their research to the MinSU Research Journal.
                                We welcome high-quality manuscripts across various disciplines.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Key information callout */}
                    <div className="mb-16 bg-gradient-to-br from-[#f8f9fa] to-[#f0f8f3] p-6 md:p-8 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                            <div className="p-3 bg-[#18652c]/10 rounded-full">
                                <Calendar className="h-6 w-6 text-[#18652c]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Current Submission Information</h2>
                                <p className="text-gray-600 mt-1">Important dates and special issue opportunities</p>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900 mb-2">Regular Issue</h3>
                                <p className="text-sm text-gray-600 mb-3">Next submission deadline</p>
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-[#18652c] mr-2" />
                                    <span className="font-medium">January 15, 2025</span>
                                </div>
                            </div>
                            
                            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900 mb-2">Special Issue</h3>
                                <p className="text-sm text-gray-600 mb-3">Climate Resilience</p>
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-[#18652c] mr-2" />
                                    <span className="font-medium">September 30, 2024</span>
                                </div>
                            </div>
                            
                            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900 mb-2">Review Time</h3>
                                <p className="text-sm text-gray-600 mb-3">Average peer review duration</p>
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 text-[#18652c] mr-2" />
                                    <span className="font-medium">4-6 weeks</span>
                                </div>
                            </div>
                            
                            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900 mb-2">Publication</h3>
                                <p className="text-sm text-gray-600 mb-3">Time to publication after acceptance</p>
                                <div className="flex items-center">
                                    <BookOpen className="h-5 w-5 text-[#18652c] mr-2" />
                                    <span className="font-medium">8-12 weeks</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Article Types */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                            <FileQuestion className="h-6 w-6 mr-3 text-[#18652c]" />
                            Types of Articles We Publish
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {articleTypes.map((type, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-[#18652c] mb-2">{type.name}</h3>
                                    <p className="text-gray-700 mb-4">{type.description}</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-900">Word Count:</span>
                                            <p className="text-gray-600">{type.wordCount}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Structure:</span>
                                            <p className="text-gray-600 text-xs">{type.structure}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submission Guidelines */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                            <FileText className="h-6 w-6 mr-3 text-[#18652c]" />
                            Submission Guidelines
                        </h2>
                        
                        <div className="space-y-8">
                            {guidelines.map((category, categoryIndex) => (
                                <div key={categoryIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                                    </div>
                                    <div className="p-6">
                                        <ul className="space-y-4">
                                            {category.items.map((guideline, index) => (
                                                <li key={index} className="flex items-start">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c] mr-3 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700">{guideline}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 p-5 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-amber-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-amber-800">Important Note for Authors</h3>
                                    <div className="mt-2 text-sm text-amber-700">
                                        <p>
                                            Submissions that do not follow these guidelines may be returned to authors before peer review. 
                                            Please ensure your manuscript complies with all requirements to avoid delays in the review process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Submission Process */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                            <Clock className="h-6 w-6 mr-3 text-[#18652c]" />
                            Submission Process
                        </h2>
                        
                        <div className="relative">
                            {/* Process timeline line */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
                            
                            <div className="space-y-12">
                                {steps.map((step, index) => (
                                    <div key={index} className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        {/* Step circle for desktop */}
                                        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-[#18652c] border-4 border-white shadow-md z-10 flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                        </div>
                                        
                                        <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                                <div className="flex items-center md:justify-end mb-4">
                                                    {/* Mobile view step number */}
                                                    <div className="md:hidden w-8 h-8 rounded-full bg-[#18652c] flex items-center justify-center text-white font-bold mr-3">
                                                        {index + 1}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                                                </div>
                                                <p className="text-gray-600 mb-4">{step.description}</p>
                                                <ul className={`text-sm text-gray-600 space-y-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                                                    {step.details.map((detail, detailIndex) => (
                                                        <li key={detailIndex} className="flex items-start md:justify-end">
                                                            <CheckCircle className={`h-4 w-4 text-[#18652c] flex-shrink-0 mt-0.5 ${index % 2 === 0 ? 'md:order-2 md:ml-2' : 'mr-2'}`} />
                                                            <span>{detail}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        {/* This div is just for spacing in mobile view */}
                                        <div className="md:w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Download Templates */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                            <Download className="h-6 w-6 mr-3 text-[#18652c]" />
                            Submission Templates & Resources
                        </h2>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            <ResourceCard 
                                title="Manuscript Template"
                                description="MS Word template with pre-formatted styles, margins, and headings"
                                fileType="DOCX"
                                fileSize="125 KB"
                            />
                            <ResourceCard 
                                title="LaTeX Template"
                                description="LaTeX template files with bibliography style and formatting"
                                fileType="ZIP"
                                fileSize="450 KB"
                            />
                            <ResourceCard 
                                title="Cover Letter Template"
                                description="Sample cover letter format for manuscript submission"
                                fileType="DOCX"
                                fileSize="78 KB"
                            />
                            <ResourceCard 
                                title="Author Checklist"
                                description="Pre-submission checklist to ensure compliance with all requirements"
                                fileType="PDF"
                                fileSize="95 KB"
                            />
                            <ResourceCard 
                                title="Figure Guidelines"
                                description="Detailed specifications for preparing figures and illustrations"
                                fileType="PDF"
                                fileSize="1.2 MB"
                            />
                            <ResourceCard 
                                title="APA Style Guide"
                                description="Quick reference guide for APA 7th edition formatting"
                                fileType="PDF"
                                fileSize="350 KB"
                            />
                        </div>
                    </section>

                    {/* Author Support */}
                    <section className="mb-16 bg-gradient-to-br from-[#f8f9fa] to-[#f0f8f3] rounded-xl p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Info className="h-6 w-6 mr-3 text-[#18652c]" />
                            Author Support
                        </h2>
                        
                        <p className="text-gray-700 mb-8">
                            Our editorial team is available to assist authors throughout the submission and review process.
                            If you have questions about your submission or need clarification on any guidelines, please don't
                            hesitate to contact us.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 bg-[#18652c]/10 rounded-lg flex items-center justify-center">
                                        <Mail className="h-6 w-6 text-[#18652c]" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Editorial Office</h3>
                                    <p className="text-gray-600 mt-1">For questions about manuscript submission and status</p>
                                    <a 
                                        href="mailto:submissions@minsurj.online" 
                                        className="inline-flex items-center mt-2 text-[#18652c] hover:text-[#145024] font-medium"
                                    >
                                        submissions@minsurj.online
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                            
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 bg-[#18652c]/10 rounded-lg flex items-center justify-center">
                                        <Users className="h-6 w-6 text-[#18652c]" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Author Resources</h3>
                                    <p className="text-gray-600 mt-1">Access additional resources and FAQs for authors</p>
                                    <Link
                                        href="#"
                                        className="inline-flex items-center mt-2 text-[#18652c] hover:text-[#145024] font-medium"
                                    >
                                        View author resources
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <div className="bg-[#18652c] text-white rounded-xl p-8 shadow-md">
                        <div className="md:flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Ready to Submit Your Manuscript?</h2>
                                <p className="text-green-100 mb-6 md:mb-0 max-w-2xl">
                                    Our online submission system is available 24/7. Create an account or log in to begin the submission process.
                                    We look forward to receiving your research contribution.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Link
                                    href="#"
                                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg bg-white text-[#18652c] hover:bg-green-50 font-medium shadow-sm transition-colors duration-300"
                                >
                                    Submit Manuscript
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

interface ResourceCardProps {
    title: string;
    description: string;
    fileType: string;
    fileSize: string;
}

function ResourceCard({ title, description, fileType, fileSize }: ResourceCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm mb-4">{description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium">{fileType}</span>
                        <span className="ml-2">{fileSize}</span>
                    </div>
                    <button className="flex items-center text-[#18652c] hover:text-[#145024] transition-colors">
                        <Download className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Download</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
