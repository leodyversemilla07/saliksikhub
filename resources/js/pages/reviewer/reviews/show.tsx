import { Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';

interface Review {
    id: number;
    manuscript: {
        title: string;
    };
    status: string;
}

interface Props {
    review: Review;
}

export default function ReviewShow({ review }: Props) {
    return (
        <AppLayout>
            <Head title="Review Details" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="mb-6 text-2xl font-bold">
                        Review: {review.manuscript.title}
                    </h1>
                    {/* Review details content will be implemented here */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-gray-600">
                            Review status: {review.status}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
