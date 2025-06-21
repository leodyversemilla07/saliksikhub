import { Link } from '@inertiajs/react';
import { ChevronsUpDown, Settings, LogOut, User } from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from '@/components/ui/sidebar';
import ApplicationLogo from '@/components/application-logo';
import { User as UserType } from '@/types';

interface SidebarLinkType {
    href: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NavigationMap {
    [key: string]: SidebarLinkType[];
}

interface AuthenticatedSidebarProps {
    user: UserType;
    navigationMap: NavigationMap;
}

const UserFooter = ({ user }: { user: UserType }) => {
    const { isMobile } = useSidebar();

    // Get user initials
    const getInitials = (firstname: string, lastname: string) => {
        return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
    };

    // Get full name
    const getFullName = (firstname: string, lastname: string) => {
        return `${firstname} ${lastname}`;
    };

    // Format role display
    const formatRole = (role: string) => {
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="rounded-lg bg-green-600 text-white">
                                    {getInitials(user.firstname, user.lastname)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{getFullName(user.firstname, user.lastname)}</span>
                                <span className="truncate text-xs text-muted-foreground">{formatRole(user.role)} • SaliksikHub</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg bg-green-600 text-white">
                                        {getInitials(user.firstname, user.lastname)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{getFullName(user.firstname, user.lastname)}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href={route('profile.edit')} className="cursor-pointer">
                                    <User />
                                    Profile Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="#" className="cursor-pointer">
                                    <Settings />
                                    Account Settings
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut />
                                Sign Out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

export function AuthenticatedSidebar({
    user,
    navigationMap
}: AuthenticatedSidebarProps) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="bg-green-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <ApplicationLogo/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">SaliksikHub</span>
                                    <span className="truncate text-xs text-muted-foreground">Research Platform</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationMap[user.role] && navigationMap[user.role].map((link) => {
                                const isActive = route().current(link.href);
                                return (
                                    <SidebarMenuItem key={link.href}>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={isActive}
                                            tooltip={link.label}
                                        >
                                            <Link href={route(link.href)}>
                                                <link.icon />
                                                <span>{link.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
                <UserFooter user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
