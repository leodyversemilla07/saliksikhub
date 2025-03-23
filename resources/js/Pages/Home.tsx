import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Header from '@/Components/landing-pages/Header';
import Hero from '@/Components/landing-pages/Hero';
import Features from '@/Components/landing-pages/Features';
import FeaturedResearch from '@/Components/landing-pages/FeaturedResearch';
import ForAuthors from '@/Components/landing-pages/ForAuthors';
import Cta from '@/Components/landing-pages/Cta';
import Footer from '@/Components/landing-pages/Footer';

export default function Home({ auth }: PageProps) {
    return (
        <>
            <Head title="Home" />
            <Header auth={auth} />
            <main className="flex-grow bg-white">
                <Hero />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Features />
                    <FeaturedResearch />
                    <ForAuthors />
                </div>
                <Cta />
            </main>
            <Footer />
        </>
    );
}
