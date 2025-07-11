import { useRef, useState, FormEventHandler } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Check, Mail, Camera, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

    const { data, setData, post, errors, processing } =
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
                // Show success toast
                toast.success('Profile updated successfully!');
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

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroy,
        processing: deletingProcessing,
        reset: deleteReset,
        errors: deleteErrors,
        clearErrors: clearDeleteErrors,
    } = useForm({
        password: '',
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => deleteReset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearDeleteErrors();
        deleteReset();
    };

    return (
        <div className="max-w-xl bg-card p-4 space-y-4">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-foreground">
                    Profile Information
                </h2>
                <p className="text-sm text-muted-foreground">
                    Update your basic account information and profile settings.
                </p>

                {/* User Role Badge */}
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    {user.email_verified_at && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Email Verified
                        </Badge>
                    )}
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Avatar Section */}
                <div className="bg-muted/50 rounded-lg p-4 border">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-muted border">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="User avatar"
                                        className="h-full w-full object-cover"
                                        onError={() => {
                                            setAvatarPreview(null);
                                        }}
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-sm font-medium text-muted-foreground">
                                        {((data.firstname as string)?.[0] || '?').toUpperCase()}{((data.lastname as string)?.[0] || '?').toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <label htmlFor="avatar" className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                                <Camera className="h-3 w-3" />
                                <input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        </div>
                        <div>
                            <h3 className="font-medium text-foreground">
                                Profile Photo
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                JPG or PNG, max 2MB.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="firstname" className="text-sm font-medium">
                                First Name
                            </Label>
                            <Input
                                id="firstname"
                                type="text"
                                value={data.firstname as string}
                                onChange={(e) => setData('firstname', e.target.value)}
                                placeholder="Enter your first name"
                            />
                            {errors.firstname && (
                                <p className="text-sm text-destructive">{errors.firstname}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastname" className="text-sm font-medium">
                                Last Name
                            </Label>
                            <Input
                                id="lastname"
                                type="text"
                                value={data.lastname as string}
                                onChange={(e) => setData('lastname', e.target.value)}
                                placeholder="Enter your last name"
                            />
                            {errors.lastname && (
                                <p className="text-sm text-destructive">{errors.lastname}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email as string}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Enter your email address"
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="affiliation" className="text-sm font-medium">
                            Affiliation
                        </Label>
                        <Input
                            id="affiliation"
                            type="text"
                            value={data.affiliation as string}
                            onChange={(e) => setData('affiliation', e.target.value)}
                            placeholder="Enter your affiliation"
                        />
                        {errors.affiliation && (
                            <p className="text-sm text-destructive">{errors.affiliation}</p>
                        )}
                    </div>
                </div>

                {/* Status Messages */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                        <Mail className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 underline hover:no-underline"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </AlertDescription>
                    </Alert>
                )}

                {status === 'verification-link-sent' && (
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            A new verification link has been sent to your email address.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>

            <div>
                <h2 className="text-lg font-semibold text-foreground">
                    Delete Account
                </h2>
                <p className="text-sm text-muted-foreground">
                    Delete your account and all of its resources
                </p>
            </div>

            {/* Delete Account Section */}
            <div className="max-w-xl bg-card border rounded-lg p-4 space-y-4">
                <Alert className="border-destructive/50 text-destructive [&>svg]:text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Warning:</strong> This action cannot be undone. Once your account is deleted,
                        all of its resources and data will be permanently deleted.
                    </AlertDescription>
                </Alert>

                <AlertDialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you sure you want to delete your account?
                            </AlertDialogTitle>
                        </AlertDialogHeader>

                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                This action will permanently delete your account and all associated data.
                                This cannot be undone.
                            </p>

                            <form onSubmit={deleteUser}>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Confirm with your password
                                    </Label>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        type="password"
                                        value={deleteData.password}
                                        onChange={(e) => setDeleteData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    {deleteErrors.password && (
                                        <p className="text-sm text-destructive">{deleteErrors.password}</p>
                                    )}
                                </div>

                                <AlertDialogFooter className="mt-6">
                                    <AlertDialogCancel
                                        type="button"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        type="submit"
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                        disabled={deletingProcessing || !deleteData.password}
                                    >
                                        {deletingProcessing ? 'Deleting...' : 'Delete Account'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
