import { Input } from '@/components/ui/input';
import { FileText, Users, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DetailsStepProps {
    data: {
        title: string;
        authors: string;
        [key: string]: string | File | null;
    };
    setData: (name: string, value: string) => void;
    errors: {
        title?: string;
        authors?: string;
        [key: string]: string | undefined;
    };
    clearErrors?: () => void;
}

export function DetailsStep({ data, setData, errors }: DetailsStepProps) {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className={errors.title ? 'form-error space-y-2' : 'space-y-2'}>
                <div className="flex items-center justify-between">
                    <label htmlFor="title" className="flex items-center gap-2 font-medium">
                        <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Manuscript Title
                        </span>
                    </label>

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

                <Input
                    id="title"
                    placeholder="Enter a descriptive title for your manuscript"
                    className={cn(
                        "transition-all duration-200",
                        errors.title ? "border-red-500 focus:ring-red-500" :
                            data.title?.length >= 10 ? "border-green-500" : ""
                    )}
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    aria-invalid={!!errors.title}
                    aria-errormessage={errors.title ? "title-error" : undefined}
                />

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Provide a concise and descriptive title.
                    </p>
                    <div className="text-xs text-muted-foreground">
                        {data.title?.length || 0}/10+ characters
                    </div>
                </div>

                {errors.title && <p id="title-error" className="text-sm text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div className={errors.authors ? 'form-error space-y-2' : 'space-y-2'}>
                <div className="flex items-center justify-between">
                    <label htmlFor="authors" className="font-medium">
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            Authors
                        </span>
                    </label>

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

                <Input
                    id="authors"
                    placeholder="e.g. John Doe, Jane Smith, Robert Johnson"
                    className={cn(
                        "transition-all duration-200",
                        errors.authors ? "border-red-500 focus:ring-red-500" :
                            data.authors?.length >= 3 ? "border-green-500" : ""
                    )}
                    value={data.authors}
                    onChange={(e) => setData('authors', e.target.value)}
                    aria-invalid={!!errors.authors}
                    aria-errormessage={errors.authors ? "authors-error" : undefined}
                />

                {data.authors && data.authors.split(',').filter((k: string) => k.trim() !== '').length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {data.authors.split(',').map((author: string, index: number) => {
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
                    <p className="text-sm text-muted-foreground">
                        List all authors, separated by commas.
                    </p>
                    <div className="text-xs text-muted-foreground">
                        {data.authors?.length || 0}/3+ characters
                    </div>
                </div>

                {errors.authors && <p id="authors-error" className="text-sm text-red-500 mt-1">{errors.authors}</p>}
            </div>
        </div>
    );
}
