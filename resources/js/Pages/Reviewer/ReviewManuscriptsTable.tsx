import { useState } from 'react'
import { Eye, NotebookPen, Search } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Badge } from "@/Components/ui/badge"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Inertia } from '@inertiajs/inertia'
import { Head } from '@inertiajs/react'

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

export default function ManuscriptReviewTable({ manuscripts }: ManuscriptTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter] = useState<Manuscript['status'] | 'All'>('All')
    const filteredManuscripts = manuscripts.filter(manuscript =>
        manuscript.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || manuscript.status === statusFilter)
    )

    const getAuthors = (authors: string | string[] | null) => {
        if (Array.isArray(authors)) {
            return authors;  // Already an array, return as is
        }
        if (typeof authors === 'string' && authors.trim()) {
            return authors.split(',').map((author) => author.trim()); // Split by comma if it's a string
        }
        return []; // Return empty array if null or empty string
    };

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

    return (
        <>
            <AuthenticatedLayout
                header={<h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Review
                </h2>}
            >
                <Head title='Review' />
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Manuscripts Ready for Peer Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search manuscripts..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead className="min-w-[200px] cursor-pointer">
                                            Title</TableHead>
                                        <TableHead className="w-[120px]">Status</TableHead>
                                        <TableHead className="w-[120px] cursor-pointer">
                                            Submitted
                                        </TableHead>
                                        <TableHead className="min-w-[200px]">Authors</TableHead>
                                        <TableHead className="w-[120px] cursor-pointer">
                                            Updated
                                        </TableHead>
                                        <TableHead className="w-[100px] text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredManuscripts.map((manuscript) => (
                                        <TableRow key={manuscript.id}>
                                            <TableCell>{manuscript.id}</TableCell>
                                            <TableCell>{manuscript.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={`${getStatusColor(manuscript.status)} whitespace-nowrap`}>
                                                    {manuscript.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(manuscript.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{getAuthors(manuscript.authors).length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {getAuthors(manuscript.authors).map((author, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {author}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No co-authors</span>
                                            )}</TableCell>
                                            <TableCell><div className="flex items-center gap-2">
                                                {new Date(manuscript.updated_at).toLocaleDateString()} {/* Display updated_at */}
                                            </div></TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button size="icon" variant="ghost" onClick={() => Inertia.visit(route('reviewer.manuscripts.show', manuscript.id))}>
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">View</span>
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => Inertia.visit(route('reviewer.manuscripts.review', manuscript.id))}>
                                                        <NotebookPen className="h-4 w-4" />
                                                        <span className="sr-only">Review</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </AuthenticatedLayout >
        </>
    )
}

