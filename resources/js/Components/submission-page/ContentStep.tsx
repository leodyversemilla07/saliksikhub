import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { FileText, Tag, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ContentStepProps {
    data: {
        abstract: string;
        keywords: string;
        [key: string]: string | File | null;
    };
    setData: (name: string, value: string) => void;
    errors: {
        abstract?: string;
        keywords?: string;
        [key: string]: string | undefined;
    };
}

export function ContentStep({ data, setData, errors }: ContentStepProps) {
    return (
        <div className="space-y-6 animate-fadeIn">
            <FormItem className={errors.abstract ? 'form-error' : ''}>
                <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2 font-medium">
                        <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
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
                            <p>A summary of your research including objectives, methods, results, and conclusions.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <FormControl>
                    <Textarea
                        id="abstract"
                        placeholder="Enter your abstract (100-300 words recommended)"
                        className={cn(
                            "min-h-[150px] transition-all duration-200",
                            errors.abstract ? "border-red-500 focus:ring-red-500" :
                                data.abstract?.length >= 100 ? "border-green-500" : ""
                        )}
                        value={data.abstract}
                        onChange={(e) => setData('abstract', e.target.value)}
                        aria-invalid={!!errors.abstract}
                        aria-errormessage={errors.abstract ? "abstract-error" : undefined}
                    />
                </FormControl>

                <div className="flex items-center justify-between">
                    <FormDescription>
                        Provide a concise summary of your research.
                    </FormDescription>
                    <div className="text-xs text-muted-foreground">
                        {data.abstract?.length || 0}/100+ characters
                    </div>
                </div>

                {errors.abstract && <FormMessage id="abstract-error">{errors.abstract}</FormMessage>}
            </FormItem>

            <FormItem className={errors.keywords ? 'form-error' : ''}>
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
                            <p>Keywords help readers find your paper. Include 3-6 relevant terms.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <FormControl>
                    <Input
                        id="keywords"
                        placeholder="e.g. Machine Learning, Computer Vision, Neural Networks"
                        className={cn(
                            "transition-all duration-200",
                            errors.keywords ? "border-red-500 focus:ring-red-500" :
                                data.keywords?.length >= 3 ? "border-green-500" : ""
                        )}
                        value={data.keywords}
                        onChange={(e) => setData('keywords', e.target.value)}
                        aria-invalid={!!errors.keywords}
                        aria-errormessage={errors.keywords ? "keywords-error" : undefined}
                    />
                </FormControl>

                {data.keywords && data.keywords.split(',').filter((k: string) => k.trim() !== '').length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {data.keywords.split(',').map((keyword: string, index: number) => {
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

                <div className="flex items-center justify-between">
                    <FormDescription>
                        List keywords separated by commas.
                    </FormDescription>
                    <div className="text-xs text-muted-foreground">
                        {data.keywords?.length || 0}/3+ characters
                    </div>
                </div>

                {errors.keywords && <FormMessage id="keywords-error">{errors.keywords}</FormMessage>}
            </FormItem>
        </div>
    );
}

