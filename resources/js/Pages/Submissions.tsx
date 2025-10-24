import Footer from '@/components/site-footer';
import Header from '@/components/site-header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle, FileText, Users, Clock, BookOpen,
    Calendar, ArrowRight, Download, Info, CheckSquare,
    AlertCircle, FileQuestion, Award, Edit3, Search, Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Head title="Submission Guidelines | Daluyang Dunong" />
            <Header auth={auth} />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-background py-16 lg:py-24">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
                            <div className="aspect-square w-72 bg-primary/30 rounded-full" />
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center mt-8">
                            <div className="flex justify-center mb-6">
                                <Badge variant="secondary" className="px-4 py-2">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Author Guidelines
                                </Badge>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
                                Manuscript
                                <span className="text-primary"> Submission</span>
                            </h1>

                            <p className="text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                                Submit your research to Daluyang Dunong Multidisciplinary Research Journal.
                                Follow our comprehensive guidelines for a smooth submission process.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                    <div className="space-y-12">

                        {/* Overview Section */}
                        <section id="overview" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                                    <Info className="h-8 w-8 text-primary" />
                                    Overview
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Get started with your manuscript submission process
                                </p>
                            </div>

                            {/* Key Information */}
                            <Card className="bg-gradient-to-br from-muted/50 to-background">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <Calendar className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">Current Submission Information</CardTitle>
                                            <p className="text-muted-foreground mt-1">Important dates and special issue opportunities</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {keyInfo.map((info, index) => (
                                            <Card key={index} className="hover:shadow-md transition-all">
                                                <CardContent className="p-5">
                                                    <h3 className="text-base font-semibold text-foreground mb-2">{info.title}</h3>
                                                    <p className="text-sm text-muted-foreground mb-3">{info.subtitle}</p>
                                                    <div className="flex items-center">
                                                        <info.icon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                                        <span className="font-medium text-foreground">{info.date}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Scope Section */}
                        <section id="scope" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                                    <BookOpen className="h-8 w-8 text-primary" />
                                    Aims and Scope
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Learn about our journal's focus and thematic areas
                                </p>
                            </div>

                            <Card>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Journal Overview</h3>
                                        <div className="space-y-4 text-muted-foreground">
                                            <p>
                                                DDMRJ serves as a primary multidisciplinary channel for disseminating high-quality original research and scholarly communications. It aims to nurture vibrant academic dialogue, encourage cross-disciplinary approaches, and advance knowledge addressing issues of local, national (Philippines), and global significance, ensuring impact and rigor through robust peer review.
                                            </p>
                                            <p>
                                                Daluyang Dunong welcomes submissions of original research articles, review papers, and case studies that fall within its broad multidisciplinary mandate. The journal is particularly interested in contributions addressing, but not limited to, the following key thematic areas:
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {thematicAreas.map((area, index) => (
                                            <Card key={index} className="hover:shadow-md transition-all">
                                                <CardContent className="p-6">
                                                    <h3 className="text-lg font-semibold text-primary mb-2">{area.title}</h3>
                                                    <p className="text-muted-foreground text-sm">{area.description}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <Card className="bg-muted/50">
                                        <CardContent className="p-6">
                                            <p className="text-muted-foreground">
                                                The journal encourages interdisciplinary research that connects these themes and welcomes contributions offering novel insights, methodologies, and solutions that significantly contribute to the advancement of the Sustainable Development Goals (SDGs) in both local and international contexts.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Types Section */}
                        <section id="types" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                                    <FileQuestion className="h-8 w-8 text-primary" />
                                    Types of Articles We Publish
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Explore the different types of manuscripts we accept
                                </p>
                            </div>

                            <Card>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {articleTypes.map((type, index) => (
                                            <Card key={index} className="hover:shadow-md transition-all">
                                                <CardContent className="p-6">
                                                    <h3 className="text-lg font-semibold text-primary mb-2">{type.name}</h3>
                                                    <p className="text-muted-foreground mb-4">{type.description}</p>
                                                    <Separator className="my-4" />
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="font-medium text-foreground">Word Count:</span>
                                                            <p className="text-muted-foreground">{type.wordCount}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-foreground">Structure:</span>
                                                            <p className="text-muted-foreground text-xs">{type.structure}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Guidelines Section */}
                        <section id="guidelines" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                                    <CheckCircle className="h-8 w-8 text-primary" />
                                    Submission Guidelines
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Follow our comprehensive guidelines for successful submission
                                </p>
                            </div>

                            <Card>
                                <CardContent className="space-y-6">
                                    {guidelines.map((category, categoryIndex) => (
                                        <Card key={categoryIndex}>
                                            <CardHeader className="bg-muted">
                                                <CardTitle className="text-lg">{category.category}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <ul className="space-y-4">
                                                    {category.items.map((guideline, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                                                            <span className="text-muted-foreground">{guideline}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <Card className="border-l-4 border-destructive bg-destructive/5">
                                        <CardContent className="p-5">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-destructive">Important Note for Authors</h3>
                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        <p>
                                                            Submissions that do not follow these guidelines may be returned to authors before peer review.
                                                            Please ensure your manuscript complies with all requirements to avoid delays in the review process.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Process Section */}
                        <section id="process" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                                    <Clock className="h-8 w-8 text-primary" />
                                    Submission Process
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Step-by-step guide through our submission workflow
                                </p>
                            </div>

                            <Card>
                                <CardContent>
                                    <div className="space-y-6">
                                        {steps.map((step, index) => (
                                            <Card key={index} className="hover:shadow-md transition-all">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                                                            <p className="text-muted-foreground mb-4">{step.description}</p>
                                                            <ul className="text-sm text-muted-foreground space-y-1">
                                                                {step.details.map((detail, detailIndex) => (
                                                                    <li key={detailIndex} className="flex items-start">
                                                                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                                                        {detail}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Review Section */}
                        <section id="review" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                                    <Users className="h-8 w-8 text-primary" />
                                    Review Process & Criteria
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Understand our rigorous peer review standards
                                </p>
                            </div>

                            <Card>
                                <CardContent className="space-y-6">
                                    <div className="text-muted-foreground space-y-4">
                                        <p>Upon the submission of the manuscript, it undergoes an initial assessment by the journal's editorial staff to determine alignment with the journal's scope and thematic areas, adherence to formatting standards, and overall preliminary quality.</p>
                                    </div>

                                    {reviewCriteria.map((stage, index) => (
                                        <Card key={index}>
                                            <CardHeader className="bg-muted">
                                                <CardTitle className="text-lg">{stage.stage}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <ul className="space-y-3">
                                                    {stage.criteria.map((criterion, criterionIndex) => (
                                                        <li key={criterionIndex} className="flex items-start">
                                                            <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                                                            <span className="text-muted-foreground">{criterion}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        </section>

                        {/* Publication Section */}
                        <section id="publication" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                                    <Award className="h-8 w-8 text-primary" />
                                    Publication Frequency and Funding
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Learn about our publication schedule and policies
                                </p>
                            </div>

                            <Card>
                                <CardContent className="space-y-4 text-muted-foreground">
                                    <p>This journal is published annually but may also feature special issues dedicated to specific themes and emerging research areas.</p>
                                    <p>There are no processing and publication fees for accepted articles, as the journal is supported by the MinSU Research, Development and Extension Unit.</p>
                                    <p>We invite you to submit your work and participate in building this dynamic channel for knowledge dissemination.</p>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Resources Section */}
                        <section id="resources" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                                    <Download className="h-8 w-8 text-primary" />
                                    Submission Templates & Resources
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Download templates and resources to help with your submission
                                </p>
                            </div>

                            <Card>
                                <CardContent>
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
                                </CardContent>
                            </Card>
                        </section>

                        {/* Support Section */}
                        <section id="support" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                                    <Mail className="h-8 w-8 text-primary" />
                                    Author Support
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Get help with your submission and find additional resources
                                </p>
                            </div>

                            <Card>
                                <CardContent className="space-y-6">
                                    <p className="text-muted-foreground">
                                        Our editorial team is available to assist authors throughout the submission and review process.
                                        If you have questions about your submission or need clarification on any guidelines, please don't
                                        hesitate to contact us.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <Mail className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground">Editorial Office</h3>
                                                        <p className="text-muted-foreground mt-1">For questions about manuscript submission and status</p>
                                                        <a
                                                            href="mailto:submissions@ddmrj.minsu.edu.ph"
                                                            className="inline-flex items-center mt-2 text-primary hover:text-primary/80 font-medium"
                                                        >
                                                            submissions@ddmrj.minsu.edu.ph
                                                            <ArrowRight className="ml-1 h-4 w-4" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <Users className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground">Author Resources</h3>
                                                        <p className="text-muted-foreground mt-1">Access additional resources and FAQs for authors</p>
                                                        <Link
                                                            href="#"
                                                            className="inline-flex items-center mt-2 text-primary hover:text-primary/80 font-medium"
                                                        >
                                                            View author resources
                                                            <ArrowRight className="ml-1 h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* CTA Section */}
                            <Card className="bg-primary text-primary-foreground">
                                <CardContent className="p-8">
                                    <div className="md:flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold mb-4">Ready to Submit Your Manuscript?</h2>
                                            <p className="text-primary-foreground/80 mb-6 md:mb-0 max-w-2xl">
                                                Our online submission system is available 24/7. Create an account or log in to begin the submission process.
                                                We look forward to receiving your research contribution.
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link
                                                href="#"
                                                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg bg-background text-primary hover:bg-accent font-medium shadow-sm"
                                            >
                                                Submit Manuscript
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
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
        <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{fileType}</Badge>
                        <span className="ml-2">{fileSize}</span>
                    </div>
                    <button className="flex items-center text-primary hover:text-primary/80 transition-colors">
                        <Download className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Download</span>
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
