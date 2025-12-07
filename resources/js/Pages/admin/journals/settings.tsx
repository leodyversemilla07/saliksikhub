import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import admin from '@/routes/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, RotateCcw, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

interface SettingField {
    type: 'string' | 'text' | 'number' | 'boolean' | 'color' | 'select' | 'tags';
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

interface Props {
    journal: Journal;
    settingsSchema: SettingsSchema;
}

export default function JournalSettings({ journal, settingsSchema }: Props) {
    const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
    const [settings, setSettings] = useState<Record<string, unknown>>(journal.settings || {});
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
        setSetting(key, currentTags.filter(tag => tag !== tagToRemove));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.put(
            `/admin/journals/${journal.id}/settings`,
            { settings } as unknown as Record<string, string>,
            {
                onFinish: () => setProcessing(false),
            }
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
                            onChange={(e) => setSetting(fullKey, e.target.value)}
                            placeholder={field.description}
                        />
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                    </div>
                );

            case 'text':
                return (
                    <div key={fullKey} className="space-y-2">
                        <Label htmlFor={fullKey}>{field.label}</Label>
                        <Textarea
                            id={fullKey}
                            value={getSetting(fullKey, '') as string}
                            onChange={(e) => setSetting(fullKey, e.target.value)}
                            placeholder={field.description}
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">{field.description}</p>
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
                            onChange={(e) => setSetting(fullKey, parseInt(e.target.value) || '')}
                        />
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                    </div>
                );

            case 'boolean':
                return (
                    <div key={fullKey} className="flex items-center justify-between py-2">
                        <div>
                            <Label htmlFor={fullKey}>{field.label}</Label>
                            <p className="text-xs text-muted-foreground">{field.description}</p>
                        </div>
                        <Switch
                            id={fullKey}
                            checked={getSetting(fullKey, false) as boolean}
                            onCheckedChange={(checked) => setSetting(fullKey, checked)}
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
                                onChange={(e) => setSetting(fullKey, e.target.value)}
                                className="w-16 h-10 p-1 cursor-pointer"
                            />
                            <Input
                                value={getSetting(fullKey, '') as string}
                                onChange={(e) => setSetting(fullKey, e.target.value)}
                                placeholder="#000000"
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                    </div>
                );

            case 'select':
                return (
                    <div key={fullKey} className="space-y-2">
                        <Label htmlFor={fullKey}>{field.label}</Label>
                        <Select
                            value={getSetting(fullKey, '') as string}
                            onValueChange={(value) => setSetting(fullKey, value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">{field.description}</p>
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
                                onChange={(e) => setTagInputs({ ...tagInputs, [fullKey]: e.target.value })}
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
                            <div className="flex flex-wrap gap-1 mt-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(fullKey, tag)}
                                            className="hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">{field.description}</p>
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
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/journals">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Journal Settings</h1>
                            <p className="text-muted-foreground">
                                Configure settings for {journal.name}
                            </p>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <RotateCcw className="h-4 w-4" />
                                Reset to Defaults
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to reset all settings to their default values?
                                    This action cannot be undone.
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
                    <Tabs defaultValue={categories[0]?.[0]} className="space-y-6">
                        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
                            {categories.map(([category]) => (
                                <TabsTrigger key={category} value={category} className="capitalize">
                                    {category.replace(/_/g, ' ')}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {categories.map(([category, fields]) => (
                            <TabsContent key={category} value={category}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 capitalize">
                                            <Settings className="h-5 w-5" />
                                            {category.replace(/_/g, ' ')} Settings
                                        </CardTitle>
                                        <CardDescription>
                                            Configure {category.replace(/_/g, ' ')} options for this journal
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {Object.entries(fields).map(([key, field]) =>
                                            renderField(key, field)
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" asChild>
                            <Link href="/admin/journals">Cancel</Link>
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
