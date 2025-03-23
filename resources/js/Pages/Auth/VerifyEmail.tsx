import { FormEventHandler } from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/Button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout title="Verify Email">
            <div className="bg-gradient-to-br from-[#f0f8f3] to-white p-5 mb-6 rounded-lg">
                <div className="text-[#18652c] text-sm font-medium text-center">
                    Thanks for signing up! Before getting started, please verify your email address by clicking on the link we sent you.
                </div>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-5 text-sm font-medium text-green-600 text-center bg-green-50 p-3 rounded-lg border border-green-100">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="flex flex-col space-y-3 pt-2">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="py-2.5 text-base bg-[#3fb65e] hover:bg-[#18652c] rounded-lg text-white transition-colors duration-300"
                    >
                        {processing ? 'Sending...' : 'Resend Verification Email'}
                    </Button>
                    
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full py-2.5 text-sm font-medium text-[#18652c] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#3fb65e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18652C] transition-colors duration-300"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
