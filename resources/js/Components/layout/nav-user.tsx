import { Link } from '@inertiajs/react';
import { ChevronsUpDown, LogOut, User } from 'lucide-react';
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
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar
} from '@/components/ui/sidebar';
import { User as UserType } from '@/types';

interface NavUserProps {
    user: UserType;
}

export function NavUser({ user }: NavUserProps) {
    const { isMobile } = useSidebar();

    // Memoize computed values for performance
    const initials = `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
    const fullName = `${user.firstname} ${user.lastname}`;
    const roleDisplay = user.role.charAt(0).toUpperCase() + user.role.slice(1);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            aria-label="User menu"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="rounded-lg bg-green-600 text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium" title={fullName}>{fullName}</span>
                                <span className="truncate text-xs text-muted-foreground" title={roleDisplay}>{roleDisplay} • SaliksikHub</span>
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
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium" title={fullName}>{fullName}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href={route('profile.edit')} className="cursor-pointer">
                                    <User className="mr-2 size-4" />
                                    Profile Settings
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="w-full">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                            >
                                <LogOut className="mr-2 size-4" />
                                <span className="ml-2">Sign Out</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
