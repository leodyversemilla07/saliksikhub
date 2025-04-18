import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Header from '@/components/landing-pages/site-header';
import Hero from '@/components/landing-pages/hero-section';
import Features from '@/components/landing-pages/features';
import FeaturedResearch from '@/components/landing-pages/featured-research';
import ForAuthors from '@/components/landing-pages/for-authors';
import Cta from '@/components/landing-pages/call-to-action';
import Footer from '@/components/landing-pages/site-footer';
import LatestArticles from '@/components/landing-pages/latest-articles';
import CallForPapers from '@/components/landing-pages/call-for-papers';

export default function Home({ auth }: PageProps) {
    return (
        <>
            <Head title="MinSU Research Journal - Advancing Knowledge Through Research" />
            <Header auth={auth} />
            <main className="flex-grow bg-white">
                <Hero />
                
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
