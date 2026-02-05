<?php

namespace App\Services\OAI;

use App\Models\OAIRecord;
use App\Models\Publication;
use Carbon\Carbon;
use Illuminate\Support\Facades\URL;

class OAIRepository
{
    protected string $repositoryName;
    protected string $baseURL;
    protected string $adminEmail;
    protected string $repositoryIdentifier;

    public function __construct()
    {
        $this->repositoryName = config('oai.repository_name', config('app.name'));
        $this->baseURL = config('oai.base_url', URL::to('/oai'));
        $this->adminEmail = config('oai.admin_email', config('mail.from.address'));
        $this->repositoryIdentifier = config('oai.repository_identifier', parse_url(config('app.url'), PHP_URL_HOST));
    }

    /**
     * OAI-PMH Identify verb
     */
    public function identify(): array
    {
        return [
            'repositoryName' => $this->repositoryName,
            'baseURL' => $this->baseURL,
            'protocolVersion' => '2.0',
            'adminEmail' => $this->adminEmail,
            'earliestDatestamp' => $this->getEarliestDatestamp(),
            'deletedRecord' => 'persistent',
            'granularity' => 'YYYY-MM-DDThh:mm:ssZ',
            'repositoryIdentifier' => $this->repositoryIdentifier,
        ];
    }

    /**
     * OAI-PMH ListMetadataFormats verb
     */
    public function listMetadataFormats(?string $identifier = null): array
    {
        return [
            [
                'metadataPrefix' => 'oai_dc',
                'schema' => 'http://www.openarchives.org/OAI/2.0/oai_dc.xsd',
                'metadataNamespace' => 'http://www.openarchives.org/OAI/2.0/oai_dc/',
            ],
            [
                'metadataPrefix' => 'jats',
                'schema' => 'https://jats.nlm.nih.gov/publishing/1.3/JATS-journalpublishing1.xsd',
                'metadataNamespace' => 'https://jats.nlm.nih.gov/ns/publishing/1.3/',
            ],
        ];
    }

    /**
     * OAI-PMH ListSets verb
     */
    public function listSets(): array
    {
        // Define sets based on journal sections, categories, etc.
        return [
            [
                'setSpec' => 'articles',
                'setName' => 'Research Articles',
            ],
            [
                'setSpec' => 'reviews',
                'setName' => 'Review Articles',
            ],
            [
                'setSpec' => 'openaccess',
                'setName' => 'Open Access',
            ],
        ];
    }

    /**
     * OAI-PMH ListIdentifiers verb
     */
    public function listIdentifiers(
        string $metadataPrefix,
        ?string $from = null,
        ?string $until = null,
        ?string $set = null,
        ?string $resumptionToken = null
    ): array {
        $query = OAIRecord::query()
            ->where('metadata_format', $metadataPrefix);

        if ($from) {
            $query->fromDate(Carbon::parse($from));
        }

        if ($until) {
            $query->untilDate(Carbon::parse($until));
        }

        if ($set) {
            $query->inSet($set);
        }

        // Handle resumption token for pagination
        $perPage = 100;
        $cursor = $resumptionToken ? (int) $resumptionToken : 0;

        $records = $query->skip($cursor)->take($perPage + 1)->get();
        $hasMore = $records->count() > $perPage;
        
        if ($hasMore) {
            $records = $records->slice(0, $perPage);
        }

        $identifiers = $records->map(function ($record) {
            return [
                'identifier' => $record->identifier,
                'datestamp' => $record->datestamp->format('Y-m-d\TH:i:s\Z'),
                'setSpec' => $record->set_spec,
                'deleted' => $record->deleted,
            ];
        })->toArray();

        $result = ['identifiers' => $identifiers];

        if ($hasMore) {
            $result['resumptionToken'] = [
                'token' => (string) ($cursor + $perPage),
                'completeListSize' => OAIRecord::where('metadata_format', $metadataPrefix)->count(),
                'cursor' => $cursor,
            ];
        }

        return $result;
    }

    /**
     * OAI-PMH ListRecords verb
     */
    public function listRecords(
        string $metadataPrefix,
        ?string $from = null,
        ?string $until = null,
        ?string $set = null,
        ?string $resumptionToken = null
    ): array {
        $identifiersData = $this->listIdentifiers($metadataPrefix, $from, $until, $set, $resumptionToken);
        
        $records = collect($identifiersData['identifiers'])->map(function ($identifierData) use ($metadataPrefix) {
            $record = OAIRecord::where('identifier', $identifierData['identifier'])->first();
            
            if (!$record) {
                return null;
            }

            return [
                'header' => [
                    'identifier' => $record->identifier,
                    'datestamp' => $record->datestamp->format('Y-m-d\TH:i:s\Z'),
                    'setSpec' => $record->set_spec,
                    'deleted' => $record->deleted,
                ],
                'metadata' => $record->deleted ? null : $this->generateMetadata($record, $metadataPrefix),
            ];
        })->filter()->values()->toArray();

        $result = ['records' => $records];

        if (isset($identifiersData['resumptionToken'])) {
            $result['resumptionToken'] = $identifiersData['resumptionToken'];
        }

        return $result;
    }

    /**
     * OAI-PMH GetRecord verb
     */
    public function getRecord(string $identifier, string $metadataPrefix): array
    {
        $record = OAIRecord::where('identifier', $identifier)
            ->where('metadata_format', $metadataPrefix)
            ->firstOrFail();

        return [
            'header' => [
                'identifier' => $record->identifier,
                'datestamp' => $record->datestamp->format('Y-m-d\TH:i:s\Z'),
                'setSpec' => $record->set_spec,
                'deleted' => $record->deleted,
            ],
            'metadata' => $record->deleted ? null : $this->generateMetadata($record, $metadataPrefix),
        ];
    }

    /**
     * Generate or retrieve cached metadata
     */
    protected function generateMetadata(OAIRecord $record, string $metadataPrefix): array
    {
        // Check if metadata is cached
        if ($record->metadata) {
            return json_decode($record->metadata, true);
        }

        $recordable = $record->recordable;

        if (!$recordable) {
            return [];
        }

        // Generate metadata based on format
        $metadata = match ($metadataPrefix) {
            'oai_dc' => $this->generateDublinCoreMetadata($recordable),
            'jats' => $this->generateJATSMetadata($recordable),
            default => [],
        };

        // Cache the metadata
        $record->update(['metadata' => json_encode($metadata)]);

        return $metadata;
    }

    /**
     * Generate Dublin Core metadata
     */
    protected function generateDublinCoreMetadata($recordable): array
    {
        if ($recordable instanceof Publication) {
            return [
                'dc:title' => $recordable->title,
                'dc:creator' => $recordable->manuscript->authors->pluck('full_name')->toArray(),
                'dc:subject' => $recordable->keywords ?? [],
                'dc:description' => strip_tags($recordable->abstract),
                'dc:publisher' => config('app.name'),
                'dc:date' => $recordable->date_published?->format('Y-m-d'),
                'dc:type' => 'Text',
                'dc:format' => 'application/pdf',
                'dc:identifier' => $recordable->doi?->doi ?? $recordable->url_path,
                'dc:language' => $recordable->language ?? 'en',
                'dc:rights' => $recordable->license_url ?? 'All rights reserved',
            ];
        }

        return [];
    }

    /**
     * Generate JATS metadata (simplified)
     */
    protected function generateJATSMetadata($recordable): array
    {
        if ($recordable instanceof Publication) {
            // Use JATSXMLGenerator service
            $generator = app(\App\Services\Metadata\JATSXMLGenerator::class);
            $xml = $generator->generate($recordable);
            
            return [
                'jats:article' => $xml,
            ];
        }

        return [];
    }

    /**
     * Get earliest datestamp in repository
     */
    protected function getEarliestDatestamp(): string
    {
        $earliest = OAIRecord::min('datestamp');
        
        return $earliest 
            ? Carbon::parse($earliest)->format('Y-m-d\TH:i:s\Z')
            : Carbon::now()->format('Y-m-d\TH:i:s\Z');
    }

    /**
     * Create or update OAI record for a publication
     */
    public function createOrUpdateRecord(Publication $publication): OAIRecord
    {
        $identifier = $this->generateIdentifier('publication', $publication->id);
        $setSpec = $this->determineSetSpec($publication);

        return OAIRecord::updateOrCreate(
            [
                'identifier' => $identifier,
                'metadata_format' => 'oai_dc',
            ],
            [
                'datestamp' => $publication->updated_at ?? now(),
                'set_spec' => $setSpec,
                'recordable_type' => Publication::class,
                'recordable_id' => $publication->id,
                'deleted' => false,
                'metadata' => null, // Will be generated on demand
            ]
        );
    }

    /**
     * Mark OAI record as deleted (tombstone)
     */
    public function deleteRecord(string $identifier): void
    {
        OAIRecord::where('identifier', $identifier)->update([
            'deleted' => true,
            'datestamp' => now(),
            'metadata' => null,
        ]);
    }

    /**
     * Generate OAI identifier
     */
    protected function generateIdentifier(string $type, int $id): string
    {
        return sprintf('oai:%s:%s:%d', $this->repositoryIdentifier, $type, $id);
    }

    /**
     * Determine set specification for a publication
     */
    protected function determineSetSpec(Publication $publication): string
    {
        // Determine based on access status, category, etc.
        if ($publication->access_status === 'open') {
            return 'openaccess';
        }

        return 'articles';
    }
}
