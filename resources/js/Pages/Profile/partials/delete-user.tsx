import { useRef, useState, FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

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
        reset();    };    
    
    return (
        <div className="max-w-xl bg-card border rounded-lg p-4 space-y-4">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-foreground">
                    Delete Account
                </h2>
                <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                </p>
            </div>

            {/* Warning */}
            <Alert className="border-destructive/50 text-destructive [&>svg]:text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    <strong>Warning:</strong> This action cannot be undone. Once your account is deleted, 
                    all of its resources and data will be permanently deleted.
                </AlertDescription>
            </Alert>            
            
            {/* Delete Button */}
            <div className="pt-3 border-t">
                <AlertDialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you sure you want to delete your account?
                            </AlertDialogTitle>
                        </AlertDialogHeader>

                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                This action will permanently delete your account and all associated data. 
                                This cannot be undone.
                            </p>
                            
                            <form onSubmit={deleteUser}>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Confirm with your password
                                    </Label>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                <AlertDialogFooter className="mt-6">
                                    <AlertDialogCancel
                                        type="button"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        type="submit"
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={processing || !data.password}
                                    >
                                        {processing ? 'Deleting...' : 'Delete Account'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
