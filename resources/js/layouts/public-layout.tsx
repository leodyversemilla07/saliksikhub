import { Head, usePage } from '@inertiajs/react';
import type {ReactNode} from 'react';
import { Link } from '@inertiajs/react';
import { LuBookOpen, LuUsers, LuFileText, LuArrowRight } from 'react-icons/lu';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import {Sidebar} from '@/components/sidebar/sidebar';
import {PluginSlot} from '@/components/plugins/plugin-slot';
import type {Widget} from '@/types';
import { useJournalTheme } from '@/hooks/use-journal-theme';
import type { PageProps } from '@/types';

interface PublicLayoutProps {
    /** Page title for the <head> tag */
    title?: string;
    /** Optional additional <Head> children (meta tags, etc.) */
    headChildren?: ReactNode;
    /** Page content */
    children: ReactNode;
    /** Widgets to show in the sidebar (if any, renders a two-column layout) */
    sidebarWidgets?: Widget[];
}

/**
 * Information block configuration for reader-facing sidebar info.
 */
interface InfoBlock {
    key: string;
    title: string;
    icon: ReactNode;
    content?: string;
}

/**
 * Shared layout for all public-facing pages.
 *
 * Responsibilities:
 * - Applies the journal's theme settings (colors, typography)
 *   via the useJournalTheme hook
 * - Injects custom CSS from theme settings
 * - Renders the site header, info bar, and footer
 */
export default function PublicLayout({
    title,
    headChildren,
    children,
    sidebarWidgets,
}: PublicLayoutProps) {
    const { auth, currentJournal } = usePage<PageProps>().props;

    // Apply journal theme CSS custom properties
    useJournalTheme();

    // Build info blocks from journal settings
    const settings = currentJournal?.settings ?? {};
    const infoBlocks: InfoBlock[] = [
        {
            key: 'for_readers',
            title: 'For Readers',
            icon: <LuBookOpen className="h-5 w-5" />,
            content: settings.for_readers as string | undefined,
        },
        {
            key: 'for_authors',
            title: 'For Authors',
            icon: <LuFileText className="h-5 w-5" />,
            content: settings.for_authors as string | undefined,
        },
        {
            key: 'for_librarians',
            title: 'For Librarians',
            icon: <LuUsers className="h-5 w-5" />,
            content: settings.for_librarians as string | undefined,
        },
    ].filter((b) => b.content);

    return (
        <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
            {(title || headChildren) && (
                <Head title={title}>{headChildren}</Head>
            )}

            {/* Inject custom CSS from theme settings */}
            {currentJournal?.theme_settings?.custom_css && (
                <style>
                    {currentJournal.theme_settings.custom_css as string}
                </style>
            )}

            <SiteHeader auth={auth} />

            {/* Plugin injection: banner slot renders above main content */}
            <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <PluginSlot slot="announcement_banner" />
            </div>

            {sidebarWidgets && sidebarWidgets.length > 0 ? (
                <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                        <main className="min-w-0">{children}</main>
                        <Sidebar widgets={sidebarWidgets} />
                    </div>
                </div>
            ) : (
                <main className="grow">{children}</main>
            )}

            {/* Info Blocks Bar — renders if any info blocks have content */}
            {infoBlocks.length > 0 && (
                <section className="border-y bg-muted/20">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-3">
                            {infoBlocks.map((block) => (
                                <div
                                    key={block.key}
                                    className="rounded-lg border bg-background p-6 transition-colors hover:border-primary/30"
                                >
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        {block.icon}
                                    </div>
                                    <h3 className="mb-2 font-serif text-lg font-bold text-foreground">
                                        {block.title}
                                    </h3>
                                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                                        {block.content}
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                                    >
                                        Learn more
                                        <LuArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <SiteFooter />
        </div>
    );
}
