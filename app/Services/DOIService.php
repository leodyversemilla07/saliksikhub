<?php

namespace App\Services;

use App\Models\DOI;
use App\Models\Publication;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DOIService
{
    protected string $crossrefUsername;

    protected string $crossrefPassword;

    protected string $crossrefDoiPrefix;

    protected string $crossrefDepositorName;

    protected string $crossrefDepositorEmail;

    protected string $dataciteUsername;

    protected string $datacitePassword;

    protected string $dataciteDoiPrefix;

    protected string $dataciteApiUrl;

    public function __construct()
    {
        // CrossRef configuration
        $this->crossrefUsername = config('services.crossref.username') ?? '';
        $this->crossrefPassword = config('services.crossref.password') ?? '';
        $this->crossrefDoiPrefix = config('services.crossref.doi_prefix') ?? '10.00000';
        $this->crossrefDepositorName = config('services.crossref.depositor_name') ?? 'SalikSikHub';
        $this->crossrefDepositorEmail = config('services.crossref.depositor_email') ?? 'admin@saliksikhub.org';

        // DataCite configuration
        $this->dataciteUsername = config('services.datacite.username') ?? '';
        $this->datacitePassword = config('services.datacite.password') ?? '';
        $this->dataciteDoiPrefix = config('services.datacite.doi_prefix') ?? '10.00000';
        $this->dataciteApiUrl = config('services.datacite.api_url') ?? 'https://api.test.datacite.org';
    }

    /**
     * Assign a DOI to a publication.
     */
    public function assignDOI(
        $model,
        ?string $customSuffix = null,
        string $registrationAgency = 'crossref'
    ): DOI {
        $prefix = $registrationAgency === 'datacite'
            ? $this->dataciteDoiPrefix
            : $this->crossrefDoiPrefix;

        // Generate suffix if not provided
        if (! $customSuffix) {
            $customSuffix = $this->generateSuffix($model);
        }

        $doiString = "{$prefix}/{$customSuffix}";

        // Check if DOI already exists
        $existingDoi = DOI::where('doi', $doiString)->first();
        if ($existingDoi) {
            throw new \Exception("DOI {$doiString} already exists");
        }

        // Create DOI record
        $doi = DOI::create([
            'doiable_type' => get_class($model),
            'doiable_id' => $model->id,
            'doi' => $doiString,
            'prefix' => $prefix,
            'suffix' => $customSuffix,
            'status' => 'assigned',
            'registration_agency' => $registrationAgency,
        ]);

        Log::info("DOI assigned: {$doiString}", [
            'model_type' => get_class($model),
            'model_id' => $model->id,
        ]);

        return $doi;
    }

    /**
     * Register DOI with CrossRef.
     */
    public function registerWithCrossRef(DOI $doi): bool
    {
        try {
            // Get the model (publication, issue, etc.)
            $model = $doi->doiable;

            // Generate CrossRef XML metadata
            $xml = $this->generateCrossRefXML($doi, $model);

            // Store metadata in DOI record
            $doi->update(['metadata' => ['xml' => $xml]]);

            // Submit to CrossRef API
            $response = Http::withBasicAuth($this->crossrefUsername, $this->crossrefPassword)
                ->withHeaders([
                    'Content-Type' => 'application/vnd.crossref.deposit+xml',
                ])
                ->post('https://doi.crossref.org/servlet/deposit', $xml);

            if ($response->successful()) {
                $doi->markAsDeposited($response->body());

                Log::info("DOI registered with CrossRef: {$doi->doi}");

                return true;
            } else {
                $errorMessage = 'CrossRef registration failed: '.$response->status().' - '.$response->body();
                $doi->markAsError($errorMessage);

                Log::error($errorMessage);

                return false;
            }
        } catch (\Exception $e) {
            $doi->markAsError($e->getMessage());

            Log::error("DOI registration error: {$e->getMessage()}", [
                'doi' => $doi->doi,
                'trace' => $e->getTraceAsString(),
            ]);

            return false;
        }
    }

    /**
     * Register DOI with DataCite.
     */
    public function registerWithDataCite(DOI $doi): bool
    {
        try {
            $model = $doi->doiable;

            // Generate DataCite JSON metadata
            $metadata = $this->generateDataCiteMetadata($doi, $model);

            // Store metadata
            $doi->update(['metadata' => $metadata]);

            // Submit to DataCite API
            $response = Http::withBasicAuth($this->dataciteUsername, $this->datacitePassword)
                ->withHeaders([
                    'Content-Type' => 'application/vnd.api+json',
                ])
                ->post("{$this->dataciteApiUrl}/dois", [
                    'data' => [
                        'type' => 'dois',
                        'attributes' => $metadata,
                    ],
                ]);

            if ($response->successful() || $response->status() === 201) {
                $doi->markAsDeposited($response->body());

                Log::info("DOI registered with DataCite: {$doi->doi}");

                return true;
            } else {
                $errorMessage = 'DataCite registration failed: '.$response->status().' - '.$response->body();
                $doi->markAsError($errorMessage);

                Log::error($errorMessage);

                return false;
            }
        } catch (\Exception $e) {
            $doi->markAsError($e->getMessage());

            Log::error("DOI registration error: {$e->getMessage()}", [
                'doi' => $doi->doi,
                'trace' => $e->getTraceAsString(),
            ]);

            return false;
        }
    }

    /**
     * Check registration status of a DOI.
     */
    public function checkRegistrationStatus(DOI $doi): array
    {
        if ($doi->registration_agency === 'crossref') {
            return $this->checkCrossRefStatus($doi);
        } elseif ($doi->registration_agency === 'datacite') {
            return $this->checkDataCiteStatus($doi);
        }

        return [
            'status' => 'unknown',
            'message' => 'Unknown registration agency',
        ];
    }

    /**
     * Re-deposit DOI metadata (for updates).
     */
    public function redeposit(DOI $doi): bool
    {
        // Mark as stale first
        $doi->update(['status' => 'stale']);

        // Re-register based on agency
        if ($doi->registration_agency === 'crossref') {
            return $this->registerWithCrossRef($doi);
        } elseif ($doi->registration_agency === 'datacite') {
            return $this->registerWithDataCite($doi);
        }

        return false;
    }

    /**
     * Generate suffix for DOI based on model.
     */
    protected function generateSuffix($model): string
    {
        if ($model instanceof Publication) {
            $manuscript = $model->manuscript;
            $journal = $manuscript->journal;

            // Format: journal.abbrev.v1i1.123
            $journalAbbrev = $journal ? strtolower(str_replace(' ', '', substr($journal->name, 0, 10))) : 'journal';
            $version = "v{$model->version_major}i{$model->version_minor}";
            $manuscriptId = $manuscript->id;

            return "{$journalAbbrev}.{$version}.{$manuscriptId}";
        }

        // Default suffix
        return strtolower(class_basename($model)).'.'.$model->id.'.'.time();
    }

    /**
     * Generate CrossRef XML metadata (JATS format).
     */
    protected function generateCrossRefXML(DOI $doi, $model): string
    {
        if (! ($model instanceof Publication)) {
            throw new \Exception('CrossRef registration currently only supports Publications');
        }

        $manuscript = $model->manuscript;
        $journal = $manuscript->journal;

        $timestamp = now()->timestamp;
        $batchId = 'batch_'.$timestamp;

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<doi_batch xmlns="http://www.crossref.org/schema/5.3.1" 
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                    version="5.3.1" 
                    xsi:schemaLocation="http://www.crossref.org/schema/5.3.1 
                    http://www.crossref.org/schemas/crossref5.3.1.xsd">'."\n";

        // Head section
        $xml .= '  <head>'."\n";
        $xml .= "    <doi_batch_id>{$batchId}</doi_batch_id>\n";
        $xml .= "    <timestamp>{$timestamp}</timestamp>\n";
        $xml .= '    <depositor>'."\n";
        $xml .= '      <depositor_name>'.htmlspecialchars($this->crossrefDepositorName)."</depositor_name>\n";
        $xml .= "      <email_address>{$this->crossrefDepositorEmail}</email_address>\n";
        $xml .= '    </depositor>'."\n";
        $xml .= '    <registrant>'.htmlspecialchars($journal->name ?? 'Journal')."</registrant>\n";
        $xml .= '  </head>'."\n";

        // Body section
        $xml .= '  <body>'."\n";
        $xml .= '    <journal>'."\n";
        $xml .= '      <journal_metadata>'."\n";
        $xml .= '        <full_title>'.htmlspecialchars($journal->name ?? 'Journal')."</full_title>\n";
        $xml .= '        <abbrev_title>'.htmlspecialchars($journal->abbreviation ?? 'J')."</abbrev_title>\n";

        if ($journal->issn ?? null) {
            $xml .= "        <issn>{$journal->issn}</issn>\n";
        }

        $xml .= '      </journal_metadata>'."\n";

        // Journal issue
        $xml .= '      <journal_issue>'."\n";
        $xml .= "        <publication_date>\n";
        $pubDate = $model->date_published ?? now();
        $xml .= "          <year>{$pubDate->format('Y')}</year>\n";
        $xml .= "          <month>{$pubDate->format('m')}</month>\n";
        $xml .= "          <day>{$pubDate->format('d')}</day>\n";
        $xml .= "        </publication_date>\n";
        $xml .= '      </journal_issue>'."\n";

        // Journal article
        $xml .= '      <journal_article publication_type="full_text">'."\n";
        $xml .= '        <titles>'."\n";
        $xml .= '          <title>'.htmlspecialchars($model->title)."</title>\n";
        $xml .= '        </titles>'."\n";

        // Contributors (authors)
        $xml .= '        <contributors>'."\n";
        $authors = $manuscript->manuscriptAuthors;
        foreach ($authors as $index => $author) {
            $sequence = $index === 0 ? 'first' : 'additional';
            $xml .= "          <person_name sequence=\"{$sequence}\" contributor_role=\"author\">\n";
            $xml .= '            <given_name>'.htmlspecialchars($author->first_name ?? '')."</given_name>\n";
            $xml .= '            <surname>'.htmlspecialchars($author->last_name ?? '')."</surname>\n";
            $xml .= "          </person_name>\n";
        }
        $xml .= '        </contributors>'."\n";

        // Abstract
        if ($model->abstract) {
            $xml .= '        <jats:abstract>'.htmlspecialchars($model->abstract)."</jats:abstract>\n";
        }

        // DOI data
        $xml .= "        <doi_data>\n";
        $xml .= "          <doi>{$doi->doi}</doi>\n";
        $xml .= '          <resource>'.htmlspecialchars($model->public_url)."</resource>\n";
        $xml .= "        </doi_data>\n";

        $xml .= '      </journal_article>'."\n";
        $xml .= '    </journal>'."\n";
        $xml .= '  </body>'."\n";
        $xml .= '</doi_batch>';

        return $xml;
    }

    /**
     * Generate DataCite JSON metadata.
     */
    protected function generateDataCiteMetadata(DOI $doi, $model): array
    {
        if (! ($model instanceof Publication)) {
            throw new \Exception('DataCite registration currently only supports Publications');
        }

        $manuscript = $model->manuscript;
        $authors = $manuscript->manuscriptAuthors;

        return [
            'doi' => $doi->doi,
            'url' => $model->public_url,
            'titles' => [
                ['title' => $model->title],
            ],
            'creators' => $authors->map(function ($author) {
                return [
                    'name' => $author->full_name ?? 'Unknown',
                    'givenName' => $author->first_name ?? '',
                    'familyName' => $author->last_name ?? '',
                ];
            })->toArray(),
            'publicationYear' => ($model->date_published ?? now())->format('Y'),
            'publisher' => $manuscript->journal->name ?? 'Journal',
            'resourceType' => [
                'resourceTypeGeneral' => 'Text',
                'resourceType' => 'JournalArticle',
            ],
            'descriptions' => [
                [
                    'description' => $model->abstract ?? '',
                    'descriptionType' => 'Abstract',
                ],
            ],
        ];
    }

    /**
     * Check CrossRef status.
     */
    protected function checkCrossRefStatus(DOI $doi): array
    {
        // CrossRef doesn't have a real-time status check API
        // This is a placeholder for actual implementation
        return [
            'status' => $doi->status,
            'message' => 'CrossRef status check not implemented',
        ];
    }

    /**
     * Check DataCite status.
     */
    protected function checkDataCiteStatus(DOI $doi): array
    {
        try {
            $response = Http::withBasicAuth($this->dataciteUsername, $this->datacitePassword)
                ->get("{$this->dataciteApiUrl}/dois/{$doi->doi}");

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'status' => 'registered',
                    'message' => 'DOI is registered',
                    'data' => $data,
                ];
            }

            return [
                'status' => 'not_found',
                'message' => 'DOI not found in DataCite',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }
}
