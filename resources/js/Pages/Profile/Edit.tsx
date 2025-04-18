import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './partials/delete-user-form';
import UpdatePasswordForm from './partials/update-passwordForm';
import UpdateProfileInformationForm from './partials/update-profile-information-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout header="Profile Settings">
            <Head title="Profile" />

            <div className="space-y-6">
                {/* Removed breadcrumb navigation */}

                <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="h-1 w-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                            Account Settings
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                            Manage your account information, security, and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid grid-cols-3 rounded-none border-b border-gray-200 dark:border-gray-700 bg-transparent">
                                <TabsTrigger value="profile" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent rounded-none data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="password" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent rounded-none data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">
                                    Password
                                </TabsTrigger>
                                <TabsTrigger value="danger" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent rounded-none data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400">
                                    Danger Zone
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="profile" className="border-none p-6 min-h-[400px]">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </TabsContent>
                            <TabsContent value="password" className="border-none p-6 min-h-[400px]">
                                <UpdatePasswordForm />
                            </TabsContent>
                            <TabsContent value="danger" className="border-none p-6 min-h-[400px]">
                                <DeleteUserForm />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
