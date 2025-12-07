<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\JournalPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalCmsController extends Controller
{
    /**
     * Display the journal home page with CMS content.
     */
    public function home(Request $request)
    {
        $journal = $request->get('current_journal');

        if (! $journal) {
            return Inertia::render('home', [
                'page' => null,
                'sections' => [],
            ]);
        }

        $page = JournalPage::forJournal($journal->id)
            ->where('type', 'home')
            ->published()
            ->with(['sections' => fn ($q) => $q->where('is_visible', true)->orderBy('order')])
            ->first();

        return Inertia::render('home', [
            'page' => $page,
            'sections' => $page?->sections ?? [],
            'themeSettings' => $journal->merged_theme_settings,
        ]);
    }

    /**
     * Display a CMS page by slug.
     */
    public function show(Request $request, string $slug)
    {
        $journal = $request->get('current_journal');

        if (! $journal) {
            abort(404);
        }

        $page = JournalPage::forJournal($journal->id)
            ->where('slug', $slug)
            ->published()
            ->with(['sections' => fn ($q) => $q->where('is_visible', true)->orderBy('order')])
            ->firstOrFail();

        // Route to specific Inertia pages based on page type
        $pageView = match ($page->type) {
            'about' => 'about-journal',
            'editorial_board' => 'editorial-board',
            'submission_guidelines' => 'submissions',
            'contact' => 'contact-us',
            default => 'cms/page',
        };

        return Inertia::render($pageView, [
            'page' => $page,
            'sections' => $page->sections,
            'themeSettings' => $journal->merged_theme_settings,
        ]);
    }

    /**
     * Get the navigation menu for the current journal.
     */
    public function getMenu(Request $request)
    {
        $journal = $request->get('current_journal');

        if (! $journal) {
            return response()->json(['menu' => []]);
        }

        $menuItems = $journal->menuItems()
            ->where('is_active', true)
            ->whereIn('location', ['header', 'both'])
            ->whereNull('parent_id')
            ->with(['page:id,slug,title', 'children' => function ($query) {
                $query->where('is_active', true)
                    ->with('page:id,slug,title')
                    ->orderBy('order');
            }])
            ->orderBy('order')
            ->get();

        return response()->json(['menu' => $menuItems]);
    }
}
