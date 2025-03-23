import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/Button';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout title="Forgot Password">
            <div className="bg-gradient-to-br from-[#f0f8f3] to-white p-4 mb-6 rounded-lg">
                <div className="text-center">
                    <h2 className="text-[#18652c] text-lg font-bold">Reset Your Password</h2>
                    <p className="text-[#18652c]/80 text-sm mt-1">
                        Enter your email and we'll send you a password reset link
                    </p>
                </div>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 text-center bg-green-50 p-3 rounded-lg border border-green-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
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
                        autoFocus
                    />
                    <InputError message={errors.email} className="mt-1 text-sm" />
                </div>

                <div className="pt-2 space-y-4">
                    <Button
                        type="submit"
                        fullWidth
                        disabled={processing}
                        className="py-2.5 text-base bg-[#3fb65e] hover:bg-[#18652c] rounded-lg transition-colors duration-300"
                    >
                        {processing ? 'Sending...' : 'Send Reset Link'}
                    </Button>

                    <Link
                        href={route('login')}
                        className="block text-center text-sm text-[#18652C] hover:text-[#3FB65E] mt-6"
                    >
                        Back to login
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
