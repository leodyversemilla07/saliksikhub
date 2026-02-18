import { type ReactNode } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { useJournalTheme } from '@/hooks/use-journal-theme';

interface PublicLayoutProps {
    /** Page title for the <head> tag */
    title?: string;
    /** Optional additional <Head> children (meta tags, etc.) */
    headChildren?: ReactNode;
    /** Page content */
    children: ReactNode;
}

/**
 * Shared layout for all public-facing pages.
 *
 * Responsibilities:
 * - Applies the journal's theme settings (colors, typography)
 *   via the useJournalTheme hook
 * - Renders the site header and footer
 * - Provides the standard page structure (flex column, min-h-screen)
 */
export default function PublicLayout({ title, headChildren, children }: PublicLayoutProps) {
    const { auth } = usePage<PageProps>().props;

    // Apply journal theme CSS custom properties
    useJournalTheme();

    return (
        <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
            {(title || headChildren) && (
                <Head title={title}>
                    {headChildren}
                </Head>
            )}
            <SiteHeader auth={auth} />
            <main className="grow">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
