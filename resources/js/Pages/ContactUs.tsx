import { useState } from 'react';
import Header from '@/Components/Header';
import { PageProps } from '@/types';
import Footer from '@/Components/Footer';
import { Head } from '@inertiajs/react';
import { MapPin, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react"


export default function ContactUs({ auth }: PageProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormStatus("idle")
        // Here you would typically send the form data to your server
        try {
            // Simulating an API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log("Form submitted:", formData)
            setFormStatus("success")
            setFormData({ name: "", email: "", subject: "", message: "" })
        } catch (error) {
            console.error("Error submitting form:", error)
            setFormStatus("error")
        }
    }

    const contactInfo = [
        { icon: MapPin, text: "Labasan, Bongabong, Oriental Mindoro, Philippines" },
        { icon: Phone, text: "+63 (123) 456-7890" },
        { icon: Mail, text: "contact@minsu-journal.edu" },
    ]

    return (
        <>
            <Head title="Contact Us" />
            <Header auth={auth} />
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-bold text-[#18652c] mb-8 text-center">Contact Us</h1>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-semibold text-[#18652c] mb-6">Get in Touch</h2>
                            <p className="text-[#18652c] mb-6">
                                We welcome your inquiries, feedback, and submissions. Please feel free to reach out to us using the
                                contact form or the information provided below.
                            </p>
                            <div className="space-y-4 mb-8">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <item.icon className="h-6 w-6 text-[#3fb65e] mr-2 mt-1 flex-shrink-0" />
                                        <span className="text-[#18652c]">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-[#f0f8f3] p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-[#18652c] mb-4">Office Hours</h3>
                                <ul className="space-y-2 text-[#18652c]">
                                    <li>Monday - Friday: 8:00 AM - 5:00 PM</li>
                                    <li>Saturday: 9:00 AM - 12:00 PM</li>
                                    <li>Sunday: Closed</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-semibold text-[#18652c] mb-6">Contact Form</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[#18652c]">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3fb65e] focus:ring focus:ring-[#3fb65e] focus:ring-opacity-50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#18652c]">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3fb65e] focus:ring focus:ring-[#3fb65e] focus:ring-opacity-50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-[#18652c]">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3fb65e] focus:ring focus:ring-[#3fb65e] focus:ring-opacity-50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-[#18652c]">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3fb65e] focus:ring focus:ring-[#3fb65e] focus:ring-opacity-50"
                                    ></textarea>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3fb65e] hover:bg-[#18652c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fb65e] transition duration-150"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                            {formStatus === "success" && (
                                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    <span>Thank you for your message. We will get back to you soon!</span>
                                </div>
                            )}
                            {formStatus === "error" && (
                                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    <span>An error occurred. Please try again later.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-3xl font-semibold text-[#18652c] mb-6">Our Location</h2>
                        <div className="bg-[#f0f8f3] p-6 rounded-lg shadow-md mb-6">
                            <p className="text-[#18652c] mb-4">
                                MinSU Research Journal is located at the heart of Mindoro State University's Bongabong Campus in Bongabong,
                                Oriental Mindoro. Our office is easily accessible and we welcome visitors during our office hours.
                            </p>
                            <p className="text-[#18652c]">
                                If you're planning to visit us, please feel free to use the map below for directions or contact us in
                                advance to schedule an appointment.
                            </p>
                        </div>
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3723.905224585279!2d121.4752374118361!3d12.771954440404688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sph!4v1737685843337!5m2!1sen!2sph"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}