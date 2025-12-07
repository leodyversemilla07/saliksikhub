<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use App\Models\JournalMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JournalMenuController extends Controller
{
    /**
     * Display the menu management page.
     */
    public function index(Journal $journal)
    {
        $menus = $journal->menuItems()
            ->with(['children' => function ($q) {
                $q->orderBy('order')->with('page');
            }, 'page'])
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();

        $pages = $journal->pages()
            ->published()
            ->select('id', 'title', 'slug', 'type')
            ->get();

        return Inertia::render('admin/cms/menus/index', [
            'journal' => $journal,
            'menuItems' => $menus,
            'pages' => $pages,
            'locations' => JournalMenu::LOCATIONS,
        ]);
    }

    /**
     * Store a new menu item.
     */
    public function store(Request $request, Journal $journal)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'nullable|string|max:500',
            'journal_page_id' => 'nullable|exists:journal_pages,id',
            'parent_id' => 'nullable|exists:journal_menus,id',
            'location' => 'required|in:'.implode(',', array_keys(JournalMenu::LOCATIONS)),
            'open_in_new_tab' => 'boolean',
        ]);

        // Validate that either url or journal_page_id is provided
        if (empty($validated['url']) && empty($validated['journal_page_id'])) {
            return back()->withErrors(['url' => 'Either a URL or a page must be selected.']);
        }

        $validated['journal_id'] = $journal->id;
        $validated['order'] = $journal->menuItems()
            ->where('parent_id', $validated['parent_id'] ?? null)
            ->max('order') + 1;
        $validated['is_active'] = true;

        JournalMenu::create($validated);

        return back()->with('success', 'Menu item created successfully.');
    }

    /**
     * Update a menu item.
     */
    public function update(Request $request, Journal $journal, JournalMenu $menu)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'nullable|string|max:500',
            'journal_page_id' => 'nullable|exists:journal_pages,id',
            'location' => 'required|in:'.implode(',', array_keys(JournalMenu::LOCATIONS)),
            'is_active' => 'boolean',
            'open_in_new_tab' => 'boolean',
        ]);

        $menu->update($validated);

        return back()->with('success', 'Menu item updated successfully.');
    }

    /**
     * Delete a menu item.
     */
    public function destroy(Journal $journal, JournalMenu $menu)
    {
        $menu->delete();

        return back()->with('success', 'Menu item deleted successfully.');
    }

    /**
     * Reorder menu items.
     */
    public function reorder(Request $request, Journal $journal)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:journal_menus,id',
            'items.*.order' => 'required|integer|min:0',
            'items.*.parent_id' => 'nullable|exists:journal_menus,id',
        ]);

        DB::transaction(function () use ($validated, $journal) {
            foreach ($validated['items'] as $itemData) {
                JournalMenu::where('id', $itemData['id'])
                    ->where('journal_id', $journal->id)
                    ->update([
                        'order' => $itemData['order'],
                        'parent_id' => $itemData['parent_id'] ?? null,
                    ]);
            }
        });

        return back()->with('success', 'Menu order updated.');
    }
}
