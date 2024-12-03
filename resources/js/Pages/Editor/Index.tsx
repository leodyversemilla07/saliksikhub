'use client'

import { useState } from 'react'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import { Badge } from '@/Components/ui/badge'
import { CheckCircle, Clock, Edit, Eye, Filter, MoreHorizontal, Search, XCircle } from 'lucide-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { Inertia } from '@inertiajs/inertia'

type Manuscript = {
    id: number
    title: string
    user_id: number
    created_at: string
    updated_at: string
    status: 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected'
    authors: string | string[] | null
}

interface ManuscriptTableProps {
    manuscripts: Manuscript[]
}

export default function Index({ manuscripts }: ManuscriptTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<Manuscript['status'] | 'All'>('All')

    const filteredManuscripts = manuscripts.filter(manuscript =>
        manuscript.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || manuscript.status === statusFilter)
    )

    const getStatusColor = (status: Manuscript['status']) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-100 text-green-800'
            case 'Rejected':
                return 'bg-red-100 text-red-800'
            case 'Revision Required':
                return 'bg-yellow-100 text-yellow-800'
            case 'Under Review':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getAuthors = (authors: string | string[] | null) => {
        if (Array.isArray(authors)) {
            return authors;  // Already an array, return as is
        }
        if (typeof authors === 'string' && authors.trim()) {
            return authors.split(',').map((author) => author.trim()); // Split by comma if it's a string
        }
        return []; // Return empty array if null or empty string
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Submitted Manuscripts
                </h2>
            }
        >
            <Head title="Submitted Manuscripts" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card className="w-full">
                        <CardHeader>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <CardTitle className="text-xl sm:text-2xl font-bold">Submitted Manuscripts</CardTitle>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                    <div className="relative w-full sm:w-auto">
                                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                        <Input
                                            className="w-full sm:w-auto pl-8"
                                            placeholder="Search manuscripts..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                <Filter className="mr-2 h-4 w-4" />
                                                Filter
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {['All', 'Submitted', 'Under Review', 'Revision Required', 'Accepted', 'Rejected'].map((status) => (
                                                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status as any)}>
                                                    {status}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-left">ID</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Submitted</TableHead>
                                            <TableHead>Authors</TableHead>
                                            <TableHead>Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredManuscripts.map((manuscript) => (
                                            <TableRow key={manuscript.id} className="border-b hover:bg-gray-50">
                                                <TableCell className="font-medium text-left">{manuscript.id}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">{manuscript.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={`${getStatusColor(manuscript.status)} whitespace-nowrap`}>
                                                        {manuscript.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">{new Date(manuscript.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {getAuthors(manuscript.authors).length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {getAuthors(manuscript.authors).map((author, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {author}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">No co-authors</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {new Date(manuscript.updated_at).toLocaleDateString()} {/* Display updated_at */}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => Inertia.visit(route('editor.manuscripts.show', manuscript.id))}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => Inertia.put(`/editor/manuscripts/${manuscript.id}/approve`)}>
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => Inertia.put(`/editor/manuscripts/${manuscript.id}/reject`)}>
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Reject
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => Inertia.put(`/editor/manuscripts/${manuscript.id}/revise`)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Revise
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

