import { Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Shield, Building2 } from "lucide-react";
import { PageProps } from "@/types";

export function UserDropdown({ user }: { user: PageProps['auth']['user'] & { avatar_url?: string } }) {
    const { post, processing } = useForm({});

    const handleLogout = () => {
        post(route('logout'));
    };

    const getFormattedRole = (role: string) => {
        switch (role) {
            case 'author':
                return 'Author | Researcher';
            case 'editor':
                return 'Editor | Administrator';
            case 'reviewer':
                return 'Reviewer';
            default:
                return role;
        }
    };

    const initials = `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-offset-0">
                    <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                        {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={`${user.firstname} ${user.lastname}`} />
                        ) : (
                            <AvatarFallback className="bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-800 dark:to-emerald-700 text-green-700 dark:text-green-300 font-medium">
                                {initials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                {/* User Info Header */}
                <div className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-gray-800">
                    <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-sm">
                        {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={`${user.firstname} ${user.lastname}`} />
                        ) : (
                            <AvatarFallback className="bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-800 dark:to-emerald-700 text-green-700 dark:text-green-300 text-lg font-medium">
                                {initials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {user.firstname} {user.lastname}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                        </span>
                        {/* Add affiliation */}
                        {user.affiliation && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                <Building2 className="h-3 w-3 mr-1" />
                                <span>{user.affiliation}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Simplified Menu - Only Profile and Logout */}
                <div className="p-1.5">
                    <Link href={route('profile.edit')} className="w-full">
                        <DropdownMenuItem className="cursor-pointer gap-3 py-2.5">
                            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span>My Profile</span>
                        </DropdownMenuItem>
                    </Link>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer gap-3 py-2.5 text-rose-600 dark:text-rose-400 mx-1.5"
                    onClick={handleLogout}
                    disabled={processing}
                >
                    <LogOut className="h-4 w-4" />
                    <span>{processing ? "Logging out..." : "Log Out"}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Footer with role */}
                <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-b-md">
                    <div className="flex items-center">
                        <Shield className="h-3 w-3 mr-1.5 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-600 dark:text-green-400">{getFormattedRole(user.role)}</span>
                    </div>
                    <div className="flex justify-between mt-1.5">
                        <span>SaliksikHub</span>
                        <span className="font-medium">v1.0</span>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}