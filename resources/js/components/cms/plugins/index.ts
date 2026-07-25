import {registerPluginSectionRenderer, type Section} from '@/components/cms/section';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Link} from '@inertiajs/react';
import {ArrowRight, BookOpen, Calendar, FileText} from 'lucide-react';

/**
 * Register CMS section renderers provided by plugins.
 * Called once during app boot.
 */
export function registerCmsPluginSections(): void {
    registerPluginSectionRenderer(
        'featured_publications',
        renderFeaturedPublications,
    );
    registerPluginSectionRenderer(
        'editor_picks',
        renderEditorPicks,
    );
}

interface Publication {
    id: number;
    title: string;
    authors: string[];
    doi?: string;
    publication_date?: string;
    slug: string;
}

interface FeaturedPublicationsContent {
    title?: string;
    description?: string;
    limit?: number;
}

/**
 * Render a grid of featured publications.
 * This section type is registered by a plugin and rendered
 * through the CMS section plugin registry.
 */
function renderFeaturedPublications(section: Section) {
    const content = section.content as FeaturedPublicationsContent;
    const publications = section.content.publications as Publication[] | undefined;

    return (
        <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {content.title && (
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {content.title}
                        </h2>
                        {content.description && (
                            <p className="mt-4 text-lg text-muted-foreground">
                                {content.description}
                            </p>
                        )}
                    </div>
                )}

                {(!publications || publications.length === 0) && (
                    <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                        <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p className="text-lg font-medium">No publications to display</p>
                        <p className="text-sm">Publications will appear here once published.</p>
                    </div>
                )}

                {publications && publications.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {publications.slice(0, content.limit ?? 6).map((pub) => (
                            <Card
                                key={pub.id}
                                className="transition-shadow hover:shadow-lg"
                            >
                                <CardHeader>
                                    <CardTitle className="line-clamp-2 text-base">
                                        <Link
                                            href={`/manuscripts/${pub.slug}`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {pub.title}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="line-clamp-1 text-sm text-muted-foreground">
                                        {pub.authors?.join(', ')}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        {pub.publication_date && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(pub.publication_date).toLocaleDateString()}
                                            </span>
                                        )}
                                        {pub.doi && (
                                            <span className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" />
                                                DOI: {pub.doi}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-10 text-center">
                    <Link
                        href="/archives"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                    >
                        View All Publications
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

interface EditorPicksContent {
    title?: string;
    description?: string;
}

/**
 * Render editor's picks section.
 */
function renderEditorPicks(section: Section) {
    const content = section.content as EditorPicksContent;
    const picks = section.content.picks as Publication[] | undefined;

    return (
        <section className="border-t bg-muted/30 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        {content.title && (
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                {content.title}
                            </h2>
                        )}
                        {content.description && (
                            <p className="mt-2 text-muted-foreground">
                                {content.description}
                            </p>
                        )}
                    </div>
                    <Link
                        href="/archives"
                        className="hidden text-sm font-medium text-primary hover:underline sm:inline-flex"
                    >
                        Browse All
                    </Link>
                </div>

                {(!picks || picks.length === 0) && (
                    <p className="py-12 text-center text-muted-foreground">
                        No editor picks available at this time.
                    </p>
                )}

                {picks && picks.length > 0 && (
                    <div className="space-y-4">
                        {picks.slice(0, 4).map((pick, index) => (
                            <div
                                key={pick.id}
                                className="flex items-start gap-4 rounded-lg border bg-background p-4"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                    {index + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/manuscripts/${pick.slug}`}
                                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                                    >
                                        {pick.title}
                                    </Link>
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                        {pick.authors?.join(', ')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
