<?php

namespace App\Observers;

use App\Models\Publication;
use App\Services\OAI\OAIRepository;

class PublicationObserver
{
    protected OAIRepository $oaiRepository;

    public function __construct(OAIRepository $oaiRepository)
    {
        $this->oaiRepository = $oaiRepository;
    }

    /**
     * Handle the Publication "created" event.
     */
    public function created(Publication $publication): void
    {
        // Create OAI record when publication is published
        if ($publication->status === 'published' && $publication->date_published) {
            $this->oaiRepository->createOrUpdateRecord($publication);
        }
    }

    /**
     * Handle the Publication "updated" event.
     */
    public function updated(Publication $publication): void
    {
        // Update OAI record when publication is updated or published
        if ($publication->status === 'published' && $publication->date_published) {
            $this->oaiRepository->createOrUpdateRecord($publication);
        }
    }

    /**
     * Handle the Publication "deleted" event.
     */
    public function deleted(Publication $publication): void
    {
        // Mark OAI record as deleted (tombstone)
        $identifier = sprintf(
            'oai:%s:publication:%d',
            config('oai.repository_identifier'),
            $publication->id
        );
        
        $this->oaiRepository->deleteRecord($identifier);
    }

    /**
     * Handle the Publication "restored" event.
     */
    public function restored(Publication $publication): void
    {
        // Restore OAI record
        if ($publication->status === 'published' && $publication->date_published) {
            $this->oaiRepository->createOrUpdateRecord($publication);
        }
    }

    /**
     * Handle the Publication "force deleted" event.
     */
    public function forceDeleted(Publication $publication): void
    {
        // Mark OAI record as permanently deleted
        $identifier = sprintf(
            'oai:%s:publication:%d',
            config('oai.repository_identifier'),
            $publication->id
        );
        
        $this->oaiRepository->deleteRecord($identifier);
    }
}

