import React, { useState, useContext, createContext, FC } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { UserCircle2, Edit, Trash2, PlusCircle } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*** ENUMS AND INTERFACES ***/
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

interface UserManagementContextType {
    users: User[];
    addUser: (newUser: Partial<User>) => void;
    updateUser: (updatedUser: User) => void;
    deleteUser: (userId: number) => void;
}

/*** CONTEXT AND PROVIDER ***/
const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

const useUserManagement = () => {
    const context = useContext(UserManagementContext);
    if (!context) {
        throw new Error('useUserManagement must be used within a UserManagementProvider');
    }
    return context;
};

/*** MAIN COMPONENT ***/
const UserManagement: FC<UserManagementContextType> = ({ users, addUser, updateUser, deleteUser }) => {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">User Management</h2>}
        >
            <UserManagementContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
                <div className="p-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <UserCircle2 className="mr-2" /> User Management
                            </CardTitle>
                            <CardDescription>Manage and control access for Research Journal System users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end mb-4">
                                <AddUserDialog />
                            </div>
                            <UserTable />
                        </CardContent>
                    </Card>
                </div>
            </UserManagementContext.Provider>
        </AuthenticatedLayout>
    );
};

/*** COMPONENTS ***/
const UserTable: FC = () => {
    const { users, deleteUser } = useUserManagement();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.roles.join(', ')}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(user.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                            <EditUserDialog user={user} />
                            <DeleteUserDialog user={user} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const AddUserDialog: FC = () => {
    const { addUser } = useUserManagement();
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState<Partial<User>>({
        firstname: '',
        lastname: '',
        email: '',
        roles: [UserRole.AUTHOR]
    });

    const handleSubmit = () => {
        addUser(newUser);
        setOpen(false);
        setNewUser({ firstname: '', lastname: '', email: '', roles: [UserRole.AUTHOR] });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircle className="mr-2" /> Add User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account</DialogDescription>
                </DialogHeader>
                <UserForm user={newUser} setUser={setNewUser} />
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create User</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const EditUserDialog: FC<{ user: User }> = ({ user }) => {
    const { updateUser } = useUserManagement();
    const [open, setOpen] = useState(false);
    const [editedUser, setEditedUser] = useState<Partial<User>>({ ...user });

    const handleSubmit = () => {
        updateUser(editedUser as User); // Cast to User for submission
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>Modify user details</DialogDescription>
                </DialogHeader>
                <UserForm user={editedUser} setUser={setEditedUser} />
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const DeleteUserDialog: FC<{ user: User }> = ({ user }) => {
    const { deleteUser } = useUserManagement();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        deleteUser(user.id);
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete {`${user.firstname} ${user.lastname}`}? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete User</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const UserForm: FC<{ user: Partial<User>; setUser: React.Dispatch<React.SetStateAction<Partial<User>>> }> = ({ user, setUser }) => {
    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstname" className="text-right">Firstname</Label>
                <Input
                    id="firstname"
                    value={user.firstname || ''}
                    onChange={(e) => setUser((prev) => ({ ...prev, firstname: e.target.value }))}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastname" className="text-right">Lastname</Label>
                <Input
                    id="lastname"
                    value={user.lastname || ''}
                    onChange={(e) => setUser((prev) => ({ ...prev, lastname: e.target.value }))}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <select
                    id="role"
                    value={user.roles?.[0] || ''}
                    onChange={(e) => setUser((prev) => ({ ...prev, roles: [e.target.value as UserRole] }))}
                    className="col-span-3 p-2 border rounded"
                >
                    {Object.values(UserRole).map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default UserManagement;
