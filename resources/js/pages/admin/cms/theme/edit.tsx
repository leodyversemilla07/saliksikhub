import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Palette,
    Type,
    Layout,
    Image,
    RotateCcw,
    Save,
    Eye,
    Upload,
} from 'lucide-react';
import { useState, useRef } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import admin from '@/routes/admin';

interface ThemeSettings {
    colors: {
        primary: string;
        primary_foreground: string;
        secondary: string;
        secondary_foreground: string;
        accent: string;
        background: string;
        foreground: string;
        muted: string;
        muted_foreground: string;
        border: string;
    };
    typography: {
        heading_font: string;
        font_family: string;
        base_size: string;
    };
    layout: {
        max_width: string;
        header_style: string;
        footer_style: string;
    };
    branding: {
        show_institution_logo: boolean;
        show_journal_name: boolean;
        favicon: string | null;
    };
}

interface Journal {
    id: number;
    name: string;
    theme_settings: ThemeSettings | null;
}

interface Props {
    journal: Journal;
    themeSettings: ThemeSettings;
    fonts: string[];
    headerStyles: Record<string, string>;
    footerStyles: Record<string, string>;
}

export default function ThemeEdit({
    journal,
    themeSettings,
    fonts,
    headerStyles,
    footerStyles,
}: Props) {
    const faviconInputRef = useRef<HTMLInputElement>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals', href: admin.journals.index.url() },
        {
            label: journal.name,
            href: admin.journals.edit.url({ journal: journal.id }),
        },
        { label: 'CMS - Theme' },
    ];

    const { data, setData, put, processing, isDirty } =
        useForm<ThemeSettings>(themeSettings);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/journals/${journal.id}/cms/theme`);
    };

    const handleReset = () => {
        router.post(
            `/admin/journals/${journal.id}/cms/theme/reset`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setFaviconPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('favicon', file);

        router.post(
            `/admin/journals/${journal.id}/cms/theme/favicon`,
            formData,
            {
                preserveScroll: true,
            },
        );
    };

    const updateNestedData = (
        category: keyof ThemeSettings,
        key: string,
        value: string | boolean,
    ) => {
        setData({
            ...data,
            [category]: {
                ...(data[category] as Record<string, unknown>),
                [key]: value,
            },
        });
    };

    const colorInputs = [
        {
            key: 'primary',
            label: 'Primary Color',
            description: 'Main brand color for buttons and accents',
        },
        {
            key: 'primary_foreground',
            label: 'Primary Foreground',
            description: 'Text color on primary backgrounds',
        },
        {
            key: 'secondary',
            label: 'Secondary Color',
            description: 'Supporting color for secondary elements',
        },
        {
            key: 'secondary_foreground',
            label: 'Secondary Foreground',
            description: 'Text color on secondary backgrounds',
        },
        {
            key: 'accent',
            label: 'Accent Color',
            description: 'Highlights and call-to-action elements',
        },
        {
            key: 'background',
            label: 'Background',
            description: 'Page background color',
        },
        {
            key: 'foreground',
            label: 'Foreground',
            description: 'Main body text color',
        },
        {
            key: 'muted',
            label: 'Muted Background',
            description: 'Subtle backgrounds for cards and sections',
        },
        {
            key: 'muted_foreground',
            label: 'Muted Foreground',
            description: 'Text color for secondary/muted content',
        },
        {
            key: 'border',
            label: 'Border Color',
            description: 'Borders and dividers',
        },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Theme Settings - ${journal.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            render={
                                <Link
                                    href={admin.journals.edit.url({
                                        journal: journal.id,
                                    })}
                                />
                            }
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Theme Settings
                            </h1>
                            <p className="text-muted-foreground">
                                {journal.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            render={
                                <a
                                    href={`/journals/${journal.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            }
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview Site
                        </Button>
                    </div>
                </div>

                {/* CMS Navigation */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        render={
                            <Link
                                href={`/admin/journals/${journal.id}/cms/pages`}
                            />
                        }
                    >
                        Pages
                    </Button>
                    <Button
                        variant="outline"
                        render={
                            <Link
                                href={`/admin/journals/${journal.id}/cms/menus`}
                            />
                        }
                    >
                        Menus
                    </Button>
                    <Button variant="default">Theme</Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Settings */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Colors */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5" />
                                        Colors
                                    </CardTitle>
                                    <CardDescription>
                                        Customize the color scheme of your
                                        journal website
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {colorInputs.map((color) => (
                                            <div
                                                key={color.key}
                                                className="space-y-2"
                                            >
                                                <Label
                                                    htmlFor={`color-${color.key}`}
                                                >
                                                    {color.label}
                                                </Label>
                                                <div className="flex gap-2">
                                                    <div
                                                        className="h-10 w-10 flex-shrink-0 cursor-pointer rounded-md border"
                                                        style={{
                                                            backgroundColor:
                                                                data.colors[
                                                                    color.key as keyof typeof data.colors
                                                                ],
                                                        }}
                                                    >
                                                        <input
                                                            type="color"
                                                            id={`color-${color.key}`}
                                                            value={
                                                                data.colors[
                                                                    color.key as keyof typeof data.colors
                                                                ]
                                                            }
                                                            onChange={(e) =>
                                                                updateNestedData(
                                                                    'colors',
                                                                    color.key,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-full w-full cursor-pointer opacity-0"
                                                        />
                                                    </div>
                                                    <Input
                                                        value={
                                                            data.colors[
                                                                color.key as keyof typeof data.colors
                                                            ]
                                                        }
                                                        onChange={(e) =>
                                                            updateNestedData(
                                                                'colors',
                                                                color.key,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="flex-1 font-mono uppercase"
                                                        maxLength={7}
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {color.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Typography */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Type className="h-5 w-5" />
                                        Typography
                                    </CardTitle>
                                    <CardDescription>
                                        Choose fonts and text settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="heading-font">
                                                Heading Font
                                            </Label>
                                            <Select
                                                value={
                                                    data.typography.heading_font
                                                }
                                                onValueChange={(value) =>
                                                    updateNestedData(
                                                        'typography',
                                                        'heading_font',
                                                        value ?? '',
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fonts.map((font) => (
                                                        <SelectItem
                                                            key={font}
                                                            value={font}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontFamily:
                                                                        font,
                                                                }}
                                                            >
                                                                {font}
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="body-font">
                                                Body Font
                                            </Label>
                                            <Select
                                                value={
                                                    data.typography.font_family
                                                }
                                                onValueChange={(value) =>
                                                    updateNestedData(
                                                        'typography',
                                                        'font_family',
                                                        value ?? '',
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fonts.map((font) => (
                                                        <SelectItem
                                                            key={font}
                                                            value={font}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontFamily:
                                                                        font,
                                                                }}
                                                            >
                                                                {font}
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="base-size">
                                                Base Font Size
                                            </Label>
                                            <Select
                                                value={
                                                    data.typography.base_size
                                                }
                                                onValueChange={(value) =>
                                                    updateNestedData(
                                                        'typography',
                                                        'base_size',
                                                        value ?? '',
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="14px">
                                                        Small (14px)
                                                    </SelectItem>
                                                    <SelectItem value="16px">
                                                        Medium (16px)
                                                    </SelectItem>
                                                    <SelectItem value="18px">
                                                        Large (18px)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Layout */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Layout className="h-5 w-5" />
                                        Layout
                                    </CardTitle>
                                    <CardDescription>
                                        Configure page layout and structure
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="max-width">
                                                Content Width
                                            </Label>
                                            <Select
                                                value={data.layout.max_width}
                                                onValueChange={(value) =>
                                                    updateNestedData(
                                                        'layout',
                                                        'max_width',
                                                        value ?? '',
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1024px">
                                                        Narrow (1024px)
                                                    </SelectItem>
                                                    <SelectItem value="1280px">
                                                        Standard (1280px)
                                                    </SelectItem>
                                                    <SelectItem value="1536px">
                                                        Wide (1536px)
                                                    </SelectItem>
                                                    <SelectItem value="100%">
                                                        Full Width
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="header-style">
                                                Header Style
                                            </Label>
                                            <Select
                                                value={data.layout.header_style}
                                                onValueChange={(value) =>
                                                    updateNestedData(
                                                        'layout',
                                                        'header_style',
                                                        value ?? '',
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(
                                                        headerStyles,
                                                    ).map(([value, label]) => (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="footer-style">
                                                Footer Style
                                            </Label>
                                            <Select
                                                value={data.layout.footer_style}
                                                onValueChange={(value) =>
                                                    updateNestedData(
                                                        'layout',
                                                        'footer_style',
                                                        value ?? '',
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(
                                                        footerStyles,
                                                    ).map(([value, label]) => (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Branding */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Image className="h-5 w-5" />
                                        Branding
                                    </CardTitle>
                                    <CardDescription>
                                        Favicon and display settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Favicon</Label>
                                            <div className="flex items-center gap-4">
                                                {(faviconPreview ||
                                                    data.branding.favicon) && (
                                                    <img
                                                        src={
                                                            faviconPreview ||
                                                            `/storage/${data.branding.favicon}`
                                                        }
                                                        alt="Favicon preview"
                                                        className="h-8 w-8 rounded border"
                                                    />
                                                )}
                                                <input
                                                    ref={faviconInputRef}
                                                    type="file"
                                                    accept=".ico,.png,.svg"
                                                    onChange={
                                                        handleFaviconUpload
                                                    }
                                                    className="hidden"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        faviconInputRef.current?.click()
                                                    }
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Upload Favicon
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Accepted formats: .ico, .png,
                                                .svg (max 512KB)
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="show-institution-logo"
                                                checked={
                                                    data.branding
                                                        .show_institution_logo
                                                }
                                                onChange={(e) =>
                                                    updateNestedData(
                                                        'branding',
                                                        'show_institution_logo',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="rounded"
                                            />
                                            <Label htmlFor="show-institution-logo">
                                                Show institution logo in header
                                            </Label>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="show-journal-name"
                                                checked={
                                                    data.branding
                                                        .show_journal_name
                                                }
                                                onChange={(e) =>
                                                    updateNestedData(
                                                        'branding',
                                                        'show_journal_name',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="rounded"
                                            />
                                            <Label htmlFor="show-journal-name">
                                                Show journal name next to logo
                                            </Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Preview & Actions */}
                        <div className="space-y-6">
                            {/* Color Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Color Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="overflow-hidden rounded-lg border"
                                        style={{
                                            backgroundColor:
                                                data.colors.background,
                                        }}
                                    >
                                        <div
                                            className="p-4"
                                            style={{
                                                backgroundColor:
                                                    data.colors.primary,
                                            }}
                                        >
                                            <span
                                                className="text-sm font-semibold"
                                                style={{
                                                    color: data.colors
                                                        .primary_foreground,
                                                }}
                                            >
                                                Header
                                            </span>
                                        </div>
                                        <div className="space-y-2 p-4">
                                            <h3
                                                className="font-bold"
                                                style={{
                                                    color: data.colors
                                                        .foreground,
                                                    fontFamily:
                                                        data.typography
                                                            .heading_font,
                                                }}
                                            >
                                                Sample Heading
                                            </h3>
                                            <p
                                                className="text-sm"
                                                style={{
                                                    color: data.colors
                                                        .foreground,
                                                    fontFamily:
                                                        data.typography
                                                            .font_family,
                                                }}
                                            >
                                                This is sample body text to
                                                preview your typography
                                                settings.
                                            </p>
                                            <p
                                                className="text-xs"
                                                style={{
                                                    color: data.colors
                                                        .muted_foreground,
                                                }}
                                            >
                                                This is muted/secondary text.
                                            </p>
                                            <div className="flex gap-2 pt-2">
                                                <span
                                                    className="rounded px-3 py-1 text-xs"
                                                    style={{
                                                        backgroundColor:
                                                            data.colors.primary,
                                                        color: data.colors
                                                            .primary_foreground,
                                                    }}
                                                >
                                                    Primary
                                                </span>
                                                <span
                                                    className="rounded px-3 py-1 text-xs"
                                                    style={{
                                                        backgroundColor:
                                                            data.colors
                                                                .secondary,
                                                        color: data.colors
                                                            .secondary_foreground,
                                                    }}
                                                >
                                                    Secondary
                                                </span>
                                                <span
                                                    className="rounded px-3 py-1 text-xs text-white"
                                                    style={{
                                                        backgroundColor:
                                                            data.colors.accent,
                                                    }}
                                                >
                                                    Accent
                                                </span>
                                            </div>
                                            <div
                                                className="mt-2 rounded p-2 text-xs"
                                                style={{
                                                    backgroundColor:
                                                        data.colors.muted,
                                                    color: data.colors
                                                        .muted_foreground,
                                                    border: `1px solid ${data.colors.border}`,
                                                }}
                                            >
                                                Muted section with border
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardContent className="space-y-2 pt-6">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing || !isDirty}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Theme'}
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger
                                            render={
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                />
                                            }
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Reset to Defaults
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Reset Theme Settings
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will reset all theme
                                                    settings to their default
                                                    values. This action cannot
                                                    be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleReset}
                                                >
                                                    Reset
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>

                            {/* Tips */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">
                                        Tips
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-xs text-muted-foreground">
                                    <p>
                                        Use contrasting colors between
                                        background and foreground for
                                        readability.
                                    </p>
                                    <p>
                                        Primary foreground should be readable on
                                        primary color backgrounds.
                                    </p>
                                    <p>
                                        Consider accessibility when choosing
                                        color combinations (WCAG 2.1 AA contrast
                                        ratios).
                                    </p>
                                    <p>
                                        Changes apply to all public-facing pages
                                        of this journal.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
