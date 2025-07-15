import { useState, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Breadcrumb from '@/components/breadcrumb';
import Header from '@/components/site-header';
import Footer from '@/components/site-footer';
import { PageProps } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'lucide-react';

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

    const breadcrumbItems = [
        { label: 'Home', href: route('home') },
        { label: 'Reset Password' }
    ];

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
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Reset Password | Daluyang Dunong" />
            <Header auth={auth} />

            <main className="flex-grow bg-gray-100 dark:bg-gray-900 flex items-center justify-center pt-12 pb-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mb-8 text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                            Reset Password
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Required fields are marked with an asterisk (*).
                        </p>
                    </div>
                    <form onSubmit={submit} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                className="w-96 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed rounded-md"
                                readOnly
                            />
                            {errors.email && <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">New Password *</Label>
                            <div className="relative w-96">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    className={`w-full pr-10 border-gray-300 dark:border-gray-600 focus:border-[#18652c] focus:ring-[#18652c] dark:focus:border-[#3fb65e] dark:focus:ring-[#3fb65e] rounded-md dark:bg-gray-700 dark:text-white ${errors.password ? 'border-red-500 dark:border-red-400' : ''}`}
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoFocus
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-red-500 dark:text-red-400">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-gray-700 dark:text-gray-300">Confirm New Password *</Label>
                            <div className="relative w-96">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    className={`w-full pr-10 border-gray-300 dark:border-gray-600 focus:border-[#18652c] focus:ring-[#18652c] dark:focus:border-[#3fb65e] dark:focus:ring-[#3fb65e] rounded-md dark:bg-gray-700 dark:text-white ${errors.password_confirmation ? 'border-red-500 dark:border-red-400' : ''}`}
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-sm text-red-500 dark:text-red-400">{errors.password_confirmation}</p>}
                        </div>

                        <Button type="submit" className="w-auto bg-[#18652c] hover:bg-[#18652c]/90 text-white" disabled={processing}>
                            {processing ? 'Processing...' : 'Reset Password'}
                        </Button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
