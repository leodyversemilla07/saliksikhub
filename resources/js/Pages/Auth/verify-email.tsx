import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle, LogOut, RefreshCw } from 'lucide-react';
import { Breadcrumb } from '@/components/breadcrumb';
import Header from '@/components/landing-pages/site-header';
import Footer from '@/components/landing-pages/site-footer';
import { PageProps } from '@/types';
import { Button } from "@/components/ui/button";

export default function VerifyEmail({ status, auth }: { status?: string } & PageProps) {
    const breadcrumbItems = [
        { label: 'Home', href: route('home') },
        { label: 'Login', href: route('login') },
        { label: 'Verify Email' }
    ];

    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Verify Email | Daluyang Dunong" />
            <Header auth={auth} />

            <main className="flex-grow bg-gray-100 dark:bg-gray-900 flex items-center justify-center pt-12 pb-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mb-8 text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                            Verify Email Address
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Check your email and click the verification link.
                        </p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 flex items-start w-96">
                            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                            <div>Verification email sent.</div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6 text-left">
                        <Button
                            type="submit"
                            className="w-auto bg-[#18652c] hover:bg-[#18652c]/90 text-white"
                            disabled={processing}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${processing ? 'animate-spin' : ''}`} />
                            {processing ? 'Sending...' : 'Resend Verification Email'}
                        </Button>

                        <div className="pt-4">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="inline-flex items-center text-sm font-medium text-[#18652c] hover:text-[#145024] dark:text-[#3fb65e] dark:hover:text-[#52c773]"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Log Out
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
