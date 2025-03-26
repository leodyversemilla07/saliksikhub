import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Header from '@/Components/landing-pages/Header';
import Hero from '@/Components/landing-pages/Hero';
import Features from '@/Components/landing-pages/Features';
import FeaturedResearch from '@/Components/landing-pages/FeaturedResearch';
import ForAuthors from '@/Components/landing-pages/ForAuthors';
import Cta from '@/Components/landing-pages/Cta';
import Footer from '@/Components/landing-pages/Footer';
import LatestArticles from '@/Components/landing-pages/LatestArticles';
import CallForPapers from '@/Components/landing-pages/CallForPapers';

export default function Home({ auth }: PageProps) {
    return (
        <>
            <Head title="MinSU Research Journal - Advancing Knowledge Through Research" />
            <Header auth={auth} />
            <main className="flex-grow bg-white">
                {/* Hero section takes full width */}
                <Hero />
                
                {/* Content sections with responsive padding and spacing */}
                <div className="py-8 sm:py-12 md:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-12 sm:space-y-16 md:space-y-20">
                            <LatestArticles />
                            <Features />
                            <FeaturedResearch />
                            <CallForPapers />
                            <ForAuthors />
                        </div>
                    </div>
                </div>
                
                <Cta />
            </main>
            <Footer />
        </>
    );
}
