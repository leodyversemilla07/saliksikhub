import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { FileText, Users, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

export function DetailsStep() {
    const { control, formState } = useFormContext();
    const { errors } = formState;

    return (
        <div className="space-y-6 animate-fadeIn">
            <FormField
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel className="flex items-center gap-2 font-medium">
                                <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Manuscript Title
                                </span>
                            </FormLabel>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground cursor-help">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-sm text-xs">
                                    <p>The title should accurately reflect the content of your manuscript.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <FormControl>
                            <Input
                                id="title"
                                placeholder="Enter a descriptive title for your manuscript"
                                className={cn(
                                    "transition-all duration-200",
                                    fieldState.invalid ? "border-red-500 focus:ring-red-500" : field.value?.length >= 10 ? "border-green-500" : ""
                                )}
                                {...field}
                            />
                        </FormControl>

                        <div className="flex items-center justify-between">
                            <FormDescription>
                                Provide a concise and descriptive title.
                            </FormDescription>
                            <div className="text-xs text-muted-foreground">
                                {field.value?.length || 0}/10+ characters
                            </div>
                        </div>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="authors"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel htmlFor="authors" className="font-medium">
                                <span className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    Authors
                                </span>
                            </FormLabel>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground cursor-help">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-sm text-xs">
                                    <p>List all authors who contributed significantly to this work.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <FormControl>
                            <Input
                                id="authors"
                                placeholder="e.g. John Doe, Jane Smith, Robert Johnson"
                                className={cn(
                                    "transition-all duration-200",
                                    fieldState.invalid ? "border-red-500 focus:ring-red-500" : field.value?.length >= 3 ? "border-green-500" : ""
                                )}
                                {...field}
                            />
                        </FormControl>

                        {field.value && field.value.split(',').filter((k: string) => k.trim() !== '').length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {field.value.split(',').map((author: string, index: number) => {
                                    if (author.trim() === '') return null;

                                    return (
                                        <div
                                            key={index}
                                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                        >
                                            {author.trim()}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <FormDescription>
                                List all authors, separated by commas.
                            </FormDescription>
                            <div className="text-xs text-muted-foreground">
                                {field.value?.length || 0}/3+ characters
                            </div>
                        </div>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

