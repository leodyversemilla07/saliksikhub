import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    FileJson,
    Globe,
    Puzzle,
    Power,
    PowerOff,
    Settings,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}

export default function PluginShow({ plugin }: Props) {
    const enabledJournalCount = plugin.journals.filter(
        (journal) => journal.pivot?.enabled,
    ).length;

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin' },
        { label: 'Plugins', href: '/admin/plugins' },
        { label: plugin.display_name },
    ];

    const handleEnable = () => {
        router.post(`/admin/plugins/${plugin.id}/enable`, {}, { preserveScroll: true });
    };

    const handleDisable = () => {
        router.post(`/admin/plugins/${plugin.id}/disable`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`${plugin.display_name} Details`} />

            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
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
                            <p className="text-muted-foreground">
                                Plugin details and deployment scope
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            render={
                                <Link href={`/admin/plugins/${plugin.id}/settings`} />
                            }
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                        {plugin.enabled ? (
                            <Button variant="outline" onClick={handleDisable}>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Disable
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={handleEnable}>
                                <Power className="mr-2 h-4 w-4" />
                                Enable
                            </Button>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Puzzle className="h-5 w-5" />
                            Plugin Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Status
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        {plugin.enabled ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                Enabled
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                Disabled
                                            </Badge>
                                        )}
                                        <Badge variant="outline">v{plugin.version}</Badge>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Scope
                                    </p>
                                    <div className="mt-2">
                                        {plugin.is_global ? (
                                            <Badge variant="secondary" className="gap-1">
                                                <Globe className="h-3 w-3" />
                                                Global
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="gap-1">
                                                <FileJson className="h-3 w-3" />
                                                Per Journal
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Installed
                                    </p>
                                    <p className="mt-2 text-sm font-medium">
                                        {new Date(plugin.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Plugin ID
                                    </p>
                                    <p className="mt-2 text-sm font-medium">
                                        {plugin.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Author
                                    </p>
                                    <p className="mt-2 text-sm font-medium">
                                        {plugin.author ?? 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Enabled Journals
                                    </p>
                                    <p className="mt-2 text-sm font-medium">
                                        {plugin.is_global
                                            ? 'All journals'
                                            : `${enabledJournalCount} of ${plugin.journals.length}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Path
                                    </p>
                                    <p className="mt-2 break-all text-sm font-medium">
                                        {plugin.path}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {plugin.description && (
                            <div className="mt-6">
                                <p className="text-sm text-muted-foreground">
                                    Description
                                </p>
                                <p className="mt-2 text-sm leading-6">
                                    {plugin.description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Global Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                                {JSON.stringify(plugin.settings ?? {}, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Journal Assignments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {plugin.journals.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No journals are currently linked to this plugin.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {plugin.journals.map((journal) => (
                                        <div
                                            key={journal.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {journal.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {journal.pivot?.enabled
                                                        ? 'Enabled'
                                                        : 'Disabled'}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    journal.pivot?.enabled
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {journal.pivot?.enabled
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
