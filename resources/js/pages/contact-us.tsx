import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Phone, Clock, Users, MessageSquare } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function ContactUs() {
    const { currentJournal, currentInstitution } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';
    const journalAbbreviation = currentJournal?.abbreviation ?? '';
    const institutionName = currentInstitution?.name ?? 'Institution';
    const institutionAddress = currentInstitution?.address ?? '';
    const contactEmail = currentInstitution?.contact_email ?? currentJournal?.settings?.contact_email as string ?? '';
    const contactPhone = currentInstitution?.contact_phone ?? '';

    return (
        <PublicLayout title={`Contact Us | ${journalName}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    <div className="text-center">
                        <h1 className="font-serif text-4xl font-bold text-oxford-blue mb-2">
                            Contact Us
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Get in touch with the {journalName} editorial team
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Information Card */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="font-serif flex items-center gap-3 text-2xl text-oxford-blue">
                                    <MessageSquare className="h-8 w-8 text-oxford-blue" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {institutionAddress && (
                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-6 w-6 text-oxford-blue shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-card-foreground mb-1">Mailing Address</h3>
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                                {institutionName}<br />
                                                {institutionAddress}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {contactEmail && (
                                    <div className="flex items-start gap-4">
                                        <Mail className="h-6 w-6 text-oxford-blue shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-card-foreground mb-1">Email Address</h3>
                                            <p className="text-muted-foreground">
                                                <a
                                                    href={`mailto:${contactEmail}`}
                                                    className="text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    {contactEmail}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {contactPhone && (
                                    <div className="flex items-start gap-4">
                                        <Phone className="h-6 w-6 text-oxford-blue shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-card-foreground mb-1">Phone</h3>
                                            <p className="text-muted-foreground">
                                                {contactPhone}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-oxford-blue shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-1">Office Hours</h3>
                                        <p className="text-muted-foreground">
                                            Monday - Friday: 8:00 AM - 5:00 PM
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Editorial Team Card */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="font-serif flex items-center gap-3 text-2xl text-oxford-blue">
                                    <Users className="h-8 w-8 text-oxford-blue" />
                                    Editorial Team
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-2">Manuscript Submissions</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                                            For manuscript submissions and author inquiries
                                        </p>
                                        {contactEmail && <Badge variant="secondary">{contactEmail}</Badge>}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-2">Editorial Inquiries</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                                            For editorial policies and review process questions
                                        </p>
                                        {contactEmail && <Badge variant="secondary">{contactEmail}</Badge>}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-2">Technical Support</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                                            For website and submission system issues
                                        </p>
                                        {contactEmail && <Badge variant="secondary">{contactEmail}</Badge>}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-2">General Information</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                                            For general inquiries and partnership opportunities
                                        </p>
                                        {contactEmail && <Badge variant="secondary">{contactEmail}</Badge>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Information Card */}
                    <Card className="bg-linear-to-r from-parchment/20 to-parchment/10 border-oxford-blue/20">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <h3 className="font-serif text-xl font-semibold text-oxford-blue">
                                    Response Time
                                </h3>
                                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                    We strive to respond to all inquiries within 2-3 business days. For manuscript-related questions,
                                    please allow up to 5 business days for a comprehensive response. Urgent matters will be prioritized accordingly.
                                </p>
                                <div className="flex justify-center gap-2 pt-2">
                                    <Badge variant="outline">Professional Response</Badge>
                                    <Badge variant="outline">Timely Communication</Badge>
                                    <Badge variant="outline">Academic Excellence</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
        </PublicLayout>
    );
}
