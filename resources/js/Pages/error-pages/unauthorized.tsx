import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Unauthorized() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4">
            <Head title="Unauthorized Access" />

            <Card className={`w-full max-w-md border-destructive/20 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <CardHeader className="pb-0 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-10 w-10 text-destructive animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
                    <Separator className="my-3 w-16 bg-destructive/60" />
                </CardHeader>

                <CardContent className="text-center pt-4">
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Authentication Required</AlertTitle>
                        <AlertDescription>
                            You don't have the necessary permissions to access this resource.
                        </AlertDescription>
                    </Alert>

                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                        <Button asChild size="lg" className="gap-2">
                            <Link href="/">
                                Return to Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col text-center text-muted-foreground text-sm">
                    <p className="mb-2">
                        If you believe this is an error, please contact the system administrator at{" "}
                        <span className="text-primary underline">contact@minsujr.online</span>
                    </p>
                    <Badge variant="outline" className="self-center mt-2">
                        Error Code: 401 - Unauthorized Access
                    </Badge>
                </CardFooter>
            </Card>
        </div>
    );
}
