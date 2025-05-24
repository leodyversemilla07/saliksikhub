import { useRef, useState, FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function DeleteUser() {
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
        <div className="max-w-3xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Delete Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Permanently delete your account and all associated data.
                </p>
            </div>

            {/* Warning Section */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                            Warning: This action cannot be undone
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                            Once your account is deleted, all of its resources and data will be permanently deleted. 
                            Before deleting your account, please download any data or information that you wish to retain.
                        </p>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 dark:border-gray-700 mb-8"></div>

            {/* Delete Button Section */}
            <div className="flex justify-start">
                <AlertDialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white font-medium px-6 h-11 transition-colors duration-200"
                        >
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                Confirm Account Deletion
                            </AlertDialogTitle>
                            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
                                <p>
                                    This action will permanently delete your account and all associated data. 
                                    This cannot be undone.
                                </p>
                                <p className="font-medium">
                                    Please enter your password to confirm this action.
                                </p>
                            </div>
                        </AlertDialogHeader>

                        <form onSubmit={deleteUser} className="mt-6">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </Label>
                                <div className="max-w-sm">
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="h-11 w-full border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <AlertDialogFooter className="mt-8 gap-3">
                                <AlertDialogCancel
                                    type="button"
                                    onClick={closeModal}
                                    className="h-11 px-6 font-medium"
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    type="submit"
                                    className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 text-white h-11 px-6 font-medium transition-colors duration-200"
                                    disabled={processing || !data.password}
                                >
                                    {processing ? (
                                        <span className="flex items-center space-x-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Deleting...</span>
                                        </span>
                                    ) : (
                                        'Delete Account'
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
