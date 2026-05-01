import { Link, useForm } from '@inertiajs/react';
import { CheckCircle, LogOut, RefreshCw } from 'lucide-react';
import type { FormEventHandler } from 'react';
import Breadcrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { home, login as loginRoute, logout } from '@/routes';
import verification from '@/routes/verification';
import type { PageProps } from '@/types';

export default function VerifyEmail({
    status,
}: { status?: string } & PageProps) {
    const breadcrumbItems = [
        { label: 'Home', href: home.url() },
        { label: 'Login', href: loginRoute.url() },
        { label: 'Verify Email' },
    ];

    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(verification.send.url());
    };

    return (
        <PublicLayout title="Verify Email">
            <div className="flex flex-grow items-center justify-center bg-muted pt-12 pb-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mb-8 text-left">
                        <h1 className="mb-12 text-3xl font-bold text-foreground md:text-4xl">
                            Verify Email Address
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Check your email and click the verification link.
                        </p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-6 flex w-96 items-start rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                            <div>Verification email sent.</div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6 text-left">
                        <Button type="submit" disabled={processing}>
                            <RefreshCw
                                className={`mr-2 h-4 w-4 ${processing ? 'animate-spin' : ''}`}
                            />
                            {processing
                                ? 'Sending...'
                                : 'Resend Verification Email'}
                        </Button>

                        <div className="pt-4">
                            <Link
                                href={logout.url()}
                                method="post"
                                as="button"
                                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log Out
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
