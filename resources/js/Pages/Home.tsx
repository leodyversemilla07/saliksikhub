import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Hero from '@/Components/Hero';
import Features from '@/Components/Features';
import FeaturedResearch from '@/Components/FeaturedResearch';
import ForAuthors from '@/Components/ForAuthors';
import Cta from '@/Components/Cta';
import Footer from '@/Components/Footer';

export default function Home({ auth }: PageProps) {
    return (
        <>
            <Head title="Home" />
            <Header auth={auth} />
            <main className="flex-grow">
                <Hero />
                <Features />
                <FeaturedResearch />
                <ForAuthors />
                <Cta />
            </main >
            <Footer />
        </>
    );
}
