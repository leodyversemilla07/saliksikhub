import { useState, useEffect, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import {
    Edit, Trash2,
    Search, Filter, ChevronDown, Download, UserPlus,
    Users, Shield
} from 'lucide-react';
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { toast } from 'sonner';

// Define interfaces for pagination and user data
interface PaginatedUser {
    data: User[];
    current_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    last_page: number;
    path: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    first_page_url: string;
    last_page_url: string;
    prev_page_url: string | null;
    next_page_url: string | null;
}

enum UserRole {
    EDITOR = "editor",
    AUTHOR = "author",
}

// Add User Dialog Component
const AddUserDialog: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: UserRole.AUTHOR,
        affiliation: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('editor.users.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
                toast("User has been successfully created.");
            },
            onError: () => {
                toast("Failed to create user. Please check the form and try again.");
            },
            preserveScroll: true,
            preserveState: false,
            only: ['users'],
        });
    };

    const roleConfig = [
        {
            role: UserRole.AUTHOR,
            icon: <UserPlus className="h-4 w-4 mb-1" />,
            title: 'Author',
            description: 'Can create and manage their own content'
        },
        {
            role: UserRole.EDITOR,
            icon: <Shield className="h-4 w-4 mb-1" />,
            title: 'Editor',
            description: 'Full content management access'
        }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white">
                    <UserPlus className="h-4 w-4" /> Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-xl font-bold">Add New User</DialogTitle>
                    <DialogDescription className="text-sm">
                        Create a new user account and assign roles
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-green-50/70 dark:bg-green-900/20 rounded-lg p-3 mb-2 flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center">
                                <UserPlus className="h-5 w-5 text-green-700 dark:text-green-300" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">New User Account</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Fill in the details below</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="firstname" className="text-xs mb-1">First Name</Label>
                                <Input
                                    id="firstname"
                                    placeholder="Enter first name"
                                    value={data.firstname}
                                    onChange={e => setData('firstname', e.target.value)}
                                    className="h-9"
                                />
                                {errors.firstname && (
                                    <p className="text-destructive text-xs mt-1">{errors.firstname}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="lastname" className="text-xs mb-1">Last Name</Label>
                                <Input
                                    id="lastname"
                                    placeholder="Enter last name"
                                    value={data.lastname}
                                    onChange={e => setData('lastname', e.target.value)}
                                    className="h-9"
                                />
                                {errors.lastname && (
                                    <p className="text-destructive text-xs mt-1">{errors.lastname}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-xs mb-1">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="h-9"
                            />
                            {errors.email && (
                                <p className="text-destructive text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="affiliation" className="text-xs mb-1">Affiliation (Optional)</Label>
                            <Input
                                id="affiliation"
                                placeholder="University, organization, etc."
                                value={data.affiliation}
                                onChange={e => setData('affiliation', e.target.value)}
                                className="h-9"
                            />
                            {errors.affiliation && (
                                <p className="text-destructive text-xs mt-1">{errors.affiliation}</p>
                            )}
                        </div>

                        <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium mb-2">Set Password</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="password" className="text-xs mb-1">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="h-9"
                                    />
                                    {errors.password && (
                                        <p className="text-destructive text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="password_confirmation" className="text-xs mb-1">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Confirm password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium mb-2">User Role</h3>
                            <div className="flex gap-3">
                                {roleConfig.map(({ role, icon, title, description }) => (
                                    <div
                                        key={role}
                                        onClick={() => setData('role', role)}
                                        className={`
                                        flex-1 flex flex-row items-center p-2 rounded-lg border-2 
                                        transition-all duration-200 cursor-pointer
                                        ${data.role === role
                                                ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/30 dark:text-green-300'
                                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'}
                                        `}
                                    >
                                        <div className="mr-2">
                                            {icon}
                                        </div>
                                        <div className="text-left">
                                            <h4 className="text-sm font-medium">{title}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.role && (
                                <p className="text-destructive text-xs mt-1">{errors.role}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            size="sm"
                            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating User...
                                </span>
                            ) : (
                                'Create User'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Edit User Dialog Component
const EditUserDialog: React.FC<{ user: User }> = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        affiliation: user.affiliation || ''
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open) {
            setFormData({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: '',
                password_confirmation: '',
                role: user.role,
                affiliation: user.affiliation || ''
            });
            setErrors({});
        }
    }, [open, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (role: string) => {
        setFormData(prev => ({ ...prev, role }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.put(route('editor.users.update', user.id), formData, {
            onSuccess: () => {
                setOpen(false);
                setProcessing(false);
                toast("User has been successfully updated.");
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
                toast("Failed to update user information.");
            },
            preserveScroll: true
        });
    };

    const roleConfig = [
        {
            role: UserRole.AUTHOR,
            icon: <UserPlus className="h-4 w-4 mb-1" />,
            title: 'Author',
            description: 'Can create and manage their own content'
        },
        {
            role: UserRole.EDITOR,
            icon: <Shield className="h-4 w-4 mb-1" />,
            title: 'Editor',
            description: 'Full content management access'
        }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 transition-colors w-9 h-9 p-0"
                        >
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={5}>
                    <p className="font-medium">Edit User</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent className="max-w-xl">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-xl font-bold">Edit User Account</DialogTitle>
                    <DialogDescription className="text-sm">
                        Update user profile information, role, and optionally change password
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 mb-2 flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center">
                                <span className="text-green-700 dark:text-green-300 font-medium">{user.firstname[0]}{user.lastname[0]}</span>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{`${user.firstname} ${user.lastname}`}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="edit-firstname" className="text-xs mb-1">First Name</Label>
                                <Input
                                    id="edit-firstname"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="h-9"
                                />
                                {errors.firstname && (
                                    <p className="text-destructive text-xs mt-1">{errors.firstname}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="edit-lastname" className="text-xs mb-1">Last Name</Label>
                                <Input
                                    id="edit-lastname"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="h-9"
                                />
                                {errors.lastname && (
                                    <p className="text-destructive text-xs mt-1">{errors.lastname}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="edit-email" className="text-xs mb-1">Email Address</Label>
                            <Input
                                id="edit-email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="h-9"
                            />
                            {errors.email && (
                                <p className="text-destructive text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="edit-affiliation" className="text-xs mb-1">Affiliation (Optional)</Label>
                            <Input
                                id="edit-affiliation"
                                name="affiliation"
                                value={formData.affiliation}
                                onChange={handleChange}
                                className="h-9"
                                placeholder="University, organization, etc."
                            />
                        </div>

                        <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium mb-2">Change Password (Optional)</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="edit-password" className="text-xs mb-1">New Password</Label>
                                    <Input
                                        id="edit-password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                        className="h-9"
                                    />
                                    {errors.password && (
                                        <p className="text-destructive text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit-password-confirm" className="text-xs mb-1">Confirm Password</Label>
                                    <Input
                                        id="edit-password-confirm"
                                        name="password_confirmation"
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                        className="h-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium mb-2">User Role</h3>
                            <div className="flex gap-3">
                                {roleConfig.map(({ role, icon, title, description }) => (
                                    <div
                                        key={role}
                                        onClick={() => handleRoleChange(role)}
                                        className={`
                                        flex-1 flex flex-row items-center p-2 rounded-lg border-2 
                                        transition-all duration-200 cursor-pointer
                                        ${formData.role === role
                                                ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/30 dark:text-green-300'
                                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'}
                                        `}
                                    >
                                        <div className="mr-2">
                                            {icon}
                                        </div>
                                        <div className="text-left">
                                            <h4 className="text-sm font-medium">{title}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.role && (
                                <p className="text-destructive text-xs mt-1">{errors.role}</p>
                            )}
                        </div>

                        <input type="hidden" name="role" value={formData.role} />
                    </div>
                </form>

                <DialogFooter className="gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white"
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Delete User Dialog Component
const DeleteUserDialog: React.FC<{ user: User }> = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(route('editor.users.destroy', user.id), {
            onSuccess: () => {
                setOpen(false);
                setProcessing(false);
                toast("User has been successfully deleted.");
            },
            onError: () => {
                setProcessing(false);
                toast("Failed to delete user. Please try again.");
            },
            preserveScroll: true
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="hover:bg-destructive/90 transition-colors w-9 h-9 p-0"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={5}>
                    <p className="font-medium">Delete User</p>
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-xl font-bold text-destructive">
                        Delete User Account
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </AlertDialogDescription>

                    <div className="bg-destructive/10 dark:bg-destructive/20 rounded-lg p-4 border border-destructive/20 dark:border-destructive/30 mt-2">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-100 to-pink-200 dark:from-red-900/60 dark:to-pink-800/60 flex items-center justify-center shadow-sm">
                                <span className="text-red-700 dark:text-red-300 font-medium text-lg">
                                    {user.firstname[0]}{user.lastname[0]}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100 text-lg">
                                    {user.firstname} {user.lastname}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-destructive/20 text-destructive">
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                    {user.affiliation && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {user.affiliation}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 space-y-3">
                        <div className="font-medium text-destructive flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Warning</span>
                        </div>
                        <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                            <p>Deleting this user will permanently remove:</p>
                            <ul className="list-disc list-inside space-y-1 pl-1">
                                <li>User account and profile information</li>
                                <li>All content created by this user</li>
                                <li>Access permissions and role assignments</li>
                            </ul>
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-3 pt-2">
                    <AlertDialogCancel
                        className="hover:bg-muted/80 transition-colors"
                        id="cancel-delete"
                        name="cancel-delete"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={processing}
                        className="bg-destructive hover:bg-destructive/90 transition-colors"
                        id="confirm-delete"
                        name="confirm-delete"
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Deleting...
                            </span>
                        ) : (
                            'Delete User'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// Bulk Delete Warning Component
interface BulkDeleteWarningProps {
    selectedCount: number;
}

const BulkDeleteWarning: React.FC<BulkDeleteWarningProps> = ({ selectedCount }) => {
    const pluralize = (count: number, singular: string, plural: string) =>
        count === 1 ? singular : plural;

    return (
        <>
            <div
                className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mt-4"
                role="alert"
                aria-live="polite"
            >
                <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-lg">
                        {selectedCount} {pluralize(selectedCount, 'user', 'users')} selected
                    </span>
                    <div className="flex gap-2 mt-1">
                        <span className="inline-flex items-center rounded-full bg-destructive/20 px-2.5 py-0.5 text-xs font-medium text-destructive">
                            Bulk Action
                        </span>
                    </div>
                </div>
            </div>

            <div className="font-medium text-destructive my-4">Warning:</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-gray-600 dark:text-gray-400" aria-label="Deletion consequences">
                <li>User {pluralize(selectedCount, 'account', 'accounts')} and profile information</li>
                <li>All associated data and content</li>
                <li>User permissions and role assignments</li>
            </ul>
            <div className="font-medium text-destructive mt-3">This action cannot be undone.</div>
        </>
    );
};

// Debounce Hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Main User Management Component
export default function UserManagement({ users }: { users: PaginatedUser }) {
    const safeUsers = useMemo(() => ({
        data: Array.isArray(users?.data) ? users.data : [],
        current_page: users?.current_page ?? 1,
        from: users?.from ?? 1,
        to: users?.to ?? 10,
        total: users?.total ?? 0,
        per_page: users?.per_page ?? 10,
        last_page: users?.last_page ?? 1,
        path: users?.path ?? '',
        links: Array.isArray(users?.links) ? users.links : [],
        first_page_url: users?.first_page_url ?? null,
        last_page_url: users?.last_page_url ?? null,
        prev_page_url: users?.prev_page_url ?? null,
        next_page_url: users?.next_page_url ?? null
    }), [users]);

    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [perPage, setPerPage] = useState(safeUsers.per_page);

    const perPageOptions = [10, 25, 50, 100];

    const filteredUsers = useMemo(() => {
        let results = safeUsers.data;

        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();
            results = results.filter(user =>
                user.firstname.toLowerCase().includes(term) ||
                user.lastname.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
            );
        }

        if (selectedRole) {
            results = results.filter(user => user.role === selectedRole);
        }

        return results;
    }, [debouncedSearchTerm, selectedRole, safeUsers.data]);

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(user => user.id));
        }
    };

    const toggleSelectUser = (userId: number) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case UserRole.EDITOR:
                return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
            default:
                return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
        }
    };

    const handleBulkAction = (action: string) => {
        if (action === 'delete') {
            setBulkDeleteDialogOpen(true);
        }
    };

    const handleBulkDelete = () => {
        setIsBulkProcessing(true);

        router.post(route('editor.users.bulk-destroy'), {
            userIds: selectedUsers
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setBulkDeleteDialogOpen(false);
                setIsBulkProcessing(false);
                setSelectedUsers([]);
                toast(`${selectedUsers.length} user(s) deleted successfully.`);
            },
            onError: () => {
                setIsBulkProcessing(false);
                toast("Failed to delete users. Please try again.");
            }
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;

        try {
            const urlObj = new URL(url);
            const relativePath = urlObj.pathname + urlObj.search;
            setSelectedUsers([]);
            router.visit(relativePath, {
                preserveState: true,
                preserveScroll: true,
                only: ['users'],
            });
        } catch (error) {
            toast(`Navigation failed: Invalid URL. Error: ${error}`);
        }
    };

    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);

        const url = new URL(window.location.href);
        url.searchParams.set('per_page', newPerPage.toString());
        url.searchParams.set('page', '1');

        router.get(url.pathname + url.search, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const generatePagination = (currentPage: number, lastPage: number) => {
        const maxVisiblePages = 5;
        const delta = Math.floor(maxVisiblePages / 2);
        let range = [];

        if (lastPage <= maxVisiblePages) {
            range = Array.from({ length: lastPage }, (_, i) => i + 1);
            return range;
        }

        range.push(1);

        let rangeStart = Math.max(2, currentPage - delta);
        let rangeEnd = Math.min(lastPage - 1, currentPage + delta);

        if (currentPage - 1 <= delta) {
            rangeEnd = Math.min(lastPage - 1, 1 + maxVisiblePages - 2);
        }

        if (lastPage - currentPage <= delta) {
            rangeStart = Math.max(2, lastPage - (maxVisiblePages - 2));
        }

        if (rangeStart > 2) {
            range.push("ellipsis-start");
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
            range.push(i);
        }

        if (rangeEnd < lastPage - 1) {
            range.push("ellipsis-end");
        }

        if (lastPage > 1) {
            range.push(lastPage);
        }

        return range;
    };

    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
        },
        {
            label: 'User Management',
            href: route('editor.users.index'),
            current: true,
        },
    ];

    return (
        <AuthenticatedLayout breadcrumbItems={breadcrumbItems}>
            <Head title="User Management" />

            <div className="space-y-6">
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-lg font-semibold">User Accounts</CardTitle>
                                <CardDescription className="text-sm">
                                    Manage system users, permissions, and access control
                                </CardDescription>
                            </div>
                            <AddUserDialog />
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                            <div className="relative w-full sm:w-72 md:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-10">
                                            <Filter className="h-3.5 w-3.5 mr-2" />
                                            Filter
                                            <ChevronDown className="h-3.5 w-3.5 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className={!selectedRole ? "bg-gray-100 dark:bg-gray-800" : ""}
                                            onClick={() => setSelectedRole(null)}
                                        >
                                            All Roles
                                        </DropdownMenuItem>
                                        {Object.values(UserRole).map(role => (
                                            <DropdownMenuItem
                                                key={role}
                                                className={selectedRole === role ? "bg-gray-100 dark:bg-gray-800" : ""}
                                                onClick={() => setSelectedRole(role)}
                                            >
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="outline" size="sm" className="h-10">
                                    <Download className="h-3.5 w-3.5 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-between">
                                <span className="text-sm font-medium ml-2">
                                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleBulkAction('delete')}
                                    >
                                        Delete Selected
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="rounded-lg border shadow-sm">
                            <div className="w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/80 dark:bg-gray-800/50">
                                            <TableHead className="w-12 text-center">
                                                <Checkbox
                                                    checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                                    onCheckedChange={toggleSelectAll}
                                                    aria-label="Select all"
                                                    id="select-all-users"
                                                    name="select-all-users"
                                                />
                                            </TableHead>
                                            <TableHead className="py-3 font-semibold text-sm">NAME</TableHead>
                                            <TableHead className="font-semibold text-sm">EMAIL</TableHead>
                                            <TableHead className="font-semibold text-sm">AFFILIATION</TableHead>
                                            <TableHead className="font-semibold text-sm">ROLES</TableHead>
                                            <TableHead className="font-semibold text-sm">CREATED</TableHead>
                                            <TableHead className="font-semibold text-sm">UPDATED</TableHead>
                                            <TableHead className="text-right font-semibold text-sm">ACTIONS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <TableRow
                                                    key={user.id}
                                                    className={cn(
                                                        "hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-all duration-200",
                                                        selectedUsers.includes(user.id) && "bg-green-50/50 dark:bg-green-900/20"
                                                    )}
                                                >
                                                    <TableCell className="text-center">
                                                        <Checkbox
                                                            checked={selectedUsers.includes(user.id)}
                                                            onCheckedChange={() => toggleSelectUser(user.id)}
                                                            aria-label={`Select ${user.firstname}`}
                                                            id={`select-user-${user.id}`}
                                                            name={`select-user-${user.id}`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center shadow-sm">
                                                                <span className="text-green-700 dark:text-green-300 font-medium">
                                                                    {user.firstname[0]}{user.lastname[0]}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-gray-100">{`${user.firstname} ${user.lastname}`}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-gray-600 dark:text-gray-400 font-medium">{user.email}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            {user.affiliation || '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <span
                                                                className={cn(
                                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                                                    getRoleColor(user.role)
                                                                )}
                                                            >
                                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                }) : '-'}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {user.created_at ? new Date(user.created_at).getFullYear() : '-'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {user.updated_at ? new Date(user.updated_at).toLocaleDateString(undefined, {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                }) : '-'}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {user.updated_at ? new Date(user.updated_at).getFullYear() : '-'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <EditUserDialog user={user} />
                                                            <DeleteUserDialog user={user} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="h-32 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                                        <Users className="h-8 w-8 mb-2 opacity-40" />
                                                        <p className="text-base font-medium mb-1">No users found</p>
                                                        <p className="text-sm">Try adjusting your search or filters</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {filteredUsers.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4 border-t mt-4">
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Showing <span className="font-medium">
                                            {debouncedSearchTerm || selectedRole ? 1 : safeUsers.from}
                                        </span> to{' '}
                                        <span className="font-medium">
                                            {debouncedSearchTerm || selectedRole ?
                                                filteredUsers.length :
                                                safeUsers.to}
                                        </span> of{' '}
                                        <span className="font-medium">
                                            {debouncedSearchTerm || selectedRole ?
                                                filteredUsers.length :
                                                safeUsers.total}
                                        </span> users
                                    </p>

                                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Show</span>
                                        <Select value={String(perPage)} onValueChange={(value) => handlePerPageChange(value)}>
                                            <SelectTrigger className="h-8 w-16 border-gray-200 dark:border-gray-700 focus:ring-green-500">
                                                <SelectValue placeholder={perPage} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {perPageOptions.map(option => (
                                                        <SelectItem key={option} value={String(option)}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">per page</span>
                                    </div>
                                </div>

                                {!debouncedSearchTerm && !selectedRole && (
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/30 border border-green-200/70 dark:border-green-800/30 text-green-700 dark:text-green-300 rounded-md px-3 py-1.5 shadow-sm">
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium text-green-600/80 dark:text-green-400/70 mr-1">Page</span>
                                                <span className="font-bold text-green-700 dark:text-green-300">{safeUsers.current_page}</span>
                                            </div>
                                            <div className="h-3 w-px bg-green-200 dark:bg-green-700/50"></div>
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium text-green-600/80 dark:text-green-400/70 mr-1">of</span>
                                                <span className="font-bold text-green-700 dark:text-green-300">{safeUsers.last_page}</span>
                                            </div>
                                        </div>

                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => safeUsers.prev_page_url && handlePageChange(safeUsers.prev_page_url)}
                                                        className={cn(
                                                            "text-sm rounded-md py-1 px-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors",
                                                            !safeUsers.prev_page_url ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-green-600 dark:hover:text-green-400"
                                                        )}
                                                    />
                                                </PaginationItem>

                                                {safeUsers.last_page <= 10 ? (
                                                    safeUsers.links
                                                        .filter(link => !['&laquo; Previous', 'Next &raquo;', '« Previous', 'Next »'].includes(link.label))
                                                        .map((link, index) => {
                                                            if (link.label === '...') {
                                                                return (
                                                                    <PaginationItem key={`ellipsis-${index}`}>
                                                                        <span className="px-2">
                                                                            <PaginationEllipsis />
                                                                        </span>
                                                                    </PaginationItem>
                                                                );
                                                            }

                                                            return (
                                                                <PaginationItem key={`page-${link.label}`}>
                                                                    <PaginationLink
                                                                        onClick={() => link.url && handlePageChange(link.url)}
                                                                        isActive={link.active}
                                                                        className={cn(
                                                                            link.active && "bg-green-600 text-white hover:bg-green-700 hover:text-white",
                                                                            link.url ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                                                                        )}
                                                                    >
                                                                        {link.label}
                                                                    </PaginationLink>
                                                                </PaginationItem>
                                                            );
                                                        })
                                                ) : (
                                                    generatePagination(safeUsers.current_page, safeUsers.last_page).map((item, index) => {
                                                        if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                                                            return (
                                                                <PaginationItem key={`${item}-${index}`}>
                                                                    <span className="px-2">
                                                                        <PaginationEllipsis />
                                                                    </span>
                                                                </PaginationItem>
                                                            );
                                                        }

                                                        const page = item as number;
                                                        const isActive = page === safeUsers.current_page;
                                                        const pageUrl = `${safeUsers.path}?page=${page}`;

                                                        return (
                                                            <PaginationItem key={`page-${page}`}>
                                                                <PaginationLink
                                                                    onClick={() => handlePageChange(pageUrl)}
                                                                    isActive={isActive}
                                                                    className={cn(
                                                                        isActive && "bg-green-600 text-white hover:bg-green-700 hover:text-white",
                                                                        "cursor-pointer"
                                                                    )}
                                                                >
                                                                    {page}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        );
                                                    })
                                                )}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => safeUsers.next_page_url && handlePageChange(safeUsers.next_page_url)}
                                                        className={cn(
                                                            "text-sm rounded-md py-1 px-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors",
                                                            !safeUsers.next_page_url ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-green-600 dark:hover:text-green-400"
                                                        )}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </div>
                        )}

                    </CardContent>
                </Card>

                <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-bold text-destructive">
                                Delete Multiple Users
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                You are about to delete {selectedUsers.length} user account{selectedUsers.length > 1 ? 's' : ''}.
                            </AlertDialogDescription>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                This action cannot be undone.
                            </div>
                            <BulkDeleteWarning selectedCount={selectedUsers.length} />
                        </AlertDialogHeader>

                        <AlertDialogFooter className="gap-3">
                            <AlertDialogCancel
                                className="hover:bg-muted/80 transition-colors"
                                id="cancel-bulk-delete"
                                name="cancel-bulk-delete"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleBulkDelete}
                                disabled={isBulkProcessing}
                                className="bg-destructive hover:bg-destructive/90 transition-colors"
                                id="confirm-bulk-delete"
                                name="confirm-bulk-delete"
                            >
                                {isBulkProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Deleting...
                                    </span>
                                ) : (
                                    `Delete ${selectedUsers.length} User${selectedUsers.length > 1 ? 's' : ''}`
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AuthenticatedLayout>
    );
}