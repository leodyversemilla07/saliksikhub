import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/components/site-header';
import Footer from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Phone, Clock, Users, MessageSquare } from 'lucide-react';

export default function ContactUs({ auth }: PageProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Head title="Contact Us | Daluyang Dunong" />
            <Header auth={auth} />

            <main className="flex-grow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            Contact Us
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Get in touch with the Daluyang Dunong editorial team
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Information Card */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <MessageSquare className="h-8 w-8 text-primary" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-1">Mailing Address</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Mindoro State University, Main Campus<br />
                                            Victoria, Oriental Mindoro<br />
                                            Philippines
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-1">Email Address</h3>
                                        <p className="text-muted-foreground">
                                            <a
                                                href="mailto:contact@ddmrj.minsu.edu.ph"
                                                className="text-primary hover:text-primary/80 transition-colors"
                                            >
                                                contact@ddmrj.minsu.edu.ph
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-1">Phone</h3>
                                        <p className="text-muted-foreground">
                                            +63 (43) 288-3156
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-1">Office Hours</h3>
                                        <p className="text-muted-foreground">
                                            Monday - Friday: 8:00 AM - 5:00 PM<br />
                                            Philippine Standard Time (PST)
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Editorial Team Card */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <Users className="h-8 w-8 text-primary" />
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
                                        <Badge variant="secondary">submissions@ddmrj.minsu.edu.ph</Badge>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-2">Editorial Inquiries</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                                            For editorial policies and review process questions
                                        </p>
                                        <Badge variant="secondary">editorial@ddmrj.minsu.edu.ph</Badge>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-2">Technical Support</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                                            For website and submission system issues
                                        </p>
                                        <Badge variant="secondary">support@ddmrj.minsu.edu.ph</Badge>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-card-foreground mb-2">General Information</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                                            For general inquiries and partnership opportunities
                                        </p>
                                        <Badge variant="secondary">info@ddmrj.minsu.edu.ph</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Information Card */}
                    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <h3 className="text-xl font-semibold text-foreground">
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
            </main>
            <Footer />
        </div>
    );
}
