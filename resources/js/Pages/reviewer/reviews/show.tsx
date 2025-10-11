import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold mb-6">Review: {review.manuscript.title}</h1>
                    {/* Review details content will be implemented here */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <p className="text-gray-600">Review status: {review.status}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
