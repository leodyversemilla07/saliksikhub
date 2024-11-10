import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function About({ auth }: PageProps) {
    const journalName = "MinSU Research Journal";
    const logoUrl = "https://minsu.edu.ph/template/images/logo.png";

    return (
        <>
            <Head title="About Us" />

            <Header
                auth={auth}
                journalName={journalName}
                logoUrl={logoUrl}
            />

            <div className="max-w-screen-xl mx-auto px-0">
                <div className="flex-grow bg-white from-blue-50 to-white text-black p-8">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
                        <p className="text-lg text-gray-600">
                            Learn more about our mission, history, and the work we do.
                        </p>
                    </header>

                    {/* Journal Information */}
                    <section className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                            <p className="text-lg text-gray-600">
                                The MinSU Research Journal is dedicated to providing a platform for innovative research and academic excellence in the fields of science, technology, and social development. Our mission is to publish high-quality, peer-reviewed research that contributes to knowledge and drives positive change in society.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our History</h2>
                            <p className="text-lg text-gray-600">
                                Established in 2010, the MinSU Research Journal has been at the forefront of academic research, offering a diverse range of articles and papers from various disciplines. Our journal has grown steadily over the years and continues to provide an inclusive space for scholars to present their work and engage in meaningful discussions.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Values</h2>
                            <ul className="list-disc pl-6 text-lg text-gray-600">
                                <li>Commitment to Excellence in Research</li>
                                <li>Promoting Innovation and Academic Integrity</li>
                                <li>Collaboration and Engagement with Scholars Worldwide</li>
                                <li>Fostering Critical Thinking and Dialogue in Science and Humanities</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Editorial Board</h2>
                            <p className="text-lg text-gray-600">
                                Our editorial board is composed of renowned experts from various fields of research, ensuring the highest standards of academic rigor and integrity. The board evaluates all submissions to maintain the quality and credibility of the research published in our journal.
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            <Footer
                journalName={journalName}
            />
        </>
    );
}
