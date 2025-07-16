import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const breadcrumbItems = [
    {
        label: 'Dashboard',
        href: "#",
    }
];

export default function AuthorDashboard() {
    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Dashboard" />
            <div className="min-h-screen w-full flex flex-col space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Stats Section */}
                    <Card className="h-full">
                        <div className="px-6">
                            <h2 className="text-xl font-semibold text-foreground mb-2">Stats</h2>
                            <Skeleton className="h-12 w-full mb-4" />
                            <Skeleton className="h-12 w-full mb-4" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </Card>

                    {/* Manuscripts Section */}
                    <Card className="h-full">
                        <div className="px-6">
                            <h2 className="text-xl font-semibold text-foreground mb-2">Manuscripts</h2>
                            <Skeleton className="h-12 w-full mb-4" />
                            <Skeleton className="h-12 w-full mb-4" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </Card>

                    {/* Notifications Section */}
                    <Card className="h-full">
                        <div className="px-6">
                            <h2 className="text-xl font-semibold text-foreground mb-2">Notifications</h2>
                            <Skeleton className="h-12 w-full mb-4" />
                            <Skeleton className="h-12 w-full mb-4" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </Card>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">Recent Activity</h2>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </AppLayout>
    );
};
