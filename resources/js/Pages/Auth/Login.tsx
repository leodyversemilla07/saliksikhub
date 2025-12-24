import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { CheckCircle } from 'lucide-react';
import { home, login as loginRoute, register as registerRoute } from '@/routes';
import password from '@/routes/password';
import { FormEventHandler } from 'react';

export default function Login({ status, canResetPassword }: PageProps<{ status?: string, canResetPassword: boolean }>) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(loginRoute().url);
    };

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <Head title="Login | Daluyang Dunong" />

            <div className="flex w-full max-w-sm flex-col gap-6">
                {/* Logo/Brand */}
                <Link href={home()} className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
                        <img
                            src="https://www.daluyangdunong.minsu.edu.ph/img/mrj1.3083946c.png"
                            className="size-8 object-contain"
                            alt="Daluyang Dunong"
                        />
                    </div>
                    Daluyang Dunong
                </Link>

                {/* Status Alert */}
                {status && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{status}</AlertDescription>
                    </Alert>
                )}

                {/* Login Card */}
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="font-serif text-xl text-oxford-blue">Welcome back</CardTitle>
                        <CardDescription>
                            Login with your email below to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <FieldGroup>
                                <Field data-invalid={!!errors.email}>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={data.email}
                                        onChange={(e) => {
                                            setData('email', e.target.value);
                                            if (errors.email) {
                                                clearErrors('email');
                                            }
                                        }}
                                        required
                                        autoComplete="email"
                                    />
                                    {errors.email && <FieldError>{errors.email}</FieldError>}
                                </Field>

                                <Field data-invalid={!!errors.password}>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        {canResetPassword && (
                                            <Link
                                                href={password.request()}
                                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </Link>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => {
                                            setData('password', e.target.value);
                                            if (errors.password) {
                                                clearErrors('password');
                                            }
                                        }}
                                        required
                                        autoComplete="current-password"
                                    />
                                    {errors.password && <FieldError>{errors.password}</FieldError>}
                                </Field>

                                <Field>
                                    <Button 
                                        type="submit" 
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? 'Logging in...' : 'Login'}
                                    </Button>
                                    <FieldDescription className="text-center">
                                        Don&apos;t have an account?{' '}
                                        <Link href={registerRoute()} className="underline underline-offset-4">
                                            Sign up
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer Terms */}
                <FieldDescription className="px-6 text-center text-balance">
                    By clicking continue, you agree to our{' '}
                    <Link href="#" className="underline underline-offset-4">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="underline underline-offset-4">
                        Privacy Policy
                    </Link>
                    .
                </FieldDescription>
            </div>
        </div>
    );
}
