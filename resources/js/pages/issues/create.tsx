import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import issuesRoutes from '@/routes/issues';

export default function Create() {
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        volume_number: '',
        issue_number: '',
        issue_title: '',
        description: '',
        publication_date: '',
        status: 'draft',
        theme: '',
        editorial_note: '',
        doi: '',
        cover_image: null as File | null,
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
        setData('cover_image', null);
        setCoverImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
            label: 'Create New Issue',
            href: issuesRoutes.create.url(),
        }
    ];    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(issuesRoutes.store.url(), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Create Journal Issue" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Journal Issue Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Volume Number */}
                                    <div>
                                        <Label htmlFor="volume_number">Volume Number *</Label>
                                        <Input
                                            id="volume_number"
                                            type="number"
                                            min="1"
                                            value={data.volume_number}
                                            onChange={(e) => setData('volume_number', e.target.value)}
                                            className={errors.volume_number ? 'border-red-500' : ''}
                                            placeholder="e.g., 3"
                                        />
                                        {errors.volume_number && (
                                            <p className="text-red-500 text-sm mt-1">{errors.volume_number}</p>
                                        )}
                                    </div>

                                    {/* Issue Number */}
                                    <div>
                                        <Label htmlFor="issue_number">Issue Number *</Label>
                                        <Input
                                            id="issue_number"
                                            type="number"
                                            min="1"
                                            value={data.issue_number}
                                            onChange={(e) => setData('issue_number', e.target.value)}
                                            className={errors.issue_number ? 'border-red-500' : ''}
                                            placeholder="e.g., 2"
                                        />
                                        {errors.issue_number && (
                                            <p className="text-red-500 text-sm mt-1">{errors.issue_number}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Issue Title */}
                                <div>
                                    <Label htmlFor="issue_title">Issue Title</Label>
                                    <Input
                                        id="issue_title"
                                        type="text"
                                        value={data.issue_title}
                                        onChange={(e) => setData('issue_title', e.target.value)}
                                        className={errors.issue_title ? 'border-red-500' : ''}
                                        placeholder="Optional descriptive title for this issue"
                                    />
                                    {errors.issue_title && (
                                        <p className="text-red-500 text-sm mt-1">{errors.issue_title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                        placeholder="Brief description of this journal issue..."
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Publication Date */}
                                    <div>
                                        <Label htmlFor="publication_date">Publication Date</Label>
                                        <Input
                                            id="publication_date"
                                            type="date"
                                            value={data.publication_date}
                                            onChange={(e) => setData('publication_date', e.target.value)}
                                            className={errors.publication_date ? 'border-red-500' : ''}
                                        />
                                        {errors.publication_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.publication_date}</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">📝 Draft</SelectItem>
                                                <SelectItem value="in_review">👁️ In Review</SelectItem>
                                                <SelectItem value="published">📚 Published</SelectItem>
                                                <SelectItem value="archived">📦 Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Theme */}                                <div>
                                    <Label htmlFor="theme">Theme/Special Focus</Label>
                                    <Input
                                        id="theme"
                                        type="text"
                                        value={data.theme}
                                        onChange={(e) => setData('theme', e.target.value)}
                                        className={errors.theme ? 'border-red-500' : ''}
                                        placeholder="e.g., 'Climate Change', 'AI in Healthcare'"
                                    />
                                    {errors.theme && (
                                        <p className="text-red-500 text-sm mt-1">{errors.theme}</p>
                                    )}
                                </div>

                                {/* Cover Image Upload */}
                                <div>
                                    <Label htmlFor="cover_image">Cover Image</Label>
                                    <div className="mt-2">
                                        <div className="flex items-center justify-center w-full">
                                            <div className="w-full">
                                                {coverImagePreview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={coverImagePreview}
                                                            alt="Cover image preview"
                                                            className="w-full max-w-md mx-auto h-64 object-cover rounded-lg border border-gray-300"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute top-2 right-2"
                                                            onClick={removeCoverImage}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <label
                                                        htmlFor="cover_image"
                                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500"
                                                    >
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                PNG, JPG, JPEG or WEBP (MAX. 5MB)
                                                            </p>
                                                        </div>
                                                    </label>
                                                )}
                                                <input
                                                    ref={fileInputRef}
                                                    id="cover_image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCoverImageChange}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                        {errors.cover_image && (
                                            <div className="flex items-center gap-2 text-red-600 mt-2">
                                                <AlertCircle className="w-4 h-4" />
                                                <p className="text-sm">{errors.cover_image}</p>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2">
                                            Upload a cover image for this journal issue. Recommended size: 800x1000px or similar aspect ratio.
                                        </p>
                                    </div>
                                </div>

                                {/* DOI */}
                                <div>
                                    <Label htmlFor="doi">DOI</Label>
                                    <Input
                                        id="doi"
                                        type="text"
                                        value={data.doi}
                                        onChange={(e) => setData('doi', e.target.value)}
                                        className={errors.doi ? 'border-red-500' : ''}
                                        placeholder="e.g., 10.1234/journal.v3i2"
                                    />
                                    {errors.doi && (
                                        <p className="text-red-500 text-sm mt-1">{errors.doi}</p>
                                    )}
                                </div>

                                {/* Editorial Note */}
                                <div>
                                    <Label htmlFor="editorial_note">Editorial Note</Label>
                                    <Textarea
                                        id="editorial_note"
                                        value={data.editorial_note}
                                        onChange={(e) => setData('editorial_note', e.target.value)}
                                        className={errors.editorial_note ? 'border-red-500' : ''}
                                        placeholder="Editorial comments or notes for this issue..."
                                        rows={3}
                                    />
                                    {errors.editorial_note && (
                                        <p className="text-red-500 text-sm mt-1">{errors.editorial_note}</p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit('/issues')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Journal Issue'}
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
