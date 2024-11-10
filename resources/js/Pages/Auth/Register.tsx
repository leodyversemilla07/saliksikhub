import { useState, ReactNode, FormEventHandler } from 'react';
import { Eye, EyeOff, Globe, Clock, Users } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        firstname: '',
        lastname: '',
        email: '',
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
            <Head title="Register" />
            <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-br from-blue-50 to-gray-100 font-sans">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
                    {/* Registration Form */}
                    <RegistrationForm
                        data={data}
                        setData={setData}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        errors={errors}
                        submit={submit}
                    />

                    {/* Welcome Section */}
                    <WelcomeSection />
                </main>

                {/* Footer */}
                <footer className="text-center mt-16 text-gray-600">
                    <p>&copy; 2024 MinSU Research Journal. All Rights Reserved.</p>
                </footer>
            </div>
        </>
    );
}

// Header Component
function Header() {
    return (
        <header className="flex justify-between items-center p-6 w-full max-w-6xl bg-white rounded-lg shadow-lg mb-12">
            <div className="flex items-center gap-4">
                <img
                    src="https://minsu.edu.ph/template/images/logo.png"
                    alt="MinSU Logo"
                    className="w-10 h-10"
                />
                <span className="text-2xl font-bold text-gray-800">MinSU Research Journal</span>
            </div>
            <div className="flex gap-4 text-gray-600">
                <Globe className="w-6 h-6" />
                <span className="w-6 h-6 cursor-pointer">?</span>
            </div>
        </header>
    );
}

// Registration Form Component
function RegistrationForm({ data, setData, showPassword, setShowPassword, errors, submit }: any) {
    return (
        <div className="w-full md:w-1/2 bg-white p-10 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Your Account</h2>
            <form onSubmit={submit}>
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <InputField
                        id="firstname"
                        label="First Name"
                        placeholder="John"
                        value={data.firstname}
                        setData={setData}
                        fieldName="firstname"
                        error={errors.firstname}
                    />
                    <InputField
                        id="lastname"
                        label="Last Name"
                        placeholder="Doe"
                        value={data.lastname}
                        setData={setData}
                        fieldName="lastname"
                        error={errors.lastname}
                    />
                </div>

                {/* Email Field */}
                <InputField
                    id="email"
                    label="Email"
                    placeholder="johndoe@example.com"
                    type="email"
                    value={data.email}
                    setData={setData}
                    fieldName="email"
                    error={errors.email}
                />

                {/* Password Field */}
                <PasswordField
                    id="password"
                    label="Password"
                    value={data.password}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    setData={setData}
                    fieldName="password"
                    error={errors.password}
                />

                {/* Confirm Password Field */}
                <PasswordField
                    id="password_confirmation"
                    label="Confirm Password"
                    value={data.password_confirmation}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    setData={setData}
                    fieldName="password_confirmation"
                    error={errors.password_confirmation}
                />

                {/* Terms Agreement */}
                <div className="mb-6 flex items-start">
                    <input
                        type="checkbox"
                        className="w-4 h-4 text-green-500 rounded"
                        autoComplete="new-password"
                        onChange={(e) => setData('agreesToTerms', e.target.checked)}
                        required
                    />
                    <span className="ml-2 text-gray-600 text-sm">
                        I agree to the{' '}
                        <a href="#" className="text-green-500 hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-green-500 hover:underline">Privacy Policy</a>.
                    </span>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold text-lg transition duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                    Register
                </button>

                {/* Already have an account? */}
                <div className="mt-4 text-center">
                    <span className="text-gray-600 text-sm">Already have an account? </span>
                    <Link href={route("login")} className="text-green-500 hover:underline">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

// InputField Component
function InputField({ id, label, placeholder, type = "text", value, setData, fieldName, error }: any) {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 mb-2">{label}</label>
            <TextInput
                id={id}
                type={type}
                name={fieldName}
                placeholder={placeholder}
                value={value}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                autoComplete="username"
                onChange={(e) => setData(fieldName, e.target.value)}
                required
            />
            <InputError message={error} className="mt-2" />
        </div>
    );
}

// PasswordField Component
function PasswordField({ id, label, value, showPassword, setShowPassword, setData, fieldName, error }: any) {
    return (
        <div className="mb-6">
            <label className="block text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <TextInput
                    id={id}
                    type={showPassword ? "text" : "password"}
                    name={fieldName}
                    placeholder="Enter at least 8+ characters"
                    value={value}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    autoComplete="new-password"
                    onChange={(e) => setData(fieldName, e.target.value)}
                    required
                />
                <InputError message={error} className="mt-2" />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}

// Welcome Section Component
function WelcomeSection() {
    return (
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-gray-50 p-8 rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Join Our Community</h2>
            <p className="text-lg text-gray-600 mb-8">
                Connect with fellow researchers, access a wealth of academic resources, and contribute to a vibrant research community.
            </p>
            <div className="space-y-6">
                <Feature
                    icon={<Globe className="text-teal-500" />}
                    text="Explore articles and research on diverse topics from experts worldwide."
                    bgColor="bg-teal-100"
                />
                <Feature
                    icon={<Clock className="text-purple-500" />}
                    text="Learn at your own pace with access to resources anytime, anywhere."
                    bgColor="bg-purple-100"
                />
                <Feature
                    icon={<Users className="text-pink-500" />}
                    text="Engage with a community of researchers to share insights and grow together."
                    bgColor="bg-pink-100"
                />
            </div>
        </div>
    );
}

// Feature Component
function Feature({ icon, text, bgColor }: { icon: ReactNode; text: string; bgColor: string }) {
    return (
        <div className={`flex items-center p-4 rounded-lg ${bgColor}`}>
            <div className="flex-shrink-0">{icon}</div>
            <p className="ml-4 text-gray-700">{text}</p>
        </div>
    );
}
