import { useState, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, User, Mail, Building, Book, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { PageProps } from '@/types';
import Header from '@/components/landing-pages/site-header';
import Footer from '@/components/landing-pages/site-footer';

export default function Register({ auth }: PageProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<{
        firstname: string;
        lastname: string;
        email: string;
        affiliation: string;
        password: string;
        password_confirmation: string;
        agreesToTerms: boolean;
    }>({
        firstname: '',
        lastname: '',
        email: '',
        affiliation: '',
        password: '',
        password_confirmation: '',
        agreesToTerms: false
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create Account" />
            <Header auth={auth} />

            <main className="flex-grow bg-white">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Create Your Account</h1>
                            <p className="text-xl text-gray-600">
                                Join the MinSU Research Journal community to submit manuscripts, participate in peer reviews,
                                and access exclusive academic resources.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Registration form */}
                        <div className="w-full lg:w-1/2 max-w-xl mx-auto">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-[#18652c]/10 rounded-md">
                                        <User className="h-6 w-6 text-[#18652c]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Register</h2>
                                </div>

                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    id="firstname"
                                                    type="text"
                                                    name="firstname"
                                                    value={data.firstname}
                                                    placeholder="John"
                                                    className={`w-full pl-10 rounded-md shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20 ${
                                                        errors.firstname ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    onChange={(e) => setData('firstname', e.target.value)}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                            {errors.firstname && <div className="mt-1 text-sm text-red-600">{errors.firstname}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    id="lastname"
                                                    type="text"
                                                    name="lastname"
                                                    value={data.lastname}
                                                    placeholder="Doe"
                                                    className={`w-full pl-10 rounded-md shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20 ${
                                                        errors.lastname ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    onChange={(e) => setData('lastname', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {errors.lastname && <div className="mt-1 text-sm text-red-600">{errors.lastname}</div>}
                                        </div>
                                    </div>

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
                                            />
                                        </div>
                                        {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-1">
                                            Institutional Affiliation
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Building className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="affiliation"
                                                type="text"
                                                name="affiliation"
                                                value={data.affiliation}
                                                placeholder="University or Organization"
                                                className={`w-full pl-10 rounded-md shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20 ${
                                                    errors.affiliation ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                onChange={(e) => setData('affiliation', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.affiliation && <div className="mt-1 text-sm text-red-600">{errors.affiliation}</div>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                    className={`w-full pl-10 rounded-md shadow-sm focus:border-[#18652c] focus:ring focus:ring-[#18652c] focus:ring-opacity-20 ${
                                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    onChange={(e) => setData('password', e.target.value)}
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
                                                Confirm Password
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
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="agreesToTerms"
                                                name="agreesToTerms"
                                                type="checkbox"
                                                checked={data.agreesToTerms}
                                                onChange={(e) => setData('agreesToTerms', e.target.checked)}
                                                className="h-4 w-4 text-[#18652c] border-gray-300 rounded focus:ring-[#18652c]"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <label htmlFor="agreesToTerms" className="text-sm text-gray-600">
                                                I agree to the <Link href="/terms" className="text-[#18652c] hover:text-[#145024] font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-[#18652c] hover:text-[#145024] font-medium">Privacy Policy</Link>
                                            </label>
                                        </div>
                                    </div>
                                    {errors.agreesToTerms && <div className="mt-1 text-sm text-red-600">{errors.agreesToTerms}</div>}

                                    <div className="flex flex-col space-y-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-[#18652c] hover:bg-[#145024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652c] disabled:opacity-75 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating Account...
                                                </span>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </button>
                                        
                                        <div className="text-center">
                                            <span className="text-sm text-gray-600">Already have an account?</span>
                                            <Link
                                                href={route('login')}
                                                className="ml-1 text-sm text-[#18652c] hover:text-[#145024] font-medium focus:outline-none focus:underline"
                                            >
                                                Sign in
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
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Account Benefits</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Create an Account?</h3>
                                        <p className="text-gray-600 mb-4">
                                            Your MinSU Research Journal account gives you access to a variety of features
                                            designed to enhance your academic and research experience.
                                        </p>
                                        <ul className="space-y-3 text-gray-600">
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Submit manuscripts for publication consideration</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Participate as a peer reviewer in your area of expertise</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Access exclusive content and resources</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Receive updates on new publications and calls for papers</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Track your submissions and reviewer activities</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
                                        <div className="flex items-center mb-4">
                                            <AlertCircle className="h-6 w-6 text-[#18652c] mr-2" />
                                            <h3 className="text-base font-semibold text-gray-800">Account Verification</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            After creating your account, you'll receive a verification email to confirm your email address.
                                            Institutional email addresses (e.g., from universities or research organizations) are preferred
                                            and may expedite the verification process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white mt-6 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-800">Need help?</h3>
                                    <Link href={route('contact-us')} className="text-sm text-[#18652c] hover:text-[#145024] font-medium">
                                        Contact support
                                    </Link>
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