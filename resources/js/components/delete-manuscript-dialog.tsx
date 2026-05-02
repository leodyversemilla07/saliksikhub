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

export interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    manuscriptTitle: string;
    onDelete: () => void;
}
export function DeleteManuscriptDialog({
    open,
    onOpenChange,
    manuscriptTitle,
    onDelete,
}: DeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Manuscript</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                            "{manuscriptTitle}"
                        </span>
                        ?{' '}
                        <span className="mt-2 block text-red-500">
                            This action cannot be undone.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel render={<Button variant="outline" />}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        render={
                            <Button variant="destructive" onClick={onDelete} />
                        }
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
