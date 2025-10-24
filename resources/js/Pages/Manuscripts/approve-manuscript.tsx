import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileText, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import editor from '@/routes/editor';
import manuscriptsRoutes from '@/routes/manuscripts';

interface ManuscriptProps {
    id: number;
    title: string;
    authors: string[];
    status: string;
    final_pdf_url: string | null;
}

export default function ApproveManuscript({ manuscript }: PageProps<{ manuscript: ManuscriptProps }>) {
    const [showRejectionForm, setShowRejectionForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        action: 'approve',
        rejection_reason: '',
        _method: 'POST',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(manuscriptsRoutes.approve.submit.url({ id: manuscript.id }), {
            preserveScroll: true,
            preserveState: false,
            forceFormData: true,
            onSuccess: () => {
                toast(data.action === 'approve'
                    ? "Manuscript has been approved for publication."
                    : "Manuscript has been rejected.");
                reset();
                setShowRejectionForm(false);
            },
            onError: (errors) => {
                console.error('Form submission error:', errors);
                toast.error(`Failed to process the manuscript. Please check the form for errors.`);
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        }
    };

    const ManuscriptDetailsPanel = () => (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors duration-300">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Manuscript Review</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Title</label>
                                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1 leading-relaxed">{manuscript.title}</h3>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                <label className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Authors</label>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {manuscript.authors.map((author, index) => (
                                        <span key={index} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 text-sm rounded">
                                            {author}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                        <input type="hidden" name="_method" value="POST" />

                        {showRejectionForm && (
                            <div className="space-y-4">
                                <RadioGroup
                                    value={data.action}
                                    onValueChange={(value) => setData('action', value)}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="approve" id="approve" />
                                        <Label htmlFor="approve" className="text-sm font-medium text-gray-900 dark:text-gray-100">Approve for publication</Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="reject" id="reject" />
                                        <Label htmlFor="reject" className="text-sm font-medium text-gray-900 dark:text-gray-100">Reject submission</Label>
                                    </div>
                                </RadioGroup>

                                {data.action === 'reject' && (
                                    <div className="space-y-2 mt-4">
                                        <Label htmlFor="rejection_reason" className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
                                            Rejection Reason
                                        </Label>
                                        <Textarea
                                            id="rejection_reason"
                                            value={data.rejection_reason}
                                            onChange={(e) => setData('rejection_reason', e.target.value)}
                                            rows={3}
                                            placeholder="Provide feedback to the authors..."
                                            className={`text-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-300 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500 ${errors.rejection_reason ? 'border-red-300 dark:border-red-600' : ''}`}
                                        />
                                        {errors.rejection_reason && (
                                            <span className="text-xs text-red-600 dark:text-red-400">{errors.rejection_reason}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            {!showRejectionForm ? (
                                <Button
                                    type="button"
                                    onClick={() => setShowRejectionForm(true)}
                                    disabled={processing || !manuscript.final_pdf_url}
                                    className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 border-0 h-10"
                                >
                                    Make Decision
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="submit"
                                        disabled={processing || (!manuscript.final_pdf_url) ||
                                            (data.action === 'reject' && !data.rejection_reason)}
                                        className={`flex-1 h-10 border-0 ${data.action === 'approve'
                                            ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white'
                                            : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white'
                                            }`}
                                    >
                                        {processing ? 'Processing...' : (data.action === 'approve' ? 'Approve' : 'Reject')}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setShowRejectionForm(false);
                                            reset();
                                        }}
                                        variant="outline"
                                        disabled={processing}
                                        className="px-4 h-10 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {showRejectionForm && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                {data.action === 'approve' ? 'Publication Approval' : 'Manuscript Rejection'}
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                {data.action === 'approve'
                                    ? 'This will approve the manuscript for publication.'
                                    : 'Authors will be notified with your feedback.'
                                } This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const ManuscriptPdfPanel = () => (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-300">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Final Manuscript</h2>
                    {manuscript.final_pdf_url && (
                        <a
                            href={manuscript.final_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                        >
                            Open in new tab →
                        </a>
                    )}
                </div>
            </div>
            <div className="h-[800px] bg-white dark:bg-gray-800">
                {manuscript.final_pdf_url ? (
                    <iframe
                        src={manuscript.final_pdf_url}
                        className="w-full h-full"
                        title={`Manuscript: ${manuscript.title}`}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        <FileText size={32} className="mb-3" />
                        <p className="font-medium">No PDF available</p>
                        <p className="text-sm mt-1">Author needs to upload final version</p>
                    </div>
                )}
            </div>
        </div>
    );

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: editor.dashboard.url(),
        },
        {
            label: 'Manuscripts',
            href: editor.indexManuscripts.url(),
        },
        {
            label: 'Approve Manuscript',
            current: true,
        },
    ];

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title="Approve Manuscript" />

            <div className="w-full">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Review Manuscript</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Make approval decision for publication</p>
                        </div>
                        <Badge
                            variant="outline"
                            className={`px-3 py-1 text-xs font-medium ${getStatusColor(manuscript.status)} border-current`}
                        >
                            {manuscript.status}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-1">
                        <ManuscriptDetailsPanel />
                    </div>
                    <div className="xl:col-span-3">
                        <ManuscriptPdfPanel />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
