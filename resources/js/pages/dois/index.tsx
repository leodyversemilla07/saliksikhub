import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    ExternalLink,
    Link as LinkIcon,
    RefreshCw,
    Send,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import dois from '@/routes/dois';
import manuscriptDois from '@/routes/manuscripts/dois';

interface DOI {
    id: number;
    doi: string;
    prefix: string;
    suffix: string;
    status: 'assigned' | 'queued' | 'deposited' | 'error' | 'stale';
    registration_agency: 'crossref' | 'datacite';
    registered_at: string | null;
    error_message: string | null;
    retry_count: number;
    created_at: string;
}

interface Publication {
    id: number;
    version: string;
    title: string;
    status: string;
    doi: DOI | null;
}

interface Manuscript {
    id: number;
    title: string;
    slug: string;
}

interface Props {
    manuscript: Manuscript;
    publications: Publication[];
    doiPrefix: string;
}

export default function DOIIndex({
    manuscript,
    publications,
    doiPrefix,
}: Props) {
    const [selectedPublication, setSelectedPublication] =
        useState<Publication | null>(null);
    const [showAssignDialog, setShowAssignDialog] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        custom_suffix: '',
        registration_agency: 'crossref' as 'crossref' | 'datacite',
    });

    const handleAssignDOI = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPublication) {
return;
}

        post(
            manuscriptDois.assign.url([
                manuscript.id,
                selectedPublication.id,
            ]),
            {
                onSuccess: () => {
                    setShowAssignDialog(false);
                    setSelectedPublication(null);
                    reset();
                },
            },
        );
    };

    const handleRegisterDOI = (doiId: number) => {
        if (confirm('Are you sure you want to register this DOI?')) {
            router.post(dois.register.url(doiId));
        }
    };

    const handleRedepositDOI = (doiId: number) => {
        if (confirm('Re-deposit updated metadata for this DOI?')) {
            router.post(dois.redeposit.url(doiId));
        }
    };

    const handleCheckStatus = (doiId: number) => {
        router.post(dois.checkStatus.url(doiId));
    };

    const handleDeleteDOI = (doiId: number) => {
        if (confirm('Are you sure you want to remove this DOI?')) {
            router.delete(dois.destroy.url(doiId));
        }
    };

    const handleBatchAssign = () => {
        if (confirm('Assign DOIs to all publications without DOIs?')) {
            router.post(manuscriptDois.batchAssign.url(manuscript.id), {
                registration_agency: 'crossref',
            });
        }
    };

    const handleBatchRegister = () => {
        if (confirm('Register all pending DOIs?')) {
            router.post(manuscriptDois.batchRegister.url(manuscript.id));
        }
    };

    const getStatusBadge = (status: DOI['status']) => {
        const config = {
            assigned: {
                color: 'bg-gray-100 text-gray-800',
                icon: <Clock className="h-3 w-3" />,
                label: 'Assigned',
            },
            queued: {
                color: 'bg-blue-100 text-blue-800',
                icon: <Clock className="h-3 w-3" />,
                label: 'Queued',
            },
            deposited: {
                color: 'bg-green-100 text-green-800',
                icon: <CheckCircle2 className="h-3 w-3" />,
                label: 'Registered',
            },
            error: {
                color: 'bg-red-100 text-red-800',
                icon: <XCircle className="h-3 w-3" />,
                label: 'Error',
            },
            stale: {
                color: 'bg-yellow-100 text-yellow-800',
                icon: <AlertCircle className="h-3 w-3" />,
                label: 'Stale',
            },
        };

        const { color, icon, label } = config[status];

        return (
            <Badge className={`${color} flex items-center gap-1`}>
                {icon}
                {label}
            </Badge>
        );
    };

    const pendingCount = publications.filter(
        (p) => p.doi && p.doi.status !== 'deposited',
    ).length;
    const registeredCount = publications.filter(
        (p) => p.doi?.status === 'deposited',
    ).length;
    const unassignedCount = publications.filter((p) => !p.doi).length;

    return (
        <AppLayout>
            <Head title={`DOI Management - ${manuscript.title}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            DOI Management
                        </h1>
                        <p className="text-gray-600">{manuscript.title}</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total Publications
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {publications.length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Unassigned
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-500">
                                    {unassignedCount}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Pending Registration
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {pendingCount}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Registered
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {registeredCount}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="mb-6 flex gap-2">
                        <Button
                            onClick={handleBatchAssign}
                            disabled={unassignedCount === 0}
                        >
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Assign All DOIs
                        </Button>
                        <Button
                            onClick={handleBatchRegister}
                            disabled={pendingCount === 0}
                            variant="outline"
                        >
                            <Send className="mr-2 h-4 w-4" />
                            Register All Pending
                        </Button>
                    </div>

                    {/* Configuration Info */}
                    <Alert className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>DOI Prefix:</strong> {doiPrefix}
                            <br />
                            <span className="text-sm text-gray-600">
                                Configure CrossRef/DataCite credentials in your
                                .env file to enable registration.
                            </span>
                        </AlertDescription>
                    </Alert>

                    {/* Publications List */}
                    <div className="space-y-4">
                        {publications.map((publication) => (
                            <Card key={publication.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">
                                                Version {publication.version} -{' '}
                                                {publication.title}
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                {publication.doi ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-sm">
                                                                {
                                                                    publication
                                                                        .doi.doi
                                                                }
                                                            </span>
                                                            <a
                                                                href={`https://doi.org/${publication.doi.doi}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(
                                                                publication.doi
                                                                    .status,
                                                            )}
                                                            <Badge variant="outline">
                                                                {
                                                                    publication
                                                                        .doi
                                                                        .registration_agency
                                                                }
                                                            </Badge>
                                                        </div>
                                                        {publication.doi
                                                            .error_message && (
                                                            <div className="mt-2 text-sm text-red-600">
                                                                Error:{' '}
                                                                {
                                                                    publication
                                                                        .doi
                                                                        .error_message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        No DOI assigned
                                                    </span>
                                                )}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            {!publication.doi ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedPublication(
                                                            publication,
                                                        );
                                                        setShowAssignDialog(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    <LinkIcon className="mr-1 h-3 w-3" />
                                                    Assign DOI
                                                </Button>
                                            ) : (
                                                <>
                                                    {publication.doi.status !==
                                                        'deposited' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRegisterDOI(
                                                                    publication
                                                                        .doi!
                                                                        .id,
                                                                )
                                                            }
                                                        >
                                                            <Send className="mr-1 h-3 w-3" />
                                                            Register
                                                        </Button>
                                                    )}
                                                    {publication.doi.status ===
                                                        'deposited' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleRedepositDOI(
                                                                    publication
                                                                        .doi!
                                                                        .id,
                                                                )
                                                            }
                                                        >
                                                            <RefreshCw className="mr-1 h-3 w-3" />
                                                            Re-deposit
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleCheckStatus(
                                                                publication.doi!
                                                                    .id,
                                                            )
                                                        }
                                                    >
                                                        <RefreshCw className="mr-1 h-3 w-3" />
                                                        Check
                                                    </Button>
                                                    {publication.doi.status !==
                                                        'deposited' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDeleteDOI(
                                                                    publication
                                                                        .doi!
                                                                        .id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>

                    {/* Assign DOI Dialog */}
                    <Dialog
                        open={showAssignDialog}
                        onOpenChange={setShowAssignDialog}
                    >
                        <DialogContent>
                            <form onSubmit={handleAssignDOI}>
                                <DialogHeader>
                                    <DialogTitle>Assign DOI</DialogTitle>
                                    <DialogDescription>
                                        Assign a DOI to{' '}
                                        {selectedPublication?.title} (Version{' '}
                                        {selectedPublication?.version})
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="registration_agency">
                                            Registration Agency
                                        </Label>
                                        <Select
                                            value={data.registration_agency}
                                            onValueChange={(value) =>
                                                setData(
                                                    'registration_agency',
                                                    value as any,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="crossref">
                                                    CrossRef
                                                </SelectItem>
                                                <SelectItem value="datacite">
                                                    DataCite
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="custom_suffix">
                                            Custom Suffix{' '}
                                            <span className="text-gray-500">
                                                (optional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="custom_suffix"
                                            value={data.custom_suffix}
                                            onChange={(e) =>
                                                setData(
                                                    'custom_suffix',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Leave empty for auto-generated suffix"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Full DOI: {doiPrefix}/
                                            {data.custom_suffix || '...'}
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setShowAssignDialog(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Assign DOI
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}
