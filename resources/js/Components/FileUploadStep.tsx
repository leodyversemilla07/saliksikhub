import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Upload } from 'lucide-react';

export function FileUploadStep() {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name="manuscript"
            render={({ field }) => (
                <FormItem>
                    <FormLabel htmlFor="manuscript" className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Manuscript File
                    </FormLabel>
                    <FormControl>
                        <Input
                            id="manuscript"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                        />
                    </FormControl>
                    <FormDescription>
                        Upload your manuscript file (PDF, max 10MB).
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

