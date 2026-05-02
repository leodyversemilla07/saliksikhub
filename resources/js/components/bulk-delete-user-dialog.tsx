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
import users from '@/routes/users';

export interface BulkDeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedUsers: number[];
    onSuccess?: () => void;
}

const BulkDeleteUserDialog: React.FC<BulkDeleteUserDialogProps> = ({
    open,
    onOpenChange,
    selectedUsers,
    onSuccess,
}) => {
    const { setData, post, processing, reset } = useForm<{ userIds: number[] }>(
        {
            userIds: [],
        },
    );
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        setData('userIds', selectedUsers);
    }, [selectedUsers, setData]);

    const onSubmit = () => {
        setError(null);
        post(users.bulkDestroy.url(), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();

                if (onSuccess) {
                    onSuccess();
                }

                toast(`${selectedUsers.length} user(s) deleted successfully.`);
            },
            onError: () => {
                setError('Failed to delete users. Please try again.');
                toast('Failed to delete users. Please try again.');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="mx-auto max-w-md rounded-xl bg-background p-6 text-foreground shadow-lg">
                <AlertDialogHeader className="mb-4">
                    <AlertDialogTitle className="mb-1 text-center text-2xl font-bold text-destructive">
                        Delete User Accounts
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-muted-foreground">
                        Are you sure you want to delete these users? This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mb-4 flex flex-col items-center gap-2">
                    <div className="text-center text-lg font-medium text-foreground">
                        {selectedUsers.length} user account
                        {selectedUsers.length > 1 ? 's' : ''} selected for
                        deletion.
                    </div>
                    <div className="text-sm text-muted-foreground">
                        All selected user accounts will be permanently deleted.
                    </div>
                    {error && (
                        <div className="mt-2 text-center text-sm font-semibold text-destructive">
                            {error}
                        </div>
                    )}
                </div>
                <AlertDialogFooter className="mt-6 flex flex-row gap-4">
                    <AlertDialogCancel
                        render={
                            <Button
                                type="button"
                                className="flex-1 rounded-md border border-border bg-background py-2 text-foreground hover:bg-muted"
                                disabled={processing}
                            />
                        }
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        render={
                            <Button
                                type="button"
                                onClick={onSubmit}
                                disabled={processing}
                                className="flex-1 rounded-md bg-destructive py-2 text-foreground hover:bg-destructive/90"
                            />
                        }
                    >
                        {processing ? (
                            'Deleting...'
                        ) : (
                            <span className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4 text-foreground" />
                                Delete {selectedUsers.length} User
                                {selectedUsers.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default BulkDeleteUserDialog;
