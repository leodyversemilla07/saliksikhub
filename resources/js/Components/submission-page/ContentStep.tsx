import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { BookOpen, Tag, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ContentStep() {
    const { control, watch } = useFormContext();
    const abstractValue = watch("abstract");
    const [abstractCount, setAbstractCount] = useState(0);

    const handleAbstractChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAbstractCount(e.target.value.length);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <FormField
                control={control}
                name="abstract"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel htmlFor="abstract" className="font-medium">
                                <span className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    Abstract
                                </span>
                            </FormLabel>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground cursor-help">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-sm text-xs">
                                    <p>A concise summary of your research including objectives, methods, results, and conclusions.</p>
                                </TooltipContent>
                            </Tooltip>

                        </div>

                        <FormControl>
                            <Textarea
                                id="abstract"
                                placeholder="Enter a concise summary of your research..."
                                className={cn(
                                    "resize-none min-h-[180px] transition-all duration-200",
                                    fieldState.invalid ? "border-red-500 focus:ring-red-500" : field.value?.length >= 100 ? "border-green-500" : ""
                                )}
                                rows={6}
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleAbstractChange(e);
                                }}
                            />
                        </FormControl>

                        <div className="flex items-center justify-between">
                            <FormDescription>
                                Provide a comprehensive summary (100-300 words).
                            </FormDescription>
                            <div className={`text-xs ${abstractCount < 100
                                ? "text-red-500"
                                : abstractCount > 300
                                    ? "text-amber-500"
                                    : "text-green-600"
                                }`}>
                                {abstractCount} / 100-300 words
                            </div>
                        </div>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="keywords"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel htmlFor="keywords" className="font-medium">
                                <span className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-primary" />
                                    Keywords
                                </span>
                            </FormLabel>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground cursor-help">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-sm text-xs">
                                    <p>Keywords help others find your paper in databases and search engines.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <FormControl>
                            <Input
                                id="keywords"
                                placeholder="e.g. artificial intelligence, machine learning, neural networks"
                                className={cn(
                                    "transition-all duration-200",
                                    fieldState.invalid ? "border-red-500 focus:ring-red-500" : field.value?.length >= 3 ? "border-green-500" : ""
                                )}
                                {...field}
                            />
                        </FormControl>

                        <div className="flex items-center justify-between">
                            <FormDescription>
                                Enter keywords related to your research, separated by commas.
                            </FormDescription>

                            {field.value && (
                                <div className="text-xs text-muted-foreground">
                                    {field.value.split(',').filter((k: string) => k.trim() !== '').length} keywords
                                </div>
                            )}
                        </div>

                        <FormMessage />

                        {field.value && field.value.split(',').filter((k: string) => k.trim() !== '').length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {field.value.split(',').map((keyword: string, index: number) => {
                                    if (keyword.trim() === '') return null;

                                    return (
                                        <div
                                            key={index}
                                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                        >
                                            {keyword.trim()}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </FormItem>
                )}
            />
        </div>
    );
}

