import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import { PageProps } from '@/types';
import { useState } from "react"
import { Mail, Linkedin, Twitter, X } from "lucide-react"
import { Head } from '@inertiajs/react';

interface BoardMember {
    name: string
    role: string
    affiliation: string
    imageUrl: string
    bio: string
    email: string
    linkedin?: string
    twitter?: string
}

const boardMembers: BoardMember[] = [
    {
        name: "Dr. Maria Santos",
        role: "Editor-in-Chief",
        affiliation: "Department of Environmental Science, Mindoro State University",
        imageUrl: "https://imgs.search.brave.com/WJZSVWQyBEAcO0uXi7GiTB9odMU4ut6spQo2v6byBDY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQw/NzA4NDQxOS9waG90/by9wb3J0cmFpdC1v/Zi1oYXBweS1tYXR1/cmUtd29tZW4uanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPVRW/ak5iSHlyU1ZKN1hj/VFpONi1sSG1JdEhJ/RjB2VnpjSXZPWXlY/QVBwOGs9",
        bio: "Dr. Santos is a renowned expert in environmental sustainability with over 20 years of research experience. She has published extensively on climate change impacts in Southeast Asia.",
        email: "maria.santos@minsu.edu",
        linkedin: "https://www.linkedin.com/in/maria-santos",
        twitter: "https://twitter.com/mariasantos",
    },
    {
        name: "Prof. Juan dela Cruz",
        role: "Associate Editor",
        affiliation: "Department of Social Sciences, Mindoro State University",
        imageUrl: "https://imgs.search.brave.com/_g94HYY9A-j_pDWUO2-d0MI_1gzVCq2j3lLadLOTIGI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9zbWlsaW5nLWhh/cHB5LW1hdHVyZS1l/bGVnYW50LXByb2Zl/c3Nvci13aXRoLWds/YXNzZXMtZWR1Y2F0/aW9uLWtub3dsZWRn/ZS1jb25jZXB0LXRl/YWNoZXJzLWRheV8y/NjUyMjMtMzcxNC5q/cGc_c2VtdD1haXNf/aHlicmlk",
        bio: "Prof. dela Cruz specializes in rural development and has been instrumental in shaping policies for sustainable community growth in Mindoro.",
        email: "juan.delacruz@minsu.edu",
        linkedin: "https://www.linkedin.com/in/juan-delacruz",
    },
    {
        name: "Dr. Elena Reyes",
        role: "Associate Editor",
        affiliation: "Department of Marine Biology, Mindoro State University",
        imageUrl: "https://imgs.search.brave.com/a6c0VdSyEKONJHjhMbaSs4LL1hMW6mrMMOOtlH5PnkY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4LzQ5LzI2LzY0/LzM2MF9GXzg0OTI2/NjQzN19Idkx5UlFq/RlJWN2RMbHlwME1Z/WG9wSmY3YzMzTjcx/aC5qcGc",
        bio: "Dr. Reyes is a marine biologist focusing on coral reef conservation. Her work has significantly contributed to the protection of Mindoro's coastal ecosystems.",
        email: "elena.reyes@minsu.edu",
        twitter: "https://twitter.com/elenareyes",
    },
    {
        name: "Dr. Roberto Tan",
        role: "Associate Editor",
        affiliation: "Department of Agriculture, Mindoro State University",
        imageUrl: "https://imgs.search.brave.com/ArOrVAxqq503oybgWHPyuPTdCcftNG6T-CGqjTHvGIE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNS8w/OC8wMi8yMy8zOC9h/Z25hci1ob2Vza3Vs/ZHNzb24tODcyNDA4/XzY0MC5qcGc",
        bio: "Dr. Tan's research on sustainable farming practices has revolutionized agricultural methods in Mindoro, improving crop yields while reducing environmental impact.",
        email: "roberto.tan@minsu.edu",
        linkedin: "https://www.linkedin.com/in/roberto-tan",
    },
    {
        name: "Prof. Ana Lim",
        role: "Associate Editor",
        affiliation: "Department of Education, Mindoro State University",
        imageUrl: "https://imgs.search.brave.com/v1fbYGlNBuCzgdOH-Ztjucbj4qpL1oUpbD3_EeGBUbw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9t/ZWRpdW0tc2hvdC1z/bWlsZXktd29tYW4t/bGlicmFyeV8yMy0y/MTQ5MjA0NzUzLmpw/Zz9zZW10PWFpc19o/eWJyaWQ",
        bio: "Prof. Lim is an expert in educational psychology, focusing on improving learning outcomes in rural areas. Her work has influenced educational policies across the Philippines.",
        email: "ana.lim@minsu.edu",
        twitter: "https://twitter.com/analim",
    },
    {
        name: "Dr. Carlos Bautista",
        role: "Associate Editor",
        affiliation: "Department of Public Health, Mindoro State University",
        imageUrl: "https://imgs.search.brave.com/-beOKffCTor4D9NMhM2qZwNRAS7LXtPFK0my7wHMHDA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxOS8w/Ni8yOS8wNC8zNi9j/b3Vuc2Vsb3ItNDMw/NTM5NF82NDAuanBn",
        bio: "Dr. Bautista's research on tropical diseases has led to improved healthcare strategies in remote areas of Mindoro and other parts of the Philippines.",
        email: "carlos.bautista@minsu.edu",
        linkedin: "https://www.linkedin.com/in/carlos-bautista",
    },
]

export default function EditorialBoard({ auth }: PageProps) {
    const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null)

    return (
        <>
            <Head title="Editorial Boord" />
            <Header auth={auth} />
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-bold text-[#18652c] mb-8 text-center">Editorial Board</h1>
                    <p className="text-xl text-[#18652c] mb-12 text-center max-w-3xl mx-auto">
                        Our editorial board comprises distinguished scholars and researchers from various disciplines, ensuring the
                        highest standards of academic rigor and integrity in our publications.
                    </p>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {boardMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-[#f0f8f3] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
                                onClick={() => setSelectedMember(member)}
                            >
                                <img
                                    src={member.imageUrl || "/placeholder.svg"}
                                    alt={member.name}
                                    width={400}
                                    height={400}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold text-[#18652c] mb-2">{member.name}</h2>
                                    <p className="text-[#3fb65e] font-medium mb-2">{member.role}</p>
                                    <p className="text-[#18652c] mb-4">{member.affiliation}</p>
                                    <p className="text-[#18652c] line-clamp-3">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedMember && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg max-w-2xl w-full p-8 relative">
                                <button
                                    className="absolute top-4 right-4 text-[#18652c] hover:text-[#3fb65e]"
                                    onClick={() => setSelectedMember(null)}
                                >
                                    <X />
                                </button>
                                <img
                                    src={selectedMember.imageUrl || "/placeholder.svg"}
                                    alt={selectedMember.name}
                                    width={200}
                                    height={200}
                                    className="w-48 h-48 object-cover rounded-full mx-auto mb-6"
                                />
                                <h2 className="text-3xl font-semibold text-[#18652c] mb-2 text-center">{selectedMember.name}</h2>
                                <p className="text-[#3fb65e] font-medium mb-2 text-center">{selectedMember.role}</p>
                                <p className="text-[#18652c] mb-4 text-center">{selectedMember.affiliation}</p>
                                <p className="text-[#18652c] mb-6">{selectedMember.bio}</p>
                                <div className="flex justify-center space-x-4">
                                    <a href={`mailto:${selectedMember.email}`} className="text-[#3fb65e] hover:text-[#18652c]">
                                        <Mail className="w-6 h-6" />
                                    </a>
                                    {selectedMember.linkedin && (
                                        <a
                                            href={selectedMember.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#3fb65e] hover:text-[#18652c]"
                                        >
                                            <Linkedin className="w-6 h-6" />
                                        </a>
                                    )}
                                    {selectedMember.twitter && (
                                        <a
                                            href={selectedMember.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#3fb65e] hover:text-[#18652c]"
                                        >
                                            <Twitter className="w-6 h-6" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-16 bg-[#e6f3eb] rounded-lg p-8 shadow-lg text-center">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-4">Join Our Editorial Board</h2>
                        <p className="text-xl text-[#18652c] mb-6">
                            We are always looking for experienced researchers and academics to join our editorial board. If you're
                            interested in contributing to the MinSU Research Journal, please contact us.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-[#3fb65e] hover:bg-[#18652c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fb65e] transition duration-150"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
