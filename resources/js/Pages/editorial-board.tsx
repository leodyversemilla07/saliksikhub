import Footer from '@/components/site-footer';
import Header from '@/components/site-header';
import { PageProps } from '@/types';
import { Mail, ExternalLink } from "lucide-react";
import { Head } from '@inertiajs/react';
import { Breadcrumb } from '@/components/breadcrumb';

interface BoardMember {
    name: string
    role: string
    category?: string // Editor-in-Chief, Associate Editor, etc.
    affiliation: string
    imageUrl: string
    bio: string
    email: string
    linkedin?: string
    twitter?: string
    researchInterests?: string[]
    publications?: number
    citations?: number
    hIndex?: number
    education?: string
    expertise?: string[] // Areas of expertise
    website?: string
    location?: string
}

interface EditorialCategory {
    title: string
    description: string
    members: BoardMember[]
}

const boardCategories: EditorialCategory[] = [
    {
        title: "Editor-in-Chief",
        description: "Provides leadership and oversees the entire editorial process",
        members: [
            {
                name: "Dr. Maria Santos",
                role: "Editor-in-Chief",
                category: "Editor-in-Chief",
                affiliation: "Department of Environmental Science, Mindoro State University",
                imageUrl: "https://www.shutterstock.com/image-photo/head-shot-portrait-smart-confident-600nw-1721092123.jpg",
                bio: "Dr. Santos is a renowned expert in environmental sustainability with over 20 years of research experience. She has published extensively on climate change impacts in Southeast Asia and leads several international research collaborations focused on sustainable development in island ecosystems.",
                email: "maria.santos@minsu.edu.ph",
                linkedin: "https://www.linkedin.com/in/maria-santos",
                twitter: "https://twitter.com/mariasantos",
                researchInterests: ["Environmental Sustainability", "Climate Change", "Island Ecosystems"],
                publications: 87,
                citations: 1450,
                hIndex: 24,
                education: "Ph.D. in Environmental Science, University of California, Berkeley",
                expertise: ["Climate Change Impact Assessment", "Sustainable Development", "Environmental Policy"],
                website: "https://www.mindorostateuniversity.edu/faculty/santos",
                location: "Bongabong, Oriental Mindoro"
            }
        ]
    },
    {
        title: "Managing Editor",
        description: "Oversees the day-to-day operations of the editorial process and ensures smooth communication among all stakeholders.",
        members: [
            {
                name: "Dr. Alex Rivera",
                role: "Managing Editor",
                category: "Managing Editor",
                affiliation: "Department of Communication, Mindoro State University",
                imageUrl: "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=",
                bio: "Dr. Rivera is an experienced editor with a strong background in academic publishing and communication. He has been instrumental in streamlining editorial workflows and fostering collaboration among editorial teams.",
                email: "alex.rivera@minsu.edu.ph",
                linkedin: "https://www.linkedin.com/in/alex-rivera",
                researchInterests: ["Academic Publishing", "Editorial Workflows", "Communication Strategies"],
                publications: 25,
                citations: 400,
                hIndex: 10,
                education: "Ph.D. in Communication, University of the Philippines",
                expertise: ["Editorial Management", "Academic Writing", "Publishing Ethics"],
                location: "Calapan, Oriental Mindoro"
            }
        ]
    },
    {
        title: "Associate Editors",
        description: "Responsible for overseeing manuscript review in their subject areas",
        members: [
            {
                name: "Prof. Juan dela Cruz",
                role: "Associate Editor",
                category: "Associate Editor",
                affiliation: "Department of Social Sciences, Mindoro State University",
                imageUrl: "https://www.corporatephotographerslondon.com/wp-content/uploads/2023/02/LinkedIn_Profile_Photo.jpg",
                bio: "Prof. dela Cruz specializes in rural development and has been instrumental in shaping policies for sustainable community growth in Mindoro. His research focuses on social dimensions of environmental management and indigenous knowledge systems.",
                email: "juan.delacruz@minsu.edu.ph",
                linkedin: "https://www.linkedin.com/in/juan-delacruz",
                researchInterests: ["Rural Development", "Indigenous Knowledge", "Community Engagement"],
                publications: 45,
                citations: 780,
                hIndex: 16,
                education: "Ph.D. in Sociology, University of the Philippines",
                expertise: ["Rural Sociology", "Indigenous Studies", "Community-Based Research Methods"]
            },
            {
                name: "Dr. Elena Reyes",
                role: "Associate Editor",
                category: "Associate Editor",
                affiliation: "Department of Marine Biology, Mindoro State University",
                imageUrl: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
                bio: "Dr. Reyes is a marine biologist focusing on coral reef conservation. Her work has significantly contributed to the protection of Mindoro's coastal ecosystems and the development of sustainable marine management practices across the Philippines.",
                email: "elena.reyes@minsu.edu.ph",
                twitter: "https://twitter.com/elenareyes",
                researchInterests: ["Marine Conservation", "Coral Reef Ecology", "Sustainable Fisheries"],
                publications: 62,
                citations: 1180,
                hIndex: 19,
                education: "Ph.D. in Marine Biology, Scripps Institution of Oceanography",
                expertise: ["Coral Reef Ecology", "Marine Protected Areas", "Fisheries Management"]
            },
            {
                name: "Dr. Roberto Tan",
                role: "Associate Editor",
                category: "Associate Editor",
                affiliation: "Department of Agriculture, Mindoro State University",
                imageUrl: "https://beaconnected.me/wp-content/uploads/sites/24763/2021/12/headshot_1-min.jpg",
                bio: "Dr. Tan's research on sustainable farming practices has revolutionized agricultural methods in Mindoro, improving crop yields while reducing environmental impact. He leads several national initiatives on climate-smart agriculture and food security.",
                email: "roberto.tan@minsu.edu.ph",
                linkedin: "https://www.linkedin.com/in/roberto-tan",
                researchInterests: ["Sustainable Agriculture", "Crop Science", "Food Security"],
                publications: 53,
                citations: 920,
                hIndex: 18,
                education: "Ph.D. in Agricultural Sciences, University of Tokyo",
                expertise: ["Agroecology", "Climate-Smart Agriculture", "Agricultural Economics"]
            },
            {
                name: "Prof. Ana Lim",
                role: "Associate Editor",
                category: "Associate Editor",
                affiliation: "Department of Education, Mindoro State University",
                imageUrl: "https://photobi.hk/wp-content/uploads/2020/02/141A0462222-e1581229818501.jpg",
                bio: "Prof. Lim is an expert in educational psychology, focusing on improving learning outcomes in rural areas. Her work has influenced educational policies across the Philippines, particularly in designing culturally-responsive teaching methods for indigenous communities.",
                email: "ana.lim@minsu.edu.ph",
                twitter: "https://twitter.com/analim",
                researchInterests: ["Educational Psychology", "Rural Education", "Pedagogy"],
                publications: 38,
                citations: 560,
                hIndex: 12,
                education: "Ph.D. in Educational Psychology, University of the Philippines",
                expertise: ["Learning Assessment", "Educational Policy", "Culturally-Responsive Teaching"]
            },
            {
                name: "Dr. Carlos Bautista",
                role: "Associate Editor",
                category: "Associate Editor",
                affiliation: "Department of Public Health, Mindoro State University",
                imageUrl: "https://www.denverheadshotco.com/wp-content/uploads/2023/05/Denver-Headshot-Co-0013-SMALL.jpg",
                bio: "Dr. Bautista's research on tropical diseases has led to improved healthcare strategies in remote areas of Mindoro and other parts of the Philippines. He specializes in epidemiology and has led several major public health initiatives targeting infectious diseases.",
                email: "carlos.bautista@minsu.edu.ph",
                linkedin: "https://www.linkedin.com/in/carlos-bautista",
                researchInterests: ["Public Health", "Epidemiology", "Tropical Medicine"],
                publications: 74,
                citations: 1260,
                hIndex: 22,
                education: "M.D., University of the Philippines; Ph.D. in Epidemiology, Johns Hopkins University",
                expertise: ["Infectious Disease", "Health Systems", "Preventive Medicine"]
            },
        ]
    },
    {
        title: "International Advisory Board",
        description: "Distinguished scholars providing strategic guidance and international perspective",
        members: [
            {
                name: "Dr. Sarah Johnson",
                role: "International Advisor",
                category: "Advisory Board",
                affiliation: "Department of Environmental Studies, University of Washington",
                imageUrl: "https://monteluke.com.au/wp-content/gallery/linkedin-profile-pictures/3.JPG",
                bio: "Dr. Johnson is a leading figure in climate change research with extensive experience in international environmental policy. She serves on multiple editorial boards and advises several governmental bodies on sustainable development strategies.",
                email: "sjohnson@uw.edu",
                linkedin: "https://www.linkedin.com/in/sarah-johnson",
                researchInterests: ["Climate Policy", "Environmental Justice", "Sustainability"],
                publications: 115,
                citations: 3200,
                hIndex: 32,
                education: "Ph.D. in Environmental Science, Stanford University",
                expertise: ["Climate Change Policy", "Environmental Economics", "International Relations"],
                location: "Seattle, USA"
            }
        ]
    }
];

export default function EditorialBoard({ auth }: PageProps) {
    const breadcrumbItems = [
        { href: '/', label: 'Home' },
        { href: '', label: 'Editorial Board' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Editorial Board | Daluyang Dunong" />
            <Header auth={auth} />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb items={breadcrumbItems} />

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                        Editorial Board
                    </h1>

                    {/* Introduction Section */}
                    <div className="border-l-4 border-[#18652c] dark:border-[#3fb65e] pl-6 mb-12">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Our editorial board comprises internationally recognized scholars and experts who bring diverse perspectives and profound expertise to advance the mission of Daluyang Dunong: Mindoro Research Journal.
                        </p>
                    </div>

                    {/* Board Members Display */}
                    {boardCategories.map((category, categoryIndex) => (
                        <section key={categoryIndex} className="mb-16">
                            {/* Category Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{category.title}</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
                            </div>

                            {/* Members Grid */}
                            <div className="space-y-6">
                                {category.members.map((member, index) => (
                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            {/* Profile Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={member.imageUrl}
                                                    alt={member.name}
                                                    className="w-24 h-24 rounded-lg object-cover"
                                                />
                                            </div>

                                            {/* Main Content */}
                                            <div className="flex-grow space-y-4">
                                                {/* Name and Basic Info */}
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        {member.name}
                                                    </h3>
                                                    <p className="text-sm text-[#18652c] dark:text-[#3fb65e] font-medium">
                                                        {member.role}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {member.affiliation}
                                                    </p>
                                                </div>

                                                {/* Bio */}
                                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                                    {member.bio}
                                                </p>

                                                {/* Academic Metrics */}
                                                {(member.publications || member.citations || member.hIndex) && (
                                                    <div className="flex gap-4 text-xs">
                                                        {member.publications && (
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                <strong className="text-gray-900 dark:text-white">{member.publications}</strong> Publications
                                                            </span>
                                                        )}
                                                        {member.citations && (
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                <strong className="text-gray-900 dark:text-white">{member.citations}</strong> Citations
                                                            </span>
                                                        )}
                                                        {member.hIndex && (
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                <strong className="text-gray-900 dark:text-white">{member.hIndex}</strong> H-Index
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Research Interests */}
                                                {member.researchInterests && member.researchInterests.length > 0 && (
                                                    <div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {member.researchInterests.map((interest, idx) => (
                                                                <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                                                    {interest}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Contact Links */}
                                                <div className="flex gap-3">
                                                    {member.email && (
                                                        <a 
                                                            href={`mailto:${member.email}`} 
                                                            className="text-gray-600 dark:text-gray-400 hover:text-[#18652c] dark:hover:text-[#3fb65e] text-sm"
                                                        >
                                                            <Mail className="h-4 w-4 inline mr-1" />
                                                            Email
                                                        </a>
                                                    )}
                                                    {member.linkedin && (
                                                        <a 
                                                            href={member.linkedin} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-gray-600 dark:text-gray-400 hover:text-[#18652c] dark:hover:text-[#3fb65e] text-sm"
                                                        >
                                                            LinkedIn
                                                        </a>
                                                    )}
                                                    {member.website && (
                                                        <a 
                                                            href={member.website} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-gray-600 dark:text-gray-400 hover:text-[#18652c] dark:hover:text-[#3fb65e] text-sm"
                                                        >
                                                            <ExternalLink className="h-4 w-4 inline mr-1" />
                                                            Website
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
