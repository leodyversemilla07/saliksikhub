<?php

namespace App\Http\Controllers;

use App\ManuscriptStatus;
use App\Models\Manuscript;
use App\Notifications\ManuscriptStatusChanged;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InitialScreeningController extends Controller
{
    public function show(Manuscript $manuscript)
    {
        return Inertia::render('editor/initial-screening', [
            'manuscript' => $manuscript,
        ]);
    }

    public function update(Request $request, Manuscript $manuscript)
    {
        try {
            $validated = $request->validate([
                'plagiarism_score' => 'required|numeric|min:0|max:100',
                'grammar_score' => 'required|numeric|min:0|max:100',
                'scope_assessment' => 'required|string|min:10',
                'initial_screening_notes' => 'required|string|min:10',
            ]);

            $previousStatus = $manuscript->status;

            // Update manuscript with screening results
            $manuscript->plagiarism_score = $validated['plagiarism_score'];
            $manuscript->grammar_score = $validated['grammar_score'];
            $manuscript->scope_assessment = $validated['scope_assessment'];
            $manuscript->initial_screening_notes = $validated['initial_screening_notes'];

            // Automatically determine next status based on screening results
            if ($manuscript->passesInitialScreening()) {
                $manuscript->status = ManuscriptStatus::UNDER_REVIEW;
            } else {
                $manuscript->status = ManuscriptStatus::REJECTED;
            }

            $manuscript->save();

            // Notify author of status change if it changed
            if ($previousStatus !== $manuscript->status) {
                $manuscript->author->notify(new ManuscriptStatusChanged(
                    $manuscript,
                    (string) $previousStatus,
                    (string) $manuscript->status
                ));
            }

            return redirect()->route('editor.manuscripts.show', $manuscript)
                ->with('success', 'Initial screening completed successfully.');
        } catch (Exception $e) {
            Log::error('Error during initial screening', [
                'error' => $e->getMessage(),
                'manuscript_id' => $manuscript->id,
            ]);

            return back()->with('error', 'Failed to complete initial screening: '.$e->getMessage());
        }
    }
}
