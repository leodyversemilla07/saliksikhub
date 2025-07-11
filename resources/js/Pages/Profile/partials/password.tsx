import { useRef, useState, FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PasswordUpdate() {
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
        <div className="max-w-xl bg-card p-4 space-y-4">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-foreground">
                    Update Password
                </h2>
                <p className="text-sm text-muted-foreground">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </div>

            <form onSubmit={updatePassword} className="space-y-3">
                {/* Current Password */}
                <div className="space-y-2">
                    <Label htmlFor="current_password" className="text-sm font-medium">
                        Current Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            className="pr-10"
                            placeholder="Enter your current password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.current_password && (
                        <p className="text-sm text-destructive">{errors.current_password}</p>
                    )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                        New Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            ref={passwordInput}
                            type={showNewPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="pr-10"
                            placeholder="Enter a new password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="text-sm font-medium">
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="pr-10"
                            placeholder="Confirm your new password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                Updating...
                            </span>) : (
                            <span>
                                Update Password
                            </span>
                        )}
                    </Button>

                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm">Password updated successfully.</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
