import { Link, Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center text-foreground">
            <Head title="Access Denied" />
            <div className="mx-auto flex w-full max-w-xs flex-col gap-2 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <h1 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
                    Access Denied
                </h1>
                <p className="mb-6 text-base sm:text-lg">
                    You are not authorized to view this page.
                </p>
                <div className="flex flex-col justify-center gap-2 sm:flex-row">
                    <Button asChild className="w-full min-w-[140px] sm:w-auto">
                        <Link href="/">Return Home</Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex w-full min-w-[140px] items-center justify-center gap-2 sm:w-auto"
                        onClick={() => window.history.back()}
                        type="button"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}
