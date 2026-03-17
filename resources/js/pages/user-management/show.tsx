import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import users from '@/routes/users';

type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    affiliation?: string;
    country?: string;
    username?: string;
    avatar?: string;
    avatar_url?: string;
    data_collection?: boolean;
    notifications?: boolean;
    review_requests?: boolean;
    name?: string;
    created_at: string;
    updated_at: string;
};

export default function UserShow({ user }: { user: User }) {
    const breadcrumbItems = [
        { label: 'Dashboard', href: dashboard.url() },
        { label: 'User Management', href: users.index.url() },
        {
            label: `${user.firstname} ${user.lastname}`,
            href: users.show.url({ user: user.id }),
            current: true,
        },
    ];

    // Role label mapping
    const roleLabels: Record<string, string> = {
        managing_editor: 'Managing Editor',
        author: 'Author',
        editor_in_chief: 'Editor-in-Chief',
        associate_editor: 'Associate Editor',
        language_editor: 'Language Editor',
        reviewer: 'Reviewer',
        editor: 'Editor',
    };
    const roleVariants: Record<
        string,
        'destructive' | 'secondary' | 'outline' | 'default'
    > = {
        editor_in_chief: 'destructive',
        managing_editor: 'secondary',
        associate_editor: 'secondary',
        language_editor: 'secondary',
        reviewer: 'outline',
        author: 'default',
        editor: 'secondary',
    };
    const roleLabel =
        roleLabels[user.role] ||
        user.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const roleVariant = roleVariants[user.role] || 'default';

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`User: ${user.firstname} ${user.lastname}`} />
            <div className="m-0 flex h-[calc(100vh-64px)] min-h-screen w-full flex-col items-stretch justify-center bg-background p-0">
                {/* Profile Header */}
                <div className="flex w-full flex-col items-center gap-6 bg-background px-16 py-10 pb-0 md:flex-row">
                    <Avatar className="h-24 w-24 border-4 border-border bg-background shadow-lg">
                        <AvatarImage
                            src={user.avatar}
                            alt={`${user.firstname} ${user.lastname} avatar`}
                        />
                        <AvatarFallback className="bg-background text-4xl font-bold text-primary">
                            {user.firstname[0]}
                            {user.lastname[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="mb-1 text-4xl font-extrabold text-foreground">
                            {user.firstname} {user.lastname}
                        </h1>
                        <Badge
                            variant={roleVariant}
                            className="mt-2 px-4 py-2 text-base capitalize shadow-md"
                        >
                            {roleLabel}
                        </Badge>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="w-full flex-1 space-y-8 px-16 pb-16 text-lg text-foreground">
                    {/* Personal Info Section */}
                    <div className="mb-6">
                        <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-foreground">
                            <span>Personal Information</span>
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    Full Name:
                                </span>
                                <span className="ml-2 text-foreground">
                                    {user.name ||
                                        `${user.firstname} ${user.lastname}`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Username:</span>
                                <span className="ml-2 text-foreground">
                                    {user.username || 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    Affiliation:
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                    {user.affiliation || 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Country:</span>
                                <span className="ml-2 text-muted-foreground">
                                    {user.country || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Account Info Section */}
                    <div className="mb-6">
                        <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-foreground">
                            <span>Account Details</span>
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Email:</span>
                                <span className="ml-2 text-foreground">
                                    {user.email}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    Avatar URL:
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                    {user.avatar_url || 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    Created At:
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                    {new Date(user.created_at).toLocaleString(
                                        'en-US',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        },
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    Updated At:
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                    {new Date(user.updated_at).toLocaleString(
                                        'en-US',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        },
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Preferences Section */}
                    <div>
                        <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-foreground">
                            <span>Preferences</span>
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    Data Collection:
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                    {user.data_collection
                                        ? 'Enabled'
                                        : 'Disabled'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    Notifications:
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                    {user.notifications
                                        ? 'Enabled'
                                        : 'Disabled'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    Review Requests:
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                    {user.review_requests
                                        ? 'Enabled'
                                        : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
