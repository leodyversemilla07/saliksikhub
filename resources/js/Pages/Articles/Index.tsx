import { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Badge } from "@/Components/ui/badge"
import { Head } from '@inertiajs/react'

// Sample initial data with only published articles
const publishedArticles = [
    {
        id: 1,
        title: 'Introduction to React Hooks',
        author: 'Jane Doe',
        publishDate: '2024-01-15',
        category: 'Web Development'
    },
    {
        id: 2,
        title: 'Machine Learning Basics',
        author: 'John Smith',
        publishDate: '2024-02-20',
        category: 'Artificial Intelligence'
    },
    {
        id: 3,
        title: 'Cybersecurity Trends',
        author: 'Alice Johnson',
        publishDate: '2024-03-10',
        category: 'Security'
    }
]

const PublishedArticlesTable = () => {
    const [searchQuery, setSearchQuery] = useState('')

    // Filter articles based on the search query
    const filteredArticles = publishedArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Published Articles
                </h2>
            }
        >
            <Head title='Published Paper' />
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Published Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-6">
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                className="max-w-sm"
                            />
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Publish Date</TableHead>
                                    <TableHead>Category</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredArticles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No articles found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredArticles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell className="font-medium">{article.title}</TableCell>
                                            <TableCell>{article.author}</TableCell>
                                            <TableCell>{article.publishDate}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{article.category}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}

export default PublishedArticlesTable

