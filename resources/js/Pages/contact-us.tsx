import { useState } from 'react';
import Header from '@/components/landing-pages/site-header';
import { PageProps } from '@/types';
import Footer from '@/components/landing-pages/site-footer';
import { Head } from '@inertiajs/react';
import { 
    MapPin, Phone, Mail, CheckCircle, AlertCircle, Clock, 
    FileQuestion, User, FileText, Users, Building, ChevronDown
} from "lucide-react"

export default function ContactUs({ auth }: PageProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        inquiry: "general",
        institution: "",
        message: "",
    })
    const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle")
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
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
            setFormData({ 
                name: "", 
                email: "", 
                subject: "", 
                inquiry: "general", 
                institution: "", 
                message: "" 
            })
        } catch (error) {
            console.error("Error submitting form:", error)
            setFormStatus("error")
        }
    }

    const contactInfo = [
        { 
            icon: Mail, 
            title: "Email",
            items: [
                { label: "General Inquiries", value: "contact@minsu-journal.edu" },
                { label: "Submissions", value: "submissions@minsu-journal.edu" },
                { label: "Editorial Office", value: "editorial@minsu-journal.edu" }
            ]
        },
        { 
            icon: Phone, 
            title: "Phone",
            items: [
                { label: "Main Office", value: "+63 (123) 456-7890" },
                { label: "Editorial Department", value: "+63 (123) 456-7891" }
            ]
        },
        { 
            icon: MapPin, 
            title: "Address",
            items: [
                { 
                    label: "Physical Address", 
                    value: "Editorial Office, Research Building, Mindoro State University, Labasan, Bongabong, Oriental Mindoro, Philippines" 
                }
            ]
        },
        { 
            icon: Clock, 
            title: "Office Hours",
            items: [
                { label: "Monday - Friday", value: "8:00 AM - 5:00 PM" },
                { label: "Saturday", value: "9:00 AM - 12:00 PM" },
                { label: "Sunday", value: "Closed" }
            ]
        },
    ];

    const faqs = [
        {
            question: "What is the typical time frame for peer review?",
            answer: "Our peer review process typically takes 4-6 weeks from submission. After initial screening (1-2 weeks), manuscripts are sent to 2-3 expert reviewers in the field. Authors will be notified of the decision along with reviewer comments. The entire process from submission to publication usually takes 3-6 months depending on revisions required."
        },
        {
            question: "Does the journal charge publication fees?",
            answer: "MinSU Research Journal is an open access publication. We charge a modest Article Processing Charge (APC) of PHP 3,000 for accepted manuscripts to cover the costs of peer review management, journal production, and online hosting. Fee waivers may be available for authors from low-income countries or those with financial hardship."
        },
        {
            question: "How do I submit a manuscript for consideration?",
            answer: "Manuscripts should be submitted through our online submission system accessible via the 'Submit Manuscript' button on our website. Authors need to register for an account if they don't already have one. Please ensure your manuscript adheres to our formatting and submission guidelines before submission. For detailed instructions, visit our Submissions page."
        },
        {
            question: "What citation style does the journal use?",
            answer: "MinSU Research Journal requires all submissions to follow the American Psychological Association (APA) 7th edition style for citations and references. This applies to in-text citations, reference lists, tables, figures, and all other aspects of the manuscript that involve citations or attribution."
        },
        {
            question: "Can I suggest potential reviewers for my manuscript?",
            answer: "Yes, authors are welcome to suggest 3-5 potential reviewers when submitting their manuscript. Please provide their names, institutional affiliations, and email addresses. However, the final selection of reviewers remains at the discretion of the editors, and we cannot guarantee that suggested reviewers will be used."
        },
    ];

    return (
        <>
            <Head title="Contact Us | MinSU Research Journal" />
            <Header auth={auth} />
            <main className="bg-white min-h-screen">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Contact the Journal</h1>
                            <p className="text-xl text-gray-600">
                                Have questions about the submission process, editorial decisions, or general inquiries?
                                Our team is here to assist researchers and readers of MinSU Research Journal.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Contact Information Cards */}
                    <section className="mb-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((item, index) => (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-[#18652c]/10 rounded-md mr-3">
                                        <item.icon className="h-5 w-5 text-[#18652c]" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">{item.title}</h2>
                                </div>
                                <div className="space-y-3">
                                    {item.items.map((subItem, subIndex) => (
                                        <div key={subIndex}>
                                            <p className="text-sm font-medium text-gray-800">{subItem.label}</p>
                                            <p className="text-gray-600">{subItem.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Main Content */}
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                                    <Mail className="h-6 w-6 mr-2 text-[#18652c]" />
                                    Contact Form
                                </h2>
                                <p className="text-gray-600">
                                    Fill out the form below to get in touch with our editorial team or staff.
                                    We aim to respond to all inquiries within 2-3 business days.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name*
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address*
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="inquiry" className="block text-sm font-medium text-gray-700 mb-1">
                                        Type of Inquiry*
                                    </label>
                                    <select
                                        id="inquiry"
                                        name="inquiry"
                                        value={formData.inquiry}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20"
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="submission">Manuscript Submission</option>
                                        <option value="review">Review Process</option>
                                        <option value="editorial">Editorial Decision</option>
                                        <option value="technical">Technical Support</option>
                                        <option value="subscription">Subscription/Access</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject*
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                                        Institution/Organization
                                    </label>
                                    <input
                                        type="text"
                                        id="institution"
                                        name="institution"
                                        value={formData.institution}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Message*
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20"
                                    ></textarea>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] transition-colors duration-200"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>

                            {formStatus === "success" && (
                                <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Thank you for your message!</p>
                                        <p className="text-sm mt-1">Our team will respond to your inquiry soon.</p>
                                    </div>
                                </div>
                            )}

                            {formStatus === "error" && (
                                <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Unable to send your message</p>
                                        <p className="text-sm mt-1">Please try again later or contact us directly via email.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FAQs */}
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                                    <FileQuestion className="h-6 w-6 mr-2 text-[#18652c]" />
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-gray-600">
                                    Find answers to common questions about our journal, submission process, and publication policies.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                                    >
                                        <button 
                                            className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
                                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        >
                                            <span className="font-medium text-gray-900">{faq.question}</span>
                                            <ChevronDown 
                                                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                                                    expandedFaq === index ? 'transform rotate-180' : ''
                                                }`} 
                                            />
                                        </button>
                                        
                                        {expandedFaq === index && (
                                            <div className="p-5 pt-0 border-t border-gray-100">
                                                <p className="text-gray-700">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Additional Contact Info Card */}
                            <div className="mt-8 bg-gradient-to-br from-[#f8f9fa] to-[#f0f8f3] rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-[#18652c]" />
                                    Editorial Team
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex">
                                        <User className="h-5 w-5 text-[#18652c] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Dr. Maria Santos</p>
                                            <p className="text-sm text-gray-600">Editor-in-Chief</p>
                                            <a href="mailto:maria.santos@minsu.edu" className="text-sm text-[#18652c] hover:underline">maria.santos@minsu.edu</a>
                                        </div>
                                    </div>
                                    
                                    <div className="flex">
                                        <User className="h-5 w-5 text-[#18652c] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Dr. Roberto Tan</p>
                                            <p className="text-sm text-gray-600">Managing Editor</p>
                                            <a href="mailto:roberto.tan@minsu.edu" className="text-sm text-[#18652c] hover:underline">roberto.tan@minsu.edu</a>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <Building className="h-5 w-5 text-[#18652c] mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Journal Administration</p>
                                            <p className="text-sm text-gray-600">General administrative inquiries</p>
                                            <a href="mailto:admin@minsu-journal.edu" className="text-sm text-[#18652c] hover:underline">admin@minsu-journal.edu</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <section className="mt-16">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                                <MapPin className="h-6 w-6 mr-2 text-[#18652c]" />
                                Our Location
                            </h2>
                            <p className="text-gray-600">
                                MinSU Research Journal editorial office is located at the Mindoro State University's 
                                Bongabong Campus in Oriental Mindoro, Philippines.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2">
                                    <div className="rounded-lg overflow-hidden h-80 border border-gray-200">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3723.905224585279!2d121.4752374118361!3d12.771954440404688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sph!4v1737685843337!5m2!1sen!2sph"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen={true}
                                            loading="lazy"
                                            title="Mindoro State University Map"
                                        ></iframe>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Visiting Hours</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Monday - Friday</span>
                                            <span className="font-medium">8:00 AM - 5:00 PM</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Saturday</span>
                                            <span className="font-medium">9:00 AM - 12:00 PM</span>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <span className="text-gray-600">Sunday</span>
                                            <span className="font-medium">Closed</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Directions</h3>
                                        <p className="text-gray-600 text-sm">
                                            The editorial office is located on the second floor of the Research Building at the 
                                            main campus. Visitor parking is available in front of the administration building.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* CTA Section */}
                    <div className="mt-12 text-center py-12 px-6 bg-gradient-to-br from-[#18652c]/90 to-[#0f4b1e] rounded-xl text-white relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
                        
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold mb-4">Submit to MinSU Research Journal</h2>
                            <p className="text-green-100 mb-8">
                                We invite researchers to contribute to the scholarly discourse by submitting their original research 
                                to our peer-reviewed journal. Join our community of scholars advancing knowledge through published research.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a 
                                    href="#" 
                                    className="inline-flex items-center px-6 py-3 bg-white text-[#18652c] hover:bg-green-50 font-medium rounded-lg transition-colors"
                                >
                                    <FileText className="mr-2 h-5 w-5" />
                                    Submit Manuscript
                                </a>
                                <a 
                                    href="#" 
                                    className="inline-flex items-center px-6 py-3 border border-white bg-transparent hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                                >
                                    View Author Guidelines
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}