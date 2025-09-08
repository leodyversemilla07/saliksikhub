import { FormEventHandler, useCallback, memo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getData } from 'country-list';

interface Country {
    code: string;
    name: string;
}

const TextInput = ({ id, label, type = 'text', value, onChange, placeholder, error, required = false }: {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    error?: string;
    required?: boolean;
}) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-card-foreground font-medium">{label} {required && '*'}</Label>
        <Input
            id={id}
            type={type}
            value={value}
            className={`w-full bg-input border border-input focus:border-ring focus:ring-ring rounded-md transition-colors ${error ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
);

const SelectInput = memo(({ id, label, value, onChange, options, error, required = false }: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { code: string; name: string }[];
    error?: string;
    required?: boolean;
}) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-card-foreground font-medium">{label} {required && '*'}</Label>
        <Select
            value={value}
            onValueChange={onChange}
            required={required}
        >
            <SelectTrigger className={`w-full bg-input border border-input focus:border-ring focus:ring-ring rounded-md transition-colors ${error ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}>
                <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.code} value={option.name}>{option.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
));

const CheckboxInput = ({ id, label, checked, onChange }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) => (
    <div className="flex items-center space-x-2">
        <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={(checked) => onChange(checked as boolean)}
            className="h-4 w-4 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary focus:ring-ring"
        />
        <Label htmlFor={id} className="text-sm text-muted-foreground">{label}</Label>
    </div>
);

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<{
        firstname: string;
        lastname: string;
        email: string;
        affiliation: string;
        country: string;
        username: string;
        password: string;
        password_confirmation: string;
        data_collection: boolean;
        notifications: boolean;
        review_requests: boolean;
    }>({
        firstname: '',
        lastname: '',
        email: '',
        affiliation: '',
        country: '',
        username: '',
        password: '',
        password_confirmation: '',
        data_collection: false,
        notifications: false,
        review_requests: false,
    });

    const countries: Country[] = getData().map(({ code, name }) => ({ code, name }));

    const handleCountryChange = useCallback((value: string) => {
        setData('country', value);
    }, [setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Create Account | Daluyang Dunong" />

            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        Create Account
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join our academic community
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Required fields are marked with an asterisk (*).
                    </p>
                </div>

                <div className="bg-card py-8 px-6 shadow-xl rounded-lg border border-border">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextInput
                                id="firstname"
                                label="Given Name"
                                value={data.firstname}
                                onChange={(e) => setData('firstname', e.target.value)}
                                placeholder="John"
                                error={errors.firstname}
                                required
                            />

                            <TextInput
                                id="lastname"
                                label="Family Name"
                                value={data.lastname}
                                onChange={(e) => setData('lastname', e.target.value)}
                                placeholder="Doe"
                                error={errors.lastname}
                            />
                        </div>

                        <TextInput
                            id="affiliation"
                            label="Affiliation"
                            value={data.affiliation}
                            onChange={(e) => setData('affiliation', e.target.value)}
                            placeholder="University or Organization"
                            error={errors.affiliation}
                            required
                        />

                        <SelectInput
                            id="country"
                            label="Country"
                            value={data.country}
                            onChange={handleCountryChange}
                            options={countries}
                            error={errors.country}
                            required
                        />

                        <TextInput
                            id="email"
                            label="Email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="your.email@example.com"
                            error={errors.email}
                            required
                        />

                        <TextInput
                            id="username"
                            label="Username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Username"
                            error={errors.username}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextInput
                                id="password"
                                label="Password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                error={errors.password}
                                required
                            />

                            <TextInput
                                id="password_confirmation"
                                label="Repeat Password"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                error={errors.password_confirmation}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="privacy_options" className="text-card-foreground font-medium">Privacy Options</Label>
                            <div className="space-y-3">
                                <CheckboxInput
                                    id="data_collection"
                                    label="I agree to data collection"
                                    checked={data.data_collection}
                                    onChange={(checked) => setData('data_collection', checked)}
                                />
                                <CheckboxInput
                                    id="notifications"
                                    label="I want to receive notifications"
                                    checked={data.notifications}
                                    onChange={(checked) => setData('notifications', checked)}
                                />
                                <CheckboxInput
                                    id="review_requests"
                                    label="I am open to review requests"
                                    checked={data.review_requests}
                                    onChange={(checked) => setData('review_requests', checked)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-md transition-colors shadow-sm"
                            disabled={processing}
                        >
                            {processing ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
