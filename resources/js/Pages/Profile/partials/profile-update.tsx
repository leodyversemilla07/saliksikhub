import { useState, FormEventHandler } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    affiliation: string;
    avatar_url?: string;
    email_verified_at?: string;
    role: string;
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
    };
}

export default function ProfileUpdate({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar_url || null
    );

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            email: user.email || '',
            affiliation: user.affiliation || '',
            avatar: null as File | null,
            _method: 'patch',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            onSuccess: (page) => {
                // Update avatar preview with new user data
                const updatedUser = page.props.auth.user as User;
                setAvatarPreview(updatedUser.avatar_url || null);
                // Reset form avatar field
                setData('avatar', null);
            }
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Profile Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Update your basic account information and profile settings.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-8">
                {/* Avatar Section */}
                <div className="flex items-start space-x-6 pb-8 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="User avatar"
                                    className="h-full w-full object-cover"
                                    onError={() => {
                                        console.log('Image failed to load:', avatarPreview);
                                        setAvatarPreview(null);
                                    }}
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-xl font-semibold text-gray-500 dark:text-gray-400">
                                    {((data.firstname as string)?.[0] || '?').toUpperCase()}{((data.lastname as string)?.[0] || '?').toUpperCase()}
                                </div>
                            )}
                        </div>
                        <label htmlFor="avatar" className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 p-2 rounded-full border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                            <Upload className="h-4 w-4 text-gray-500" />
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            Profile Photo
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Update your profile picture. JPG or PNG, max 2MB.
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Recommended size: 400x400 pixels
                        </p>
                    </div>
                </div>
                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                First Name
                            </Label>
                            <Input
                                id="firstname"
                                type="text"
                                value={data.firstname as string}
                                onChange={(e) => setData('firstname', e.target.value)}
                                className="h-11 w-full max-w-xs border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-colors"
                                placeholder="First name"
                            />
                            {errors.firstname && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.firstname}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Last Name
                            </Label>
                            <Input
                                id="lastname"
                                type="text"
                                value={data.lastname as string}
                                onChange={(e) => setData('lastname', e.target.value)}
                                className="h-11 w-full max-w-xs border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-colors"
                                placeholder="Last name"
                            />
                            {errors.lastname && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.lastname}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email as string}
                            onChange={(e) => setData('email', e.target.value)}
                            className="h-11 w-full max-w-md border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-colors"
                            placeholder="email@example.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="affiliation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Affiliation
                        </Label>
                        <Input
                            id="affiliation"
                            type="text"
                            value={data.affiliation as string}
                            onChange={(e) => setData('affiliation', e.target.value)}
                            className="h-11 w-full max-w-lg border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-colors"
                            placeholder="Organization or institution"
                        />
                        {errors.affiliation && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.affiliation}</p>
                        )}
                    </div>
                </div>

                {status === 'profile-updated' && (
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <AlertDescription className="text-green-800 dark:text-green-200 text-sm">
                            Your profile has been updated successfully.
                        </AlertDescription>
                    </Alert>
                )}

                {mustVerifyEmail && user.email_verified_at === null && (
                    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                        <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                            Your email address is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline hover:no-underline font-medium"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </AlertDescription>
                    </Alert>
                )}

                {status === 'verification-link-sent' && (
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <AlertDescription className="text-green-800 dark:text-green-200 text-sm">
                            A new verification link has been sent to your email address.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 h-11 px-8 font-medium transition-colors"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>

                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                            <Check className="h-4 w-4" />
                            <span>Saved successfully</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
