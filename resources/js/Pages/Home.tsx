import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
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
    return (
        <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
            <Head title="Research Journal Management System" />
            <Header auth={auth} />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative isolate overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background" />
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-30">
                            <div className="aspect-square w-72 bg-primary/20 rounded-full" />
                        </div>
                        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl opacity-30">
                            <div className="aspect-square w-72 bg-secondary/40 rounded-full" />
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
                            <div className="flex">
                                <Badge variant="secondary" className="gap-x-2 px-4 py-1.5">
                                    <span className="font-semibold text-primary">Announcing</span>
                                    <Separator orientation="vertical" className="h-4" />
                                    <span>Advanced peer review system</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Badge>
                            </div>

                            <h1 className="mt-10 text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
                                Modern Research
                                <span className="text-primary">
                                    {" "}Journal{" "}
                                </span>
                                Platform
                            </h1>

                            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl">
                                Streamline your scholarly publishing workflow with our comprehensive platform.
                                From manuscript submission to publication, we've got you covered with
                                cutting-edge tools and intuitive interfaces.
                            </p>

                            <div className="mt-10 flex items-center gap-x-6">
                                <Link
                                    href={dashboard.url()}
                                    className="group inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link
                                    href={submissions.url()}
                                    className="inline-flex items-center text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
                                >
                                    Submit Manuscript
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-x-6">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Avatar key={i} className="h-8 w-8 ring-2 ring-background">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                {i}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">10,000+ researchers</p>
                                    <p className="text-xs text-muted-foreground">trust our platform</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                            <div className="mx-auto w-full max-w-lg">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl opacity-30 animate-pulse" />
                                    <Card className="relative shadow-2xl backdrop-blur-sm">
                                        <CardHeader className="flex flex-row items-center justify-between pb-6">
                                            <CardTitle className="text-lg">Research Dashboard</CardTitle>
                                            <div className="flex space-x-1">
                                                <div className="w-3 h-3 bg-destructive rounded-full" />
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Card className="bg-muted/30">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-2xl font-bold text-primary">247</p>
                                                                <p className="text-xs text-muted-foreground">Submissions</p>
                                                            </div>
                                                            <BookOpen className="h-8 w-8 text-primary opacity-60" />
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="bg-muted/30">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-2xl font-bold text-primary">89</p>
                                                                <p className="text-xs text-muted-foreground">Under Review</p>
                                                            </div>
                                                            <Users className="h-8 w-8 text-primary opacity-60" />
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="bg-muted/30">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-2xl font-bold text-primary">156</p>
                                                                <p className="text-xs text-muted-foreground">Published</p>
                                                            </div>
                                                            <Award className="h-8 w-8 text-primary opacity-60" />
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="bg-muted/30">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-2xl font-bold text-primary">4.8</p>
                                                                <p className="text-xs text-muted-foreground">Avg Rating</p>
                                                            </div>
                                                            <Zap className="h-8 w-8 text-primary opacity-60" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <Card className="bg-muted/50">
                                                <CardContent className="p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                            <span className="text-sm text-muted-foreground">Recent Activity</span>
                                                        </div>
                                                        <Badge variant="secondary" className="text-xs">Live</Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

                {/* Features Section */}
                <section className="py-24 sm:py-32 bg-muted/50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Everything you need for
                                <span className="text-primary">
                                    {" "}scholarly publishing
                                </span>
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                From submission to publication, our platform provides all the tools you need
                                to manage your research journal efficiently and professionally.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                                <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50">
                                    <CardContent className="p-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm mb-6">
                                            <FilePlus2 className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold leading-8 text-foreground group-hover:text-primary transition-colors mb-2">
                                            Manuscript Management
                                        </h3>
                                        <p className="text-base leading-7 text-muted-foreground mb-4">
                                            Streamlined submission process with file management, version control,
                                            and automated workflows to handle manuscripts from intake to decision.
                                        </p>
                                        <div className="flex items-center text-sm text-primary font-medium">
                                            Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50">
                                    <CardContent className="p-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm mb-6">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold leading-8 text-foreground group-hover:text-primary transition-colors mb-2">
                                            Peer Review System
                                        </h3>
                                        <p className="text-base leading-7 text-muted-foreground mb-4">
                                            Comprehensive peer review management with reviewer assignment,
                                            blind review options, and automated reminders and notifications.
                                        </p>
                                        <div className="flex items-center text-sm text-primary font-medium">
                                            Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50">
                                    <CardContent className="p-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm mb-6">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold leading-8 text-foreground group-hover:text-primary transition-colors mb-2">
                                            Editorial Decisions
                                        </h3>
                                        <p className="text-base leading-7 text-muted-foreground mb-4">
                                            Advanced editorial workflow with decision tracking, automated notifications,
                                            and publishing pipelines to streamline your editorial process.
                                        </p>
                                        <div className="flex items-center text-sm text-primary font-medium">
                                            Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Trusted by researchers worldwide
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                Join thousands of researchers, editors, and institutions who trust our platform
                                for their scholarly publishing needs.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:max-w-xl sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-foreground">10,000+</div>
                                <div className="mt-2 text-sm text-muted-foreground">Active Researchers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-foreground">2,500+</div>
                                <div className="mt-2 text-sm text-muted-foreground">Published Articles</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-foreground">150+</div>
                                <div className="mt-2 text-sm text-muted-foreground">Partner Institutions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-foreground">99.9%</div>
                                <div className="mt-2 text-sm text-muted-foreground">Uptime</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Integration Section */}
                <section className="py-24 sm:py-32 bg-muted/50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Integrations & Standards
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                Seamlessly integrate with industry-standard tools and platforms
                            </p>
                        </div>

                        <div className="mx-auto mt-16 grid max-w-lg grid-cols-2 gap-6 sm:max-w-xl sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                            {[
                                { name: 'DOI', description: 'Digital Object Identifier' },
                                { name: 'ORCID', description: 'Researcher Identification' },
                                { name: 'CrossRef', description: 'Citation Linking' },
                                { name: 'OpenAIRE', description: 'Open Access Infrastructure' }
                            ].map((integration) => (
                                <Card key={integration.name} className="group text-center hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/50">
                                    <CardContent className="p-6">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-muted mb-4 group-hover:bg-primary/10 transition-colors">
                                            <div className="text-2xl font-bold text-primary">{integration.name.charAt(0)}</div>
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground mb-2">{integration.name}</h3>
                                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative isolate overflow-hidden bg-primary">
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-primary/90" />
                        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 blur-3xl opacity-20">
                            <div className="aspect-square w-96 bg-primary-foreground/30 rounded-full" />
                        </div>
                    </div>

                    <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                                Ready to transform your
                                <br />
                                research publishing?
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
                                Join thousands of researchers and editors who have already streamlined
                                their scholarly publishing workflow with our platform.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href={registerRoute.url()}
                                    className="rounded-lg bg-background px-8 py-4 text-sm font-semibold text-foreground shadow-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200"
                                >
                                    Get started for free
                                </Link>
                                <Link
                                    href="#"
                                    className="text-sm font-semibold leading-6 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                                >
                                    View demo <ArrowRight className="ml-2 h-4 w-4 inline" />
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
