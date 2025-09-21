import { FormEventHandler, useCallback } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getData } from 'country-list';
import { UserPlus, Mail, Building, MapPin, User, Lock, Eye, EyeOff, Loader2, AlertCircle, Users, Shield, Bell, FileText } from 'lucide-react';
import { useState } from 'react';

interface Country {
    code: string;
    name: string;
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
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
        if (errors.country) {
            clearErrors('country');
        }
    }, [setData, errors.country, clearErrors]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Create Account | Daluyang Dunong" />

            <div className="max-w-2xl w-full">
                <Card className="shadow-xl animate-in fade-in-50 duration-500">
                    <CardHeader className="text-center space-y-4">
                        <Link href={route('home')} className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center group hover:scale-105 transition-transform duration-200">
                            <img
                                src="https://www.daluyangdunong.minsu.edu.ph/img/mrj1.3083946c.png"
                                className="w-12 h-12 object-contain"
                                alt="Research Journal Manager"
                            />
                        </Link>
                        <div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Join Our Community
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Create your account to start your academic journey
                            </CardDescription>
                        </div>
                        <p className="text-xs text-muted-foreground/80">
                            Required fields are marked with an asterisk (*)
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstname" className="font-medium text-sm">
                                            Given Name *
                                        </Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="firstname"
                                                type="text"
                                                value={data.firstname}
                                                className={`w-full pl-10 transition-all duration-200 ${errors.firstname
                                                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                                    : 'focus:border-primary focus:ring-primary/20'
                                                    }`}
                                                placeholder="Enter your given name"
                                                onChange={(e) => {
                                                    setData('firstname', e.target.value);
                                                    if (errors.firstname) {
                                                        clearErrors('firstname');
                                                    }
                                                }}
                                                required
                                                autoComplete="given-name"
                                            />
                                        </div>
                                        {errors.firstname && (
                                            <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>{errors.firstname}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastname" className="font-medium text-sm">
                                            Family Name
                                        </Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="lastname"
                                                type="text"
                                                value={data.lastname}
                                                className={`w-full pl-10 transition-all duration-200 ${errors.lastname
                                                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                                    : 'focus:border-primary focus:ring-primary/20'
                                                    }`}
                                                placeholder="Enter your family name"
                                                onChange={(e) => {
                                                    setData('lastname', e.target.value);
                                                    if (errors.lastname) {
                                                        clearErrors('lastname');
                                                    }
                                                }}
                                                autoComplete="family-name"
                                            />
                                        </div>
                                        {errors.lastname && (
                                            <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>{errors.lastname}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Academic Information Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-foreground">Academic Information</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="affiliation" className="font-medium text-sm">
                                            Affiliation *
                                        </Label>
                                        <div className="relative group">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="affiliation"
                                                type="text"
                                                value={data.affiliation}
                                                className={`w-full pl-10 transition-all duration-200 ${errors.affiliation
                                                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                                    : 'focus:border-primary focus:ring-primary/20'
                                                    }`}
                                                placeholder="University or Organization"
                                                onChange={(e) => {
                                                    setData('affiliation', e.target.value);
                                                    if (errors.affiliation) {
                                                        clearErrors('affiliation');
                                                    }
                                                }}
                                                required
                                                autoComplete="organization"
                                            />
                                        </div>
                                        {errors.affiliation && (
                                            <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>{errors.affiliation}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="font-medium text-sm">
                                            Country *
                                        </Label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                            <Select
                                                value={data.country}
                                                onValueChange={handleCountryChange}
                                                required
                                            >
                                                <SelectTrigger className={`w-full pl-10 transition-all duration-200 ${errors.country
                                                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                                    : 'focus:border-primary focus:ring-primary/20'
                                                    }`}>
                                                    <SelectValue placeholder="Select your country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countries.map((country) => (
                                                        <SelectItem key={country.code} value={country.name}>
                                                            {country.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {errors.country && (
                                            <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>{errors.country}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Account Information Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <UserPlus className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-medium text-sm">
                                            Email Address *
                                        </Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                className={`w-full pl-10 transition-all duration-200 ${errors.email
                                                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                                    : 'focus:border-primary focus:ring-primary/20'
                                                    }`}
                                                placeholder="your.email@example.com"
                                                onChange={(e) => {
                                                    setData('email', e.target.value);
                                                    if (errors.email) {
                                                        clearErrors('email');
                                                    }
                                                }}
                                                required
                                                autoComplete="email"
                                            />
                                        </div>
                                        {errors.email && (
                                            <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>{errors.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="font-medium text-sm">
                                            Username *
                                        </Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="username"
                                                type="text"
                                                value={data.username}
                                                className={`w-full pl-10 transition-all duration-200 ${errors.username
                                                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                                    : 'focus:border-primary focus:ring-primary/20'
                                                    }`}
                                                placeholder="Choose a username"
                                                onChange={(e) => {
                                                    setData('username', e.target.value);
                                                    if (errors.username) {
                                                        clearErrors('username');
                                                    }
                                                }}
                                                required
                                                autoComplete="username"
                                            />
                                        </div>
                                        {errors.username && (
                                            <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>{errors.username}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="font-medium text-sm">
                                                Password *
                                            </Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={data.password}
                                                    className={`w-full pl-10 pr-10 transition-all duration-200 ${errors.password
                                                        ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                                        : 'focus:border-primary focus:ring-primary/20'
                                                        }`}
                                                    placeholder="Create a password"
                                                    onChange={(e) => {
                                                        setData('password', e.target.value);
                                                        if (errors.password) {
                                                            clearErrors('password');
                                                        }
                                                    }}
                                                    required
                                                    autoComplete="new-password"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span>{errors.password}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation" className="font-medium text-sm">
                                                Confirm Password *
                                            </Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={data.password_confirmation}
                                                    className={`w-full pl-10 pr-10 transition-all duration-200 ${errors.password_confirmation
                                                        ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                                        : 'focus:border-primary focus:ring-primary/20'
                                                        }`}
                                                    placeholder="Confirm your password"
                                                    onChange={(e) => {
                                                        setData('password_confirmation', e.target.value);
                                                        if (errors.password_confirmation) {
                                                            clearErrors('password_confirmation');
                                                        }
                                                    }}
                                                    required
                                                    autoComplete="new-password"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password_confirmation && (
                                                <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span>{errors.password_confirmation}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Privacy Options Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-foreground">Privacy & Preferences</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50">
                                        <Checkbox
                                            id="data_collection"
                                            checked={data.data_collection}
                                            onCheckedChange={(checked) => setData('data_collection', checked as boolean)}
                                            className="h-4 w-4 mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            disabled={processing}
                                        />
                                        <div className="flex-1">
                                            <Label htmlFor="data_collection" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Data Collection Consent
                                            </Label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                I agree to the collection and processing of my personal data for research purposes.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50">
                                        <Checkbox
                                            id="notifications"
                                            checked={data.notifications}
                                            onCheckedChange={(checked) => setData('notifications', checked as boolean)}
                                            className="h-4 w-4 mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            disabled={processing}
                                        />
                                        <div className="flex-1">
                                            <Label htmlFor="notifications" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                                <Bell className="h-4 w-4" />
                                                Email Notifications
                                            </Label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Receive updates about new publications, calls for papers, and system announcements.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50">
                                        <Checkbox
                                            id="review_requests"
                                            checked={data.review_requests}
                                            onCheckedChange={(checked) => setData('review_requests', checked as boolean)}
                                            className="h-4 w-4 mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            disabled={processing}
                                        />
                                        <div className="flex-1">
                                            <Label htmlFor="review_requests" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Review Requests
                                            </Label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                I am open to receiving manuscript review requests from editors.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full font-semibold py-3 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Creating your account...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        <span>Create Account</span>
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="text-center pb-6 flex justify-center">
                        <p className="text-sm text-muted-foreground text-center">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
