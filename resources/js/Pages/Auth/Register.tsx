import { useState, FormEventHandler } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/Button';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
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
        <GuestLayout title="Create Account">
            <div className="bg-gradient-to-br from-[#f0f8f3] to-white p-4 mb-6 rounded-lg">
                <div className="text-center">
                    <h2 className="text-[#18652c] text-lg font-bold">Join MinSU Research Journal</h2>
                    <p className="text-[#18652c]/80 text-sm mt-1">Create your account to get started</p>
                </div>
            </div>
            
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-[#18652c] mb-1">
                            First Name
                        </label>
                        <TextInput
                            id="firstname"
                            type="text"
                            name="firstname"
                            placeholder="John"
                            value={data.firstname}
                            className={`w-full px-3 py-2 border ${errors.firstname ? 'border-red-500' : 'border-gray-300'} rounded-lg text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                            onChange={(e) => setData('firstname', e.target.value)}
                            required
                            autoFocus
                        />
                        <InputError message={errors.firstname} className="mt-1 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#18652c] mb-1">
                            Last Name
                        </label>
                        <TextInput
                            id="lastname"
                            type="text"
                            name="lastname"
                            placeholder="Doe"
                            value={data.lastname}
                            className={`w-full px-3 py-2 border ${errors.lastname ? 'border-red-500' : 'border-gray-300'} rounded-lg text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                            onChange={(e) => setData('lastname', e.target.value)}
                            required
                        />
                        <InputError message={errors.lastname} className="mt-1 text-sm" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#18652c] mb-1">
                        Email Address
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
                    />
                    <InputError message={errors.email} className="mt-1 text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#18652c] mb-1">
                        Affiliation
                    </label>
                    <TextInput
                        id="affiliation"
                        type="text"
                        name="affiliation"
                        placeholder="MinSU Campus or Department"
                        value={data.affiliation}
                        className={`w-full px-3 py-2 border ${errors.affiliation ? 'border-red-500' : 'border-gray-300'} rounded-lg text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                        onChange={(e) => setData('affiliation', e.target.value)}
                        required
                    />
                    <InputError message={errors.affiliation} className="mt-1 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-[#18652c] mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter password"
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
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#18652c] mb-1">
                            Confirm
                        </label>
                        <div className="relative">
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                placeholder="Re-enter password"
                                value={data.password_confirmation}
                                className={`w-full px-3 py-2 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-lg pr-10 text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#18652c]"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1 text-sm" />
                    </div>
                </div>

                <div className="flex items-start mt-2">
                    <label className="flex items-start space-x-2 cursor-pointer">
                        <Checkbox
                            id="agreesToTerms"
                            checked={data.agreesToTerms}
                            onChange={(e) => setData('agreesToTerms', e.target.checked)}
                            className="mt-0.5 rounded text-[#3fb65e] focus:ring-[#3fb65e]"
                        />
                        <span className="text-sm text-[#18652c]/80">
                            I agree to the{' '}
                            <Link href="/terms" className="text-[#18652C] hover:text-[#3FB65E]">
                                Terms
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-[#18652C] hover:text-[#3FB65E]">
                                Privacy Policy
                            </Link>
                        </span>
                    </label>
                </div>
                <InputError message={errors.agreesToTerms} className="mt-1 text-sm" />

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
                            Creating Account...
                        </span>
                    ) : 'Create Account'}
                </Button>

                <div className="text-center mt-6">
                    <p className="text-sm text-[#18652c]/80">
                        Already have an account?{" "}
                        <Link
                            href={route('login')}
                            className="font-medium text-[#18652C] hover:text-[#3FB65E]"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}