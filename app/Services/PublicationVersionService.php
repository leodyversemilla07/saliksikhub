<?php

namespace App\Services;

use App\Models\Manuscript;
use App\Models\Publication;
use Illuminate\Support\Facades\DB;

class PublicationVersionService
{
    /**
     * Create a new publication version for a manuscript.
     */
    public function createVersion(
        Manuscript $manuscript,
        array $data = [],
        string $versionStage = 'preprint',
        bool $isMajor = false
    ): Publication {
        return DB::transaction(function () use ($manuscript, $data, $versionStage, $isMajor) {
            // Get the latest publication to determine version numbers
            $latestPublication = $manuscript->latestPublication();

            $versionMajor = 1;
            $versionMinor = 0;

            if ($latestPublication) {
                if ($isMajor) {
                    $versionMajor = $latestPublication->version_major + 1;
                    $versionMinor = 0;
                } else {
                    $versionMajor = $latestPublication->version_major;
                    $versionMinor = $latestPublication->version_minor + 1;
                }
            }

            // Prepare publication data
            $publicationData = array_merge([
                'manuscript_id' => $manuscript->id,
                'version_major' => $versionMajor,
                'version_minor' => $versionMinor,
                'version_stage' => $versionStage,
                'status' => 'draft',
                'title' => $manuscript->title,
                'abstract' => $manuscript->abstract,
                'keywords' => is_string($manuscript->keywords)
                    ? explode(',', $manuscript->keywords)
                    : (is_array($manuscript->keywords) ? $manuscript->keywords : []),
                'language' => 'en',
                'access_status' => 'open',
                'date_submitted' => now(),
            ], $data);

            $publication = Publication::create($publicationData);

            // If this is the first publication, set it as current
            if (! $manuscript->current_publication_id) {
                $manuscript->update(['current_publication_id' => $publication->id]);
            }

            return $publication;
        });
    }

    /**
     * Publish a publication version.
     */
    public function publishVersion(Publication $publication, array $data = []): bool
    {
        return DB::transaction(function () use ($publication, $data) {
            $updateData = array_merge([
                'status' => 'published',
                'version_stage' => 'published',
                'date_published' => now(),
            ], $data);

            $publication->update($updateData);

            // Update manuscript's current publication
            $manuscript = $publication->manuscript;
            $manuscript->update([
                'current_publication_id' => $publication->id,
                'status' => 'published',
                'published_at' => now(),
            ]);

            return true;
        });
    }

    /**
     * Create a new version from an existing publication.
     */
    public function createNewVersionFrom(
        Publication $basePublication,
        bool $isMajor = false,
        array $changes = []
    ): Publication {
        return DB::transaction(function () use ($basePublication, $isMajor, $changes) {
            $newVersion = $basePublication->replicate(['id', 'created_at', 'updated_at', 'deleted_at']);

            // Increment version
            if ($isMajor) {
                $newVersion->version_major = $basePublication->version_major + 1;
                $newVersion->version_minor = 0;
            } else {
                $newVersion->version_minor = $basePublication->version_minor + 1;
            }

            // Reset publication status
            $newVersion->status = 'draft';
            $newVersion->version_stage = 'preprint';
            $newVersion->date_published = null;

            // Apply any changes
            $newVersion->fill($changes);
            $newVersion->save();

            return $newVersion;
        });
    }

    /**
     * Revert manuscript to a specific publication version.
     */
    public function revertToVersion(Manuscript $manuscript, Publication $publication): bool
    {
        if ($publication->manuscript_id !== $manuscript->id) {
            throw new \InvalidArgumentException('Publication does not belong to this manuscript');
        }

        return DB::transaction(function () use ($manuscript, $publication) {
            $manuscript->update([
                'current_publication_id' => $publication->id,
            ]);

            return true;
        });
    }

    /**
     * Update publication metadata.
     */
    public function updateMetadata(Publication $publication, array $metadata): bool
    {
        return $publication->update($metadata);
    }

    /**
     * Schedule publication for future date.
     */
    public function schedulePublication(Publication $publication, \DateTime $publishDate): bool
    {
        return $publication->update([
            'status' => 'queued',
            'date_published' => $publishDate,
        ]);
    }

    /**
     * Set embargo on publication.
     */
    public function setEmbargo(Publication $publication, \DateTime $embargoDate): bool
    {
        return $publication->update([
            'access_status' => 'embargo',
            'embargo_date' => $embargoDate,
        ]);
    }

    /**
     * Mark publication as corrected version.
     */
    public function createCorrectedVersion(Publication $publication, array $corrections = []): Publication
    {
        return DB::transaction(function () use ($publication, $corrections) {
            $correctedVersion = $this->createNewVersionFrom($publication, false, $corrections);
            $correctedVersion->update(['version_stage' => 'corrected']);

            return $correctedVersion;
        });
    }

    /**
     * Retract a publication.
     */
    public function retractPublication(Publication $publication, string $reason): bool
    {
        return DB::transaction(function () use ($publication, $reason) {
            $publication->update([
                'version_stage' => 'retracted',
                'status' => 'declined',
            ]);

            // Log retraction reason in manuscript notes
            $manuscript = $publication->manuscript;
            $manuscript->update([
                'decision_comments' => ($manuscript->decision_comments ?? '')
                    ."\n\n[RETRACTION] Version {$publication->version} retracted on "
                    .now()->toDateString().": {$reason}",
            ]);

            return true;
        });
    }

    /**
     * Get publication version history.
     */
    public function getVersionHistory(Manuscript $manuscript): array
    {
        return $manuscript->publications()
            ->orderByDesc('version_major')
            ->orderByDesc('version_minor')
            ->get()
            ->map(function ($publication) {
                return [
                    'id' => $publication->id,
                    'version' => $publication->version,
                    'version_stage' => $publication->version_stage,
                    'status' => $publication->status,
                    'date_published' => $publication->date_published,
                    'is_current' => $publication->id === $publication->manuscript->current_publication_id,
                    'created_at' => $publication->created_at,
                ];
            })
            ->toArray();
    }

    /**
     * Copy galleys from one publication to another.
     */
    public function copyGalleys(Publication $fromPublication, Publication $toPublication): void
    {
        foreach ($fromPublication->galleys as $galley) {
            $newGalley = $galley->replicate(['id', 'created_at', 'updated_at']);
            $newGalley->publication_id = $toPublication->id;
            $newGalley->download_count = 0;
            $newGalley->last_downloaded_at = null;
            $newGalley->save();
        }
    }

    /**
     * Get all versions of a manuscript with their galleys.
     */
    public function getVersionsWithGalleys(Manuscript $manuscript): array
    {
        return $manuscript->publications()
            ->with('galleys')
            ->orderByDesc('version_major')
            ->orderByDesc('version_minor')
            ->get()
            ->toArray();
    }
}
