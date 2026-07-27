import { Head, useForm } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    Check,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText,
    Globe,
    Image as ImageIcon,
    Info,
    Loader2,
    Palette,
    Shield,
    SwatchBook,
    Users,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { ThemeSettings } from '@/types';

// ------------------------------------------------------------------ //
// Types
// ------------------------------------------------------------------ //

interface Institution {
    id: number;
    name: string;
    abbreviation?: string | null;
    logo_url?: string | null;
}

interface EditorUser {
    id: number;
    name: string;
    email: string;
    avatar_url?: string | null;
}

interface TeamMember {
    user_id: string;
    role: string;
    name: string;
    email: string;
}

interface Props {
    institutions: Institution[];
    editors: EditorUser[];
    defaultTheme: ThemeSettings;
}

type StepId = 'basic' | 'branding' | 'policies' | 'team' | 'review';

interface Step {
    id: StepId;
    label: string;
    icon: React.ElementType;
    description: string;
}

const STEPS: Step[] = [
    {
        id: 'basic',
        label: 'Basic Info',
        icon: Info,
        description: 'Journal name, institution, identifiers',
    },
    {
        id: 'branding',
        label: 'Branding',
        icon: Palette,
        description: 'Logo, cover, theme colors',
    },
    {
        id: 'policies',
        label: 'Policies',
        icon: Shield,
        description: 'Guidelines, review, access',
    },
    {
        id: 'team',
        label: 'Team',
        icon: Users,
        description: 'Add editors and managers',
    },
    {
        id: 'review',
        label: 'Review',
        icon: Eye,
        description: 'Confirm and create',
    },
];

const PRESET_COLORS = [
    { name: 'Ocean Blue', primary: '#2563EB' },
    { name: 'Emerald', primary: '#059669' },
    { name: 'Ruby', primary: '#DC2626' },
    { name: 'Amber', primary: '#D97706' },
    { name: 'Violet', primary: '#7C3AED' },
    { name: 'Rose', primary: '#E11D48' },
    { name: 'Teal', primary: '#0D9488' },
    { name: 'Indigo', primary: '#4338CA' },
];

// ------------------------------------------------------------------ //
// Component
// ------------------------------------------------------------------ //

export default function JournalOnboarding({
    institutions,
    editors,
    defaultTheme,
}: Props) {
    const [currentStep, setCurrentStep] = useState<StepId>('basic');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

    const { data, setData, post, processing, errors } = useForm({
        // Step 1: Basic
        institution_id: '',
        name: '',
        abbreviation: '',
        description: '',
        issn: '',
        eissn: '',
        publication_frequency: '',
        // Step 2: Branding
        logo: null as File | null,
        cover_image: null as File | null,
        theme_settings: defaultTheme,
        // Step 3: Policies
        submission_guidelines: '',
        review_policy: '',
        open_access: true,
        peer_reviewed: true,
        // Step 4: Team
        team: [] as TeamMember[],
    });

    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

    // Computed summary
    const selectedInstitution = institutions.find(
        (i) => i.id.toString() === data.institution_id,
    );

    // —— Validation per step ——

    const stepIsValid = useMemo(() => {
        switch (currentStep) {
            case 'basic':
                return (
                    data.institution_id !== '' &&
                    data.name.trim().length >= 3 &&
                    data.abbreviation.trim().length >= 2
                );
            case 'branding':
                return true;
            case 'policies':
                return true;
            case 'team':
                return true;
            case 'review':
                return true;
            default:
                return true;
        }
    }, [currentStep, data]);

    const allStepsComplete = useMemo(() => {
        return (
            data.institution_id !== '' &&
            data.name.trim().length >= 3 &&
            data.abbreviation.trim().length >= 2
        );
    }, [data]);

    // —— Team management ——

    function removeTeamMember(index: number) {
        setData(
            'team',
            data.team.filter((_, i) => i !== index),
        );
    }

    // —— Theme helpers ——

    function setPresetColor(color: string) {
        setData('theme_settings', {
            ...data.theme_settings,
            colors: {
                ...data.theme_settings.colors,
                primary: color,
            },
        });
    }

    // —— File handlers ——

    function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    }

    function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    }

    // —— Navigation ——

    function goToStep(step: StepId) {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function nextStep() {
        const next = stepIndex + 1;
        if (next < STEPS.length) {
            goToStep(STEPS[next].id);
        }
    }

    function prevStep() {
        const prev = stepIndex - 1;
        if (prev >= 0) {
            goToStep(STEPS[prev].id);
        }
    }

    // —— Submit ——

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.journals.onboarding.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // —— Render helpers ——

    function renderStepContent() {
        switch (currentStep) {
            case 'basic':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Institution & Journal Name
                                </CardTitle>
                                <CardDescription>
                                    Select the parent institution and name your
                                    journal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="institution_id">
                                        Institution *
                                    </Label>
                                    <Select
                                        value={data.institution_id}
                                        onValueChange={(value) =>
                                            setData('institution_id', value)
                                        }
                                    >
                                        <SelectTrigger id="institution_id">
                                            <SelectValue placeholder="Select an institution" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {institutions.map((inst) => (
                                                <SelectItem
                                                    key={inst.id}
                                                    value={inst.id.toString()}
                                                >
                                                    {inst.name}
                                                    {inst.abbreviation &&
                                                        ` (${inst.abbreviation})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.institution_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.institution_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Journal Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Mindanao Research Journal"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="abbreviation">
                                        Abbreviation *
                                    </Label>
                                    <Input
                                        id="abbreviation"
                                        value={data.abbreviation}
                                        onChange={(e) =>
                                            setData(
                                                'abbreviation',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., MRJ"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Used in the URL slug and citations
                                    </p>
                                    {errors.abbreviation && (
                                        <p className="text-sm text-destructive">
                                            {errors.abbreviation}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Brief description of the journal's scope and mission"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-primary" />
                                    Identifiers & Frequency
                                </CardTitle>
                                <CardDescription>
                                    ISSN, eISSN, and publication schedule
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="issn">
                                            ISSN (Print)
                                        </Label>
                                        <Input
                                            id="issn"
                                            value={data.issn}
                                            onChange={(e) =>
                                                setData('issn', e.target.value)
                                            }
                                            placeholder="e.g., 1234-5678"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="eissn">
                                            eISSN (Online)
                                        </Label>
                                        <Input
                                            id="eissn"
                                            value={data.eissn}
                                            onChange={(e) =>
                                                setData('eissn', e.target.value)
                                            }
                                            placeholder="e.g., 1234-5679"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="publication_frequency">
                                        Publication Frequency
                                    </Label>
                                    <Select
                                        value={data.publication_frequency}
                                        onValueChange={(value) =>
                                            setData(
                                                'publication_frequency',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger id="publication_frequency">
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Annual">
                                                Annual
                                            </SelectItem>
                                            <SelectItem value="Bi-annual">
                                                Bi-annual
                                            </SelectItem>
                                            <SelectItem value="Quarterly">
                                                Quarterly
                                            </SelectItem>
                                            <SelectItem value="Tri-annual">
                                                Tri-annual
                                            </SelectItem>
                                            <SelectItem value="Monthly">
                                                Monthly
                                            </SelectItem>
                                            <SelectItem value="Continuous">
                                                Continuous
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case 'branding':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                    Logo & Cover
                                </CardTitle>
                                <CardDescription>
                                    Upload your journal's branding assets
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Journal Logo</Label>
                                    <div className="flex items-center gap-4">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="h-20 w-20 rounded-lg border object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed">
                                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="cursor-pointer"
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Max 2MB. Recommended: 200×200px
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Cover Image</Label>
                                    <div className="space-y-2">
                                        {coverPreview ? (
                                            <img
                                                src={coverPreview}
                                                alt="Cover preview"
                                                className="h-36 w-full rounded-lg border object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-36 w-full items-center justify-center rounded-lg border-2 border-dashed">
                                                <span className="text-sm text-muted-foreground">
                                                    Journal cover image
                                                    (optional)
                                                </span>
                                            </div>
                                        )}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverChange}
                                            className="cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Max 4MB. Recommended: 1200×400px
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <SwatchBook className="h-5 w-5 text-primary" />
                                    Theme Color
                                </CardTitle>
                                <CardDescription>
                                    Choose a primary color for your journal's
                                    theme
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Preset Colors</Label>
                                    <div className="mt-2 flex flex-wrap gap-3">
                                        {PRESET_COLORS.map((preset) => (
                                            <button
                                                key={preset.primary}
                                                type="button"
                                                onClick={() =>
                                                    setPresetColor(
                                                        preset.primary,
                                                    )
                                                }
                                                className={cn(
                                                    'group relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110',
                                                    data.theme_settings.colors
                                                        .primary ===
                                                        preset.primary &&
                                                        'ring-2 ring-offset-2 ring-offset-background',
                                                )}
                                                style={{
                                                    backgroundColor:
                                                        preset.primary,
                                                }}
                                                title={preset.name}
                                            >
                                                {data.theme_settings.colors
                                                    .primary ===
                                                    preset.primary && (
                                                    <Check className="h-5 w-5 text-white drop-shadow" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="customColor">
                                        Custom Color
                                    </Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="customColor"
                                            type="color"
                                            value={
                                                data.theme_settings.colors
                                                    .primary
                                            }
                                            onChange={(e) =>
                                                setPresetColor(e.target.value)
                                            }
                                            className="h-10 w-16 cursor-pointer p-1"
                                        />
                                        <span className="font-mono text-sm text-muted-foreground">
                                            {data.theme_settings.colors.primary}
                                        </span>
                                    </div>
                                </div>

                                {/* Color preview */}
                                <div className="mt-4 rounded-lg border p-4">
                                    <p className="mb-2 text-sm font-medium">
                                        Preview
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            style={{
                                                backgroundColor:
                                                    data.theme_settings.colors
                                                        .primary,
                                                color: '#fff',
                                            }}
                                        >
                                            Primary Button
                                        </Badge>
                                        <Badge variant="outline">
                                            Outline Badge
                                        </Badge>
                                        <span
                                            className="rounded px-2 py-1 text-sm text-white"
                                            style={{
                                                backgroundColor:
                                                    data.theme_settings.colors
                                                        .primary,
                                            }}
                                        >
                                            Link
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case 'policies':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Publishing Model
                                </CardTitle>
                                <CardDescription>
                                    Define your journal's access and review
                                    policies
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <Label className="text-base">
                                            Open Access
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            All content freely available without
                                            subscription
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.open_access}
                                        onCheckedChange={(checked) =>
                                            setData('open_access', checked)
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <Label className="text-base">
                                            Peer Reviewed
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Submissions undergo peer review
                                            before publication
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.peer_reviewed}
                                        onCheckedChange={(checked) =>
                                            setData('peer_reviewed', checked)
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Submission Guidelines
                                </CardTitle>
                                <CardDescription>
                                    Provide instructions for authors submitting
                                    to your journal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="submission_guidelines">
                                        Guidelines
                                    </Label>
                                    <Textarea
                                        id="submission_guidelines"
                                        value={data.submission_guidelines}
                                        onChange={(e) =>
                                            setData(
                                                'submission_guidelines',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., Manuscripts should be prepared in APA 7th edition format, include an abstract of 250-300 words, and follow the IMRaD structure..."
                                        rows={6}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Appears on the submissions page for
                                        authors
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Review Policy
                                </CardTitle>
                                <CardDescription>
                                    Describe your peer review process
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="review_policy">
                                        Policy
                                    </Label>
                                    <Textarea
                                        id="review_policy"
                                        value={data.review_policy}
                                        onChange={(e) =>
                                            setData(
                                                'review_policy',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., This journal uses double-blind peer review. Initial review decisions are typically made within 4-6 weeks..."
                                        rows={6}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case 'team':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Editorial Team
                                </CardTitle>
                                <CardDescription>
                                    Add editors and managers to your journal.
                                    You can assign more later.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Add member form */}
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label>Select User</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-start"
                                                >
                                                    <Users className="mr-2 h-4 w-4 shrink-0" />
                                                    {() => {
                                                        const selected =
                                                            editors.find(
                                                                (e) =>
                                                                    !data.team.some(
                                                                        (t) =>
                                                                            t.user_id ===
                                                                            e.id.toString(),
                                                                    ),
                                                            );
                                                        return selected
                                                            ? selected.name
                                                            : 'Search users...';
                                                    }}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search editors..." />
                                                    <CommandEmpty>
                                                        No users found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {editors
                                                            .filter(
                                                                (e) =>
                                                                    !data.team.some(
                                                                        (t) =>
                                                                            t.user_id ===
                                                                            e.id.toString(),
                                                                    ),
                                                            )
                                                            .map((editor) => (
                                                                <CommandItem
                                                                    key={
                                                                        editor.id
                                                                    }
                                                                    value={`${editor.name} ${editor.email}`}
                                                                >
                                                                    <div className="flex flex-col">
                                                                        <span>
                                                                            {
                                                                                editor.name
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {
                                                                                editor.email
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Select defaultValue="">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="editor_in_chief">
                                                    Editor-in-Chief
                                                </SelectItem>
                                                <SelectItem value="managing_editor">
                                                    Managing Editor
                                                </SelectItem>
                                                <SelectItem value="associate_editor">
                                                    Associate Editor
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Team list */}
                                {data.team.length > 0 ? (
                                    <div className="space-y-2">
                                        <Label>Team Members</Label>
                                        <div className="divide-y rounded-lg border">
                                            {data.team.map((member, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">
                                                            {member.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {member.email}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary">
                                                            {member.role ===
                                                            'editor_in_chief'
                                                                ? 'Editor-in-Chief'
                                                                : member.role ===
                                                                    'managing_editor'
                                                                  ? 'Managing Editor'
                                                                  : 'Associate Editor'}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeTeamMember(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            ×
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed p-8 text-center">
                                        <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            No team members added yet. Editors
                                            can be assigned later from Journal
                                            Settings.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                );

            case 'review':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-primary" />
                                    Review & Confirm
                                </CardTitle>
                                <CardDescription>
                                    Verify your journal details before creating
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Summary sections */}
                                <div className="rounded-lg border p-4">
                                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                                        <Info className="h-4 w-4 text-primary" />
                                        Basic Information
                                    </h4>
                                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Institution
                                            </dt>
                                            <dd className="font-medium">
                                                {selectedInstitution?.name ??
                                                    '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Name
                                            </dt>
                                            <dd className="font-medium">
                                                {data.name || '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Abbreviation
                                            </dt>
                                            <dd className="font-medium">
                                                {data.abbreviation || '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Frequency
                                            </dt>
                                            <dd className="font-medium">
                                                {data.publication_frequency ||
                                                    '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">
                                                ISSN
                                            </dt>
                                            <dd className="font-medium">
                                                {data.issn || '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">
                                                eISSN
                                            </dt>
                                            <dd className="font-medium">
                                                {data.eissn || '—'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                                        <Palette className="h-4 w-4 text-primary" />
                                        Branding & Theme
                                    </h4>
                                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Logo
                                            </dt>
                                            <dd>
                                                {data.logo ? (
                                                    <img
                                                        src={logoPreview!}
                                                        alt="Logo"
                                                        className="h-10 w-10 rounded border object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        Not uploaded
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Primary Color
                                            </dt>
                                            <dd className="flex items-center gap-2 font-medium">
                                                <span
                                                    className="inline-block h-4 w-4 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            data.theme_settings
                                                                .colors.primary,
                                                    }}
                                                />
                                                {
                                                    data.theme_settings.colors
                                                        .primary
                                                }
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                                        <Shield className="h-4 w-4 text-primary" />
                                        Policies
                                    </h4>
                                    <dl className="grid gap-2 text-sm sm:grid-cols-3">
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Open Access
                                            </dt>
                                            <dd className="font-medium">
                                                {data.open_access
                                                    ? '✅ Yes'
                                                    : '❌ No'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Peer Reviewed
                                            </dt>
                                            <dd className="font-medium">
                                                {data.peer_reviewed
                                                    ? '✅ Yes'
                                                    : '❌ No'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Team Members
                                            </dt>
                                            <dd className="font-medium">
                                                {data.team.length > 0
                                                    ? `${data.team.length} assigned`
                                                    : 'None yet'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
        }
    }

    return (
        <AppLayout
            breadcrumbItems={[
                { label: 'Admin', href: '/admin/journals' },
                { label: 'Onboarding Wizard' },
            ]}
        >
            <Head title="Journal Onboarding Wizard" />

            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Create a New Journal
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Follow the steps below to set up your journal in minutes
                    </p>
                </div>

                {/* Step Progress */}
                <div className="flex items-center justify-between">
                    {STEPS.map((step, index) => {
                        const isActive = step.id === currentStep;
                        const isCompleted =
                            STEPS.indexOf(
                                STEPS.find((s) => s.id === currentStep)!,
                            ) > index;

                        return (
                            <button
                                key={step.id}
                                type="button"
                                onClick={() => {
                                    // Allow navigation only to completed or current
                                    const currIdx = STEPS.findIndex(
                                        (s) => s.id === currentStep,
                                    );
                                    if (index <= currIdx + 1) {
                                        goToStep(step.id);
                                    }
                                }}
                                className={cn(
                                    'flex flex-col items-center gap-1.5 text-xs transition-colors',
                                    isActive
                                        ? 'text-primary'
                                        : isCompleted
                                          ? 'text-primary/70'
                                          : 'text-muted-foreground',
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                                        isActive
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : isCompleted
                                              ? 'border-primary bg-primary text-primary-foreground'
                                              : 'border-muted-foreground/30 bg-muted',
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <step.icon className="h-4 w-4" />
                                    )}
                                </div>
                                <span className="hidden font-medium sm:block">
                                    {step.label}
                                </span>
                                <span className="hidden text-[10px] text-muted-foreground sm:block">
                                    {step.description}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                            width: `${((currentStepIndex + 1) / STEPS.length) * 100}%`,
                        }}
                    />
                </div>

                {/* Form */}
                <form onSubmit={submit}>
                    {renderStepContent()}

                    {/* Navigation buttons */}
                    <div className="mt-8 flex items-center justify-between border-t pt-6">
                        <div>
                            {currentStepIndex > 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                >
                                    <ChevronLeft className="mr-1.5 h-4 w-4" />
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {currentStepIndex < STEPS.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!stepIsValid}
                                >
                                    Next
                                    <ChevronRight className="ml-1.5 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={!allStepsComplete || processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-1.5 h-4 w-4" />
                                            Create Journal
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
