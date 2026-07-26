import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Settings,
    RotateCcw,
    X,
    GripVertical,
    Eye,
    EyeOff,
    Puzzle,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

interface SettingField {
    type:
        | 'string'
        | 'text'
        | 'number'
        | 'boolean'
        | 'color'
        | 'select'
        | 'tags';
    label: string;
    description: string;
    options?: string[];
}

interface SettingsSchema {
    [category: string]: {
        [key: string]: SettingField;
    };
}

interface Journal {
    id: number;
    name: string;
    settings: Record<string, unknown>;
}

interface WidgetTypeInfo {
    name: string;
    description: string;
    icon?: string;
    plugin?: string;
}

interface JournalPlugin {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    version: string;
    is_global: boolean;
    enabled: boolean;
    enabled_for_journal: boolean;
}

interface Props {
    journal: Journal;
    settingsSchema: SettingsSchema;
    widgetTypes: Record<string, WidgetTypeInfo>;
    plugins: JournalPlugin[];
}

export default function JournalSettings({
    journal,
    settingsSchema,
    widgetTypes = {},
    plugins = [],
}: Props) {
    const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
    const [settings, setSettings] = useState<Record<string, unknown>>(
        journal.settings || {},
    );
    const [processing, setProcessing] = useState(false);

    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals', href: admin.journals.index.url() },
        { label: `Settings: ${journal.name}` },
    ];

    const getSetting = (key: string, defaultValue: unknown = '') => {
        return settings[key] ?? defaultValue;
    };

    const setSetting = (key: string, value: unknown) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleAddTag = (key: string) => {
        const currentTags = (getSetting(key, []) as string[]) || [];
        const newTag = tagInputs[key]?.trim();

        if (newTag && !currentTags.includes(newTag)) {
            setSetting(key, [...currentTags, newTag]);
            setTagInputs({ ...tagInputs, [key]: '' });
        }
    };

    const handleRemoveTag = (key: string, tagToRemove: string) => {
        const currentTags = (getSetting(key, []) as string[]) || [];
        setSetting(
            key,
            currentTags.filter((tag) => tag !== tagToRemove),
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.put(
            `/admin/journals/${journal.id}/settings`,
            { settings } as unknown as Record<string, string>,
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleReset = () => {
        router.post(`/admin/journals/${journal.id}/settings/reset`);
    };

    const renderField = (key: string, field: SettingField) => {
        const fullKey = key;

        switch (field.type) {
            case 'string':
                return (
                    <div key={fullKey} className="space-y-2">
                        <Label htmlFor={fullKey}>{field.label}</Label>
                        <Input
                            id={fullKey}
                            value={getSetting(fullKey, '') as string}
                            onChange={(e) =>
                                setSetting(fullKey, e.target.value)
                            }
                            placeholder={field.description}
                        />
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    </div>
                );

            case 'text':
                return (
                    <div key={fullKey} className="space-y-2">
                        <Label htmlFor={fullKey}>{field.label}</Label>
                        <Textarea
                            id={fullKey}
                            value={getSetting(fullKey, '') as string}
                            onChange={(e) =>
                                setSetting(fullKey, e.target.value)
                            }
                            placeholder={field.description}
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    </div>
                );

            case 'number':
                return (
                    <div key={fullKey} className="space-y-2">
                        <Label htmlFor={fullKey}>{field.label}</Label>
                        <Input
                            id={fullKey}
                            type="number"
                            value={getSetting(fullKey, '') as string}
                            onChange={(e) =>
                                setSetting(
                                    fullKey,
                                    parseInt(e.target.value) || '',
                                )
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    </div>
                );

            case 'boolean':
                return (
                    <div
                        key={fullKey}
                        className="flex items-center justify-between py-2"
                    >
                        <div>
                            <Label htmlFor={fullKey}>{field.label}</Label>
                            <p className="text-xs text-muted-foreground">
                                {field.description}
                            </p>
                        </div>
                        <Switch
                            id={fullKey}
                            checked={getSetting(fullKey, false) as boolean}
                            onCheckedChange={(checked) =>
                                setSetting(fullKey, checked)
                            }
                        />
                    </div>
                );

            case 'color':
                return (
                    <div key={fullKey} className="space-y-2">
                        <Label htmlFor={fullKey}>{field.label}</Label>
                        <div className="flex gap-2">
                            <Input
                                id={fullKey}
                                type="color"
                                value={getSetting(fullKey, '#000000') as string}
                                onChange={(e) =>
                                    setSetting(fullKey, e.target.value)
                                }
                                className="h-10 w-16 cursor-pointer p-1"
                            />
                            <Input
                                value={getSetting(fullKey, '') as string}
                                onChange={(e) =>
                                    setSetting(fullKey, e.target.value)
                                }
                                placeholder="#000000"
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    </div>
                );

            case 'select':
                return (
                    <div key={fullKey} className="space-y-2">
                        <Label htmlFor={fullKey}>{field.label}</Label>
                        <Select
                            value={getSetting(fullKey, '') as string}
                            onValueChange={(value) =>
                                setSetting(fullKey, value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option
                                            .replace(/_/g, ' ')
                                            .replace(/\b\w/g, (l) =>
                                                l.toUpperCase(),
                                            )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    </div>
                );

            case 'tags': {
                const tags = (getSetting(fullKey, []) as string[]) || [];

                return (
                    <div key={fullKey} className="space-y-2">
                        <Label htmlFor={fullKey}>{field.label}</Label>
                        <div className="flex gap-2">
                            <Input
                                id={fullKey}
                                value={tagInputs[fullKey] || ''}
                                onChange={(e) =>
                                    setTagInputs({
                                        ...tagInputs,
                                        [fullKey]: e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag(fullKey);
                                    }
                                }}
                                placeholder="Add item and press Enter"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => handleAddTag(fullKey)}
                            >
                                Add
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveTag(fullKey, tag)
                                            }
                                            className="hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {field.description}
                        </p>
                    </div>
                );
            }

            case 'sidebar_widgets': {
                const widgets =
                    (getSetting(fullKey, []) as Array<{
                        id: string;
                        type: string;
                        title: string;
                        enabled: boolean;
                        settings: Record<string, unknown>;
                    }>) || [];

                // Use dynamic widget types from PHP (includes plugin-registered types)
                const availableTypes = Object.entries(widgetTypes).map(
                    ([key, info]) => ({
                        value: key,
                        label: info.name,
                        plugin: info.plugin,
                    }),
                );

                const addWidget = (type: string) => {
                    const label =
                        availableTypes.find((t) => t.value === type)?.label ||
                        type;
                    const newWidget = {
                        id: `${type}-${Date.now()}`,
                        type,
                        title: label,
                        enabled: true,
                        settings: {},
                        order: widgets.length,
                    };
                    setSetting(fullKey, [...widgets, newWidget]);
                };

                const removeWidget = (id: string) => {
                    setSetting(
                        fullKey,
                        widgets.filter((w) => w.id !== id),
                    );
                };

                const toggleWidget = (id: string) => {
                    setSetting(
                        fullKey,
                        widgets.map((w) =>
                            w.id === id ? { ...w, enabled: !w.enabled } : w,
                        ),
                    );
                };

                const moveWidget = (id: string, direction: -1 | 1) => {
                    const idx = widgets.findIndex((w) => w.id === id);

                    if (
                        idx === -1 ||
                        (direction === -1 && idx === 0) ||
                        (direction === 1 && idx === widgets.length - 1)
                    ) {
                        return;
                    }

                    const updated = [...widgets];
                    const target = idx + direction;
                    [updated[idx], updated[target]] = [
                        updated[target],
                        updated[idx],
                    ];
                    setSetting(
                        fullKey,
                        updated.map((w, i) => ({ ...w, order: i })),
                    );
                };

                return (
                    <div key={fullKey} className="space-y-4">
                        <Label>{field.label}</Label>
                        <p className="text-sm text-muted-foreground">
                            {field.description}
                        </p>

                        {widgets.length === 0 && (
                            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                <EyeOff className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                <p>No sidebar widgets configured.</p>
                                <p className="text-xs">
                                    Add widgets below to show content in the
                                    sidebar.
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            {widgets.map((widget, index) => (
                                <div
                                    key={widget.id}
                                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                                        widget.enabled ? '' : 'opacity-50'
                                    }`}
                                >
                                    <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">
                                            {availableTypes.find(
                                                (t) => t.value === widget.type,
                                            )?.label || widget.type}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {widget.title || 'No title set'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={index === 0}
                                            onClick={() =>
                                                moveWidget(widget.id, -1)
                                            }
                                            title="Move up"
                                        >
                                            ↑
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={
                                                index === widgets.length - 1
                                            }
                                            onClick={() =>
                                                moveWidget(widget.id, 1)
                                            }
                                            title="Move down"
                                        >
                                            ↓
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                toggleWidget(widget.id)
                                            }
                                            title={
                                                widget.enabled
                                                    ? 'Disable'
                                                    : 'Enable'
                                            }
                                        >
                                            {widget.enabled ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() =>
                                                removeWidget(widget.id)
                                            }
                                            title="Remove"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <Select onValueChange={(value) => addWidget(value)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Add a widget..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTypes
                                        .filter(
                                            (t) =>
                                                !widgets.some(
                                                    (w) => w.type === t.value,
                                                ),
                                        )
                                        .map((t) => (
                                            <SelectItem
                                                key={t.value}
                                                value={t.value}
                                            >
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {availableTypes.filter(
                                    (t) =>
                                        !widgets.some(
                                            (w) => w.type === t.value,
                                        ),
                                ).length === 0 && 'All widget types added'}
                            </p>
                        </div>
                    </div>
                );
            }

            default:
                return null;
        }
    };

    const categories = Object.entries(settingsSchema);

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Settings - ${journal.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            render={<Link href="/admin/journals" />}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Journal Settings
                            </h1>
                            <p className="text-muted-foreground">
                                Configure settings for {journal.name}
                            </p>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger
                            render={
                                <Button variant="outline" className="gap-2" />
                            }
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset to Defaults
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Reset Settings
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to reset all settings
                                    to their default values? This action cannot
                                    be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleReset}>
                                    Reset Settings
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <form onSubmit={submit}>
                    <Tabs
                        defaultValue={categories[0]?.[0]}
                        className="space-y-6"
                    >
                        <TabsList
                            className="grid w-full"
                            style={{
                                gridTemplateColumns: `repeat(${categories.length + (plugins.length > 0 ? 1 : 0)}, 1fr)`,
                            }}
                        >
                            {categories.map(([category]) => (
                                <TabsTrigger
                                    key={category}
                                    value={category}
                                    className="capitalize"
                                >
                                    {category.replace(/_/g, ' ')}
                                </TabsTrigger>
                            ))}
                            {plugins.length > 0 && (
                                <TabsTrigger
                                    value="plugins"
                                    className="capitalize"
                                >
                                    <Puzzle className="mr-2 h-4 w-4" />
                                    Plugins
                                </TabsTrigger>
                            )}
                        </TabsList>

                        {categories.map(([category, fields]) => (
                            <TabsContent key={category} value={category}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 capitalize">
                                            <Settings className="h-5 w-5" />
                                            {category.replace(/_/g, ' ')}{' '}
                                            Settings
                                        </CardTitle>
                                        <CardDescription>
                                            Configure{' '}
                                            {category.replace(/_/g, ' ')}{' '}
                                            options for this journal
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {Object.entries(fields).map(
                                            ([key, field]) =>
                                                renderField(key, field),
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}

                        {plugins.length > 0 && (
                            <TabsContent value="plugins">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Puzzle className="h-5 w-5" />
                                            Plugins
                                        </CardTitle>
                                        <CardDescription>
                                            Enable or disable plugins for{' '}
                                            {journal.name}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {plugins.map((plugin) => (
                                            <div
                                                key={plugin.id}
                                                className="flex items-center justify-between rounded-lg border p-4"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium">
                                                            {
                                                                plugin.display_name
                                                            }
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            v{plugin.version}
                                                        </Badge>
                                                        {plugin.is_global &&
                                                            plugin.enabled && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    Globally
                                                                    Enabled
                                                                </Badge>
                                                            )}
                                                    </div>
                                                    {plugin.description && (
                                                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                            {plugin.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Switch
                                                    checked={
                                                        plugin.enabled_for_journal
                                                    }
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        router.post(
                                                            `/admin/journals/${journal.id}/settings/plugins/${plugin.id}/toggle`,
                                                            {
                                                                enabled:
                                                                    checked,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                                onSuccess:
                                                                    () => {
                                                                        toast[
                                                                            checked
                                                                                ? 'success'
                                                                                : 'info'
                                                                        ](
                                                                            `${plugin.display_name} ${checked ? 'enabled' : 'disabled'} for this journal.`,
                                                                        );
                                                                    },
                                                            },
                                                        );
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}
                    </Tabs>

                    <div className="mt-6 flex justify-end gap-4">
                        <Button
                            variant="outline"
                            render={<Link href="/admin/journals" />}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
