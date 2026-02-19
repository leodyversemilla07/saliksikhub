import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/components/application-logo';
import JournalSwitcher from '@/components/journal-switcher';
import { NavUser } from './nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { User, UserRole, PageProps } from '@/types';

interface SidebarLinkType {
    href: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

type NavigationMap = Record<UserRole, SidebarLinkType[]>;

interface AppSidebarProps {
    user: User & { role: UserRole };
    navigationMap: NavigationMap;
}

export function AppSidebar({
    user,
    navigationMap
}: AppSidebarProps) {
    const { currentJournal } = usePage<PageProps>().props;
    const platformName = currentJournal?.abbreviation ?? currentJournal?.name ?? 'Research Platform';

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <ApplicationLogo />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{platformName}</span>
                                    <span className="truncate text-xs text-muted-foreground">Research Platform</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Journal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <JournalSwitcher className="w-full" />
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationMap[user.role]?.map((link: SidebarLinkType) => {
                                const isActive = window.location.pathname === link.href;
                                return (
                                    <SidebarMenuItem key={link.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={link.label}
                                        >
                                            <Link href={link.href}>
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
