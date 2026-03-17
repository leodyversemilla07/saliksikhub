import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Unauthorized() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
            <Head title="Access Denied" />
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Access Denied</h1>
                <p className="mb-6 text-base sm:text-lg">You are not authorized to view this page.</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button asChild className="w-full sm:w-auto min-w-[140px]">
                        <Link href="/">Return Home</Link>
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto min-w-[140px] flex items-center justify-center gap-2" onClick={() => window.history.back()} type="button">
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}
