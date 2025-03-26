import Footer from '@/Components/landing-pages/Footer';
import Header from '@/Components/landing-pages/Header';
import { PageProps } from '@/types';
import { useState } from "react"
import { Mail, Linkedin, Twitter, X, User, BookOpen, Users, Layers, GraduationCap, Award, FileText, ArrowRight, MapPin, Globe, ExternalLink, Check } from "lucide-react"
import { Head, Link } from '@inertiajs/react';

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
                imageUrl: "https://imgs.search.brave.com/WJZSVWQyBEAcO0uXi7GiTB9odMU4ut6spQo2v6byBDY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQw/NzA4NDQxOS9waG90/by9wb3J0cmFpdC1v/Zi1oYXBweS1tYXR1/cmUtd29tZW4uanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPVRW/ak5iSHlyU1ZKN1hj/VFpONi1sSG1JdEhJ/RjB2VnpjSXZPWXlY/QVBwOGs9",
                bio: "Dr. Santos is a renowned expert in environmental sustainability with over 20 years of research experience. She has published extensively on climate change impacts in Southeast Asia and leads several international research collaborations focused on sustainable development in island ecosystems.",
                email: "maria.santos@minsu.edu",
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
        title: "Associate Editors",
        description: "Responsible for overseeing manuscript review in their subject areas",
        members: [
            {
                name: "Prof. Juan dela Cruz",
                role: "Associate Editor",
                category: "Associate Editor",
                affiliation: "Department of Social Sciences, Mindoro State University",
                imageUrl: "https://imgs.search.brave.com/_g94HYY9A-j_pDWUO2-d0MI_1gzVCq2j3lLadLOTIGI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9zbWlsaW5nLWhh/cHB5LW1hdHVyZS1l/bGVnYW50LXByb2Zl/c3Nvci13aXRoLWds/YXNzZXMtZWR1Y2F0/aW9uLWtub3dsZWRn/ZS1jb25jZXB0LXRl/YWNoZXJzLWRheV8y/NjUyMjMtMzcxNC5q/cGc_c2VtdD1haXNf/aHlicmlk",
                bio: "Prof. dela Cruz specializes in rural development and has been instrumental in shaping policies for sustainable community growth in Mindoro. His research focuses on social dimensions of environmental management and indigenous knowledge systems.",
                email: "juan.delacruz@minsu.edu",
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
                imageUrl: "https://imgs.search.brave.com/a6c0VdSyEKONJHjhMbaSs4LL1hMW6mrMMOOtlH5PnkY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4LzQ5LzI2LzY0/LzM2MF9GXzg0OTI2/NjQzN19Idkx5UlFq/RlJWN2RMbHlwME1Z/WG9wSmY3YzMzTjcx/aC5qcGc",
                bio: "Dr. Reyes is a marine biologist focusing on coral reef conservation. Her work has significantly contributed to the protection of Mindoro's coastal ecosystems and the development of sustainable marine management practices across the Philippines.",
                email: "elena.reyes@minsu.edu",
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
                imageUrl: "https://imgs.search.brave.com/ArOrVAxqq503oybgWHPyuPTdCcftNG6T-CGqjTHvGIE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNS8w/OC8wMi8yMy8zOC9h/Z25hci1ob2Vza3Vs/ZHNzb24tODcyNDA4/XzY0MC5qcGc",
                bio: "Dr. Tan's research on sustainable farming practices has revolutionized agricultural methods in Mindoro, improving crop yields while reducing environmental impact. He leads several national initiatives on climate-smart agriculture and food security.",
                email: "roberto.tan@minsu.edu",
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
                imageUrl: "https://imgs.search.brave.com/v1fbYGlNBuCzgdOH-Ztjucbj4qpL1oUpbD3_EeGBUbw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9t/ZWRpdW0tc2hvdC1z/bWlsZXktd29tYW4t/bGlicmFyeV8yMy0y/MTQ5MjA0NzUzLmpw/Zz9zZW10PWFpc19o/eWJyaWQ",
                bio: "Prof. Lim is an expert in educational psychology, focusing on improving learning outcomes in rural areas. Her work has influenced educational policies across the Philippines, particularly in designing culturally-responsive teaching methods for indigenous communities.",
                email: "ana.lim@minsu.edu",
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
                imageUrl: "https://imgs.search.brave.com/-beOKffCTor4D9NMhM2qZwNRAS7LXtPFK0my7wHMHDA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxOS8w/Ni8yOS8wNC8zNi9j/b3Vuc2Vsb3ItNDMw/NTM5NF82NDAuanBn",
                bio: "Dr. Bautista's research on tropical diseases has led to improved healthcare strategies in remote areas of Mindoro and other parts of the Philippines. He specializes in epidemiology and has led several major public health initiatives targeting infectious diseases.",
                email: "carlos.bautista@minsu.edu",
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
                imageUrl: "https://images.unsplash.com/photo-1573497019236-61f684a5ef01?q=80&w=687&auto=format&fit=crop",
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
    const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    
    const filteredCategories = activeCategory === "all" 
        ? boardCategories 
        : boardCategories.filter(category => 
            category.members.some(member => member.category === activeCategory || category.title === activeCategory)
          );

    return (
        <>
            <Head title="Editorial Board | MinSU Research Journal" />
            <Header auth={auth} />
            <main className="bg-white min-h-screen">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Editorial Board</h1>
                            <p className="text-xl text-gray-600">
                                Our editorial board comprises distinguished scholars and researchers committed to maintaining 
                                the highest standards of academic excellence and integrity in scholarly publishing.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Editorial Process Section */}
                    <section className="mb-16">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-[#18652c] rounded-md mr-4">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">The Editorial Process</h2>
                                    <p className="text-gray-600 mt-1">
                                        Our esteemed board ensures rigorous peer review and academic excellence
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                    <Layers className="h-8 w-8 text-[#18652c] mb-3" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Rigorous Review</h3>
                                    <p className="text-gray-600 text-sm">
                                        Each manuscript undergoes a thorough double-blind peer review process by multiple experts
                                        in the field to ensure methodological soundness and scientific validity.
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                    <GraduationCap className="h-8 w-8 text-[#18652c] mb-3" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Excellence</h3>
                                    <p className="text-gray-600 text-sm">
                                        Our board members are leading scholars with significant contributions to their fields,
                                        providing expert guidance on scholarly direction and research quality.
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                    <Globe className="h-8 w-8 text-[#18652c] mb-3" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Perspective</h3>
                                    <p className="text-gray-600 text-sm">
                                        With members from diverse institutional and geographical backgrounds, we bring a global
                                        perspective to research evaluation and academic publishing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Board Member Categories Filter */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Meet Our Editorial Team</h2>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Filter by:</span>
                                <select 
                                    className="text-sm border border-gray-300 rounded-md py-1.5 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={activeCategory}
                                    onChange={(e) => setActiveCategory(e.target.value)}
                                >
                                    <option value="all">All Members</option>
                                    <option value="Editor-in-Chief">Editor-in-Chief</option>
                                    <option value="Associate Editor">Associate Editors</option>
                                    <option value="Advisory Board">Advisory Board</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Board Members Display */}
                    {filteredCategories.map((category, categoryIndex) => (
                        <section key={categoryIndex} className="mb-16">
                            <div className="flex items-center mb-6">
                                <div className="flex-shrink-0 h-8 w-1.5 bg-[#18652c] rounded-full mr-3"></div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                                    <p className="text-gray-500 text-sm">{category.description}</p>
                                </div>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {category.members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 border border-gray-200"
                                        onClick={() => setSelectedMember(member)}
                                    >
                                        <div className="h-60 overflow-hidden relative">
                                            <img
                                                src={member.imageUrl || "/placeholder.svg"}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent px-6 py-4">
                                                <div className="text-white">
                                                    <h2 className="text-xl font-semibold">{member.name}</h2>
                                                    <p className="text-gray-200 text-sm">{member.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-gray-600 mb-4 text-sm">{member.affiliation}</p>
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                                {member.publications && (
                                                    <div className="flex items-center">
                                                        <FileText className="h-4 w-4 text-[#18652c] mr-2" />
                                                        <span>{member.publications} publications</span>
                                                    </div>
                                                )}
                                                {member.citations && (
                                                    <div className="flex items-center">
                                                        <Award className="h-4 w-4 text-[#18652c] mr-2" />
                                                        <span>{member.citations} citations</span>
                                                    </div>
                                                )}
                                                {member.researchInterests && member.researchInterests.length > 0 && (
                                                    <div className="col-span-2 mt-2 flex flex-wrap gap-1">
                                                        {member.researchInterests.slice(0, 2).map((interest, i) => (
                                                            <span 
                                                                key={i} 
                                                                className="inline-block px-2 py-0.5 bg-green-50 text-[#18652c] text-xs rounded"
                                                            >
                                                                {interest}
                                                            </span>
                                                        ))}
                                                        {member.researchInterests.length > 2 && (
                                                            <span className="text-xs text-gray-500 self-center ml-1">
                                                                +{member.researchInterests.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {selectedMember && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
                                <button
                                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
                                    onClick={() => setSelectedMember(null)}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                
                                <div className="flex flex-col md:flex-row">
                                    {/* Left Column - Photo and Contact */}
                                    <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center">
                                        <div className="rounded-xl overflow-hidden w-40 h-40 border-4 border-white shadow-md mb-4">
                                            <img
                                                src={selectedMember.imageUrl || "/placeholder.svg"}
                                                alt={selectedMember.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 text-center">{selectedMember.name}</h2>
                                        <p className="text-[#18652c] font-medium mb-2 text-center">{selectedMember.role}</p>
                                        <p className="text-gray-600 text-sm mb-6 text-center">{selectedMember.affiliation}</p>
                                        
                                        {/* Contact Information */}
                                        <div className="w-full space-y-3 mb-6">
                                            <a href={`mailto:${selectedMember.email}`} className="flex items-center text-gray-600 hover:text-[#18652c] transition-colors">
                                                <Mail className="h-4 w-4 mr-2" />
                                                <span className="text-sm">{selectedMember.email}</span>
                                            </a>
                                            
                                            {selectedMember.website && (
                                                <a href={selectedMember.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-[#18652c] transition-colors">
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    <span className="text-sm">Website</span>
                                                </a>
                                            )}
                                            
                                            {selectedMember.location && (
                                                <div className="flex items-center text-gray-600">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    <span className="text-sm">{selectedMember.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Social links */}
                                        <div className="flex justify-center space-x-4 mt-auto">
                                            {selectedMember.linkedin && (
                                                <a
                                                    href={selectedMember.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[#18652c] hover:text-white transition-colors"
                                                >
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                            {selectedMember.twitter && (
                                                <a
                                                    href={selectedMember.twitter}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[#18652c] hover:text-white transition-colors"
                                                >
                                                    <Twitter className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Right Column - Bio and Academic Info */}
                                    <div className="md:w-2/3 p-6">
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                                <User className="h-5 w-5 mr-2 text-[#18652c]" />
                                                Biography
                                            </h3>
                                            <p className="text-gray-700">{selectedMember.bio}</p>
                                        </div>
                                        
                                        {selectedMember.education && (
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                                    <GraduationCap className="h-5 w-5 mr-2 text-[#18652c]" />
                                                    Education
                                                </h3>
                                                <p className="text-gray-700">{selectedMember.education}</p>
                                            </div>
                                        )}
                                        
                                        {selectedMember.expertise && selectedMember.expertise.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                                    <Award className="h-5 w-5 mr-2 text-[#18652c]" />
                                                    Areas of Expertise
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedMember.expertise.map((area, i) => (
                                                        <span 
                                                            key={i} 
                                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                        >
                                                            {area}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {selectedMember.researchInterests && selectedMember.researchInterests.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                                    <BookOpen className="h-5 w-5 mr-2 text-[#18652c]" />
                                                    Research Interests
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedMember.researchInterests.map((interest, i) => (
                                                        <span 
                                                            key={i} 
                                                            className="px-3 py-1.5 bg-green-50 text-[#18652c] rounded-full text-sm"
                                                        >
                                                            {interest}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Academic Metrics */}
                                        {(selectedMember.publications || selectedMember.citations || selectedMember.hIndex) && (
                                            <div className="bg-gray-50 p-4 rounded-lg mt-6">
                                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Academic Metrics</h3>
                                                <div className="grid grid-cols-3 gap-4 text-center">
                                                    {selectedMember.publications && (
                                                        <div>
                                                            <p className="text-2xl font-bold text-[#18652c]">{selectedMember.publications}</p>
                                                            <p className="text-xs text-gray-500">Publications</p>
                                                        </div>
                                                    )}
                                                    {selectedMember.citations && (
                                                        <div>
                                                            <p className="text-2xl font-bold text-[#18652c]">{selectedMember.citations}</p>
                                                            <p className="text-xs text-gray-500">Citations</p>
                                                        </div>
                                                    )}
                                                    {selectedMember.hIndex && (
                                                        <div>
                                                            <p className="text-2xl font-bold text-[#18652c]">{selectedMember.hIndex}</p>
                                                            <p className="text-xs text-gray-500">H-Index</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Editorial Policies Section */}
                    <section className="mb-16 bg-gray-50 rounded-xl p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <FileText className="h-6 w-6 mr-3 text-[#18652c]" />
                            Editorial Policies and Ethics
                        </h2>

                        <div className="prose max-w-none text-gray-700">
                            <p>
                                MinSU Research Journal adheres to the highest standards of ethical publishing practices. Our editorial board is committed to:
                            </p>
                            
                            <ul className="mt-4 space-y-2">
                                <li className="flex items-start">
                                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#18652c] text-white mr-3 flex-shrink-0 mt-0.5">
                                        <Check className="h-3 w-3" />
                                    </span>
                                    <span>Ensuring fair and unbiased peer review processes</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#18652c] text-white mr-3 flex-shrink-0 mt-0.5">
                                        <Check className="h-3 w-3" />
                                    </span>
                                    <span>Promoting research integrity and preventing misconduct</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#18652c] text-white mr-3 flex-shrink-0 mt-0.5">
                                        <Check className="h-3 w-3" />
                                    </span>
                                    <span>Adhering to COPE (Committee on Publication Ethics) guidelines</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#18652c] text-white mr-3 flex-shrink-0 mt-0.5">
                                        <Check className="h-3 w-3" />
                                    </span>
                                    <span>Maintaining transparency in the publication process</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#18652c] text-white mr-3 flex-shrink-0 mt-0.5">
                                        <Check className="h-3 w-3" />
                                    </span>
                                    <span>Promoting diversity and inclusivity in academic publishing</span>
                                </li>
                            </ul>
                            
                            <div className="mt-6">
                                <Link 
                                    href="#" 
                                    className="inline-flex items-center text-[#18652c] font-medium hover:text-[#145024]"
                                >
                                    Read our complete editorial policies
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Join Our Board CTA */}
                    <div className="bg-gradient-to-br from-[#18652c] to-[#0f4b1e] rounded-xl p-8 shadow-lg text-white">
                        <div className="md:flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Join Our Editorial Board</h2>
                                <p className="text-green-100 mb-6 md:mb-0 max-w-2xl">
                                    We are always looking for experienced researchers and academics to join our editorial board. 
                                    If you're interested in contributing to the MinSU Research Journal, please contact us with your CV and areas of expertise.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Link
                                    href={route('contact-us')}
                                    className="inline-flex items-center px-6 py-3 border border-white bg-transparent hover:bg-white hover:text-[#18652c] text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-700 focus:ring-white"
                                >
                                    <Users className="mr-2 h-5 w-5" />
                                    Apply to Join
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
