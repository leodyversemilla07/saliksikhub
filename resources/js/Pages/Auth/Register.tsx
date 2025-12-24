import { Head, Form, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { home, login as loginRoute, register as registerRoute } from '@/routes';

export default function Register() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <Head title="Create Account | Daluyang Dunong" />

            <div className="flex w-full max-w-sm flex-col gap-6">
                {/* Logo/Brand */}
                <Link href={home.url()} className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
                        <img
                            src="https://www.daluyangdunong.minsu.edu.ph/img/mrj1.3083946c.png"
                            className="size-8 object-contain"
                            alt="Daluyang Dunong"
                        />
                    </div>
                    Daluyang Dunong
                </Link>

                {/* Registration Card */}
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="font-serif text-xl text-oxford-blue">Create your account</CardTitle>
                        <CardDescription>
                            Enter your information below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form 
                            action={registerRoute.url()} 
                            method="post"
                            resetOnSuccess
                        >
                            {({ errors, processing, clearErrors }) => (
                                <FieldGroup>
                                    {/* Name Fields */}
                                    <Field className="grid grid-cols-2 gap-4">
                                        <Field data-invalid={!!errors.firstname}>
                                            <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                                            <Input
                                                id="firstname"
                                                name="firstname"
                                                type="text"
                                                placeholder="John"
                                                onChange={() => {
                                                    if (errors.firstname) {
                                                        clearErrors('firstname');
                                                    }
                                                }}
                                                required
                                                autoComplete="given-name"
                                            />
                                            {errors.firstname && <FieldError>{errors.firstname}</FieldError>}
                                        </Field>

                                        <Field data-invalid={!!errors.lastname}>
                                            <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                                            <Input
                                                id="lastname"
                                                name="lastname"
                                                type="text"
                                                placeholder="Doe"
                                                onChange={() => {
                                                    if (errors.lastname) {
                                                        clearErrors('lastname');
                                                    }
                                                }}
                                                autoComplete="family-name"
                                            />
                                            {errors.lastname && <FieldError>{errors.lastname}</FieldError>}
                                        </Field>
                                    </Field>

                                    {/* Email */}
                                    <Field data-invalid={!!errors.email}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            onChange={() => {
                                                if (errors.email) {
                                                    clearErrors('email');
                                                }
                                            }}
                                            required
                                            autoComplete="email"
                                        />
                                        {errors.email && <FieldError>{errors.email}</FieldError>}
                                    </Field>

                                    {/* Username */}
                                    <Field data-invalid={!!errors.username}>
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <Input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="johndoe"
                                            onChange={() => {
                                                if (errors.username) {
                                                    clearErrors('username');
                                                }
                                            }}
                                            required
                                            autoComplete="username"
                                        />
                                        {errors.username && <FieldError>{errors.username}</FieldError>}
                                    </Field>

                                    {/* Password Fields */}
                                    <Field className="grid grid-cols-2 gap-4">
                                        <Field data-invalid={!!errors.password}>
                                            <FieldLabel htmlFor="password">Password</FieldLabel>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                onChange={() => {
                                                    if (errors.password) {
                                                        clearErrors('password');
                                                    }
                                                }}
                                                required
                                                autoComplete="new-password"
                                            />
                                            {errors.password && <FieldError>{errors.password}</FieldError>}
                                        </Field>

                                        <Field data-invalid={!!errors.password_confirmation}>
                                            <FieldLabel htmlFor="password_confirmation">
                                                Confirm Password
                                            </FieldLabel>
                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type="password"
                                                onChange={() => {
                                                    if (errors.password_confirmation) {
                                                        clearErrors('password_confirmation');
                                                    }
                                                }}
                                                required
                                                autoComplete="new-password"
                                            />
                                            {errors.password_confirmation && <FieldError>{errors.password_confirmation}</FieldError>}
                                        </Field>
                                    </Field>

                                    {/* Submit Button */}
                                    <Field>
                                        <Button 
                                            type="submit" 
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            {processing ? 'Creating account...' : 'Create Account'}
                                        </Button>
                                        <FieldDescription className="text-center">
                                            Already have an account?{' '}
                                            <Link href={loginRoute.url()} className="underline underline-offset-4">
                                                Sign in
                                            </Link>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            )}
                        </Form>
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
