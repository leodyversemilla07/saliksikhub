import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, GripVertical, MoreHorizontal, Plus, Pencil, Trash2, ExternalLink, Menu, MoveUp, MoveDown } from 'lucide-react';
import admin from '@/routes/admin';
import { useState } from 'react';

interface Page {
    id: number;
    title: string;
    slug: string;
}

interface MenuItem {
    id: number;
    label: string;
    url: string | null;
    journal_page_id: number | null;
    page: Page | null;
    parent_id: number | null;
    location: string;
    order: number;
    is_active: boolean;
    open_in_new_tab: boolean;
    children?: MenuItem[];
}

interface Journal {
    id: number;
    name: string;
}

interface Props {
    journal: Journal;
    menuItems: MenuItem[];
    pages: Page[];
}

export default function MenusIndex({ journal, menuItems, pages }: Props) {
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
    const [deletingMenuId, setDeletingMenuId] = useState<number | null>(null);

    const breadcrumbItems = [
        { label: 'Admin', href: admin.institutions.index.url() },
        { label: 'Journals', href: admin.journals.index.url() },
        { label: journal.name, href: admin.journals.edit.url({ journal: journal.id }) },
        { label: 'CMS - Menus' },
    ];

    const addForm = useForm({
        label: '',
        url: '',
        journal_page_id: '',
        location: 'header',
        is_active: true,
        open_in_new_tab: false,
    });

    const editForm = useForm({
        label: '',
        url: '',
        journal_page_id: '',
        location: 'header',
        is_active: true,
        open_in_new_tab: false,
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(`/admin/journals/${journal.id}/cms/menus`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddMenu(false);
                addForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMenuItem) return;
        editForm.put(`/admin/journals/${journal.id}/cms/menus/${editingMenuItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingMenuItem(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (menuId: number) => {
        router.delete(`/admin/journals/${journal.id}/cms/menus/${menuId}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingMenuId(null),
        });
    };

    const handleMoveMenu = (menuId: number, direction: 'up' | 'down') => {
        const currentIndex = menuItems.findIndex(m => m.id === menuId);
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === menuItems.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const newOrder = [...menuItems];
        const [removed] = newOrder.splice(currentIndex, 1);
        newOrder.splice(newIndex, 0, removed);

        router.put(`/admin/journals/${journal.id}/cms/menus/reorder`, {
            menus: newOrder.map((m, i) => ({ id: m.id, order: i })),
        }, {
            preserveScroll: true,
        });
    };

    const openEditDialog = (menuItem: MenuItem) => {
        setEditingMenuItem(menuItem);
        editForm.setData({
            label: menuItem.label,
            url: menuItem.url || '',
            journal_page_id: menuItem.journal_page_id?.toString() || '',
            location: menuItem.location,
            is_active: menuItem.is_active,
            open_in_new_tab: menuItem.open_in_new_tab,
        });
    };

    const headerItems = menuItems.filter(m => m.location === 'header' || m.location === 'both');
    const footerItems = menuItems.filter(m => m.location === 'footer' || m.location === 'both');

    return (
        <AppLayout breadcrumbItems={breadcrumbItems}>
            <Head title={`Menus - ${journal.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={admin.journals.edit.url({ journal: journal.id })}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Menu Management</h1>
                            <p className="text-muted-foreground">{journal.name}</p>
                        </div>
                    </div>
                </div>

                {/* CMS Navigation */}
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/admin/journals/${journal.id}/cms/pages`}>
                            Pages
                        </Link>
                    </Button>
                    <Button variant="default">
                        Menus
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/journals/${journal.id}/cms/theme`}>
                            Theme
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Header Menu */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Menu className="h-5 w-5" />
                                    Header Menu
                                </CardTitle>
                                <CardDescription>
                                    Navigation items displayed in the header
                                </CardDescription>
                            </div>
                            <Dialog open={showAddMenu} onOpenChange={setShowAddMenu}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Item
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <form onSubmit={handleAddSubmit}>
                                        <DialogHeader>
                                            <DialogTitle>Add Menu Item</DialogTitle>
                                            <DialogDescription>
                                                Add a new item to the navigation menu
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="add-label">Label</Label>
                                                <Input
                                                    id="add-label"
                                                    value={addForm.data.label}
                                                    onChange={(e) => addForm.setData('label', e.target.value)}
                                                    placeholder="Menu item label"
                                                />
                                                {addForm.errors.label && (
                                                    <p className="text-sm text-destructive">{addForm.errors.label}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="add-page">Link to Page</Label>
                                                <select
                                                    id="add-page"
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={addForm.data.journal_page_id}
                                                    onChange={(e) => addForm.setData('journal_page_id', e.target.value)}
                                                >
                                                    <option value="">Select a page (optional)</option>
                                                    {pages.map((page) => (
                                                        <option key={page.id} value={page.id}>
                                                            {page.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="add-url">Or Custom URL</Label>
                                                <Input
                                                    id="add-url"
                                                    value={addForm.data.url}
                                                    onChange={(e) => addForm.setData('url', e.target.value)}
                                                    placeholder="https://..."
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Leave empty if linking to a page
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="add-location">Location</Label>
                                                <select
                                                    id="add-location"
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={addForm.data.location}
                                                    onChange={(e) => addForm.setData('location', e.target.value)}
                                                >
                                                    <option value="header">Header Only</option>
                                                    <option value="footer">Footer Only</option>
                                                    <option value="both">Both</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        id="add-active"
                                                        checked={addForm.data.is_active}
                                                        onCheckedChange={(checked) => addForm.setData('is_active', checked)}
                                                    />
                                                    <Label htmlFor="add-active">Active</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        id="add-new-tab"
                                                        checked={addForm.data.open_in_new_tab}
                                                        onCheckedChange={(checked) => addForm.setData('open_in_new_tab', checked)}
                                                    />
                                                    <Label htmlFor="add-new-tab">Open in new tab</Label>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setShowAddMenu(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={addForm.processing}>
                                                {addForm.processing ? 'Adding...' : 'Add Item'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {headerItems.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No header menu items yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {headerItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                                                item.is_active ? 'bg-background' : 'bg-muted/50'
                                            }`}
                                        >
                                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate">{item.label}</span>
                                                    {item.open_in_new_tab && (
                                                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                                    )}
                                                    {!item.is_active && (
                                                        <Badge variant="outline" className="text-xs">Inactive</Badge>
                                                    )}
                                                    {item.location === 'both' && (
                                                        <Badge variant="secondary" className="text-xs">Header + Footer</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {item.page ? item.page.title : item.url}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleMoveMenu(item.id, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    <MoveUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleMoveMenu(item.id, 'down')}
                                                    disabled={index === headerItems.length - 1}
                                                >
                                                    <MoveDown className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => setDeletingMenuId(item.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Footer Menu */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Menu className="h-5 w-5" />
                                Footer Menu
                            </CardTitle>
                            <CardDescription>
                                Navigation items displayed in the footer
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {footerItems.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No footer menu items yet.</p>
                                    <p className="text-xs mt-1">Add items with "Footer Only" or "Both" location</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {footerItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                                                item.is_active ? 'bg-background' : 'bg-muted/50'
                                            }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate">{item.label}</span>
                                                    {item.open_in_new_tab && (
                                                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                                    )}
                                                    {!item.is_active && (
                                                        <Badge variant="outline" className="text-xs">Inactive</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {item.page ? item.page.title : item.url}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Menu Dialog */}
            <Dialog open={editingMenuItem !== null} onOpenChange={() => setEditingMenuItem(null)}>
                <DialogContent>
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle>Edit Menu Item</DialogTitle>
                            <DialogDescription>
                                Update menu item settings
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-label">Label</Label>
                                <Input
                                    id="edit-label"
                                    value={editForm.data.label}
                                    onChange={(e) => editForm.setData('label', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-page">Link to Page</Label>
                                <select
                                    id="edit-page"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editForm.data.journal_page_id}
                                    onChange={(e) => editForm.setData('journal_page_id', e.target.value)}
                                >
                                    <option value="">Select a page (optional)</option>
                                    {pages.map((page) => (
                                        <option key={page.id} value={page.id}>
                                            {page.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-url">Or Custom URL</Label>
                                <Input
                                    id="edit-url"
                                    value={editForm.data.url}
                                    onChange={(e) => editForm.setData('url', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-location">Location</Label>
                                <select
                                    id="edit-location"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editForm.data.location}
                                    onChange={(e) => editForm.setData('location', e.target.value)}
                                >
                                    <option value="header">Header Only</option>
                                    <option value="footer">Footer Only</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="edit-active"
                                        checked={editForm.data.is_active}
                                        onCheckedChange={(checked) => editForm.setData('is_active', checked)}
                                    />
                                    <Label htmlFor="edit-active">Active</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="edit-new-tab"
                                        checked={editForm.data.open_in_new_tab}
                                        onCheckedChange={(checked) => editForm.setData('open_in_new_tab', checked)}
                                    />
                                    <Label htmlFor="edit-new-tab">Open in new tab</Label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingMenuItem(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Menu Dialog */}
            <AlertDialog open={deletingMenuId !== null} onOpenChange={() => setDeletingMenuId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this menu item? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deletingMenuId && handleDelete(deletingMenuId)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
