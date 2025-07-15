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
import BulkDeleteWarning from "@/components/bulk-delete-warning";
import { toast } from "sonner";
import { useForm } from "@inertiajs/react";

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
    onSuccess
}) => {
    const { setData, post, processing, reset } = useForm<{ userIds: number[] }>({
        userIds: []
    });
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        setData("userIds", selectedUsers);
    }, [selectedUsers, setData]);

    const handleBulkDelete = () => {
        setError(null);
        post(route('users.bulk-destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
                if (onSuccess) onSuccess();
                toast(`${selectedUsers.length} user(s) deleted successfully.`);
            },
            onError: () => {
                setError("Failed to delete users. Please try again.");
                toast("Failed to delete users. Please try again.");
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md bg-card text-card-foreground border border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-destructive">
                        Delete Multiple Users
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        You are about to delete {selectedUsers.length} user account{selectedUsers.length > 1 ? 's' : ''}.
                    </AlertDialogDescription>
                    <div className="text-sm text-muted-foreground">
                        This action cannot be undone.
                    </div>
                    <BulkDeleteWarning selectedCount={selectedUsers.length} />
                    {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel
                        className="hover:bg-muted/80 transition-colors"
                        id="cancel-bulk-delete"
                        name="cancel-bulk-delete"
                        disabled={processing}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleBulkDelete}
                        disabled={processing}
                        className="bg-destructive hover:bg-destructive/90 transition-colors flex items-center gap-2"
                        id="confirm-bulk-delete"
                        name="confirm-bulk-delete"
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Deleting...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Trash2 className="w-4 h-4 text-white" />
                                Delete {selectedUsers.length} User{selectedUsers.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default BulkDeleteUserDialog;
