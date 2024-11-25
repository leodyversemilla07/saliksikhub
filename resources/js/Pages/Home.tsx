import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import HeroSection from '@/Components/HeroSection';
import FeaturedJournals from '@/Components/FeaturedJournals';
import About from '@/Components/About';
import Submissions from '@/Components/Submissions';
import CallsForPapers from '@/Components/CallForPapers';
import WhyPublish from '@/Components/WhyPublish';
import Footer from '@/Components/Footer';

export default function Welcome({ auth }: PageProps) {
    const journalName = "MinSU Research Journal";
    const logoUrl = "https://minsu.edu.ph/template/images/logo.png";
    const researchFocus = "agriculture";
    const backgroundImage = "https://minsu.edu.ph/slider/slides_1.jpg";

    const topJournals = [
        {
            title: 'Journal of Environmental Research',
            description: 'A leading journal in environmental studies.',
            link: '/journals/environmental-research'
        },
        {
            title: 'Health Sciences Review',
            description: 'Exploring the latest developments in healthcare.',
            link: '/journals/health-sciences'
        },
        {
            title: 'Technology and Innovation',
            description: 'Latest trends in technology and innovation.',
            link: '/journals/technology-innovation'
        }
    ];

    const latestArticles = [
        {
            title: 'The Future of Renewable Energy',
            abstract: 'This article explores advancements in renewable energy technologies.',
            link: '/articles/renewable-energy'
        },
        {
            title: 'Artificial Intelligence in Healthcare',
            abstract: 'Examining how AI is transforming healthcare systems.',
            link: '/articles/ai-healthcare'
        },
        {
            title: 'Sustainable Urban Development',
            abstract: 'Research on building sustainable cities for the future.',
            link: '/articles/sustainable-urban-development'
        }
    ];

    const categories = ['Environmental Science', 'Health & Medicine', 'Technology', 'Engineering', 'Social Sciences'];


    return (
        <>
            <Head title="Home" />

            <Header
                auth={auth}
                journalName={journalName}
                logoUrl={logoUrl}
            />
            <HeroSection
                journalName={journalName}
                researchFocus={researchFocus}
                backgroundImageUrl={backgroundImage}
            />
            <FeaturedJournals
                topJournals={topJournals}
                latestArticles={latestArticles}
                categories={categories}
            />
            <About
                mission="Our mission is to advance academic knowledge by providing a platform for innovative and impactful research."
                vision="Our vision is to foster collaboration between researchers, scholars, and practitioners in various disciplines."
                editorialBoard="Our editorial board consists of leading experts in the fields of science, technology, and humanities."
                scope="We accept research papers, reviews, and case studies in the areas of computer science, medicine, and engineering."
                impactFactor="2.5"
                indexingServices="Indexed in Scopus, Google Scholar, and Web of Science"
            />
            <Submissions
                authorInstructions="Authors must submit original research papers related to the journal's scope. All submissions should be in either Microsoft Word or LaTeX format. Manuscripts should be structured into sections: Abstract, Introduction, Methodology, Results, Discussion, and Conclusion. Please make sure that your submission adheres to the formatting guidelines provided on our website."
                submissionProcess="To submit your article, follow the process outlined below. Make sure all sections are completed before submitting your manuscript."
            />
            <CallsForPapers
                currentCalls={[
                    "Special Issue on Machine Learning in Healthcare",
                    "Research on Environmental Sustainability and Green Technologies",
                    "The Future of Quantum Computing in Computing Systems"
                ]}
                submissionDeadlines={[
                    "November 30, 2024 - Deadline for Special Issue on Machine Learning in Healthcare",
                    "December 15, 2024 - Deadline for Research on Environmental Sustainability",
                    "January 10, 2025 - Deadline for The Future of Quantum Computing"
                ]}
            />
            <WhyPublish
                benefits={[
                    "Rigorous peer-review process ensuring high-quality publications",
                    "Fast publishing with timely decisions and minimal delays",
                    "Open Access to promote wider dissemination of your research",
                    "Global readership from a wide range of academic and professional fields",
                    "Professional and supportive editorial team to guide you through every stage"
                ]}
                impactAndReach={[
                    "Indexed in leading academic databases like Google Scholar, PubMed, and Scopus",
                    "Promoted through social media channels with thousands of followers",
                    "Articles regularly cited in academic journals, conferences, and industry reports",
                    "Wide readership from over 100+ countries across diverse academic disciplines"
                ]}
                journalName={journalName}
            />
            <Footer
                journalName={journalName}
            />
        </>
    );
}
