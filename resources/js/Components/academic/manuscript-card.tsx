/**
 * ManuscriptCard Component
 * 
 * Displays manuscript information in an academic paper card style,
 * inspired by traditional library index cards and journal abstracts.
 * Part of the Scholarly Design System.
 */

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { FileText, Calendar, Users, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Author {
    name: string;
    affiliation?: string;
}

interface ManuscriptCardProps {
    id: number;
    title: string;
    authors: string | Author[];
    abstract?: string;
    keywords?: string[];
    submittedDate: string;
    status: string;
    manuscriptId?: string;
    href?: string;
    className?: string;
    showAbstract?: boolean;
}

/**
 * Format authors in academic citation style
 */
function formatAuthors(authors: string | Author[]): string {
    if (typeof authors === 'string') {
        return authors;
    }
    
    return authors
        .map((author, index) => {
            if (index === authors.length - 1 && authors.length > 1) {
                return `& ${author.name}`;
            }
            return author.name;
        })
        .join(', ');
}

/**
 * Get status badge variant based on manuscript status
 */
function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    const statusMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        'submitted': 'secondary',
        'under_review': 'default',
        'revision_needed': 'outline',
        'accepted': 'default',
        'published': 'default',
        'rejected': 'destructive',
    };
    
    return statusMap[status] || 'secondary';
}

/**
 * Format status text for display
 */
function formatStatus(status: string): string {
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function ManuscriptCard({
    id,
    title,
    authors,
    abstract,
    keywords = [],
    submittedDate,
    status,
    manuscriptId,
    href,
    className,
    showAbstract = false,
}: ManuscriptCardProps) {
    const formattedAuthors = formatAuthors(authors);
    const CardWrapper = href ? Link : 'div';
    
    return (
        <CardWrapper
            {...(href ? { href } : {})}
            className={cn(
                'block transition-all duration-200',
                href && 'hover:shadow-md hover:border-primary/20',
                className
            )}
        >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-3 pb-4">
                    {/* Manuscript ID and Status */}
                    <div className="flex items-start justify-between gap-4">
                        {manuscriptId && (
                            <code className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                {manuscriptId}
                            </code>
                        )}
                        <Badge 
                            variant={getStatusVariant(status)}
                            className="shrink-0"
                        >
                            {formatStatus(status)}
                        </Badge>
                    </div>

                    {/* Title - Academic Style */}
                    <h3 className="font-serif text-xl font-bold leading-tight text-foreground">
                        {title}
                    </h3>

                    {/* Authors - Italic, Academic Citation Style */}
                    <p className="font-serif italic text-base text-muted-foreground">
                        {formattedAuthors}
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Abstract (if shown) */}
                    {showAbstract && abstract && (
                        <>
                            <div className="prose prose-sm max-w-none">
                                <p className="font-serif text-sm leading-relaxed text-foreground/90">
                                    {abstract.length > 300 
                                        ? `${abstract.substring(0, 300)}...` 
                                        : abstract
                                    }
                                </p>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-sans">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={submittedDate}>
                                {new Date(submittedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Manuscript #{id}</span>
                        </div>
                    </div>

                    {/* Keywords */}
                    {keywords.length > 0 && (
                        <>
                            <Separator />
                            <div className="flex flex-wrap items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="font-sans text-xs uppercase tracking-wide text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-sm"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </CardWrapper>
    );
}

/**
 * Compact variant for list views
 */
export function ManuscriptCardCompact({
    id,
    title,
    authors,
    submittedDate,
    status,
    manuscriptId,
    href,
    className,
}: Omit<ManuscriptCardProps, 'abstract' | 'keywords' | 'showAbstract'>) {
    const formattedAuthors = formatAuthors(authors);
    const CardWrapper = href ? Link : 'div';
    
    return (
        <CardWrapper
            {...(href ? { href } : {})}
            className={cn(
                'block transition-all duration-150',
                href && 'hover:bg-muted/50',
                className
            )}
        >
            <div className="flex items-start justify-between gap-4 p-4 border-b border-border/50 last:border-b-0">
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                        {manuscriptId && (
                            <code className="font-mono text-xs text-muted-foreground">
                                {manuscriptId}
                            </code>
                        )}
                        <Badge 
                            variant={getStatusVariant(status)}
                            className="text-xs"
                        >
                            {formatStatus(status)}
                        </Badge>
                    </div>
                    
                    <h4 className="font-serif text-base font-semibold leading-snug text-foreground">
                        {title}
                    </h4>
                    
                    <p className="font-serif italic text-sm text-muted-foreground">
                        {formattedAuthors}
                    </p>
                </div>
                
                <div className="text-right shrink-0">
                    <time 
                        dateTime={submittedDate}
                        className="font-sans text-xs text-muted-foreground"
                    >
                        {new Date(submittedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </time>
                </div>
            </div>
        </CardWrapper>
    );
}
