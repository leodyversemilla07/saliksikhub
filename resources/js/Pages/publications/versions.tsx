import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Clock, FileText, History, Plus, AlertCircle } from 'lucide-react';

interface Publication {
    id: number;
    version: string;
    version_major: number;
    version_minor: number;
    version_stage: string;
    status: string;
    date_published: string | null;
    title: string;
    abstract: string;
    access_status: string;
    embargo_date: string | null;
    created_at: string;
}

interface Manuscript {
    id: number;
    title: string;
    slug: string;
    status: string;
    current_publication_id: number | null;
}

interface Props {
    manuscript: Manuscript;
    publications: Publication[];
    currentPublicationId: number | null;
}

export default function Versions({ manuscript, publications, currentPublicationId }: Props) {
    const [showNewVersionDialog, setShowNewVersionDialog] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        is_major: false,
        version_stage: 'preprint',
        title: manuscript.title,
        abstract: '',
        access_status: 'open',
    });

    const handleCreateVersion = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manuscripts.publications.store', manuscript.id), {
            onSuccess: () => {
                setShowNewVersionDialog(false);
                reset();
            },
        });
    };

    const getStatusBadge = (publication: Publication) => {
        const statusColors = {
            published: 'bg-green-100 text-green-800',
            draft: 'bg-gray-100 text-gray-800',
            queued: 'bg-blue-100 text-blue-800',
            declined: 'bg-red-100 text-red-800',
        };

        const stageIcons = {
            published: <CheckCircle2 className="w-3 h-3" />,
            preprint: <FileText className="w-3 h-3" />,
            under_review: <Clock className="w-3 h-3" />,
            corrected: <AlertCircle className="w-3 h-3" />,
        };

        return (
            <div className="flex items-center gap-2">
                <Badge className={statusColors[publication.status as keyof typeof statusColors]}>
                    {publication.status}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                    {stageIcons[publication.version_stage as keyof typeof stageIcons]}
                    {publication.version_stage}
                </Badge>
            </div>
        );
    };

    const handlePublish = (publicationId: number) => {
        if (confirm('Are you sure you want to publish this version?')) {
            router.post(route('manuscripts.publications.publish', [manuscript.id, publicationId]));
        }
    };

    const handleRevert = (publicationId: number, version: string) => {
        if (confirm(`Are you sure you want to revert to version ${version}?`)) {
            router.post(route('manuscripts.publications.revert', [manuscript.id, publicationId]));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Publication Versions - ${manuscript.title}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Publication Versions</h1>
                        <p className="text-gray-600">{manuscript.title}</p>
                    </div>

                    {/* Actions */}
                    <div className="mb-6 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            {publications.length} version{publications.length !== 1 ? 's' : ''}
                        </div>
                        <Dialog open={showNewVersionDialog} onOpenChange={setShowNewVersionDialog}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Version
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <form onSubmit={handleCreateVersion}>
                                    <DialogHeader>
                                        <DialogTitle>Create New Publication Version</DialogTitle>
                                        <DialogDescription>
                                            Create a new version of this manuscript for publication.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="version_type">Version Type</Label>
                                            <Select
                                                value={data.is_major ? 'major' : 'minor'}
                                                onValueChange={(value) => setData('is_major', value === 'major')}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="minor">Minor Version (x.Y)</SelectItem>
                                                    <SelectItem value="major">Major Version (X.0)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="version_stage">Version Stage</Label>
                                            <Select value={data.version_stage} onValueChange={(value) => setData('version_stage', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="preprint">Preprint</SelectItem>
                                                    <SelectItem value="under_review">Under Review</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="access_status">Access Status</Label>
                                            <Select value={data.access_status} onValueChange={(value) => setData('access_status', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="open">Open Access</SelectItem>
                                                    <SelectItem value="subscription">Subscription</SelectItem>
                                                    <SelectItem value="embargo">Embargo</SelectItem>
                                                    <SelectItem value="restricted">Restricted</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setShowNewVersionDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            Create Version
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Version List */}
                    <div className="space-y-4">
                        {publications.map((publication) => (
                            <Card key={publication.id} className={publication.id === currentPublicationId ? 'ring-2 ring-blue-500' : ''}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                Version {publication.version}
                                                {publication.id === currentPublicationId && (
                                                    <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="mt-2">{getStatusBadge(publication)}</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            {publication.status !== 'published' && (
                                                <Button size="sm" onClick={() => handlePublish(publication.id)}>
                                                    Publish
                                                </Button>
                                            )}
                                            {publication.id !== currentPublicationId && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRevert(publication.id, publication.version)}
                                                >
                                                    <History className="w-3 h-3 mr-1" />
                                                    Revert
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3 text-sm">
                                        <div>
                                            <span className="font-medium">Title:</span> {publication.title}
                                        </div>
                                        {publication.date_published && (
                                            <div>
                                                <span className="font-medium">Published:</span>{' '}
                                                {new Date(publication.date_published).toLocaleDateString()}
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium">Created:</span>{' '}
                                            {new Date(publication.created_at).toLocaleDateString()}
                                        </div>
                                        <div>
                                            <span className="font-medium">Access:</span>{' '}
                                            <Badge variant="outline">{publication.access_status}</Badge>
                                            {publication.embargo_date && (
                                                <span className="ml-2 text-gray-600">
                                                    (until {new Date(publication.embargo_date).toLocaleDateString()})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {publications.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-gray-500 mb-4">No publications yet</p>
                                <Button onClick={() => setShowNewVersionDialog(true)}>Create First Version</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
