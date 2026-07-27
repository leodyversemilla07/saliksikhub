import { Head, usePage } from '@inertiajs/react';
import React from 'react';

import type { PageProps } from '@/types';

interface SEOHeadProps {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
    ogType?: string | null;
    canonical?: string | null;
    noIndex?: boolean;
    jsonld?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * SEOHead injects meta tags, Open Graph, Twitter Card, and JSON-LD
 * structured data into the <head> via Inertia's <Head> component.
 *
 * Usage on any page:
 *   <SEOHead title="My Page Title" description="..." />
 *
 * Falls back to global defaults from HandleInertiaRequests shared SEO data.
 */
export default function SEOHead({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType = 'website',
    canonical,
    noIndex = false,
    jsonld,
}: SEOHeadProps) {
    const { seo } = usePage<PageProps>().props;
    const defaults = seo?.meta ?? {};
    const currentUrl =
        typeof window !== 'undefined' ? window.location.href : '';

    const resolvedTitle = title ?? ogTitle ?? defaults['og:title'] ?? null;
    const resolvedDescription =
        description ?? ogDescription ?? defaults['og:description'] ?? null;
    const resolvedKeywords = keywords ?? defaults['keywords'] ?? null;
    const resolvedOgTitle = ogTitle ?? title ?? defaults['og:title'] ?? null;
    const resolvedOgDescription =
        ogDescription ?? description ?? defaults['og:description'] ?? null;
    const resolvedOgImage = ogImage ?? defaults['og:image'] ?? null;
    const resolvedCanonical = canonical ?? currentUrl;

    // Build JSON-LD items
    const jsonldItems: Record<string, unknown>[] = [];
    if (seo?.jsonld) {
        jsonldItems.push(...seo.jsonld);
    }
    if (jsonld) {
        const items = Array.isArray(jsonld) ? jsonld : [jsonld];
        jsonldItems.push(...items);
    }

    return (
        <Head>
            {/* Title */}
            {resolvedTitle && <title>{resolvedTitle}</title>}

            {/* Meta */}
            {resolvedDescription && (
                <meta
                    name="description"
                    content={resolvedDescription}
                    head-key="meta-description"
                />
            )}
            {resolvedKeywords && (
                <meta
                    name="keywords"
                    content={resolvedKeywords}
                    head-key="meta-keywords"
                />
            )}
            {resolvedCanonical && (
                <link
                    rel="canonical"
                    href={resolvedCanonical}
                    head-key="canonical"
                />
            )}

            {/* Robots */}
            <meta
                name="robots"
                content={noIndex ? 'noindex, nofollow' : 'index, follow'}
                head-key="robots"
            />

            {/* Open Graph */}
            {resolvedOgTitle && (
                <meta
                    property="og:title"
                    content={resolvedOgTitle}
                    head-key="og-title"
                />
            )}
            {resolvedOgDescription && (
                <meta
                    property="og:description"
                    content={resolvedOgDescription}
                    head-key="og-description"
                />
            )}
            <meta property="og:type" content={ogType} head-key="og-type" />
            <meta property="og:url" content={currentUrl} head-key="og-url" />
            {resolvedOgImage && (
                <meta
                    property="og:image"
                    content={resolvedOgImage}
                    head-key="og-image"
                />
            )}

            {/* Twitter Card */}
            <meta
                name="twitter:card"
                content="summary_large_image"
                head-key="twitter-card"
            />
            {resolvedOgTitle && (
                <meta
                    name="twitter:title"
                    content={resolvedOgTitle}
                    head-key="twitter-title"
                />
            )}
            {resolvedOgDescription && (
                <meta
                    name="twitter:description"
                    content={resolvedOgDescription}
                    head-key="twitter-description"
                />
            )}
            {resolvedOgImage && (
                <meta
                    name="twitter:image"
                    content={resolvedOgImage}
                    head-key="twitter-image"
                />
            )}

            {/* JSON-LD Structured Data */}
            {jsonldItems.map((item, index) => (
                <script
                    key={`jsonld-${index}`}
                    type="application/ld+json"
                    head-key={`jsonld-${index}`}
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(item, null, 2),
                    }}
                />
            ))}
        </Head>
    );
}
