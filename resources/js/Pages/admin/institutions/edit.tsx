import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import admin from '@/routes/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Building2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Institution {
    id: number;
    name: string;
    slug: string;
    abbreviation?: string | null;
    domain?: string | null;
    logo_path?: string | null;
    address?: string | null;
    contact_email?: string | null;
    website?: string | null;
    is_active: boolean;
}

interface Props {
    institution: Institution;
}

export default function EditInstitution({ institution }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        institution.logo_path ? `/storage/${institution.logo_path}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: institution.name,
        abbreviation: institution.abbreviation || '',
        domain: institution.domain || '',
        logo: null as File | null,
        address: institution.address || '',
        contact_email: institution.contact_email || '',
        website: institution.website || '',
        is_active: institution.is_active,
    });

    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Institutions', href: admin.institutions.index.url() },
        { label: `Edit: ${institution.name}` },
    ];

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/institutions/${institution.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Edit ${institution.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/institutions">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Institution</h1>
                        <p className="text-muted-foreground">
                            Update {institution.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Enter the basic details of the institution
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Institution Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Mindoro State University"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="abbreviation">Abbreviation</Label>
                                    <Input
                                        id="abbreviation"
                                        value={data.abbreviation}
                                        onChange={(e) => setData('abbreviation', e.target.value)}
                                        placeholder="e.g., MinSU"
                                    />
                                    {errors.abbreviation && (
                                        <p className="text-sm text-destructive">{errors.abbreviation}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="domain">Domain</Label>
                                    <Input
                                        id="domain"
                                        value={data.domain}
                                        onChange={(e) => setData('domain', e.target.value)}
                                        placeholder="e.g., minsu.edu.ph"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        The domain used to identify this institution's journals
                                    </p>
                                    {errors.domain && (
                                        <p className="text-sm text-destructive">{errors.domain}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Enter institution address"
                                        rows={3}
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-destructive">{errors.address}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                    <CardDescription>
                                        Contact details for the institution
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_email">Contact Email</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            placeholder="e.g., info@minsu.edu.ph"
                                        />
                                        {errors.contact_email && (
                                            <p className="text-sm text-destructive">{errors.contact_email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="e.g., https://www.minsu.edu.ph"
                                        />
                                        {errors.website && (
                                            <p className="text-sm text-destructive">{errors.website}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Branding</CardTitle>
                                    <CardDescription>
                                        Upload the institution logo
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Logo</Label>
                                        <div className="flex items-center gap-4">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="h-16 w-16 rounded object-contain border"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded border-2 border-dashed flex items-center justify-center">
                                                    <Building2 className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <Input
                                                    id="logo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className="cursor-pointer"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Max 2MB. Recommended: 200x200px
                                                </p>
                                            </div>
                                        </div>
                                        {errors.logo && (
                                            <p className="text-sm text-destructive">{errors.logo}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is_active">Active</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Only active institutions can have active journals
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" asChild>
                            <Link href="/admin/institutions">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
