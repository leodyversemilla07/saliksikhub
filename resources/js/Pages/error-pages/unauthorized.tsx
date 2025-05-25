import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Home, LogIn, Mail, ArrowLeft, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Unauthorized() {
    const [isVisible, setIsVisible] = useState(false);
    const [timeStamp, setTimeStamp] = useState('');

    useEffect(() => {
        setIsVisible(true);
        setTimeStamp(new Date().toLocaleString());
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-muted/30 via-muted/50 to-muted/70 p-4 relative overflow-hidden">
            <Head title="Unauthorized Access - Access Denied" />

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-destructive/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className={`relative z-10 w-full max-w-lg transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
                }`}>
                <Card className="border-destructive/30 shadow-2xl backdrop-blur-sm bg-background/95">
                    <CardHeader className="pb-6 flex flex-col items-center text-center">
                        {/* Animated icon container */}
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center mb-6 group">
                            <div className="absolute inset-0 rounded-full bg-destructive/10 animate-ping"></div>
                            <div className="relative">
                                <Shield className="h-12 w-12 text-destructive animate-pulse" />
                                <AlertTriangle className="absolute -top-1 -right-1 h-6 w-6 text-destructive animate-bounce" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">
                                Access Denied
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium">
                                Error 401 • Unauthorized Access
                            </p>
                        </div>

                        <Separator className="my-4 w-20 bg-gradient-to-r from-transparent via-destructive/60 to-transparent" />
                    </CardHeader>

                    <CardContent className="px-6 pb-6 space-y-6">
                        <Alert variant="destructive" className="border-destructive/40 bg-destructive/5">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="text-base font-semibold">Authentication Required</AlertTitle>
                            <AlertDescription className="mt-2 text-sm leading-relaxed">
                                You don't have the necessary permissions to access this resource.
                                Please log in with an authorized account or contact your administrator.
                            </AlertDescription>
                        </Alert>

                        {/* Additional helpful information */}
                        <div className="grid grid-cols-1 gap-4 text-sm">
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    Incident time: <span className="font-mono text-foreground">{timeStamp}</span>
                                </span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                                <Link href="/">
                                    <Home className="h-4 w-4" />
                                    Return Home
                                </Link>
                            </Button>

                            <Button asChild variant="outline" size="lg" className="gap-2 hover:bg-muted">
                                <Link href="/login">
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                </Link>
                            </Button>
                        </div>

                        {/* Alternative action */}
                        <div className="text-center">
                            <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                <Link href="javascript:history.back()">
                                    <ArrowLeft className="h-4 w-4" />
                                    Go Back
                                </Link>
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="px-6 pb-6 flex flex-col text-center border-t bg-muted/20">
                        <div className="space-y-4 w-full">
                            <div className="text-sm text-muted-foreground">
                                <p className="mb-2">
                                    Need help? Contact our support team at
                                </p>
                                <Button asChild variant="link" size="sm" className="gap-2 h-auto p-0 text-primary">
                                    <a href="mailto:contact@minsujr.online">
                                        <Mail className="h-4 w-4" />
                                        contact@ddmrj.minsu.edu.ph
                                    </a>
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center">
                                <Badge variant="outline" className="text-xs font-mono">
                                    HTTP 401
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    Unauthorized Access
                                </Badge>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                {/* Additional context or tips */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        This page is protected. If you're supposed to have access,
                        try refreshing or clearing your browser cache.
                    </p>
                </div>
            </div>
        </div>
    );
}
