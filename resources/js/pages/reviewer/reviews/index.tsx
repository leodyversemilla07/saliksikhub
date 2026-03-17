import { Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';

interface Review {
    id: number;
    manuscript_title: string;
    status: string;
}

interface Props {
    reviews: Review[];
}

export default function ReviewIndex({ reviews }: Props) {
    return (
        <AppLayout>
            <Head title="My Reviews" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="mb-6 text-2xl font-bold">My Reviews</h1>
                    {/* Review list content will be implemented here */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-gray-600">
                            Reviews list ({reviews.length} reviews)
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
