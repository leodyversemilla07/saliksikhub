import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import admin from '@/routes/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, BookOpen, FileText, Menu, Palette } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Institution {
    id: number;
    name: string;
    abbreviation?: string | null;
}

interface Journal {
    id: number;
    institution_id: number;
    name: string;
    slug: string;
    abbreviation?: string | null;
    description?: string | null;
    issn?: string | null;
    eissn?: string | null;
    logo_path?: string | null;
    cover_image_path?: string | null;
    submission_guidelines?: string | null;
    review_policy?: string | null;
    publication_frequency?: string | null;
    is_active: boolean;
}

interface Props {
    journal: Journal;
    institutions: Institution[];
}

export default function EditJournal({ journal, institutions }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        journal.logo_path ? `/storage/${journal.logo_path}` : null
    );
    const [coverPreview, setCoverPreview] = useState<string | null>(
        journal.cover_image_path ? `/storage/${journal.cover_image_path}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        institution_id: journal.institution_id.toString(),
        name: journal.name,
        abbreviation: journal.abbreviation || '',
        description: journal.description || '',
        issn: journal.issn || '',
        eissn: journal.eissn || '',
        logo: null as File | null,
        cover_image: null as File | null,
        submission_guidelines: journal.submission_guidelines || '',
        review_policy: journal.review_policy || '',
        publication_frequency: journal.publication_frequency || '',
        is_active: journal.is_active,
    });

    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals', href: admin.journals.index.url() },
        { label: `Edit: ${journal.name}` },
    ];

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/journals/${journal.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Edit ${journal.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/journals">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Journal</h1>
                        <p className="text-muted-foreground">
                            Update {journal.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>
                                        Enter the basic details of the journal
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="institution_id">Institution *</Label>
                                        <Select
                                            value={data.institution_id}
                                            onValueChange={(value) => setData('institution_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an institution" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {institutions.map((institution) => (
                                                    <SelectItem
                                                        key={institution.id}
                                                        value={institution.id.toString()}
                                                    >
                                                        {institution.name}
                                                        {institution.abbreviation && ` (${institution.abbreviation})`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.institution_id && (
                                            <p className="text-sm text-destructive">{errors.institution_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Journal Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g., Research Journal"
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
                                            placeholder="e.g., MRJ"
                                        />
                                        {errors.abbreviation && (
                                            <p className="text-sm text-destructive">{errors.abbreviation}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Brief description of the journal"
                                            rows={4}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-destructive">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="issn">ISSN (Print)</Label>
                                            <Input
                                                id="issn"
                                                value={data.issn}
                                                onChange={(e) => setData('issn', e.target.value)}
                                                placeholder="e.g., 1234-5678"
                                            />
                                            {errors.issn && (
                                                <p className="text-sm text-destructive">{errors.issn}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="eissn">eISSN (Online)</Label>
                                            <Input
                                                id="eissn"
                                                value={data.eissn}
                                                onChange={(e) => setData('eissn', e.target.value)}
                                                placeholder="e.g., 1234-5679"
                                            />
                                            {errors.eissn && (
                                                <p className="text-sm text-destructive">{errors.eissn}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="publication_frequency">Publication Frequency</Label>
                                        <Input
                                            id="publication_frequency"
                                            value={data.publication_frequency}
                                            onChange={(e) => setData('publication_frequency', e.target.value)}
                                            placeholder="e.g., Bi-annual, Quarterly"
                                        />
                                        {errors.publication_frequency && (
                                            <p className="text-sm text-destructive">{errors.publication_frequency}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Policies</CardTitle>
                                    <CardDescription>
                                        Submission and review policies
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="submission_guidelines">Submission Guidelines</Label>
                                        <Textarea
                                            id="submission_guidelines"
                                            value={data.submission_guidelines}
                                            onChange={(e) => setData('submission_guidelines', e.target.value)}
                                            placeholder="Enter submission guidelines for authors"
                                            rows={5}
                                        />
                                        {errors.submission_guidelines && (
                                            <p className="text-sm text-destructive">{errors.submission_guidelines}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="review_policy">Review Policy</Label>
                                        <Textarea
                                            id="review_policy"
                                            value={data.review_policy}
                                            onChange={(e) => setData('review_policy', e.target.value)}
                                            placeholder="Enter peer review policy"
                                            rows={5}
                                        />
                                        {errors.review_policy && (
                                            <p className="text-sm text-destructive">{errors.review_policy}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Branding</CardTitle>
                                    <CardDescription>
                                        Upload journal logo and cover image
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
                                                    <BookOpen className="h-6 w-6 text-muted-foreground" />
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

                                    <div className="space-y-2">
                                        <Label htmlFor="cover_image">Cover Image</Label>
                                        <div className="space-y-2">
                                            {coverPreview ? (
                                                <img
                                                    src={coverPreview}
                                                    alt="Cover preview"
                                                    className="w-full h-32 rounded object-cover border"
                                                />
                                            ) : (
                                                <div className="w-full h-32 rounded border-2 border-dashed flex items-center justify-center">
                                                    <span className="text-muted-foreground text-sm">
                                                        Cover image preview
                                                    </span>
                                                </div>
                                            )}
                                            <Input
                                                id="cover_image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverChange}
                                                className="cursor-pointer"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Max 4MB. Recommended: 1200x400px
                                            </p>
                                        </div>
                                        {errors.cover_image && (
                                            <p className="text-sm text-destructive">{errors.cover_image}</p>
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
                                                Only active journals accept submissions
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

                            {/* CMS Management Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Website Content Management</CardTitle>
                                    <CardDescription>
                                        Manage the public-facing website for this journal
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/admin/journals/${journal.id}/cms/pages`}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Manage Pages
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/admin/journals/${journal.id}/cms/menus`}>
                                            <Menu className="mr-2 h-4 w-4" />
                                            Manage Menus
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/admin/journals/${journal.id}/cms/theme`}>
                                            <Palette className="mr-2 h-4 w-4" />
                                            Theme Settings
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" asChild>
                            <Link href="/admin/journals">Cancel</Link>
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
