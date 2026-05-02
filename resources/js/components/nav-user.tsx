import { Link } from '@inertiajs/react';
import { ChevronsUpDown, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
    useSidebar,
} from '@/components/ui/sidebar';
import { logout } from '@/routes';
import profile from '@/routes/profile';
import type { User as UserType } from '@/types';

interface NavUserProps {
    user: UserType;
}

type UserRole =
    | 'managing_editor'
    | 'editor_in_chief'
    | 'associate_editor'
    | 'language_editor'
    | 'author'
    | 'reviewer';

const ROLE_LABELS: Record<UserRole, string> = {
    managing_editor: 'Managing Editor',
    editor_in_chief: 'Editor-in-Chief',
    associate_editor: 'Associate Editor',
    language_editor: 'Language Editor',
    author: 'Author',
    reviewer: 'Reviewer',
};

export function NavUser({ user }: NavUserProps) {
    const { isMobile } = useSidebar();

    // Memoize computed values for performance
    const initials =
        `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
    const fullName = `${user.firstname} ${user.lastname}`;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                aria-label="User menu"
                            />
                        }
                    >
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback className="rounded-lg bg-green-600 text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span
                                className="truncate font-medium"
                                title={fullName}
                            >
                                {fullName}
                            </span>
                            <span
                                className="truncate text-xs text-muted-foreground"
                                title={
                                    user.role &&
                                    ROLE_LABELS[user.role as UserRole]
                                        ? ROLE_LABELS[user.role as UserRole]
                                        : user.role
                                }
                            >
                                {user.role && ROLE_LABELS[user.role as UserRole]
                                    ? ROLE_LABELS[user.role as UserRole]
                                    : user.role}
                            </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
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
                                    <span
                                        className="truncate font-medium"
                                        title={fullName}
                                    >
                                        {fullName}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                render={
                                    <Link
                                        href={profile.edit.url()}
                                        className="cursor-pointer"
                                    />
                                }
                            >
                                <User className="mr-2 size-4" />
                                Profile Settings
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="w-full"
                            render={
                                <Link
                                    href={logout.url()}
                                    method="post"
                                    as="button"
                                    className="flex w-full cursor-pointer items-center text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                />
                            }
                        >
                            <LogOut className="mr-2 size-4" />
                            <span className="ml-2">Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
