import { useState, FormEventHandler, useEffect, useCallback, memo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Breadcrumb } from '@/components/breadcrumb';
import { PageProps } from '@/types';
import Header from '@/components/landing-pages/site-header';
import Footer from '@/components/landing-pages/site-footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Fixed implicit 'any' type and property errors by defining the type for countries
interface Country {
    code: string;
    name: string;
}

// TextInput Component
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
        <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">{label} {required && '*'}</Label>
        <Input
            id={id}
            type={type}
            value={value}
            className={`w-96 border-gray-300 dark:border-gray-600 focus:border-[#18652c] focus:ring-[#18652c] dark:focus:border-[#3fb65e] dark:focus:ring-[#3fb65e] rounded-md dark:bg-gray-700 dark:text-white ${error ? 'border-red-500 dark:border-red-400' : ''}`}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
        />
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
);

// SelectInput Component
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
        <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">{label} {required && '*'}</Label>
        <Select
            value={value}
            onValueChange={onChange}
            required={required}
        >
            <SelectTrigger className={`w-96 border-gray-300 dark:border-gray-600 focus:border-[#18652c] focus:ring-[#18652c] dark:focus:border-[#3fb65e] dark:focus:ring-[#3fb65e] rounded-md dark:bg-gray-700 dark:text-white ${error ? 'border-red-500 dark:border-red-400' : ''}`}>
                <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
                {/* It's good practice to also memoize SelectItem if it were a custom component and complex, 
                    but here it's from shadcn/ui and likely optimized. The key is to prevent SelectInput 
                    from re-rendering unnecessarily, which then prevents this map from re-running. */}
                {options.map((option) => (
                    <SelectItem key={option.code} value={option.name}>{option.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
));

// CheckboxInput Component
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
            className="h-4 w-4 text-[#18652c] focus:ring-[#18652c] border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:focus:ring-[#3fb65e] dark:data-[state=checked]:bg-[#3fb65e] dark:data-[state=checked]:border-[#3fb65e]"
        />
        <Label htmlFor={id} className="text-sm text-gray-600 dark:text-gray-400">{label}</Label>
    </div>
);

export default function Register({ auth }: PageProps) {
    const breadcrumbItems = [
        { label: 'Home', href: route('home') },
        { label: 'Register' }
    ];

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

    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        // The API call to fetch countries runs once on component mount.
        // If this fetch is slow, consider bundling a static list of countries with your app
        // or caching the response in localStorage for a faster initial load.
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(apiData => { // Renamed data to apiData to avoid conflict with useForm's data
                const countryList: Country[] = apiData.map((country: { cca3: string; name: { common: string } }) => ({
                    code: country.cca3,
                    name: country.name.common,
                })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
                setCountries(countryList);
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const handleCountryChange = useCallback((value: string) => {
        setData('country', value);
    }, [setData]); // setData from useForm is generally stable

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Head title="Create Account | Daluyang Dunong" />
            <Header auth={auth} />

            <main className="flex-grow bg-gray-100 dark:bg-gray-900 flex items-center justify-center pt-12 pb-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mb-8 text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
                            Register
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Required fields are marked with an asterisk (*).
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 text-left">
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
                            onChange={handleCountryChange} // Use the memoized callback
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

                        <div className="space-y-2">
                            <Label htmlFor="privacy_options" className="text-gray-700 dark:text-gray-300">Privacy Options</Label>
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

                        <Button type="submit" className="w-auto bg-[#18652c] hover:bg-[#18652c]/90 text-white">
                            {processing ? 'Processing...' : 'Register'}
                        </Button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}