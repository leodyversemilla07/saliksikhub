import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
                    {/* Review list content will be implemented here */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <p className="text-gray-600">Reviews list ({reviews.length} reviews)</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
