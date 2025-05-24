import Header from '@/components/landing-pages/site-header';
import { PageProps } from '@/types';
import Footer from '@/components/landing-pages/site-footer';
import { Breadcrumb } from '@/components/breadcrumb';
import { Head } from '@inertiajs/react';

export default function ContactUs({ auth }: PageProps) {
    const breadcrumbItems = [
        { href: '/', label: 'Home' },
        { href: '', label: 'Contact Us' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Contact Us | Daluyang Dunong" />

            <Header auth={auth} />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb items={breadcrumbItems} />

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">Contact Us</h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">For inquiries, please use the contact details below.</p>

                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mailing Address</h2>
                                    <p className="text-gray-600 dark:text-gray-300">Mindoro State University, Main Campus, Victoria, Oriental Mindoro</p>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h2>
                                    <p className="text-gray-600 dark:text-gray-300">contact@ddmrj.minsu.edu.ph</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
