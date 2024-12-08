// UserManagement.tsx
import { useState, FC } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/Components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/Components/ui/table';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Edit, Trash2, PlusCircle, Bell, Settings } from 'lucide-react';

enum UserRole {
    ADMIN = "admin",
    REVIEWER = "reviewer",
    EDITOR = "editor",
    AUTHOR = "author",
}

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    roles: UserRole[];
    created_at: string;
    updated_at: string;
}

const AddUserDialog: FC = () => {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [UserRole.AUTHOR]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
            preserveScroll: true
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" /> Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold">Add New User</DialogTitle>
                    <DialogDescription className="text-base">
                        Create a new user account and assign roles
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstname" className="text-sm font-medium">First Name</Label>
                                <Input
                                    id="firstname"
                                    value={data.firstname}
                                    onChange={e => setData('firstname', e.target.value)}
                                    className="w-full"
                                />
                                {errors.firstname && (
                                    <p className="text-destructive text-sm">{errors.firstname}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname" className="text-sm font-medium">Last Name</Label>
                                <Input
                                    id="lastname"
                                    value={data.lastname}
                                    onChange={e => setData('lastname', e.target.value)}
                                    className="w-full"
                                />
                                {errors.lastname && (
                                    <p className="text-destructive text-sm">{errors.lastname}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full"
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full"
                                />
                                {errors.password && (
                                    <p className="text-destructive text-sm">{errors.password}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full"
                                />
                                {errors.password_confirmation && (
                                    <p className="text-destructive text-sm">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-medium">User Role</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.values(UserRole).map((role) => (
                                    <div
                                        key={role}
                                        onClick={() => setData('roles', [role])}
                                        className={`
                                            flex items-center justify-center p-3 rounded-lg border-2
                                            transition-all duration-200 cursor-pointer
                                            ${data.roles.includes(role)
                                                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                                : 'border-input hover:border-primary/50 hover:bg-muted'}
                                        `}
                                    >
                                        <div className="font-medium capitalize">{role}</div>
                                    </div>
                                ))}
                            </div>
                            {errors.roles && (
                                <p className="text-destructive text-sm">{errors.roles}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Creating User...
                                </>
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

// Update form data in EditUserDialog
const EditUserDialog: FC<{ user: User }> = ({ user }) => {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        ...user,
        password: '',
        password_confirmation: '',
        roles: Array.isArray(user.roles) ? user.roles : [user.roles]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.users.update', user.id), {
            onSuccess: () => setOpen(false),
            preserveScroll: true
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="hover:bg-primary/10 transition-colors">
                    <Edit className="w-4 h-4 mr-1.5" /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold">Edit User Account</DialogTitle>
                    <DialogDescription className="text-base">
                        Update user profile information, role, and optionally change password
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-firstname">First Name</Label>
                                <Input
                                    id="edit-firstname"
                                    value={data.firstname}
                                    onChange={e => setData('firstname', e.target.value)}
                                />
                                {errors.firstname && (
                                    <p className="text-destructive text-sm">{errors.firstname}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-lastname">Last Name</Label>
                                <Input
                                    id="edit-lastname"
                                    value={data.lastname}
                                    onChange={e => setData('lastname', e.target.value)}
                                />
                                {errors.lastname && (
                                    <p className="text-destructive text-sm">{errors.lastname}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Optional Password Change */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Change Password (Optional)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-password">New Password</Label>
                                <Input
                                    id="edit-password"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Leave blank to keep current"
                                />
                                {errors.password && (
                                    <p className="text-destructive text-sm">{errors.password}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-password-confirm">Confirm New Password</Label>
                                <Input
                                    id="edit-password-confirm"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-4">
                        <h3 className="font-medium">User Role</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(UserRole).map((role) => (
                                <div
                                    key={role}
                                    onClick={() => setData('roles', [role])}
                                    className={`
                                        flex items-center justify-center p-3 rounded-lg border-2
                                        transition-all duration-200 cursor-pointer
                                        ${data.roles.includes(role)
                                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                            : 'border-input hover:border-primary/50 hover:bg-muted'}
                                    `}
                                >
                                    <div className="font-medium capitalize">{role}</div>
                                </div>
                            ))}
                        </div>
                        {errors.roles && (
                            <p className="text-destructive text-sm">{errors.roles}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving Changes...
                                </div>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
};

// DeleteUserDialog component
const DeleteUserDialog: FC<{ user: User }> = ({ user }) => {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('admin.users.destroy', user.id), {
            onSuccess: () => setOpen(false),
            preserveScroll: true
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" className="hover:bg-destructive/90 transition-colors">
                    <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="space-y-4">
                    <AlertDialogTitle className="text-2xl font-bold text-destructive">
                        Delete User Account
                    </AlertDialogTitle>
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="flex flex-col space-y-2">
                            <span className="font-semibold text-lg">
                                {user.firstname} {user.lastname}
                            </span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                            <div className="flex gap-2 mt-1">
                                {Array.isArray(user.roles) && user.roles.map(role => (
                                    <span key={role} className="inline-flex items-center rounded-full bg-destructive/20 px-2.5 py-0.5 text-xs font-medium text-destructive">
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <AlertDialogDescription className="text-base space-y-2">
                        <p className="font-medium text-destructive">Warning:</p>
                        <p>This action will permanently delete:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>User account and profile information</li>
                            <li>All associated data and content</li>
                            <li>User permissions and role assignments</li>
                        </ul>
                        <p className="font-medium mt-2">This action cannot be undone.</p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel className="hover:bg-muted/80 transition-colors">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={processing}
                        className="bg-destructive hover:bg-destructive/90 transition-colors"
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
                            'Delete Account'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default function UserManagement({ users }: { users: User[] }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            }
        >
            <Card className="m-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                    <div>
                        <CardTitle className="text-3xl font-bold tracking-tight">User Management</CardTitle>
                        <CardDescription className="text-base text-muted-foreground mt-2">
                            Manage system users and their access permissions
                        </CardDescription>
                    </div>
                    <AddUserDialog />
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/60">
                                    <TableHead className="py-4 font-semibold text-sm">NAME</TableHead>
                                    <TableHead className="font-semibold text-sm">EMAIL</TableHead>
                                    <TableHead className="font-semibold text-sm">ROLES</TableHead>
                                    <TableHead className="font-semibold text-sm">CREATED</TableHead>
                                    <TableHead className="font-semibold text-sm">UPDATED</TableHead>
                                    <TableHead className="text-right font-semibold text-sm">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-muted/40 transition-all duration-200">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-primary font-medium">
                                                        {user.firstname[0]}{user.lastname[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{`${user.firstname} ${user.lastname}`}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-muted-foreground font-medium">{user.email}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1.5">
                                                {Array.isArray(user.roles) ? user.roles.map(role => (
                                                    <span
                                                        key={role}
                                                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 
                                                        text-xs font-semibold text-primary border border-primary/20"
                                                    >
                                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                                    </span>
                                                )) : (
                                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 
                                                    text-xs font-semibold text-primary border border-primary/20">
                                                        {user.roles}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {new Date(user.created_at).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(user.created_at).getFullYear()}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {new Date(user.updated_at).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(user.updated_at).getFullYear()}
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}