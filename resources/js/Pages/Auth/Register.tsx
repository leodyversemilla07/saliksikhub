import { FormEventHandler, useCallback, memo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Breadcrumb } from '@/components/breadcrumb';
import { PageProps } from '@/types';
import Header from '@/components/site-header';
import Footer from '@/components/site-footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
                {options.map((option) => (
                    <SelectItem key={option.code} value={option.name}>{option.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
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

    const countries: Country[] = [
        { code: 'AFG', name: 'Afghanistan' },
        { code: 'ALB', name: 'Albania' },
        { code: 'DZA', name: 'Algeria' },
        { code: 'AND', name: 'Andorra' },
        { code: 'AGO', name: 'Angola' },
        { code: 'ATG', name: 'Antigua and Barbuda' },
        { code: 'ARG', name: 'Argentina' },
        { code: 'ARM', name: 'Armenia' },
        { code: 'AUS', name: 'Australia' },
        { code: 'AUT', name: 'Austria' },
        { code: 'AZE', name: 'Azerbaijan' },
        { code: 'BHS', name: 'Bahamas' },
        { code: 'BHR', name: 'Bahrain' },
        { code: 'BGD', name: 'Bangladesh' },
        { code: 'BRB', name: 'Barbados' },
        { code: 'BLR', name: 'Belarus' },
        { code: 'BEL', name: 'Belgium' },
        { code: 'BLZ', name: 'Belize' },
        { code: 'BEN', name: 'Benin' },
        { code: 'BTN', name: 'Bhutan' },
        { code: 'BOL', name: 'Bolivia' },
        { code: 'BIH', name: 'Bosnia and Herzegovina' },
        { code: 'BWA', name: 'Botswana' },
        { code: 'BRA', name: 'Brazil' },
        { code: 'BRN', name: 'Brunei' },
        { code: 'BGR', name: 'Bulgaria' },
        { code: 'BFA', name: 'Burkina Faso' },
        { code: 'BDI', name: 'Burundi' },
        { code: 'KHM', name: 'Cambodia' },
        { code: 'CMR', name: 'Cameroon' },
        { code: 'CAN', name: 'Canada' },
        { code: 'CPV', name: 'Cape Verde' },
        { code: 'CAF', name: 'Central African Republic' },
        { code: 'TCD', name: 'Chad' },
        { code: 'CHL', name: 'Chile' },
        { code: 'CHN', name: 'China' },
        { code: 'COL', name: 'Colombia' },
        { code: 'COM', name: 'Comoros' },
        { code: 'COG', name: 'Congo' },
        { code: 'COD', name: 'Congo (Democratic Republic)' },
        { code: 'CRI', name: 'Costa Rica' },
        { code: 'CIV', name: 'Côte d\'Ivoire' },
        { code: 'HRV', name: 'Croatia' },
        { code: 'CUB', name: 'Cuba' },
        { code: 'CYP', name: 'Cyprus' },
        { code: 'CZE', name: 'Czech Republic' },
        { code: 'DNK', name: 'Denmark' },
        { code: 'DJI', name: 'Djibouti' },
        { code: 'DMA', name: 'Dominica' },
        { code: 'DOM', name: 'Dominican Republic' },
        { code: 'ECU', name: 'Ecuador' },
        { code: 'EGY', name: 'Egypt' },
        { code: 'SLV', name: 'El Salvador' },
        { code: 'GNQ', name: 'Equatorial Guinea' },
        { code: 'ERI', name: 'Eritrea' },
        { code: 'EST', name: 'Estonia' },
        { code: 'SWZ', name: 'Eswatini' },
        { code: 'ETH', name: 'Ethiopia' },
        { code: 'FJI', name: 'Fiji' },
        { code: 'FIN', name: 'Finland' },
        { code: 'FRA', name: 'France' },
        { code: 'GAB', name: 'Gabon' },
        { code: 'GMB', name: 'Gambia' },
        { code: 'GEO', name: 'Georgia' },
        { code: 'DEU', name: 'Germany' },
        { code: 'GHA', name: 'Ghana' },
        { code: 'GRC', name: 'Greece' },
        { code: 'GRD', name: 'Grenada' },
        { code: 'GTM', name: 'Guatemala' },
        { code: 'GIN', name: 'Guinea' },
        { code: 'GNB', name: 'Guinea-Bissau' },
        { code: 'GUY', name: 'Guyana' },
        { code: 'HTI', name: 'Haiti' },
        { code: 'HND', name: 'Honduras' },
        { code: 'HUN', name: 'Hungary' },
        { code: 'ISL', name: 'Iceland' },
        { code: 'IND', name: 'India' },
        { code: 'IDN', name: 'Indonesia' },
        { code: 'IRN', name: 'Iran' },
        { code: 'IRQ', name: 'Iraq' },
        { code: 'IRL', name: 'Ireland' },
        { code: 'ISR', name: 'Israel' },
        { code: 'ITA', name: 'Italy' },
        { code: 'JAM', name: 'Jamaica' },
        { code: 'JPN', name: 'Japan' },
        { code: 'JOR', name: 'Jordan' },
        { code: 'KAZ', name: 'Kazakhstan' },
        { code: 'KEN', name: 'Kenya' },
        { code: 'KIR', name: 'Kiribati' },
        { code: 'PRK', name: 'Korea (North)' },
        { code: 'KOR', name: 'Korea (South)' },
        { code: 'KWT', name: 'Kuwait' },
        { code: 'KGZ', name: 'Kyrgyzstan' },
        { code: 'LAO', name: 'Laos' },
        { code: 'LVA', name: 'Latvia' },
        { code: 'LBN', name: 'Lebanon' },
        { code: 'LSO', name: 'Lesotho' },
        { code: 'LBR', name: 'Liberia' },
        { code: 'LBY', name: 'Libya' },
        { code: 'LIE', name: 'Liechtenstein' },
        { code: 'LTU', name: 'Lithuania' },
        { code: 'LUX', name: 'Luxembourg' },
        { code: 'MDG', name: 'Madagascar' },
        { code: 'MWI', name: 'Malawi' },
        { code: 'MYS', name: 'Malaysia' },
        { code: 'MDV', name: 'Maldives' },
        { code: 'MLI', name: 'Mali' },
        { code: 'MLT', name: 'Malta' },
        { code: 'MHL', name: 'Marshall Islands' },
        { code: 'MRT', name: 'Mauritania' },
        { code: 'MUS', name: 'Mauritius' },
        { code: 'MEX', name: 'Mexico' },
        { code: 'FSM', name: 'Micronesia' },
        { code: 'MDA', name: 'Moldova' },
        { code: 'MCO', name: 'Monaco' },
        { code: 'MNG', name: 'Mongolia' },
        { code: 'MNE', name: 'Montenegro' },
        { code: 'MAR', name: 'Morocco' },
        { code: 'MOZ', name: 'Mozambique' },
        { code: 'MMR', name: 'Myanmar' },
        { code: 'NAM', name: 'Namibia' },
        { code: 'NRU', name: 'Nauru' },
        { code: 'NPL', name: 'Nepal' },
        { code: 'NLD', name: 'Netherlands' },
        { code: 'NZL', name: 'New Zealand' },
        { code: 'NIC', name: 'Nicaragua' },
        { code: 'NER', name: 'Niger' },
        { code: 'NGA', name: 'Nigeria' },
        { code: 'MKD', name: 'North Macedonia' },
        { code: 'NOR', name: 'Norway' },
        { code: 'OMN', name: 'Oman' },
        { code: 'PAK', name: 'Pakistan' },
        { code: 'PLW', name: 'Palau' },
        { code: 'PSE', name: 'Palestine' },
        { code: 'PAN', name: 'Panama' },
        { code: 'PNG', name: 'Papua New Guinea' },
        { code: 'PRY', name: 'Paraguay' },
        { code: 'PER', name: 'Peru' },
        { code: 'PHL', name: 'Philippines' },
        { code: 'POL', name: 'Poland' },
        { code: 'PRT', name: 'Portugal' },
        { code: 'QAT', name: 'Qatar' },
        { code: 'ROU', name: 'Romania' },
        { code: 'RUS', name: 'Russia' },
        { code: 'RWA', name: 'Rwanda' },
        { code: 'KNA', name: 'Saint Kitts and Nevis' },
        { code: 'LCA', name: 'Saint Lucia' },
        { code: 'VCT', name: 'Saint Vincent and the Grenadines' },
        { code: 'WSM', name: 'Samoa' },
        { code: 'SMR', name: 'San Marino' },
        { code: 'STP', name: 'São Tomé and Príncipe' },
        { code: 'SAU', name: 'Saudi Arabia' },
        { code: 'SEN', name: 'Senegal' },
        { code: 'SRB', name: 'Serbia' },
        { code: 'SYC', name: 'Seychelles' },
        { code: 'SLE', name: 'Sierra Leone' },
        { code: 'SGP', name: 'Singapore' },
        { code: 'SVK', name: 'Slovakia' },
        { code: 'SVN', name: 'Slovenia' },
        { code: 'SLB', name: 'Solomon Islands' },
        { code: 'SOM', name: 'Somalia' },
        { code: 'ZAF', name: 'South Africa' },
        { code: 'SSD', name: 'South Sudan' },
        { code: 'ESP', name: 'Spain' },
        { code: 'LKA', name: 'Sri Lanka' },
        { code: 'SDN', name: 'Sudan' },
        { code: 'SUR', name: 'Suriname' },
        { code: 'SWE', name: 'Sweden' },
        { code: 'CHE', name: 'Switzerland' },
        { code: 'SYR', name: 'Syria' },
        { code: 'TWN', name: 'Taiwan' },
        { code: 'TJK', name: 'Tajikistan' },
        { code: 'TZA', name: 'Tanzania' },
        { code: 'THA', name: 'Thailand' },
        { code: 'TLS', name: 'Timor-Leste' },
        { code: 'TGO', name: 'Togo' },
        { code: 'TON', name: 'Tonga' },
        { code: 'TTO', name: 'Trinidad and Tobago' },
        { code: 'TUN', name: 'Tunisia' },
        { code: 'TUR', name: 'Turkey' },
        { code: 'TKM', name: 'Turkmenistan' },
        { code: 'TUV', name: 'Tuvalu' },
        { code: 'UGA', name: 'Uganda' },
        { code: 'UKR', name: 'Ukraine' },
        { code: 'ARE', name: 'United Arab Emirates' },
        { code: 'GBR', name: 'United Kingdom' },
        { code: 'USA', name: 'United States' },
        { code: 'URY', name: 'Uruguay' },
        { code: 'UZB', name: 'Uzbekistan' },
        { code: 'VUT', name: 'Vanuatu' },
        { code: 'VAT', name: 'Vatican City' },
        { code: 'VEN', name: 'Venezuela' },
        { code: 'VNM', name: 'Vietnam' },
        { code: 'YEM', name: 'Yemen' },
        { code: 'ZMB', name: 'Zambia' },
        { code: 'ZWE', name: 'Zimbabwe' }
    ];

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
