import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Settings, Save, Puzzle } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
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

interface Journal {
    id: number;
    name: string;
    pivot?: {
        enabled: boolean;
        settings: Record<string, unknown>;
    };
}

interface Plugin {
    id: number;
    name: string;
    display_name: string;
    version: string;
    author: string | null;
    description: string | null;
    is_global: boolean;
    enabled: boolean;
    settings: Record<string, unknown> | null;
    path: string;
    created_at: string;
    updated_at: string;
    journals: Journal[];
}

interface Props {
    plugin: Plugin;
    journals: Journal[];
}

export default function PluginSettings({ plugin, journals }: Props) {
    const [globalSettings, setGlobalSettings] = useState<
        Record<string, unknown>
    >(plugin.settings || {});
    const [journalSettings, setJournalSettings] = useState<
        Record<number, Record<string, unknown>>
    >(() => {
        const settings: Record<number, Record<string, unknown>> = {};
        plugin.journals.forEach((journal) => {
            settings[journal.id] = journal.pivot?.settings || {};
        });

        return settings;
    });
    const [activeTab, setActiveTab] = useState(
        plugin.is_global ? 'global' : 'journals',
    );

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin' },
        { label: 'Plugins', href: '/admin/plugins' },
        { label: plugin.display_name },
    ];

    const handleGlobalSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(
            `/admin/plugins/${plugin.id}/settings`,
            {
                settings: JSON.stringify(globalSettings),
            },
            {
                preserveScroll: true,
            },
        );
    };

    const handleJournalSubmit = (journalId: number) => {
        router.post(
            `/admin/plugins/${plugin.id}/settings`,
            {
                settings: JSON.stringify(journalSettings[journalId] || {}),
                journal_id: journalId,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const updateGlobalSetting = (key: string, value: unknown) => {
        setGlobalSettings({ ...globalSettings, [key]: value });
    };

    const updateJournalSetting = (
        journalId: number,
        key: string,
        value: unknown,
    ) => {
        setJournalSettings({
            ...journalSettings,
            [journalId]: {
                ...(journalSettings[journalId] || {}),
                [key]: value,
            },
        });
    };

    const isEnabledForJournal = (journalId: number): boolean => {
        const journal = plugin.journals.find((j) => j.id === journalId);

        return journal?.pivot?.enabled ?? false;
    };

    const toggleJournalEnabled = (journalId: number) => {
        const currentlyEnabled = isEnabledForJournal(journalId);

        if (currentlyEnabled) {
            router.post(
                `/admin/plugins/${plugin.id}/disable-for-journal`,
                {
                    journal_id: journalId,
                },
                {
                    preserveScroll: true,
                },
            );
        } else {
            router.post(
                `/admin/plugins/${plugin.id}/enable-for-journal`,
                {
                    journal_id: journalId,
                },
                {
                    preserveScroll: true,
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`${plugin.display_name} Settings`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            render={<Link href="/admin/plugins" />}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-oxford-blue font-serif text-2xl font-bold tracking-tight">
                                {plugin.display_name}
                            </h1>
                            <p className="flex items-center gap-2 text-muted-foreground">
                                <Badge variant="outline">
                                    v{plugin.version}
                                </Badge>
                                {plugin.author && (
                                    <span>by {plugin.author}</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {plugin.enabled ? (
                            <Badge className="bg-green-100 text-green-800">
                                Globally Enabled
                            </Badge>
                        ) : (
                            <Badge variant="secondary">Globally Disabled</Badge>
                        )}
                    </div>
                </div>

                {/* Plugin Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Puzzle className="h-5 w-5" />
                            Plugin Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">
                                    Plugin ID
                                </Label>
                                <p className="font-medium">{plugin.name}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Version
                                </Label>
                                <p className="font-medium">{plugin.version}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Scope
                                </Label>
                                <p className="font-medium">
                                    {plugin.is_global
                                        ? 'Global (all journals)'
                                        : 'Per-journal'}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">
                                    Installed
                                </Label>
                                <p className="font-medium">
                                    {new Date(
                                        plugin.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        {plugin.description && (
                            <div>
                                <Label className="text-muted-foreground">
                                    Description
                                </Label>
                                <p className="mt-1 text-sm">
                                    {plugin.description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Settings Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => {
                        if (value !== null) {
                            setActiveTab(value);
                        }
                    }}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="global">
                            Global Settings
                        </TabsTrigger>
                        <TabsTrigger value="journals">
                            Journal Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Global Settings */}
                    <TabsContent value="global">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Global Settings
                                </CardTitle>
                                <CardDescription>
                                    These settings apply to all journals where
                                    this plugin is enabled.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleGlobalSubmit}
                                    className="space-y-4"
                                >
                                    {/* Example Settings Form - can be customized per plugin */}
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="setting-example">
                                                Example Setting
                                            </Label>
                                            <Input
                                                id="setting-example"
                                                value={
                                                    (globalSettings.example as string) ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    updateGlobalSetting(
                                                        'example',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter a value..."
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="setting-text">
                                                Example Text Area
                                            </Label>
                                            <Textarea
                                                id="setting-text"
                                                value={
                                                    (globalSettings.text as string) ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    updateGlobalSetting(
                                                        'text',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter longer text..."
                                                rows={4}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="setting-select">
                                                Example Select
                                            </Label>
                                            <Select
                                                value={
                                                    (globalSettings.select as string) ||
                                                    'option1'
                                                }
                                                onValueChange={(value) =>
                                                    updateGlobalSetting(
                                                        'select',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger id="setting-select">
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="option1">
                                                        Option 1
                                                    </SelectItem>
                                                    <SelectItem value="option2">
                                                        Option 2
                                                    </SelectItem>
                                                    <SelectItem value="option3">
                                                        Option 3
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="setting-toggle">
                                                    Example Toggle
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Enable or disable this
                                                    feature
                                                </p>
                                            </div>
                                            <Switch
                                                id="setting-toggle"
                                                checked={
                                                    (globalSettings.toggle as boolean) ||
                                                    false
                                                }
                                                onCheckedChange={(checked) =>
                                                    updateGlobalSetting(
                                                        'toggle',
                                                        checked,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit">
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Global Settings
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Journal Settings */}
                    <TabsContent value="journals">
                        <div className="space-y-4">
                            {journals.map((journal) => (
                                <Card key={journal.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                {journal.name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {isEnabledForJournal(
                                                        journal.id,
                                                    )
                                                        ? 'Enabled'
                                                        : 'Disabled'}
                                                </span>
                                                <Switch
                                                    checked={isEnabledForJournal(
                                                        journal.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleJournalEnabled(
                                                            journal.id,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {isEnabledForJournal(journal.id) && (
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label>
                                                        Journal-Specific Setting
                                                    </Label>
                                                    <Input
                                                        value={
                                                            (journalSettings[
                                                                journal.id
                                                            ]
                                                                ?.custom as string) ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            updateJournalSetting(
                                                                journal.id,
                                                                'custom',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter journal-specific value..."
                                                    />
                                                </div>
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleJournalSubmit(
                                                                journal.id,
                                                            )
                                                        }
                                                    >
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Save for {journal.name}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}

                            {journals.length === 0 && (
                                <Card>
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        <p>No journals available</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
