import { usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone, Clock, Users, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import type { PageProps } from '@/types';

export default function ContactUs() {
    const { currentJournal, currentInstitution } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';
    const journalAbbreviation = currentJournal?.abbreviation ?? '';
    const institutionName = currentInstitution?.name ?? 'Institution';
    const institutionAddress = currentInstitution?.address ?? '';
    const contactEmail =
        currentInstitution?.contact_email ??
        (currentJournal?.settings?.contact_email as string) ??
        '';
    const contactPhone = currentInstitution?.contact_phone ?? '';

    return (
        <PublicLayout title={`Contact Us | ${journalName}`}>
            <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-oxford-blue mb-2 font-serif text-4xl font-bold">
                        Contact Us
                    </h1>
                    <p className="mb-8 text-lg text-muted-foreground">
                        Get in touch with the {journalName} editorial team
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Contact Information Card */}
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-oxford-blue flex items-center gap-3 font-serif text-2xl">
                                <MessageSquare className="text-oxford-blue h-8 w-8" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {institutionAddress && (
                                <div className="flex items-start gap-4">
                                    <MapPin className="text-oxford-blue mt-1 h-6 w-6 shrink-0" />
                                    <div>
                                        <h3 className="mb-1 font-semibold text-card-foreground">
                                            Mailing Address
                                        </h3>
                                        <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                                            {institutionName}
                                            <br />
                                            {institutionAddress}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {contactEmail && (
                                <div className="flex items-start gap-4">
                                    <Mail className="text-oxford-blue mt-1 h-6 w-6 shrink-0" />
                                    <div>
                                        <h3 className="mb-1 font-semibold text-card-foreground">
                                            Email Address
                                        </h3>
                                        <p className="text-muted-foreground">
                                            <a
                                                href={`mailto:${contactEmail}`}
                                                className="text-primary transition-colors hover:text-primary/80"
                                            >
                                                {contactEmail}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {contactPhone && (
                                <div className="flex items-start gap-4">
                                    <Phone className="text-oxford-blue mt-1 h-6 w-6 shrink-0" />
                                    <div>
                                        <h3 className="mb-1 font-semibold text-card-foreground">
                                            Phone
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {contactPhone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <Clock className="text-oxford-blue mt-1 h-6 w-6 shrink-0" />
                                <div>
                                    <h3 className="mb-1 font-semibold text-card-foreground">
                                        Office Hours
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Monday - Friday: 8:00 AM - 5:00 PM
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Editorial Team Card */}
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-oxford-blue flex items-center gap-3 font-serif text-2xl">
                                <Users className="text-oxford-blue h-8 w-8" />
                                Editorial Team
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="mb-2 font-semibold text-card-foreground">
                                        Manuscript Submissions
                                    </h3>
                                    <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                                        For manuscript submissions and author
                                        inquiries
                                    </p>
                                    {contactEmail && (
                                        <Badge variant="secondary">
                                            {contactEmail}
                                        </Badge>
                                    )}
                                </div>

                                <div>
                                    <h3 className="mb-2 font-semibold text-card-foreground">
                                        Editorial Inquiries
                                    </h3>
                                    <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                                        For editorial policies and review
                                        process questions
                                    </p>
                                    {contactEmail && (
                                        <Badge variant="secondary">
                                            {contactEmail}
                                        </Badge>
                                    )}
                                </div>

                                <div>
                                    <h3 className="mb-2 font-semibold text-card-foreground">
                                        Technical Support
                                    </h3>
                                    <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                                        For website and submission system issues
                                    </p>
                                    {contactEmail && (
                                        <Badge variant="secondary">
                                            {contactEmail}
                                        </Badge>
                                    )}
                                </div>

                                <div>
                                    <h3 className="mb-2 font-semibold text-card-foreground">
                                        General Information
                                    </h3>
                                    <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                                        For general inquiries and partnership
                                        opportunities
                                    </p>
                                    {contactEmail && (
                                        <Badge variant="secondary">
                                            {contactEmail}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Information Card */}
                <Card className="from-parchment/20 to-parchment/10 border-oxford-blue/20 bg-linear-to-r">
                    <CardContent className="pt-6">
                        <div className="space-y-4 text-center">
                            <h3 className="text-oxford-blue font-serif text-xl font-semibold">
                                Response Time
                            </h3>
                            <p className="mx-auto max-w-2xl leading-relaxed text-muted-foreground">
                                We strive to respond to all inquiries within 2-3
                                business days. For manuscript-related questions,
                                please allow up to 5 business days for a
                                comprehensive response. Urgent matters will be
                                prioritized accordingly.
                            </p>
                            <div className="flex justify-center gap-2 pt-2">
                                <Badge variant="outline">
                                    Professional Response
                                </Badge>
                                <Badge variant="outline">
                                    Timely Communication
                                </Badge>
                                <Badge variant="outline">
                                    Academic Excellence
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
