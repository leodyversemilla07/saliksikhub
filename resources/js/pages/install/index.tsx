import { Head, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    XCircle,
    ChevronRight,
    ChevronLeft,
    Shield,
    Building2,
    BookOpen,
    Settings,
    Rocket,
    Server,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
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
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
    FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Requirement {
    label: string;
    required: string;
    current: string;
    passed: boolean;
}

interface Props {
    requirements: Record<string, Requirement>;
}

const STEPS = [
    { key: 'requirements', label: 'Requirements', icon: Server },
    { key: 'admin', label: 'Admin Account', icon: Shield },
    { key: 'institution', label: 'Institution', icon: Building2 },
    { key: 'journal', label: 'Journal', icon: BookOpen },
    { key: 'platform', label: 'Platform', icon: Settings },
    { key: 'review', label: 'Install', icon: Rocket },
] as const;

export default function Install({ requirements }: Props) {
    const [step, setStep] = useState(0);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        admin: {
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            password: '',
            password_confirmation: '',
        },
        institution: {
            name: '',
            abbreviation: '',
            contact_email: '',
            website: '',
            address: '',
        },
        journal: {
            name: '',
            abbreviation: '',
            description: '',
        },
        platform: {
            platform_name: '',
            platform_tagline: '',
            platform_description: '',
            admin_email: '',
        },
    });

    const allRequirementsMet = Object.values(requirements).every(
        (r) => r.passed,
    );

    const canProceed = (): boolean => {
        switch (step) {
            case 0:
                return allRequirementsMet;
            case 1:
                return !!(
                    data.admin.firstname &&
                    data.admin.email &&
                    data.admin.username &&
                    data.admin.password &&
                    data.admin.password === data.admin.password_confirmation
                );
            case 2:
                return !!data.institution.name;
            case 3:
                return !!(data.journal.name && data.journal.abbreviation);
            case 4:
                return !!data.platform.platform_name;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (step < STEPS.length - 1 && canProceed()) {
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleInstall = (e: FormEvent) => {
        e.preventDefault();
        post('/install');
    };

    const setNestedData = <K extends keyof typeof data>(
        group: K,
        field: string,
        value: string,
    ) => {
        setData((prev) => ({
            ...prev,
            [group]: { ...prev[group], [field]: value },
        }));
    };

    // Helper to get nested error for a field like "admin.email"
    const getError = (key: string): string | undefined => {
        return (errors as Record<string, string>)[key];
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <Head title="Install" />

            <div className="flex w-full max-w-2xl flex-col gap-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Platform Setup
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Configure your research journal management platform
                    </p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-1">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        const isActive = i === step;
                        const isComplete = i < step;

                        return (
                            <div key={s.key} className="flex items-center">
                                <button
                                    onClick={() => i < step && setStep(i)}
                                    disabled={i > step}
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : isComplete
                                              ? 'cursor-pointer bg-primary/10 text-primary hover:bg-primary/20'
                                              : 'bg-muted-foreground/10 text-muted-foreground'
                                    }`}
                                >
                                    <Icon className="size-3.5" />
                                    <span className="hidden sm:inline">
                                        {s.label}
                                    </span>
                                </button>
                                {i < STEPS.length - 1 && (
                                    <ChevronRight className="mx-0.5 size-4 text-muted-foreground/40" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Step content */}
                <Card>
                    <form onSubmit={handleInstall}>
                        {/* Step 0: Requirements */}
                        {step === 0 && (
                            <>
                                <CardHeader>
                                    <CardTitle>System Requirements</CardTitle>
                                    <CardDescription>
                                        Verify your server meets all
                                        requirements before proceeding.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {Object.entries(requirements).map(
                                            ([key, req]) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center justify-between rounded-lg border px-4 py-2.5"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {req.passed ? (
                                                            <CheckCircle2 className="size-5 text-green-600" />
                                                        ) : (
                                                            <XCircle className="size-5 text-red-600" />
                                                        )}
                                                        <span className="text-sm font-medium">
                                                            {req.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {req.current}
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                req.passed
                                                                    ? 'secondary'
                                                                    : 'destructive'
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {req.passed
                                                                ? 'OK'
                                                                : 'Required'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    {!allRequirementsMet && (
                                        <p className="mt-4 text-sm text-red-600">
                                            Some requirements are not met.
                                            Please fix them before proceeding.
                                        </p>
                                    )}
                                </CardContent>
                            </>
                        )}

                        {/* Step 1: Admin Account */}
                        {step === 1 && (
                            <>
                                <CardHeader>
                                    <CardTitle>Admin Account</CardTitle>
                                    <CardDescription>
                                        Create the super administrator account.
                                        This user will have full platform
                                        access.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field
                                                data-invalid={
                                                    !!getError(
                                                        'admin.firstname',
                                                    )
                                                }
                                            >
                                                <FieldLabel htmlFor="admin-firstname">
                                                    First Name
                                                </FieldLabel>
                                                <Input
                                                    id="admin-firstname"
                                                    value={data.admin.firstname}
                                                    onChange={(e) => {
                                                        setNestedData(
                                                            'admin',
                                                            'firstname',
                                                            e.target.value,
                                                        );
                                                        clearErrors(
                                                            'admin.firstname' as any,
                                                        );
                                                    }}
                                                    required
                                                />
                                                {getError(
                                                    'admin.firstname',
                                                ) && (
                                                    <FieldError>
                                                        {getError(
                                                            'admin.firstname',
                                                        )}
                                                    </FieldError>
                                                )}
                                            </Field>
                                            <Field
                                                data-invalid={
                                                    !!getError('admin.lastname')
                                                }
                                            >
                                                <FieldLabel htmlFor="admin-lastname">
                                                    Last Name
                                                </FieldLabel>
                                                <Input
                                                    id="admin-lastname"
                                                    value={data.admin.lastname}
                                                    onChange={(e) => {
                                                        setNestedData(
                                                            'admin',
                                                            'lastname',
                                                            e.target.value,
                                                        );
                                                        clearErrors(
                                                            'admin.lastname' as any,
                                                        );
                                                    }}
                                                />
                                                {getError('admin.lastname') && (
                                                    <FieldError>
                                                        {getError(
                                                            'admin.lastname',
                                                        )}
                                                    </FieldError>
                                                )}
                                            </Field>
                                        </div>
                                        <Field
                                            data-invalid={
                                                !!getError('admin.email')
                                            }
                                        >
                                            <FieldLabel htmlFor="admin-email">
                                                Email Address
                                            </FieldLabel>
                                            <Input
                                                id="admin-email"
                                                type="email"
                                                value={data.admin.email}
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'admin',
                                                        'email',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'admin.email' as any,
                                                    );
                                                }}
                                                required
                                            />
                                            {getError('admin.email') && (
                                                <FieldError>
                                                    {getError('admin.email')}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <Field
                                            data-invalid={
                                                !!getError('admin.username')
                                            }
                                        >
                                            <FieldLabel htmlFor="admin-username">
                                                Username
                                            </FieldLabel>
                                            <Input
                                                id="admin-username"
                                                value={data.admin.username}
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'admin',
                                                        'username',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'admin.username' as any,
                                                    );
                                                }}
                                                required
                                            />
                                            {getError('admin.username') && (
                                                <FieldError>
                                                    {getError('admin.username')}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field
                                                data-invalid={
                                                    !!getError('admin.password')
                                                }
                                            >
                                                <FieldLabel htmlFor="admin-password">
                                                    Password
                                                </FieldLabel>
                                                <Input
                                                    id="admin-password"
                                                    type="password"
                                                    value={data.admin.password}
                                                    onChange={(e) => {
                                                        setNestedData(
                                                            'admin',
                                                            'password',
                                                            e.target.value,
                                                        );
                                                        clearErrors(
                                                            'admin.password' as any,
                                                        );
                                                    }}
                                                    required
                                                />
                                                {getError('admin.password') && (
                                                    <FieldError>
                                                        {getError(
                                                            'admin.password',
                                                        )}
                                                    </FieldError>
                                                )}
                                            </Field>
                                            <Field
                                                data-invalid={
                                                    !!getError(
                                                        'admin.password_confirmation',
                                                    )
                                                }
                                            >
                                                <FieldLabel htmlFor="admin-password-confirm">
                                                    Confirm Password
                                                </FieldLabel>
                                                <Input
                                                    id="admin-password-confirm"
                                                    type="password"
                                                    value={
                                                        data.admin
                                                            .password_confirmation
                                                    }
                                                    onChange={(e) => {
                                                        setNestedData(
                                                            'admin',
                                                            'password_confirmation',
                                                            e.target.value,
                                                        );
                                                        clearErrors(
                                                            'admin.password_confirmation' as any,
                                                        );
                                                    }}
                                                    required
                                                />
                                                {getError(
                                                    'admin.password_confirmation',
                                                ) && (
                                                    <FieldError>
                                                        {getError(
                                                            'admin.password_confirmation',
                                                        )}
                                                    </FieldError>
                                                )}
                                            </Field>
                                        </div>
                                        {data.admin.password &&
                                            data.admin.password_confirmation &&
                                            data.admin.password !==
                                                data.admin
                                                    .password_confirmation && (
                                                <p className="text-sm text-red-600">
                                                    Passwords do not match.
                                                </p>
                                            )}
                                    </FieldGroup>
                                </CardContent>
                            </>
                        )}

                        {/* Step 2: Institution */}
                        {step === 2 && (
                            <>
                                <CardHeader>
                                    <CardTitle>Institution</CardTitle>
                                    <CardDescription>
                                        Set up the first institution. Journals
                                        are organized under institutions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <Field
                                            data-invalid={
                                                !!getError('institution.name')
                                            }
                                        >
                                            <FieldLabel htmlFor="inst-name">
                                                Institution Name
                                            </FieldLabel>
                                            <Input
                                                id="inst-name"
                                                value={data.institution.name}
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'institution',
                                                        'name',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'institution.name' as any,
                                                    );
                                                }}
                                                placeholder="e.g. University of Science"
                                                required
                                            />
                                            {getError('institution.name') && (
                                                <FieldError>
                                                    {getError(
                                                        'institution.name',
                                                    )}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field
                                                data-invalid={
                                                    !!getError(
                                                        'institution.abbreviation',
                                                    )
                                                }
                                            >
                                                <FieldLabel htmlFor="inst-abbr">
                                                    Abbreviation
                                                </FieldLabel>
                                                <Input
                                                    id="inst-abbr"
                                                    value={
                                                        data.institution
                                                            .abbreviation
                                                    }
                                                    onChange={(e) => {
                                                        setNestedData(
                                                            'institution',
                                                            'abbreviation',
                                                            e.target.value,
                                                        );
                                                        clearErrors(
                                                            'institution.abbreviation' as any,
                                                        );
                                                    }}
                                                    placeholder="e.g. UoS"
                                                />
                                                {getError(
                                                    'institution.abbreviation',
                                                ) && (
                                                    <FieldError>
                                                        {getError(
                                                            'institution.abbreviation',
                                                        )}
                                                    </FieldError>
                                                )}
                                            </Field>
                                            <Field
                                                data-invalid={
                                                    !!getError(
                                                        'institution.contact_email',
                                                    )
                                                }
                                            >
                                                <FieldLabel htmlFor="inst-email">
                                                    Contact Email
                                                </FieldLabel>
                                                <Input
                                                    id="inst-email"
                                                    type="email"
                                                    value={
                                                        data.institution
                                                            .contact_email
                                                    }
                                                    onChange={(e) => {
                                                        setNestedData(
                                                            'institution',
                                                            'contact_email',
                                                            e.target.value,
                                                        );
                                                        clearErrors(
                                                            'institution.contact_email' as any,
                                                        );
                                                    }}
                                                    placeholder="contact@university.edu"
                                                />
                                                {getError(
                                                    'institution.contact_email',
                                                ) && (
                                                    <FieldError>
                                                        {getError(
                                                            'institution.contact_email',
                                                        )}
                                                    </FieldError>
                                                )}
                                            </Field>
                                        </div>
                                        <Field
                                            data-invalid={
                                                !!getError(
                                                    'institution.website',
                                                )
                                            }
                                        >
                                            <FieldLabel htmlFor="inst-website">
                                                Website
                                            </FieldLabel>
                                            <Input
                                                id="inst-website"
                                                type="url"
                                                value={data.institution.website}
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'institution',
                                                        'website',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'institution.website' as any,
                                                    );
                                                }}
                                                placeholder="https://university.edu"
                                            />
                                            {getError(
                                                'institution.website',
                                            ) && (
                                                <FieldError>
                                                    {getError(
                                                        'institution.website',
                                                    )}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <Field
                                            data-invalid={
                                                !!getError(
                                                    'institution.address',
                                                )
                                            }
                                        >
                                            <FieldLabel htmlFor="inst-address">
                                                Address
                                            </FieldLabel>
                                            <Textarea
                                                id="inst-address"
                                                value={data.institution.address}
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'institution',
                                                        'address',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'institution.address' as any,
                                                    );
                                                }}
                                                placeholder="123 University Avenue, City, Country"
                                                rows={2}
                                            />
                                            {getError(
                                                'institution.address',
                                            ) && (
                                                <FieldError>
                                                    {getError(
                                                        'institution.address',
                                                    )}
                                                </FieldError>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </>
                        )}

                        {/* Step 3: Journal */}
                        {step === 3 && (
                            <>
                                <CardHeader>
                                    <CardTitle>First Journal</CardTitle>
                                    <CardDescription>
                                        Create the first journal. You can add
                                        more journals later from the admin
                                        panel.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <Field
                                            data-invalid={
                                                !!getError('journal.name')
                                            }
                                        >
                                            <FieldLabel htmlFor="journal-name">
                                                Journal Name
                                            </FieldLabel>
                                            <Input
                                                id="journal-name"
                                                value={data.journal.name}
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'journal',
                                                        'name',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'journal.name' as any,
                                                    );
                                                }}
                                                placeholder="e.g. Journal of Computer Science"
                                                required
                                            />
                                            {getError('journal.name') && (
                                                <FieldError>
                                                    {getError('journal.name')}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <Field
                                            data-invalid={
                                                !!getError(
                                                    'journal.abbreviation',
                                                )
                                            }
                                        >
                                            <FieldLabel htmlFor="journal-abbr">
                                                Abbreviation
                                            </FieldLabel>
                                            <Input
                                                id="journal-abbr"
                                                value={
                                                    data.journal.abbreviation
                                                }
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'journal',
                                                        'abbreviation',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'journal.abbreviation' as any,
                                                    );
                                                }}
                                                placeholder="e.g. JCS"
                                                required
                                            />
                                            <FieldDescription>
                                                Used for the journal's URL slug
                                                and short references.
                                            </FieldDescription>
                                            {getError(
                                                'journal.abbreviation',
                                            ) && (
                                                <FieldError>
                                                    {getError(
                                                        'journal.abbreviation',
                                                    )}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <Field
                                            data-invalid={
                                                !!getError(
                                                    'journal.description',
                                                )
                                            }
                                        >
                                            <FieldLabel htmlFor="journal-desc">
                                                Description
                                            </FieldLabel>
                                            <Textarea
                                                id="journal-desc"
                                                value={data.journal.description}
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'journal',
                                                        'description',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'journal.description' as any,
                                                    );
                                                }}
                                                placeholder="Brief description of the journal's scope and focus..."
                                                rows={3}
                                            />
                                            {getError(
                                                'journal.description',
                                            ) && (
                                                <FieldError>
                                                    {getError(
                                                        'journal.description',
                                                    )}
                                                </FieldError>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </>
                        )}

                        {/* Step 4: Platform Settings */}
                        {step === 4 && (
                            <>
                                <CardHeader>
                                    <CardTitle>Platform Settings</CardTitle>
                                    <CardDescription>
                                        Configure your platform's identity.
                                        These can be changed later in the admin
                                        panel.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <Field
                                            data-invalid={
                                                !!getError(
                                                    'platform.platform_name',
                                                )
                                            }
                                        >
                                            <FieldLabel htmlFor="platform-name">
                                                Platform Name
                                            </FieldLabel>
                                            <Input
                                                id="platform-name"
                                                value={
                                                    data.platform.platform_name
                                                }
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'platform',
                                                        'platform_name',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'platform.platform_name' as any,
                                                    );
                                                }}
                                                placeholder="e.g. MyJournals"
                                                required
                                            />
                                            {getError(
                                                'platform.platform_name',
                                            ) && (
                                                <FieldError>
                                                    {getError(
                                                        'platform.platform_name',
                                                    )}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <Field
                                            data-invalid={
                                                !!getError(
                                                    'platform.platform_tagline',
                                                )
                                            }
                                        >
                                            <FieldLabel htmlFor="platform-tagline">
                                                Tagline
                                            </FieldLabel>
                                            <Input
                                                id="platform-tagline"
                                                value={
                                                    data.platform
                                                        .platform_tagline
                                                }
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'platform',
                                                        'platform_tagline',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'platform.platform_tagline' as any,
                                                    );
                                                }}
                                                placeholder="e.g. Open Access Research Publishing"
                                            />
                                            {getError(
                                                'platform.platform_tagline',
                                            ) && (
                                                <FieldError>
                                                    {getError(
                                                        'platform.platform_tagline',
                                                    )}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <Field
                                            data-invalid={
                                                !!getError(
                                                    'platform.platform_description',
                                                )
                                            }
                                        >
                                            <FieldLabel htmlFor="platform-desc">
                                                Description
                                            </FieldLabel>
                                            <Textarea
                                                id="platform-desc"
                                                value={
                                                    data.platform
                                                        .platform_description
                                                }
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'platform',
                                                        'platform_description',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'platform.platform_description' as any,
                                                    );
                                                }}
                                                placeholder="Describe your platform..."
                                                rows={3}
                                            />
                                            {getError(
                                                'platform.platform_description',
                                            ) && (
                                                <FieldError>
                                                    {getError(
                                                        'platform.platform_description',
                                                    )}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <Field
                                            data-invalid={
                                                !!getError(
                                                    'platform.admin_email',
                                                )
                                            }
                                        >
                                            <FieldLabel htmlFor="platform-email">
                                                Admin Contact Email
                                            </FieldLabel>
                                            <Input
                                                id="platform-email"
                                                type="email"
                                                value={
                                                    data.platform.admin_email
                                                }
                                                onChange={(e) => {
                                                    setNestedData(
                                                        'platform',
                                                        'admin_email',
                                                        e.target.value,
                                                    );
                                                    clearErrors(
                                                        'platform.admin_email' as any,
                                                    );
                                                }}
                                                placeholder="admin@platform.com"
                                            />
                                            <FieldDescription>
                                                If left blank, the admin account
                                                email will be used.
                                            </FieldDescription>
                                            {getError(
                                                'platform.admin_email',
                                            ) && (
                                                <FieldError>
                                                    {getError(
                                                        'platform.admin_email',
                                                    )}
                                                </FieldError>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </>
                        )}

                        {/* Step 5: Review & Install */}
                        {step === 5 && (
                            <>
                                <CardHeader>
                                    <CardTitle>Review & Install</CardTitle>
                                    <CardDescription>
                                        Review your configuration before
                                        completing the installation.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* Admin summary */}
                                        <div>
                                            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                                <Shield className="size-4" />{' '}
                                                Admin Account
                                            </h3>
                                            <div className="rounded-lg bg-muted p-3 text-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Name:
                                                        </span>{' '}
                                                        {data.admin.firstname}{' '}
                                                        {data.admin.lastname}
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Username:
                                                        </span>{' '}
                                                        {data.admin.username}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-muted-foreground">
                                                            Email:
                                                        </span>{' '}
                                                        {data.admin.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Institution summary */}
                                        <div>
                                            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                                <Building2 className="size-4" />{' '}
                                                Institution
                                            </h3>
                                            <div className="rounded-lg bg-muted p-3 text-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="col-span-2">
                                                        <span className="text-muted-foreground">
                                                            Name:
                                                        </span>{' '}
                                                        {data.institution.name}
                                                        {data.institution
                                                            .abbreviation && (
                                                            <span className="text-muted-foreground">
                                                                {' '}
                                                                (
                                                                {
                                                                    data
                                                                        .institution
                                                                        .abbreviation
                                                                }
                                                                )
                                                            </span>
                                                        )}
                                                    </div>
                                                    {data.institution
                                                        .contact_email && (
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Email:
                                                            </span>{' '}
                                                            {
                                                                data.institution
                                                                    .contact_email
                                                            }
                                                        </div>
                                                    )}
                                                    {data.institution
                                                        .website && (
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Website:
                                                            </span>{' '}
                                                            {
                                                                data.institution
                                                                    .website
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Journal summary */}
                                        <div>
                                            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                                <BookOpen className="size-4" />{' '}
                                                Journal
                                            </h3>
                                            <div className="rounded-lg bg-muted p-3 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Name:
                                                    </span>{' '}
                                                    {data.journal.name}
                                                    <span className="text-muted-foreground">
                                                        {' '}
                                                        (
                                                        {
                                                            data.journal
                                                                .abbreviation
                                                        }
                                                        )
                                                    </span>
                                                </div>
                                                {data.journal.description && (
                                                    <div className="mt-1">
                                                        <span className="text-muted-foreground">
                                                            Description:
                                                        </span>{' '}
                                                        {
                                                            data.journal
                                                                .description
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Platform summary */}
                                        <div>
                                            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                                <Settings className="size-4" />{' '}
                                                Platform
                                            </h3>
                                            <div className="rounded-lg bg-muted p-3 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Name:
                                                    </span>{' '}
                                                    {
                                                        data.platform
                                                            .platform_name
                                                    }
                                                </div>
                                                {data.platform
                                                    .platform_tagline && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Tagline:
                                                        </span>{' '}
                                                        {
                                                            data.platform
                                                                .platform_tagline
                                                        }
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Admin Email:
                                                    </span>{' '}
                                                    {data.platform
                                                        .admin_email ||
                                                        data.admin.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex items-center justify-between border-t px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrev}
                                disabled={step === 0}
                            >
                                <ChevronLeft className="mr-1 size-4" />
                                Back
                            </Button>

                            {step < STEPS.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                >
                                    Next
                                    <ChevronRight className="ml-1 size-4" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={processing}>
                                    <Rocket className="mr-1 size-4" />
                                    {processing
                                        ? 'Installing...'
                                        : 'Complete Installation'}
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <p className="text-center text-xs text-muted-foreground">
                    This wizard will create the initial configuration for your
                    platform. All settings can be modified later through the
                    admin panel.
                </p>
            </div>
        </div>
    );
}
