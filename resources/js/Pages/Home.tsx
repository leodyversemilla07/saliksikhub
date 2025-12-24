import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Header from '@/components/site-header';
import Footer from '@/components/site-footer';
import { Link } from '@inertiajs/react';
import { ArrowRight, FilePlus2, BookOpen, Users, Award, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { dashboard, submissions } from '@/routes';
import { register as registerRoute } from '@/routes';

export default function Home({ auth }: PageProps) {
    const { currentJournal, currentInstitution } = usePage<PageProps>().props;
    
    const pageTitle = currentJournal?.name 
        ? `${currentJournal.name} | ${currentInstitution?.abbreviation ?? 'RJMS'}`
        : 'Research Journal Management System';
    
    const heroTitle = currentJournal?.settings?.hero_title ?? 'Modern Research';
    const heroDescription = currentJournal?.settings?.hero_description 
        ?? 'Streamline your scholarly publishing workflow with our comprehensive platform. From manuscript submission to publication, we\'ve got you covered with cutting-edge tools and intuitive interfaces.';

    return (
        <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
            <Head title={pageTitle} />
            <Header auth={auth} />

            <main className="grow">
{/* Hero Section - Scholarly Style */}
                <section className="relative isolate overflow-hidden bg-card border-b border-border">
                    <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8 lg:py-32">
                        <div className="mx-auto max-w-4xl text-center">
                            {/* Academic Badge */}
                            <div className="flex justify-center mb-8">
                                <div className="inline-flex items-center gap-x-3 px-4 py-2 border border-border rounded-sm bg-muted/30">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    <span className="font-sans text-sm text-muted-foreground">Open Access Scholarly Publishing</span>
                                </div>
                            </div>

                            {/* Main Heading - Serif Font */}
                            <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-6">
                                {currentJournal?.name || heroTitle}
                            </h1>
                            
                            {currentInstitution?.name && (
                                <p className="font-sans text-lg text-muted-foreground uppercase tracking-wider mb-8">
                                    {currentInstitution.name}
                                </p>
                            )}

                            {/* Description - Serif for readability */}
                            <p className="font-serif text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-10">
                                {heroDescription}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-x-6 mb-12">
                                <Link
                                    href={submissions.url()}
                                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary bg-primary text-primary-foreground font-sans font-semibold text-sm hover:bg-primary/90 transition-colors"
                                >
                                    Submit Manuscript
                                </Link>

                                <Link
                                    href={dashboard.url()}
                                    className="inline-flex items-center font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
                                >
                                    Browse Articles
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>

                            {/* Academic Credentials */}
                            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground border-t border-border pt-8">
                                {currentJournal?.issn && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-sans uppercase tracking-wide text-xs">ISSN:</span>
                                        <code className="font-mono">{currentJournal.issn}</code>
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
                <section className="py-20 sm:py-28 bg-muted/30">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl mb-4">
                                Comprehensive Publishing Platform
                            </h2>
                            <p className="font-serif text-base leading-relaxed text-muted-foreground">
                                Supporting the complete scholarly publishing lifecycle with tools designed
                                for researchers, editors, and reviewers.
                            </p>
                        </div>

                        <div className="mx-auto max-w-2xl lg:max-w-none">
                            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                                <Card className="border-border/50 bg-card hover:border-primary/30 transition-colors">
                                    <CardContent className="p-8">
                                        <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary mb-6">
                                            <FilePlus2 className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                                            Manuscript Management
                                        </h3>
                                        <p className="font-serif text-base leading-relaxed text-muted-foreground">
                                            Streamlined submission process with file management, version control,
                                            and automated workflows for efficient manuscript handling.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/50 bg-card hover:border-primary/30 transition-colors">
                                    <CardContent className="p-8">
                                        <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary mb-6">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                                            Peer Review System
                                        </h3>
                                        <p className="font-serif text-base leading-relaxed text-muted-foreground">
                                            Comprehensive review management with reviewer assignment,
                                            blind review options, and automated notifications.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/50 bg-card hover:border-primary/30 transition-colors">
                                    <CardContent className="p-8">
                                        <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary mb-6">
                                            <Award className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                                            Editorial Workflow
                                        </h3>
                                        <p className="font-serif text-base leading-relaxed text-muted-foreground">
                                            Advanced editorial decisions with tracking, automated notifications,
                                            and publishing pipelines for streamlined operations.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section - Academic Metrics */}
                <section className="py-20 sm:py-28 border-y border-border">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl mb-4">
                                Supporting Scholarly Excellence
                            </h2>
                            <p className="font-serif text-base leading-relaxed text-muted-foreground">
                                Trusted by researchers, editors, and academic institutions worldwide.
                            </p>
                        </div>

                        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8 lg:max-w-none lg:grid-cols-4">
                            <div className="text-center border-r border-border last:border-r-0 px-4">
                                <div className="font-serif text-4xl font-bold text-foreground mb-2">10,000+</div>
                                <div className="font-sans text-sm uppercase tracking-wide text-muted-foreground">Researchers</div>
                            </div>
                            <div className="text-center border-r border-border last:border-r-0 px-4">
                                <div className="font-serif text-4xl font-bold text-foreground mb-2">2,500+</div>
                                <div className="font-sans text-sm uppercase tracking-wide text-muted-foreground">Articles Published</div>
                            </div>
                            <div className="text-center border-r border-border last:border-r-0 px-4">
                                <div className="font-serif text-4xl font-bold text-foreground mb-2">150+</div>
                                <div className="font-sans text-sm uppercase tracking-wide text-muted-foreground">Institutions</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="font-serif text-4xl font-bold text-foreground mb-2">99.9%</div>
                                <div className="font-sans text-sm uppercase tracking-wide text-muted-foreground">Uptime</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Integration Section - Scholarly Standards */}
                <section className="py-20 sm:py-28 bg-muted/30">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl mb-4">
                                Industry Standards & Integrations
                            </h2>
                            <p className="font-serif text-base leading-relaxed text-muted-foreground">
                                Built to comply with international scholarly publishing standards
                            </p>
                        </div>

                        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 lg:max-w-none lg:grid-cols-4">
                            {[
                                { name: 'DOI', description: 'Digital Object Identifier' },
                                { name: 'ORCID', description: 'Researcher Identification' },
                                { name: 'CrossRef', description: 'Citation Linking' },
                                { name: 'OpenAIRE', description: 'Open Access Infrastructure' }
                            ].map((integration) => (
                                <Card key={integration.name} className="text-center border-border/50 hover:border-primary/30 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-border bg-muted/50 mb-4">
                                            <div className="font-mono text-lg font-bold text-primary">{integration.name.charAt(0)}</div>
                                        </div>
                                        <h3 className="font-sans text-sm font-semibold text-foreground uppercase tracking-wide mb-1">{integration.name}</h3>
                                        <p className="font-sans text-xs text-muted-foreground">{integration.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section - Academic Registration */}
                <section className="relative bg-primary border-y border-primary">
                    <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl mb-6">
                                Join Our Academic Community
                            </h2>
                            <p className="font-serif text-lg leading-relaxed text-primary-foreground/90 mb-10">
                                Start your scholarly publishing journey with a platform designed
                                by researchers, for researchers.
                            </p>
                            <div className="flex items-center justify-center gap-x-6">
                                <Link
                                    href={registerRoute.url()}
                                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-background bg-background text-foreground font-sans font-semibold text-sm hover:bg-muted transition-colors"
                                >
                                    Register as Researcher
                                </Link>
                                <Link
                                    href={submissions.url()}
                                    className="inline-flex items-center font-sans font-semibold text-sm text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                                >
                                    Browse Guidelines
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>


            </main>
            <Footer />
        </div>
    );
}
