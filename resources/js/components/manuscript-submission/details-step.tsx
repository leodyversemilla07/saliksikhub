import { FileText, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    const titleLength = data.title?.length || 0;
    const authorsArray = data.authors
        ? data.authors
              .split(',')
              .filter((author: string) => author.trim() !== '')
        : [];
    const authorsLength = data.authors?.length || 0;

    const isTitleValid = titleLength >= 10;
    const isAuthorsValid = authorsLength >= 3 && authorsArray.length > 0;

    return (
        <div className="animate-fadeIn space-y-8">
            {/* Title Section */}
            <Card className="border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full border p-2 transition-colors">
                                {errors.title ? (
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                ) : isTitleValid ? (
                                    <CheckCircle2 className="text-success h-5 w-5" />
                                ) : (
                                    <FileText className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="title"
                                    className="text-lg font-semibold"
                                >
                                    Manuscript Title
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    A clear, descriptive title for your research
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant={isTitleValid ? 'default' : 'secondary'}
                                className="text-xs"
                            >
                                {titleLength}/10+ chars
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Input
                            id="title"
                            placeholder="Enter a descriptive and compelling title for your manuscript..."
                            className={cn(
                                'h-12 border text-base transition-all duration-300 focus:ring-2',
                                errors.title
                                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                                    : isTitleValid
                                      ? 'border-success focus:border-success focus:ring-success/20'
                                      : 'border focus:border-primary focus:ring-primary/20',
                            )}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            aria-invalid={!!errors.title}
                            aria-errormessage={
                                errors.title ? 'title-error' : undefined
                            }
                        />

                        {errors.title && (
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <p
                                    id="title-error"
                                    className="text-sm font-medium"
                                ></p>
                            </div>
                        )}

                        {!errors.title && isTitleValid && (
                            <div className="text-success flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    Great! Your title meets the requirements.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Authors Section */}
            <Card className="border bg-card text-card-foreground transition-all duration-300">
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full border p-2 transition-colors">
                                {errors.authors ? (
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                ) : isAuthorsValid ? (
                                    <CheckCircle2 className="text-success h-5 w-5" />
                                ) : (
                                    <Users className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="authors"
                                    className="text-lg font-semibold"
                                >
                                    Authors
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    All contributors to this research work
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    authorsArray.length > 0
                                        ? 'default'
                                        : 'secondary'
                                }
                                className="text-xs"
                            >
                                {authorsArray.length} author
                                {authorsArray.length !== 1 ? 's' : ''}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            id="authors"
                            placeholder="e.g. Dr. Jane Smith, Prof. John Doe, Dr. Alice Johnson..."
                            className={cn(
                                'h-12 border text-base transition-all duration-300 focus:ring-2',
                                errors.authors
                                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                                    : isAuthorsValid
                                      ? 'border-success focus:border-success focus:ring-success/20'
                                      : 'border focus:border-primary focus:ring-primary/20',
                            )}
                            value={data.authors}
                            onChange={(e) => setData('authors', e.target.value)}
                            aria-invalid={!!errors.authors}
                            aria-errormessage={
                                errors.authors ? 'authors-error' : undefined
                            }
                        />

                        {/* Author Chips Preview */}
                        {authorsArray.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Users className="h-4 w-4" />
                                    Author Preview:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {authorsArray.map(
                                        (author: string, index: number) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="px-3 py-1.5 text-sm"
                                            >
                                                <Users className="mr-1.5 h-3 w-3" />
                                                {author.trim()}
                                            </Badge>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                        {errors.authors && (
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                            </div>
                        )}

                        {!errors.authors && isAuthorsValid && (
                            <div className="text-success flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        )}

                        <div className="rounded-lg bg-background p-3 text-xs text-muted-foreground">
                            <strong>Tip:</strong> List authors in the order they
                            should appear in the publication. Include full names
                            and separate each author with a comma.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
