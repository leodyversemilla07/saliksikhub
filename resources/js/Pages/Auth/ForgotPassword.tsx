import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, AlertCircle, KeyRound, ArrowLeft, HelpCircle, CheckCircle } from 'lucide-react';
import Header from '@/Components/landing-pages/Header';
import Footer from '@/Components/landing-pages/Footer';
import { PageProps } from '@/types';

export default function ForgotPassword({ status, auth }: { status?: string } & PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Reset Password" />
            <Header auth={auth} />

            <main className="flex-grow bg-white">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Reset Your Password</h1>
                            <p className="text-xl text-gray-600">
                                Forgot your password? No problem. Enter your email address and we'll send you a password 
                                reset link to get you back into your account.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Form section */}
                        <div className="w-full lg:w-1/2 max-w-md mx-auto">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-[#18652c]/10 rounded-md">
                                        <KeyRound className="h-6 w-6 text-[#18652c]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Password Recovery</h2>
                                </div>
                                
                                {status && (
                                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
                                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                        <div>{status}</div>
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                placeholder="your.email@example.com"
                                                className={`w-full pl-10 rounded-md shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20 ${
                                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                        {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                                    </div>

                                    <div className="flex flex-col space-y-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] disabled:opacity-75 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Sending...' : 'Email Password Reset Link'}
                                        </button>
                                        
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center text-sm text-[#18652c] hover:text-[#145024] font-medium focus:outline-none focus:underline"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-1" />
                                            Back to login
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Information section */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-gradient-to-br from-gray-50 to-[#f0f8f3] rounded-xl border border-gray-200 p-8">
                                <div className="flex items-center mb-6">
                                    <HelpCircle className="h-8 w-8 text-[#18652c]" />
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Password Recovery Help</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">How It Works</h3>
                                        <p className="text-gray-600 mb-4">
                                            Password recovery is a quick and secure process:
                                        </p>
                                        <ul className="space-y-3 text-gray-600">
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Enter your registered email address</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Receive a password reset link via email</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Click the link and create a new secure password</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Log in with your new password</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-white p-5 rounded-lg border border-gray-200">
                                        <div className="flex items-center mb-3">
                                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                                            <h3 className="text-base font-semibold text-gray-800">Important Note</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            The password reset link is valid for 60 minutes and can be used only once. 
                                            If you don't receive an email within a few minutes, please check your spam folder.
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Still Need Help?</h3>
                                        <p className="text-gray-600">
                                            If you're still having trouble accessing your account, please contact our support team.
                                        </p>
                                        <Link
                                            href={route('contact-us')}
                                            className="inline-flex items-center mt-3 text-[#18652c] hover:text-[#145024] font-medium"
                                        >
                                            Contact Support
                                            <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </>
    );
}
