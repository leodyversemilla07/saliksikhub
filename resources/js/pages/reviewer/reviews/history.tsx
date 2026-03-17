import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold mb-6">Review History</h1>
                    {/* Review history content will be implemented here */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <p className="text-gray-600">Completed reviews: {reviews.length}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
