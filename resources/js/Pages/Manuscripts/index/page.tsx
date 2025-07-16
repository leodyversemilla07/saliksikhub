import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { Manuscript } from "@/types/manuscript";

export default function Index({ manuscripts }: { manuscripts: Manuscript[] }) {
    return (
        <AppLayout breadcrumbItems={[{ label: 'Dashboard', href: route('dashboard') }, { label: 'Manuscripts', href: route('manuscripts.index') }]}>
            <Head title="Manuscripts" />
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Manuscripts</h1>
                        <p className="text-muted-foreground mt-1">
                            Browse, search, and manage all submitted manuscripts in the system
                        </p>
                    </div>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                        asChild
                    >
                        <Link href={route('manuscripts.create')}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Manuscript
                        </Link>
                    </Button>
                </div>
                {/* Main Content Table */}
                <div className="overflow-hidden rounded-lg bg-card shadow-lg">
                    <div className="overflow-x-auto">
                        <DataTable data={manuscripts} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}