import { useState, FormEventHandler } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { User, Mail, Upload, Check, Briefcase, Shield } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription } from '@/Components/ui/alert';

// Function to map database roles to display format
const getRoleDisplay = (role: string): string => {
    switch (role.toLowerCase()) {
        case 'author':
            return 'Author | Researcher';
        case 'editor':
            return 'Editor | Administrator';
        default:
            return role || 'User';
    }
};

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            affiliation: user.affiliation,
            avatar: null as File | null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onload = (e) => setAvatarPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 border-4 border-white dark:border-gray-800 shadow-md">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="User avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-4xl font-medium text-green-600 dark:text-green-300">
                                    {data.firstname[0]}{data.lastname[0]}
                                </div>
                            )}
                        </div>

                        <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <Upload className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Upload a profile picture<br />(JPG, PNG, max 2MB)
                    </p>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname" className="text-gray-700 dark:text-gray-300">
                                        First Name
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <Input
                                            id="firstname"
                                            type="text"
                                            value={data.firstname}
                                            onChange={(e) => setData('firstname', e.target.value)}
                                            className="pl-10"
                                            placeholder="Your first name"
                                        />
                                    </div>
                                    {errors.firstname && (
                                        <p className="text-sm text-red-500">{errors.firstname}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastname" className="text-gray-700 dark:text-gray-300">
                                        Last Name
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <Input
                                            id="lastname"
                                            type="text"
                                            value={data.lastname}
                                            onChange={(e) => setData('lastname', e.target.value)}
                                            className="pl-10"
                                            placeholder="Your last name"
                                        />
                                    </div>
                                    {errors.lastname && (
                                        <p className="text-sm text-red-500">{errors.lastname}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="pl-10"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="affiliation" className="text-gray-700 dark:text-gray-300">
                                    Affiliation
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        id="affiliation"
                                        type="text"
                                        value={data.affiliation}
                                        onChange={(e) => setData('affiliation', e.target.value)}
                                        className="pl-10"
                                        placeholder="Your organization or institution"
                                    />
                                </div>
                                {errors.affiliation && (
                                    <p className="text-sm text-red-500">{errors.affiliation}</p>
                                )}
                            </div>

                            {/* Role Display */}
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300">
                                    Role
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Shield className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="pl-10 py-2 bg-gray-50 dark:bg-gray-800 border rounded-md border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300">
                                        {getRoleDisplay(user.role)}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Your system role determines what you can access
                                </p>
                            </div>
                        </div>

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <Alert variant="destructive" className="mt-4 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700">
                                <AlertDescription className="text-amber-800 dark:text-amber-300">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="underline text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                                    >
                                        Click here to re-send the verification email.
                                    </Link>
                                </AlertDescription>
                            </Alert>
                        )}

                        {status === 'verification-link-sent' && (
                            <Alert className="mt-4 bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700">
                                <AlertDescription className="text-green-800 dark:text-green-300">
                                    A new verification link has been sent to your email address.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white"
                            >
                                Save Changes
                            </Button>

                            {recentlySuccessful && (
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                                    <Check className="h-4 w-4" />
                                    Saved successfully
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
