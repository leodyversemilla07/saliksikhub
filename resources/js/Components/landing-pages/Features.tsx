import React from 'react';
import { Link } from '@inertiajs/react';
import { BookOpen, FileText, Award, BookCheck, Users, BarChart2 } from 'lucide-react';

const features = [
    {
        name: "Peer Review Process",
        description: "All submitted manuscripts undergo rigorous double-blind peer review by subject matter experts ensuring high-quality scholarly publications.",
        icon: BookCheck
    },
    {
        name: "Multidisciplinary Scope",
        description: "Publishing research across diverse fields including natural sciences, social sciences, humanities, engineering, and medical research.",
        icon: BookOpen
    },
    {
        name: "Impact & Citations",
        description: "Articles are indexed in major academic databases, with detailed metrics on citations, downloads, and scholarly impact.",
        icon: BarChart2
    },
    {
        name: "Editorial Excellence",
        description: "Managed by a diverse editorial board of distinguished scholars and researchers from prestigious institutions worldwide.",
        icon: Award
    },
    {
        name: "Global Readership",
        description: "Research published reaches scholars, researchers, policymakers, and practitioners across more than 30 countries.",
        icon: Users
    },
    {
        name: "Open Access Publishing",
        description: "All content is freely available online, increasing visibility and impact of research while maintaining author copyright.",
        icon: FileText
    },
];

export default function Features() {
    return (
        <section className="py-24 border-t border-gray-100">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Excellence & Standards</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                    MinSU Research Journal upholds the highest standards of scholarly publication,
                    supporting researchers in disseminating impactful knowledge.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
                {features.map((feature) => (
                    <div key={feature.name} className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-[#18652c]">
                                <feature.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                            <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <Link 
                    href={route('about-us')} 
                    className="inline-flex items-center text-[#18652c] hover:text-[#145024] font-medium"
                >
                    Learn more about our editorial policies and standards
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
