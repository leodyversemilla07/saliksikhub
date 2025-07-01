import { Head, Link } from '@inertiajs/react';

import AuthenticatedLayout from '@/layouts/authenticated-layout';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { Manuscript } from '@/types/manuscript';

interface IndexProps {
    manuscripts: Manuscript[];
}

const CreateNewButton = () => (
    <Button
        asChild
        variant="default"
        size="lg"
        className="rounded-lg shadow-md"
    >
        <Link href={route('manuscripts.create')}>
            <Plus className="h-5 w-5 mr-1" />
            <span>New Manuscript</span>
        </Link>
    </Button>
);

export default function Index({ manuscripts }: IndexProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Manuscripts" />
            <div className="space-y-6 bg-background text-foreground">
                <div className="flex justify-end">
                    <CreateNewButton />
                </div>

                <DataTable columns={columns} data={manuscripts} />
            </div>
        </AuthenticatedLayout>
    );
}
