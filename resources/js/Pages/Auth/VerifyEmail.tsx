import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Shield, AlertCircle, Clock, CheckCircle, LogOut, RefreshCw } from 'lucide-react';
import Header from '@/Components/landing-pages/Header';
import Footer from '@/Components/landing-pages/Footer';
import { PageProps } from '@/types';

export default function VerifyEmail({ status, auth }: { status?: string } & PageProps) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Verify Email" />
            <Header auth={auth} />

            <main className="flex-grow bg-white">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Verify Your Email Address</h1>
                            <p className="text-xl text-gray-600">
                                Thanks for signing up! Before getting started, we need to confirm your email address.
                                Please check your inbox and click on the verification link we just sent you.
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
                                        <Mail className="h-6 w-6 text-[#18652c]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Email Verification</h2>
                                </div>
                                
                                {status === 'verification-link-sent' && (
                                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
                                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                        <div>A new verification link has been sent to your email address.</div>
                                    </div>
                                )}

                                <p className="text-gray-600 mb-6">
                                    If you didn't receive the email, we'll be happy to send you another. 
                                    Please also check your spam folder as verification emails sometimes end up there.
                                </p>

                                <form onSubmit={submit} className="space-y-4">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] disabled:opacity-75 disabled:cursor-not-allowed"
                                        disabled={processing}
                                    >
                                        <RefreshCw className={`h-5 w-5 mr-2 ${processing ? 'animate-spin' : ''}`} />
                                        {processing ? 'Sending...' : 'Resend Verification Email'}
                                    </button>
                                    
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c]"
                                    >
                                        <LogOut className="h-5 w-5 mr-2" />
                                        Log Out
                                    </Link>
                                </form>
                            </div>
                        </div>

                        {/* Information section */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-gradient-to-br from-gray-50 to-[#f0f8f3] rounded-xl border border-gray-200 p-8">
                                <div className="flex items-center mb-6">
                                    <Shield className="h-8 w-8 text-[#18652c]" />
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Why Verify Your Email?</h2>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-gray-600">
                                        Email verification helps us ensure account security and maintain the integrity of our 
                                        academic community. Here's what you can do after verification:
                                    </p>

                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                            </div>
                                            <span>Submit manuscripts for publication consideration</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                            </div>
                                            <span>Access special content exclusive to verified members</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                            </div>
                                            <span>Participate in the peer review process</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                            </div>
                                            <span>Receive notifications about relevant publications</span>
                                        </li>
                                    </ul>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
                                        <div className="flex items-center mb-4">
                                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                                            <h3 className="text-base font-semibold text-gray-800">Verification Tips</h3>
                                        </div>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            <li className="flex items-start">
                                                <Clock className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                                <span>Verification emails typically arrive within 5 minutes</span>
                                            </li>
                                            <li className="flex items-start">
                                                <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                                <span>Check your spam or junk folder if you don't see the email</span>
                                            </li>
                                            <li className="flex items-start">
                                                <Mail className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                                <span>Make sure your email address was entered correctly</span>
                                            </li>
                                        </ul>
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
