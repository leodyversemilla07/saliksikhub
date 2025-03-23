import { useState, FormEventHandler } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/Button';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const [showPassword, setShowPassword] = useState(false);
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
        <GuestLayout title="Reset Password">
            <div className="bg-gradient-to-br from-[#f0f8f3] to-white p-4 mb-6 rounded-lg">
                <div className="text-[#18652c] text-sm font-medium text-center">
                    Create a new password for your account
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#18652c] mb-1">
                        Email Address
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        readOnly
                    />
                    <InputError message={errors.email} className="mt-1 text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#18652c] mb-1">
                        New Password
                    </label>
                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg pr-10 text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            autoFocus
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

                <div>
                    <label className="block text-sm font-medium text-[#18652c] mb-1">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <TextInput
                            id="password_confirmation"
                            type={showPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={`w-full px-3 py-2 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-lg pr-10 text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
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
                    <InputError message={errors.password_confirmation} className="mt-1 text-sm" />
                </div>

                <Button
                    type="submit"
                    fullWidth
                    disabled={processing}
                    className="py-2.5 text-base mt-3 bg-[#3fb65e] hover:bg-[#18652c] rounded-lg"
                >
                    {processing ? 'Resetting...' : 'Reset Password'}
                </Button>
            </form>
        </GuestLayout>
    );
}
