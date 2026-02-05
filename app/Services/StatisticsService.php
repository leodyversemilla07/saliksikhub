<?php

namespace App\Services;

use App\Models\Manuscript;
use App\Models\ManuscriptStatistic;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatisticsService
{
    /**
     * Record an investigation (abstract/landing page view)
     */
    public function recordInvestigation(
        Manuscript $manuscript,
        string $ipAddress,
        string $userAgent,
        string $sessionId,
        ?int $galleyId = null
    ): ManuscriptStatistic {
        return $this->recordMetric(
            $manuscript,
            'investigation',
            $ipAddress,
            $userAgent,
            $sessionId,
            $galleyId
        );
    }

    /**
     * Record a request (full-text download)
     */
    public function recordRequest(
        Manuscript $manuscript,
        string $ipAddress,
        string $userAgent,
        string $sessionId,
        ?int $galleyId = null
    ): ManuscriptStatistic {
        return $this->recordMetric(
            $manuscript,
            'request',
            $ipAddress,
            $userAgent,
            $sessionId,
            $galleyId
        );
    }

    /**
     * Record a metric (internal method)
     */
    protected function recordMetric(
        Manuscript $manuscript,
        string $metricType,
        string $ipAddress,
        string $userAgent,
        string $sessionId,
        ?int $galleyId = null
    ): ManuscriptStatistic {
        // Check if this is a duplicate within the session (COUNTER double-click filter)
        $recentView = ManuscriptStatistic::where('manuscript_id', $manuscript->id)
            ->where('session_id', $sessionId)
            ->where('metric_type', $metricType)
            ->where('accessed_at', '>=', now()->subSeconds(30))
            ->first();

        if ($recentView) {
            return $recentView; // Don't count duplicate views
        }

        // Detect country from IP (placeholder - would use GeoIP library)
        $country = $this->detectCountry($ipAddress);

        // Create the statistic record
        $statistic = ManuscriptStatistic::create([
            'manuscript_id' => $manuscript->id,
            'galley_id' => $galleyId,
            'metric_type' => $metricType,
            'accessed_at' => now(),
            'session_id' => $sessionId,
            'ip_address' => $this->hashIpAddress($ipAddress),
            'user_agent' => $userAgent,
            'country_code' => $country,
        ]);

        // Update aggregated statistics
        $this->updateAggregatedStats($manuscript, $metricType, now());

        return $statistic;
    }

    /**
     * Update aggregated statistics for a manuscript
     */
    protected function updateAggregatedStats(
        Manuscript $manuscript,
        string $metricType,
        Carbon $date
    ): void {
        $dateStr = $date->toDateString();

        // Daily aggregation
        DB::table('manuscript_statistics_aggregated')
            ->updateOrInsert(
                [
                    'manuscript_id' => $manuscript->id,
                    'date' => $dateStr,
                    'period_type' => 'daily',
                    'metric_type' => $metricType,
                ],
                [
                    'count' => DB::raw('count + 1'),
                    'updated_at' => now(),
                ]
            );

        // Monthly aggregation
        $monthStr = $date->format('Y-m') . '-01';
        DB::table('manuscript_statistics_aggregated')
            ->updateOrInsert(
                [
                    'manuscript_id' => $manuscript->id,
                    'date' => $monthStr,
                    'period_type' => 'monthly',
                    'metric_type' => $metricType,
                ],
                [
                    'count' => DB::raw('count + 1'),
                    'updated_at' => now(),
                ]
            );

        // Yearly aggregation
        $yearStr = $date->format('Y') . '-01-01';
        DB::table('manuscript_statistics_aggregated')
            ->updateOrInsert(
                [
                    'manuscript_id' => $manuscript->id,
                    'date' => $yearStr,
                    'period_type' => 'yearly',
                    'metric_type' => $metricType,
                ],
                [
                    'count' => DB::raw('count + 1'),
                    'updated_at' => now(),
                ]
            );
    }

    /**
     * Get statistics for a manuscript
     */
    public function getManuscriptStats(
        Manuscript $manuscript,
        string $periodType = 'monthly',
        ?Carbon $startDate = null,
        ?Carbon $endDate = null
    ): array {
        $query = DB::table('manuscript_statistics_aggregated')
            ->where('manuscript_id', $manuscript->id)
            ->where('period_type', $periodType)
            ->orderBy('date');

        if ($startDate) {
            $query->where('date', '>=', $startDate->toDateString());
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate->toDateString());
        }

        $stats = $query->get();

        // Format for charting
        $investigations = [];
        $requests = [];
        $labels = [];

        foreach ($stats as $stat) {
            $dateLabel = $this->formatDateLabel($stat->date, $periodType);
            
            if (!in_array($dateLabel, $labels)) {
                $labels[] = $dateLabel;
            }

            if ($stat->metric_type === 'investigation') {
                $investigations[$dateLabel] = $stat->count;
            } elseif ($stat->metric_type === 'request') {
                $requests[$dateLabel] = $stat->count;
            }
        }

        return [
            'labels' => $labels,
            'investigations' => array_values($investigations),
            'requests' => array_values($requests),
            'total_investigations' => array_sum($investigations),
            'total_requests' => array_sum($requests),
        ];
    }

    /**
     * Get top manuscripts by metric
     */
    public function getTopManuscripts(
        string $metricType = 'investigation',
        int $limit = 10,
        ?Carbon $startDate = null,
        ?Carbon $endDate = null
    ): array {
        $query = DB::table('manuscript_statistics_aggregated')
            ->select('manuscript_id', DB::raw('SUM(count) as total'))
            ->where('metric_type', $metricType)
            ->groupBy('manuscript_id')
            ->orderByDesc('total')
            ->limit($limit);

        if ($startDate) {
            $query->where('date', '>=', $startDate->toDateString());
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate->toDateString());
        }

        $stats = $query->get();

        $manuscripts = Manuscript::whereIn('id', $stats->pluck('manuscript_id'))
            ->with(['author', 'currentPublication'])
            ->get()
            ->keyBy('id');

        return $stats->map(function ($stat) use ($manuscripts) {
            $manuscript = $manuscripts->get($stat->manuscript_id);
            return [
                'manuscript_id' => $stat->manuscript_id,
                'title' => $manuscript?->title ?? 'Unknown',
                'author' => $manuscript?->author?->name ?? 'Unknown',
                'count' => $stat->total,
            ];
        })->toArray();
    }

    /**
     * Get statistics by country
     */
    public function getStatsByCountry(
        Manuscript $manuscript,
        ?Carbon $startDate = null,
        ?Carbon $endDate = null
    ): array {
        $query = ManuscriptStatistic::select('country_code', DB::raw('COUNT(*) as count'))
            ->where('manuscript_id', $manuscript->id)
            ->whereNotNull('country_code')
            ->groupBy('country_code')
            ->orderByDesc('count')
            ->limit(20);

        if ($startDate) {
            $query->where('accessed_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('accessed_at', '<=', $endDate);
        }

        return $query->get()->map(function ($stat) {
            return [
                'country_code' => $stat->country_code,
                'country_name' => $this->getCountryName($stat->country_code),
                'count' => $stat->count,
            ];
        })->toArray();
    }

    /**
     * Get COUNTER 5 compliant report (TR_J1 - Journal Requests)
     */
    public function getCounterReport(
        string $reportType = 'TR_J1',
        Carbon $startDate,
        Carbon $endDate
    ): array {
        // TR_J1: Journal Requests (requests only)
        if ($reportType === 'TR_J1') {
            $stats = DB::table('manuscript_statistics_aggregated')
                ->select('manuscript_id', DB::raw('SUM(count) as total'))
                ->where('metric_type', 'request')
                ->where('period_type', 'monthly')
                ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
                ->groupBy('manuscript_id')
                ->get();

            $manuscripts = Manuscript::whereIn('id', $stats->pluck('manuscript_id'))
                ->with(['author', 'currentPublication'])
                ->get()
                ->keyBy('id');

            return [
                'report_type' => 'TR_J1',
                'report_name' => 'Journal Requests',
                'period' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                ],
                'items' => $stats->map(function ($stat) use ($manuscripts) {
                    $manuscript = $manuscripts->get($stat->manuscript_id);
                    return [
                        'manuscript_id' => $stat->manuscript_id,
                        'title' => $manuscript?->title ?? 'Unknown',
                        'author' => $manuscript?->author?->name ?? 'Unknown',
                        'doi' => $manuscript?->currentPublication?->doi?->doi ?? null,
                        'requests' => $stat->total,
                    ];
                })->toArray(),
            ];
        }

        // TR_J4: Journal Requests Excluding OA_Gold
        if ($reportType === 'TR_J4') {
            // Similar to TR_J1 but filters out open access
            $stats = DB::table('manuscript_statistics_aggregated as msa')
                ->join('manuscripts as m', 'msa.manuscript_id', '=', 'm.id')
                ->join('publications as p', 'm.current_publication_id', '=', 'p.id')
                ->select('msa.manuscript_id', DB::raw('SUM(msa.count) as total'))
                ->where('msa.metric_type', 'request')
                ->where('msa.period_type', 'monthly')
                ->where('p.access_status', '!=', 'open')
                ->whereBetween('msa.date', [$startDate->toDateString(), $endDate->toDateString()])
                ->groupBy('msa.manuscript_id')
                ->get();

            $manuscripts = Manuscript::whereIn('id', $stats->pluck('manuscript_id'))
                ->with(['author', 'currentPublication'])
                ->get()
                ->keyBy('id');

            return [
                'report_type' => 'TR_J4',
                'report_name' => 'Journal Requests Excluding OA_Gold',
                'period' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                ],
                'items' => $stats->map(function ($stat) use ($manuscripts) {
                    $manuscript = $manuscripts->get($stat->manuscript_id);
                    return [
                        'manuscript_id' => $stat->manuscript_id,
                        'title' => $manuscript?->title ?? 'Unknown',
                        'author' => $manuscript?->author?->name ?? 'Unknown',
                        'doi' => $manuscript?->currentPublication?->doi?->doi ?? null,
                        'requests' => $stat->total,
                    ];
                })->toArray(),
            ];
        }

        throw new \InvalidArgumentException("Unsupported report type: {$reportType}");
    }

    /**
     * Hash IP address for privacy (GDPR compliance)
     */
    protected function hashIpAddress(string $ipAddress): string
    {
        // Hash with salt for anonymization while still allowing session tracking
        return hash('sha256', $ipAddress . config('app.key'));
    }

    /**
     * Detect country from IP address
     * TODO: Implement with GeoIP2 library (maxmind/geoip2)
     */
    protected function detectCountry(string $ipAddress): ?string
    {
        // Placeholder - would use GeoIP2\Database\Reader
        // For now, return null
        return null;
    }

    /**
     * Get country name from country code
     */
    protected function getCountryName(string $countryCode): string
    {
        // Simple mapping - would use a proper library
        $countries = [
            'US' => 'United States',
            'GB' => 'United Kingdom',
            'CA' => 'Canada',
            'AU' => 'Australia',
            'DE' => 'Germany',
            'FR' => 'France',
            'JP' => 'Japan',
            'CN' => 'China',
            'IN' => 'India',
            'BR' => 'Brazil',
        ];

        return $countries[$countryCode] ?? $countryCode;
    }

    /**
     * Format date label based on period type
     */
    protected function formatDateLabel(string $date, string $periodType): string
    {
        $carbon = Carbon::parse($date);

        return match ($periodType) {
            'daily' => $carbon->format('M d, Y'),
            'monthly' => $carbon->format('M Y'),
            'yearly' => $carbon->format('Y'),
            default => $date,
        };
    }
}
