import { Link, Form, useForm, usePage } from '@inertiajs/react';
import { getData } from 'country-list';
import { Check, Mail, Camera, AlertTriangle } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    FieldDescription,
    FieldLabel,
    FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import profile from '@/routes/profile';
import verification from '@/routes/verification';
import type { User } from '@/types';

interface CountryOption {
    code: string;
    name: string;
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
    };
}

export default function ProfileUpdate({
    mustVerifyEmail,
    status,
    expertises = [],
    userExpertises = [],
}: {
    mustVerifyEmail: boolean;
    status?: string;
    expertises?: { id: number; name: string }[];
    userExpertises?: number[];
}) {
    const user = usePage<PageProps>().props.auth.user;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar_url || null,
    );

    const countries = getData().map(({ code, name }) => ({ code, name }));

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
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

        destroy(profile.destroy.url(), {
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
        <div className="max-w-2xl space-y-6">
            {/* Profile Information Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your account information and profile
                                settings
                            </CardDescription>
                        </div>
                        {/* User Role Badge and Email Verified Badge */}
                        <div className="flex flex-col gap-2">
                            <Badge variant="secondary" className="self-end">
                                {user.role
                                    ? user.role
                                          .replace(/_/g, ' ')
                                          .replace(/\b\w/g, (c) =>
                                              c.toUpperCase(),
                                          )
                                    : 'Unknown'}
                            </Badge>
                            {user.email_verified_at && (
                                <Badge
                                    variant="outline"
                                    className="self-end border-green-600 text-green-600"
                                >
                                    <Check className="mr-1 h-3 w-3" />
                                    Verified
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <Form
                        action={profile.update.url()}
                        method="post"
                        onSuccess={(page) => {
                            // Update avatar preview with new user data
                            const updatedUser = page.props.auth.user as User;
                            setAvatarPreview(updatedUser.avatar_url || null);
                        }}
                    >
                        {({ errors, processing }) => (
                            <div className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="h-20 w-20 overflow-hidden rounded-full border-2 bg-muted">
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
                                                <div className="flex h-full w-full items-center justify-center bg-muted text-lg font-semibold text-muted-foreground">
                                                    {(
                                                        user.firstname?.[0] ||
                                                        '?'
                                                    ).toUpperCase()}
                                                    {(
                                                        user.lastname?.[0] ||
                                                        '?'
                                                    ).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <label
                                            htmlFor="avatar"
                                            className="absolute -right-1 -bottom-1 cursor-pointer rounded-full border-2 border-background bg-primary p-2 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                                        >
                                            <Camera className="h-4 w-4" />
                                            <input
                                                id="avatar"
                                                name="avatar"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium">
                                            Profile Photo
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            JPG or PNG. Max 2MB
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Hidden field for PATCH method */}
                                <input
                                    type="hidden"
                                    name="_method"
                                    value="patch"
                                />

                                {/* Form Fields */}
                                <div className="grid gap-6">
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-3">
                                            <FieldLabel htmlFor="firstname">
                                                First Name
                                            </FieldLabel>
                                            <Input
                                                id="firstname"
                                                name="firstname"
                                                type="text"
                                                defaultValue={
                                                    user.firstname || ''
                                                }
                                                placeholder="John"
                                            />
                                            {errors.firstname && (
                                                <FieldError>
                                                    {errors.firstname}
                                                </FieldError>
                                            )}
                                        </div>

                                        <div className="grid gap-3">
                                            <FieldLabel htmlFor="lastname">
                                                Last Name
                                            </FieldLabel>
                                            <Input
                                                id="lastname"
                                                name="lastname"
                                                type="text"
                                                defaultValue={
                                                    user.lastname || ''
                                                }
                                                placeholder="Doe"
                                            />
                                            {errors.lastname && (
                                                <FieldError>
                                                    {errors.lastname}
                                                </FieldError>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="grid gap-3">
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={user.email || ''}
                                            placeholder="m@example.com"
                                        />
                                        {errors.email && (
                                            <FieldError>
                                                {errors.email}
                                            </FieldError>
                                        )}
                                    </div>

                                    {/* Username */}
                                    <div className="grid gap-3">
                                        <FieldLabel htmlFor="username">
                                            Username
                                        </FieldLabel>
                                        <Input
                                            id="username"
                                            name="username"
                                            type="text"
                                            defaultValue={user.username || ''}
                                            placeholder="johndoe"
                                        />
                                        {errors.username && (
                                            <FieldError>
                                                {errors.username}
                                            </FieldError>
                                        )}
                                    </div>

                                    {/* Affiliation */}
                                    <div className="grid gap-3">
                                        <FieldLabel htmlFor="affiliation">
                                            Affiliation
                                        </FieldLabel>
                                        <Input
                                            id="affiliation"
                                            name="affiliation"
                                            type="text"
                                            defaultValue={
                                                user.affiliation || ''
                                            }
                                            placeholder="University or Organization"
                                        />
                                        <FieldDescription>
                                            Your academic institution or
                                            organization
                                        </FieldDescription>
                                        {errors.affiliation && (
                                            <FieldError>
                                                {errors.affiliation}
                                            </FieldError>
                                        )}
                                    </div>

                                    {/* Country */}
                                    <div className="grid gap-3">
                                        <FieldLabel htmlFor="country">
                                            Country
                                        </FieldLabel>
                                        <Select
                                            name="country"
                                            defaultValue={
                                                user.country || undefined
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries.map(
                                                    (option: CountryOption) => (
                                                        <SelectItem
                                                            key={option.code}
                                                            value={option.name}
                                                        >
                                                            {option.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.country && (
                                            <FieldError>
                                                {errors.country}
                                            </FieldError>
                                        )}
                                    </div>

                                    {/* Expertise */}
                                    <div className="grid gap-3">
                                        <FieldLabel>Expertise</FieldLabel>
                                        <div className="h-48 space-y-2 overflow-y-auto rounded-md border p-4">
                                            {expertises.length > 0 ? (
                                                expertises.map((expertise) => (
                                                    <div
                                                        key={expertise.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox
                                                            id={`expertise-${expertise.id}`}
                                                            name="expertises[]"
                                                            value={expertise.id}
                                                            defaultChecked={userExpertises.includes(
                                                                expertise.id,
                                                            )}
                                                        />
                                                        <label
                                                            htmlFor={`expertise-${expertise.id}`}
                                                            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {expertise.name}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    No expertise tags available.
                                                </p>
                                            )}
                                        </div>
                                        <FieldDescription>
                                            Select your areas of expertise for
                                            better manuscript matching
                                        </FieldDescription>
                                    </div>

                                    <Separator />

                                    {/* Privacy Options */}
                                    <div className="grid gap-4">
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium">
                                                Privacy & Preferences
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Manage your privacy settings and
                                                notification preferences
                                            </p>
                                        </div>

                                        <div className="grid gap-4">
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id="data_collection"
                                                    name="data_collection"
                                                    defaultChecked={
                                                        !!user.data_collection
                                                    }
                                                    className="mt-1"
                                                />
                                                <div className="grid flex-1 gap-1.5">
                                                    <FieldLabel
                                                        htmlFor="data_collection"
                                                        className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Data Collection Consent
                                                    </FieldLabel>
                                                    <p className="text-sm text-muted-foreground">
                                                        I agree to the
                                                        collection and
                                                        processing of my
                                                        personal data
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id="notifications"
                                                    name="notifications"
                                                    defaultChecked={
                                                        !!user.notifications
                                                    }
                                                    className="mt-1"
                                                />
                                                <div className="grid flex-1 gap-1.5">
                                                    <FieldLabel
                                                        htmlFor="notifications"
                                                        className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        In-App Notifications
                                                    </FieldLabel>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive updates about
                                                        publications and
                                                        announcements
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id="email_notification_enabled"
                                                    name="email_notification_enabled"
                                                    defaultChecked={
                                                        user.email_notification_enabled !==
                                                        false
                                                    }
                                                    className="mt-1"
                                                />
                                                <div className="grid flex-1 gap-1.5">
                                                    <FieldLabel
                                                        htmlFor="email_notification_enabled"
                                                        className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Email Notifications
                                                    </FieldLabel>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive email
                                                        notifications for
                                                        manuscript updates and
                                                        reviews
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id="review_requests"
                                                    name="review_requests"
                                                    defaultChecked={
                                                        !!user.review_requests
                                                    }
                                                    className="mt-1"
                                                />
                                                <div className="grid flex-1 gap-1.5">
                                                    <FieldLabel
                                                        htmlFor="review_requests"
                                                        className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Review Requests
                                                    </FieldLabel>
                                                    <p className="text-sm text-muted-foreground">
                                                        I am open to receiving
                                                        manuscript review
                                                        requests
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Messages */}
                                    {mustVerifyEmail &&
                                        user.email_verified_at === null && (
                                            <Alert className="border-amber-200 bg-amber-50">
                                                <Mail className="h-4 w-4 text-amber-600" />
                                                <AlertDescription className="text-amber-800">
                                                    Your email address is
                                                    unverified.
                                                    <Link
                                                        href={verification.send.url()}
                                                        method="post"
                                                        as="button"
                                                        className="ml-2 font-medium underline hover:no-underline"
                                                    >
                                                        Click here to re-send
                                                        the verification email.
                                                    </Link>
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                    {status === 'verification-link-sent' && (
                                        <Alert className="border-green-200 bg-green-50">
                                            <Check className="h-4 w-4 text-green-600" />
                                            <AlertDescription className="text-green-800">
                                                A new verification link has been
                                                sent to your email address.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Save Button */}
                                <div className="flex items-center gap-2 pt-2">
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </CardContent>
            </Card>

            {/* Delete Account Card */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">
                        Delete Account
                    </CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Alert className="border-destructive/50 text-destructive [&>svg]:text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Once your account is deleted, all of its resources
                            and data will be permanently deleted. This action
                            cannot be undone.
                        </AlertDescription>
                    </Alert>

                    <AlertDialog
                        open={confirmingUserDeletion}
                        onOpenChange={setConfirmingUserDeletion}
                    >
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure you want to delete your
                                    account?
                                </AlertDialogTitle>
                            </AlertDialogHeader>

                            <form onSubmit={deleteUser} className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    This action will permanently delete your
                                    account and all associated data. This cannot
                                    be undone.
                                </p>

                                <div className="grid gap-3">
                                    <FieldLabel htmlFor="password">
                                        Confirm with your password
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        type="password"
                                        value={deleteData.password}
                                        onChange={(e) =>
                                            setDeleteData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter your password"
                                        required
                                    />
                                    {deleteErrors.password && (
                                        <FieldError>
                                            {deleteErrors.password}
                                        </FieldError>
                                    )}
                                </div>

                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        type="button"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        type="submit"
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={
                                            deletingProcessing ||
                                            !deleteData.password
                                        }
                                    >
                                        {deletingProcessing
                                            ? 'Deleting...'
                                            : 'Delete Account'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
