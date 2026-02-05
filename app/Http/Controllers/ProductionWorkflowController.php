<?php

namespace App\Http\Controllers;

use App\Models\Manuscript;
use App\Models\User;
use App\Services\ProductionWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductionWorkflowController extends Controller
{
    public function __construct(
        protected ProductionWorkflowService $workflowService
    ) {}

    /**
     * Display production dashboard.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Manuscript::class);

        $stats = $this->workflowService->getProductionStats();
        $averageTimes = $this->workflowService->getAverageStageTime();

        $manuscriptsByCopyediting = $this->workflowService->getManuscriptsByStage('copyediting');
        $manuscriptsByTypesetting = $this->workflowService->getManuscriptsByStage('typesetting');
        $manuscriptsByProofing = $this->workflowService->getManuscriptsByStage('proofing');
        $manuscriptsReady = $this->workflowService->getManuscriptsByStage('ready');

        return Inertia::render('production/dashboard', [
            'stats' => $stats,
            'averageTimes' => $averageTimes,
            'manuscriptsByCopyediting' => $manuscriptsByCopyediting,
            'manuscriptsByTypesetting' => $manuscriptsByTypesetting,
            'manuscriptsByProofing' => $manuscriptsByProofing,
            'manuscriptsReady' => $manuscriptsReady,
        ]);
    }

    /**
     * Show production details for a manuscript.
     */
    public function show(Manuscript $manuscript): Response
    {
        $this->authorize('view', $manuscript);

        $manuscript->load([
            'author',
            'copyeditor',
            'layoutEditor',
            'files',
            'proofCorrections',
        ]);

        // Get available copyeditors and layout editors
        $copyeditors = User::role(['copyeditor', 'language_editor'])->get();
        $layoutEditors = User::role(['layout_editor', 'managing_editor'])->get();

        return Inertia::render('production/show', [
            'manuscript' => $manuscript,
            'copyeditors' => $copyeditors,
            'layoutEditors' => $layoutEditors,
        ]);
    }

    /**
     * Start copyediting stage.
     */
    public function startCopyediting(Manuscript $manuscript, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'copyeditor_id' => 'nullable|exists:users,id',
        ]);

        try {
            $this->workflowService->startCopyediting(
                $manuscript,
                $validated['copyeditor_id'] ?? null
            );

            return redirect()
                ->back()
                ->with('success', 'Copyediting stage started');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to start copyediting: {$e->getMessage()}");
        }
    }

    /**
     * Complete copyediting stage.
     */
    public function completeCopyediting(Manuscript $manuscript, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'copyedited_file' => 'nullable|file|mimes:pdf,doc,docx|max:102400', // 100MB
        ]);

        try {
            $filePath = null;
            if ($request->hasFile('copyedited_file')) {
                $filePath = $request->file('copyedited_file')->store('manuscripts/copyedited', 'public');
            }

            $this->workflowService->completeCopyediting($manuscript, $filePath);

            return redirect()
                ->back()
                ->with('success', 'Copyediting completed');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to complete copyediting: {$e->getMessage()}");
        }
    }

    /**
     * Start typesetting stage.
     */
    public function startTypesetting(Manuscript $manuscript, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'layout_editor_id' => 'nullable|exists:users,id',
        ]);

        try {
            $this->workflowService->startTypesetting(
                $manuscript,
                $validated['layout_editor_id'] ?? null
            );

            return redirect()
                ->back()
                ->with('success', 'Typesetting stage started');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to start typesetting: {$e->getMessage()}");
        }
    }

    /**
     * Complete typesetting stage.
     */
    public function completeTypesetting(Manuscript $manuscript): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        try {
            $this->workflowService->completeTypesetting($manuscript);

            return redirect()
                ->back()
                ->with('success', 'Typesetting completed');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to complete typesetting: {$e->getMessage()}");
        }
    }

    /**
     * Start proofing stage.
     */
    public function startProofing(Manuscript $manuscript): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        try {
            $this->workflowService->startProofing($manuscript);

            return redirect()
                ->back()
                ->with('success', 'Proofing stage started');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to start proofing: {$e->getMessage()}");
        }
    }

    /**
     * Complete proofing stage.
     */
    public function completeProofing(Manuscript $manuscript): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        try {
            $this->workflowService->completeProofing($manuscript);

            return redirect()
                ->back()
                ->with('success', 'Proofing completed. Manuscript is ready for publication.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to complete proofing: {$e->getMessage()}");
        }
    }

    /**
     * Mark manuscript as published.
     */
    public function publish(Manuscript $manuscript): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        try {
            $this->workflowService->markAsPublished($manuscript);

            return redirect()
                ->back()
                ->with('success', 'Manuscript published successfully');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to publish: {$e->getMessage()}");
        }
    }

    /**
     * Assign copyeditor.
     */
    public function assignCopyeditor(Manuscript $manuscript, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'copyeditor_id' => 'required|exists:users,id',
        ]);

        try {
            $this->workflowService->assignCopyeditor($manuscript, $validated['copyeditor_id']);

            return redirect()
                ->back()
                ->with('success', 'Copyeditor assigned');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to assign copyeditor: {$e->getMessage()}");
        }
    }

    /**
     * Assign layout editor.
     */
    public function assignLayoutEditor(Manuscript $manuscript, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'layout_editor_id' => 'required|exists:users,id',
        ]);

        try {
            $this->workflowService->assignLayoutEditor($manuscript, $validated['layout_editor_id']);

            return redirect()
                ->back()
                ->with('success', 'Layout editor assigned');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to assign layout editor: {$e->getMessage()}");
        }
    }

    /**
     * Revert to a previous stage.
     */
    public function revertStage(Manuscript $manuscript, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'stage' => 'required|in:none,copyediting,typesetting,proofing,ready',
        ]);

        try {
            $this->workflowService->revertToStage($manuscript, $validated['stage']);

            return redirect()
                ->back()
                ->with('success', "Reverted to {$validated['stage']} stage");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to revert stage: {$e->getMessage()}");
        }
    }
}
