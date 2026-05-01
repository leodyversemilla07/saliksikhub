import { Head, Link, router } from '@inertiajs/react';
import {
    Puzzle,
    Settings,
    Power,
    PowerOff,
    Trash2,
    Upload,
    RefreshCw,
    Globe,
    FileJson,
} from 'lucide-react';
import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

interface Plugin {
    id: number;
    name: string;
    display_name: string;
    version: string;
    author: string | null;
    description: string | null;
    is_global: boolean;
    enabled: boolean;
    journals_count: number;
    created_at: string;
}

interface Props {
    plugins: Plugin[];
    totalPlugins: number;
    activePlugins: number;
}

export default function PluginsIndex({
    plugins,
    totalPlugins,
    activePlugins,
}: Props) {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleEnable = (plugin: Plugin) => {
        router.post(
            `/admin/plugins/${plugin.id}/enable`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleDisable = (plugin: Plugin) => {
        router.post(
            `/admin/plugins/${plugin.id}/disable`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (plugin: Plugin) => {
        router.delete(`/admin/plugins/${plugin.id}`, {
            preserveScroll: true,
        });
    };

    const handleRefresh = () => {
        router.post(
            '/admin/plugins/refresh',
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
return;
}

        const formData = new FormData();
        formData.append('plugin_file', selectedFile);

        router.post('/admin/plugins/upload', formData, {
            onSuccess: () => {
                setUploadDialogOpen(false);
                setSelectedFile(null);
            },
        });
    };

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin' },
        { label: 'Plugins' },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Plugin Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-oxford-blue font-serif text-2xl font-bold tracking-tight">
                            Plugins
                        </h1>
                        <p className="text-muted-foreground">
                            Manage plugins to extend journal functionality
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleRefresh}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                        <Dialog
                            open={uploadDialogOpen}
                            onOpenChange={setUploadDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Plugin
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload Plugin</DialogTitle>
                                    <DialogDescription>
                                        Upload a plugin ZIP file to install it.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleUpload}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="plugin-file">
                                                Plugin File (.zip)
                                            </Label>
                                            <Input
                                                id="plugin-file"
                                                type="file"
                                                accept=".zip"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setUploadDialogOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!selectedFile}
                                        >
                                            Upload
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Plugins
                            </CardTitle>
                            <Puzzle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalPlugins}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Plugins
                            </CardTitle>
                            <Power className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {activePlugins}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Inactive
                            </CardTitle>
                            <PowerOff className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalPlugins - activePlugins}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Plugins Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Puzzle className="h-5 w-5" />
                            Installed Plugins
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {plugins.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Puzzle className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p className="text-lg font-medium">
                                    No plugins installed
                                </p>
                                <p className="text-sm">
                                    Upload a plugin to get started
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Plugin</TableHead>
                                        <TableHead>Version</TableHead>
                                        <TableHead>Scope</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {plugins.map((plugin) => (
                                        <TableRow key={plugin.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {plugin.display_name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {plugin.name}
                                                    </div>
                                                    {plugin.description && (
                                                        <div className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                                                            {plugin.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    v{plugin.version}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {plugin.is_global ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="gap-1"
                                                    >
                                                        <Globe className="h-3 w-3" />
                                                        Global
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1"
                                                    >
                                                        <FileJson className="h-3 w-3" />
                                                        Per Journal (
                                                        {plugin.journals_count})
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {plugin.enabled ? (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {plugin.enabled ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDisable(
                                                                    plugin,
                                                                )
                                                            }
                                                        >
                                                            <PowerOff className="mr-1 h-4 w-4" />
                                                            Disable
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEnable(
                                                                    plugin,
                                                                )
                                                            }
                                                        >
                                                            <Power className="mr-1 h-4 w-4" />
                                                            Enable
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/plugins/${plugin.id}/settings`}
                                                        >
                                                            <Settings className="mr-1 h-4 w-4" />
                                                            Settings
                                                        </Link>
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Uninstall
                                                                    Plugin
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure
                                                                    you want to
                                                                    uninstall "
                                                                    {
                                                                        plugin.display_name
                                                                    }
                                                                    "? This
                                                                    action
                                                                    cannot be
                                                                    undone and
                                                                    all plugin
                                                                    data will be
                                                                    removed.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            plugin,
                                                                        )
                                                                    }
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Uninstall
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
