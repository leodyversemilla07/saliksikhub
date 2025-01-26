import { Eye, EyeOff } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
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
        <>
            <Head title="Log in" />
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8">
                    <div className="flex flex-col items-center space-y-4">
                        <Link href="/">
                            <ApplicationLogo className="w-20 h-20 object-contain" />
                        </Link>
                        <Link
                            href="/"
                            className="text-2xl font-bold text-[#18652C] text-center hover:text-[#3FB65E] transition-colors"
                        >
                            MinSU Research Journal
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
                            <p className="text-sm text-gray-600">
                                Please enter your login credentials
                            </p>
                            {status && (
                                <div className="mt-4 text-sm font-medium text-[#3FB65E]">
                                    {status}
                                </div>
                            )}
                        </div>

                        {generalError && (
                            <div className="p-3 bg-red-50 rounded-lg text-sm font-medium text-red-600 text-center">
                                {generalError}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-[#18652C] mb-2">
                                        Email address
                                    </label>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="doe.john@minsu.edu.ph"
                                        value={data.email}
                                        className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-[#18652C] focus:border-[#18652C] transition-colors`}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#18652C] mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            placeholder="••••••••"
                                            value={data.password}
                                            className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-[#18652C] focus:border-[#18652C] pr-12 transition-colors`}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#18652C] hover:text-[#3FB65E] transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <Checkbox
                                            id="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="text-[#18652C] focus:ring-[#18652C]"
                                        />
                                        <span className="text-sm text-gray-600">Remember me</span>
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-[#18652C] hover:text-[#3FB65E] transition-colors"
                                        >
                                            Forgot Password?
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-3 rounded-lg transition-colors duration-200"
                                disabled={processing}
                            >
                                {processing ? 'Logging in...' : 'Log In'}
                            </Button>
                        </form>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <p className="text-sm text-center text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    href={route('register')}
                                    className="font-medium text-[#18652C] hover:text-[#3FB65E] transition-colors"
                                >
                                    Register
                                </Link>
                            </p>

                            <div className="mt-6 text-center space-y-3">
                                <p className="text-xs text-gray-500">
                                    Need assistance? Contact{" "}
                                    <a
                                        href="mailto:contact@minsurj.online"
                                        className="font-medium text-[#18652C] hover:text-[#3FB65E] transition-colors"
                                    >
                                        support team
                                    </a>
                                </p>

                                <div className="flex justify-center gap-4 text-xs text-gray-500">
                                    <Link href="/terms" className="hover:text-[#3FB65E] transition-colors">
                                        Terms of Use
                                    </Link>
                                    <span className="text-[#3FB65E]" >|</span>
                                    <Link href="/privacy" className="hover:text-[#3FB65E] transition-colors">
                                        Privacy Policy
                                    </Link>
                                    <span className="text-[#3FB65E]" >|</span>
                                    <Link href="/copyright" className="hover:text-[#3FB65E] transition-colors">
                                        Copyright Notice
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const Button = ({
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={`bg-[#18652C] text-white font-semibold hover:bg-[#3FB65E] focus:outline-none focus:ring-2 focus:ring-[#18652C] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        {...props}
    >
        {children}
    </button>
);