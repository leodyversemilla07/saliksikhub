import { useRef, useState, FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Lock, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <div className="max-w-xl">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Account Deletion
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Once your account is deleted, all of its resources and data will be permanently removed. Before
                    proceeding, please download any data or information that you wish to retain.
                </p>
            </div>

            <div className="p-4 border border-red-200 dark:border-red-900 rounded-md bg-red-50 dark:bg-red-900/20">
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="text-base font-medium text-red-800 dark:text-red-300">
                            Permanent Action Warning
                        </h4>
                        <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                            This action cannot be undone. Deleting your account will:
                        </p>
                        <ul className="mt-2 text-sm text-red-700 dark:text-red-400 list-disc pl-5 space-y-1">
                            <li>Remove all your personal information</li>
                            <li>Delete all your content and submissions</li>
                            <li>Remove your access to the platform</li>
                            <li>Cancel any ongoing review processes</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <AlertDialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white dark:bg-gray-800">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl text-red-600 dark:text-red-500 font-semibold flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Confirm Account Deletion
                            </AlertDialogTitle>

                            <div className="text-gray-700 dark:text-gray-300 mt-2">
                                This action is irreversible. Please enter your password to confirm permanent deletion of your account.
                            </div>

                            <form onSubmit={deleteUser} className="mt-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <Input
                                                id="password"
                                                ref={passwordInput}
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="pl-10"
                                                placeholder="Confirm with your password"
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-500">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <AlertDialogFooter className="mt-6 gap-3">
                                    <AlertDialogCancel
                                        className="border border-gray-300 dark:border-gray-600"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        type="submit"
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        disabled={processing}
                                    >
                                        {processing ? 'Deleting...' : 'Permanently Delete Account'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
