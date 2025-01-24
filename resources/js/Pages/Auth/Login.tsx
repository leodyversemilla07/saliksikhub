import { Eye, EyeOff, Globe } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [generalError, setGeneralError] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setGeneralError(null); // Clear previous general errors

        post(route('login'), {
            onError: (error) => {
                // Handle unexpected server-side errors
                if (typeof error === 'string') {
                    setGeneralError(error);
                }
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 bg-gradient-to-br from-blue-50 to-white text-black">
            <Head title="Log in" />

            {/* Header */}
            <header className="flex justify-between items-center p-6 w-full max-w-6xl bg-white rounded-xl shadow-xl mb-12">
                <div className="flex items-center gap-4">
                    <ApplicationLogo className="w-10 h-10" />
                    <span className="text-2xl font-bold text-gray-800">MinSU Research Journal</span>
                </div>
                <div className="flex gap-4">
                    <Globe className="w-6 h-6 text-gray-600" />
                    <div className="w-6 h-6 text-gray-600 cursor-pointer">?</div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-6xl">
                <div className="w-full md:w-1/2">
                    <div className="bg-white p-8 rounded-3xl shadow-lg">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome back 👋</h2>
                        <p className="text-gray-600 mb-8">Log in to your account</p>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
                        )}

                        {/* General Error Message */}
                        {generalError && (
                            <div className="mb-4 text-sm font-medium text-red-600">{generalError}</div>
                        )}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setGeneralError(null); // Clear general errors
                                post(route('login'), {
                                    onError: (errors) => {
                                        // Handle field-specific errors or general errors
                                        if (errors.email || errors.password) {
                                            const firstErrorField = document.querySelector(
                                                errors.email ? "#email" : "#password"
                                            ) as HTMLInputElement;
                                            firstErrorField?.focus();
                                        } else if (typeof errors === "string") {
                                            setGeneralError(errors); // Handle unexpected general errors
                                        }
                                    },
                                    onFinish: () => reset('password'),
                                });
                            }}
                        >
                            {/* Email Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="johndoe@example.com"
                                    value={data.email}
                                    className={`w-full p-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                    autoComplete="username"
                                    onChange={(e) => {
                                        setData('email', e.target.value);
                                    }}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Input */}
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter at least 8+ characters"
                                        value={data.password}
                                        className={`w-full p-3 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                                        autoComplete="new-password"
                                        onChange={(e) => {
                                            setData('password', e.target.value);
                                        }}
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me and forgot password */}
                            <div className="flex justify-between items-center mb-6">
                                <label className="flex items-center gap-2">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`w-full py-3 ${processing ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'
                                    } text-white rounded-lg font-semibold text-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-300`}
                                disabled={processing}
                            >
                                {processing ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="text-green-500 hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center mt-16 text-gray-600">
                <p>&copy; 2024 MinSU Research Journal. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
