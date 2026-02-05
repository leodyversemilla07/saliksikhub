<?php

namespace App\Services;

use App\Models\Manuscript;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductionWorkflowService
{
    /**
     * Start the copyediting stage.
     */
    public function startCopyediting(Manuscript $manuscript, ?int $copyeditorId = null): bool
    {
        return DB::transaction(function () use ($manuscript, $copyeditorId) {
            $updateData = [
                'production_stage' => 'copyediting',
                'copyediting_started_at' => now(),
            ];

            if ($copyeditorId) {
                $updateData['copyeditor_id'] = $copyeditorId;
            }

            $manuscript->update($updateData);

            Log::info("Copyediting started for manuscript {$manuscript->id}");

            return true;
        });
    }

    /**
     * Complete the copyediting stage.
     */
    public function completeCopyediting(Manuscript $manuscript, ?string $copyeditedFilePath = null): bool
    {
        return DB::transaction(function () use ($manuscript, $copyeditedFilePath) {
            $updateData = [
                'copyediting_completed_at' => now(),
            ];

            if ($copyeditedFilePath) {
                // You might want to store this in a files table or manuscript_files
                $updateData['final_pdf_path'] = $copyeditedFilePath;
            }

            $manuscript->update($updateData);

            Log::info("Copyediting completed for manuscript {$manuscript->id}");

            return true;
        });
    }

    /**
     * Start the typesetting stage.
     */
    public function startTypesetting(Manuscript $manuscript, ?int $layoutEditorId = null): bool
    {
        // Ensure copyediting is completed
        if ($manuscript->production_stage !== 'copyediting' || !$manuscript->copyediting_completed_at) {
            throw new \Exception('Cannot start typesetting before copyediting is completed');
        }

        return DB::transaction(function () use ($manuscript, $layoutEditorId) {
            $updateData = [
                'production_stage' => 'typesetting',
                'typesetting_started_at' => now(),
            ];

            if ($layoutEditorId) {
                $updateData['layout_editor_id'] = $layoutEditorId;
            }

            $manuscript->update($updateData);

            Log::info("Typesetting started for manuscript {$manuscript->id}");

            return true;
        });
    }

    /**
     * Complete the typesetting stage.
     */
    public function completeTypesetting(Manuscript $manuscript): bool
    {
        return DB::transaction(function () use ($manuscript) {
            $manuscript->update([
                'typesetting_completed_at' => now(),
            ]);

            Log::info("Typesetting completed for manuscript {$manuscript->id}");

            return true;
        });
    }

    /**
     * Start the proofing stage.
     */
    public function startProofing(Manuscript $manuscript): bool
    {
        // Ensure typesetting is completed
        if ($manuscript->production_stage !== 'typesetting' || !$manuscript->typesetting_completed_at) {
            throw new \Exception('Cannot start proofing before typesetting is completed');
        }

        return DB::transaction(function () use ($manuscript) {
            $manuscript->update([
                'production_stage' => 'proofing',
                'proofing_started_at' => now(),
            ]);

            Log::info("Proofing started for manuscript {$manuscript->id}");

            return true;
        });
    }

    /**
     * Complete the proofing stage.
     */
    public function completeProofing(Manuscript $manuscript): bool
    {
        return DB::transaction(function () use ($manuscript) {
            $manuscript->update([
                'production_stage' => 'ready',
                'proofing_completed_at' => now(),
            ]);

            Log::info("Proofing completed for manuscript {$manuscript->id}");

            return true;
        });
    }

    /**
     * Mark manuscript as published.
     */
    public function markAsPublished(Manuscript $manuscript): bool
    {
        // Ensure proofing is completed
        if ($manuscript->production_stage !== 'ready') {
            throw new \Exception('Cannot publish manuscript before proofing is completed');
        }

        return DB::transaction(function () use ($manuscript) {
            $manuscript->update([
                'production_stage' => 'published',
                'status' => 'published',
                'published_at' => now(),
            ]);

            Log::info("Manuscript {$manuscript->id} marked as published");

            return true;
        });
    }

    /**
     * Assign a copyeditor to a manuscript.
     */
    public function assignCopyeditor(Manuscript $manuscript, int $copyeditorId): bool
    {
        // Verify user has copyeditor role
        $copyeditor = User::find($copyeditorId);
        
        if (!$copyeditor) {
            throw new \Exception('Copyeditor not found');
        }

        return $manuscript->update(['copyeditor_id' => $copyeditorId]);
    }

    /**
     * Assign a layout editor to a manuscript.
     */
    public function assignLayoutEditor(Manuscript $manuscript, int $layoutEditorId): bool
    {
        // Verify user has layout editor role
        $layoutEditor = User::find($layoutEditorId);
        
        if (!$layoutEditor) {
            throw new \Exception('Layout editor not found');
        }

        return $manuscript->update(['layout_editor_id' => $layoutEditorId]);
    }

    /**
     * Get manuscripts in a specific production stage.
     */
    public function getManuscriptsByStage(string $stage)
    {
        return Manuscript::where('production_stage', $stage)
            ->with(['author', 'copyeditor', 'layoutEditor'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get production statistics.
     */
    public function getProductionStats(): array
    {
        return [
            'none' => Manuscript::where('production_stage', 'none')->count(),
            'copyediting' => Manuscript::where('production_stage', 'copyediting')->count(),
            'typesetting' => Manuscript::where('production_stage', 'typesetting')->count(),
            'proofing' => Manuscript::where('production_stage', 'proofing')->count(),
            'ready' => Manuscript::where('production_stage', 'ready')->count(),
            'published' => Manuscript::where('production_stage', 'published')->count(),
        ];
    }

    /**
     * Get manuscripts assigned to a copyeditor.
     */
    public function getManuscriptsForCopyeditor(int $copyeditorId)
    {
        return Manuscript::where('copyeditor_id', $copyeditorId)
            ->where('production_stage', 'copyediting')
            ->whereNull('copyediting_completed_at')
            ->with(['author'])
            ->get();
    }

    /**
     * Get manuscripts assigned to a layout editor.
     */
    public function getManuscriptsForLayoutEditor(int $layoutEditorId)
    {
        return Manuscript::where('layout_editor_id', $layoutEditorId)
            ->where('production_stage', 'typesetting')
            ->whereNull('typesetting_completed_at')
            ->with(['author'])
            ->get();
    }

    /**
     * Calculate average time for each stage.
     */
    public function getAverageStageTime(): array
    {
        $copyeditingTime = Manuscript::whereNotNull('copyediting_started_at')
            ->whereNotNull('copyediting_completed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(DAY, copyediting_started_at, copyediting_completed_at)) as avg_days')
            ->value('avg_days');

        $typesettingTime = Manuscript::whereNotNull('typesetting_started_at')
            ->whereNotNull('typesetting_completed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(DAY, typesetting_started_at, typesetting_completed_at)) as avg_days')
            ->value('avg_days');

        $proofingTime = Manuscript::whereNotNull('proofing_started_at')
            ->whereNotNull('proofing_completed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(DAY, proofing_started_at, proofing_completed_at)) as avg_days')
            ->value('avg_days');

        return [
            'copyediting' => round($copyeditingTime ?? 0, 1),
            'typesetting' => round($typesettingTime ?? 0, 1),
            'proofing' => round($proofingTime ?? 0, 1),
        ];
    }

    /**
     * Revert to a previous stage.
     */
    public function revertToStage(Manuscript $manuscript, string $stage): bool
    {
        $validStages = ['none', 'copyediting', 'typesetting', 'proofing', 'ready'];
        
        if (!in_array($stage, $validStages)) {
            throw new \Exception('Invalid production stage');
        }

        return DB::transaction(function () use ($manuscript, $stage) {
            $updateData = ['production_stage' => $stage];

            // Clear timestamps for future stages
            switch ($stage) {
                case 'none':
                    $updateData['copyediting_started_at'] = null;
                    $updateData['copyediting_completed_at'] = null;
                    // Fall through
                case 'copyediting':
                    $updateData['typesetting_started_at'] = null;
                    $updateData['typesetting_completed_at'] = null;
                    // Fall through
                case 'typesetting':
                    $updateData['proofing_started_at'] = null;
                    $updateData['proofing_completed_at'] = null;
                    break;
            }

            $manuscript->update($updateData);

            Log::info("Manuscript {$manuscript->id} reverted to stage: {$stage}");

            return true;
        });
    }
}
