<?php

namespace App\Http\Controllers\Statistics;

use App\Enums\ManuscriptStatus;
use App\Http\Controllers\Controller;
use App\Models\Manuscript;
use App\Models\ManuscriptStatistic;
use App\Services\StatisticsService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StatisticsController extends Controller
{
    public function __construct(
        protected StatisticsService $statisticsService
    ) {}

    /**
     * Display overall statistics dashboard
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Manuscript::class);

        $periodType = $request->input('period', 'monthly');
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : now()->subMonths(12);
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : now();

        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;

        // Overview totals
        $totalInvestigations = ManuscriptStatistic::where('metric_type', 'investigation')
            ->whereBetween('metric_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->count();

        $totalRequests = ManuscriptStatistic::where('metric_type', 'request')
            ->whereBetween('metric_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->count();

        $uniqueVisitors = ManuscriptStatistic::whereBetween('metric_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->distinct('session_id')
            ->count('session_id');

        $totalPublished = Manuscript::where('status', ManuscriptStatus::PUBLISHED)
            ->when($journal, fn ($q) => $q->where('journal_id', $journal->id))
            ->count();

        $avgPerArticle = $totalPublished > 0
            ? round(($totalInvestigations + $totalRequests) / $totalPublished, 1)
            : 0;

        // Monthly trends (last 12 months)
        $monthlyTrends = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth()->toDateString();
            $monthEnd = $month->copy()->endOfMonth()->toDateString();
            $label = $month->format('M Y');

            $monthlyTrends[] = [
                'month' => $label,
                'investigations' => ManuscriptStatistic::where('metric_type', 'investigation')
                    ->whereBetween('metric_date', [$monthStart, $monthEnd])
                    ->count(),
                'requests' => ManuscriptStatistic::where('metric_type', 'request')
                    ->whereBetween('metric_date', [$monthStart, $monthEnd])
                    ->count(),
            ];
        }

        // Top manuscripts by investigations (views)
        $topInvestigations = $this->statisticsService->getTopManuscripts(
            'investigation',
            10,
            $startDate,
            $endDate
        );

        // Top manuscripts by requests (downloads)
        $topRequests = $this->statisticsService->getTopManuscripts(
            'request',
            10,
            $startDate,
            $endDate
        );

        // Geographic distribution
        $geoStats = ManuscriptStatistic::select('country_code', DB::raw('COUNT(*) as count'))
            ->whereNotNull('country_code')
            ->whereBetween('metric_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->groupBy('country_code')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(function ($stat) {
                return [
                    'country' => $stat->country_code,
                    'count' => $stat->count,
                ];
            })
            ->toArray();

        return Inertia::render('statistics/index', [
            'overview' => [
                'totalInvestigations' => $totalInvestigations,
                'totalRequests' => $totalRequests,
                'uniqueVisitors' => $uniqueVisitors,
                'avgPerArticle' => $avgPerArticle,
                'totalPublished' => $totalPublished,
            ],
            'monthlyTrends' => $monthlyTrends,
            'topInvestigations' => $topInvestigations,
            'topRequests' => $topRequests,
            'geoStats' => $geoStats,
            'periodType' => $periodType,
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
        ]);
    }

    /**
     * Display statistics for a specific manuscript
     */
    public function show(Request $request, Manuscript $manuscript): Response
    {
        $this->authorize('view', $manuscript);

        $periodType = $request->input('period', 'monthly');
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : now()->subMonths(12);
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : now();

        // Get manuscript stats
        $stats = $this->statisticsService->getManuscriptStats(
            $manuscript,
            $periodType,
            $startDate,
            $endDate
        );

        // Get country breakdown
        $countryStats = $this->statisticsService->getStatsByCountry(
            $manuscript,
            $startDate,
            $endDate
        );

        return Inertia::render('statistics/show', [
            'manuscript' => [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'slug' => $manuscript->slug,
                'author' => [
                    'id' => $manuscript->author->id,
                    'name' => $manuscript->author->name,
                ],
            ],
            'stats' => $stats,
            'countryStats' => $countryStats,
            'periodType' => $periodType,
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
        ]);
    }

    /**
     * Get COUNTER report
     */
    public function counterReport(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Manuscript::class);

        $validated = $request->validate([
            'report_type' => 'required|string|in:TR_J1,TR_J4',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $report = $this->statisticsService->getCounterReport(
            Carbon::parse($validated['start_date']),
            Carbon::parse($validated['end_date']),
            $validated['report_type']
        );

        return response()->json($report);
    }

    /**
     * Export statistics as CSV
     */
    public function export(Request $request, Manuscript $manuscript): \Illuminate\Http\Response
    {
        $this->authorize('view', $manuscript);

        $periodType = $request->input('period', 'monthly');
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : now()->subMonths(12);
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : now();

        $stats = $this->statisticsService->getManuscriptStats(
            $manuscript,
            $periodType,
            $startDate,
            $endDate
        );

        // Generate CSV
        $csv = "Date,Investigations,Requests\n";
        foreach ($stats['labels'] as $index => $label) {
            $investigations = $stats['investigations'][$index] ?? 0;
            $requests = $stats['requests'][$index] ?? 0;
            $csv .= "\"{$label}\",{$investigations},{$requests}\n";
        }

        $filename = "manuscript-{$manuscript->id}-statistics-".now()->format('Y-m-d').'.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Get statistics API endpoint (for charts)
     */
    public function api(Request $request, Manuscript $manuscript): JsonResponse
    {
        $this->authorize('view', $manuscript);

        $periodType = $request->input('period', 'monthly');
        $startDate = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))
            : now()->subMonths(12);
        $endDate = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))
            : now();

        $stats = $this->statisticsService->getManuscriptStats(
            $manuscript,
            $periodType,
            $startDate,
            $endDate
        );

        return response()->json($stats);
    }
}
