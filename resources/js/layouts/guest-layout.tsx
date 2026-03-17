import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import ApplicationLogo from '@/components/application-logo';

export default function GuestLayout({
    title,
    children,
}: PropsWithChildren<{ title: string }>) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0">
                <div className="mt-6 w-full overflow-hidden bg-card px-8 py-6 shadow-md sm:max-w-md sm:rounded-lg">
                    <div className="mb-5 flex justify-center">
                        <Link href="/">
                            <ApplicationLogo className="h-24 w-24" />
                        </Link>
                    </div>
                    <h1 className="mb-6 text-center text-2xl font-bold text-card-foreground">
                        {title}
                    </h1>
                    {children}
                </div>
            </div>
        </>
    );
}
