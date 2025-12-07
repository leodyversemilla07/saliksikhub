<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use App\Models\JournalPage;
use App\Models\JournalPageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JournalPageController extends Controller
{
    /**
     * Display a listing of the pages for a journal.
     */
    public function index(Journal $journal)
    {
        $pages = $journal->pages()
            ->withCount('sections')
            ->orderBy('menu_order')
            ->get();

        return Inertia::render('admin/cms/pages/index', [
            'journal' => $journal,
            'pages' => $pages,
            'pageTypes' => JournalPage::TYPES,
        ]);
    }

    /**
     * Show the form for creating a new page.
     */
    public function create(Journal $journal)
    {
        return Inertia::render('admin/cms/pages/create', [
            'journal' => $journal,
            'pageTypes' => JournalPage::TYPES,
            'sectionTypes' => JournalPageSection::TYPES,
        ]);
    }

    /**
     * Store a newly created page.
     */
    public function store(Request $request, Journal $journal)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:'.implode(',', array_keys(JournalPage::TYPES)),
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'show_in_menu' => 'boolean',
        ]);

        $validated['journal_id'] = $journal->id;
        $validated['menu_order'] = $journal->pages()->max('menu_order') + 1;

        $page = JournalPage::create($validated);

        return redirect()
            ->route('admin.journals.cms.pages.edit', [$journal, $page])
            ->with('success', 'Page created successfully. Now add sections to your page.');
    }

    /**
     * Show the form for editing a page.
     */
    public function edit(Journal $journal, JournalPage $page)
    {
        $page->load('sections');

        return Inertia::render('admin/cms/pages/edit', [
            'journal' => $journal,
            'page' => $page,
            'pageTypes' => JournalPage::TYPES,
            'sectionTypes' => JournalPageSection::TYPES,
        ]);
    }

    /**
     * Update the specified page.
     */
    public function update(Request $request, Journal $journal, JournalPage $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:'.implode(',', array_keys(JournalPage::TYPES)),
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'show_in_menu' => 'boolean',
        ]);

        $page->update($validated);

        return back()->with('success', 'Page updated successfully.');
    }

    /**
     * Remove the specified page.
     */
    public function destroy(Journal $journal, JournalPage $page)
    {
        // Prevent deletion of home page
        if ($page->type === 'home') {
            return back()->with('error', 'Cannot delete the home page.');
        }

        $page->delete();

        return redirect()
            ->route('admin.journals.cms.pages.index', $journal)
            ->with('success', 'Page deleted successfully.');
    }

    /**
     * Reorder pages.
     */
    public function reorder(Request $request, Journal $journal)
    {
        $validated = $request->validate([
            'pages' => 'required|array',
            'pages.*.id' => 'required|exists:journal_pages,id',
            'pages.*.order' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated, $journal) {
            foreach ($validated['pages'] as $pageData) {
                JournalPage::where('id', $pageData['id'])
                    ->where('journal_id', $journal->id)
                    ->update(['menu_order' => $pageData['order']]);
            }
        });

        return back()->with('success', 'Page order updated.');
    }

    /**
     * Add a section to a page.
     */
    public function addSection(Request $request, Journal $journal, JournalPage $page)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'type' => 'required|in:'.implode(',', array_keys(JournalPageSection::TYPES)),
        ]);

        $section = $page->sections()->create([
            'name' => $validated['name'] ?? JournalPageSection::TYPES[$validated['type']],
            'type' => $validated['type'],
            'content' => JournalPageSection::getDefaultContent($validated['type']),
            'settings' => JournalPageSection::getDefaultSettings($validated['type']),
            'order' => $page->sections()->max('order') + 1,
            'is_visible' => true,
        ]);

        return back()->with('success', 'Section added successfully.');
    }

    /**
     * Show the form for editing a section.
     */
    public function editSection(Journal $journal, JournalPage $page, JournalPageSection $section)
    {
        return Inertia::render('admin/cms/sections/edit', [
            'journal' => $journal,
            'page' => $page,
            'section' => $section,
            'sectionTypes' => JournalPageSection::TYPES,
        ]);
    }

    /**
     * Update a section.
     */
    public function updateSection(Request $request, Journal $journal, JournalPage $page, JournalPageSection $section)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'content' => 'sometimes|array',
            'settings' => 'sometimes|array',
            'is_visible' => 'sometimes|boolean',
        ]);

        $section->update($validated);

        return back()->with('success', 'Section updated successfully.');
    }

    /**
     * Delete a section.
     */
    public function deleteSection(Journal $journal, JournalPage $page, JournalPageSection $section)
    {
        $section->delete();

        return back()->with('success', 'Section deleted successfully.');
    }

    /**
     * Reorder sections.
     */
    public function reorderSections(Request $request, Journal $journal, JournalPage $page)
    {
        $validated = $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:journal_page_sections,id',
            'sections.*.order' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated, $page) {
            foreach ($validated['sections'] as $sectionData) {
                JournalPageSection::where('id', $sectionData['id'])
                    ->where('journal_page_id', $page->id)
                    ->update(['order' => $sectionData['order']]);
            }
        });

        return back()->with('success', 'Section order updated.');
    }
}
