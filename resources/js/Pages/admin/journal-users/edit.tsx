import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface JournalUserData {
    pivot_id: number;
    user: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
        role: string;
        affiliation: string | null;
    };
    role: string;
    is_active: boolean;
    assigned_at: string | null;
}

interface Props {
    journalUser: JournalUserData;
    roles: Record<string, string>;
}

export default function EditJournalUser({ journalUser, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        role: journalUser.role,
        is_active: journalUser.is_active,
    });

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin/journal-users' },
        { label: 'Journal Users', href: '/admin/journal-users' },
        { label: 'Edit Assignment' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/journal-users/${journalUser.pivot_id}`);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Edit Journal User Assignment" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/journal-users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Assignment</h1>
                        <p className="text-muted-foreground">
                            Update the role or status for this journal user assignment
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <form onSubmit={submit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assignment Settings</CardTitle>
                                    <CardDescription>
                                        Modify the role and active status of this assignment
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Journal Role *</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(value) => setData('role', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(roles).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.role && (
                                            <p className="text-sm text-destructive">{errors.role}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is_active">Active</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Inactive assignments are preserved but the user cannot act in this role
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                    </div>
                                    {errors.is_active && (
                                        <p className="text-sm text-destructive">{errors.is_active}</p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex justify-end gap-4 mt-6">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/journal-users">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>User Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p className="font-medium">
                                        {journalUser.user.firstname} {journalUser.user.lastname}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-sm">{journalUser.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">System Role</p>
                                    <Badge variant="outline">{journalUser.user.role || '-'}</Badge>
                                </div>
                                {journalUser.user.affiliation && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Affiliation</p>
                                        <p className="text-sm">{journalUser.user.affiliation}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Assigned Date</p>
                                    <p className="text-sm">{formatDate(journalUser.assigned_at)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
