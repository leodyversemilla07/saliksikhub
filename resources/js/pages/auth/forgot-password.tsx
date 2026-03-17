import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Mail,
    Loader2,
    AlertCircle,
    CheckCircle,
    ArrowLeft,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { home, login as loginRoute } from '@/routes';
import password from '@/routes/password';
import type { PageProps } from '@/types';

export default function ForgotPassword({ status }: { status?: string }) {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';
    const journalLogo = currentJournal?.logo_url ?? '/images/logo.png';

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4 py-12 sm:px-6 lg:px-8">
            <Head title={`Reset Password | ${journalName}`} />

            <div className="w-full max-w-md">
                <Card className="shadow-xl duration-500 animate-in fade-in-50">
                    <CardHeader className="space-y-4 text-center">
                        <Link
                            href={home.url()}
                            className="group mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white transition-transform duration-200 hover:scale-105"
                        >
                            <img
                                src={journalLogo}
                                className="h-12 w-12 object-contain"
                                alt={journalName}
                            />
                        </Link>
                        <div>
                            <CardTitle className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-3xl font-bold text-transparent">
                                Reset Password
                            </CardTitle>
                            <CardDescription className="mt-2 text-base">
                                Enter your email address and we'll send you a
                                link to reset your password
                            </CardDescription>
                        </div>
                        <p className="text-xs text-muted-foreground/80">
                            Required fields are marked with an asterisk (*)
                        </p>
                    </CardHeader>

                    {status && (
                        <div className="px-6">
                            <Alert className="border-green-200 bg-green-50 text-green-800 duration-300 animate-in slide-in-from-top-2">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>{status}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <CardContent className="space-y-6">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email Address *
                                </Label>
                                <div className="group relative">
                                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        className={`w-full pl-10 transition-all duration-200 ${
                                            errors.email
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
                                    <div className="flex items-center gap-2 text-sm text-destructive duration-200 animate-in slide-in-from-left-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors.email}</span>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-3 font-semibold shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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

                    <CardFooter className="flex justify-center pb-6 text-center">
                        <Link
                            href={loginRoute.url()}
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
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
