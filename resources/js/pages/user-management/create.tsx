import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { getData } from 'country-list';
import React from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import users from '@/routes/users';

interface CreateUserProps {
    roles: string[];
    errors: Record<string, string>;
}

interface Country {
    code: string;
    name: string;
}

type FormData = {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    affiliation: string;
    country: string;
};

export default function CreateUser({ roles, errors }: CreateUserProps) {
    const breadcrumbItems = [
        { label: 'Dashboard', href: dashboard.url() },
        { label: 'User Management', href: users.index.url() },
        { label: 'Add User', href: users.create.url(), current: true },
    ];

    const { data, setData, post, processing, reset } = useForm<FormData>({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: roles[0] || '',
        affiliation: '',
        country: '',
    });

    const countries: Country[] = getData().map(({ code, name }) => ({
        code,
        name,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof FormData, value ?? '');
    };

    const handleRoleChange = (value: string) => {
        setData('role', value ?? '');
    };

    const handleCountryChange = (value: string) => {
        setData('country', value ?? '');
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(users.store.url(), {
            onSuccess: () => {
                reset();
                toast('User has been successfully created.');
            },
            onError: () => {
                toast(
                    'Failed to create user. Please check the form and try again.',
                );
            },
            preserveScroll: true,
            preserveState: false,
            only: ['users'],
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Add User" />
            <div className="mx-auto max-w-lg rounded-xl bg-background p-8 text-foreground shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold">
                    Add New User
                </h1>
                <p className="mb-6 text-center text-muted-foreground">
                    Create a new user account and assign roles
                </p>
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col gap-5">
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="firstname"
                                className="font-medium text-foreground"
                            >
                                First Name
                            </Label>
                            <Input
                                id="firstname"
                                name="firstname"
                                placeholder="Enter first name"
                                value={data.firstname}
                                onChange={handleChange}
                                className="border bg-background text-foreground"
                            />
                            <InputError
                                message={errors.firstname}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="lastname"
                                className="font-medium text-foreground"
                            >
                                Last Name
                            </Label>
                            <Input
                                id="lastname"
                                name="lastname"
                                placeholder="Enter last name"
                                value={data.lastname}
                                onChange={handleChange}
                                className="border bg-background text-foreground"
                            />
                            <InputError
                                message={errors.lastname}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="username"
                                className="font-medium text-foreground"
                            >
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                value={data.username}
                                onChange={handleChange}
                                className="border bg-background text-foreground"
                            />
                            <InputError
                                message={errors.username}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="email"
                                className="font-medium text-foreground"
                            >
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="user@example.com"
                                value={data.email}
                                onChange={handleChange}
                                className="border bg-background text-foreground"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="affiliation"
                                className="font-medium text-foreground"
                            >
                                Affiliation (Optional)
                            </Label>
                            <Input
                                id="affiliation"
                                name="affiliation"
                                placeholder="University, organization, etc."
                                value={data.affiliation}
                                onChange={handleChange}
                                className="border bg-background text-foreground"
                            />
                            <InputError
                                message={errors.affiliation}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="country"
                                className="font-medium text-foreground"
                            >
                                Country (Optional)
                            </Label>
                            <Select
                                value={data.country}
                                onValueChange={(value) => {
                                    if (value !== null) {
                                        handleCountryChange(value);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full border bg-background text-foreground">
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 w-full border bg-background text-foreground">
                                    {countries.map((country) => (
                                        <SelectItem
                                            key={country.code}
                                            value={country.name}
                                        >
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errors.country}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="password"
                                className="font-medium text-foreground"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                value={data.password}
                                onChange={handleChange}
                                className="border bg-background text-foreground"
                            />
                            <InputError
                                message={errors.password}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="font-medium text-foreground"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                placeholder="Confirm password"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                className="border bg-background text-foreground"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="role"
                                className="font-medium text-foreground"
                            >
                                Role
                            </Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) => {
                                    if (value !== null) {
                                        handleRoleChange(value);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full border bg-background text-foreground">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="w-full border bg-background text-foreground">
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role
                                                .replace(/_/g, ' ')
                                                .replace(/\b\w/g, (c) =>
                                                    c.toUpperCase(),
                                                )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errors.role}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                            {processing ? 'Creating User...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
