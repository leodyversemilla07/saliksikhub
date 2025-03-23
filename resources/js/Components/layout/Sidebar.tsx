import { Link } from '@inertiajs/react';
import { ChevronLeft, X, ChevronRight, Building2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Button } from '@/Components/ui/button';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useEffect, useState } from 'react';
import { User as UserType } from '@/types';

interface SidebarLinkType {
    href: string;
    label: string;
    icon: React.ComponentType<any>;
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                isActive
                    ? "bg-gradient-to-r from-green-50/90 to-emerald-50/90 text-green-700 dark:from-green-900/60 dark:to-emerald-900/60 dark:text-green-300 shadow-sm border-l-2 border-green-500 dark:border-green-400"
                    : "text-gray-700 hover:bg-gray-100/70 hover:text-green-600 dark:text-gray-300 dark:hover:bg-gray-800/70 dark:hover:text-green-300",
                isDesktopCollapsed && "justify-center"
            )}
        >
            <Icon className={cn(
                "flex-shrink-0",
                isDesktopCollapsed ? "h-5 w-5 mx-auto" : "h-5 w-5",
                isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
            )} />

            <span className={cn(
                "truncate transition-all duration-200",
                isDesktopCollapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100 relative"
            )}>
                {label}
            </span>
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
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 shadow-lg transform transition-all duration-300 ease-in-out lg:hidden flex flex-col",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-700/90 dark:to-emerald-600/90 text-white flex-shrink-0 shadow-md">
                <Link href="/" className="flex items-center space-x-2">
                    <ApplicationLogo className="h-8 w-auto fill-current text-white filter drop-shadow-md" />
                    <span className="text-lg font-bold tracking-tight">SaliksikHub</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobileSidebar}
                    className="text-white hover:text-white hover:bg-white/20"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close sidebar</span>
                </Button>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-800/50 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 aspect-square flex-shrink-0 rounded-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900 dark:via-emerald-900 dark:to-teal-800 flex items-center justify-center text-green-700 dark:text-green-200 font-medium text-xl shadow-md ring-2 ring-white/20 dark:ring-black/20">
                        {user.firstname.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {user.firstname} {user.lastname}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                        </p>
                        <div className="mt-2 gap-1 flex flex-col">
                            <RoleTag role={user.role} />
                            {user.affiliation && (
                                <div className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 truncate bg-gray-100 dark:bg-gray-700/60 px-2 py-1 rounded-md">
                                    <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
                                    <span className="truncate">{user.affiliation}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <NavigationSection
                user={user}
                navigationMap={navigationMap}
                isDesktopCollapsed={false}
                isTransitioning={false}
                isMobile={true}
            />

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto flex-shrink-0">
                <FooterContent />
            </div>
        </aside>
    );
};

const RoleTag = ({ role }: { role: string }) => {
    const getRoleInfo = (role: string) => {
        switch (role) {
            case 'author':
                return {
                    label: 'Author | Researcher',
                    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                };
            case 'editor':
                return {
                    label: 'Editor | Administrator',
                    color: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300'
                };
            default:
                return {
                    label: role.charAt(0).toUpperCase() + role.slice(1),
                    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700/60 dark:text-gray-300'
                };
        }
    };

    const roleInfo = getRoleInfo(role);

    return (
        <div className={`inline-flex items-center text-xs px-2 py-1 rounded-md font-medium ${roleInfo.color}`}>
            <User className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{roleInfo.label}</span>
        </div>
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
                "hidden lg:flex lg:flex-col fixed inset-y-0 left-0 z-40 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/95 backdrop-blur-sm shadow-md",
                "transform transition-all duration-300 ease-out",
                isDesktopCollapsed ? "w-16" : "w-72"
            )}
            style={{
                transitionTimingFunction: isDesktopCollapsed ?
                    "cubic-bezier(0.4, 0.0, 0.2, 1)" :
                    "cubic-bezier(0.05, 0.7, 0.1, 1.0)"
            }}
        >
            <div className={cn(
                "h-16 bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-700/90 dark:to-emerald-600/90 flex items-center transition-all duration-300 flex-shrink-0 shadow-sm",
                isDesktopCollapsed ? "px-2 justify-center" : "px-4 justify-between"
            )}>
                {isDesktopCollapsed ? (
                    <div className="flex justify-center w-full transition-all duration-300">
                        <Link href="/">
                            <ApplicationLogo
                                className="h-8 w-auto fill-current text-white filter drop-shadow-md"
                            />
                        </Link>
                    </div>
                ) : (
                    <Link href="/" className="flex items-center space-x-2 transition-all duration-300">
                        <ApplicationLogo
                            className="h-8 w-auto fill-current text-white filter drop-shadow-md"
                        />
                        <span className={cn(
                            "text-lg font-bold text-white tracking-tight transition-opacity duration-300",
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
                            "text-white hover:text-white hover:bg-white/20 transition-opacity duration-300",
                            isTransitioning ? "opacity-0" : "opacity-100"
                        )}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Collapse sidebar</span>
                    </Button>
                )}
            </div>

            {isDesktopCollapsed ? (
                <div className="flex justify-center py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDesktopSidebar}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                        <ChevronRight className="h-5 w-5" />
                        <span className="sr-only">Expand sidebar</span>
                    </Button>
                </div>
            ) : (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-800/50 backdrop-blur-sm flex-shrink-0 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 aspect-square flex-shrink-0 rounded-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900 dark:via-emerald-900 dark:to-teal-800 flex items-center justify-center text-green-700 dark:text-green-200 font-medium text-xl shadow-md ring-2 ring-white/20 dark:ring-black/20">
                            {user.firstname.charAt(0)}
                        </div>
                        <div className={cn(
                            "overflow-hidden transition-opacity duration-300",
                            isTransitioning ? "opacity-0" : "opacity-100"
                        )}>
                            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
                                {user.firstname} {user.lastname}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                            </p>
                            <div className="mt-2 gap-1 flex flex-col">
                                <RoleTag role={user.role} />
                                {user.affiliation && (
                                    <div className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 truncate bg-gray-100 dark:bg-gray-700/60 px-2 py-1 rounded-md">
                                        <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">{user.affiliation}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <NavigationSection
                user={user}
                navigationMap={navigationMap}
                isDesktopCollapsed={isDesktopCollapsed}
                isTransitioning={isTransitioning}
                isMobile={false}
            />

            {!isDesktopCollapsed && (
                <div className={cn(
                    "p-4 border-t border-gray-200 dark:border-gray-700 mt-auto flex-shrink-0 transition-opacity duration-300",
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
    isDesktopCollapsed,
    isTransitioning,
    isMobile = false
}: {
    user: UserType;
    navigationMap: NavigationMap;
    isDesktopCollapsed: boolean;
    isTransitioning: boolean;
    isMobile?: boolean;
}) => {
    return (
        <ScrollArea className="flex-1 overflow-y-auto">
            <div className={cn("py-4", isDesktopCollapsed ? "px-2" : "px-3")}>
                {navigationMap[user.role] && (
                    <div key={user.role} className="mb-8">
                        {!isDesktopCollapsed && !isMobile && (
                            <h3 className={cn(
                                "px-3 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2 transition-opacity duration-300",
                                isTransitioning ? "opacity-0" : "opacity-100"
                            )}>
                                <div className="h-0.5 w-3 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-full" />
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </h3>
                        )}
                        {isMobile && (
                            <h3 className="px-3 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <div className="h-0.5 w-3 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-full"></div>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </h3>
                        )}
                        <div className="space-y-1.5">
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
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3.5 shadow-inner">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 font-medium">
                SaliksikHub <span className="text-green-600 dark:text-green-400 font-semibold">v1.0</span>
            </p>
            <div className="flex items-center gap-3">
                <Link href="#" className="text-xs text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200">
                    Help & Support
                </Link>
                <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <Link href="#" className="text-xs text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200">
                    Feedback
                </Link>
            </div>
        </div>
    );
};

export function Sidebar({
    user,
    navigationMap,
    isMobileOpen,
    isDesktopCollapsed,
    closeMobileSidebar,
    toggleDesktopSidebar
}: SidebarProps) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showLabels, setShowLabels] = useState(!isDesktopCollapsed);

    useEffect(() => {
        if (isDesktopCollapsed) {
            setIsTransitioning(true);
            setShowLabels(false);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 300);
        } else {
            setIsTransitioning(true);
            setTimeout(() => {
                setShowLabels(true);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 200);
            }, 150);
        }
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
