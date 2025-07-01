import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/components/application-logo';
import { NavUser } from './nav-user';
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
} from '@/components/ui/sidebar';
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
                                    <ApplicationLogo />
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
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
