import { Check, ChevronDown, Copy, Quote } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CitationToolProps {
    title: string;
    authors: string[];
    journalName: string;
    volume?: number | null;
    issue?: number | null;
    pages?: string | null;
    doi?: string | null;
    publicationDate?: string | null;
    year?: string | null;
    publisher?: string;
    url: string;
    availableFormats: string[];
    defaultFormat: string;
    formatLabels: Record<string, string>;
}

type FormatKey = 'apa' | 'mla' | 'chicago' | 'harvard' | 'vancouver';

/**
 * Generate a formatted citation string from manuscript metadata.
 * Uses pure string formatting — no external libraries needed.
 */
function formatCitation(format: FormatKey, props: CitationToolProps): string {
    const {
        title,
        authors,
        journalName,
        volume,
        issue,
        pages,
        doi,
        year,
        url,
    } = props;
    const yr = year ?? '(n.d.)';
    const doiStr = doi ? `https://doi.org/${doi}` : url;

    switch (format) {
        case 'apa': {
            const authorStr = formatAuthorsAPA(authors);
            const volIssue =
                volume && issue
                    ? `${volume}(${issue})`
                    : volume
                      ? `${volume}`
                      : '';
            const pageStr = pages ? `, ${pages}` : '';
            const source =
                volIssue || pages
                    ? `*${journalName}*, ${volIssue}${pageStr}`
                    : `*${journalName}*`;

            return `${authorStr} (${yr}). ${title}. ${source}. ${doiStr}`;
        }

        case 'mla': {
            const authorStr = formatAuthorsMLA(authors);
            const volIssue =
                volume && issue
                    ? `vol. ${volume}, no. ${issue}`
                    : volume
                      ? `vol. ${volume}`
                      : '';
            const pageStr = pages ? `, pp. ${pages}` : '';
            const sourceParts = [`*${journalName}*`];

            if (volIssue) {
                sourceParts.push(volIssue);
            }

            if (pageStr) {
                sourceParts.push(pageStr);
            }

            const source = sourceParts.join(', ');

            return `${authorStr} "${title}." ${source}, ${yr}. ${doiStr}.`;
        }

        case 'chicago': {
            const authorStr = formatAuthorsChicago(authors);
            const volIssue =
                volume && issue
                    ? `${volume}, no. ${issue}`
                    : volume
                      ? `${volume}`
                      : '';
            const pageStr = pages ? `: ${pages}` : '';
            const source = volIssue
                ? `${journalName} ${volIssue}${pageStr} (${yr})`
                : `${journalName} (${yr})`;

            return `${authorStr} "${title}" ${source}. ${doiStr}.`;
        }

        case 'harvard': {
            const authorStr = formatAuthorsHarvard(authors, yr);
            const volIssue =
                volume && issue
                    ? `${volume}(${issue})`
                    : volume
                      ? `${volume}`
                      : '';
            const pageStr = pages ? `, pp. ${pages}` : '';
            const source =
                volIssue || pages
                    ? `${journalName}, ${volIssue}${pageStr}`
                    : journalName;

            return `${authorStr} ${title}. ${source}. ${doiStr}.`;
        }

        case 'vancouver': {
            const authorStr = formatAuthorsVancouver(authors);
            const volIssue =
                volume && issue
                    ? `${volume}(${issue})`
                    : volume
                      ? `${volume}`
                      : '';
            const pageStr = pages ? `:${pages}` : '';
            const source = `${journalName}. ${yr}${volIssue ? `;${volIssue}` : ''}${pageStr}.`;

            return `${authorStr} ${title}. ${source} ${doiStr}.`;
        }

        default:
            return '';
    }
}

function formatAuthorsAPA(authors: string[]): string {
    if (authors.length === 0) {
        return 'Anonymous';
    }

    if (authors.length === 1) {
        return authors[0];
    }

    if (authors.length === 2) {
        return `${authors[0]} & ${authors[1]}`;
    }

    return `${authors.slice(0, -1).join(', ')}, & ${authors[authors.length - 1]}`;
}

function formatAuthorsMLA(authors: string[]): string {
    if (authors.length === 0) {
        return 'Anonymous.';
    }

    if (authors.length === 1) {
        return `${authors[0]}.`;
    }

    if (authors.length === 2) {
        return `${authors[0]} and ${authors[1]}.`;
    }

    return `${authors[0]}, et al.`;
}

function formatAuthorsChicago(authors: string[]): string {
    if (authors.length === 0) {
        return 'Anonymous';
    }

    if (authors.length === 1) {
        return authors[0];
    }

    if (authors.length <= 3) {
        return authors.join(', ').replace(/, ([^,]+)$/, ', and $1');
    }

    return `${authors[0]} et al.`;
}

function formatAuthorsHarvard(authors: string[], year: string): string {
    if (authors.length === 0) {
        return 'Anonymous';
    }

    const surname = authors[0].split(' ').pop() ?? authors[0];

    if (authors.length === 1) {
        return `${surname} (${year})`;
    }

    if (authors.length === 2) {
        return `${surname} and ${authors[1].split(' ').pop()} (${year})`;
    }

    return `${surname} et al. (${year})`;
}

function formatAuthorsVancouver(authors: string[]): string {
    if (authors.length === 0) {
        return 'Anonymous';
    }

    if (authors.length <= 3) {
        return authors.join(', ');
    }

    return `${authors[0]}, ${authors[1]}, ${authors[2]}, et al.`;
}

/**
 * Citation Tool plugin component.
 * Injected into the 'content_bottom' slot on manuscript public view pages.
 */
export function CitationTool(props: CitationToolProps) {
    const [format, setFormat] = useState<FormatKey>(
        props.defaultFormat as FormatKey,
    );
    const [copied, setCopied] = useState(false);

    const citation = useMemo(
        () => formatCitation(format, props),
        [format, props],
    );

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(citation);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for environments where clipboard API is unavailable
            const textarea = document.createElement('textarea');
            textarea.value = citation;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [citation]);

    const currentFormatLabel =
        props.formatLabels[format] ?? format.toUpperCase();

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Quote className="h-5 w-5 text-primary" />
                    How to Cite
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Select a citation format and copy the formatted citation
                    text.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                {currentFormatLabel}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {props.availableFormats.map((key) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setFormat(key as FormatKey)}
                                    className={
                                        format === key
                                            ? 'bg-accent font-medium'
                                            : ''
                                    }
                                >
                                    {props.formatLabels[key] ?? key}
                                    {format === key && ' ✓'}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                Copy Citation
                            </>
                        )}
                    </Button>
                </div>

                <div className="relative">
                    <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                        {citation}
                    </pre>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={handleCopy}
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
