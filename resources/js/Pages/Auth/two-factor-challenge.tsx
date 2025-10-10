import { FormEventHandler, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Smartphone, Key } from 'lucide-react';

export default function TwoFactorChallenge() {
    const [recovery, setRecovery] = useState(false);
    const codeRef = useRef<HTMLInputElement>(null);
    const recoveryCodeRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: '',
    });

    const toggleRecovery = (e: React.MouseEvent) => {
        e.preventDefault();
        const isRecovery = !recovery;
        setRecovery(isRecovery);
        
        setTimeout(() => {
            if (isRecovery) {
                recoveryCodeRef.current?.focus();
                setData('code', '');
            } else {
                codeRef.current?.focus();
                setData('recovery_code', '');
            }
        }, 100);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.login'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Two-Factor Authentication" />

            <div className="max-w-md w-full">
                <Card className="shadow-xl animate-in fade-in-50 duration-500">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Two-Factor Authentication
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                {recovery
                                    ? 'Please enter your recovery code to continue'
                                    : 'Please enter your authentication code to continue'}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {!recovery ? (
                                <div className="space-y-2">
                                    <Label htmlFor="code" className="flex items-center gap-2">
                                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                                        Authentication Code
                                    </Label>
                                    <Input
                                        id="code"
                                        ref={codeRef}
                                        type="text"
                                        inputMode="numeric"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        autoFocus
                                        autoComplete="one-time-code"
                                        placeholder="000000"
                                        maxLength={6}
                                        className={errors.code ? 'border-destructive' : ''}
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-destructive">{errors.code}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Enter the 6-digit code from your authenticator app
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label htmlFor="recovery_code" className="flex items-center gap-2">
                                        <Key className="h-4 w-4 text-muted-foreground" />
                                        Recovery Code
                                    </Label>
                                    <Input
                                        id="recovery_code"
                                        ref={recoveryCodeRef}
                                        type="text"
                                        value={data.recovery_code}
                                        onChange={(e) => setData('recovery_code', e.target.value)}
                                        autoFocus
                                        autoComplete="one-time-code"
                                        placeholder="Enter recovery code"
                                        className={errors.recovery_code ? 'border-destructive' : ''}
                                    />
                                    {errors.recovery_code && (
                                        <p className="text-sm text-destructive">{errors.recovery_code}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Enter one of your emergency recovery codes
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? 'Verifying...' : 'Verify'}
                                </Button>

                                <Button
                                    type="button"
                                    variant="link"
                                    className="w-full text-sm"
                                    onClick={toggleRecovery}
                                >
                                    {recovery
                                        ? 'Use authentication code instead'
                                        : "Can't access your authenticator? Use recovery code"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
