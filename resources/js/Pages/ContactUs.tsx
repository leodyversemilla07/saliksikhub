import { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import Header from '@/Components/Header';
import { PageProps } from '@/types';
import Footer from '@/Components/Footer';
import { Head } from '@inertiajs/react';

export default function ContactUs({ auth }: PageProps) {
    const journalName = "MinSU Research Journal";
    const logoUrl = "https://minsu.edu.ph/template/images/logo.png";

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Process form submission (e.g., send to server or handle via API)
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <>
            <Head title="Contact Us" />

            <Header
                auth={auth}
                journalName={journalName}
                logoUrl={logoUrl}
            />
            <div className="max-w-4xl mx-auto p-6 my-10 bg-white rounded-lg shadow-md">


                <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Contact Us</h1>
                <p className="text-center text-gray-600 mb-12">
                    We’re here to answer any questions you have about our journal. Reach out to us through the form below, or contact us directly.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Details */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-green-700">Contact Information</h2>
                        <p className="text-gray-600">Feel free to reach us via the details below or by filling out the form.</p>
                        <div>
                            <h3 className="font-semibold text-gray-700">Email</h3>
                            <p className="text-gray-600">contact@researchjournal.com</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Phone</h3>
                            <p className="text-gray-600">+123 456 7890</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Address</h3>
                            <p className="text-gray-600">
                                123 Academic Street,<br />
                                Knowledge City, 45678
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="johndoe@example.com"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                            <Input
                                id="subject"
                                name="subject"
                                type="text"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="Subject"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                            <Textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Write your message here..."
                                rows={5}
                                className="w-full"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700">
                            Send Message
                        </Button>
                        {submitted && <p className="text-green-600 mt-4 text-center">Thank you for reaching out! We'll get back to you soon.</p>}
                    </form>
                </div>
            </div>
            <Footer
                journalName={journalName}
            />
        </>
    );
}
