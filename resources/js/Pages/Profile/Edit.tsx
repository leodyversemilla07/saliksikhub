import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './partials/delete-user';
import UpdatePasswordForm from './partials/password-update';
import UpdateProfileInformationForm from './partials/profile-update';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
        },
        {
            label: 'Profile Settings',
            href: route('profile.edit'),
            current: true,
        },
    ];

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Profile Settings" />

            <div className="max-w-5xl mx-auto py-6">
                <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                    <CardContent className="p-0">
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-none h-14">
                                <TabsTrigger
                                    value="profile"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-white data-[state=active]:shadow-none rounded-none text-sm font-medium h-full transition-all duration-200"
                                >
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger
                                    value="password"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 dark:data-[state=active]:border-white data-[state=active]:shadow-none rounded-none text-sm font-medium h-full transition-all duration-200"
                                >
                                    Password
                                </TabsTrigger>
                                <TabsTrigger
                                    value="danger"
                                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:shadow-none rounded-none text-sm font-medium h-full data-[state=active]:text-red-600 transition-all duration-200"
                                >
                                    Account
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="border-none p-8">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </TabsContent>

                            <TabsContent value="password" className="border-none p-8">
                                <UpdatePasswordForm />
                            </TabsContent>

                            <TabsContent value="danger" className="border-none p-8">
                                <DeleteUserForm />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
