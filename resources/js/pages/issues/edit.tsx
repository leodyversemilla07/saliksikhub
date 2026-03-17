import { Head, useForm, router } from '@inertiajs/react';
import {
    Upload,
    X,
    AlertCircle,
    FileText,
    Eye,
    BookOpen,
    Archive,
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import issuesRoutes from '@/routes/issues';

interface JournalIssue {
    id: number;
    volume_number: number;
    issue_number: number;
    issue_title: string | null;
    description: string | null;
    publication_date: string | null;
    status: 'draft' | 'in_review' | 'published' | 'archived';
    cover_image: string | null;
    doi: string | null;
    theme: string | null;
    editorial_note: string | null;
    user: {
        id: number;
        name: string;
    };
}

interface EditProps {
    issue: JournalIssue;
}

export default function Edit({ issue }: EditProps) {
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
        null,
    );
    const [hasExistingImage, setHasExistingImage] = useState<boolean>(
        !!issue.cover_image,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize with existing image if available
    React.useEffect(() => {
        if (issue.cover_image && !coverImagePreview) {
            setCoverImagePreview(`/storage/${issue.cover_image}`);
        }
    }, [issue.cover_image, coverImagePreview]);

    const { data, setData, post, processing, errors } = useForm({
        volume_number: issue.volume_number.toString(),
        issue_number: issue.issue_number.toString(),
        issue_title: issue.issue_title || '',
        description: issue.description || '',
        publication_date: issue.publication_date
            ? issue.publication_date.split('T')[0]
            : '',
        status: issue.status,
        theme: issue.theme || '',
        editorial_note: issue.editorial_note || '',
        doi: issue.doi || '',
        cover_image: null as File | null,
        _method: 'PUT' as const,
    });

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file (jpg, jpeg, png, webp)');

                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');

                return;
            }

            setData('cover_image', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const removeCoverImage = () => {
        setCoverImagePreview(null);
        setHasExistingImage(false);
        setData('cover_image', null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(issuesRoutes.update.url({ id: issue.id }), {
            forceFormData: true,
        });
    };

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: dashboard.url(),
        },
        {
            label: 'Journal Issues',
            href: issuesRoutes.index.url(),
        },
        {
            label: `Vol. ${issue.volume_number}, Issue ${issue.issue_number}`,
            href: issuesRoutes.show.url({ id: issue.id }),
        },
        {
            label: 'Edit',
            href: issuesRoutes.edit.url({ id: issue.id }),
        },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head
                title={`Edit Journal Issue - Vol. ${issue.volume_number}, Issue ${issue.issue_number}`}
            />
            <div className="py-12">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Journal Issue Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information Section */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    {/* Volume Number */}
                                    <div>
                                        <Label htmlFor="volume_number">
                                            Volume Number *
                                        </Label>
                                        <Input
                                            id="volume_number"
                                            type="number"
                                            min="1"
                                            value={data.volume_number}
                                            onChange={(e) =>
                                                setData(
                                                    'volume_number',
                                                    e.target.value,
                                                )
                                            }
                                            className={
                                                errors.volume_number
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                            placeholder="e.g., 3"
                                        />
                                        {errors.volume_number && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.volume_number}
                                            </p>
                                        )}
                                    </div>

                                    {/* Issue Number */}
                                    <div>
                                        <Label htmlFor="issue_number">
                                            Issue Number *
                                        </Label>
                                        <Input
                                            id="issue_number"
                                            type="number"
                                            min="1"
                                            value={data.issue_number}
                                            onChange={(e) =>
                                                setData(
                                                    'issue_number',
                                                    e.target.value,
                                                )
                                            }
                                            className={
                                                errors.issue_number
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                            placeholder="e.g., 2"
                                        />
                                        {errors.issue_number && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.issue_number}
                                            </p>
                                        )}
                                    </div>

                                    {/* Publication Date */}
                                    <div>
                                        <Label htmlFor="publication_date">
                                            Publication Date
                                        </Label>
                                        <Input
                                            id="publication_date"
                                            type="date"
                                            value={data.publication_date}
                                            onChange={(e) =>
                                                setData(
                                                    'publication_date',
                                                    e.target.value,
                                                )
                                            }
                                            className={
                                                errors.publication_date
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        {errors.publication_date && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.publication_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData(
                                                    'status',
                                                    value as
                                                        | 'draft'
                                                        | 'in_review'
                                                        | 'published'
                                                        | 'archived',
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                className={
                                                    errors.status
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        Draft
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="in_review">
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="h-4 w-4" />
                                                        In Review
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="published">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4" />
                                                        Published
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="archived">
                                                    <div className="flex items-center gap-2">
                                                        <Archive className="h-4 w-4" />
                                                        Archived
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                    <div className="space-y-6">
                                        {/* Issue Title */}
                                        <div>
                                            <Label htmlFor="issue_title">
                                                Issue Title
                                            </Label>
                                            <Input
                                                id="issue_title"
                                                type="text"
                                                value={data.issue_title}
                                                onChange={(e) =>
                                                    setData(
                                                        'issue_title',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.issue_title
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                placeholder="Optional descriptive title for this issue"
                                            />
                                            {errors.issue_title && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.issue_title}
                                                </p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <Label htmlFor="description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.description
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                placeholder="Brief description of this journal issue..."
                                                rows={4}
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Theme */}
                                        <div>
                                            <Label htmlFor="theme">
                                                Theme/Special Focus
                                            </Label>
                                            <Input
                                                id="theme"
                                                type="text"
                                                value={data.theme}
                                                onChange={(e) =>
                                                    setData(
                                                        'theme',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.theme
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                placeholder="e.g., 'Climate Change', 'AI in Healthcare'"
                                            />
                                            {errors.theme && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.theme}
                                                </p>
                                            )}
                                        </div>

                                        {/* DOI */}
                                        <div>
                                            <Label htmlFor="doi">DOI</Label>
                                            <Input
                                                id="doi"
                                                type="text"
                                                value={data.doi}
                                                onChange={(e) =>
                                                    setData(
                                                        'doi',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.doi
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                placeholder="e.g., 10.1234/journal.v3i2"
                                            />
                                            {errors.doi && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.doi}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Cover Image Upload */}
                                        <div>
                                            <Label htmlFor="cover_image">
                                                Cover Image
                                            </Label>
                                            <div className="mt-2">
                                                <div className="flex w-full items-center justify-center">
                                                    <div className="w-full">
                                                        {coverImagePreview ||
                                                        hasExistingImage ? (
                                                            <div className="relative">
                                                                {' '}
                                                                <img
                                                                    src={
                                                                        coverImagePreview ||
                                                                        `/storage/${issue.cover_image}`
                                                                    }
                                                                    alt="Cover image preview"
                                                                    className="h-80 w-full rounded-lg border border-gray-300 object-cover"
                                                                    onError={() => {
                                                                        setHasExistingImage(
                                                                            false,
                                                                        );
                                                                        setCoverImagePreview(
                                                                            null,
                                                                        );
                                                                    }}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="absolute top-2 right-2"
                                                                    onClick={
                                                                        removeCoverImage
                                                                    }
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <label
                                                                htmlFor="cover_image"
                                                                className="flex h-80 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                                                            >
                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                    <Upload className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                        <span className="font-semibold">
                                                                            Click
                                                                            to
                                                                            upload
                                                                        </span>{' '}
                                                                        or drag
                                                                        and drop
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        PNG,
                                                                        JPG,
                                                                        JPEG or
                                                                        WEBP
                                                                        (MAX.
                                                                        5MB)
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        )}
                                                        <input
                                                            ref={fileInputRef}
                                                            id="cover_image"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={
                                                                handleCoverImageChange
                                                            }
                                                            className="hidden"
                                                        />
                                                    </div>
                                                </div>
                                                {errors.cover_image && (
                                                    <div className="mt-2 flex items-center gap-2 text-red-600">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <p className="text-sm">
                                                            {errors.cover_image}
                                                        </p>
                                                    </div>
                                                )}
                                                <p className="mt-2 text-xs text-gray-500">
                                                    Upload a cover image for
                                                    this journal issue.
                                                    Recommended size: 800x1000px
                                                    or similar aspect ratio.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Editorial Note - Full Width */}
                                <div>
                                    <Label htmlFor="editorial_note">
                                        Editorial Note
                                    </Label>
                                    <Textarea
                                        id="editorial_note"
                                        value={data.editorial_note}
                                        onChange={(e) =>
                                            setData(
                                                'editorial_note',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            errors.editorial_note
                                                ? 'border-red-500'
                                                : ''
                                        }
                                        placeholder="Editorial comments or notes for this issue..."
                                        rows={4}
                                    />
                                    {errors.editorial_note && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.editorial_note}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.visit(`/issues/${issue.id}`)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Updating...'
                                            : 'Update Journal Issue'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
