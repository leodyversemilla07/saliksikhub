import { Eye, EyeOff } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/Button';

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
        setGeneralError(null);

        post(route('login'), {
            onError: (errors) => {
                if (errors.email || errors.password) {
                    const firstErrorField = document.querySelector(
                        errors.email ? "#email" : "#password"
                    ) as HTMLInputElement;
                    firstErrorField?.focus();
                } else if (typeof errors === "string") {
                    setGeneralError(errors);
                }
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title="Sign In">
            <div className="bg-gradient-to-br from-[#f0f8f3] to-white p-4 mb-6 rounded-lg">
                <div className="text-center">
                    <h2 className="text-[#18652c] text-lg font-bold">Welcome Back</h2>
                    <p className="text-[#18652c]/80 text-sm mt-1">Sign in to your MinSU Research Journal account</p>
                </div>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-[#3FB65E] text-center bg-[#f0f8f3] p-3 rounded-lg">
                    {status}
                </div>
            )}

            {generalError && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg text-sm font-medium text-red-600 text-center">
                    {generalError}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#18652c] mb-1">
                        Email address
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your.email@minsu.edu.ph"
                        value={data.email}
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoFocus
                    />
                    <InputError message={errors.email} className="mt-1 text-sm" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-[#18652c]">
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-[#18652C] hover:text-[#3FB65E]"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            value={data.password}
                            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg pr-10 text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#18652c]"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1 text-sm" />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded text-[#3fb65e] focus:ring-[#3fb65e]"
                        />
                        <span className="text-sm text-[#18652c]/80">Remember me</span>
                    </label>
                </div>

                <Button
                    type="submit"
                    fullWidth
                    disabled={processing}
                    className="py-2.5 text-base mt-3 bg-[#3fb65e] hover:bg-[#18652c] rounded-lg transition-colors duration-300"
                >
                    {processing ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </span>
                    ) : 'Sign In'}
                </Button>

                <div className="text-center mt-6">
                    <p className="text-sm text-[#18652c]/80">
                        Don't have an account?{" "}
                        <Link
                            href={route('register')}
                            className="font-medium text-[#18652C] hover:text-[#3FB65E]"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}