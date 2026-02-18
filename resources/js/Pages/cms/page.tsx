import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import CmsSection from '@/components/cms/section';
import PublicLayout from '@/layouts/public-layout';

interface Section {
    id: number;
    type: string;
    name: string;
    content: Record<string, unknown>;
    settings: Record<string, unknown>;
    is_visible: boolean;
}

interface Page {
    id: number;
    title: string;
    slug: string;
    type: string;
    meta_description: string | null;
    meta_keywords: string | null;
    sections: Section[];
}

interface CmsPageProps extends PageProps {
    page: Page;
    sections: Section[];
    themeSettings: Record<string, unknown> | null;
}

export default function CmsPage({ page, sections }: CmsPageProps) {
    const { currentJournal } = usePage<PageProps>().props;
    
    const pageTitle = page?.title 
        ? `${page.title} | ${currentJournal?.name ?? 'Journal'}`
        : 'Page';

    const metaTags = (
        <>
            {page?.meta_description && (
                <meta name="description" content={page.meta_description} />
            )}
            {page?.meta_keywords && (
                <meta name="keywords" content={page.meta_keywords} />
            )}
        </>
    );

    return (
        <PublicLayout title={pageTitle} headChildren={metaTags}>
            {sections && sections.length > 0 ? (
                sections.map((section) => (
                    <CmsSection key={section.id} section={section} />
                ))
            ) : (
                <div className="mx-auto max-w-7xl px-6 py-24">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        {page?.title ?? 'Page Not Found'}
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground">
                        This page has no content yet.
                    </p>
                </div>
            )}
        </PublicLayout>
    );
}
