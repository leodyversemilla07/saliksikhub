import { useState, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '@/components/landing-pages/site-header';
import Footer from '@/components/landing-pages/site-footer';
import { PageProps } from '@/types';

export default function ConfirmPassword({ auth }: PageProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirm Password" />
            <Header auth={auth} />

            <main className="flex-grow bg-white">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Secure Area Access</h1>
                            <p className="text-xl text-gray-600">
                                This is a secure area of the application. Please confirm your password before continuing.
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
                                        <Lock className="h-6 w-6 text-[#18652c]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Password Confirmation</h2>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    For your security, please confirm your password to access this area of the journal platform.
                                </p>

                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
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
                                                onChange={(e) => setData('password', e.target.value)}
                                                autoFocus
                                                required
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

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] disabled:opacity-75 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Confirming...' : 'Confirm Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Information section */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-gradient-to-br from-gray-50 to-[#f0f8f3] rounded-xl border border-gray-200 p-8">
                                <div className="flex items-center mb-6">
                                    <Shield className="h-8 w-8 text-[#18652c]" />
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Account Security</h2>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-gray-600">
                                        The MinSU Research Journal platform requires password confirmation for sensitive
                                        areas to maintain the highest level of security for your account and research data.
                                    </p>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center mb-4">
                                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                                            <h3 className="text-base font-semibold text-gray-800">Why We Ask For This</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Password confirmation adds an extra layer of security for actions like:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-4 w-4 text-[#18652c]" />
                                                </div>
                                                <span>Accessing manuscript submission controls</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-4 w-4 text-[#18652c]" />
                                                </div>
                                                <span>Modifying account settings or permissions</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-4 w-4 text-[#18652c]" />
                                                </div>
                                                <span>Accessing reviewer tools and administration areas</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-4 w-4 text-[#18652c]" />
                                                </div>
                                                <span>Managing collaboration settings and permissions</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-[#18652c]/5 p-4 rounded-lg border border-[#18652c]/10 flex items-start">
                                        <div className="flex-shrink-0 mt-1 mr-3">
                                            <AlertCircle className="h-5 w-5 text-[#18652c]" />
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            For your security, this session will expire after a period of inactivity.
                                            You may be asked to confirm your password again after extended periods of inactivity.
                                        </p>
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
