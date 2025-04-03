import ApplicationLogo from '@/components/application-logo';
import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ title, children }: PropsWithChildren<{ title: string }>) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-50">
                <div className="w-full sm:max-w-md mt-6 px-8 py-6 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <div className="flex justify-center mb-5">
                        <Link href="/">
                            <ApplicationLogo className="w-24 h-24" />
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">{title}</h1>
                    {children}
                </div>
            </div>
        </>
    );
}
