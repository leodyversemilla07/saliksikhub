import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    FileUp,
    Globe,
    Upload,
    XCircle,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';

import AppLayout from '@/layouts/app-layout';

interface Journal {
    id: number;
    name: string;
    slug: string;
}

interface Stats {
    issues: number;
    articles: number;
    authors: number;
    skipped: number;
    errors: string[];
}

interface Props {
    journals: Journal[];
    selectedJournal?: Journal;
    flash?: { stats?: Stats; journal_name?: string; type?: string };
}

export default function OJSImportIndex({
    journals,
    selectedJournal,
    flash,
}: Props) {
    const [journalId, setJournalId] = useState(
        selectedJournal?.id ?? journals[0]?.id ?? '',
    );
    const [file, setFile] = useState<File | null>(null);
    const [publishArticles, setPublishArticles] = useState(false);
    const [skipExistingDois, setSkipExistingDois] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!file || !journalId) return;

        setSubmitting(true);
        const formData = new FormData();
        formData.append('journal_id', String(journalId));
        formData.append('xml_file', file);
        formData.append('publish_articles', String(publishArticles));
        formData.append('skip_existing_dois', String(skipExistingDois));

        // Inertia POST with FormData
        // Use native form submission to handle file uploads
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('admin.ojs-import.store');
        form.enctype = 'multipart/form-data';

        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value =
            (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content ?? '';
        form.appendChild(csrfInput);

        for (const [key, value] of Object.entries({
            journal_id: String(journalId),
            publish_articles: String(publishArticles),
            skip_existing_dois: String(skipExistingDois),
        })) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value as string;
            form.appendChild(input);
        }

        // Append file
        const dt = new DataTransfer();
        dt.items.add(file);
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.name = 'xml_file';
        fileInput.files = dt.files;
        form.appendChild(fileInput);

        document.body.appendChild(form);
        form.submit();
    }

    return (
        <AppLayout>
            <Head title="OJS Import" />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="mb-6 flex items-center gap-2">
                    <Link
                        href={route('admin.plugins.index')}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            OJS Import
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Import issues, articles, and authors from an OJS
                            Native XML export
                        </p>
                    </div>
                </div>

                {/* Flash messages */}
                {flash?.stats && (
                    <div
                        className={`mb-6 rounded-lg border p-4 ${flash.type === 'success' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'}`}
                    >
                        <div className="flex items-start gap-3">
                            {flash.type === 'success' ? (
                                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                            ) : (
                                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                            )}
                            <div className="space-y-1">
                                <p className="text-sm font-medium">
                                    Import into{' '}
                                    <span className="font-semibold">
                                        {flash.journal_name}
                                    </span>
                                </p>
                                <div className="flex flex-wrap gap-3 text-sm">
                                    <span className="text-green-600 dark:text-green-400">
                                        {flash.stats.issues} issues,{' '}
                                        {flash.stats.articles} articles,{' '}
                                        {flash.stats.authors} authors
                                    </span>
                                    {flash.stats.skipped > 0 && (
                                        <span className="text-muted-foreground">
                                            ({flash.stats.skipped} skipped)
                                        </span>
                                    )}
                                </div>
                                {flash.stats.errors.length > 0 && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-sm text-amber-600 hover:underline dark:text-amber-400">
                                            {flash.stats.errors.length} error(s)
                                        </summary>
                                        <ul className="mt-1 max-h-40 space-y-0.5 overflow-y-auto text-xs text-muted-foreground">
                                            {flash.stats.errors.map(
                                                (err, i) => (
                                                    <li
                                                        key={i}
                                                        className="border-l-2 border-red-300 pl-4 dark:border-red-700"
                                                    >
                                                        {err}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </details>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Journal Select */}
                    <div>
                        <label
                            htmlFor="journal_id"
                            className="mb-2 block text-sm font-medium"
                        >
                            Target Journal
                        </label>
                        <select
                            id="journal_id"
                            value={journalId}
                            onChange={(e) =>
                                setJournalId(Number(e.target.value))
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                            required
                        >
                            {journals.map((j) => (
                                <option key={j.id} value={j.id}>
                                    {j.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label
                            htmlFor="xml_file"
                            className="mb-2 block text-sm font-medium"
                        >
                            OJS Native XML File
                        </label>
                        <div className="rounded-lg border-2 border-dashed border-input p-6 text-center transition-colors hover:border-primary/50">
                            {file ? (
                                <div className="space-y-2">
                                    <FileUp className="mx-auto h-8 w-8 text-primary" />
                                    <p className="text-sm font-medium">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="text-xs text-destructive hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <label className="block cursor-pointer">
                                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        <span className="text-primary hover:underline">
                                            Click to upload
                                        </span>{' '}
                                        or drag and drop
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        OJS Native XML export (max 10MB)
                                    </p>
                                    <input
                                        id="xml_file"
                                        type="file"
                                        accept=".xml"
                                        className="hidden"
                                        onChange={(e) =>
                                            setFile(e.target.files?.[0] ?? null)
                                        }
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Options */}
                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium">
                            Import Options
                        </legend>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="publish_articles"
                                checked={publishArticles}
                                onChange={(e) =>
                                    setPublishArticles(e.target.checked)
                                }
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                                htmlFor="publish_articles"
                                className="text-sm leading-relaxed"
                            >
                                <span className="font-medium">
                                    Publish articles immediately
                                </span>
                                <p className="text-xs text-muted-foreground">
                                    Set imported articles to published status
                                </p>
                            </label>
                        </div>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="skip_existing_dois"
                                checked={skipExistingDois}
                                onChange={(e) =>
                                    setSkipExistingDois(e.target.checked)
                                }
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                                htmlFor="skip_existing_dois"
                                className="text-sm leading-relaxed"
                            >
                                <span className="font-medium">
                                    Skip articles with existing DOIs
                                </span>
                                <p className="text-xs text-muted-foreground">
                                    Avoid duplicate imports by checking DOI
                                    uniqueness
                                </p>
                            </label>
                        </div>
                    </fieldset>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!file || !journalId || submitting}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Globe className="h-4 w-4" />
                        {submitting ? 'Importing...' : 'Start Import'}
                    </button>
                </form>

                {/* Help section */}
                <div className="mt-10 rounded-lg border bg-muted/30 p-5">
                    <h3 className="mb-2 text-sm font-semibold">
                        How to export from OJS
                    </h3>
                    <ol className="list-inside list-decimal space-y-1.5 text-sm text-muted-foreground">
                        <li>
                            In OJS, go to{' '}
                            <strong>
                                Tools &rarr; Import/Export &rarr; Native XML
                                Plugin
                            </strong>
                        </li>
                        <li>Select the issues/articles you want to export</li>
                        <li>
                            Click <strong>Export</strong> to download the XML
                            file
                        </li>
                        <li>
                            Upload the XML file here and select the target
                            journal
                        </li>
                    </ol>
                    <p className="mt-3 text-xs text-muted-foreground">
                        The OJS Native XML format contains issues, articles,
                        authors, DOIs, keywords, and abstracts. Authors are
                        stored as text in the manuscript record.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
