import { useState, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, KeyRound, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/landing-pages/site-header';
import Footer from '@/components/landing-pages/site-footer';
import { PageProps } from '@/types';

export default function ResetPassword({
    token,
    email,
    auth
}: {
    token: string;
    email: string;
} & PageProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
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
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Create New Password</h1>
                            <p className="text-xl text-gray-600">
                                Enter your new password below to securely reset your account access.
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
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Reset Password</h2>
                                </div>

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
                                                className="w-full pl-10 rounded-md shadow-sm bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed"
                                                autoComplete="username"
                                                readOnly
                                            />
                                        </div>
                                        {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password
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
                                                className={`w-full pl-10 rounded-md shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20 ${
                                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                autoComplete="new-password"
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

                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                placeholder="••••••••"
                                                className={`w-full pl-10 rounded-md shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20 ${
                                                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#18652c]"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && <div className="mt-1 text-sm text-red-600">{errors.password_confirmation}</div>}
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] disabled:opacity-75 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Resetting Password...' : 'Reset Password'}
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
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Password Security Tips</h2>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-gray-600">
                                        Creating a strong password helps keep your account secure. Here are some guidelines to follow:
                                    </p>

                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 mt-1 mr-2">
                                                <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                            </div>
                                            <span>Use at least 8 characters, but longer is better</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 mt-1 mr-2">
                                                <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                            </div>
                                            <span>Include a mix of uppercase and lowercase letters</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 mt-1 mr-2">
                                                <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                            </div>
                                            <span>Add numbers and special characters (like !@#$%)</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 mt-1 mr-2">
                                                <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                            </div>
                                            <span>Avoid using personal information or common words</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 mt-1 mr-2">
                                                <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                            </div>
                                            <span>Use unique passwords for different accounts</span>
                                        </li>
                                    </ul>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
                                        <div className="flex items-center mb-4">
                                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                                            <h3 className="text-base font-semibold text-gray-800">After Resetting</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            After successfully resetting your password, you'll be automatically signed in to your account. 
                                            Make sure to update your password in any devices or applications where your account 
                                            credentials are saved.
                                        </p>
                                    </div>

                                    <div className="flex justify-center mt-6">
                                        <Link
                                            href={route('login')}
                                            className="text-sm text-[#18652c] hover:text-[#145024] font-medium focus:outline-none focus:underline"
                                        >
                                            Return to login page
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
