import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Edit,
    BookOpen,
    Calendar,
    FileText,
    User,
    Hash,
    Globe,
    Lightbulb,
    Clock,
    Archive,
    Eye,
    Plus,
    Trash2
} from 'lucide-react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';

interface JournalIssue {
    id: number;
    volume_number: number;
    issue_number: number;
    issue_title: string | null;
    description: string | null;
    publication_date: string | null;
    status: 'draft' | 'in_review' | 'published' | 'archived';
    cover_image: string | null;
    doi: string | null;
    theme: string | null;
    editorial_note: string | null;
    user: {
        id: number;
        name: string;
        email?: string;
    };
    created_at: string;
    updated_at: string;
}

interface Manuscript {
    id: number;
    title: string;
    status: string;
    manuscript_id: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    issue: JournalIssue;
    manuscripts: Manuscript[];
    coverImageUrl?: string | null;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'draft':
            return 'bg-gray-500 text-white';
        case 'in_review':
            return 'bg-blue-500 text-white';
        case 'published':
            return 'bg-green-500 text-white';
        case 'archived':
            return 'bg-amber-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'draft':
            return <Edit className="h-4 w-4" />;
        case 'in_review':
            return <Eye className="h-4 w-4" />;
        case 'published':
            return <BookOpen className="h-4 w-4" />;
        case 'archived':
            return <Archive className="h-4 w-4" />;
        default:
            return <FileText className="h-4 w-4" />;
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'draft':
            return 'Draft';
        case 'in_review':
            return 'In Review';
        case 'published':
            return 'Published';
        case 'archived':
            return 'Archived';
        default:
            return status;
    }
};

export default function Show({ issue, manuscripts, coverImageUrl }: ShowProps) {
    const [unassigningManuscript, setUnassigningManuscript] = useState<number | null>(null);
    const [showUnassignDialog, setShowUnassignDialog] = useState(false);
    const [manuscriptToUnassign, setManuscriptToUnassign] = useState<Manuscript | null>(null);

    const handleUnassignManuscript = () => {
        if (!manuscriptToUnassign) return;

        setUnassigningManuscript(manuscriptToUnassign.id);
        router.delete(
            route('issues.manuscripts.unassign', [issue.id, manuscriptToUnassign.id]),
            {
                onSuccess: () => {
                    setUnassigningManuscript(null);
                    setShowUnassignDialog(false);
                    setManuscriptToUnassign(null);
                },
                onError: (errors) => {
                    setUnassigningManuscript(null);
                    console.error('Error removing manuscript:', errors);
                    alert('Failed to remove manuscript from issue. Please try again.');
                }
            }
        );
    };

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
        },
        {
            label: 'Journal Issues',
            href: route('issues.index'),
        },
        {
            label: `Vol. ${issue.volume_number}, Issue ${issue.issue_number}`,
            href: route('issues.show', issue.id),
        }
    ];

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Journal Issue - Vol. ${issue.volume_number}, Issue ${issue.issue_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">                    {/* Header Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl flex items-center gap-3">
                                        <BookOpen className="h-8 w-8 text-blue-600" />
                                        Volume {issue.volume_number}, Issue {issue.issue_number}
                                        {issue.issue_title && (
                                            <span className="text-gray-600">- {issue.issue_title}</span>
                                        )}
                                    </CardTitle>
                                    <div className="flex items-center gap-4 mt-3">
                                        <Badge className={getStatusColor(issue.status)}>
                                            {getStatusIcon(issue.status)}
                                            <span className="ml-1">{getStatusLabel(issue.status)}</span>
                                        </Badge>
                                        {issue.theme && (
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                <Lightbulb className="h-3 w-3" />
                                                {issue.theme}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Cover Image */}
                                {coverImageUrl && (
                                    <div className="ml-6">
                                        <img
                                            src={coverImageUrl}
                                            alt={`Cover for Volume ${issue.volume_number}, Issue ${issue.issue_number}`}
                                            className="w-32 h-40 object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                
                                <div className="flex space-x-2 ml-4">
                                    <Link href={route('issues.edit', issue.id)}>
                                        <Button variant="outline">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        onClick={() => router.visit(route('issues.index'))}
                                    >
                                        Back to Issues
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {issue.description && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Description
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {issue.description}
                                    </p>
                                </div>
                            )}

                            <Separator />

                            {/* Issue Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium">Publication Date</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {issue.publication_date
                                                ? new Date(issue.publication_date).toLocaleDateString()
                                                : 'Not set'
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium">Created by</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {issue.user.name}
                                        </p>
                                    </div>
                                </div>

                                {issue.doi && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm font-medium">DOI</p>
                                            <a
                                                href={`https://doi.org/${issue.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                                            >
                                                {issue.doi}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                    <div>
                                        <p className="text-sm font-medium">Created</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(issue.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Hash className="h-5 w-5 text-gray-600" />
                                    <div>
                                        <p className="text-sm font-medium">Manuscripts</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {manuscripts.length} assigned
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {issue.editorial_note && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Editorial Note
                                        </h3>
                                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                            <p className="text-amber-800 dark:text-amber-200">
                                                {issue.editorial_note}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Manuscripts Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-6 w-6" />
                                    Assigned Manuscripts ({manuscripts.length})
                                </CardTitle>                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.visit(route('issues.assign-manuscripts.form', issue.id))}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Assign Manuscripts
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {manuscripts.length > 0 ? (
                                <div className="space-y-4">
                                    {manuscripts.map((manuscript) => (
                                        <div
                                            key={manuscript.id}
                                            className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {manuscript.title}
                                                </h4>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Hash className="h-3 w-3" />
                                                        {manuscript.manuscript_id}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {manuscript.user.name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(manuscript.created_at).toLocaleDateString()}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {manuscript.status.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Remove from Issue"
                                                    disabled={unassigningManuscript === manuscript.id}
                                                    onClick={() => {
                                                        setManuscriptToUnassign(manuscript);
                                                        setShowUnassignDialog(true);
                                                    }}
                                                >
                                                    {unassigningManuscript === manuscript.id ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No manuscripts assigned
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        This journal issue doesn't have any manuscripts assigned yet.
                                    </p>                                    <Button
                                        variant="outline"
                                        onClick={() => router.visit(route('issues.assign-manuscripts.form', issue.id))}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Assign Manuscripts
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Unassign Manuscript Confirmation Dialog */}
            <AlertDialog open={showUnassignDialog} onOpenChange={setShowUnassignDialog}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold text-red-600">
                            Remove Manuscript from Issue
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                            Are you sure you want to remove "{manuscriptToUnassign?.title}" from this journal issue?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel
                            className="border-gray-300 text-sm"
                            onClick={() => {
                                setShowUnassignDialog(false);
                                setManuscriptToUnassign(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleUnassignManuscript}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm"
                            disabled={unassigningManuscript !== null}
                        >
                            {unassigningManuscript !== null ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Removing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    Remove from Issue
                                </span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
