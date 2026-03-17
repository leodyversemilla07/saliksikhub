import { useState, FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import Breadcrumb from '@/components/breadcrumb';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { home } from '@/routes';
import password from '@/routes/password';
import PublicLayout from '@/layouts/public-layout';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);

    const breadcrumbItems = [
        { label: 'Home', href: home.url() },
        { label: 'Confirm Password' }
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(password.confirm.url(), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <PublicLayout title="Confirm Password">
            <div className="flex-grow bg-muted flex items-center justify-center pt-12 pb-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mb-8 text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
                            Confirm Password
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Please confirm your password to continue.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Password *</Label>
                            <div className="relative w-96">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    className={`w-full pr-10 rounded-md ${errors.password ? 'border-destructive' : ''}`}
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoFocus
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Confirming...' : 'Confirm Password'}
                        </Button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
