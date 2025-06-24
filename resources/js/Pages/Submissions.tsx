import Footer from '@/components/site-footer';
import Header from '@/components/site-header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import {
    CheckCircle, FileText, Users, Clock, BookOpen,
    Calendar, ArrowRight, Download, Info, CheckSquare,
    AlertCircle, FileQuestion, Award, Edit3, Search, Mail,
    ListChecks
} from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Declare the global route function
declare function route(name: string, params?: Record<string, unknown>): string;

const guidelines = [
    {
        category: "General Requirements",
        items: [
            "Original research: All submissions must be original and not previously published or under consideration elsewhere",
            "Language: Manuscripts must be written in clear, concise English with a Grammarly Rating of 95% or more",
            "Plagiarism Check: Submissions must pass plagiarism detection with a Similarity Index of no more than 10%",
            "Format: Use double-spacing, 12-point Times New Roman font, and 1-inch margins",
            "Ethical Compliance: Include necessary ethical approvals and informed consent statements"
        ]
    },
    {
        category: "Manuscript Structure",
        items: [
            "Title: Clear, concise, and representative of the content (max 20 words)",
            "Abstract: Structured abstract of 250 words covering objective, methodology, results, and conclusions",
            "Keywords: 4-6 keywords that best describe your research and align with the journal's thematic areas",
            "Introduction: Clear problem statement, objectives, and significance within the relevant thematic context",
            "Literature Review: Comprehensive review showing familiarity with current research in the field",
            "Methodology: Detailed research approach with clear data collection and analysis procedures",
            "Results: Clear presentation of findings with appropriate tables and figures",
            "Discussion: Interpretation of results in context of research questions and existing literature",
            "Conclusion: Summary of key findings, implications, and recommendations"
        ]
    },
    {
        category: "References & Citations",
        items: [
            "Format: Use APA 7th edition style for all citations and references",
            "Citations: Ensure all in-text citations are included in the reference list and vice versa",
            "DOIs: Include DOIs for all references where available",
            "Recent Sources: Include relevant recent literature (last 5 years) where appropriate"
        ]
    },
    {
        category: "Ethical Considerations",
        items: [
            "Research Ethics: Include statement on ethical approval and informed consent where applicable",
            "Conflict of Interest: Provide a clear statement disclosing any potential conflicts of interest",
            "Funding: Acknowledge all funding sources and their role in the research",
            "Permissions: Obtain and document permission for use of copyrighted material",
            "Indigenous Knowledge: Follow ethical guidelines for research involving indigenous communities"
        ]
    }
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
            "Initial plagiarism check (max 10% similarity)",
            "Grammar check (min 95% Grammarly rating)",
            "Scope and relevance assessment",
            "Ethical compliance verification"
        ]
    },
    {
        title: "Peer Review Process",
        description: "Submissions that pass initial screening are sent to expert reviewers in your field.",
        icon: Users,
        details: [
            "Double-blind peer review by at least three field experts",
            "Evaluation of methodology, results, and conclusions",
            "Assessment of academic contribution",
            "Duration: 3 months to 1 year"
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

const keyInfo = [
    {
        title: "Regular Issue",
        subtitle: "Next submission deadline",
        date: "January 15, 2025",
        icon: Calendar
    },
    {
        title: "Review Duration",
        subtitle: "Average review timeline",
        date: "3-12 months",
        icon: Clock
    },
    {
        title: "Processing Fee",
        subtitle: "Publication charges",
        date: "No fees",
        icon: BookOpen
    },
    {
        title: "Publication",
        subtitle: "After acceptance",
        date: "Annually / Next available issue",
        icon: BookOpen
    }
];

const articleTypes = [
    {
        name: "Research Articles",
        description: "Original research within the journal's thematic areas, including Mangyan studies, agriculture, biodiversity, technology, and sustainable development",
        wordCount: "5,000-8,000 words",
        structure: "Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Conclusion"
    },
    {
        name: "Review Articles",
        description: "Comprehensive reviews of literature in key areas such as indigenous knowledge systems, conservation strategies, or technological innovations",
        wordCount: "6,000-10,000 words",
        structure: "Abstract, Introduction, Methodology, Literature Analysis, Discussion, Conclusion"
    },
    {
        name: "Case Studies",
        description: "Detailed analyses of specific cases related to local development, conservation efforts, or community initiatives",
        wordCount: "3,000-5,000 words",
        structure: "Abstract, Introduction, Case Background, Analysis, Discussion, Conclusion"
    },
    {
        name: "Short Communications",
        description: "Brief reports of significant findings in any of the journal's thematic areas warranting rapid publication",
        wordCount: "2,000-3,000 words",
        structure: "Abstract, Introduction, Methods, Results & Discussion, Conclusion"
    }
];

const thematicAreas = [
    {
        title: "Mangyan and Multidisciplinary Indigenous Studies",
        description: "Research focusing on the Mangyan peoples of Mindoro, as well as broader studies concerning Indigenous communities, cultures, rights, and knowledge systems."
    },
    {
        title: "Agriculture, Aquaculture, and Agri-Innovation",
        description: "Studies on sustainable farming practices, fisheries management, food security, agricultural technology, and innovations in the agri-food sector."
    },
    {
        title: "Halcon and Highlands Biodiversity Conservation",
        description: "Research related to the unique ecosystems of Mount Halcon and other highland areas, focusing on biodiversity assessment, conservation strategies, and environmental protection."
    },
    {
        title: "AI, Automation, and Advanced Technologies",
        description: "Exploration of artificial intelligence, machine learning, automation, robotics, data science, and other emerging technologies and their applications across various sectors."
    },
    {
        title: "Livelihood, Local Economy, and Sustainable Enterprises",
        description: "Studies on community development, poverty alleviation, local economic growth, entrepreneurship, sustainable business models, and social enterprises."
    },
    {
        title: "Tamaraw and Terrestrial Wildlife Protection",
        description: "Research dedicated to the conservation of the endangered Tamaraw, other terrestrial wildlife, habitat management, and human-wildlife interactions."
    },
    {
        title: "Arts, Humanities, and Anthropological Studies",
        description: "Contributions exploring culture, history, language, literature, philosophy, ethics, visual and performing arts, and anthropological perspectives on human societies."
    },
    {
        title: "Naujan Lake and National Resources Management",
        description: "Research concerning the ecology, conservation, and sustainable management of Naujan Lake National Park and other vital natural resources (water, forests, minerals)."
    },
    {
        title: "Advancement in Health, Human Security, and Holistic Well-being",
        description: "Studies focusing on public health, healthcare systems, disease prevention, community health, human security challenges, mental health, and approaches to holistic well-being."
    }
];

const reviewCriteria = [
    {
        stage: "Initial Screening",
        criteria: [
            "Scope and Relevance: Alignment with the multidisciplinary scope of Daluyang Dunong.",
            "Basic Requirements: Adherence to fundamental author guidelines (manuscript structure, language).",
            "Plagiarism Check: Similarity Index of no more than 10%.",
            "Grammar Check: Grammarly Rating of 95% or more."
        ]
    },
    {
        stage: "Peer Review Evaluation",
        criteria: [
            "Originality of the contribution",
            "Significance of the contribution",
            "Soundness of methodology and data analysis",
            "Clarity of presentation and logical structure",
            "Validity of conclusions and implications",
            "Ethical soundness and research integrity"
        ]
    },
    {
        stage: "Decision Outcomes",
        criteria: [
            "Accept without revisions",
            "Accept with minor revisions",
            "Accept with major revisions",
            "Reject with the option to resubmit",
            "Reject"
        ]
    }
];

export default function Submissions({ auth }: PageProps) {
    const submissionSections = useMemo(() => [
        { id: "key-information", title: "Key Information" },
        { id: "aims-scope", title: "Aims and Scope" },
        { id: "article-types", title: "Article Types" },
        { id: "submission-guidelines", title: "Submission Guidelines" },
        { id: "submission-process", title: "Submission Process" },
        { id: "review-process", title: "Review Process & Criteria" },
        { id: "publication-frequency", title: "Publication & Funding" },
        { id: "download-templates", title: "Templates & Resources" },
        { id: "author-support", title: "Author Support" },
    ], []);

    const [activeSection, setActiveSection] = useState<string>("key-information");

    // Handle smooth scrolling when clicking nav links
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 96; // Account for sticky header
            const elementPosition = element.offsetTop - headerOffset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    // Scroll spy functionality
    useEffect(() => {
        const handleScroll = () => {
            const sections = submissionSections.map(section => ({
                id: section.id,
                element: document.getElementById(section.id)
            })).filter(section => section.element);

            // Get the current scroll position
            const scrollY = window.scrollY;
            const headerOffset = 96; // Account for sticky header height

            // Find the current section
            let currentSection = sections[0]?.id || "key-information";

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.element) {
                    const sectionTop = section.element.offsetTop - headerOffset;
                    if (scrollY >= sectionTop) {
                        currentSection = section.id;
                        break;
                    }
                }
            }

            setActiveSection(currentSection);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Call once to set initial state
        handleScroll();

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, [submissionSections]);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Submission Guidelines | Daluyang Dunong" />
            <Header auth={auth} />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={route('home')}>Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-[#18652c] dark:text-[#3fb65e]">Submissions</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Page Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                        Submissions
                    </h1>

                    {/* Flex container for sidebar and main content */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 flex-shrink-0 md:sticky md:top-24 self-start">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <ListChecks className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                                    On this page
                                </h2>
                                <nav>
                                    <ul className="space-y-2">
                                        {submissionSections.map((section) => (
                                            <li key={section.id}>
                                                <a
                                                    href={`#${section.id}`}
                                                    onClick={(e) => handleNavClick(e, section.id)}
                                                    className={`flex items-center gap-2 text-sm py-2 px-3 rounded-md transition-colors duration-200 ${activeSection === section.id
                                                        ? 'bg-[#18652c] dark:bg-[#3fb65e] text-white dark:text-gray-900 font-medium'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-[#18652c] dark:hover:text-[#3fb65e] hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {activeSection === section.id && (
                                                        <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900 flex-shrink-0"></div>
                                                    )}
                                                    <span className={activeSection !== section.id ? 'ml-4' : ''}>{section.title}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        {/* Main content wrapper */}
                        <div className="flex-1 min-w-0">
                            {/* Key information callout - Add ID */}
                            <section id="key-information" className="mb-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/90 p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300 scroll-mt-24">
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                    <div className="p-3 bg-[#18652c]/10 dark:bg-[#18652c]/20 rounded-full transition-colors duration-300">
                                        <Calendar className="h-6 w-6 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Current Submission Information</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Important dates and special issue opportunities</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {keyInfo.map((info, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-700 p-5 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm transition-colors duration-300">
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{info.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">{info.subtitle}</p>
                                            <div className="flex items-center">
                                                <info.icon className="h-4 w-4 text-[#18652c] dark:text-[#3fb65e] mr-2 flex-shrink-0 transition-colors duration-300" />
                                                <span className="font-medium dark:text-gray-200 transition-colors duration-300">{info.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Aims and Scope - Add ID */}
                            <section id="aims-scope" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <BookOpen className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Aims and Scope
                                </h2>

                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm mb-8 transition-colors duration-300">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Journal Overview</h3>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                                            DDMRJ serves as a primary multidisciplinary channel for disseminating high-quality original research and scholarly communications. It aims to nurture vibrant academic dialogue, encourage cross-disciplinary approaches, and advance knowledge addressing issues of local, national (Philippines), and global significance, ensuring impact and rigor through robust peer review.
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                                            Daluyang Dunong welcomes submissions of original research articles, review papers, and case studies that fall within its broad multidisciplinary mandate. The journal is particularly interested in contributions addressing, but not limited to, the following key thematic areas:
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {thematicAreas.map((area, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                                            <h3 className="text-lg font-semibold text-[#18652c] dark:text-[#3fb65e] mb-2 transition-colors duration-300">{area.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{area.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-gradient-to-br from-[#f8f9fa] to-[#f0f8f3] dark:from-gray-800 dark:to-gray-800/90 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                    <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                        The journal encourages interdisciplinary research that connects these themes and welcomes contributions offering novel insights, methodologies, and solutions that significantly contribute to the advancement of the Sustainable Development Goals (SDGs) in both local and international contexts.
                                    </p>
                                </div>
                            </section>

                            {/* Article Types - Add ID */}
                            <section id="article-types" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <FileQuestion className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Types of Articles We Publish
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {articleTypes.map((type, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                                            <h3 className="text-lg font-semibold text-[#18652c] dark:text-[#3fb65e] mb-2 transition-colors duration-300">{type.name}</h3>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">{type.description}</p>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Word Count:</span>
                                                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{type.wordCount}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Structure:</span>
                                                    <p className="text-gray-600 dark:text-gray-400 text-xs transition-colors duration-300">{type.structure}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Submission Guidelines - Add ID */}
                            <section id="submission-guidelines" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <FileText className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Submission Guidelines
                                </h2>

                                <div className="space-y-8">
                                    {guidelines.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors duration-300">
                                            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">{category.category}</h3>
                                            </div>
                                            <div className="p-6">
                                                <ul className="space-y-4">
                                                    {category.items.map((guideline, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <CheckCircle className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e] mr-3 flex-shrink-0 mt-0.5 transition-colors duration-300" />
                                                            <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{guideline}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-5 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500 rounded-r-lg transition-colors duration-300">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-amber-400 dark:text-amber-300 transition-colors duration-300" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 transition-colors duration-300">Important Note for Authors</h3>
                                            <div className="mt-2 text-sm text-amber-700 dark:text-amber-400 transition-colors duration-300">
                                                <p>
                                                    Submissions that do not follow these guidelines may be returned to authors before peer review.
                                                    Please ensure your manuscript complies with all requirements to avoid delays in the review process.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Submission Process - Add ID */}
                            <section id="submission-process" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <Clock className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Submission Process
                                </h2>

                                <div className="relative">
                                    {/* Process timeline line */}
                                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2 transition-colors duration-300"></div>

                                    <div className="space-y-12">
                                        {steps.map((step, index) => (
                                            <div key={index} className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                                {/* Step circle for desktop */}
                                                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-[#18652c] dark:bg-[#3fb65e] border-4 border-white dark:border-gray-900 shadow-md z-10 flex items-center justify-center text-white font-bold transition-colors duration-300">
                                                        {index + 1}
                                                    </div>
                                                </div>

                                                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                                                        <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                                            {/* Mobile view step number */}
                                                            <div className="md:hidden w-8 h-8 rounded-full bg-[#18652c] dark:bg-[#3fb65e] flex items-center justify-center text-white font-bold mr-3 transition-colors duration-300">
                                                                {index + 1}
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">{step.title}</h3>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">{step.description}</p>
                                                        <ul className={`text-sm text-gray-600 dark:text-gray-400 space-y-1 ${index % 2 === 0 ? 'md:text-right' : ''} transition-colors duration-300`}>
                                                            {step.details.map((detail, detailIndex) => (
                                                                <li key={detailIndex} className={`flex items-start ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                                                    <CheckCircle className={`h-4 w-4 text-[#18652c] dark:text-[#3fb65e] flex-shrink-0 mt-0.5 ${index % 2 === 0 ? 'md:order-2 md:ml-2' : 'mr-2'} transition-colors duration-300`} />
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

                            {/* Review Process & Decision Criteria - Add ID */}
                            <section id="review-process" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <CheckSquare className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Review Process & Decision Criteria
                                </h2>

                                <div className="mb-8 text-gray-700 dark:text-gray-300 transition-colors duration-300 space-y-4">
                                    <p>Upon the submission of the manuscript, it undergoes an initial assessment by the journal's editorial staff to determine alignment with the journal's scope and thematic areas, adherence to formatting standards, and overall preliminary quality. Manuscripts meeting these criteria are then assigned to a managing editor. This editor manages the subsequent rigorous review process, which involves sending the manuscript to at least three independent experts in the relevant field for critical evaluation. These reviewers assess the manuscript's originality, methodology, results, and clarity. The assigned editor then synthesizes the reviewers' feedback to inform one of the following decisions: accept, minor revisions, major revisions, or reject. If revisions are required (minor or major), authors address the reviewers' comments, and the editor re-evaluates the revised manuscript, potentially returning it to the reviewers for further assessment. Upon final acceptance by the editor, the manuscript proceeds to the production phase, including copyediting, typesetting, and proofreading for accuracy and presentation. A unique Digital Object Identifier (DOI) is assigned to the article before or upon publication for persistent citation and access. The final manuscript is then published, disseminating the research to the wider academic community.</p>

                                    <h4 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">Editorial Decision Criteria</h4>
                                    <p>The assigned Editor considers the reviewer recommendations, reviewer comments, author responses (if applicable), and the manuscript's overall quality and fit for the journal. The final decision is made by the Editor-in-Chief in consultation with the Editorial Board where necessary.</p>

                                    <h5 className="text-lg font-semibold mt-4 mb-1 text-gray-900 dark:text-white">A. Criteria for Acceptance:</h5>
                                    <p>A manuscript will generally be accepted for publication if:</p>
                                    <ol className="list-decimal list-inside space-y-1 pl-4">
                                        <li>It is endorsed for publication by at least two referees (often following successful revisions).</li>
                                        <li>The author(s) have substantially complied with the revisions requested by the reviewers and editors.</li>
                                        <li>It fully complies with the ethical standards and protocols for studies involving humans and animals, including necessary approvals and consents.</li>
                                        <li>The manuscript (including revisions) passes the plagiarism detection test with a score of at most 10% Similarity Index and maintains a Grammarly Rating of 95% or more.</li>
                                        <li>It represents a significant, original, and well-executed contribution to its field(s).</li>
                                    </ol>

                                    <h5 className="text-lg font-semibold mt-4 mb-1 text-gray-900 dark:text-white">B. Criteria for Rejection:</h5>
                                    <p>A manuscript may be rejected at various stages for reasons including, but not limited to:</p>
                                    <ol className="list-decimal list-inside space-y-1 pl-4">
                                        <li>Failure to meet the standards during initial screening (scope, basic requirements, plagiarism/grammar thresholds).</li>
                                        <li>Strong recommendations for rejection from two or more referees due to fundamental flaws in methodology, analysis, originality, or significance.</li>
                                        <li>Failure by the author(s) to adequately address major concerns raised by reviewers and editors during the revision process.</li>
                                        <li>Discovery of significant ethical violations (e.g., plagiarism, data fabrication, lack of ethical approval).</li>
                                        <li>Content being outside the scope of Daluyang Dunong.</li>
                                    </ol>

                                    <h5 className="text-lg font-semibold mt-4 mb-1 text-gray-900 dark:text-white">C. Handling Disagreements Among Reviewers:</h5>
                                    <p>In situations where referees disagree substantially about the quality of a manuscript or provide conflicting recommendations:</p>
                                    <ol className="list-decimal list-inside space-y-1 pl-4">
                                        <li>The Editor may solicit one or more additional reviews to serve as a tie-breaker.</li>
                                        <li>The Editor may invite the author(s) to reply specifically to a referee's criticisms. A compelling rebuttal may help inform the editorial decision.</li>
                                        <li>If the Editor requires further clarification after an author rebuttal, they may solicit a response from the referee who made the original criticism (without revealing the referee's identity to the author or vice-versa beyond the anonymized comments).</li>
                                        <li>In rare instances, the Editor may facilitate anonymized communication between an author and a referee to debate a specific critical point. Referees are not permitted to confer with each other, and the goal is editorial decision-making, not necessarily achieving consensus among reviewers.</li>
                                    </ol>

                                    <h4 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">Final Decision</h4>
                                    <p>The final decision regarding acceptance or rejection rests with the Editor-in-Chief, considering all feedback and evaluations gathered throughout the screening and review process. Authors will be notified of the final decision along with relevant comments.</p>
                                </div>

                                <div className="space-y-6">
                                    {reviewCriteria.map((stage, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors duration-300">
                                            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">{stage.stage}</h3>
                                            </div>
                                            <div className="p-6">
                                                <ul className="space-y-4">
                                                    {stage.criteria.map((criterion, criterionIndex) => (
                                                        <li key={criterionIndex} className="flex items-start">
                                                            <CheckCircle className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e] mr-3 flex-shrink-0 mt-0.5 transition-colors duration-300" />
                                                            <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{criterion}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-gradient-to-br from-[#f8f9fa] to-[#f0f8f3] dark:from-gray-800 dark:to-gray-800/90 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                    <div className="flex gap-4 items-start">
                                        <Info className="h-5 w-5 text-[#18652c] dark:text-[#3fb65e] flex-shrink-0 mt-1 transition-colors duration-300" />
                                        <div>
                                            <h4 className="text-gray-900 dark:text-white font-semibold mb-2 transition-colors duration-300">Review Timeline</h4>
                                            <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                                The typical turnaround time from initial submission to a first decision ranges from three months to one year. This timeframe can vary depending on factors such as the complexity of the manuscript and the availability of suitable expert reviewers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Publication Frequency and Funding - Add ID */}
                            <section id="publication-frequency" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <BookOpen className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Publication Frequency and Funding
                                </h2>
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors duration-300">
                                    <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                        <p>
                                            This journal is published annually but may also feature special issues dedicated to specific themes and emerging research areas.
                                        </p>
                                        <p>
                                            There are no processing and publication fees for accepted articles, as the journal is supported by the MinSU Research, Development and Extension Unit.
                                        </p>
                                        <p>
                                            We invite you to submit your work and participate in building this dynamic channel for knowledge dissemination.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Download Templates - Add ID */}
                            <section id="download-templates" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <Download className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
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

                            {/* Author Support - Add ID */}
                            <section id="author-support" className="mb-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/90 rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300">
                                    <Info className="h-6 w-6 mr-3 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                    Author Support
                                </h2>

                                <p className="text-gray-700 dark:text-gray-300 mb-8 transition-colors duration-300">
                                    Our editorial team is available to assist authors throughout the submission and review process.
                                    If you have questions about your submission or need clarification on any guidelines, please don't
                                    hesitate to contact us.
                                </p>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 bg-[#18652c]/10 dark:bg-[#18652c]/20 rounded-lg flex items-center justify-center transition-colors duration-300">
                                                <Mail className="h-6 w-6 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">Editorial Office</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">For questions about manuscript submission and status</p>
                                            <a
                                                href="mailto:submissions@ddmrj.minsu.edu.ph"
                                                className="inline-flex items-center mt-2 text-[#18652c] dark:text-[#3fb65e] hover:text-[#145024] dark:hover:text-[#3fb65e] font-medium transition-colors duration-300"
                                            >
                                                submissions@ddmrj.minsu.edu.ph
                                                <ArrowRight className="ml-1 h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 bg-[#18652c]/10 dark:bg-[#18652c]/20 rounded-lg flex items-center justify-center transition-colors duration-300">
                                                <Users className="h-6 w-6 text-[#18652c] dark:text-[#3fb65e] transition-colors duration-300" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">Author Resources</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Access additional resources and FAQs for authors</p>
                                            <Link
                                                href="#"
                                                className="inline-flex items-center mt-2 text-[#18652c] dark:text-[#3fb65e] hover:text-[#145024] dark:hover:text-[#3fb65e] font-medium transition-colors duration-300"
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
                                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg bg-white text-[#18652c] hover:bg-green-50 dark:focus:ring-offset-gray-900 font-medium shadow-sm transition-colors duration-300"
                                        >
                                            Submit Manuscript
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div> {/* End Main content wrapper */}
                    </div> {/* End Flex container */}
                </div>
            </main>
            <Footer />
        </div>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 transition-colors duration-300">{description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium dark:text-gray-300 transition-colors duration-300">{fileType}</span>
                        <span className="ml-2">{fileSize}</span>
                    </div>
                    <button className="flex items-center text-[#18652c] dark:text-[#3fb65e] hover:text-[#145024] dark:hover:text-[#3fb65e] transition-colors duration-300">
                        <Download className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Download</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
