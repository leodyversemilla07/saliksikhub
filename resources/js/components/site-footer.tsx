/**
 * SiteFooter Component
 *
 * The main footer for the SaliksikHub Research Journal Management System.
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
import {
    FaFacebook,
    FaXTwitter,
    FaLinkedin,
    FaOrcid,
} from 'react-icons/fa6';
import {
    LuMail,
    LuMapPin,
    LuPhone,
    LuBookOpen,
    LuFileText,
    LuUsers,
    LuArchive,
    LuInfo,
    LuMessageSquare,
} from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PageProps } from '@/types';
import {
    home,
    submissions,
    archives,
    editorialBoard,
    announcements,
    aboutJournal,
    contactUs,
    current,
} from '@/routes';

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
    { name: 'Facebook', icon: FaFacebook, href: '#' },
    { name: 'Twitter', icon: FaXTwitter, href: '#' },
    { name: 'LinkedIn', icon: FaLinkedin, href: '#' },
    { name: 'ORCID', icon: FaOrcid, href: '#' },
];

export default function Footer() {
    const { currentJournal, currentInstitution } = usePage<PageProps>().props;
    const currentYear = new Date().getFullYear();

    const journalName = currentJournal?.name || 'Research Journal';
    const journalDescription =
        currentJournal?.description ||
        'A peer-reviewed, open-access journal dedicated to publishing high-quality research across multiple disciplines. Committed to advancing knowledge and fostering academic excellence.';
    const journalLogo = currentJournal?.logo_url || '/images/logo.png';
    const institutionName = currentInstitution?.name || 'Institution';
    const institutionAddress = currentInstitution?.address || '';
    const contactEmail = currentInstitution?.contact_email || '';
    const contactPhone =
        currentInstitution?.contact_phone ||
        currentInstitution?.settings?.contact_phone ||
        '';

    // Check if settings has specific values if needed, otherwise use defaults
    const issn =
        currentJournal?.issn ||
        currentInstitution?.settings?.issn ||
        '2024-XXXX';
    const frequency =
        currentJournal?.settings?.publication_frequency ||
        currentInstitution?.settings?.frequency ||
        'Bi-annual';
    const language =
        currentJournal?.settings?.language ||
        currentInstitution?.settings?.language ||
        'English';

    return (
        <footer className="border-t bg-muted/30">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: Journal Identity */}
                    <div className="lg:col-span-1">
                        <Link
                            href={home.url()}
                            className="mb-6 inline-flex items-center gap-3"
                        >
                            <img
                                src={journalLogo}
                                className="h-12 w-auto"
                                alt={journalName}
                            />
                            <div>
                                <h3 className="text-lg font-bold text-foreground">
                                    {journalName}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Research Journal
                                </p>
                            </div>
                        </Link>

                        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                            {journalDescription}
                        </p>

                        {/* Journal Metrics */}
                        <div className="rounded-lg border bg-background p-4">
                            <h4 className="mb-3 text-sm font-semibold text-foreground">
                                Journal Information
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        ISSN (Online)
                                    </span>
                                    <span className="font-mono text-foreground">
                                        {issn}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Frequency
                                    </span>
                                    <span className="text-foreground">
                                        {frequency}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Language
                                    </span>
                                    <span className="text-foreground">
                                        {language}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="mb-6 text-sm font-semibold tracking-wider text-foreground uppercase">
                            Browse
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h3 className="mt-8 mb-6 text-sm font-semibold tracking-wider text-foreground uppercase">
                            About
                        </h3>
                        <ul className="space-y-3">
                            {aboutLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
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
                        <h3 className="mb-6 text-sm font-semibold tracking-wider text-foreground uppercase">
                            For Authors
                        </h3>
                        <ul className="space-y-3">
                            {authorResources.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Call to Action */}
                        <div className="mt-8 rounded-lg border border-primary/10 bg-primary/5 p-4">
                            <h4 className="mb-2 font-semibold text-foreground">
                                Ready to Publish?
                            </h4>
                            <p className="mb-4 text-sm text-muted-foreground">
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
                        <h3 className="mb-6 text-sm font-semibold tracking-wider text-foreground uppercase">
                            Contact
                        </h3>

                        <div className="mb-8 space-y-4">
                            {institutionName && (
                                <div className="flex items-start gap-3">
                                    <LuMapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <div className="text-sm whitespace-pre-line text-muted-foreground">
                                        {institutionName}
                                        {institutionAddress && (
                                            <>
                                                <br />
                                                {institutionAddress}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                            {contactEmail && (
                                <div className="flex items-center gap-3">
                                    <LuMail className="h-5 w-5 shrink-0 text-primary" />
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {contactEmail}
                                    </a>
                                </div>
                            )}
                            {contactPhone && (
                                <div className="flex items-center gap-3">
                                    <LuPhone className="h-5 w-5 shrink-0 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        {contactPhone}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Newsletter */}
                        <div className="rounded-lg border bg-background p-4">
                            <h4 className="mb-2 text-sm font-semibold text-foreground">
                                Stay Updated
                            </h4>
                            <p className="mb-3 text-xs text-muted-foreground">
                                Subscribe to receive notifications about new
                                issues and announcements.
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
                            <h4 className="mb-3 text-sm font-semibold text-foreground">
                                Follow Us
                            </h4>
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
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                            <span>
                                &copy; {currentYear} {journalName}. All rights
                                reserved.
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>Powered by SaliksikHub</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                Terms of Use
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
                            >
                                Accessibility
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-primary"
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
