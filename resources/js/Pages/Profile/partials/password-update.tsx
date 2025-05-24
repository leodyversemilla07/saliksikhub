import { useRef, FormEventHandler, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PasswordUpdate({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <div className={`max-w-3xl mx-auto ${className}`}>
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Update Password
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </div>

            <form onSubmit={updatePassword} className="space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="current_password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Password
                        </Label>
                        <div className="relative max-w-md">
                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                className="pr-12 h-11 w-full border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-colors"
                                placeholder="Enter your current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.current_password && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.current_password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                        </Label>
                        <div className="relative max-w-md">
                            <Input
                                id="password"
                                ref={passwordInput}
                                type={showNewPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pr-12 h-11 w-full border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-colors"
                                placeholder="Create new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm New Password
                        </Label>
                        <div className="relative max-w-md">
                            <Input
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="pr-12 h-11 w-full border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-colors"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-11 font-medium transition-colors"
                    >
                        {processing ? 'Updating...' : 'Update Password'}
                    </Button>

                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                            <Check className="h-4 w-4" />
                            <span className="text-sm">Password updated successfully!</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
