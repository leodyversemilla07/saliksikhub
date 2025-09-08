import { Link } from '@inertiajs/react'
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { LuMail, LuMapPin, LuArrowRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const footerQuickLinks = [
    { name: "Home", href: route('home') },
    { name: "Submissions", href: route('submissions') },
    { name: "Archives", href: route('archives') },
    { name: "Editorial Board", href: route('editorial-board') },
    { name: "Announcements", href: route('announcements') },
    { name: "About", href: route('about-journal') },
    { name: "Contact", href: route('contact-us') },
];

const socialLinks = [
    { name: "Facebook", icon: FaFacebook, href: "https://www.facebook.com/DaluyangDunong" },
    { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/daluyangdunong" },
    { name: "Twitter", icon: FaXTwitter, href: "https://www.x.com/DaluyangDunong" },
    { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/company/daluyang-dunong" },
    { name: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/@DaluyangDunong" },
]

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-12">
                    {/* Column 1: About & Newsletter */}
                    <div className="space-y-8">
                        <Link href={route('home')} className="inline-block">
                            <span className="text-2xl font-bold text-primary">
                                Research Journal Manager
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-300">
                            A flexible, open platform for managing scholarly journals — handling submissions, peer review,
                            editorial decisions, and publication metadata with audit trails and integrations.
                        </p>

                        {/* Newsletter Signup */}
                        <div className="pt-4">
                            <h4 className="text-foreground font-semibold text-sm mb-4 transition-colors duration-300">
                                Subscribe to Our Newsletter
                            </h4>
                            <form className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 min-w-0"
                                />
                                <Button type="submit" size="icon">
                                    <LuArrowRight className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-foreground font-semibold text-lg mb-8 transition-colors duration-300">Quick Links</h3>
                        <ul className="space-y-4">
                            {footerQuickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Call to Action */}
                    <div>
                        <h3 className="text-foreground font-semibold text-lg mb-8 transition-colors duration-300">For Authors</h3>
                        <div className="space-y-6">
                            <Card className="hover:bg-accent transition-all duration-300">
                                <CardHeader>
                                    <CardTitle>Submit Your Research</CardTitle>
                                    <CardDescription>Ready to publish? Submit your manuscript for peer review.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="ghost" asChild className="p-0 h-auto font-medium text-primary hover:underline">
                                        <Link href={route('submissions')} className="inline-flex items-center gap-2">
                                            Submit Now
                                            <LuArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="hover:bg-accent transition-all duration-300">
                                <CardHeader>
                                    <CardTitle>Review Guidelines</CardTitle>
                                    <CardDescription>Learn about our peer review process and guidelines.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="ghost" asChild className="p-0 h-auto font-medium text-primary hover:underline">
                                        <Link href="#" className="inline-flex items-center gap-2">
                                            Learn More
                                            <LuArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Column 4: Contact & Social */}
                    <div>
                        <h3 className="text-foreground font-semibold text-lg mb-8 transition-colors duration-300">Contact Us</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-accent rounded-xl">
                                    <LuMail className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-muted-foreground text-sm transition-colors duration-300">support@journal-manager.local</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-accent rounded-xl">
                                    <LuMapPin className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-muted-foreground text-sm transition-colors duration-300">Institutional address or publisher contact</span>
                            </div>

                            {/* Social Media Links */}
                            <div className="pt-6">
                                <h4 className="text-foreground font-semibold text-sm mb-4 transition-colors duration-300">
                                    Follow Us
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                    {socialLinks.map((item) => (
                                        <Button
                                            key={item.name}
                                            variant="secondary"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <item.icon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                                <span className="sr-only">{item.name}</span>
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright and Legal Section */}
                <Separator className="mt-12" />
                <div className="pt-4">
                    <div className="md:flex md:items-center md:justify-between pb-4">
                        <div className="text-center md:text-left">
                            <p className="text-muted-foreground text-sm transition-colors duration-300">
                                &copy; {currentYear} Research Journal Manager. All rights reserved.
                            </p>
                            <p className="text-muted-foreground text-xs mt-1 transition-colors duration-300">
                                Powered by open publishing standards.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-8">
                            <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
                                <Link href="#">Privacy Policy</Link>
                            </Button>
                            <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
                                <Link href="#">Terms of Service</Link>
                            </Button>
                            <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
                                <Link href="#">Copyright Notice</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}