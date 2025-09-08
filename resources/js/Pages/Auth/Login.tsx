import { useEffect, FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ canResetPassword }: PageProps<{ status?: string, canResetPassword: boolean }>) {
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const { data, setData, post, processing, errors, reset } = useForm<{
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Login | Daluyang Dunong" />

            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Sign in to your account
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Required fields are marked with an asterisk (*).
                    </p>
                </div>

                <div className="bg-card py-8 px-6 shadow-xl rounded-lg border border-border">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-card-foreground font-medium">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                className={`w-full bg-input border border-input focus:border-ring focus:ring-ring rounded-md transition-colors ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                                placeholder="Enter your email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-card-foreground font-medium">Password *</Label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    className={`w-full pr-10 bg-input border border-input focus:border-ring focus:ring-ring rounded-md transition-colors ${errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember_me"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                    className="h-4 w-4 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary focus:ring-ring"
                                />
                                <Label htmlFor="remember_me" className="text-sm text-muted-foreground">
                                    Keep me logged in
                                </Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-md transition-colors shadow-sm"
                            disabled={processing}
                        >
                            {processing ? 'Logging in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
