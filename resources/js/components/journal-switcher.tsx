/**
 * JournalSwitcher Component
 *
 * A dropdown component that allows users to switch between different journals
 * in the multi-tenant research journal management system.
 *
 * @module components/journal-switcher
 */
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Building2, ChevronDown, Check, Loader2 } from 'lucide-react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JournalWithInstitution {
    id: number;
    name: string;
    slug: string;
    abbreviation?: string | null;
    logo_url?: string | null;
    institution?: {
        id: number;
        name: string;
        abbreviation?: string | null;
    } | null;
}

interface JournalSwitcherProps {
    className?: string;
}

export default function JournalSwitcher({ className }: JournalSwitcherProps) {
    const { currentJournal } = usePage<PageProps>().props;
    const [journals, setJournals] = useState<JournalWithInstitution[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch journals when dropdown opens
    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);

        if (open && journals.length === 0 && !isFetching) {
            setIsFetching(true);
            try {
                const response = await fetch('/api/journals');
                const data = await response.json();
                setJournals(data.journals || []);
            } catch (error) {
                console.error('Failed to fetch journals:', error);
            } finally {
                setIsFetching(false);
            }
        }
    };

    const handleJournalSwitch = (journal: JournalWithInstitution) => {
        if (journal.id === currentJournal?.id) {
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        router.post(
            `/journals/${journal.id}/switch`,
            { redirect_to: window.location.pathname },
            {
                onFinish: () => {
                    setIsLoading(false);
                    setIsOpen(false);
                },
            }
        );
    };

    // Don't render if there's no current journal (single tenant mode)
    if (!currentJournal) {
        return null;
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`h-auto justify-start gap-2 px-2 py-1.5 text-left ${className}`}
                    disabled={isLoading}
                >
                    {currentJournal.logo_url ? (
                        <img
                            src={currentJournal.logo_url}
                            alt={currentJournal.name}
                            className="h-6 w-6 rounded object-contain"
                        />
                    ) : (
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium truncate max-w-[150px]">
                            {currentJournal.abbreviation || currentJournal.name}
                        </span>
                    </div>
                    {isLoading ? (
                        <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                    ) : (
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[280px]">
                <DropdownMenuLabel>Switch Journal</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isFetching ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading journals...</span>
                    </div>
                ) : journals.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                        No other journals available
                    </div>
                ) : (
                    journals.map((journal) => (
                        <DropdownMenuItem
                            key={journal.id}
                            className="cursor-pointer"
                            onClick={() => handleJournalSwitch(journal)}
                        >
                            <div className="flex items-center gap-3 w-full">
                                {journal.logo_url ? (
                                    <img
                                        src={journal.logo_url}
                                        alt={journal.name}
                                        className="h-8 w-8 rounded object-contain shrink-0"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted shrink-0">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{journal.name}</div>
                                    {journal.institution && (
                                        <div className="text-xs text-muted-foreground truncate">
                                            {journal.institution.abbreviation || journal.institution.name}
                                        </div>
                                    )}
                                </div>
                                {journal.id === currentJournal?.id && (
                                    <Check className="h-4 w-4 text-primary shrink-0" />
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
