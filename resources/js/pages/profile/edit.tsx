import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import UpdatePasswordForm from './partials/password';
import UpdateProfileInformationForm from './partials/profile';

export default function Edit({
    mustVerifyEmail,
    status,
    expertises,
    userExpertises,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    expertises?: { id: number; name: string }[];
    userExpertises?: number[];
}>) {
    const [activeSection, setActiveSection] = useState('profile');

    const breadcrumbItems = [
        {
            label: 'Profile Settings',
        },
    ];

    // Navigation items for the left sidebar
    const navigationItems = [
        {
            name: 'Profile',
            section: 'profile',
            current: activeSection === 'profile',
        },
        {
            name: 'Password',
            section: 'password',
            current: activeSection === 'password',
        },
    ];

    // Determine which component to render based on active section
    const renderContent = () => {
        if (activeSection === 'password') {
            return <UpdatePasswordForm />;
        } else {
            return (
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    expertises={expertises}
                    userExpertises={userExpertises}
                />
            );
        }
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Profile Settings" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-oxford-blue font-serif text-2xl font-semibold">
                        Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Content */}
                <div className="flex gap-6">
                    {/* Navigation */}
                    <div className="w-64 flex-shrink-0">
                        <div className="rounded-lg bg-card p-1">
                            <nav className="space-y-1">
                                {navigationItems.map((item) => {
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() =>
                                                setActiveSection(item.section)
                                            }
                                            className={cn(
                                                'flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                                                item.current
                                                    ? 'bg-oxford-blue text-white'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                            )}
                                        >
                                            {item.name}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="p-4">{renderContent()}</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
