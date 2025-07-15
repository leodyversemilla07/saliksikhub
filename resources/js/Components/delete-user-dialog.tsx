import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const DeleteUserDialog: React.FC<{ user: User }> = ({ user }) => {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing, reset } = useForm({});

    const onSubmit = () => {
        destroy(route('users.destroy', user.id), {
            onSuccess: () => {
                setOpen(false);
                reset();
                toast("User has been successfully deleted.");
            },
            onError: () => {
                toast("Failed to delete user. Please try again.");
            },
            preserveScroll: true
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <span className="flex items-center gap-2 px-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded cursor-pointer w-full">
                    <Trash2 className="w-4 h-4 text-destructive mr-2" />
                    Delete User
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent className="mx-auto p-6 rounded-xl shadow-lg bg-background text-foreground" style={{ maxWidth: '420px' }}>
                <AlertDialogHeader className="mb-4">
                    <AlertDialogTitle className="text-2xl font-bold text-center mb-1 text-destructive">Delete User Account</AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-muted-foreground">Are you sure you want to delete this user? This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col items-center gap-2 mb-4">
                    <div className="font-medium text-lg text-center text-foreground">{user.firstname} {user.lastname}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {/* Role and affiliation removed as requested */}
                </div>
                <AlertDialogFooter className="flex flex-row gap-4 mt-6">
                    <AlertDialogCancel asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 py-2 rounded-md bg-background text-foreground border"
                        >
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={onSubmit}
                            disabled={processing}
                            className="flex-1 py-2 rounded-md bg-destructive text-white hover:bg-destructive/90"
                        >
                            {processing ? 'Deleting...' : 'Delete User'}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteUserDialog;
