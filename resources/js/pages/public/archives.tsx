import { Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    BookOpen,
    FileText,
    Search,
    ChevronRight,
    Layers,
    Clock,
    Hash,
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import type { PageProps } from '@/types';

interface IssueSummary {
    id: number;
    slug: string;
    volume: number;
    number: number;
    title: string | null;
    description: string | null;
    publication_date: string | null;
    cover_image_url: string | null;
    doi: string | null;
    theme: string | null;
    manuscripts_count: number;
}

interface VolumeGroup {
    volume: number;
    issues: IssueSummary[];
}

interface YearGroup {
    year: number;
    volume_count: number;
    issue_count: number;
    volumes: VolumeGroup[];
}

interface ArchiveStats {
    total_issues: number;
    total_volumes: number;
    total_years: number;
}

interface ArchivesProps extends PageProps {
    years: YearGroup[];
    stats: ArchiveStats;
}

export default function Archives({ years, stats }: ArchivesProps) {
    const { currentJournal } = usePage<PageProps>().props;
    const journalName = currentJournal?.name ?? 'Research Journal';
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedVolume, setSelectedVolume] = useState<string>('all');

    // Derive available years and volumes from data
    const availableYears = years.map((y) => y.year);
    const availableVolumes = React.useMemo(() => {
        if (selectedYear === 'all') {
            const vols = new Set<number>();
            years.forEach((y) => y.volumes.forEach((v) => vols.add(v.volume)));
            return [...vols].toSorted((a, b) => b - a);
        }
        const yearData = years.find((y) => y.year === Number(selectedYear));
        if (!yearData) {
            return [];
        }
        return yearData.volumes.map((v) => v.volume).toSorted((a, b) => b - a);
    }, [years, selectedYear]);

    // Reset volume when year changes
    React.useEffect(() => {
        setSelectedVolume('all');
    }, [selectedYear]);

    // Filter years based on selections
    const filteredYears = React.useMemo(() => {
        return years
            .filter(
                (y) =>
                    selectedYear === 'all' || y.year === Number(selectedYear),
            )
            .map((y) => ({
                ...y,
                volumes: y.volumes.filter(
                    (v) =>
                        selectedVolume === 'all' ||
                        v.volume === Number(selectedVolume),
                ),
            }))
            .filter((y) => y.volumes.length > 0);
    }, [years, selectedYear, selectedVolume]);

    return (
        <PublicLayout title={`Archives | ${journalName}`}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                                Archives
                            </h1>
                            <p className="mt-1 text-lg text-muted-foreground">
                                Browse our published issues and research
                                collection.
                            </p>
                        </div>
                        <Link href="/current">
                            <Button variant="outline" className="gap-2">
                                <BookOpen className="h-4 w-4" />
                                Current Issue
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.total_issues}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Published Issues
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Layers className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.total_volumes}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Volumes
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.total_years}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Years
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters Bar */}
                <Card className="mb-8">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search issues..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex gap-3">
                                <Select
                                    value={selectedYear}
                                    onValueChange={setSelectedYear}
                                >
                                    <SelectTrigger className="w-36">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="All Years" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Years
                                        </SelectItem>
                                        {availableYears.map((year) => (
                                            <SelectItem
                                                key={year}
                                                value={String(year)}
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedVolume}
                                    onValueChange={setSelectedVolume}
                                >
                                    <SelectTrigger className="w-40">
                                        <Layers className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="All Volumes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Volumes
                                        </SelectItem>
                                        {availableVolumes.map((vol) => (
                                            <SelectItem
                                                key={vol}
                                                value={String(vol)}
                                            >
                                                Volume {vol}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Year Navigation Sidebar + Issues Grid */}
                {filteredYears.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">
                                No Issues Found
                            </h3>
                            <p className="text-muted-foreground">
                                No published issues match the current filters.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
                        {/* Year Navigation Sidebar */}
                        <div className="space-y-1">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">
                                        Browse by Year
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-0.5 p-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedYear('all')}
                                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                            selectedYear === 'all'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted'
                                        }`}
                                    >
                                        <span>All Years</span>
                                        <Badge
                                            variant={
                                                selectedYear === 'all'
                                                    ? 'secondary'
                                                    : 'outline'
                                            }
                                            className="ml-2 text-xs"
                                        >
                                            {stats.total_years}
                                        </Badge>
                                    </button>
                                    {years.map((y) => (
                                        <button
                                            key={y.year}
                                            type="button"
                                            onClick={() =>
                                                setSelectedYear(String(y.year))
                                            }
                                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                                selectedYear === String(y.year)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                            }`}
                                        >
                                            <span>{y.year}</span>
                                            <Badge
                                                variant={
                                                    selectedYear ===
                                                    String(y.year)
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                                className="ml-2 text-xs"
                                            >
                                                {y.issue_count}
                                            </Badge>
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>
                            {/* Volume Navigation */}
                            {selectedYear !== 'all' && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium">
                                            Volumes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-0.5 p-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedVolume('all')
                                            }
                                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                                selectedVolume === 'all'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                            }`}
                                        >
                                            <span>All Volumes</span>
                                        </button>
                                        {years
                                            .find(
                                                (y) =>
                                                    y.year ===
                                                    Number(selectedYear),
                                            )
                                            ?.volumes.map((v) => (
                                                <button
                                                    key={v.volume}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedVolume(
                                                            String(v.volume),
                                                        )
                                                    }
                                                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                                        selectedVolume ===
                                                        String(v.volume)
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'hover:bg-muted'
                                                    }`}
                                                >
                                                    <span>Vol. {v.volume}</span>
                                                    <Badge
                                                        variant={
                                                            selectedVolume ===
                                                            String(v.volume)
                                                                ? 'secondary'
                                                                : 'outline'
                                                        }
                                                        className="ml-2 text-xs"
                                                    >
                                                        {v.issues.length}
                                                    </Badge>
                                                </button>
                                            ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Issues List */}
                        <div className="space-y-6">
                            {filteredYears.map((yearData) => (
                                <div key={yearData.year}>
                                    <div className="mb-4 flex items-center gap-3">
                                        <h2 className="text-xl font-semibold text-foreground">
                                            {yearData.year}
                                        </h2>
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full"
                                        >
                                            {yearData.issue_count} issue
                                            {yearData.issue_count !== 1
                                                ? 's'
                                                : ''}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3">
                                        {yearData.volumes.map((volumeData) =>
                                            volumeData.issues
                                                .filter((issue) => {
                                                    if (!searchQuery.trim()) {
                                                        return true;
                                                    }
                                                    const q =
                                                        searchQuery.toLowerCase();
                                                    return (
                                                        (issue.title ?? '')
                                                            .toLowerCase()
                                                            .includes(q) ||
                                                        (
                                                            issue.description ??
                                                            ''
                                                        )
                                                            .toLowerCase()
                                                            .includes(q) ||
                                                        (issue.theme ?? '')
                                                            .toLowerCase()
                                                            .includes(q) ||
                                                        String(
                                                            issue.volume,
                                                        ).includes(q) ||
                                                        String(
                                                            issue.number,
                                                        ).includes(q)
                                                    );
                                                })
                                                .map((issue) => (
                                                    <Link
                                                        key={issue.id}
                                                        href={`/issues/${issue.slug}`}
                                                        className="group block"
                                                    >
                                                        <Card className="transition-shadow hover:shadow-md">
                                                            <CardContent className="flex gap-4 p-4">
                                                                {issue.cover_image_url ? (
                                                                    <div className="h-28 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                                                                        <img
                                                                            src={
                                                                                issue.cover_image_url
                                                                            }
                                                                            alt={`Cover Vol. ${issue.volume} No. ${issue.number}`}
                                                                            className="h-full w-full object-cover"
                                                                            onError={(
                                                                                e,
                                                                            ) => {
                                                                                e.currentTarget.style.display =
                                                                                    'none';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-md border bg-muted">
                                                                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                                                                    </div>
                                                                )}

                                                                <div className="min-w-0 flex-1">
                                                                    <div className="mb-1 flex items-center gap-2">
                                                                        <span className="text-sm font-medium text-primary">
                                                                            Vol.{' '}
                                                                            {
                                                                                issue.volume
                                                                            }
                                                                            ,
                                                                            No.{' '}
                                                                            {
                                                                                issue.number
                                                                            }
                                                                        </span>
                                                                        {issue.theme && (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="text-xs"
                                                                            >
                                                                                {
                                                                                    issue.theme
                                                                                }
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    {issue.title && (
                                                                        <h3 className="mb-1 font-semibold text-foreground group-hover:text-primary">
                                                                            {
                                                                                issue.title
                                                                            }
                                                                        </h3>
                                                                    )}
                                                                    {issue.description && (
                                                                        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                                                                            {
                                                                                issue.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                                        {issue.publication_date && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Calendar className="h-3 w-3" />
                                                                                {new Date(
                                                                                    issue.publication_date,
                                                                                ).toLocaleDateString()}
                                                                            </span>
                                                                        )}
                                                                        <span className="flex items-center gap-1">
                                                                            <FileText className="h-3 w-3" />
                                                                            {
                                                                                issue.manuscripts_count
                                                                            }{' '}
                                                                            article
                                                                            {issue.manuscripts_count !==
                                                                            1
                                                                                ? 's'
                                                                                : ''}
                                                                        </span>
                                                                        {issue.doi && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Hash className="h-3 w-3" />
                                                                                {
                                                                                    issue.doi
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex shrink-0 items-center">
                                                                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </Link>
                                                )),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
