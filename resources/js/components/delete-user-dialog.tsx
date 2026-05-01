import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';
import users from '@/routes/users';

export interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    onSuccess?: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
    open,
    onOpenChange,
    user,
    onSuccess,
}) => {
    const { delete: destroy, processing, reset } = useForm({});
    const [error, setError] = useState<string | null>(null);

    const onSubmit = () => {
        setError(null);
        destroy(users.destroy.url({ user: user.id }), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();

                if (onSuccess) {
onSuccess();
}

                toast('User has been successfully deleted.');
            },
            onError: () => {
                setError('Failed to delete user. Please try again.');
                toast('Failed to delete user. Please try again.');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="mx-auto max-w-md rounded-xl bg-background p-6 text-foreground shadow-lg">
                <AlertDialogHeader className="mb-4">
                    <AlertDialogTitle className="mb-1 text-center text-2xl font-bold text-destructive">
                        Delete User Account
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-muted-foreground">
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mb-4 flex flex-col items-center gap-2">
                    <div className="text-center text-lg font-medium text-foreground">
                        {user.firstname} {user.lastname}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {user.email}
                    </div>
                    {error && (
                        <div className="mt-2 text-center text-sm font-semibold text-destructive">
                            {error}
                        </div>
                    )}
                </div>
                <AlertDialogFooter className="mt-6 flex flex-row gap-4">
                    <AlertDialogCancel asChild>
                        <Button
                            type="button"
                            className="flex-1 rounded-md border border-border bg-background py-2 text-foreground hover:bg-muted"
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            type="button"
                            onClick={onSubmit}
                            disabled={processing}
                            className="flex-1 rounded-md bg-destructive py-2 text-foreground hover:bg-destructive/90"
                        >
                            {processing ? (
                                'Deleting...'
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4 text-foreground" />
                                    Delete User
                                </span>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteUserDialog;
