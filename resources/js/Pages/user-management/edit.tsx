import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { User, UserRole } from '@/types';
import InputError from '@/components/input-error';
import { getData } from 'country-list';

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
        { label: 'Dashboard', href: route('dashboard') },
        { label: 'User Management', href: route('users.index') },
        { label: `${user.firstname} ${user.lastname}`, href: route('users.edit', user.id), current: true },
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
        country: user.country || ''
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
            country: user.country || ''
        });
        reset();
    }, [user, setData, reset]);

    const countries: Country[] = getData().map(({ code, name }) => ({ code, name }));

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id), {
            onSuccess: () => {
                toast("User has been successfully updated.");
            },
            onError: () => {
                toast("Failed to update user information.");
            },
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Edit User" />
            <div className="max-w-lg mx-auto p-8 rounded-xl shadow-lg bg-background text-foreground">
                <h1 className="text-3xl font-bold text-center mb-2">Edit User Account</h1>
                <p className="text-center text-muted-foreground mb-6">Update user profile information, role, and optionally change password</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-5">
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="edit-firstname" className="font-medium text-foreground">First Name</Label>
                            <Input
                                id="edit-firstname"
                                name="firstname"
                                value={data.firstname}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.firstname} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="edit-lastname" className="font-medium text-foreground">Last Name</Label>
                            <Input
                                id="edit-lastname"
                                name="lastname"
                                value={data.lastname}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.lastname} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="edit-username" className="font-medium text-foreground">Username</Label>
                            <Input
                                id="edit-username"
                                name="username"
                                value={data.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.username} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="edit-email" className="font-medium text-foreground">Email Address</Label>
                            <Input
                                id="edit-email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="edit-affiliation" className="font-medium text-foreground">Affiliation (Optional)</Label>
                            <Input
                                id="edit-affiliation"
                                name="affiliation"
                                value={data.affiliation}
                                onChange={handleChange}
                                placeholder="University, organization, etc."
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.affiliation} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="edit-country" className="font-medium text-foreground">Country (Optional)</Label>
                            <Select
                                value={data.country}
                                onValueChange={handleCountryChange}
                            >
                                <SelectTrigger className="w-full bg-background text-foreground border">
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent className="w-full bg-background text-foreground border max-h-60">
                                    {countries.map((country) => (
                                        <SelectItem key={country.code} value={country.name}>
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.country} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="edit-password" className="font-medium text-foreground">Password</Label>
                            <Input
                                id="edit-password"
                                name="password"
                                type="password"
                                placeholder="Enter new password (optional)"
                                value={data.password}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="edit-password_confirmation" className="font-medium text-foreground">Confirm Password</Label>
                            <Input
                                id="edit-password_confirmation"
                                name="password_confirmation"
                                type="password"
                                placeholder="Confirm new password"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="edit-role" className="font-medium text-foreground">Role</Label>
                            <Select
                                value={data.role}
                                onValueChange={handleRoleChange}
                            >
                                <SelectTrigger className="w-full bg-background text-foreground border">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="w-full bg-background text-foreground border">
                                    {roles.map(role => (
                                        <SelectItem key={role} value={role}>
                                            {role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} className="mt-1" />
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
