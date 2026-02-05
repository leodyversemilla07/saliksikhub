<?php

namespace App\Http\Controllers;

use App\Models\Manuscript;
use App\Models\Publication;
use App\Services\PublicationVersionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicationVersionController extends Controller
{
    public function __construct(
        protected PublicationVersionService $versionService
    ) {}

    /**
     * Display publication versions for a manuscript.
     */
    public function index(Manuscript $manuscript): Response
    {
        $this->authorize('view', $manuscript);

        $publications = $manuscript->publications()
            ->with('doi', 'galleys')
            ->orderByDesc('version_major')
            ->orderByDesc('version_minor')
            ->get();

        return Inertia::render('Publications/Versions', [
            'manuscript' => $manuscript->load('author', 'journal'),
            'publications' => $publications,
            'currentPublicationId' => $manuscript->current_publication_id,
        ]);
    }

    /**
     * Show a specific publication version.
     */
    public function show(Manuscript $manuscript, Publication $publication): Response
    {
        $this->authorize('view', $manuscript);

        abort_if($publication->manuscript_id !== $manuscript->id, 404);

        $publication->load('doi', 'galleys', 'manuscript.author');

        return Inertia::render('Publications/Show', [
            'publication' => $publication,
            'manuscript' => $manuscript->load('author', 'journal'),
        ]);
    }

    /**
     * Create a new publication version.
     */
    public function store(Manuscript $manuscript, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        $validated = $request->validate([
            'version_stage' => 'nullable|in:preprint,under_review,published,corrected',
            'is_major' => 'nullable|boolean',
            'title' => 'nullable|string|max:255',
            'abstract' => 'nullable|string',
            'keywords' => 'nullable|array',
            'access_status' => 'nullable|in:open,subscription,embargo,restricted',
            'embargo_date' => 'nullable|date|after:today',
        ]);

        $publication = $this->versionService->createVersion(
            $manuscript,
            $validated,
            $validated['version_stage'] ?? 'preprint',
            $validated['is_major'] ?? false
        );

        return redirect()
            ->route('manuscripts.publications.show', [$manuscript, $publication])
            ->with('success', 'Publication version created successfully');
    }

    /**
     * Update a publication.
     */
    public function update(Manuscript $manuscript, Publication $publication, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        abort_if($publication->manuscript_id !== $manuscript->id, 404);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'abstract' => 'nullable|string',
            'keywords' => 'nullable|array',
            'language' => 'nullable|string|max:10',
            'license_url' => 'nullable|url',
            'copyright_holder' => 'nullable|string',
            'copyright_year' => 'nullable|integer',
            'access_status' => 'nullable|in:open,subscription,embargo,restricted',
            'embargo_date' => 'nullable|date',
            'pages' => 'nullable|string',
            'page_start' => 'nullable|integer',
            'page_end' => 'nullable|integer',
        ]);

        $publication->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Publication updated successfully');
    }

    /**
     * Publish a publication version.
     */
    public function publish(Manuscript $manuscript, Publication $publication, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        abort_if($publication->manuscript_id !== $manuscript->id, 404);

        $validated = $request->validate([
            'date_published' => 'nullable|date',
            'pages' => 'nullable|string',
            'page_start' => 'nullable|integer',
            'page_end' => 'nullable|integer',
        ]);

        $this->versionService->publishVersion($publication, $validated);

        return redirect()
            ->back()
            ->with('success', 'Publication published successfully');
    }

    /**
     * Schedule a publication for future date.
     */
    public function schedule(Manuscript $manuscript, Publication $publication, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        abort_if($publication->manuscript_id !== $manuscript->id, 404);

        $validated = $request->validate([
            'date_published' => 'required|date|after:today',
        ]);

        $this->versionService->schedulePublication(
            $publication,
            new \DateTime($validated['date_published'])
        );

        return redirect()
            ->back()
            ->with('success', 'Publication scheduled successfully');
    }

    /**
     * Set embargo on a publication.
     */
    public function setEmbargo(Manuscript $manuscript, Publication $publication, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        abort_if($publication->manuscript_id !== $manuscript->id, 404);

        $validated = $request->validate([
            'embargo_date' => 'required|date|after:today',
        ]);

        $this->versionService->setEmbargo(
            $publication,
            new \DateTime($validated['embargo_date'])
        );

        return redirect()
            ->back()
            ->with('success', 'Embargo set successfully');
    }

    /**
     * Create a corrected version.
     */
    public function correct(Manuscript $manuscript, Publication $publication, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        abort_if($publication->manuscript_id !== $manuscript->id, 404);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'abstract' => 'nullable|string',
            'keywords' => 'nullable|array',
        ]);

        $correctedVersion = $this->versionService->createCorrectedVersion($publication, $validated);

        return redirect()
            ->route('manuscripts.publications.show', [$manuscript, $correctedVersion])
            ->with('success', 'Corrected version created successfully');
    }

    /**
     * Retract a publication.
     */
    public function retract(Manuscript $manuscript, Publication $publication, Request $request): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        abort_if($publication->manuscript_id !== $manuscript->id, 404);

        $validated = $request->validate([
            'reason' => 'required|string',
        ]);

        $this->versionService->retractPublication($publication, $validated['reason']);

        return redirect()
            ->back()
            ->with('success', 'Publication retracted successfully');
    }

    /**
     * Revert to a previous publication version.
     */
    public function revert(Manuscript $manuscript, Publication $publication): RedirectResponse
    {
        $this->authorize('update', $manuscript);

        abort_if($publication->manuscript_id !== $manuscript->id, 404);

        $this->versionService->revertToVersion($manuscript, $publication);

        return redirect()
            ->route('manuscripts.publications.index', $manuscript)
            ->with('success', 'Reverted to version ' . $publication->version);
    }

    /**
     * Copy galleys from one version to another.
     */
    public function copyGalleys(
        Manuscript $manuscript,
        Publication $fromPublication,
        Publication $toPublication,
        Request $request
    ): RedirectResponse {
        $this->authorize('update', $manuscript);

        abort_if(
            $fromPublication->manuscript_id !== $manuscript->id || 
            $toPublication->manuscript_id !== $manuscript->id,
            400
        );

        $this->versionService->copyGalleys($fromPublication, $toPublication);

        return redirect()
            ->back()
            ->with('success', 'Galleys copied successfully');
    }
}
