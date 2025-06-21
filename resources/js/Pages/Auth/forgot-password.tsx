import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumb } from '@/components/breadcrumb';
import Header from '@/components/site-header';
import Footer from '@/components/site-footer';
import { PageProps } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword({ status, auth }: { status?: string } & PageProps) {
    const breadcrumbItems = [
        { label: 'Home', href: route('home') },
        { label: 'Login', href: route('login') },
        { label: 'Reset Password' }
    ];

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Reset Password | Daluyang Dunong" />
            <Header auth={auth} />

            <main className="flex-grow bg-gray-100 dark:bg-gray-900 flex items-center justify-center pt-12 pb-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mb-8 text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                            Reset Your Password
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Required fields are marked with an asterisk (*).
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 w-96 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                className={`w-96 border-gray-300 dark:border-gray-600 focus:border-[#18652c] focus:ring-[#18652c] dark:focus:border-[#3fb65e] dark:focus:ring-[#3fb65e] rounded-md dark:bg-gray-700 dark:text-white ${errors.email ? 'border-red-500 dark:border-red-400' : ''}`}
                                placeholder="Enter your email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                            />
                            {errors.email && <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-auto bg-[#18652c] hover:bg-[#18652c]/90 text-white disabled:opacity-75"
                        >
                            {processing ? 'Sending...' : 'Email Password Reset Link'}
                        </Button>

                        <div className="mt-4">
                            <Link
                                href={route('login')}
                                className="inline-flex items-center text-sm text-[#18652c] hover:text-[#145024] dark:text-[#3fb65e] dark:hover:text-[#52c773] font-medium focus:outline-none focus:underline"
                            >
                                Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
