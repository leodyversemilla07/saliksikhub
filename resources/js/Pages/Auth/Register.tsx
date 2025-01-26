import { useState, FormEventHandler } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        firstname: '',
        lastname: '',
        email: '',
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
            <Head title="Register" />
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
                            <h2 className="text-2xl font-semibold text-gray-900">Register</h2>
                            <p className="text-sm text-gray-600">
                                Join MinSU's research community
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#18652C] mb-2">
                                            First Name
                                        </label>
                                        <TextInput
                                            id="firstname"
                                            type="text"
                                            name="firstname"
                                            placeholder="John"
                                            value={data.firstname}
                                            className={`w-full px-4 py-3 border ${errors.firstname ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-[#18652C] focus:border-[#18652C] transition-colors`}
                                            onChange={(e) => setData('firstname', e.target.value)}
                                            required
                                            autoFocus
                                        />
                                        <InputError message={errors.firstname} className="mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#18652C] mb-2">
                                            Last Name
                                        </label>
                                        <TextInput
                                            id="lastname"
                                            type="text"
                                            name="lastname"
                                            placeholder="Doe"
                                            value={data.lastname}
                                            className={`w-full px-4 py-3 border ${errors.lastname ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-[#18652C] focus:border-[#18652C] transition-colors`}
                                            onChange={(e) => setData('lastname', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.lastname} className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#18652C] mb-2">
                                        Email Address
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

                                <div>
                                    <label className="block text-sm font-medium text-[#18652C] mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            id="password_confirmation"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                            value={data.password_confirmation}
                                            className={`w-full px-4 py-3 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-[#18652C] focus:border-[#18652C] pr-12 transition-colors`}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
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
                                    <InputError message={errors.password_confirmation} className="mt-1" />
                                </div>

                                <div className="flex items-start">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <Checkbox
                                            id="agreesToTerms"
                                            checked={data.agreesToTerms}
                                            onChange={(e) => setData('agreesToTerms', e.target.checked)}
                                            className="text-[#18652C] focus:ring-[#18652C]"
                                        />
                                        <span className="text-sm text-gray-600">
                                            I agree to the{' '}
                                            <Link href="/terms" className="text-[#18652C] hover:text-[#3FB65E]">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link href="/privacy" className="text-[#18652C] hover:text-[#3FB65E]">
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </label>
                                    <InputError message={errors.agreesToTerms} className="mt-1" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-3 rounded-lg transition-colors duration-200"
                                disabled={processing}
                            >
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <p className="text-sm text-center text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    href={route('login')}
                                    className="font-medium text-[#18652C] hover:text-[#3FB65E] transition-colors"
                                >
                                    Login
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
            </div >
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