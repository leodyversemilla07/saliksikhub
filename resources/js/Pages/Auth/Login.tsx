import { useEffect, FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Login({ status, canResetPassword }: PageProps<{ status?: string, canResetPassword: boolean }>) {
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, [reset]);

    // Auto-focus email field on mount
    useEffect(() => {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.focus();
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Login | Daluyang Dunong" />

            <div className="max-w-md w-full">
                <Card className="shadow-xl animate-in fade-in-50 duration-500">
                    <CardHeader className="text-center space-y-4">
                        <Link href={route('home')} className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center group hover:scale-105 transition-transform duration-200">
                            <img
                                src="https://www.daluyangdunong.minsu.edu.ph/img/mrj1.3083946c.png"
                                className="w-12 h-12 object-contain"
                                alt="Research Journal Manager"
                            />
                        </Link>
                        <div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Sign in to your account to continue
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
                                    />
                                </div>
                                {errors.email && (
                                    <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors.email}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="font-medium">Password *</Label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        className={`w-full pl-10 pr-10 transition-all duration-200 ${errors.password
                                            ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                            : 'focus:border-primary focus:ring-primary/20'
                                            }`}
                                        placeholder="Enter your password"
                                        onChange={(e) => {
                                            setData('password', e.target.value);
                                            if (errors.password) {
                                                clearErrors('password');
                                            }
                                        }}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors.password}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember_me"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                        className="h-4 w-4 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        disabled={processing}
                                    />
                                    <Label
                                        htmlFor="remember_me"
                                        className="text-sm text-muted-foreground cursor-pointer select-none"
                                    >
                                        Keep me logged in
                                    </Label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full font-semibold py-3 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Signing you in...</span>
                                    </div>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="text-center pb-6 flex justify-center">
                        <p className="text-sm text-muted-foreground text-center">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                className="font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
                            >
                                Create one here
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
