import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '@/components/site-header';
import Footer from '@/components/site-footer';
import { Calendar, Archive, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface JournalArticle {
    id: number;
    title: string;
    authors: string;
    abstract: string;
    keywords: string[];
    doi: string;
    pages: string;
    pdfUrl: string;
}

interface JournalIssue {
    id: number;
    volume: number;
    issue: number;
    title: string;
    description: string;
    coverImageUrl: string;
    publicationDate: string;
    articles: JournalArticle[];
}

interface VolumeYear {
    year: number;
    volumes: {
        volume: number;
        issues: JournalIssue[];
    }[];
}

export default function Archives({ auth }: PageProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.visit(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const archiveData: VolumeYear[] = [
        {
            year: 2024,
            volumes: [
                {
                    volume: 22,
                    issues: [
                        {
                            id: 1,
                            volume: 22,
                            issue: 2,
                            title: "DDMRJ Special Issue on the International Conference on Research, Innovation, and Investment (ICRII) 2024",
                            description: "Vol. 22 No. S1 (2024)",
                            coverImageUrl: "/images/journal-cover.webp",
                            publicationDate: "2024",
                            articles: []
                        },
                        {
                            id: 2,
                            volume: 22,
                            issue: 1,
                            title: "July - December 2024",
                            description: "Vol. 22 No. 2 (2024)",
                            coverImageUrl: "/images/journal-cover.webp",
                            publicationDate: "2024",
                            articles: []
                        }
                    ]
                }
            ]
        },
        {
            year: 2023,
            volumes: [
                {
                    volume: 21,
                    issues: [
                        {
                            id: 3,
                            volume: 21,
                            issue: 2,
                            title: "July - December 2023",
                            description: "Vol. 21 No. 2 (2023)",
                            coverImageUrl: "/images/journal-cover.webp",
                            publicationDate: "2023",
                            articles: []
                        }
                    ]
                }
            ]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Head title="Archives | Daluyang Dunong" />
            <Header auth={auth} />
            <main className="grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Archives
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Browse our published issues and search through our research collection.
                        </p>
                    </div>

                    {/* Search Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Search Archives
                            </CardTitle>
                            <CardDescription>
                                Use our advanced search to find specific articles, authors, or research topics across all published issues.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <Input
                                    placeholder="Search articles, authors, keywords..."
                                    className="flex-1"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button type="submit">
                                    Search
                                </Button>
                            </form>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Advanced Filters</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-2 block">
                                                Publication Year
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input placeholder="From" type="number" />
                                                <Input placeholder="To" type="number" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-2 block">
                                                Author
                                            </label>
                                            <Input placeholder="Author name" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-2 block">
                                                Subject Area
                                            </label>
                                            <Input placeholder="Research area or topic" />
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Search Tips</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="text-sm text-muted-foreground space-y-2">
                                            <li>• Use quotes for exact phrases: "climate change"</li>
                                            <li>• Use AND/OR for multiple terms: research AND methodology</li>
                                            <li>• Use wildcards for partial matches: sustain*</li>
                                            <li>• Search by DOI for specific articles</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Published Issues Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Published Issues
                            </CardTitle>
                            <CardDescription>
                                Browse all published volumes and issues organized by year.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                                    <div className="space-y-8">
                                        {archiveData.map((yearData) => (
                                            <div key={yearData.year}>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <h3 className="text-xl font-semibold text-foreground">
                                                        {yearData.year}
                                                    </h3>
                                                    <Badge variant="secondary">
                                                        {yearData.volumes.reduce((total, vol) => total + vol.issues.length, 0)} Issues
                                                    </Badge>
                                                </div>
                                                <div className="grid gap-4">
                                                    {yearData.volumes.map((volumeData) => (
                                                        <div key={volumeData.volume}>
                                                            {volumeData.issues.map((issue) => (
                                                                <Card key={issue.id} className="hover:shadow-md transition-shadow">
                                                                    <CardContent className="p-6">
                                                                        <div className="flex items-start gap-4">
                                                                            <div className="w-24 h-32 shrink-0">
                                                                                <img
                                                                                    src={issue.coverImageUrl}
                                                                                    alt={`Cover for ${issue.title}`}
                                                                                    className="w-full h-full object-cover rounded-md"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <Link
                                                                                    href={`/issue/${issue.id}`}
                                                                                    className="text-lg font-medium text-primary hover:underline block mb-2"
                                                                                >
                                                                                    {issue.title}
                                                                                </Link>
                                                                                <p className="text-sm text-muted-foreground mb-3">
                                                                                    {issue.description}
                                                                                </p>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Badge variant="outline">
                                                                                        Volume {issue.volume}
                                                                                    </Badge>
                                                                                    <Badge variant="outline">
                                                                                        Issue {issue.issue}
                                                                                    </Badge>
                                                                                    <Badge variant="outline">
                                                                                        {issue.publicationDate}
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {archiveData.length === 0 && (
                                            <div className="text-center py-12">
                                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                <p className="text-muted-foreground">No archives found.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                    {/* Statistics Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Archive className="h-5 w-5" />
                                Archive Statistics
                            </CardTitle>
                            <CardDescription>
                                Overview of our publication statistics and research impact.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <Card className="text-center">
                                    <CardContent className="pt-6">
                                        <div className="text-3xl font-bold text-primary mb-2">
                                            {archiveData.reduce((total, year) =>
                                                total + year.volumes.reduce((volTotal, vol) => volTotal + vol.issues.length, 0), 0
                                            )}
                                        </div>
                                        <p className="text-muted-foreground">Total Issues</p>
                                    </CardContent>
                                </Card>
                                
                                <Card className="text-center">
                                    <CardContent className="pt-6">
                                        <div className="text-3xl font-bold text-primary mb-2">
                                            {archiveData.length}
                                        </div>
                                        <p className="text-muted-foreground">Years Published</p>
                                    </CardContent>
                                </Card>
                                
                                <Card className="text-center">
                                    <CardContent className="pt-6">
                                        <div className="text-3xl font-bold text-primary mb-2">
                                            {archiveData.reduce((total, year) => total + year.volumes.length, 0)}
                                        </div>
                                        <p className="text-muted-foreground">Total Volumes</p>
                                    </CardContent>
                                </Card>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Publication History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {archiveData.map((yearData) => (
                                                <div key={yearData.year} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                                    <span className="font-medium">{yearData.year}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary">
                                                            {yearData.volumes.reduce((total, vol) => total + vol.issues.length, 0)} issues
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Quick Access</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <Link href="/current-issue" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                                                <span>Current Issue</span>
                                                <Badge>Latest</Badge>
                                            </Link>
                                            <Link href="/most-cited" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                                                <span>Most Cited Articles</span>
                                                <Badge variant="secondary">Popular</Badge>
                                            </Link>
                                            <Link href="/recent-articles" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                                                <span>Recent Articles</span>
                                                <Badge variant="secondary">New</Badge>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
