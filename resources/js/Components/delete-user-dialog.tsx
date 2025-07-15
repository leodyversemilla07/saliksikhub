import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { User } from "@/types";

export interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    onSuccess?: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({ open, onOpenChange, user, onSuccess }) => {
    const { delete: destroy, processing, reset } = useForm({});
    const [error, setError] = useState<string | null>(null);

    const onSubmit = () => {
        setError(null);
        destroy(route('users.destroy', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
                if (onSuccess) onSuccess();
                toast("User has been successfully deleted.");
            },
            onError: () => {
                setError("Failed to delete user. Please try again.");
                toast("Failed to delete user. Please try again.");
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="mx-auto max-w-md p-6 rounded-xl shadow-lg bg-background text-foreground">
                <AlertDialogHeader className="mb-4">
                    <AlertDialogTitle className="text-2xl font-bold text-center mb-1 text-destructive">Delete User Account</AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-muted-foreground">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col items-center gap-2 mb-4">
                    <div className="font-medium text-lg text-center text-foreground">
                        {user.firstname} {user.lastname}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {error && <div className="text-sm text-destructive mt-2 text-center font-semibold">{error}</div>}
                </div>
                <AlertDialogFooter className="flex flex-row gap-4 mt-6">
                    <AlertDialogCancel asChild>
                        <Button
                            type="button"
                            className="flex-1 py-2 rounded-md bg-background text-foreground border border-border hover:bg-muted"
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
                            className="flex-1 py-2 rounded-md bg-destructive text-foreground hover:bg-destructive/90"
                        >
                            {processing ? (
                                'Deleting...'
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Trash2 className="w-4 h-4 text-foreground" />
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
