<?php

namespace App\Http\Controllers;

use App\Models\Galley;
use App\Models\Publication;
use App\Services\GalleyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GalleyController extends Controller
{
    public function __construct(
        protected GalleyService $galleyService
    ) {}

    /**
     * Display galley management for a publication
     */
    public function index(Publication $publication): Response
    {
        $this->authorize('update', $publication->manuscript);

        $galleys = $publication->galleys()
            ->orderBy('sequence')
            ->get()
            ->map(function ($galley) {
                return [
                    'id' => $galley->id,
                    'label' => $galley->label,
                    'locale' => $galley->locale,
                    'mime_type' => $galley->mime_type,
                    'file_size' => $galley->file_size,
                    'formatted_size' => $this->galleyService->getFormattedFileSize($galley),
                    'sequence' => $galley->sequence,
                    'is_approved' => $galley->is_approved,
                    'download_count' => $galley->download_count,
                    'last_downloaded_at' => $galley->last_downloaded_at,
                    'created_at' => $galley->created_at,
                    'icon' => $this->galleyService->getFileIcon($galley),
                    'can_view_inline' => $this->galleyService->isViewableInline($galley),
                ];
            });

        $stats = $this->galleyService->getGalleyStats($publication);

        return Inertia::render('galleys/index', [
            'publication' => [
                'id' => $publication->id,
                'version' => $publication->version,
                'title' => $publication->title,
                'manuscript_id' => $publication->manuscript_id,
            ],
            'galleys' => $galleys,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a new galley
     */
    public function store(Request $request, Publication $publication): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('update', $publication->manuscript);

        $validated = $request->validate([
            'file' => 'required|file|max:51200|mimes:pdf,html,htm,xhtml,epub,xml,mobi',
            'label' => 'required|string|max:255',
            'locale' => 'nullable|string|max:10',
        ]);

        try {
            $galley = $this->galleyService->uploadGalley(
                $publication,
                $request->file('file'),
                $validated['label'],
                $validated['locale'] ?? null
            );

            return redirect()
                ->route('galleys.index', $publication)
                ->with('success', "Galley '{$galley->label}' uploaded successfully.");
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['file' => $e->getMessage()]);
        }
    }

    /**
     * Update an existing galley
     */
    public function update(Request $request, Galley $galley): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('update', $galley->publication->manuscript);

        $validated = $request->validate([
            'file' => 'nullable|file|max:51200|mimes:pdf,html,htm,xhtml,epub,xml,mobi',
            'label' => 'required|string|max:255',
            'locale' => 'nullable|string|max:10',
            'sequence' => 'nullable|integer|min:1',
        ]);

        try {
            $this->galleyService->updateGalley(
                $galley,
                $validated,
                $request->file('file')
            );

            return redirect()
                ->route('galleys.index', $galley->publication)
                ->with('success', "Galley '{$galley->label}' updated successfully.");
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['file' => $e->getMessage()]);
        }
    }

    /**
     * Delete a galley
     */
    public function destroy(Galley $galley): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('update', $galley->publication->manuscript);

        $publication = $galley->publication;
        $label = $galley->label;

        $this->galleyService->deleteGalley($galley);

        return redirect()
            ->route('galleys.index', $publication)
            ->with('success', "Galley '{$label}' deleted successfully.");
    }

    /**
     * Approve a galley for public access
     */
    public function approve(Galley $galley): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('update', $galley->publication->manuscript);

        $this->galleyService->approveGalley($galley);

        return redirect()
            ->route('galleys.index', $galley->publication)
            ->with('success', "Galley '{$galley->label}' approved successfully.");
    }

    /**
     * Reorder galleys
     */
    public function reorder(Request $request, Publication $publication): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('update', $publication->manuscript);

        $validated = $request->validate([
            'galley_ids' => 'required|array',
            'galley_ids.*' => 'required|integer|exists:galleys,id',
        ]);

        $this->galleyService->reorderGalleys($publication, $validated['galley_ids']);

        return redirect()
            ->route('galleys.index', $publication)
            ->with('success', 'Galley order updated successfully.');
    }

    /**
     * Download a galley file
     */
    public function download(Galley $galley): StreamedResponse
    {
        // Check if user has access
        $this->authorize('view', $galley->publication->manuscript);

        // Record download
        $this->galleyService->recordDownload($galley, request()->ip());

        // Get temporary download URL
        $url = $this->galleyService->getDownloadUrl($galley);

        // Stream from S3
        return Storage::disk('s3')->download($galley->file_path, $galley->label . '.' . pathinfo($galley->file_path, PATHINFO_EXTENSION));
    }

    /**
     * View a galley file inline (for HTML/PDF)
     */
    public function view(Galley $galley): Response|StreamedResponse
    {
        // Check if user has access
        $this->authorize('view', $galley->publication->manuscript);

        // Record view
        $this->galleyService->recordDownload($galley, request()->ip());

        // If viewable inline, return viewer page
        if ($this->galleyService->isViewableInline($galley)) {
            $viewUrl = $this->galleyService->getViewUrl($galley, 120); // 2 hour expiry

            return Inertia::render('galleys/viewer', [
                'galley' => [
                    'id' => $galley->id,
                    'label' => $galley->label,
                    'mime_type' => $galley->mime_type,
                    'view_url' => $viewUrl,
                ],
                'publication' => [
                    'id' => $galley->publication->id,
                    'version' => $galley->publication->version,
                    'title' => $galley->publication->title,
                ],
            ]);
        }

        // Otherwise, download
        return $this->download($galley);
    }

    /**
     * Get galley statistics for a publication
     */
    public function stats(Publication $publication): \Illuminate\Http\JsonResponse
    {
        $this->authorize('view', $publication->manuscript);

        $stats = $this->galleyService->getGalleyStats($publication);

        return response()->json($stats);
    }
}
