import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardCheck, Clock, Eye, FileCheck, FileText, Package, Sparkles } from 'lucide-react';

interface ProductionStats {
    none: number;
    copyediting: number;
    typesetting: number;
    proofing: number;
    ready: number;
    published: number;
}

interface AverageTimes {
    copyediting: number;
    typesetting: number;
    proofing: number;
}

interface Manuscript {
    id: number;
    title: string;
    slug: string;
    production_stage: string;
    copyediting_started_at: string | null;
    typesetting_started_at: string | null;
    proofing_started_at: string | null;
    author: {
        id: number;
        name: string;
    };
    copyeditor?: {
        id: number;
        name: string;
    };
    layout_editor?: {
        id: number;
        name: string;
    };
}

interface Props {
    stats: ProductionStats;
    averageTimes: AverageTimes;
    manuscriptsByCopyediting: Manuscript[];
    manuscriptsByTypesetting: Manuscript[];
    manuscriptsByProofing: Manuscript[];
    manuscriptsReady: Manuscript[];
}

export default function ProductionDashboard({
    stats,
    averageTimes,
    manuscriptsByCopyediting,
    manuscriptsByTypesetting,
    manuscriptsByProofing,
    manuscriptsReady,
}: Props) {
    const getStageIcon = (stage: string) => {
        const icons = {
            copyediting: <FileText className="w-5 h-5" />,
            typesetting: <Package className="w-5 h-5" />,
            proofing: <Eye className="w-5 h-5" />,
            ready: <FileCheck className="w-5 h-5" />,
        };
        return icons[stage as keyof typeof icons] || <Clock className="w-5 h-5" />;
    };

    const getDaysElapsed = (startDate: string | null) => {
        if (!startDate) return 0;
        const start = new Date(startDate);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    const renderManuscriptCard = (manuscript: Manuscript) => {
        let startedAt: string | null = null;
        let assignedTo: string | undefined;

        switch (manuscript.production_stage) {
            case 'copyediting':
                startedAt = manuscript.copyediting_started_at;
                assignedTo = manuscript.copyeditor?.name;
                break;
            case 'typesetting':
                startedAt = manuscript.typesetting_started_at;
                assignedTo = manuscript.layout_editor?.name;
                break;
            case 'proofing':
                startedAt = manuscript.proofing_started_at;
                break;
        }

        const daysElapsed = getDaysElapsed(startedAt);

        return (
            <Card key={manuscript.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-base">{manuscript.title}</CardTitle>
                            <CardDescription className="mt-1">
                                <span className="text-sm">by {manuscript.author.name}</span>
                            </CardDescription>
                        </div>
                        <Link href={route('production.show', manuscript.id)}>
                            <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between text-sm">
                        <div className="space-y-1">
                            {assignedTo && (
                                <div className="text-gray-600">
                                    <span className="font-medium">Assigned to:</span> {assignedTo}
                                </div>
                            )}
                            <div className="text-gray-600">
                                <span className="font-medium">Days in stage:</span> {daysElapsed}
                            </div>
                        </div>
                        {daysElapsed > 14 && (
                            <Badge variant="destructive" className="ml-2">
                                Overdue
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout>
            <Head title="Production Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Production Dashboard</h1>
                        <p className="text-gray-600">Manage manuscript production workflow</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">Copyediting</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{stats.copyediting}</div>
                                    <FileText className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Avg: {averageTimes.copyediting} days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">Typesetting</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{stats.typesetting}</div>
                                    <Package className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Avg: {averageTimes.typesetting} days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">Proofing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{stats.proofing}</div>
                                    <Eye className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Avg: {averageTimes.proofing} days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">Ready</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{stats.ready}</div>
                                    <FileCheck className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">For publication</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">Published</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">{stats.published}</div>
                                    <Sparkles className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Completed</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-gray-600 uppercase">Total</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold">
                                        {stats.copyediting + stats.typesetting + stats.proofing + stats.ready}
                                    </div>
                                    <ClipboardCheck className="w-5 h-5 text-gray-500" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">In production</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Manuscripts by Stage */}
                    <Tabs defaultValue="copyediting" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="copyediting">
                                Copyediting ({manuscriptsByCopyediting.length})
                            </TabsTrigger>
                            <TabsTrigger value="typesetting">
                                Typesetting ({manuscriptsByTypesetting.length})
                            </TabsTrigger>
                            <TabsTrigger value="proofing">Proofing ({manuscriptsByProofing.length})</TabsTrigger>
                            <TabsTrigger value="ready">Ready ({manuscriptsReady.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="copyediting" className="space-y-4 mt-4">
                            {manuscriptsByCopyediting.length > 0 ? (
                                manuscriptsByCopyediting.map(renderManuscriptCard)
                            ) : (
                                <Card>
                                    <CardContent className="py-12 text-center text-gray-500">
                                        No manuscripts in copyediting
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="typesetting" className="space-y-4 mt-4">
                            {manuscriptsByTypesetting.length > 0 ? (
                                manuscriptsByTypesetting.map(renderManuscriptCard)
                            ) : (
                                <Card>
                                    <CardContent className="py-12 text-center text-gray-500">
                                        No manuscripts in typesetting
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="proofing" className="space-y-4 mt-4">
                            {manuscriptsByProofing.length > 0 ? (
                                manuscriptsByProofing.map(renderManuscriptCard)
                            ) : (
                                <Card>
                                    <CardContent className="py-12 text-center text-gray-500">
                                        No manuscripts in proofing
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="ready" className="space-y-4 mt-4">
                            {manuscriptsReady.length > 0 ? (
                                manuscriptsReady.map(renderManuscriptCard)
                            ) : (
                                <Card>
                                    <CardContent className="py-12 text-center text-gray-500">
                                        No manuscripts ready for publication
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
