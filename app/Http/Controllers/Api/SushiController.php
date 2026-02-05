<?php

namespace App\Http\Controllers\Api;

use App\Models\Manuscript;
use App\Services\StatisticsService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

/**
 * SUSHI API Controller
 * Implements COUNTER 5 SUSHI (Standardized Usage Statistics Harvesting Initiative)
 * 
 * @see https://www.projectcounter.org/code-of-practice-five-sections/sushi-protocol/
 */
class SushiController extends Controller
{
    public function __construct(
        protected StatisticsService $statisticsService
    ) {}

    /**
     * SUSHI Status Endpoint
     * Returns service status and alerts
     * 
     * @see https://app.swaggerhub.com/apis/COUNTER/counter-sushi_5_0_api/1.0.0#/default/getStatus
     */
    public function status(Request $request): JsonResponse
    {
        return response()->json([
            'Description' => 'COUNTER SUSHI API for ' . config('app.name'),
            'Service_Active' => true,
            'Registry_URL' => config('services.sushi.registry_url', ''),
            'Note' => 'Service is operating normally',
            'Alerts' => [],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    /**
     * List of Consortium Members
     * Returns list of customer IDs for consortium members
     */
    public function members(Request $request): JsonResponse
    {
        // For now, return empty list as we don't have consortium support
        return response()->json([
            'Customer_ID' => config('services.sushi.customer_id', 'saliksikhub'),
            'Requestor_ID' => $request->input('requestor_id', ''),
            'Members' => [],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    /**
     * List Available Reports
     * Returns list of supported COUNTER reports
     */
    public function reports(Request $request): JsonResponse
    {
        return response()->json([
            [
                'Report_Name' => 'Journal Requests',
                'Report_ID' => 'TR_J1',
                'Release' => '5',
                'Report_Description' => 'Journal Requests: reports on the number of requests for journal content',
                'Path' => route('sushi.report', ['report' => 'tr_j1']),
            ],
            [
                'Report_Name' => 'Journal Requests Excluding OA_Gold',
                'Report_ID' => 'TR_J4',
                'Release' => '5',
                'Report_Description' => 'Journal Requests Excluding OA_Gold: excludes Gold Open Access content',
                'Path' => route('sushi.report', ['report' => 'tr_j4']),
            ],
            [
                'Report_Name' => 'Item Requests',
                'Report_ID' => 'IR',
                'Release' => '5',
                'Report_Description' => 'Item Requests: reports on individual article requests',
                'Path' => route('sushi.report', ['report' => 'ir']),
            ],
        ], 200, [], JSON_UNESCAPED_SLASHES);
    }

    /**
     * Generate COUNTER Report
     * Returns usage statistics in COUNTER 5 JSON format
     * 
     * @param string $report Report type (tr_j1, tr_j4, ir)
     */
    public function report(Request $request, string $report): JsonResponse
    {
        // Validate request parameters
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|string',
            'begin_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after:begin_date',
            'platform' => 'nullable|string',
            'requestor_id' => 'nullable|string',
            'api_key' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse(
                3030,
                'Invalid Date Arguments',
                $validator->errors()->first(),
                400
            );
        }

        // Verify API key
        if (!$this->verifyApiKey($request->input('api_key'))) {
            return $this->errorResponse(
                2000,
                'Invalid API Key',
                'The API key provided is not valid',
                401
            );
        }

        $startDate = Carbon::parse($request->input('begin_date'));
        $endDate = Carbon::parse($request->input('end_date'));

        // Generate report based on type
        $reportType = strtoupper($report);
        
        try {
            switch ($reportType) {
                case 'TR_J1':
                    return $this->generateTrJ1Report($startDate, $endDate, $request);
                    
                case 'TR_J4':
                    return $this->generateTrJ4Report($startDate, $endDate, $request);
                    
                case 'IR':
                    return $this->generateIrReport($startDate, $endDate, $request);
                    
                default:
                    return $this->errorResponse(
                        3020,
                        'Invalid Report Type',
                        "Report type '{$report}' is not supported",
                        400
                    );
            }
        } catch (\Exception $e) {
            return $this->errorResponse(
                3000,
                'Service Not Available',
                'An error occurred generating the report: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Generate TR_J1: Journal Requests Report
     */
    protected function generateTrJ1Report(Carbon $startDate, Carbon $endDate, Request $request): JsonResponse
    {
        $reportData = $this->statisticsService->getCounterReport('TR_J1', $startDate, $endDate);

        $items = collect($reportData['items'])->map(function ($item) use ($startDate, $endDate) {
            return [
                'Title' => $item['title'],
                'Item_ID' => [
                    [
                        'Type' => 'DOI',
                        'Value' => $item['doi'] ?? '',
                    ],
                    [
                        'Type' => 'Proprietary',
                        'Value' => (string) $item['manuscript_id'],
                    ],
                ],
                'Platform' => config('app.name'),
                'Publisher' => config('app.name'),
                'Data_Type' => 'Article',
                'Access_Type' => 'Controlled',
                'Performance' => [
                    [
                        'Period' => [
                            'Begin_Date' => $startDate->format('Y-m-d'),
                            'End_Date' => $endDate->format('Y-m-d'),
                        ],
                        'Instance' => [
                            [
                                'Metric_Type' => 'Total_Item_Requests',
                                'Count' => $item['requests'],
                            ],
                        ],
                    ],
                ],
            ];
        })->toArray();

        return response()->json([
            'Report_Header' => $this->buildReportHeader('TR_J1', $startDate, $endDate, $request),
            'Report_Items' => $items,
        ], 200, [], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    /**
     * Generate TR_J4: Journal Requests Excluding OA_Gold Report
     */
    protected function generateTrJ4Report(Carbon $startDate, Carbon $endDate, Request $request): JsonResponse
    {
        $reportData = $this->statisticsService->getCounterReport('TR_J4', $startDate, $endDate);

        $items = collect($reportData['items'])->map(function ($item) use ($startDate, $endDate) {
            return [
                'Title' => $item['title'],
                'Item_ID' => [
                    [
                        'Type' => 'DOI',
                        'Value' => $item['doi'] ?? '',
                    ],
                    [
                        'Type' => 'Proprietary',
                        'Value' => (string) $item['manuscript_id'],
                    ],
                ],
                'Platform' => config('app.name'),
                'Publisher' => config('app.name'),
                'Data_Type' => 'Article',
                'Access_Type' => 'Controlled',
                'Performance' => [
                    [
                        'Period' => [
                            'Begin_Date' => $startDate->format('Y-m-d'),
                            'End_Date' => $endDate->format('Y-m-d'),
                        ],
                        'Instance' => [
                            [
                                'Metric_Type' => 'Total_Item_Requests',
                                'Count' => $item['requests'],
                            ],
                        ],
                    ],
                ],
            ];
        })->toArray();

        return response()->json([
            'Report_Header' => $this->buildReportHeader('TR_J4', $startDate, $endDate, $request),
            'Report_Items' => $items,
        ], 200, [], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    /**
     * Generate IR: Item Requests Report
     */
    protected function generateIrReport(Carbon $startDate, Carbon $endDate, Request $request): JsonResponse
    {
        // Get all manuscripts with requests in the period
        $manuscripts = Manuscript::with(['author', 'currentPublication.doi'])
            ->whereHas('statistics', function ($query) use ($startDate, $endDate) {
                $query->where('metric_type', 'request')
                    ->whereBetween('accessed_at', [$startDate, $endDate]);
            })
            ->get();

        $items = $manuscripts->map(function ($manuscript) use ($startDate, $endDate) {
            $stats = $this->statisticsService->getManuscriptStats(
                $manuscript,
                'monthly',
                $startDate,
                $endDate
            );

            return [
                'Title' => $manuscript->title,
                'Item_ID' => [
                    [
                        'Type' => 'DOI',
                        'Value' => $manuscript->currentPublication?->doi?->doi ?? '',
                    ],
                    [
                        'Type' => 'Proprietary',
                        'Value' => (string) $manuscript->id,
                    ],
                ],
                'Platform' => config('app.name'),
                'Publisher' => config('app.name'),
                'Authors' => [
                    [
                        'Name' => $manuscript->author->name,
                        'Type' => 'Author',
                    ],
                ],
                'Data_Type' => 'Article',
                'Access_Type' => $manuscript->currentPublication?->access_status === 'open' ? 'OA_Gold' : 'Controlled',
                'Performance' => [
                    [
                        'Period' => [
                            'Begin_Date' => $startDate->format('Y-m-d'),
                            'End_Date' => $endDate->format('Y-m-d'),
                        ],
                        'Instance' => [
                            [
                                'Metric_Type' => 'Total_Item_Investigations',
                                'Count' => $stats['total_investigations'],
                            ],
                            [
                                'Metric_Type' => 'Total_Item_Requests',
                                'Count' => $stats['total_requests'],
                            ],
                        ],
                    ],
                ],
            ];
        })->toArray();

        return response()->json([
            'Report_Header' => $this->buildReportHeader('IR', $startDate, $endDate, $request),
            'Report_Items' => $items,
        ], 200, [], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    /**
     * Build standard COUNTER report header
     */
    protected function buildReportHeader(string $reportType, Carbon $startDate, Carbon $endDate, Request $request): array
    {
        $reportNames = [
            'TR_J1' => 'Journal Requests',
            'TR_J4' => 'Journal Requests Excluding OA_Gold',
            'IR' => 'Item Requests',
        ];

        return [
            'Report_Name' => $reportNames[$reportType] ?? $reportType,
            'Report_ID' => $reportType,
            'Release' => '5',
            'Institution_Name' => config('app.name'),
            'Institution_ID' => [
                [
                    'Type' => 'Proprietary',
                    'Value' => $request->input('customer_id'),
                ],
            ],
            'Report_Filters' => [
                [
                    'Name' => 'Begin_Date',
                    'Value' => $startDate->format('Y-m-d'),
                ],
                [
                    'Name' => 'End_Date',
                    'Value' => $endDate->format('Y-m-d'),
                ],
            ],
            'Report_Attributes' => [],
            'Exceptions' => [],
            'Created' => now()->toIso8601String(),
            'Created_By' => config('app.name') . ' SUSHI API',
        ];
    }

    /**
     * Verify API key
     */
    protected function verifyApiKey(string $apiKey): bool
    {
        // Check against configured SUSHI API keys
        $validKeys = config('services.sushi.api_keys', []);
        
        if (empty($validKeys)) {
            // If no keys configured, allow any key (for development)
            return true;
        }

        return in_array($apiKey, $validKeys);
    }

    /**
     * Return standardized error response
     */
    protected function errorResponse(int $code, string $severity, string $message, int $httpStatus = 400): JsonResponse
    {
        return response()->json([
            'Code' => $code,
            'Severity' => $severity,
            'Message' => $message,
            'Data' => null,
        ], $httpStatus, [], JSON_UNESCAPED_SLASHES);
    }
}
