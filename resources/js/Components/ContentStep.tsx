import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { BookOpen, Tag } from 'lucide-react';

export function ContentStep() {
    const { control } = useFormContext();

    return (
        <>
            <FormField
                control={control}
                name="abstract"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="abstract" className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Abstract
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                id="abstract"
                                placeholder="Enter your manuscript's abstract"
                                className="resize-none h-40"
                                rows={5}
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            Provide a brief summary of your research (100-300 words).
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="keywords"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="keywords" className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Keywords
                        </FormLabel>
                        <FormControl>
                            <Input id="keywords" placeholder="Enter keywords" {...field} />
                        </FormControl>
                        <FormDescription>
                            Enter keywords related to your research, separated by commas.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

