<?php

namespace App\Http\Controllers;

use App\ManuscriptStatus;
use App\Models\Manuscript;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $timeFilter = $request->input('timeFilter', '6months');

        $startDate = match ($timeFilter) {
            '30days' => Carbon::now()->subDays(30),
            '1year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonths(6),
        };

        $manuscriptsQuery = Manuscript::where('user_id', $user->id)
            ->where('created_at', '>=', $startDate);

        $filteredManuscripts = $manuscriptsQuery->orderBy('created_at', 'desc')->get();

        $manuscriptsData = $filteredManuscripts->map(function ($manuscript) {
            return [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'status' => $manuscript->status,
                'created_at' => $manuscript->created_at ? $manuscript->created_at->toIso8601String() : null,
                'updated_at' => $manuscript->updated_at->toIso8601String(),
                'journal' => $manuscript->journal_name,
                'category' => $manuscript->category_name,
            ];
        });

        $monthlySubmissionData = [];
        $endDate = Carbon::now();
        $currentMonth = $startDate->copy()->startOfMonth();

        while ($currentMonth <= $endDate) {
            $monthName = $currentMonth->shortEnglishMonth;
            $submissionsInMonth = Manuscript::where('user_id', $user->id)
                ->whereYear('created_at', $currentMonth->year)
                ->whereMonth('created_at', $currentMonth->month)
                ->get();
            $monthlySubmissionData[] = [
                'month' => $monthName,
                'submissions' => $submissionsInMonth->count(),
                'accepted' => $submissionsInMonth->whereIn('status', [ManuscriptStatus::ACCEPTED, ManuscriptStatus::PUBLISHED])->count(),
                'rejected' => $submissionsInMonth->where('status', ManuscriptStatus::REJECTED)->count(),
            ];
            $currentMonth->addMonth();
        }

        return Inertia::render('author/dashboard', [
            'manuscripts' => $manuscriptsData,
            'monthlySubmissionData' => $monthlySubmissionData,
            'currentTimeFilter' => $timeFilter,
        ]);
    }
}
