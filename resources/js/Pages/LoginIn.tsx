import React, { useState, ReactNode, FormEventHandler } from 'react';
import { Eye, Globe, Clock, Users } from 'lucide-react';
import { useForm } from '@inertiajs/react';
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
        <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-br from-blue-50 to-gray-100 font-sans">
            {/* Header */}
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

            {/* Main Content */}
            <main className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
                {/* Registration Form */}
                <div className="w-full md:w-1/2 bg-white p-10 rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Your Account</h2>
                    <form onSubmit={submit}>
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 mb-2">First Name</label>
                                <TextInput
                                    id="firstname"
                                    name="firstname"
                                    placeholder='John'
                                    value={data.firstname}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('firstname', e.target.value)}
                                    required
                                />

                                <InputError message={errors.firstname} className="mt-2" />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Last Name</label>
                                <TextInput
                                    id="lastname"
                                    name="lastname"
                                    placeholder='Doe'
                                    value={data.lastname}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    isFocused={true}
                                    onChange={(e) => setData('lastname', e.target.value)}
                                    required
                                />

                                <InputError message={errors.lastname} className="mt-2" />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                placeholder='johndoe@gmail.com'
                                value={data.email}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder='Enter at least 8+ characters'
                                    value={data.password}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />

                                <InputError message={errors.password} className="mt-2" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    placeholder='Enter at least 8+ characters'
                                    value={data.password_confirmation}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />

                                <InputError message={errors.password} className="mt-2" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

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
                    </form>
                </div>

                {/* Welcome Section */}
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
            </main>

            {/* Footer */}
            <footer className="text-center mt-16 text-gray-600">
                <p>&copy; 2024 MinSU Research Journal. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

// Reusable Feature Component for Welcome Section
function Feature({ icon, text, bgColor }: { icon: ReactNode; text: string; bgColor: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${bgColor}`}>
                {icon}
            </div>
            <p className="text-gray-700 text-lg">{text}</p>
        </div>
    );
}
