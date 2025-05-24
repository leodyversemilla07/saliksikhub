<?php

namespace App\Http\Controllers;

use App\Models\Manuscript;
use Illuminate\Http\Request; // Import Request
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon; // Import Carbon

class AuthorController extends Controller
{
    public function index(Request $request) // Inject Request
    {
        $user = Auth::user();
        $timeFilter = $request->input('timeFilter', '6months'); // Default to 6 months

        $startDate = match ($timeFilter) {
            '30days' => Carbon::now()->subDays(30),
            '1year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonths(6), // '6months' or any other value
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
                'journal' => $manuscript->journal_name, // Assuming you have a journal_name or similar
                'category' => $manuscript->category_name, // Assuming you have a category_name or similar
            ];
        });

        // Generate monthlySubmissionData
        $monthlySubmissionData = [];
        $endDate = Carbon::now();
        $currentMonth = $startDate->copy()->startOfMonth();

        while ($currentMonth <= $endDate) {
            $monthName = $currentMonth->shortEnglishMonth; // e.g., 'Jan', 'Feb'

            $submissionsInMonth = Manuscript::where('user_id', $user->id)
                ->whereYear('created_at', $currentMonth->year)
                ->whereMonth('created_at', $currentMonth->month)
                ->get();

            $monthlySubmissionData[] = [
                'month' => $monthName,
                'submissions' => $submissionsInMonth->count(),
                'accepted' => $submissionsInMonth->whereIn('status', [Manuscript::STATUSES['ACCEPTED'], Manuscript::STATUSES['PUBLISHED']])->count(),
                'rejected' => $submissionsInMonth->where('status', Manuscript::STATUSES['REJECTED'])->count(),
            ];
            $currentMonth->addMonth();
        }

        return Inertia::render('author/author-dashboard', [
            'manuscripts' => $manuscriptsData,
            'monthlySubmissionData' => $monthlySubmissionData,
            'currentTimeFilter' => $timeFilter, // Pass the active filter back to frontend
        ]);
    }
}
