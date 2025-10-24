import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { home, login as loginRoute } from '@/routes';
import password from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(password.email.url(), {
            onSuccess: () => {
                reset('email');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Reset Password | Daluyang Dunong" />

            <div className="max-w-md w-full">
                <Card className="shadow-xl animate-in fade-in-50 duration-500">
                    <CardHeader className="text-center space-y-4">
                        <Link href={home.url()} className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center group hover:scale-105 transition-transform duration-200">
                            <img
                                src="https://www.daluyangdunong.minsu.edu.ph/img/mrj1.3083946c.png"
                                className="w-12 h-12 object-contain"
                                alt="Research Journal Manager"
                            />
                        </Link>
                        <div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Reset Password
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Enter your email address and we'll send you a link to reset your password
                            </CardDescription>
                        </div>
                        <p className="text-xs text-muted-foreground/80">
                            Required fields are marked with an asterisk (*)
                        </p>
                    </CardHeader>

                    {status && (
                        <div className="px-6">
                            <Alert className="border-green-200 bg-green-50 text-green-800 animate-in slide-in-from-top-2 duration-300">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>{status}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <CardContent className="space-y-6">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-medium text-sm">
                                    Email Address *
                                </Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        className={`w-full pl-10 transition-all duration-200 ${errors.email
                                            ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                            : 'focus:border-primary focus:ring-primary/20'
                                            }`}
                                        placeholder="Enter your email address"
                                        onChange={(e) => {
                                            setData('email', e.target.value);
                                            if (errors.email) {
                                                clearErrors('email');
                                            }
                                        }}
                                        required
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>
                                {errors.email && (
                                    <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors.email}</span>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full font-semibold py-3 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Sending reset link...</span>
                                    </div>
                                ) : (
                                    <span>Email Password Reset Link</span>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="text-center pb-6 flex justify-center">
                        <Link
                            href={loginRoute.url()}
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to login
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
