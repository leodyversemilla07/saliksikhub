import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    ExternalLink,
    FileText,
    Palette,
    Puzzle,
    Settings,
    Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';

interface JournalData {
    id: number;
    name: string;
    slug: string;
    abbreviation: string | null;
    issn: string | null;
    eissn: string | null;
    logo_url: string | null;
    institution: { name: string; abbreviation: string | null } | null;
    public_url: string;
    admin_url: string;
    submission_url: string;
    team_size: number;
}

interface NextStep {
    title: string;
    description: string;
    action: string;
    url: string;
    icon: string;
}

interface Props {
    journal: JournalData;
    nextSteps: NextStep[];
}

const iconMap: Record<string, React.ElementType> = {
    Palette,
    FileText,
    Puzzle,
    BookOpen,
    Settings,
};

export default function OnboardingComplete({ journal, nextSteps }: Props) {
    return (
        <AppLayout
            breadcrumbItems={[
                { label: 'Admin', href: '/admin/journals' },
                { label: 'Journals', href: '/admin/journals' },
                { label: journal.name },
            ]}
        >
            <Head title={`${journal.name} — Created!`} />

            <div className="mx-auto max-w-3xl space-y-8 pb-12">
                {/* Success Banner */}
                <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-primary/5 to-background p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Journal Created! 🎉
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        <span className="font-semibold text-foreground">
                            {journal.name}
                        </span>{' '}
                        is ready to go.
                    </p>
                    {journal.institution && (
                        <p className="text-sm text-muted-foreground">
                            Under{' '}
                            {journal.institution.abbreviation ??
                                journal.institution.name}
                            {journal.issn && ` · ISSN: ${journal.issn}`}
                            {journal.eissn && ` · eISSN: ${journal.eissn}`}
                        </p>
                    )}
                </div>

                {/* Journal Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Journal Details
                        </CardTitle>
                        <CardDescription>
                            Here's what was set up for{' '}
                            <strong>{journal.name}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="text-xs text-muted-foreground">
                                Abbreviation
                            </p>
                            <p className="font-semibold">
                                {journal.abbreviation ?? '—'}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="text-xs text-muted-foreground">
                                Team Members
                            </p>
                            <p className="font-semibold">
                                {journal.team_size > 0
                                    ? `${journal.team_size} assigned`
                                    : 'None assigned'}
                            </p>
                        </div>
                        {journal.issn && (
                            <div className="rounded-lg border bg-muted/30 p-3">
                                <p className="text-xs text-muted-foreground">
                                    ISSN
                                </p>
                                <p className="font-semibold">{journal.issn}</p>
                            </div>
                        )}
                        {journal.eissn && (
                            <div className="rounded-lg border bg-muted/30 p-3">
                                <p className="text-xs text-muted-foreground">
                                    eISSN
                                </p>
                                <p className="font-semibold">{journal.eissn}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <div>
                    <h2 className="mb-4 text-xl font-bold">Next Steps</h2>
                    <Separator className="mb-6" />
                    <div className="grid gap-4 sm:grid-cols-2">
                        {nextSteps.map((step) => {
                            const Icon = iconMap[step.icon] ?? Settings;

                            return (
                                <Link
                                    key={step.title}
                                    href={step.url}
                                    className="group block"
                                >
                                    <div className="rounded-xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h3 className="leading-none font-semibold group-hover:text-primary">
                                                    {step.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {step.description}
                                                </p>
                                                <span className="mt-2 inline-flex items-center text-xs font-medium text-primary">
                                                    {step.action}
                                                    <ExternalLink className="ml-1 h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="rounded-lg border bg-muted/30 p-6">
                    <h3 className="mb-3 font-semibold">Quick Links</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            render={<Link href={journal.public_url} />}
                        >
                            <ExternalLink className="mr-1.5 h-4 w-4" />
                            View Public Page
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            render={<Link href={journal.admin_url} />}
                        >
                            <Settings className="mr-1.5 h-4 w-4" />
                            Journal Settings
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            render={<Link href="/admin/journals" />}
                        >
                            All Journals
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
