<?php

namespace App\Services;

use App\Models\CopyrightAgreement;
use App\Models\Manuscript;
use App\Models\ManuscriptIndexing;
use App\Models\ProofCorrection;
use App\Notifications\AuthorApprovalRequired;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PublicationService
{
    /**
     * Send copyright agreement to author.
     */
    public function sendCopyrightAgreement(
        Manuscript $manuscript,
        string $agreementType = CopyrightAgreement::TYPE_LICENSE_TO_PUBLISH,
        ?string $licenseType = null
    ): ?CopyrightAgreement {
        try {
            DB::beginTransaction();

            $agreement = CopyrightAgreement::create([
                'manuscript_id' => $manuscript->id,
                'author_id' => $manuscript->user_id,
                'agreement_type' => $agreementType,
                'license_type' => $licenseType,
                'sent_at' => now(),
            ]);

            // Send notification to author
            $manuscript->author->notify(new AuthorApprovalRequired($manuscript));

            DB::commit();

            return $agreement;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to send copyright agreement: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Process author signature on copyright agreement.
     */
    public function signCopyrightAgreement(
        CopyrightAgreement $agreement,
        string $signature
    ): bool {
        try {
            return $agreement->markAsSigned($signature);
        } catch (\Exception $e) {
            Log::error('Failed to sign copyright agreement: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Generate and send proofs to author.
     */
    public function sendProofsToAuthor(
        Manuscript $manuscript,
        string $proofFilePath,
        ?int $round = null
    ): ?ProofCorrection {
        try {
            DB::beginTransaction();

            // Determine the round number
            if ($round === null) {
                $lastProof = $manuscript->proofCorrections()->orderBy('proof_round', 'desc')->first();
                $round = $lastProof ? $lastProof->proof_round + 1 : 1;
            }

            $proof = ProofCorrection::create([
                'manuscript_id' => $manuscript->id,
                'proof_round' => $round,
                'proof_file_path' => $proofFilePath,
                'sent_to_author_at' => now(),
                'status' => ProofCorrection::STATUS_PENDING,
            ]);

            // Send notification to author
            $manuscript->author->notify(new \App\Notifications\ProofReviewRequired($manuscript, $proof));

            DB::commit();

            return $proof;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to send proofs to author: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Process author's proof approval or corrections.
     */
    public function processProofResponse(
        ProofCorrection $proof,
        bool $approved,
        ?string $corrections = null
    ): bool {
        try {
            if ($approved) {
                return $proof->approve();
            } else {
                if ($corrections) {
                    return $proof->requestCorrections($corrections);
                }
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Failed to process proof response: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Submit manuscript metadata to indexing databases.
     */
    public function submitToIndexingDatabases(Manuscript $manuscript): array
    {
        $results = [];
        $databases = $this->getIndexingDatabases();

        foreach ($databases as $database) {
            try {
                $indexing = ManuscriptIndexing::firstOrCreate(
                    [
                        'manuscript_id' => $manuscript->id,
                        'database_name' => $database,
                    ],
                    [
                        'status' => ManuscriptIndexing::STATUS_PENDING,
                    ]
                );

                // Skip if already indexed
                if ($indexing->isIndexed()) {
                    $results[$database] = 'already_indexed';

                    continue;
                }

                // Prepare metadata
                $metadata = $this->prepareMetadata($manuscript);

                // Submit to the database
                $success = $this->submitToDatabase($database, $manuscript, $metadata);

                if ($success) {
                    $indexing->markAsSubmitted($metadata);
                    $results[$database] = 'submitted';
                } else {
                    $indexing->markAsFailed('Submission failed');
                    $results[$database] = 'failed';
                }
            } catch (\Exception $e) {
                Log::error("Failed to submit to {$database}: ".$e->getMessage());
                $results[$database] = 'error';
            }
        }

        return $results;
    }

    /**
     * Confirm indexing completion.
     */
    public function confirmIndexing(
        ManuscriptIndexing $indexing,
        ?string $externalId = null
    ): bool {
        try {
            return $indexing->markAsIndexed($externalId);
        } catch (\Exception $e) {
            Log::error('Failed to confirm indexing: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get list of indexing databases.
     */
    protected function getIndexingDatabases(): array
    {
        return [
            ManuscriptIndexing::DATABASE_CROSSREF,
            ManuscriptIndexing::DATABASE_GOOGLE_SCHOLAR,
            // Add other databases as configured
        ];
    }

    /**
     * Prepare metadata for indexing submission.
     */
    protected function prepareMetadata(Manuscript $manuscript): array
    {
        return [
            'doi' => $manuscript->doi,
            'title' => $manuscript->title,
            'authors' => $manuscript->authors,
            'abstract' => $manuscript->abstract,
            'keywords' => $manuscript->keywords,
            'publication_date' => $manuscript->publication_date?->toDateString(),
            'volume' => $manuscript->volume,
            'issue' => $manuscript->issue,
            'page_range' => $manuscript->page_range,
            'journal_name' => $manuscript->journal?->name,
        ];
    }

    /**
     * Submit to specific indexing database.
     * This is a placeholder - actual implementation would use specific APIs.
     */
    protected function submitToDatabase(string $database, Manuscript $manuscript, array $metadata): bool
    {
        // Placeholder for actual API integration
        // Real implementation would use specific APIs for CrossRef, PubMed, etc.

        switch ($database) {
            case ManuscriptIndexing::DATABASE_CROSSREF:
                return $this->submitToCrossRef($manuscript, $metadata);

            case ManuscriptIndexing::DATABASE_GOOGLE_SCHOLAR:
                // Google Scholar auto-indexes, just log
                Log::info("Metadata prepared for Google Scholar indexing for manuscript {$manuscript->id}");

                return true;

            default:
                Log::warning("No submission handler for database: {$database}");

                return false;
        }
    }

    /**
     * Submit to CrossRef (placeholder for actual API integration).
     */
    protected function submitToCrossRef(Manuscript $manuscript, array $metadata): bool
    {
        // Placeholder for CrossRef API integration
        // Real implementation would use CrossRef's REST API or XML deposit

        try {
            // Example structure (not actual API call):
            // $response = Http::post('https://api.crossref.org/deposits', [
            //     'metadata' => $metadata,
            //     'doi' => $manuscript->doi,
            // ]);

            Log::info("Submitted manuscript {$manuscript->id} to CrossRef");

            return true;
        } catch (\Exception $e) {
            Log::error('CrossRef submission failed: '.$e->getMessage());

            return false;
        }
    }
}
