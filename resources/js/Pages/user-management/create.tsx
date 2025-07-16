import React from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { getData } from 'country-list';

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
        { label: 'Dashboard', href: route('dashboard') },
        { label: 'User Management', href: route('users.index') },
        { label: 'Add User', href: route('users.create'), current: true },
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
        country: ''
    });

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

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                reset();
                toast("User has been successfully created.");
            },
            onError: () => {
                toast("Failed to create user. Please check the form and try again.");
            },
            preserveScroll: true,
            preserveState: false,
            only: ['users'],
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Add User" />
            <div className="max-w-lg mx-auto p-8 rounded-xl shadow-lg bg-background text-foreground">
                <h1 className="text-3xl font-bold text-center mb-2">Add New User</h1>
                <p className="text-center text-muted-foreground mb-6">Create a new user account and assign roles</p>
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col gap-5">
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="firstname" className="font-medium text-foreground">First Name</Label>
                            <Input
                                id="firstname"
                                name="firstname"
                                placeholder="Enter first name"
                                value={data.firstname}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.firstname} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="lastname" className="font-medium text-foreground">Last Name</Label>
                            <Input
                                id="lastname"
                                name="lastname"
                                placeholder="Enter last name"
                                value={data.lastname}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.lastname} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="username" className="font-medium text-foreground">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                value={data.username}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.username} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="email" className="font-medium text-foreground">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="user@example.com"
                                value={data.email}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="affiliation" className="font-medium text-foreground">Affiliation (Optional)</Label>
                            <Input
                                id="affiliation"
                                name="affiliation"
                                placeholder="University, organization, etc."
                                value={data.affiliation}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.affiliation} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="country" className="font-medium text-foreground">Country (Optional)</Label>
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
                            <Label htmlFor="password" className="font-medium text-foreground">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                value={data.password}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="password_confirmation" className="font-medium text-foreground">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                placeholder="Confirm password"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                className="bg-background text-foreground border"
                            />
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="role" className="font-medium text-foreground">Role</Label>
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
                            {processing ? 'Creating User...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
