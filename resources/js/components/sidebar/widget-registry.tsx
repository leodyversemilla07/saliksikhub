import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    Clock,
    FileText,
    Hash,
    Layers,
    Users,
} from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * Widget definition — what gets passed to the renderer component.
 */
export interface Widget {
    /** Unique identifier for this widget instance */
    id: string;
    /** Widget type key used to look up the registered renderer */
    type: string;
    /** Display title shown in the widget header */
    title: string;
    /** Widget-specific configuration */
    settings: Record<string, unknown>;
    /** Position in the sidebar */
    order: number;
}

/**
 * Props every widget renderer receives.
 */
export interface WidgetProps {
    widget: Widget;
}

/**
 * A registered widget renderer component.
 */
type WidgetComponent = ComponentType<WidgetProps>;

// ─── Registry ─────────────────────────────────────────────────────────

const widgetRegistry = new Map<string, WidgetComponent>();

const widgetDefaultTitles = new Map<string, string>();

/**
 * Register a widget type with its renderer component.
 *
 * @param type - Widget type key (e.g. 'recent_articles')
 * @param component - React component that renders the widget
 * @param defaultTitle - Default title shown in the widget header
 */
export function registerWidgetType(
    type: string,
    component: WidgetComponent,
    defaultTitle?: string,
): void {
    widgetRegistry.set(type, component);

    if (defaultTitle) {
        widgetDefaultTitles.set(type, defaultTitle);
    }
}

/**
 * Get the registered renderer for a widget type.
 */
export function getWidgetRenderer(type: string): WidgetComponent | undefined {
    return widgetRegistry.get(type);
}

/**
 * Get the default title for a widget type.
 */
export function getWidgetDefaultTitle(type: string): string | undefined {
    return widgetDefaultTitles.get(type);
}

// ─── Built-in Widgets ─────────────────────────────────────────────────

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Recent Articles widget — shows the latest published manuscripts.
 */
function RecentArticlesWidget({ widget }: WidgetProps) {
    const articles = widget.settings.articles as
        | Array<{
              id: number;
              title: string;
              authors: string;
              published_at: string;
              slug: string;
          }>
        | undefined;

    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-primary" />
                    {widget.title || 'Recent Articles'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {articles.slice(0, 5).map((article) => (
                    <Link
                        key={article.id}
                        href={`/manuscripts/${article.slug}`}
                        className="group block rounded-md p-2 transition-colors hover:bg-muted/50"
                    >
                        <p className="line-clamp-2 text-sm font-medium group-hover:text-primary">
                            {article.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span className="truncate">{article.authors}</span>
                        </div>
                        {article.published_at && (
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(
                                    article.published_at,
                                ).toLocaleDateString()}
                            </div>
                        )}
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}

/**
 * Keywords / Topics widget — shows a tag cloud of manuscript keywords.
 */
function KeywordsWidget({ widget }: WidgetProps) {
    const keywords = widget.settings.keywords as
        | Array<{ name: string; count: number }>
        | undefined;

    if (!keywords || keywords.length === 0) {
        return null;
    }

    const maxCount = Math.max(...keywords.map((k) => k.count), 1);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Hash className="h-4 w-4 text-primary" />
                    {widget.title || 'Keywords'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {keywords.map((kw) => (
                        <Link
                            key={kw.name}
                            href={`/search?q=${encodeURIComponent(kw.name)}`}
                        >
                            <Badge
                                variant="secondary"
                                className="transition-colors hover:bg-primary/10"
                                style={{
                                    fontSize: `${0.75 + (kw.count / maxCount) * 0.25}rem`,
                                }}
                            >
                                {kw.name}
                                <span className="ml-1 text-xs text-muted-foreground">
                                    ({kw.count})
                                </span>
                            </Badge>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Journal Info widget — shows basic journal metadata.
 */
function JournalInfoWidget({ widget }: WidgetProps) {
    const info = widget.settings.info as
        | {
              name?: string;
              description?: string;
              issn?: string;
              publisher?: string;
              frequency?: string;
          }
        | undefined;

    if (!info) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4 text-primary" />
                    {widget.title || 'About the Journal'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                {info.name && (
                    <p className="font-medium text-foreground">{info.name}</p>
                )}
                {info.description && (
                    <p className="text-muted-foreground">{info.description}</p>
                )}
                <div className="space-y-1 text-xs text-muted-foreground">
                    {info.issn && <p>ISSN: {info.issn}</p>}
                    {info.publisher && <p>Publisher: {info.publisher}</p>}
                    {info.frequency && <p>Frequency: {info.frequency}</p>}
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Register built-ins ───────────────────────────────────────────────

registerWidgetType('recent_articles', RecentArticlesWidget, 'Recent Articles');
registerWidgetType('keywords', KeywordsWidget, 'Keywords');
registerWidgetType('journal_info', JournalInfoWidget, 'About the Journal');

/**
 * Year Navigation widget — displays years and volumes for browsing the archives.
 */
function YearNavigationWidget({ widget }: WidgetProps) {
    const years = widget.settings.years as
        | Array<{
              year: number;
              volumes: Array<{ volume: number; issue_count: number }>;
          }>
        | undefined;

    if (!years || years.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4 text-primary" />
                    {widget.title || 'Browse Archives'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0.5">
                {years.slice(0, 6).map((yearGroup) => (
                    <div key={yearGroup.year} className="group">
                        <Link
                            href={`/archives?year=${yearGroup.year}`}
                            className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                        >
                            <span className="font-medium">
                                {yearGroup.year}
                            </span>
                            <Badge variant="outline" className="text-xs">
                                {yearGroup.volumes.reduce(
                                    (sum, v) => sum + v.issue_count,
                                    0,
                                )}
                            </Badge>
                        </Link>
                        <div className="ml-3 space-y-0.5">
                            {yearGroup.volumes.slice(0, 3).map((vol) => (
                                <Link
                                    key={vol.volume}
                                    href={`/archives?year=${yearGroup.year}&volume=${vol.volume}`}
                                    className="flex items-center justify-between rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <span className="flex items-center gap-1">
                                        <Layers className="h-3 w-3" />
                                        Vol. {vol.volume}
                                    </span>
                                    <span>{vol.issue_count} issues</span>
                                </Link>
                            ))}
                            {yearGroup.volumes.length > 3 && (
                                <Link
                                    href={`/archives?year=${yearGroup.year}`}
                                    className="block px-2 py-0.5 text-xs text-primary hover:underline"
                                >
                                    + {yearGroup.volumes.length - 3} more
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
                {years.length > 6 && (
                    <Link
                        href="/archives"
                        className="mt-2 block rounded-md px-2 py-1.5 text-center text-sm text-primary hover:bg-muted hover:underline"
                    >
                        View All Years
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}

/**
 * Issue Highlights widget — shows featured published issues with cover images.
 */
function IssueHighlightsWidget({ widget }: WidgetProps) {
    const issues = widget.settings.issues as
        | Array<{
              id: number;
              slug: string;
              volume: number;
              number: number;
              title: string | null;
              publication_date: string;
              manuscripts_count: number;
          }>
        | undefined;

    if (!issues || issues.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {widget.title || 'Latest Issues'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {issues.slice(0, 3).map((issue) => (
                    <Link
                        key={issue.id}
                        href={`/issues/${issue.slug}`}
                        className="group block rounded-md p-2 transition-colors hover:bg-muted/50"
                    >
                        <p className="text-sm font-medium group-hover:text-primary">
                            Vol. {issue.volume}, No. {issue.number}
                        </p>
                        {issue.title && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                {issue.title}
                            </p>
                        )}
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                                {new Date(
                                    issue.publication_date,
                                ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {issue.manuscripts_count}
                            </span>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}

registerWidgetType('year_navigation', YearNavigationWidget, 'Browse Archives');
registerWidgetType('issue_highlights', IssueHighlightsWidget, 'Latest Issues');
