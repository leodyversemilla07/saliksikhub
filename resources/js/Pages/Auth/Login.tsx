import { useEffect, FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/components/landing-pages/site-header';
import Footer from '@/components/landing-pages/site-footer';
import { Book, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { PageProps } from '@/types';

export default function Login({ status, canResetPassword, auth }: PageProps<{ status?: string, canResetPassword: boolean }>) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, [reset]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />
            <Header auth={auth} />

            <main className="flex-grow bg-white">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Sign In to Your Account</h1>
                            <p className="text-xl text-gray-600">
                                Access the MinSU Research Journal platform to manage your submissions,
                                review articles, or access exclusive content.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Login form */}
                        <div className="w-full lg:w-1/2 max-w-md mx-auto">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-[#18652c]/10 rounded-md">
                                        <Lock className="h-6 w-6 text-[#18652c]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Log in</h2>
                                </div>

                                {status && (
                                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
                                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                        <div>{status}</div>
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
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
                                                className={`w-full pl-10 rounded-md shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                autoComplete="username"
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                        </div>
                                        {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                            </label>
                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-sm text-[#18652c] hover:text-[#145024] focus:outline-none focus:underline font-medium"
                                                >
                                                    Forgot password?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                placeholder="••••••••"
                                                className={`w-full pl-10 rounded-md shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#18652c]"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.password && <div className="mt-1 text-sm text-red-600">{errors.password}</div>}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="remember_me"
                                            name="remember"
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="h-4 w-4 text-[#18652c] border-gray-300 rounded focus:ring-[#18652c]"
                                        />
                                        <label htmlFor="remember_me" className="ml-2 text-sm text-gray-600">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="flex flex-col space-y-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] disabled:opacity-75 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Logging in...' : 'Log in'}
                                        </button>

                                        <div className="text-center">
                                            <span className="text-sm text-gray-600">Don't have an account?</span>
                                            <Link
                                                href={route('register')}
                                                className="ml-1 text-sm text-[#18652c] hover:text-[#145024] font-medium focus:outline-none focus:underline"
                                            >
                                                Register now
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Information section */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-gradient-to-br from-gray-50 to-[#f0f8f3] rounded-xl border border-gray-200 p-8">
                                <div className="flex items-center mb-6">
                                    <Book className="h-8 w-8 text-[#18652c]" />
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Journal Access Benefits</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">For Authors</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Submit and track your manuscript submissions</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Respond to reviewer comments and revision requests</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Access submission history and publication metrics</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">For Reviewers</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Access manuscripts assigned for peer review</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Submit comprehensive evaluation reports</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Manage your reviewer profile and expertise areas</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">For Subscribers</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Access premium content and early releases</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Download full journal archives and special issues</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#18652c]/20 flex items-center justify-center mt-1 mr-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#18652c]"></div>
                                                </div>
                                                <span>Receive notifications about new publications</span>
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