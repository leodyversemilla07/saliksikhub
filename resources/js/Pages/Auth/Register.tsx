import { useState, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Building, Book, Lock, AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { PageProps } from '@/types';
import Header from '@/components/landing-pages/site-header';
import Footer from '@/components/landing-pages/site-footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Register({ auth }: PageProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<{
        firstname: string;
        lastname: string;
        email: string;
        affiliation: string;
        password: string;
        password_confirmation: string;
        agreesToTerms: boolean;
    }>({
        firstname: '',
        lastname: '',
        email: '',
        affiliation: '',
        password: '',
        password_confirmation: '',
        agreesToTerms: false
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create Account" />
            <Header auth={auth} />

            <main className="flex-grow bg-white">
                {/* Academic-style header */}
                <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Create Your Account</h1>
                            <p className="text-xl text-gray-600">
                                Join the MinSU Research Journal community to submit manuscripts, participate in peer reviews,
                                and access exclusive academic resources.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Registration form */}
                        <div className="w-full lg:w-1/2 max-w-xl mx-auto">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center">
                                        <div className="p-2 bg-[#18652c]/10 rounded-md">
                                            <User className="h-6 w-6 text-[#18652c]" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 ml-3">Register</h2>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstname">First Name</Label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="firstname"
                                                        type="text"
                                                        value={data.firstname}
                                                        className={`pl-10 ${errors.firstname ? 'border-red-500' : ''}`}
                                                        placeholder="John"
                                                        onChange={(e) => setData('firstname', e.target.value)}
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                                {errors.firstname && <p className="text-sm text-red-600">{errors.firstname}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="lastname">Last Name</Label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="lastname"
                                                        type="text"
                                                        value={data.lastname}
                                                        className={`pl-10 ${errors.lastname ? 'border-red-500' : ''}`}
                                                        placeholder="Doe"
                                                        onChange={(e) => setData('lastname', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {errors.lastname && <p className="text-sm text-red-600">{errors.lastname}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                                    placeholder="your.email@example.com"
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="affiliation">Institutional Affiliation</Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Building className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Input
                                                    id="affiliation"
                                                    type="text"
                                                    value={data.affiliation}
                                                    className={`pl-10 ${errors.affiliation ? 'border-red-500' : ''}`}
                                                    placeholder="University or Organization"
                                                    onChange={(e) => setData('affiliation', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {errors.affiliation && <p className="text-sm text-red-600">{errors.affiliation}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="password">Password</Label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={data.password}
                                                        className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                                        placeholder="••••••••"
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#18652c]"
                                                        tabIndex={-1}
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="password_confirmation"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        value={data.password_confirmation}
                                                        className={`pl-10 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                                        placeholder="••••••••"
                                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#18652c]"
                                                        tabIndex={-1}
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="agreesToTerms"
                                                checked={data.agreesToTerms}
                                                onCheckedChange={(checked) => setData('agreesToTerms', checked as boolean)}
                                                className="border-[#18652c] data-[state=checked]:bg-[#18652c] data-[state=checked]:border-[#18652c]"
                                            />
                                            <Label htmlFor="agreesToTerms" className="text-sm text-gray-600">
                                                I agree to the <Link href="/terms" className="text-[#18652c] hover:text-[#145024] font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-[#18652c] hover:text-[#145024] font-medium">Privacy Policy</Link>
                                            </Label>
                                        </div>
                                        {errors.agreesToTerms && <p className="text-sm text-red-600">{errors.agreesToTerms}</p>}

                                        <div className="flex flex-col space-y-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-[#18652c] hover:bg-[#145024] text-white"
                                            >
                                                {processing ? (
                                                    <span className="flex items-center">
                                                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                                        Creating Account...
                                                    </span>
                                                ) : (
                                                    'Create Account'
                                                )}
                                            </Button>

                                            <div className="text-center">
                                                <span className="text-sm text-gray-600">Already have an account?</span>
                                                <Link
                                                    href={route('login')}
                                                    className="ml-1 text-sm text-[#18652c] hover:text-[#145024] font-medium"
                                                >
                                                    Sign in
                                                </Link>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Information section */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-gradient-to-br from-gray-50 to-[#f0f8f3] rounded-xl border border-gray-200 p-8">
                                <div className="flex items-center mb-6">
                                    <Book className="h-8 w-8 text-[#18652c]" />
                                    <h2 className="text-2xl font-bold text-gray-900 ml-3">Account Benefits</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Create an Account?</h3>
                                        <p className="text-gray-600 mb-4">
                                            Your MinSU Research Journal account gives you access to a variety of features
                                            designed to enhance your academic and research experience.
                                        </p>
                                        <ul className="space-y-3 text-gray-600">
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Submit manuscripts for publication consideration</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Participate as a peer reviewer in your area of expertise</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Access exclusive content and resources</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Receive updates on new publications and calls for papers</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-2">
                                                    <CheckCircle className="h-5 w-5 text-[#18652c]" />
                                                </div>
                                                <span>Track your submissions and reviewer activities</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
                                        <div className="flex items-center mb-4">
                                            <AlertCircle className="h-6 w-6 text-[#18652c] mr-2" />
                                            <h3 className="text-base font-semibold text-gray-800">Account Verification</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            After creating your account, you'll receive a verification email to confirm your email address.
                                            Institutional email addresses (e.g., from universities or research organizations) are preferred
                                            and may expedite the verification process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white mt-6 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-800">Need help?</h3>
                                    <Link href={route('contact-us')} className="text-sm text-[#18652c] hover:text-[#145024] font-medium">
                                        Contact support
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </>
    );
}