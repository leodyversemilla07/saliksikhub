'use client'

import { useState } from 'react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Badge } from "@/Components/ui/badge"
import { Progress } from "@/Components/ui/progress"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Separator } from "@/Components/ui/separator"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import {
    AlertCircle,
    Bell,
    BookOpen,
    FileText,
    Home,
    LayoutDashboard,
    LogOut,
    PenTool,
    Plus,
    Send,
    Settings,
    User
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/Components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"
import { Head } from '@inertiajs/react'

export default function AuthorDashboard() {
    const [submissions, setSubmissions] = useState([
        { id: 1, title: "Novel Approach to Quantum Computing", status: "In Review", progress: 60, dueDate: "2023-07-15" },
        { id: 2, title: "Climate Change Effects on Marine Ecosystems", status: "Revision Required", progress: 40, dueDate: "2023-06-30" },
        { id: 3, title: "Advancements in CRISPR Gene Editing", status: "Accepted", progress: 100, dueDate: "2023-08-01" },
        { id: 4, title: "Artificial Intelligence in Drug Discovery", status: "Submitted", progress: 20, dueDate: "2023-07-20" },
    ])

    const [publications, setPublications] = useState([
        { id: 1, title: "Machine Learning in Healthcare", journal: "Journal of AI in Medicine", date: "2023-05-15", citations: 23 },
        { id: 2, title: "Sustainable Energy Solutions", journal: "Renewable Energy Quarterly", date: "2023-02-28", citations: 15 },
        { id: 3, title: "Neuroplasticity and Learning", journal: "Cognitive Science Today", date: "2022-11-10", citations: 42 },
    ])

    return (
        <>
            <Head title='Author Dashboard'/>
            <SidebarProvider>
                <div className="flex h-screen">
                    <Sidebar collapsible="icon">
                        <SidebarHeader>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Author Dashboard</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="#">
                                            <Home className="h-4 w-4" />
                                            <span>Home</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="#">
                                            <FileText className="h-4 w-4" />
                                            <span>Submissions</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="#">
                                            <BookOpen className="h-4 w-4" />
                                            <span>Publications</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="#">
                                            <Settings className="h-4 w-4" />
                                            <span>Settings</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                        <SidebarRail />
                    </Sidebar>
                    <SidebarInset>
                        <div className="flex h-16 items-center justify-between gap-2 border-b px-4">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger />
                                <h1 className="text-2xl font-bold">Author Dashboard</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon">
                                    <Bell className="h-5 w-5" />
                                    <span className="sr-only">Notifications</span>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">Dr. Jane Doe</p>
                                                <p className="text-xs leading-none text-muted-foreground">jane.doe@example.com</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div className="container mx-auto p-4 overflow-auto h-[calc(100vh-4rem)]">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{submissions.length}</div>
                                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">In Review</CardTitle>
                                        <PenTool className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{submissions.filter(s => s.status === "In Review").length}</div>
                                        <p className="text-xs text-muted-foreground">+1 from last week</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                                        <Send className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{submissions.filter(s => s.status === "Accepted").length}</div>
                                        <p className="text-xs text-muted-foreground">Same as last month</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Citations</CardTitle>
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{publications.reduce((sum, pub) => sum + pub.citations, 0)}</div>
                                        <p className="text-xs text-muted-foreground">+18 from last month</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-6 grid gap-6 md:grid-cols-2">
                                <Card className="col-span-2 md:col-span-1">
                                    <CardHeader>
                                        <CardTitle>Upcoming Deadlines</CardTitle>
                                        <CardDescription>Your submission deadlines for the next 30 days</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[300px]">
                                            {submissions
                                                .filter(s => new Date(s.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
                                                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                                                .map((submission) => (
                                                    <div key={submission.id} className="mb-4 grid gap-2">
                                                        <div className="flex items-center">
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold">{submission.title}</h3>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant={submission.status === "Accepted" ? "secondary" : "secondary"}>
                                                                        {submission.status}
                                                                    </Badge>
                                                                    <span className="text-sm text-muted-foreground">Due: {submission.dueDate}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Progress value={submission.progress} className="h-2" />
                                                    </div>
                                                ))}
                                        </ScrollArea>
                                    </CardContent>
                                </Card>

                                <Card className="col-span-2 md:col-span-1">
                                    <CardHeader>
                                        <CardTitle>Quick Submit</CardTitle>
                                        <CardDescription>Start a new manuscript submission</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form>
                                            <div className="grid w-full items-center gap-4">
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="title">Manuscript Title</Label>
                                                    <Input id="title" placeholder="Enter the title of your manuscript" />
                                                </div>
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="abstract">Abstract</Label>
                                                    <Input id="abstract" placeholder="Provide a brief abstract" />
                                                </div>
                                            </div>
                                        </form>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline">Save Draft</Button>
                                        <Button>Submit</Button>
                                    </CardFooter>
                                </Card>
                            </div>

                            <Tabs defaultValue="submissions" className="mt-6">
                                <TabsList>
                                    <TabsTrigger value="submissions">Current Submissions</TabsTrigger>
                                    <TabsTrigger value="publications">Published Works</TabsTrigger>
                                </TabsList>
                                <TabsContent value="submissions">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Manuscript Submissions</CardTitle>
                                            <CardDescription>Overview of your current manuscript submissions and their statuses.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-[400px]">
                                                {submissions.map((submission) => (
                                                    <div key={submission.id} className="mb-4 grid gap-2">
                                                        <div className="flex items-center">
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold">{submission.title}</h3>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant={submission.status === "Accepted" ? "secondary" : "secondary"}>
                                                                        {submission.status}
                                                                    </Badge>
                                                                    <span className="text-sm text-muted-foreground">Progress: {submission.progress}%</span>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline" size="sm">View Details</Button>
                                                        </div>
                                                        <Progress value={submission.progress} className="h-2" />
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full">
                                                <Plus className="mr-2 h-4 w-4" /> Start New Submission
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="publications">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Published Works</CardTitle>
                                            <CardDescription>Your articles that have been published in various journals.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-[400px]">
                                                {publications.map((publication) => (
                                                    <div key={publication.id} className="mb-4">
                                                        <h3 className="font-semibold">{publication.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{publication.journal} - Published on {publication.date}</p>
                                                        <p className="text-sm">Citations: {publication.citations}</p>
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            <div className="mt-6 grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Activity</CardTitle>
                                        <CardDescription>Latest updates on your submissions and reviews.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[300px]">
                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                                                        <AvatarFallback>RA</AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-4 space-y-1">
                                                        <p className="text-sm font-medium">Your submission "Novel Approach to Quantum Computing" has entered the review phase.</p>
                                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                                                        <AvatarFallback>ED</AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-4 space-y-1">
                                                        <p className="text-sm font-medium">Editor requested revisions for "Climate Change Effects on Marine Ecosystems".</p>
                                                        <p className="text-xs text-muted-foreground">1 day ago</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                                                        <AvatarFallback>SY</AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-4 space-y-1">
                                                        <p className="text-sm font-medium">Your article "Machine Learning in Healthcare" has received 5 new citations.</p>
                                                        <p className="text-xs text-muted-foreground">3 days ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notifications</CardTitle>
                                        <CardDescription>Important updates and reminders</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[300px]">
                                            <div className="space-y-4">
                                                <Alert>
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle>Deadline Approaching</AlertTitle>
                                                    <AlertDescription>
                                                        Your submission "Climate Change Effects on Marine Ecosystems" is due in 3 days.
                                                    </AlertDescription>
                                                </Alert>
                                                <Alert>
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle>Review Complete</AlertTitle>
                                                    <AlertDescription>
                                                        The review for "Advancements in CRISPR Gene Editing" is complete. Check your email for details.
                                                    </AlertDescription>
                                                </Alert>
                                                <Alert>
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle>New Comment</AlertTitle>
                                                    <AlertDescription>
                                                        A reviewer has left a new comment on your submission "Artificial Intelligence in Drug Discovery".
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </>
    )
}