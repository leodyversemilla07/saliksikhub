import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { FileText, Users } from 'lucide-react';

export function DetailsStep() {
    const { control } = useFormContext();

    return (
        <>
            <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Manuscript Title
                        </FormLabel>
                        <FormControl>
                            <Input id="title" placeholder="Enter the title of your manuscript" {...field} />
                        </FormControl>
                        <FormDescription>
                            Provide a concise and descriptive title for your manuscript.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="authors"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="authors" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Authors
                        </FormLabel>
                        <FormControl>
                            <Input id="authors" placeholder="Enter authors' names" {...field} />
                        </FormControl>
                        <FormDescription>
                            List all authors, separated by commas (e.g., John Doe, Jane Smith).
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

