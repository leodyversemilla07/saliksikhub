import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './partials/password';
import UpdateProfileInformationForm from './partials/profile';
import { cn } from '@/lib/utils';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
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
            current: activeSection === 'profile'
        },
        {
            name: 'Password',
            section: 'password',
            current: activeSection === 'password'
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
                />
            );
        }
    };

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Profile Settings" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
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
                        <div className="bg-card rounded-lg p-1">
                            <nav className="space-y-1">
                                {navigationItems.map((item) => {
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() => setActiveSection(item.section)}
                                            className={cn(
                                                'flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors',
                                                item.current
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
                        <div className="p-4">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
