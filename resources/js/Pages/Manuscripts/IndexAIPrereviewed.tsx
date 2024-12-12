import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Badge } from "@/Components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Head } from '@inertiajs/react';

interface LanguageQuality {
    word_count: number
    unique_words: number
    sentence_count: number
    named_entities: number
    grammar_issues: number
    readability_score: number
}

interface AiReview {
    summary: string
    keywords: string[]
    language_quality: LanguageQuality
    created_at: string
}

interface Manuscript {
    id: number
    title: string
    user_id: number
    created_at: string
    updated_at: string
    status: 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected'
    authors: string | string[] | null
    aiReview: AiReview | null
}

interface ManuscriptsDashboardProps {
    manuscripts: Manuscript[]
}

const ManuscriptsDashboard: React.FC<ManuscriptsDashboardProps> = ({ manuscripts }) => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    AI Review Report
                </h2>
            }
        >
            <Head title='AI Review Report' />
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Pre-review Report</CardTitle>
                        <CardDescription>Overview of your manuscripts and their AI reviews</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Review Date</TableHead>
                                        <TableHead>AI Review Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {manuscripts.map(manuscript => (
                                        <TableRow key={manuscript.id}>
                                            <TableCell className="font-medium">{manuscript.title}</TableCell>
                                            <TableCell>
                                                {manuscript.aiReview?.created_at
                                                    ? new Date(manuscript.aiReview.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {manuscript.aiReview ? (
                                                    <Badge variant="default">AI Review Available</Badge>
                                                ) : (
                                                    <Badge variant="destructive">No AI Review</Badge>
                                                )}
                                                {manuscript.aiReview && (
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem value="ai-review">
                                                            <AccordionTrigger>View AI Review</AccordionTrigger>
                                                            <AccordionContent>
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <h4 className="font-semibold">Summary</h4>
                                                                        <p>{manuscript.aiReview.summary}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold">Keywords</h4>
                                                                        <p>{manuscript.aiReview.keywords.join(', ')}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold">Language Quality</h4>
                                                                        <ul className="list-disc pl-5 space-y-1">
                                                                            <li>Word Count: {manuscript.aiReview.language_quality.word_count}</li>
                                                                            <li>Unique Words: {manuscript.aiReview.language_quality.unique_words}</li>
                                                                            <li>Sentence Count: {manuscript.aiReview.language_quality.sentence_count}</li>
                                                                            <li>Named Entities: {manuscript.aiReview.language_quality.named_entities}</li>
                                                                            <li>Grammar Issues: {manuscript.aiReview.language_quality.grammar_issues}</li>
                                                                            <li>Readability Score: {manuscript.aiReview.language_quality.readability_score}</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}

export default ManuscriptsDashboard
