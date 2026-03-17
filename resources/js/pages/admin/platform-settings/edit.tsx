import { Head, useForm, router } from '@inertiajs/react';
import {
    Settings,
    Globe,
    Shield,
    Mail,
    FileText,
    Palette,
    Upload,
    Trash2,
    RotateCcw,
} from 'lucide-react';
import type { FormEventHandler} from 'react';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

interface SettingField {
    type: string;
    label: string;
    description: string;
    options?: string[];
}

interface SettingsSchema {
    [group: string]: {
        [key: string]: SettingField;
    };
}

interface PlatformSettingsData {
    id: number;
    platform_name: string;
    platform_tagline: string | null;
    platform_description: string | null;
    logo_path: string | null;
    logo_url: string | null;
    favicon_path: string | null;
    favicon_url: string | null;
    admin_email: string | null;
    settings: Record<string, Record<string, unknown>>;
}

interface Props {
    platformSettings: PlatformSettingsData;
    settingsSchema: SettingsSchema;
}

const TAB_LABELS: Record<
    string,
    { label: string; icon: React.ReactNode; description: string }
> = {
    general: {
        label: 'General',
        icon: <Globe className="h-4 w-4" />,
        description: 'Platform name, branding, and basic information',
    },
    registration: {
        label: 'Registration',
        icon: <FileText className="h-4 w-4" />,
        description: 'User registration and account settings',
    },
    security: {
        label: 'Security',
        icon: <Shield className="h-4 w-4" />,
        description: 'Security policies and access controls',
    },
    email: {
        label: 'Email',
        icon: <Mail className="h-4 w-4" />,
        description: 'Email delivery configuration',
    },
    submissions: {
        label: 'Submissions',
        icon: <FileText className="h-4 w-4" />,
        description: 'Global manuscript submission settings',
    },
    appearance: {
        label: 'Appearance',
        icon: <Palette className="h-4 w-4" />,
        description: 'Admin panel appearance settings',
    },
};

export default function EditPlatformSettings({
    platformSettings,
    settingsSchema,
}: Props) {
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(
        platformSettings.logo_url,
    );
    const [faviconPreview, setFaviconPreview] = useState<string | null>(
        platformSettings.favicon_url,
    );

     
    const { data, setData, post, processing, errors } = useForm<
        Record<string, any>
    >({
        _method: 'PUT',
        platform_name: platformSettings.platform_name || '',
        platform_tagline: platformSettings.platform_tagline || '',
        platform_description: platformSettings.platform_description || '',
        admin_email: platformSettings.admin_email || '',
        logo: null,
        favicon: null,
        settings: platformSettings.settings || {},
    });

    const updateSetting = (group: string, key: string, value: unknown) => {
        setData('settings', {
            ...data.settings,
            [group]: {
                ...(data.settings[group] || {}),
                [key]: value,
            },
        });
    };

    const getSettingValue = (group: string, key: string): unknown => {
        return data.settings?.[group]?.[key] ?? '';
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('favicon', file);
            setFaviconPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveLogo = () => {
        router.delete('/admin/platform-settings/logo', {
            preserveScroll: true,
            onSuccess: () => setLogoPreview(null),
        });
    };

    const handleRemoveFavicon = () => {
        router.delete('/admin/platform-settings/favicon', {
            preserveScroll: true,
            onSuccess: () => setFaviconPreview(null),
        });
    };

    const handleReset = () => {
        if (
            confirm(
                'Are you sure you want to reset all settings to defaults? This will not affect platform name, tagline, or uploaded files.',
            )
        ) {
            router.post(
                '/admin/platform-settings/reset',
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/platform-settings', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const renderSettingField = (
        group: string,
        key: string,
        field: SettingField,
    ) => {
        const value = getSettingValue(group, key);
        const errorKey = `settings.${group}.${key}`;

        switch (field.type) {
            case 'boolean':
                return (
                    <div
                        key={key}
                        className="flex items-center justify-between rounded-lg border p-4"
                    >
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">
                                {field.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                {field.description}
                            </p>
                        </div>
                        <Switch
                            checked={Boolean(value)}
                            onCheckedChange={(checked) =>
                                updateSetting(group, key, checked)
                            }
                        />
                    </div>
                );

            case 'number':
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={`${group}-${key}`}>{field.label}</Label>
                        <Input
                            id={`${group}-${key}`}
                            type="number"
                            value={String(value || '')}
                            onChange={(e) =>
                                updateSetting(
                                    group,
                                    key,
                                    parseInt(e.target.value) || 0,
                                )
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                        {errors[errorKey as keyof typeof errors] && (
                            <p className="text-xs text-destructive">
                                {errors[errorKey as keyof typeof errors]}
                            </p>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={`${group}-${key}`}>{field.label}</Label>
                        <Select
                            value={String(value || '')}
                            onValueChange={(v) => updateSetting(group, key, v)}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={`Select ${field.label.toLowerCase()}`}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    </div>
                );

            case 'color':
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={`${group}-${key}`}>{field.label}</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id={`${group}-${key}`}
                                type="color"
                                value={String(value || '#2563eb')}
                                onChange={(e) =>
                                    updateSetting(group, key, e.target.value)
                                }
                                className="h-10 w-16 cursor-pointer p-1"
                            />
                            <Input
                                type="text"
                                value={String(value || '')}
                                onChange={(e) =>
                                    updateSetting(group, key, e.target.value)
                                }
                                placeholder="#2563eb"
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    </div>
                );

            case 'tags':
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={`${group}-${key}`}>{field.label}</Label>
                        <Input
                            id={`${group}-${key}`}
                            type="text"
                            value={
                                Array.isArray(value)
                                    ? (value as string[]).join(', ')
                                    : String(value || '')
                            }
                            onChange={(e) => {
                                const tags = e.target.value
                                    .split(',')
                                    .map((t) => t.trim())
                                    .filter(Boolean);
                                updateSetting(group, key, tags);
                            }}
                            placeholder="Separate items with commas"
                        />
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                        {Array.isArray(value) &&
                            (value as string[]).length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {(value as string[]).map((tag, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                    </div>
                );

            default:
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={`${group}-${key}`}>{field.label}</Label>
                        <Input
                            id={`${group}-${key}`}
                            type="text"
                            value={String(value || '')}
                            onChange={(e) =>
                                updateSetting(group, key, e.target.value)
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                        {errors[errorKey as keyof typeof errors] && (
                            <p className="text-xs text-destructive">
                                {errors[errorKey as keyof typeof errors]}
                            </p>
                        )}
                    </div>
                );
        }
    };

    return (
        <AppLayout>
            <Head title="Platform Settings" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Platform Settings
                        </h1>
                        <p className="text-muted-foreground">
                            Configure global platform settings that apply across
                            all journals.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset to Defaults
                    </Button>
                </div>

                <form onSubmit={submit}>
                    <Tabs defaultValue="general" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-6">
                            {Object.entries(TAB_LABELS).map(
                                ([key, { label }]) => (
                                    <TabsTrigger
                                        key={key}
                                        value={key}
                                        className="gap-2"
                                    >
                                        {label}
                                    </TabsTrigger>
                                ),
                            )}
                        </TabsList>

                        {/* General Tab */}
                        <TabsContent value="general" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        Platform Identity
                                    </CardTitle>
                                    <CardDescription>
                                        Configure the platform name,
                                        description, and branding that appears
                                        throughout the system.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="platform_name">
                                                Platform Name
                                            </Label>
                                            <Input
                                                id="platform_name"
                                                value={data.platform_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'platform_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Research Platform"
                                            />
                                            {errors.platform_name && (
                                                <p className="text-xs text-destructive">
                                                    {errors.platform_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="admin_email">
                                                Admin Email
                                            </Label>
                                            <Input
                                                id="admin_email"
                                                type="email"
                                                value={data.admin_email}
                                                onChange={(e) =>
                                                    setData(
                                                        'admin_email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="admin@example.com"
                                            />
                                            {errors.admin_email && (
                                                <p className="text-xs text-destructive">
                                                    {errors.admin_email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="platform_tagline">
                                            Tagline
                                        </Label>
                                        <Input
                                            id="platform_tagline"
                                            value={data.platform_tagline}
                                            onChange={(e) =>
                                                setData(
                                                    'platform_tagline',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Open Access Research Journal Management"
                                        />
                                        {errors.platform_tagline && (
                                            <p className="text-xs text-destructive">
                                                {errors.platform_tagline}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="platform_description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="platform_description"
                                            value={data.platform_description}
                                            onChange={(e) =>
                                                setData(
                                                    'platform_description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Describe your platform..."
                                            rows={3}
                                        />
                                        {errors.platform_description && (
                                            <p className="text-xs text-destructive">
                                                {errors.platform_description}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Platform Logo
                                        </CardTitle>
                                        <CardDescription>
                                            Upload a logo (PNG, JPG, SVG, WebP,
                                            max 2MB)
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {logoPreview && (
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={logoPreview}
                                                    alt="Platform logo"
                                                    className="h-16 w-auto rounded border object-contain p-1"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleRemoveLogo}
                                                    className="gap-1 text-destructive"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Remove
                                                </Button>
                                            </div>
                                        )}
                                        <div>
                                            <input
                                                ref={logoInputRef}
                                                type="file"
                                                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    logoInputRef.current?.click()
                                                }
                                                className="gap-2"
                                            >
                                                <Upload className="h-4 w-4" />
                                                {logoPreview
                                                    ? 'Change Logo'
                                                    : 'Upload Logo'}
                                            </Button>
                                        </div>
                                        {errors.logo && (
                                            <p className="text-xs text-destructive">
                                                {errors.logo}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Favicon
                                        </CardTitle>
                                        <CardDescription>
                                            Upload a favicon (PNG, ICO, SVG, max
                                            512KB)
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {faviconPreview && (
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={faviconPreview}
                                                    alt="Favicon"
                                                    className="h-8 w-8 rounded border object-contain p-0.5"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={
                                                        handleRemoveFavicon
                                                    }
                                                    className="gap-1 text-destructive"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Remove
                                                </Button>
                                            </div>
                                        )}
                                        <div>
                                            <input
                                                ref={faviconInputRef}
                                                type="file"
                                                accept="image/png,image/x-icon,image/svg+xml"
                                                onChange={handleFaviconChange}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    faviconInputRef.current?.click()
                                                }
                                                className="gap-2"
                                            >
                                                <Upload className="h-4 w-4" />
                                                {faviconPreview
                                                    ? 'Change Favicon'
                                                    : 'Upload Favicon'}
                                            </Button>
                                        </div>
                                        {errors.favicon && (
                                            <p className="text-xs text-destructive">
                                                {errors.favicon}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Dynamic Settings Tabs */}
                        {Object.entries(settingsSchema).map(
                            ([group, fields]) => (
                                <TabsContent
                                    key={group}
                                    value={group}
                                    className="space-y-6"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                {TAB_LABELS[group]?.icon}
                                                {TAB_LABELS[group]?.label ||
                                                    group}{' '}
                                                Settings
                                            </CardTitle>
                                            <CardDescription>
                                                {TAB_LABELS[group]
                                                    ?.description ||
                                                    `Configure ${group} settings`}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {Object.entries(fields).map(
                                                ([key, field]) =>
                                                    renderSettingField(
                                                        group,
                                                        key,
                                                        field,
                                                    ),
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ),
                        )}

                        <Separator />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="gap-2"
                            >
                                <Settings className="h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </Tabs>
                </form>
            </div>
        </AppLayout>
    );
}
