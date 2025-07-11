import React, { ReactNode } from 'react';
import BreadcrumbComponent from '@/components/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface HeaderProps {
    header?: ReactNode;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    breadcrumbItems?: BreadcrumbItem[];
}

interface HeaderActionsProps {
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

function HeaderActions({ toggleDarkMode, isDarkMode }: HeaderActionsProps) {
    return (
        <div className="flex items-center space-x-3">
            <Tooltip>
                <TooltipTrigger asChild>
                    <NotificationDropdown />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover border text-sm shadow-lg">
                    <p>Notifications</p>
                </TooltipContent>
            </Tooltip>

            <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/70 rounded-full"
            >
                <div className="relative w-5 h-5 flex items-center justify-center">
                    <Sun className={cn(
                        "absolute transition-transform duration-500 ease-in-out",
                        isDarkMode ? "scale-0 rotate-[-180deg]" : "scale-100 rotate-0"
                    )} />
                    <Moon className={cn(
                        "absolute transition-transform duration-500 ease-in-out",
                        isDarkMode ? "scale-100 rotate-0" : "scale-0 rotate-180"
                    )} />
                </div>
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    );
}

export function Header({ toggleDarkMode, isDarkMode, breadcrumbItems }: HeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-sidebar px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex items-center space-x-4 flex-1">
                <div className="flex flex-col space-y-1 flex-1">
                    {breadcrumbItems && breadcrumbItems.length > 0 && (
                        <BreadcrumbComponent items={breadcrumbItems} />
                    )}
                </div>
            </div>

            <HeaderActions toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        </header>
    );
}
