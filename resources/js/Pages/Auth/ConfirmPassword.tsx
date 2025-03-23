import { useState, FormEventHandler } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/Button';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title="Confirm Password">
            <div className="bg-gradient-to-br from-[#f0f8f3] to-white p-4 mb-6 rounded-lg">
                <div className="text-[#18652c] text-sm font-medium text-center">
                    This is a secure area. Please confirm your password before continuing.
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#18652c] mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg pr-10 text-base focus:ring-[#3fb65e] focus:border-[#3fb65e]`}
                            onChange={(e) => setData('password', e.target.value)}
                            autoFocus
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#18652c]"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1 text-sm" />
                </div>

                <Button
                    type="submit"
                    fullWidth
                    disabled={processing}
                    className="py-2.5 text-base mt-3 bg-[#3fb65e] hover:bg-[#18652c] rounded-lg transition-colors duration-300"
                >
                    {processing ? 'Confirming...' : 'Confirm'}
                </Button>
            </form>
        </GuestLayout>
    );
}
