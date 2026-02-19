import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Megaphone, Users, Settings, Award, BookOpen } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function Announcements() {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';

    return (
        <PublicLayout title={`Announcements | ${journalName}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-oxford-blue mb-2">
                            Announcements
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Stay updated with the latest news, events, and updates from {journalName}.
                        </p>
                    </div>                    <div className="space-y-6">
                        {/* Featured Announcement */}
                        <Card className="bg-gradient-to-r from-burgundy via-burgundy to-burgundy/90 text-white border-none shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-3">
                                    <Badge variant="secondary" className="mr-3 bg-amber text-amber-dark">
                                        <Megaphone className="h-3 w-3 mr-1" />
                                        Featured
                                    </Badge>
                                    <span className="text-primary-foreground/80 text-sm flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        May 15, 2025
                                    </span>
                                </div>
                                <h2 className="font-serif text-2xl font-bold mb-3">Call for Submissions: Special Issue on Sustainable Agriculture</h2>
                                <p className="text-white/90 mb-4">
                                    We are excited to announce a special issue focusing on innovative approaches to sustainable agriculture and food security. 
                                    Submissions are now open for research papers, review articles, and case studies.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20">
                                        Deadline: July 30, 2025
                                    </Badge>
                                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20">
                                        Research Papers
                                    </Badge>
                                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20">
                                        Peer Review
                                    </Badge>
                                </div>
                                <Button asChild variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                                    <Link href="#">
                                        Submit Your Work
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* System Update */}
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            <Settings className="h-3 w-3 mr-1" />
                                            System Update
                                        </Badge>
                                        <span className="text-muted-foreground text-sm flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            May 10, 2025
                                        </span>
                                    </div>
                                </div>
                                <CardTitle className="font-serif text-xl text-oxford-blue">Platform Maintenance and New Features</CardTitle>
                                <CardDescription>
                                    We've completed scheduled maintenance and introduced several new features including enhanced manuscript tracking, 
                                    improved search functionality, and a redesigned reviewer dashboard. The platform is now running more efficiently 
                                    than ever.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-muted-foreground mb-4 space-y-2">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-primary mr-3 flex-shrink-0"></div>
                                        Enhanced manuscript submission workflow
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-primary mr-3 flex-shrink-0"></div>
                                        Real-time collaboration tools for editors
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-primary mr-3 flex-shrink-0"></div>
                                        Mobile-responsive design improvements
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-primary mr-3 flex-shrink-0"></div>
                                        Advanced analytics for journal metrics
                                    </li>
                                </ul>
                                <Button asChild variant="link" className="p-0 h-auto text-primary">
                                    <Link href="#">
                                        View Full Release Notes →
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Workshop Announcement */}
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                            <Users className="h-3 w-3 mr-1" />
                                            Workshop
                                        </Badge>
                                        <span className="text-muted-foreground text-sm flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            May 5, 2025
                                        </span>
                                    </div>
                                </div>
                                <CardTitle className="font-serif text-xl text-oxford-blue">Free Workshop: Academic Writing for Agricultural Sciences</CardTitle>
                                <CardDescription>
                                    Join our upcoming virtual workshop designed for emerging researchers in agricultural sciences. Learn best practices 
                                    for academic writing, manuscript preparation, and publication strategies from experienced editors and published authors.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Card className="mb-4">
                                    <CardContent className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-foreground">Date:</span>
                                                <span className="text-muted-foreground">June 15, 2025</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-foreground">Time:</span>
                                                <span className="text-muted-foreground">2:00 PM - 5:00 PM PST</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-foreground">Format:</span>
                                                <span className="text-muted-foreground">Virtual (Zoom)</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-foreground">Registration:</span>
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">Free</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Button asChild variant="outline">
                                    <Link href="#">
                                        Register Now →
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Policy Update */}
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                            <BookOpen className="h-3 w-3 mr-1" />
                                            Policy Update
                                        </Badge>
                                        <span className="text-muted-foreground text-sm flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            April 28, 2025
                                        </span>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">Updated Editorial Guidelines and Open Access Policies</CardTitle>
                                <CardDescription>
                                    We have updated our editorial guidelines to align with the latest international standards for agricultural research 
                                    publication. These changes will take effect from June 1, 2025, and apply to all new submissions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <h4 className="font-medium text-foreground mb-3">Key Updates:</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 mr-3 flex-shrink-0"></div>
                                            Enhanced data sharing requirements
                                        </li>
                                        <li className="flex items-center text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 mr-3 flex-shrink-0"></div>
                                            New conflict of interest disclosure forms
                                        </li>
                                        <li className="flex items-center text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 mr-3 flex-shrink-0"></div>
                                            Revised author contribution statements
                                        </li>
                                        <li className="flex items-center text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 mr-3 flex-shrink-0"></div>
                                            Updated open access fee structure
                                        </li>
                                    </ul>
                                </div>
                                <Button asChild variant="link" className="p-0 h-auto text-primary">
                                    <Link href="#">
                                        Read Full Guidelines →
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Success Story */}
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            <Award className="h-3 w-3 mr-1" />
                                            Success Story
                                        </Badge>
                                        <span className="text-muted-foreground text-sm flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            April 20, 2025
                                        </span>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">Milestone Achievement: 1000+ Published Articles</CardTitle>
                                <CardDescription>
                                    We're proud to announce that {journalName} has reached a significant milestone with over 1,000 published 
                                    research articles! This achievement reflects our commitment to advancing agricultural science and supporting 
                                    researchers worldwide.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <Card className="text-center">
                                        <CardContent className="pt-6">
                                            <div className="text-2xl font-bold text-primary mb-1">1,000+</div>
                                            <div className="text-sm text-muted-foreground">Published Articles</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="text-center">
                                        <CardContent className="pt-6">
                                            <div className="text-2xl font-bold text-primary mb-1">500+</div>
                                            <div className="text-sm text-muted-foreground">Active Authors</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="text-center">
                                        <CardContent className="pt-6">
                                            <div className="text-2xl font-bold text-primary mb-1">50+</div>
                                            <div className="text-sm text-muted-foreground">Countries</div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <Button asChild variant="link" className="p-0 h-auto text-primary">
                                    <Link href="#">
                                        Explore Our Archives →
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
        </PublicLayout>
    );
}
