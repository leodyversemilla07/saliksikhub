import * as React from "react"
import { Bell, ChevronDown, Layout, FileText, Users, BarChart, Settings, LogOut, Clock, Plus, Search, Filter, ArrowUpRight, AlertTriangle, ChevronRight, Moon, Sun } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Progress } from "@/Components/ui/progress"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible"
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar"

export default function EditorDashboard() {
    const [activeTab, setActiveTab] = React.useState('overview')
    const [theme, setTheme] = React.useState('light')

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <SidebarProvider>
            <div className={`flex h-screen bg-background ${theme}`}>
                <Sidebar className="border-r">
                    <SidebarHeader className="border-b px-6 py-4">
                        <h1 className="text-2xl font-bold text-primary">SaliksikHub</h1>
                    </SidebarHeader>
                    <SidebarContent className="py-6">
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {[
                                        { name: 'Overview', icon: Layout, tab: 'overview' },
                                        { name: 'Workflow', icon: ArrowUpRight, tab: 'workflow' },
                                        { name: 'Submissions', icon: FileText, tab: 'submissions' },
                                        { name: 'Reviewers', icon: Users, tab: 'reviewers' },
                                        { name: 'Analytics', icon: BarChart, tab: 'analytics' },
                                        { name: 'Settings', icon: Settings, tab: 'settings' },
                                    ].map((item) => (
                                        <SidebarMenuItem key={item.name} className="px-2 py-1">
                                            <SidebarMenuButton
                                                onClick={() => setActiveTab(item.tab)}
                                                isActive={activeTab === item.tab}
                                                className="w-full justify-start px-4 py-2"
                                            >
                                                <item.icon className="w-5 h-5 mr-3" />
                                                {item.name}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter className="border-t p-6">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="w-full justify-start px-4 py-2">
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                {/* Main content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-background border-b">
                        <div className="flex items-center justify-between px-8 py-4">
                            <div className="flex items-center space-x-6">
                                <SidebarTrigger />
                                <h2 className="text-2xl font-semibold">Editor Dashboard</h2>
                            </div>
                            <div className="flex items-center space-x-6">
                                <Button variant="outline" size="icon" className="h-10 w-10" onClick={toggleTheme}>
                                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-10 w-10 relative">
                                            <Bell className="h-5 w-5" />
                                            <span className="sr-only">Notifications</span>
                                            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[300px]">
                                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                        <DropdownMenuItem>
                                            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                                            <span>3 reviews are overdue</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <FileText className="mr-2 h-4 w-4 text-blue-500" />
                                            <span>New submission received</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="/placeholder-avatar.jpg" alt="Editor" />
                                        <AvatarFallback>ED</AvatarFallback>
                                    </Avatar>
                                    <Button variant="ghost" className="text-base">
                                        John Doe <ChevronDown className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Dashboard content */}
                    <ScrollArea className="flex-1">
                        <div className="p-8 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Urgent Tasks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                                <span>3 overdue reviews</span>
                                            </div>
                                            <Button size="sm">Take Action</Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-5 w-5 text-red-500" />
                                                <span>5 submissions awaiting initial decision</span>
                                            </div>
                                            <Button size="sm">Review</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">245</div>
                                        <p className="text-xs text-muted-foreground">+20% from last month</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">35</div>
                                        <p className="text-xs text-muted-foreground">12 urgent (&gt;30 days)</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
                                        <BarChart className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">68%</div>
                                        <p className="text-xs text-muted-foreground">+5% from last quarter</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">18 days</div>
                                        <p className="text-xs text-muted-foreground">-2 days from last month</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <Card className="col-span-2">
                                    <CardHeader>
                                        <CardTitle>Recent Submissions</CardTitle>
                                        <CardDescription>Latest papers submitted for review</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between mb-4">
                                            <div className="relative w-64">
                                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Search submissions" className="pl-8" />
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Filter className="mr-2 h-4 w-4" />
                                                Filter
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { title: "Machine Learning in Healthcare", author: "Dr. Emily Chen", date: "2023-06-15", status: "Pending" },
                                                { title: "Renewable Energy Technologies", author: "Prof. Michael Brown", date: "2023-06-14", status: "Under Review" },
                                                { title: "Cybersecurity in IoT Devices", author: "Dr. Sarah Johnson", date: "2023-06-13", status: "Pending" },
                                                { title: "Advancements in Gene Therapy", author: "Dr. David Lee", date: "2023-06-12", status: "Under Review" },
                                                { title: "Quantum Computing Applications", author: "Dr. Lisa Wang", date: "2023-06-11", status: "Pending" },
                                            ].map((submission, index) => (
                                                <Collapsible key={index}>
                                                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                                                        <div>
                                                            <div className="font-medium text-left">{submission.title}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {submission.author} • Submitted on {submission.date}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant={submission.status === "Pending" ? "secondary" : "outline"}>
                                                                {submission.status}
                                                            </Badge>
                                                            <ChevronRight className="h-4 w-4" />
                                                        </div>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="mt-2">
                                                        <div className="flex justify-between items-center">
                                                            <div className="space-y-1">
                                                                <p className="text-sm">Abstract: Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                                                                <p className="text-sm text-muted-foreground">Keywords: AI, Healthcare, Machine Learning</p>
                                                            </div>
                                                            <Button variant="outline" size="sm">Review</Button>
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>AI-Assisted Pre-review Insights</CardTitle>
                                        <CardDescription>Recent submissions analysis</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Tabs defaultValue="methodology">
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="methodology">Methodology</TabsTrigger>
                                                <TabsTrigger value="literature">Literature</TabsTrigger>
                                                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="methodology">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm font-medium">Methodology Strength</span>
                                                            <span className="text-sm text-muted-foreground">85%</span>
                                                        </div>
                                                        <Progress value={85} className="h-2" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">The methodology is well-defined but could benefit from more detailed explanation of data collection procedures.</p>
                                                    <Button variant="outline" size="sm">View Details</Button>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="literature">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm font-medium">Literature Review</span>
                                                            <span className="text-sm text-muted-foreground">92%</span>
                                                        </div>
                                                        <Progress value={92} className="h-2" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Comprehensive literature review with recent publications. Consider including more international perspectives.</p>
                                                    <Button variant="outline" size="sm">View Details</Button>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="analysis">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm font-medium">Data Analysis</span>
                                                            <span className="text-sm text-muted-foreground">78%</span>
                                                        </div>
                                                        <Progress value={78} className="h-2" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Statistical analysis is sound, but there's room for more advanced techniques to strengthen conclusions.</p>
                                                    <Button variant="outline" size="sm">View Details</Button>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Reviewer Performance</CardTitle>
                                        <CardDescription>Top 5 reviewers by completed reviews</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { name: "Dr. Alice Johnson", reviews: 15, rating: 4.8 },
                                                { name: "Prof. Robert Smith", reviews: 12, rating: 4.7 },
                                                { name: "Dr. Emma Davis", reviews: 10, rating: 4.9 },
                                                { name: "Prof. James Wilson", reviews: 9, rating: 4.6 },
                                                { name: "Dr. Olivia Brown", reviews: 8, rating: 4.8 },
                                            ].map((reviewer, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">{reviewer.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {reviewer.reviews} reviews • {reviewer.rating} avg. rating
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Papers Pending Review</CardTitle>
                                        <CardDescription>Assigned and unassigned papers</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { title: "AI in Education: A Comprehensive Review", status: "Assigned", daysInReview: 12 },
                                                { title: "Climate Change Impact on Biodiversity", status: "Unassigned", daysInReview: 5 },
                                                { title: "Quantum Computing: Recent Advancements", status: "Assigned", daysInReview: 18 },
                                                { title: "Sustainable Urban Planning Strategies", status: "Unassigned", daysInReview: 2 },
                                                { title: "Neuroscience and Artificial Intelligence", status: "Assigned", daysInReview: 8 },
                                            ].map((paper, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">{paper.title}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            <Badge variant={paper.status === "Assigned" ? "secondary" : "outline"} className="mr-2">
                                                                {paper.status}
                                                            </Badge>
                                                            <span>{paper.daysInReview} days in review</span>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm">View</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                        <CardDescription>Common editor tasks</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4">
                                            <Button className="w-full justify-start">
                                                <Users className="mr-2 h-4 w-4" />
                                                Assign Reviewers
                                            </Button>
                                            <Button className="w-full justify-start">
                                                <Bell className="mr-2 h-4 w-4" />
                                                Send Reminders
                                            </Button>
                                            <Button className="w-full justify-start">
                                                <BarChart className="mr-2 h-4 w-4" />
                                                Review AI Insights
                                            </Button>
                                            <Button className="w-full justify-start">
                                                <FileText className="mr-2 h-4 w-4" />
                                                Generate Reports
                                            </Button>
                                            <Button className="w-full justify-start">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create New Issue
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </SidebarProvider>
    )
}