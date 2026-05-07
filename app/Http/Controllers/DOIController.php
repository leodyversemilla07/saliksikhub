<?php

namespace App\Http\Controllers;

use App\Models\DOI;
use App\Models\Manuscript;
use App\Models\Publication;
use App\Services\DOIService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DOIController extends Controller
{
    public function __construct(
        protected DOIService $doiService
    ) {}

    /**
     * Display DOI management for a manuscript.
     */
    public function index(Manuscript $manuscript): Response
    {
        $this->authorize('update', $manuscript);

        $publications = $manuscript->publications()
            ->with('doi')
            ->orderByDesc('version_major')
            ->orderByDesc('version_minor')
            ->get();

        return Inertia::render('dois/index', [
            'manuscript' => $manuscript->load('author', 'journal'),
            'publications' => $publications,
            'doiPrefix' => config('services.crossref.doi_prefix'),
        ]);
    }

    /**
     * Assign a DOI to a publication.
     */
    public function assign(Manuscript $manuscript, Publication $publication, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        abort_if($publication->manuscript_id !== $manuscript->id, 404);

        // Check if DOI already exists
        if ($publication->doi) {
            return redirect()
                ->back()
                ->with('error', 'DOI already assigned to this publication');
        }

        $validated = $request->validate([
            'custom_suffix' => 'nullable|string|max:255',
            'registration_agency' => 'required|in:crossref,datacite',
        ]);

        try {
            $doi = $this->doiService->assignDOI(
                $publication,
                $validated['custom_suffix'] ?? null,
                $validated['registration_agency']
            );

            return redirect()
                ->back()
                ->with('success', "DOI assigned: {$doi->doi}");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Failed to assign DOI: {$e->getMessage()}");
        }
    }

    /**
     * Register DOI with the registration agency.
     */
    public function register(DOI $doi): RedirectResponse
    {
        $this->authorize('update', $doi->doiable->manuscript);

        try {
            if ($doi->registration_agency === 'crossref') {
                $success = $this->doiService->registerWithCrossRef($doi);
            } elseif ($doi->registration_agency === 'datacite') {
                $success = $this->doiService->registerWithDataCite($doi);
            } else {
                throw new \Exception('Unknown registration agency');
            }

            if ($success) {
                return redirect()
                    ->back()
                    ->with('success', 'DOI registered successfully');
            } else {
                return redirect()
                    ->back()
                    ->with('error', 'DOI registration failed. Check logs for details.');
            }
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Registration failed: {$e->getMessage()}");
        }
    }

    /**
     * Check registration status.
     */
    public function checkStatus(DOI $doi): RedirectResponse
    {
        $this->authorize('view', $doi->doiable->manuscript);

        $status = $this->doiService->checkRegistrationStatus($doi);

        return redirect()
            ->back()
            ->with('info', "Status: {$status['status']} - {$status['message']}");
    }

    /**
     * Re-deposit DOI metadata.
     */
    public function redeposit(DOI $doi): RedirectResponse
    {
        $this->authorize('update', $doi->doiable->manuscript);

        try {
            $success = $this->doiService->redeposit($doi);

            if ($success) {
                return redirect()
                    ->back()
                    ->with('success', 'DOI metadata re-deposited successfully');
            } else {
                return redirect()
                    ->back()
                    ->with('error', 'Re-deposit failed. Check logs for details.');
            }
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Re-deposit failed: {$e->getMessage()}");
        }
    }

    /**
     * Delete a DOI (soft delete).
     */
    public function destroy(DOI $doi): RedirectResponse
    {
        $this->authorize('update', $doi->doiable->manuscript);

        // Only allow deletion if not yet deposited
        if ($doi->status === 'deposited') {
            return redirect()
                ->back()
                ->with('error', 'Cannot delete a registered DOI. Use retraction instead.');
        }

        $doi->delete();

        return redirect()
            ->back()
            ->with('success', 'DOI removed successfully');
    }

    /**
     * Batch assign DOIs to all publications without DOIs.
     */
    public function batchAssign(Manuscript $manuscript, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'registration_agency' => 'required|in:crossref,datacite',
        ]);

        $publications = $manuscript->publications()->doesntHave('doi')->get();

        if ($publications->isEmpty()) {
            return redirect()
                ->back()
                ->with('info', 'All publications already have DOIs assigned');
        }

        $assigned = 0;
        $failed = 0;

        foreach ($publications as $publication) {
            try {
                $this->doiService->assignDOI(
                    $publication,
                    null,
                    $validated['registration_agency']
                );
                $assigned++;
            } catch (\Exception $e) {
                $failed++;
            }
        }

        $message = "Assigned {$assigned} DOI(s).";
        if ($failed > 0) {
            $message .= " {$failed} failed.";
        }

        return redirect()
            ->back()
            ->with('success', $message);
    }

    /**
     * Batch register all assigned but unregistered DOIs.
     */
    public function batchRegister(Manuscript $manuscript): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $dois = DOI::whereHasMorph('doiable', [Publication::class], function ($query) use ($manuscript) {
            $query->where('manuscript_id', $manuscript->id);
        })
            ->whereIn('status', ['assigned', 'stale', 'error'])
            ->where('retry_count', '<', 3)
            ->get();

        if ($dois->isEmpty()) {
            return redirect()
                ->back()
                ->with('info', 'No DOIs pending registration');
        }

        $registered = 0;
        $failed = 0;

        foreach ($dois as $doi) {
            try {
                if ($doi->registration_agency === 'crossref') {
                    $success = $this->doiService->registerWithCrossRef($doi);
                } else {
                    $success = $this->doiService->registerWithDataCite($doi);
                }

                if ($success) {
                    $registered++;
                } else {
                    $failed++;
                }
            } catch (\Exception $e) {
                $failed++;
            }
        }

        $message = "Registered {$registered} DOI(s).";
        if ($failed > 0) {
            $message .= " {$failed} failed.";
        }

        return redirect()
            ->back()
            ->with($failed > 0 ? 'warning' : 'success', $message);
    }
}
