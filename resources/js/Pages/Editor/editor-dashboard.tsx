import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
    CheckCircle, FileText, TrendingUp, TrendingDown,
    Calendar, ChevronDown, Download, ArrowRight, BookOpen, UserCheck,
    FileSearch, ChevronRight, Filter, Search, Bell, RefreshCw,
    Printer, SlidersHorizontal, AlertCircle, X
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";

// TypeScript interface definitions
interface Metric {
    title: string;
    value: string;
    trend: 'up' | 'down';
    percentage: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

interface SubmissionData {
    id: string;
    title: string;
    status: string;
    submitted: string;
    author: string;
    category: string;
    statusColor: string;
}

interface ReviewData {
    manuscriptId: string;
    title: string;
    reviewer: string;
    assignedDate: string;
    deadline: string;
    progress: number;
}

interface NotificationData {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

interface ChartDataPoint {
    name: string;
    value: number;
    color: string;
}

interface MonthlySubmission {
    month: string;
    submissions: number;
    published: number;
    rejected: number;
}

export default function EditorDashboard() {
    // State for filters and search
    const [dateRange, setDateRange] = useState("last30");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState("area");
    const [notifications, setNotifications] = useState<NotificationData[]>([
        { id: 1, title: "New manuscript submission", message: "Dr. Michael Chen submitted 'Quantum Computing: Latest Developments'", time: "10 minutes ago", read: false },
        { id: 2, title: "Review completed", message: "Prof. James Moore completed his review of manuscript MS-2024-126", time: "1 hour ago", read: false },
        { id: 3, title: "Decision reminder", message: "Manuscript MS-2024-124 is awaiting your decision", time: "2 days ago", read: true }
    ]);

    // Category options
    const categoryOptions = [
        { value: "all", label: "All Categories" },
        { value: "computer-science", label: "Computer Science" },
        { value: "healthcare", label: "Healthcare" },
        { value: "agriculture", label: "Agriculture" },
        { value: "energy", label: "Energy" }
    ];

    // Date range options
    const dateRangeOptions = [
        { value: "last7", label: "Last 7 Days" },
        { value: "last30", label: "Last 30 Days" },
        { value: "last90", label: "Last Quarter" },
        { value: "lastYear", label: "Last Year" },
    ];

    // Sample data for metrics
    const metrics: Metric[] = [
        {
            title: 'New Submissions',
            value: '24',
            trend: 'up',
            percentage: '16%',
            description: 'Last 30 days',
            icon: FileText,
            color: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'Published Articles',
            value: '15',
            trend: 'up',
            percentage: '12%',
            description: 'Last 30 days',
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-600'
        },
        {
            title: 'Active Reviewers',
            value: '42',
            trend: 'down',
            percentage: '4%',
            description: 'Available reviewers',
            icon: UserCheck,
            color: 'from-purple-500 to-violet-600'
        }
    ];

    // Sample data for charts
    const monthlySubmissionsData: MonthlySubmission[] = [
        { month: 'Jan', submissions: 34, published: 12, rejected: 5 },
        { month: 'Feb', submissions: 42, published: 14, rejected: 8 },
        { month: 'Mar', submissions: 50, published: 18, rejected: 7 },
        { month: 'Apr', submissions: 38, published: 12, rejected: 10 },
        { month: 'May', submissions: 45, published: 15, rejected: 9 },
        { month: 'Jun', submissions: 55, published: 20, rejected: 8 },
        { month: 'Jul', submissions: 48, published: 16, rejected: 7 },
        { month: 'Aug', submissions: 41, published: 13, rejected: 6 },
        { month: 'Sep', submissions: 52, published: 19, rejected: 8 },
        { month: 'Oct', submissions: 58, published: 21, rejected: 9 },
        { month: 'Nov', submissions: 47, published: 18, rejected: 7 },
        { month: 'Dec', submissions: 36, published: 14, rejected: 6 }
    ];

    // Distribution data for pie charts
    const submissionStatusData: ChartDataPoint[] = [
        { name: 'Ready for Decision', value: 12, color: '#3B82F6' },
        { name: 'Revisions Required', value: 18, color: '#8B5CF6' },
        { name: 'Decision Made', value: 32, color: '#10B981' }
    ];

    const revisionRoundsData: ChartDataPoint[] = [
        { name: 'No Revision', value: 45, color: '#10B981' },
        { name: '1 Round', value: 30, color: '#3B82F6' },
        { name: '2 Rounds', value: 15, color: '#F59E0B' },
        { name: '3+ Rounds', value: 10, color: '#EF4444' }
    ];

    // Recent submissions data
    const recentSubmissions: SubmissionData[] = [
        {
            id: 'MS-2024-128',
            title: 'Quantum Computing: Latest Developments and Future Applications',
            status: 'New Submission',
            submitted: '2024-05-15',
            author: 'Dr. Michael Chen',
            category: 'Computer Science',
            statusColor: 'bg-blue-500'
        },
        {
            id: 'MS-2024-126',
            title: 'Impact of Climate Change on Agricultural Sustainability',
            status: 'Revision Required',
            submitted: '2024-05-10',
            author: 'Prof. David Williams',
            category: 'Agriculture',
            statusColor: 'bg-purple-500'
        },
        {
            id: 'MS-2024-125',
            title: 'Machine Learning Algorithms for Healthcare Diagnostics',
            status: 'Ready for Decision',
            submitted: '2024-05-08',
            author: 'Dr. Emily Rodriguez',
            category: 'Healthcare',
            statusColor: 'bg-green-500'
        },
        {
            id: 'MS-2024-124',
            title: 'Novel Approaches to Renewable Energy Storage',
            status: 'Published',
            submitted: '2024-05-05',
            author: 'Prof. Robert Garcia',
            category: 'Energy',
            statusColor: 'bg-teal-500'
        }
    ];

    // Review assignments data
    const pendingReviews: ReviewData[] = [
        {
            manuscriptId: 'MS-2024-127',
            title: 'AI-Driven Solutions for Environmental Monitoring',
            reviewer: 'Dr. Karen Wilson',
            assignedDate: '2024-05-12',
            deadline: '2024-05-26',
            progress: 25
        },
        {
            manuscriptId: 'MS-2024-126',
            title: 'Impact of Climate Change on Agricultural Sustainability',
            reviewer: 'Prof. James Moore',
            assignedDate: '2024-05-10',
            deadline: '2024-05-24',
            progress: 50
        },
        {
            manuscriptId: 'MS-2024-128',
            title: 'Quantum Computing: Latest Developments and Future Applications',
            reviewer: 'Dr. Lisa Zhang',
            assignedDate: '2024-05-15',
            deadline: '2024-05-29',
            progress: 0
        }
    ];

    // Filtered submissions based on search query and category
    const filteredSubmissions = useMemo(() => {
        return recentSubmissions.filter(submission => {
            const matchesSearch = searchQuery === "" ||
                submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                submission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                submission.author.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = categoryFilter === "all" ||
                submission.category.toLowerCase().replace(/\s+/g, '-') === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [recentSubmissions, searchQuery, categoryFilter]);

    // Filtered review assignments
    const filteredReviews = useMemo(() => {
        return pendingReviews.filter(review =>
            searchQuery === "" ||
            review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.manuscriptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.reviewer.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [pendingReviews, searchQuery]);

    // Simulate loading data
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    }, []);

    // Handle tab change
    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value);
    }, []);

    // Toggle notifications panel
    const toggleNotifications = useCallback(() => {
        setShowNotifications(prev => !prev);
    }, []);

    // Custom tooltip for charts
    const CustomTooltip = ({
        active,
        payload,
        label
    }: {
        active?: boolean;
        payload?: Array<{
            name?: string;
            value?: number;
            color?: string;
            dataKey?: string;
            fill?: string;
            stroke?: string;
        }>;
        label?: string;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{label}</p>
                    {payload.map((entry, index: number) => (
                        <div key={`tooltip-item-${index}`} className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill || entry.stroke || '#888' }}></div>
                            <span className="text-gray-600 dark:text-gray-300">{entry.name || entry.dataKey || 'Value'}:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Get status badge style based on status
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'New Submission': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            'Revision Required': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            'Ready for Decision': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            'Published': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
            'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
        };

        return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    };

    // Loading skeleton for charts
    const ChartSkeleton = () => (
        <div className="space-y-2 w-full">
            <Skeleton className="h-[300px] w-full" />
            <div className="flex justify-center space-x-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
    );

    // Loading skeleton for metrics
    const MetricSkeleton = () => (
        <Card className="overflow-hidden transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
            </CardContent>
        </Card>
    );

    // Loading skeleton for tables
    const TableRowSkeleton = () => (
        <tr>
            <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
            <td className="px-4 py-3">
                <div className="space-y-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </td>
            <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
            <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
            <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-20" /></td>
            <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
        </tr>
    );

    // Notifications panel
    const NotificationsPanel = () => (
        <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Bell className="h-5 w-5 mr-2" />
                            Notifications
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">
                                {notifications.filter(n => !n.read).length} new
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                disabled={!notifications.some(n => !n.read)}
                                className="text-xs h-7 px-2"
                            >
                                Mark all as read
                            </Button>
                        </div>
                    </SheetTitle>
                    <SheetDescription>
                        Stay updated with manuscript submissions and reviewer activities.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    {notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Bell className="h-8 w-8 mb-2 mx-auto opacity-40" />
                            <p>No notifications</p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={`notification-${notification.id}`}
                                className={cn(
                                    "p-4 rounded-lg border",
                                    notification.read
                                        ? "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                                        : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className={cn(
                                        "text-sm font-medium",
                                        notification.read
                                            ? "text-gray-900 dark:text-gray-100"
                                            : "text-blue-800 dark:text-blue-300"
                                    )}>
                                        {notification.title}
                                    </h4>
                                    {!notification.read && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 block"></span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {notification.message}
                                </p>
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                                    <span>{notification.time}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2"
                                        onClick={() => {
                                            setNotifications(prev => prev.map(n =>
                                                n.id === notification.id ? { ...n, read: true } : n
                                            ));
                                        }}
                                    >
                                        {notification.read ? 'Mark as unread' : 'Mark as read'}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <SheetFooter className="mt-4">
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );

    return (
        <AuthenticatedLayout header="Editor Dashboard">
            <Head title="Editor Dashboard" />

            <div className="space-y-6">
                {/* Breadcrumbs and search/filter bar */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center">
                            <span className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 flex items-center">
                                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                Editor
                            </span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-gray-400 dark:text-gray-500" />
                        <div className="flex items-center">
                            <span className="font-medium text-green-600 dark:text-green-400">
                                Dashboard
                            </span>
                        </div>
                    </div>

                    {/* Search and filters */}
                    <div className="flex items-center flex-wrap gap-2">
                        {/* Date Range Filter */}
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[150px] h-10">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                <SelectValue placeholder="Date Range" />
                            </SelectTrigger>
                            <SelectContent>
                                {dateRangeOptions.map((option) => (
                                    <SelectItem key={`date-option-${option.value}`} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Category Filter */}
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px] h-10">
                                <Filter className="h-3.5 w-3.5 mr-1.5" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map((option) => (
                                    <SelectItem key={`category-option-${option.value}`} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Search */}
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                            <Input
                                placeholder="Search manuscripts..."
                                className="pl-9 h-10 w-[200px] md:w-[250px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Refresh Button */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            setIsLoading(true);
                                            setTimeout(() => setIsLoading(false), 1000);
                                        }}
                                        className="h-10 w-10"
                                    >
                                        <RefreshCw className={cn(
                                            "h-4 w-4",
                                            isLoading ? "animate-spin" : ""
                                        )} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Refresh data</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Notifications */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={toggleNotifications}
                                        className="h-10 w-10 relative"
                                    >
                                        <Bell className="h-4 w-4" />
                                        {notifications.some(n => !n.read) && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Notifications</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Print Button */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <Printer className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Print dashboard</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Settings */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <SlidersHorizontal className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Dashboard settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Stats Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {isLoading ? (
                        Array(3).fill(0).map((_, index) => (
                            <MetricSkeleton key={`metric-skeleton-${index}`} />
                        ))
                    ) : (
                        metrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                                <Card key={`metric-${index}`} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{metric.title}</p>
                                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
                                                    {metric.value}
                                                    <span className={cn(
                                                        "flex items-center text-xs px-1.5 py-0.5 rounded-full font-medium",
                                                        metric.trend === 'up'
                                                            ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40"
                                                            : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40"
                                                    )}>
                                                        {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                                                        {metric.percentage}
                                                    </span>
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.description}</p>
                                            </div>
                                            <div className={cn(
                                                "p-3 rounded-lg bg-gradient-to-br",
                                                metric.color,
                                                "text-white shadow-sm"
                                            )}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Chart sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Submission Trends */}
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                            <CardTitle className="text-base font-medium">Submission Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <ChartSkeleton />
                            ) : (
                                <div className="pt-3 px-3 pb-6 h-[350px]">
                                    <Tabs
                                        value={activeTab}
                                        onValueChange={handleTabChange}
                                        className="h-full"
                                    >
                                        <div className="flex justify-end mb-3">
                                            <TabsList className="h-8 p-0.5">
                                                <TabsTrigger value="area" className="text-xs px-2 h-7">Area</TabsTrigger>
                                                <TabsTrigger value="bar" className="text-xs px-2 h-7">Bar</TabsTrigger>
                                                <TabsTrigger value="line" className="text-xs px-2 h-7">Line</TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="area" className="h-[90%] mt-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={monthlySubmissionsData}
                                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <defs>
                                                        <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="colorPublished" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                    <XAxis
                                                        dataKey="month"
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={false}
                                                        axisLine={{ stroke: '#e5e7eb' }}
                                                    />
                                                    <YAxis
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={(value) => `${value}`}
                                                    />
                                                    <RechartsTooltip
                                                        cursor={{ stroke: '#d1d5db', strokeDasharray: '3 3' }}
                                                        content={<CustomTooltip />}
                                                    />
                                                    <Legend
                                                        verticalAlign="top"
                                                        height={36}
                                                        formatter={(value) => <span className="text-xs">{value}</span>}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="submissions"
                                                        stroke="#3B82F6"
                                                        fill="url(#colorSubmissions)"
                                                        activeDot={{ r: 6 }}
                                                        name="Submissions"
                                                        color="#3B82F6"
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="published"
                                                        stroke="#10B981"
                                                        fill="url(#colorPublished)"
                                                        activeDot={{ r: 6 }}
                                                        name="Published"
                                                        color="#10B981"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </TabsContent>

                                        <TabsContent value="bar" className="h-[90%] mt-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={monthlySubmissionsData}
                                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                    <XAxis
                                                        dataKey="month"
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={false}
                                                        axisLine={{ stroke: '#e5e7eb' }}
                                                    />
                                                    <YAxis
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={(value) => `${value}`}
                                                    />
                                                    <RechartsTooltip
                                                        cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                                                        content={<CustomTooltip />}
                                                    />
                                                    <Legend
                                                        verticalAlign="top"
                                                        height={36}
                                                        formatter={(value) => <span className="text-xs">{value}</span>}
                                                    />
                                                    <Bar
                                                        dataKey="submissions"
                                                        fill="#3B82F6"
                                                        radius={[4, 4, 0, 0]}
                                                        name="Submissions"
                                                        color="#3B82F6"
                                                    />
                                                    <Bar
                                                        dataKey="published"
                                                        fill="#10B981"
                                                        radius={[4, 4, 0, 0]}
                                                        name="Published"
                                                        color="#10B981"
                                                    />
                                                    <Bar
                                                        dataKey="rejected"
                                                        fill="#EF4444"
                                                        radius={[4, 4, 0, 0]}
                                                        name="Rejected"
                                                        color="#EF4444"
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </TabsContent>

                                        <TabsContent value="line" className="h-[90%] mt-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                    data={monthlySubmissionsData}
                                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                    <XAxis
                                                        dataKey="month"
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={false}
                                                        axisLine={{ stroke: '#e5e7eb' }}
                                                    />
                                                    <YAxis
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={(value) => `${value}`}
                                                    />
                                                    <RechartsTooltip
                                                        cursor={{ stroke: '#d1d5db', strokeDasharray: '3 3' }}
                                                        content={<CustomTooltip />}
                                                    />
                                                    <Legend
                                                        verticalAlign="top"
                                                        height={36}
                                                        formatter={(value) => <span className="text-xs">{value}</span>}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="submissions"
                                                        stroke="#3B82F6"
                                                        strokeWidth={2}
                                                        dot={{ r: 4, strokeWidth: 1 }}
                                                        activeDot={{ r: 6 }}
                                                        name="Submissions"
                                                        color="#3B82F6"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="published"
                                                        stroke="#10B981"
                                                        strokeWidth={2}
                                                        dot={{ r: 4, strokeWidth: 1 }}
                                                        activeDot={{ r: 6 }}
                                                        name="Published"
                                                        color="#10B981"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="rejected"
                                                        stroke="#EF4444"
                                                        strokeWidth={2}
                                                        dot={{ r: 4, strokeWidth: 1 }}
                                                        activeDot={{ r: 6 }}
                                                        name="Rejected"
                                                        color="#EF4444"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t px-6 py-3">
                            <Button variant="outline" className="w-full sm:w-auto text-xs h-8">
                                <Download className="h-3 w-3 mr-1.5" />
                                Export Data
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Review Timeframe */}
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                            <CardTitle className="text-base font-medium">Reviewer Status</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 text-xs">
                                        <span className="mr-1">Last 30 Days</span>
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="text-xs">Last 7 Days</DropdownMenuItem>
                                    <DropdownMenuItem className="text-xs">Last 30 Days</DropdownMenuItem>
                                    <DropdownMenuItem className="text-xs">Last Quarter</DropdownMenuItem>
                                    <DropdownMenuItem className="text-xs">Last Year</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <ChartSkeleton />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                                    {/* Distribution Pie Charts */}
                                    <div className="p-3 h-[350px] border-r border-gray-200 dark:border-gray-800">
                                        <h4 className="text-sm text-center font-medium mb-4">Submission Status</h4>
                                        <ResponsiveContainer width="100%" height="80%">
                                            <PieChart>
                                                <Pie
                                                    data={submissionStatusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    nameKey="name"
                                                >
                                                    {submissionStatusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip content={<CustomTooltip />} />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    formatter={(value) => <span className="text-xs">{value}</span>}
                                                    iconType="circle"
                                                    iconSize={8}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="p-3 h-[350px]">
                                        <h4 className="text-sm text-center font-medium mb-4">Revision Rounds</h4>
                                        <ResponsiveContainer width="100%" height="80%">
                                            <PieChart>
                                                <Pie
                                                    data={revisionRoundsData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    innerRadius={55}
                                                    outerRadius={90}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    nameKey="name"
                                                >
                                                    {revisionRoundsData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip content={<CustomTooltip />} />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    formatter={(value) => <span className="text-xs">{value}</span>}
                                                    iconType="circle"
                                                    iconSize={8}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t px-6 py-3 flex items-center justify-between">
                            <Button variant="outline" className="text-xs h-8">
                                <Download className="h-3 w-3 mr-1.5" />
                                Export Data
                            </Button>
                            <Button variant="ghost" className="h-8 text-xs">View All Analytics</Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Recent Submissions */}
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                            <CardTitle className="text-base font-medium">Recent Submissions</CardTitle>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                View All
                                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2">ID</th>
                                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2">Manuscript</th>
                                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2">Status</th>
                                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2 hidden md:table-cell">Author</th>
                                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2 hidden md:table-cell">Category</th>
                                            <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {isLoading ? (
                                            Array(4).fill(0).map((_, index) => (
                                                <TableRowSkeleton key={`table-row-skeleton-${index}`} />
                                            ))
                                        ) : filteredSubmissions.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                    <FileSearch className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                                    <p>No matching submissions found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredSubmissions.map((submission) => (
                                                <tr
                                                    key={`submission-${submission.id}`}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150"
                                                >
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                        <span className="inline-flex items-center">
                                                            <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", submission.statusColor)}></span>
                                                            {submission.id}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]">
                                                                {submission.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                Submitted on {submission.submitted}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant="outline" className={cn("text-xs", getStatusBadge(submission.status))}>
                                                            {submission.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                        {submission.author}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                        {submission.category}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            className="text-xs h-8"
                                                        >
                                                            Review
                                                            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-3 flex items-center justify-between">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                Showing <span className="font-medium">{filteredSubmissions.length}</span> of {recentSubmissions.length} submissions
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Previous page</span>
                                    <ChevronDown className="h-4 w-4 rotate-90" />
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Next page</span>
                                    <ChevronDown className="h-4 w-4 -rotate-90" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Alerts and status */}
                <div className="flex flex-col md:flex-row gap-6">
                    <Card className="md:w-2/3">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-base font-medium">Outstanding Reviews</CardTitle>
                            <span className="text-xs text-gray-500 font-normal">
                                {filteredReviews.length} pending reviews
                            </span>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array(3).fill(0).map((_, i) => (
                                        <div key={`review-skeleton-${i}`} className="flex items-center space-y-0">
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-3 w-1/4" />
                                            </div>
                                            <Skeleton className="h-8 w-20 ml-4" />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredReviews.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                    <p>No pending reviews to display</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredReviews.map((review, index) => (
                                        <div key={`review-${index}`} className="flex flex-col sm:flex-row gap-2 justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{review.manuscriptId}</span>
                                                    <span className="mx-1.5 text-gray-400">•</span>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[180px] sm:max-w-[250px]">{review.title}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center flex-wrap gap-x-3 gap-y-1">
                                                    <span>Reviewer: {review.reviewer}</span>
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        Due: {review.deadline}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1 sm:w-32 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "absolute top-0 left-0 h-full",
                                                            review.progress === 0
                                                                ? "bg-blue-500"
                                                                : review.progress < 50
                                                                    ? "bg-amber-500"
                                                                    : "bg-green-500"
                                                        )}
                                                        style={{ width: `${review.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium">{review.progress}%</span>
                                                <Button size="sm" variant="ghost" className="ml-auto h-8 text-xs">
                                                    Follow up
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="md:w-1/3">
                        <CardHeader className="pb-2 space-y-0">
                            <CardTitle className="text-base font-medium">Editorial Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array(3).fill(0).map((_, i) => (
                                        <Skeleton key={`alert-skeleton-${i}`} className="h-16 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                                            <div className="mt-0.5">
                                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">Reviewer Shortage</h4>
                                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                                                    Low availability of reviewers in the Computer Science category.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                                            <div className="mt-0.5">
                                                <AlertCircle className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400">Upcoming Deadline</h4>
                                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                                                    Special issue deadline in 10 days.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg">
                                            <div className="mt-0.5">
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-green-800 dark:text-green-400">Monthly Report</h4>
                                                <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                                                    Editorial performance report is ready for review.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4 text-xs h-8 gap-1">
                                        View All Alerts
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Render notifications panel */}
                <NotificationsPanel />
            </div>
        </AuthenticatedLayout>
    );
};
