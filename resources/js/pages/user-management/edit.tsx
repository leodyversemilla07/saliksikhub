import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { getData } from 'country-list';
import React, { useEffect } from 'react';
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
import type { User, UserRole } from '@/types';

interface EditUserProps {
    user: User;
    errors: Record<string, string>;
    roles: UserRole[];
}

interface Country {
    code: string;
    name: string;
}

export default function EditUser({ user, errors, roles }: EditUserProps) {
    const breadcrumbItems = [
        { label: 'Dashboard', href: dashboard.url() },
        { label: 'User Management', href: users.index.url() },
        {
            label: `${user.firstname} ${user.lastname}`,
            href: users.edit.url({ user: user.id }),
            current: true,
        },
    ];

    type FormData = {
        id: number;
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

    const { data, setData, put, processing, reset } = useForm<FormData>({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username || '',
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role || '',
        affiliation: user.affiliation || '',
        country: user.country || '',
    });

    useEffect(() => {
        setData({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username || '',
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.role || '',
            affiliation: user.affiliation || '',
            country: user.country || '',
        });
        reset();
    }, [user, setData, reset]);

    const countries: Country[] = getData().map(({ code, name }) => ({
        code,
        name,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof FormData, value);
    };

    const handleRoleChange = (value: string) => {
        setData('role', value);
    };

    const handleCountryChange = (value: string) => {
        setData('country', value);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(users.update.url({ user: user.id }), {
            onSuccess: () => {
                toast('User has been successfully updated.');
            },
            onError: () => {
                toast('Failed to update user information.');
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Edit User" />
            <div className="mx-auto max-w-lg rounded-xl bg-background p-8 text-foreground shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold">
                    Edit User Account
                </h1>
                <p className="mb-6 text-center text-muted-foreground">
                    Update user profile information, role, and optionally change
                    password
                </p>
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col gap-5">
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="edit-firstname"
                                className="font-medium text-foreground"
                            >
                                First Name
                            </Label>
                            <Input
                                id="edit-firstname"
                                name="firstname"
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
                                htmlFor="edit-lastname"
                                className="font-medium text-foreground"
                            >
                                Last Name
                            </Label>
                            <Input
                                id="edit-lastname"
                                name="lastname"
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
                                htmlFor="edit-username"
                                className="font-medium text-foreground"
                            >
                                Username
                            </Label>
                            <Input
                                id="edit-username"
                                name="username"
                                value={data.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="border bg-background text-foreground"
                            />
                            <InputError
                                message={errors.username}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="edit-email"
                                className="font-medium text-foreground"
                            >
                                Email Address
                            </Label>
                            <Input
                                id="edit-email"
                                name="email"
                                type="email"
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
                                htmlFor="edit-affiliation"
                                className="font-medium text-foreground"
                            >
                                Affiliation (Optional)
                            </Label>
                            <Input
                                id="edit-affiliation"
                                name="affiliation"
                                value={data.affiliation}
                                onChange={handleChange}
                                placeholder="University, organization, etc."
                                className="border bg-background text-foreground"
                            />
                            <InputError
                                message={errors.affiliation}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="edit-country"
                                className="font-medium text-foreground"
                            >
                                Country (Optional)
                            </Label>
                            <Select
                                value={data.country}
                                onValueChange={handleCountryChange}
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
                                htmlFor="edit-password"
                                className="font-medium text-foreground"
                            >
                                Password
                            </Label>
                            <Input
                                id="edit-password"
                                name="password"
                                type="password"
                                placeholder="Enter new password (optional)"
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
                                htmlFor="edit-password_confirmation"
                                className="font-medium text-foreground"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="edit-password_confirmation"
                                name="password_confirmation"
                                type="password"
                                placeholder="Confirm new password"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                className="border bg-background text-foreground"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label
                                htmlFor="edit-role"
                                className="font-medium text-foreground"
                            >
                                Role
                            </Label>
                            <Select
                                value={data.role}
                                onValueChange={handleRoleChange}
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
