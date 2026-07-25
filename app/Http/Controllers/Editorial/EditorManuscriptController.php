<?php

namespace App\Http\Controllers\Editorial;

use App\Http\Controllers\Controller;
use App\Models\EditorialDecision;
use App\Models\Manuscript;
use App\Services\StorageService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EditorManuscriptController extends Controller
{
    /**
     * Display a listing of all manuscripts for editors.
     */
    public function index()
    {
        $journal = app('currentJournal');

        return Inertia::render('editor/index', [
            'manuscripts' => Manuscript::query()
                ->when($journal, fn ($q) => $q->where('journal_id', $journal->id))
                ->with('author')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Display the details of a manuscript for editors.
     */
    public function show($id, StorageService $storageService)
    {
        try {
            $manuscript = Manuscript::findOrFail($id);

            $manuscriptUrl = null;
            $finalPdfUrl = null;

            if ($manuscript->manuscript_path) {
                try {
                    $manuscriptUrl = $storageService->generateTemporaryUrl(
                        $manuscript->manuscript_path, 5
                    );
                } catch (Exception $e) {
                    logger()->error('Temporary URL Generation Error', [
                        'error_message' => $e->getMessage(),
                        'manuscript_id' => $id,
                    ]);
                }
            }

            if ($manuscript->final_pdf_path) {
                try {
                    $finalPdfUrl = $storageService->generateTemporaryUrl(
                        $manuscript->final_pdf_path, 5
                    );
                } catch (Exception $e) {
                    logger()->error('Temporary URL Generation Error', [
                        'error_message' => $e->getMessage(),
                        'manuscript_id' => $id,
                    ]);
                }
            }

            return Inertia::render('manuscripts/show-manuscript', [
                'manuscript' => [
                    'id' => $manuscript->id,
                    'title' => $manuscript->title,
                    'authors' => explode(', ', $manuscript->authors),
                    'abstract' => $manuscript->abstract,
                    'keywords' => explode(', ', $manuscript->keywords),
                    'manuscript_path' => $manuscriptUrl,
                    'final_pdf_path' => $finalPdfUrl,
                    'status' => $manuscript->status,
                    'user_id' => $manuscript->user_id,
                    'created_at' => $manuscript->created_at->toDateTimeString(),
                    'updated_at' => $manuscript->updated_at->toDateTimeString(),
                    'doi' => $manuscript->doi,
                    'volume' => $manuscript->volume,
                    'issue' => $manuscript->issue,
                    'page_range' => $manuscript->page_range,
                    'publication_date' => $manuscript->publication_date?->toDateString(),
                    'author_approval_date' => $manuscript->author_approval_date?->toDateString(),
                ],
                'user_roles' => Auth::user()->getRoleNames(),
            ]);
        } catch (Exception $e) {
            logger()->error('Manuscript Show Error', [
                'error_message' => $e->getMessage(),
                'manuscript_id' => $id,
            ]);

            return redirect()->back()->with('error', 'An error occurred while loading the manuscript.');
        }
    }

    /**
     * Show the form for creating an editorial decision.
     */
    public function createDecision(Manuscript $manuscript)
    {
        return Inertia::render('editor/create-decision', [
            'manuscript' => $manuscript,
            'decisionTypes' => EditorialDecision::DECISION_TYPES,
        ]);
    }

    /**
     * Show editorial decisions for a manuscript.
     */
    public function showDecisions(Manuscript $manuscript)
    {
        $decisions = $manuscript->editorialDecisions()
            ->with('editor')
            ->latest()
            ->get()
            ->map(fn ($decision) => [
                'id' => $decision->id,
                'decision_type' => $decision->decision_type,
                'comments_to_author' => $decision->comments_to_author,
                'editor_name' => $decision->editor->firstname.' '.$decision->editor->lastname,
                'decision_date' => $decision->decision_date?->toDateTimeString(),
                'status' => $decision->status,
            ]);

        return Inertia::render('editor/manuscript-decisions', [
            'manuscript' => [
                'id' => $manuscript->id,
                'title' => $manuscript->title,
                'status' => $manuscript->status,
            ],
            'decisions' => $decisions,
        ]);
    }
}
