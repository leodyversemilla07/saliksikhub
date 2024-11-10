import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function SubmissionGuidelines({ auth }: PageProps) {
    const journalName = "MinSU Research Journal";
    const logoUrl = "https://minsu.edu.ph/template/images/logo.png";

    return (
        <>
            <Head title="Submissions" />
            <Header
                auth={auth}
                journalName={journalName}
                logoUrl={logoUrl}
            />
            <div className="max-w-screen-lg mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Submission Guidelines</h1>

                <p className="text-gray-700 mb-4">
                    We welcome submissions from authors worldwide in the field of [insert research field]. To ensure a smooth submission process, please carefully review the following guidelines before submitting your manuscript.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Requirements</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>All manuscripts should be submitted in English.</li>
                        <li>Submissions must be original work and not under review elsewhere.</li>
                        <li>Ensure that your manuscript adheres to our formatting guidelines as detailed below.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Formatting Guidelines</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Manuscripts should be submitted in Word (.doc or .docx) or LaTeX (.tex) format.</li>
                        <li>Use a standard font like Times New Roman or Arial, size 12, and 1.5 line spacing.</li>
                        <li>Include an abstract of 150-250 words at the beginning of the manuscript.</li>
                        <li>References should follow the [Insert Preferred Style] format.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submission Process</h2>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                        <li>Create an account on our platform if you haven’t done so already.</li>
                        <li>Log in to your account and navigate to the "Submit Manuscript" section.</li>
                        <li>Fill in the required details about your manuscript, including title, authors, and abstract.</li>
                        <li>Upload your manuscript and any supplementary files.</li>
                        <li>Submit your manuscript. You will receive a confirmation email once the submission is complete.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Peer Review Process</h2>
                    <p className="text-gray-700">
                        Once submitted, your manuscript will undergo an initial assessment by our editorial team. If it passes the initial review, it will be sent to experts in the field for peer review. The review process may take several weeks, and you will be notified of the outcome as soon as a decision is made.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ethics and Disclosure</h2>
                    <p className="text-gray-700">
                        Authors are required to adhere to the highest ethical standards. Any conflicts of interest must be disclosed at the time of submission. Plagiarism, including self-plagiarism, is strictly prohibited and will result in rejection.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                        If you have any questions regarding the submission guidelines or the process, please contact us at
                        <Link href="/contact-us" className="text-green-600 hover:underline"> Contact Us</Link>.
                    </p>
                </section>

                <div className="mt-8">
                    <Link href="/submit" className="inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                        Submit Your Manuscript
                    </Link>
                </div>
            </div>
            <Footer
                journalName={journalName}
            />
        </>
    );
}
