import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { ArrowLeft, Palette, Type, Layout, Image, RotateCcw, Save, Eye } from 'lucide-react';
import admin from '@/routes/admin';
import { useState, useEffect } from 'react';

interface ThemeSettings {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        link: string;
    };
    typography: {
        heading_font: string;
        body_font: string;
        base_size: string;
    };
    layout: {
        max_width: string;
        header_style: string;
        footer_style: string;
    };
    branding: {
        logo_url: string | null;
        favicon_url: string | null;
        show_journal_name: boolean;
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

export default function ThemeEdit({ journal, themeSettings, fonts, headerStyles, footerStyles }: Props) {
    const [previewMode, setPreviewMode] = useState(false);

    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals', href: admin.journals.index.url() },
        { label: journal.name, href: admin.journals.edit.url({ journal: journal.id }) },
        { label: 'CMS - Theme' },
    ];

    const { data, setData, put, processing, isDirty } = useForm<ThemeSettings>(themeSettings);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/journals/${journal.id}/cms/theme`);
    };

    const handleReset = () => {
        router.post(`/admin/journals/${journal.id}/cms/theme/reset`, {}, {
            preserveScroll: true,
        });
    };

    const updateNestedData = (
        category: keyof ThemeSettings,
        key: string,
        value: string | boolean
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
        { key: 'primary', label: 'Primary Color', description: 'Main brand color, buttons, links' },
        { key: 'secondary', label: 'Secondary Color', description: 'Supporting color for accents' },
        { key: 'accent', label: 'Accent Color', description: 'Highlights and call-to-action' },
        { key: 'background', label: 'Background Color', description: 'Page background' },
        { key: 'text', label: 'Text Color', description: 'Main body text' },
        { key: 'link', label: 'Link Color', description: 'Hyperlinks and clickable text' },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Theme Settings - ${journal.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={admin.journals.edit.url({ journal: journal.id })}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Theme Settings</h1>
                            <p className="text-muted-foreground">{journal.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <a
                                href={`/journals/${journal.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview Site
                            </a>
                        </Button>
                    </div>
                </div>

                {/* CMS Navigation */}
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/admin/journals/${journal.id}/cms/pages`}>
                            Pages
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/journals/${journal.id}/cms/menus`}>
                            Menus
                        </Link>
                    </Button>
                    <Button variant="default">
                        Theme
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Settings */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Colors */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5" />
                                        Colors
                                    </CardTitle>
                                    <CardDescription>
                                        Customize the color scheme of your journal website
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {colorInputs.map((color) => (
                                            <div key={color.key} className="space-y-2">
                                                <Label htmlFor={`color-${color.key}`}>{color.label}</Label>
                                                <div className="flex gap-2">
                                                    <div
                                                        className="w-10 h-10 rounded-md border cursor-pointer"
                                                        style={{ backgroundColor: data.colors[color.key as keyof typeof data.colors] }}
                                                    >
                                                        <input
                                                            type="color"
                                                            id={`color-${color.key}`}
                                                            value={data.colors[color.key as keyof typeof data.colors]}
                                                            onChange={(e) => updateNestedData('colors', color.key, e.target.value)}
                                                            className="w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                    <Input
                                                        value={data.colors[color.key as keyof typeof data.colors]}
                                                        onChange={(e) => updateNestedData('colors', color.key, e.target.value)}
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
                                            <Label htmlFor="heading-font">Heading Font</Label>
                                            <Select
                                                value={data.typography.heading_font}
                                                onValueChange={(value) => updateNestedData('typography', 'heading_font', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fonts.map((font) => (
                                                        <SelectItem key={font} value={font}>
                                                            <span style={{ fontFamily: font }}>{font}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="body-font">Body Font</Label>
                                            <Select
                                                value={data.typography.body_font}
                                                onValueChange={(value) => updateNestedData('typography', 'body_font', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fonts.map((font) => (
                                                        <SelectItem key={font} value={font}>
                                                            <span style={{ fontFamily: font }}>{font}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="base-size">Base Font Size</Label>
                                            <Select
                                                value={data.typography.base_size}
                                                onValueChange={(value) => updateNestedData('typography', 'base_size', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="14px">Small (14px)</SelectItem>
                                                    <SelectItem value="16px">Medium (16px)</SelectItem>
                                                    <SelectItem value="18px">Large (18px)</SelectItem>
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
                                            <Label htmlFor="max-width">Content Width</Label>
                                            <Select
                                                value={data.layout.max_width}
                                                onValueChange={(value) => updateNestedData('layout', 'max_width', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1024px">Narrow (1024px)</SelectItem>
                                                    <SelectItem value="1280px">Standard (1280px)</SelectItem>
                                                    <SelectItem value="1536px">Wide (1536px)</SelectItem>
                                                    <SelectItem value="100%">Full Width</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="header-style">Header Style</Label>
                                            <Select
                                                value={data.layout.header_style}
                                                onValueChange={(value) => updateNestedData('layout', 'header_style', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(headerStyles).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="footer-style">Footer Style</Label>
                                            <Select
                                                value={data.layout.footer_style}
                                                onValueChange={(value) => updateNestedData('layout', 'footer_style', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(footerStyles).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
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
                                        Logo and favicon settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="logo-url">Logo URL</Label>
                                            <Input
                                                id="logo-url"
                                                value={data.branding.logo_url || ''}
                                                onChange={(e) => updateNestedData('branding', 'logo_url', e.target.value)}
                                                placeholder="https://example.com/logo.png"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                URL to your journal logo image
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="favicon-url">Favicon URL</Label>
                                            <Input
                                                id="favicon-url"
                                                value={data.branding.favicon_url || ''}
                                                onChange={(e) => updateNestedData('branding', 'favicon_url', e.target.value)}
                                                placeholder="https://example.com/favicon.ico"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                URL to your favicon (browser tab icon)
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="show-journal-name"
                                                checked={data.branding.show_journal_name}
                                                onChange={(e) => updateNestedData('branding', 'show_journal_name', e.target.checked)}
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
                                        className="rounded-lg border overflow-hidden"
                                        style={{ backgroundColor: data.colors.background }}
                                    >
                                        <div
                                            className="p-4"
                                            style={{ backgroundColor: data.colors.primary }}
                                        >
                                            <span className="text-white font-semibold text-sm">Header</span>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h3
                                                className="font-bold"
                                                style={{
                                                    color: data.colors.text,
                                                    fontFamily: data.typography.heading_font,
                                                }}
                                            >
                                                Sample Heading
                                            </h3>
                                            <p
                                                className="text-sm"
                                                style={{
                                                    color: data.colors.text,
                                                    fontFamily: data.typography.body_font,
                                                }}
                                            >
                                                This is sample body text to preview your typography settings.
                                            </p>
                                            <a
                                                href="#"
                                                className="text-sm underline"
                                                style={{ color: data.colors.link }}
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                Sample Link
                                            </a>
                                            <div className="flex gap-2 pt-2">
                                                <span
                                                    className="px-3 py-1 rounded text-white text-xs"
                                                    style={{ backgroundColor: data.colors.primary }}
                                                >
                                                    Primary
                                                </span>
                                                <span
                                                    className="px-3 py-1 rounded text-white text-xs"
                                                    style={{ backgroundColor: data.colors.secondary }}
                                                >
                                                    Secondary
                                                </span>
                                                <span
                                                    className="px-3 py-1 rounded text-white text-xs"
                                                    style={{ backgroundColor: data.colors.accent }}
                                                >
                                                    Accent
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardContent className="pt-6 space-y-2">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing || !isDirty}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Theme'}
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" className="w-full">
                                                <RotateCcw className="mr-2 h-4 w-4" />
                                                Reset to Defaults
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Reset Theme Settings</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will reset all theme settings to their default values.
                                                    This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleReset}>
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
                                    <CardTitle className="text-sm">Tips</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs text-muted-foreground space-y-2">
                                    <p>
                                        • Use contrasting colors for better readability
                                    </p>
                                    <p>
                                        • Test your colors in both light and dark environments
                                    </p>
                                    <p>
                                        • Consider accessibility when choosing color combinations
                                    </p>
                                    <p>
                                        • Use web-safe fonts for consistent display
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
