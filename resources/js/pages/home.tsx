import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    FilePlus2,
    BookOpen,
    Users,
    Award,
    Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import { dashboard, submissions } from '@/routes';
import { register as registerRoute } from '@/routes';
import type { PageProps } from '@/types';

export default function Home() {
    const { currentJournal, currentInstitution } = usePage<PageProps>().props;

    const pageTitle = currentJournal?.name
        ? `${currentJournal.name} | ${currentInstitution?.abbreviation ?? 'RJMS'}`
        : 'Research Journal Management System';

    const heroTitle = currentJournal?.settings?.hero_title ?? 'Modern Research';
    const heroDescription =
        currentJournal?.settings?.hero_description ??
        "Streamline your scholarly publishing workflow with our comprehensive platform. From manuscript submission to publication, we've got you covered with cutting-edge tools and intuitive interfaces.";

    return (
        <PublicLayout title={pageTitle}>
            {/* Hero Section - Scholarly Style */}
            <section className="relative isolate overflow-hidden border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* Academic Badge */}
                        <div className="mb-8 flex justify-center">
                            <div className="inline-flex items-center gap-x-3 rounded-sm border border-border bg-muted/30 px-4 py-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <span className="font-sans text-sm text-muted-foreground">
                                    Open Access Scholarly Publishing
                                </span>
                            </div>
                        </div>

                        {/* Main Heading - Serif Font */}
                        <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                            {currentJournal?.name || heroTitle}
                        </h1>

                        {currentInstitution?.name && (
                            <p className="mb-8 font-sans text-lg tracking-wider text-muted-foreground uppercase">
                                {currentInstitution.name}
                            </p>
                        )}

                        {/* Description - Serif for readability */}
                        <p className="mx-auto mb-10 max-w-2xl font-serif text-lg leading-relaxed text-muted-foreground">
                            {heroDescription}
                        </p>

                        {/* Actions */}
                        <div className="mb-12 flex items-center justify-center gap-x-6">
                            <Link
                                href={submissions.url()}
                                className="inline-flex items-center justify-center border-2 border-primary bg-primary px-6 py-3 font-sans text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Submit Manuscript
                            </Link>

                            <Link
                                href={dashboard.url()}
                                className="inline-flex items-center font-sans text-sm font-semibold text-foreground transition-colors hover:text-primary"
                            >
                                Browse Articles
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Academic Credentials */}
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-border pt-8 text-sm text-muted-foreground">
                            {currentJournal?.issn && (
                                <div className="flex items-center gap-2">
                                    <span className="font-sans text-xs tracking-wide uppercase">
                                        ISSN:
                                    </span>
                                    <code className="font-mono">
                                        {currentJournal.issn}
                                    </code>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="font-sans">Peer-Reviewed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                <span className="font-sans">Open Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Academic Style */}
            <section className="bg-muted/30 py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                            Comprehensive Publishing Platform
                        </h2>
                        <p className="font-serif text-base leading-relaxed text-muted-foreground">
                            Supporting the complete scholarly publishing
                            lifecycle with tools designed for researchers,
                            editors, and reviewers.
                        </p>
                    </div>

                    <div className="mx-auto max-w-2xl lg:max-w-none">
                        <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                            <Card className="border-border/50 bg-card transition-colors hover:border-primary/30">
                                <CardContent className="p-8">
                                    <div className="mb-6 flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                                        <FilePlus2 className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-3 font-serif text-xl font-bold text-foreground">
                                        Manuscript Management
                                    </h3>
                                    <p className="font-serif text-base leading-relaxed text-muted-foreground">
                                        Streamlined submission process with file
                                        management, version control, and
                                        automated workflows for efficient
                                        manuscript handling.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card transition-colors hover:border-primary/30">
                                <CardContent className="p-8">
                                    <div className="mb-6 flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-3 font-serif text-xl font-bold text-foreground">
                                        Peer Review System
                                    </h3>
                                    <p className="font-serif text-base leading-relaxed text-muted-foreground">
                                        Comprehensive review management with
                                        reviewer assignment, blind review
                                        options, and automated notifications.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card transition-colors hover:border-primary/30">
                                <CardContent className="p-8">
                                    <div className="mb-6 flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-3 font-serif text-xl font-bold text-foreground">
                                        Editorial Workflow
                                    </h3>
                                    <p className="font-serif text-base leading-relaxed text-muted-foreground">
                                        Advanced editorial decisions with
                                        tracking, automated notifications, and
                                        publishing pipelines for streamlined
                                        operations.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Academic Metrics */}
            <section className="border-y border-border py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                            Supporting Scholarly Excellence
                        </h2>
                        <p className="font-serif text-base leading-relaxed text-muted-foreground">
                            Trusted by researchers, editors, and academic
                            institutions worldwide.
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8 lg:max-w-none lg:grid-cols-4">
                        <div className="border-r border-border px-4 text-center last:border-r-0">
                            <div className="mb-2 font-serif text-4xl font-bold text-foreground">
                                10,000+
                            </div>
                            <div className="font-sans text-sm tracking-wide text-muted-foreground uppercase">
                                Researchers
                            </div>
                        </div>
                        <div className="border-r border-border px-4 text-center last:border-r-0">
                            <div className="mb-2 font-serif text-4xl font-bold text-foreground">
                                2,500+
                            </div>
                            <div className="font-sans text-sm tracking-wide text-muted-foreground uppercase">
                                Articles Published
                            </div>
                        </div>
                        <div className="border-r border-border px-4 text-center last:border-r-0">
                            <div className="mb-2 font-serif text-4xl font-bold text-foreground">
                                150+
                            </div>
                            <div className="font-sans text-sm tracking-wide text-muted-foreground uppercase">
                                Institutions
                            </div>
                        </div>
                        <div className="px-4 text-center">
                            <div className="mb-2 font-serif text-4xl font-bold text-foreground">
                                99.9%
                            </div>
                            <div className="font-sans text-sm tracking-wide text-muted-foreground uppercase">
                                Uptime
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integration Section - Scholarly Standards */}
            <section className="bg-muted/30 py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                            Industry Standards & Integrations
                        </h2>
                        <p className="font-serif text-base leading-relaxed text-muted-foreground">
                            Built to comply with international scholarly
                            publishing standards
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 lg:max-w-none lg:grid-cols-4">
                        {[
                            {
                                name: 'DOI',
                                description: 'Digital Object Identifier',
                            },
                            {
                                name: 'ORCID',
                                description: 'Researcher Identification',
                            },
                            {
                                name: 'CrossRef',
                                description: 'Citation Linking',
                            },
                            {
                                name: 'OpenAIRE',
                                description: 'Open Access Infrastructure',
                            },
                        ].map((integration) => (
                            <Card
                                key={integration.name}
                                className="border-border/50 text-center transition-colors hover:border-primary/30"
                            >
                                <CardContent className="p-6">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-border bg-muted/50">
                                        <div className="font-mono text-lg font-bold text-primary">
                                            {integration.name.charAt(0)}
                                        </div>
                                    </div>
                                    <h3 className="mb-1 font-sans text-sm font-semibold tracking-wide text-foreground uppercase">
                                        {integration.name}
                                    </h3>
                                    <p className="font-sans text-xs text-muted-foreground">
                                        {integration.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Academic Registration */}
            <section className="relative border-y border-primary bg-primary">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="mb-6 font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
                            Join Our Academic Community
                        </h2>
                        <p className="mb-10 font-serif text-lg leading-relaxed text-primary-foreground/90">
                            Start your scholarly publishing journey with a
                            platform designed by researchers, for researchers.
                        </p>
                        <div className="flex items-center justify-center gap-x-6">
                            <Link
                                href={registerRoute.url()}
                                className="inline-flex items-center justify-center border-2 border-background bg-background px-6 py-3 font-sans text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                                Register as Researcher
                            </Link>
                            <Link
                                href={submissions.url()}
                                className="inline-flex items-center font-sans text-sm font-semibold text-primary-foreground transition-colors hover:text-primary-foreground/80"
                            >
                                Browse Guidelines
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
