import { Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';

interface Review {
    id: number;
    manuscript_title: string;
    status: string;
    completed_at?: string;
}

interface Props {
    reviews: Review[];
}

export default function ReviewHistory({ reviews }: Props) {
    return (
        <AppLayout>
            <Head title="Review History" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="mb-6 text-2xl font-bold">Review History</h1>
                    {/* Review history content will be implemented here */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-gray-600">
                            Completed reviews: {reviews.length}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
