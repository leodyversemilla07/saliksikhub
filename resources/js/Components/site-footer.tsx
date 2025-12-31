/**
 * SiteFooter Component
 * 
 * The main footer for the Saliksikhub Research Journal Management System.
 * Provides comprehensive navigation, contact information, and institutional
 * branding for the public-facing journal website.
 * 
 * ## Features
 * - **Journal Identity**: Logo, name, and description with journal metrics
 * - **Quick Links**: Easy access to main sections (Current Issue, Archives, etc.)
 * - **Author Resources**: Submission guidelines, ethics, and policies
 * - **Contact Information**: Institution address, email, and phone
 * - **Newsletter Signup**: Email subscription form for updates
 * - **Social Media Links**: Connect with the journal on various platforms
 * - **Legal Links**: Privacy policy, terms of use, accessibility
 * 
 * ## Customization for Institutions
 * To customize for your institution:
 * 1. Update the logo image URL
 * 2. Modify the journal name and description
 * 3. Update ISSN, frequency, and language in Journal Information
 * 4. Replace contact details (address, email, phone)
 * 5. Update social media links
 * 6. Modify copyright text in bottom bar
 * 
 * ## Link Sections
 * - **Browse**: Home, Current Issue, Archives, Submissions
 * - **About**: About Journal, Editorial Board, Announcements, Contact
 * - **For Authors**: Guidelines, Process, Ethics, Copyright, Open Access
 * 
 * @module components/site-footer
 * @see {@link SiteHeader} for the corresponding header component
 */
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube, FaOrcid } from 'react-icons/fa6';
import { LuMail, LuMapPin, LuPhone, LuExternalLink, LuBookOpen, LuFileText, LuUsers, LuArchive, LuInfo, LuMessageSquare } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { home, submissions, archives, editorialBoard, announcements, aboutJournal, contactUs, current } from '@/routes';

const quickLinks = [
    { name: 'Home', href: home.url(), icon: LuBookOpen },
    { name: 'Current Issue', href: current.url(), icon: LuFileText },
    { name: 'Archives', href: archives.url(), icon: LuArchive },
    { name: 'Submissions', href: submissions.url(), icon: LuFileText },
];

const aboutLinks = [
    { name: 'About the Journal', href: aboutJournal.url(), icon: LuInfo },
    { name: 'Editorial Board', href: editorialBoard.url(), icon: LuUsers },
    { name: 'Announcements', href: announcements.url(), icon: LuMessageSquare },
    { name: 'Contact Us', href: contactUs.url(), icon: LuMail },
];

const authorResources = [
    { name: 'Author Guidelines', href: '#' },
    { name: 'Submission Process', href: submissions.url() },
    { name: 'Publication Ethics', href: '#' },
    { name: 'Copyright Policy', href: '#' },
    { name: 'Open Access Policy', href: '#' },
];

const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://www.facebook.com/DaluyangDunong' },
    { name: 'Twitter', icon: FaXTwitter, href: 'https://www.x.com/DaluyangDunong' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/company/daluyang-dunong' },
    { name: 'ORCID', icon: FaOrcid, href: '#' },
];

export default function Footer() {
    const { currentJournal, currentInstitution } = usePage<PageProps>().props;
    const currentYear = new Date().getFullYear();

    const journalName = currentJournal?.name || 'Saliksikhub';
    const journalDescription = currentJournal?.description || 'A peer-reviewed, open-access journal dedicated to publishing high-quality research across multiple disciplines. Committed to advancing knowledge and fostering academic excellence.';
    const journalLogo = currentJournal?.logo_url || 'https://www.daluyangdunong.minsu.edu.ph/img/mrj1.3083946c.png';
    const institutionName = currentInstitution?.name || 'Mindoro State University';
    const institutionAddress = 'Calapan City, Oriental Mindoro\nPhilippines'; // Fallback as we don't have address in Institution type yet
    const contactEmail = currentInstitution?.contact_email || 'journal@minsu.edu.ph';
    const contactPhone = '+63 (43) XXX-XXXX'; // Fallback
    
    // Check if settings has specific values if needed, otherwise use defaults
    const issn = currentJournal?.issn || '2024-XXXX';
    const frequency = 'Bi-annual'; // This could be in settings
    const language = 'English'; // This could be in settings

    return (
        <footer className="bg-muted/30 border-t">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: Journal Identity */}
                    <div className="lg:col-span-1">
                        <Link href={home.url()} className="inline-flex items-center gap-3 mb-6">
                            <img
                                src={journalLogo}
                                className="h-12 w-auto"
                                alt={journalName}
                            />
                            <div>
                                <h3 className="text-lg font-bold text-foreground">{journalName}</h3>
                                <p className="text-xs text-muted-foreground">Research Journal</p>
                            </div>
                        </Link>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                            {journalDescription}
                        </p>

                        {/* Journal Metrics */}
                        <div className="bg-background rounded-lg p-4 border">
                            <h4 className="text-sm font-semibold text-foreground mb-3">Journal Information</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ISSN (Online)</span>
                                    <span className="font-mono text-foreground">{issn}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Frequency</span>
                                    <span className="text-foreground">{frequency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Language</span>
                                    <span className="text-foreground">{language}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                            Browse
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mt-8 mb-6">
                            About
                        </h3>
                        <ul className="space-y-3">
                            {aboutLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: For Authors */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                            For Authors
                        </h3>
                        <ul className="space-y-3">
                            {authorResources.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Call to Action */}
                        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <h4 className="font-semibold text-foreground mb-2">Ready to Publish?</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                Submit your research for peer review.
                            </p>
                            <Button asChild size="sm" className="w-full">
                                <Link href={submissions.url()}>
                                    Submit Manuscript
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Column 4: Contact & Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                            Contact
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <LuMapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <div className="text-sm text-muted-foreground whitespace-pre-line">
                                    {institutionName}<br />
                                    {institutionAddress}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <LuMail className="h-5 w-5 text-primary shrink-0" />
                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {contactEmail}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <LuPhone className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">
                                    {contactPhone}
                                </span>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-background rounded-lg p-4 border">
                            <h4 className="text-sm font-semibold text-foreground mb-2">
                                Stay Updated
                            </h4>
                            <p className="text-xs text-muted-foreground mb-3">
                                Subscribe to receive notifications about new issues and announcements.
                            </p>
                            <form className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Your email"
                                    className="h-9 text-sm"
                                />
                                <Button type="submit" size="sm">
                                    Subscribe
                                </Button>
                            </form>
                        </div>

                        {/* Social Links */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-foreground mb-3">Follow Us</h4>
                            <div className="flex gap-2">
                                {socialLinks.map((item) => (
                                    <Button
                                        key={item.name}
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9"
                                        asChild
                                    >
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={item.name}
                                        >
                                            <item.icon className="h-4 w-4" />
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <span>© {currentYear} {institutionName}. All rights reserved.</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Powered by Saliksikhub</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Terms of Use
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Accessibility
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
