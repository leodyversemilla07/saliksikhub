import { Link } from '@inertiajs/react';
import { ChevronLeft, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import ApplicationLogo from '@/components/application-logo';
import { useEffect, useState } from 'react';
import { User as UserType } from '@/types';

interface SidebarLinkType {
    href: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NavigationMap {
    [key: string]: SidebarLinkType[];
}

interface SidebarProps {
    user: UserType;
    navigationMap: NavigationMap;
    isMobileOpen: boolean;
    isDesktopCollapsed: boolean;
    closeMobileSidebar: () => void;
    toggleDesktopSidebar: () => void;
}

const SidebarLink = ({
    href,
    icon: Icon,
    label,
    isDesktopCollapsed
}: SidebarLinkType & { isDesktopCollapsed: boolean }) => {
    const isActive = route().current(href);
    return (
        <Link
            href={route(href)}
            className={cn(
                "group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out",
                isActive
                    ? "bg-gradient-to-r from-green-50 to-emerald-50/80 text-green-700 dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-300 shadow-sm ring-1 ring-green-200/50 dark:ring-green-700/30"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50/50 hover:text-green-600 dark:text-gray-300 dark:hover:from-gray-800/50 dark:hover:to-gray-700/30 dark:hover:text-green-300 hover:shadow-sm",
                isDesktopCollapsed && "justify-center px-3"
            )}
        >
            {/* Active indicator */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-r-full" />
            )}

            <Icon className={cn(
                "flex-shrink-0 transition-all duration-200",
                isDesktopCollapsed ? "h-5 w-5" : "h-5 w-5",
                isActive
                    ? "text-green-600 dark:text-green-400 scale-110"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-green-500 group-hover:scale-105"
            )} />

            <span className={cn(
                "truncate transition-all duration-200 font-medium",
                isDesktopCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100 relative"
            )}>
                {label}
            </span>

            {/* Tooltip for collapsed state */}
            {isDesktopCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {label}
                </div>
            )}
        </Link>
    );
};

const MobileSidebar = ({
    isMobileOpen,
    user,
    closeMobileSidebar,
    navigationMap
}: Pick<SidebarProps, 'isMobileOpen' | 'user' | 'closeMobileSidebar' | 'navigationMap'>) => {
    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={closeMobileSidebar}
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/80 dark:border-gray-700/80 shadow-2xl transform transition-all duration-300 ease-out lg:hidden flex flex-col",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Enhanced header */}
                <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 dark:from-green-700/90 dark:via-emerald-600/90 dark:to-teal-600/90 text-white flex-shrink-0 shadow-lg relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>

                    <Link href="/" className="flex items-center space-x-3 relative z-10">
                        <ApplicationLogo className="h-9 w-auto fill-current text-white filter drop-shadow-lg" />
                        <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">SaliksikHub</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeMobileSidebar}
                        className="text-white hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 relative z-10"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close sidebar</span>
                    </Button>
                </div>

                <NavigationSection
                    user={user}
                    navigationMap={navigationMap}
                    isDesktopCollapsed={false}
                />

                <div className="p-4 border-t border-gray-200/60 dark:border-gray-700/60 mt-auto flex-shrink-0 bg-gray-50/50 dark:bg-gray-800/50">
                    <FooterContent />
                </div>
            </aside>
        </>
    );
};

const DesktopSidebar = ({
    isDesktopCollapsed,
    isTransitioning,
    toggleDesktopSidebar,
    user,
    navigationMap
}: Pick<SidebarProps, 'isDesktopCollapsed' | 'toggleDesktopSidebar' | 'user' | 'navigationMap'> & {
    isTransitioning: boolean
}) => {
    return (
        <aside
            className={cn(
                "hidden lg:flex lg:flex-col fixed inset-y-0 left-0 z-40 border-r border-gray-200/60 dark:border-gray-700/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl",
                "transform transition-all duration-300 ease-out",
                isDesktopCollapsed ? "w-20" : "w-80"
            )}
            style={{
                transitionTimingFunction: isDesktopCollapsed ?
                    "cubic-bezier(0.4, 0.0, 0.2, 1)" :
                    "cubic-bezier(0.05, 0.7, 0.1, 1.0)"
            }}
        >
            {/* Enhanced header */}
            <div className={cn(
                "h-16 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 dark:from-green-700/90 dark:via-emerald-600/90 dark:to-teal-600/90 flex items-center transition-all duration-300 flex-shrink-0 shadow-lg relative overflow-hidden",
                isDesktopCollapsed ? "px-3 justify-center" : "px-4 justify-between"
            )}>
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>

                {isDesktopCollapsed ? (
                    <div className="flex justify-center w-full transition-all duration-300 relative z-10">
                        <Link href="/" className="group">
                            <ApplicationLogo
                                className="h-9 w-auto fill-current text-white filter drop-shadow-lg group-hover:scale-110 transition-transform duration-200"
                            />
                        </Link>
                    </div>
                ) : (
                    <Link href="/" className="flex items-center space-x-3 transition-all duration-300 group relative z-10">
                        <ApplicationLogo
                            className="h-9 w-auto fill-current text-white filter drop-shadow-lg group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className={cn(
                            "text-xl font-bold text-white tracking-tight transition-opacity duration-300 drop-shadow-sm",
                            isTransitioning ? "opacity-0" : "opacity-100"
                        )}>SaliksikHub</span>
                    </Link>
                )}

                {!isDesktopCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDesktopSidebar}
                        className={cn(
                            "text-white hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 relative z-10",
                            isTransitioning ? "opacity-0" : "opacity-100"
                        )}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Collapse sidebar</span>
                    </Button>
                )}
            </div>

            {/* Expand button for collapsed state */}
            {isDesktopCollapsed && (
                <div className="flex justify-center py-4 border-b border-gray-200/60 dark:border-gray-700/60 flex-shrink-0 bg-gray-50/30 dark:bg-gray-800/30">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDesktopSidebar}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-200 hover:scale-105"
                    >
                        <ChevronRight className="h-5 w-5" />
                        <span className="sr-only">Expand sidebar</span>
                    </Button>
                </div>
            )}

            <NavigationSection
                user={user}
                navigationMap={navigationMap}
                isDesktopCollapsed={isDesktopCollapsed}
            />

            {!isDesktopCollapsed && (
                <div className={cn(
                    "p-4 border-t border-gray-200/60 dark:border-gray-700/60 mt-auto flex-shrink-0 transition-opacity duration-300 bg-gray-50/30 dark:bg-gray-800/30",
                    isTransitioning ? "opacity-0" : "opacity-100"
                )}>
                    <FooterContent />
                </div>
            )}
        </aside>
    );
};

const NavigationSection = ({
    user,
    navigationMap,
    isDesktopCollapsed
}: {
    user: UserType;
    navigationMap: NavigationMap;
    isDesktopCollapsed: boolean;
}) => {
    return (
        <ScrollArea className="flex-1 overflow-y-auto">
            <div className={cn("py-6", isDesktopCollapsed ? "px-3" : "px-4")}>
                {navigationMap[user.role] && (
                    <div key={user.role} className="space-y-2">

                        {/* Navigation links */}
                        <div className="space-y-1">
                            {navigationMap[user.role].map((link) => (
                                <SidebarLink
                                    key={link.href}
                                    href={link.href}
                                    icon={link.icon}
                                    label={link.label}
                                    isDesktopCollapsed={isDesktopCollapsed}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

const FooterContent = () => {
    return (
        <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-700/40 p-4 shadow-inner border border-gray-200/50 dark:border-gray-600/30">
            <div className="text-center mb-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    SaliksikHub
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    v1.0
                </span>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs">
                <Link
                    href="#"
                    className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200 hover:underline"
                >
                    Help & Support
                </Link>
                <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-500"></div>
                <Link
                    href="#"
                    className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200 hover:underline"
                >
                    Feedback
                </Link>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-600/30">
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    © 2025 Research Platform
                </p>
            </div>
        </div>
    );
};

export function AuthenticatedSidebar({
    user,
    navigationMap,
    isMobileOpen,
    isDesktopCollapsed,
    closeMobileSidebar,
    toggleDesktopSidebar
}: SidebarProps) {
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setIsTransitioning(true);

        const transitionDuration = isDesktopCollapsed ? 300 : 350;
        const transitionTimer = setTimeout(() => {
            setIsTransitioning(false);
        }, transitionDuration);

        return () => clearTimeout(transitionTimer);
    }, [isDesktopCollapsed]);

    return (
        <>
            <MobileSidebar
                isMobileOpen={isMobileOpen}
                user={user}
                closeMobileSidebar={closeMobileSidebar}
                navigationMap={navigationMap}
            />

            <DesktopSidebar
                isDesktopCollapsed={isDesktopCollapsed}
                isTransitioning={isTransitioning}
                toggleDesktopSidebar={toggleDesktopSidebar}
                user={user}
                navigationMap={navigationMap}
            />
        </>
    );
}
