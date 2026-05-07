<?php

namespace App\Services\Metadata;

use App\Models\Publication;
use Carbon\Carbon;
use DOMDocument;
use DOMElement;

class PubMedXMLGenerator
{
    protected DOMDocument $doc;

    /**
     * Generate PubMed XML for a publication
     *
     * PubMed XML is specifically designed for medical/health science journals
     * submitting to PubMed Central (PMC)
     */
    public function generate(Publication $publication): string
    {
        $this->doc = new DOMDocument('1.0', 'UTF-8');
        $this->doc->formatOutput = true;

        // Create root element
        $articleSet = $this->doc->createElement('ArticleSet');
        $this->doc->appendChild($articleSet);

        // Add article
        $article = $this->doc->createElement('Article');
        $articleSet->appendChild($article);

        // Build PubMed structure
        $this->addJournal($article, $publication);
        $this->addArticleTitle($article, $publication);
        $this->addPagination($article, $publication);
        $this->addAbstract($article, $publication);
        $this->addAuthorList($article, $publication);
        $this->addPublicationDate($article, $publication);
        $this->addArticleIds($article, $publication);
        $this->addMeshTerms($article, $publication);

        return $this->doc->saveXML();
    }

    /**
     * Add journal information
     */
    protected function addJournal(DOMElement $article, Publication $publication): void
    {
        $journal = $this->doc->createElement('Journal');
        $article->appendChild($journal);

        // Publisher name
        $publisherName = $this->createElement('PublisherName', config('journal.publisher', config('app.name')));
        $journal->appendChild($publisherName);

        // Journal title
        $journalTitle = $this->createElement('JournalTitle', config('journal.name', config('app.name')));
        $journal->appendChild($journalTitle);

        // ISSN
        if ($issn = config('journal.issn')) {
            $issnEl = $this->createElement('Issn', $issn);
            $journal->appendChild($issnEl);
        }

        // Volume and issue
        if ($publication->manuscript->issue) {
            $issue = $publication->manuscript->issue;

            if ($issue->volume_number) {
                $volume = $this->createElement('Volume', $issue->volume_number);
                $journal->appendChild($volume);
            }

            if ($issue->issue_number) {
                $issueEl = $this->createElement('Issue', $issue->issue_number);
                $journal->appendChild($issueEl);
            }

            // Publication date
            if ($issue->publication_date) {
                $pubDate = $this->doc->createElement('PubDate');
                $carbon = Carbon::parse($issue->publication_date);

                $pubDate->appendChild($this->createElement('Year', $carbon->year));
                $pubDate->appendChild($this->createElement('Month', $carbon->format('m')));

                $journal->appendChild($pubDate);
            }
        }
    }

    /**
     * Add article title
     */
    protected function addArticleTitle(DOMElement $article, Publication $publication): void
    {
        $articleTitle = $this->createElement('ArticleTitle', $publication->title);
        $article->appendChild($articleTitle);
    }

    /**
     * Add pagination information
     */
    protected function addPagination(DOMElement $article, Publication $publication): void
    {
        if ($publication->page_start && $publication->page_end) {
            $pagination = $this->doc->createElement('Pagination');

            $medlinePgn = $this->createElement(
                'MedlinePgn',
                $publication->page_start.'-'.$publication->page_end
            );
            $pagination->appendChild($medlinePgn);

            $article->appendChild($pagination);
        }
    }

    /**
     * Add abstract
     */
    protected function addAbstract(DOMElement $article, Publication $publication): void
    {
        if ($publication->abstract) {
            $abstract = $this->doc->createElement('Abstract');

            $abstractText = $this->createElement('AbstractText', strip_tags($publication->abstract));
            $abstract->appendChild($abstractText);

            $article->appendChild($abstract);
        }
    }

    /**
     * Add author list
     */
    protected function addAuthorList(DOMElement $article, Publication $publication): void
    {
        $authorList = $this->doc->createElement('AuthorList');
        $article->appendChild($authorList);

        foreach ($publication->manuscript->authors as $author) {
            $authorEl = $this->doc->createElement('Author');

            // Last name (required)
            if ($author->last_name) {
                $lastName = $this->createElement('LastName', $author->last_name);
                $authorEl->appendChild($lastName);
            }

            // First name/initials
            if ($author->first_name) {
                $foreName = $this->createElement('ForeName', $author->first_name);
                $authorEl->appendChild($foreName);

                // Initials (first letter of first name)
                $initials = $this->createElement('Initials', strtoupper(substr($author->first_name, 0, 1)));
                $authorEl->appendChild($initials);
            }

            // Affiliation
            if ($author->affiliation) {
                $affiliation = $this->createElement('Affiliation', $author->affiliation);
                $authorEl->appendChild($affiliation);
            }

            // ORCID identifier
            if ($author->orcid) {
                $identifier = $this->createElement('Identifier', $author->orcid);
                $identifier->setAttribute('Source', 'ORCID');
                $authorEl->appendChild($identifier);
            }

            $authorList->appendChild($authorEl);
        }
    }

    /**
     * Add publication date
     */
    protected function addPublicationDate(DOMElement $article, Publication $publication): void
    {
        if ($publication->date_published) {
            $carbon = Carbon::parse($publication->date_published);

            $articleDate = $this->doc->createElement('ArticleDate');
            $articleDate->setAttribute('DateType', 'Electronic');

            $articleDate->appendChild($this->createElement('Year', $carbon->year));
            $articleDate->appendChild($this->createElement('Month', $carbon->format('m')));
            $articleDate->appendChild($this->createElement('Day', $carbon->format('d')));

            $article->appendChild($articleDate);
        }
    }

    /**
     * Add article identifiers (DOI, PMID, etc.)
     */
    protected function addArticleIds(DOMElement $article, Publication $publication): void
    {
        $articleIdList = $this->doc->createElement('ArticleIdList');

        // DOI
        if ($publication->doi) {
            $articleId = $this->createElement('ArticleId', $publication->doi->doi);
            $articleId->setAttribute('IdType', 'doi');
            $articleIdList->appendChild($articleId);
        }

        // Publisher ID (use publication ID)
        $pubId = $this->createElement('ArticleId', (string) $publication->id);
        $pubId->setAttribute('IdType', 'pii');
        $articleIdList->appendChild($pubId);

        $article->appendChild($articleIdList);
    }

    /**
     * Add MeSH terms (Medical Subject Headings)
     * Maps keywords to MeSH-like terms
     */
    protected function addMeshTerms(DOMElement $article, Publication $publication): void
    {
        if ($publication->keywords && count($publication->keywords) > 0) {
            $meshHeadingList = $this->doc->createElement('MeshHeadingList');

            foreach ($publication->keywords as $keyword) {
                $meshHeading = $this->doc->createElement('MeshHeading');

                $descriptorName = $this->createElement('DescriptorName', $keyword);
                $descriptorName->setAttribute('MajorTopicYN', 'N');

                $meshHeading->appendChild($descriptorName);
                $meshHeadingList->appendChild($meshHeading);
            }

            $article->appendChild($meshHeadingList);
        }
    }

    /**
     * Generate PubMed XML for batch submission
     */
    public function generateBatch(array $publications): string
    {
        $this->doc = new DOMDocument('1.0', 'UTF-8');
        $this->doc->formatOutput = true;

        $articleSet = $this->doc->createElement('ArticleSet');
        $this->doc->appendChild($articleSet);

        foreach ($publications as $publication) {
            // Create article element for each publication
            $article = $this->doc->createElement('Article');

            $this->addJournal($article, $publication);
            $this->addArticleTitle($article, $publication);
            $this->addPagination($article, $publication);
            $this->addAbstract($article, $publication);
            $this->addAuthorList($article, $publication);
            $this->addPublicationDate($article, $publication);
            $this->addArticleIds($article, $publication);
            $this->addMeshTerms($article, $publication);

            $articleSet->appendChild($article);
        }

        return $this->doc->saveXML();
    }

    /**
     * Helper to create element with text content
     */
    protected function createElement(string $name, $value): DOMElement
    {
        $element = $this->doc->createElement($name);
        $element->appendChild($this->doc->createTextNode((string) $value));

        return $element;
    }

    /**
     * Validate PubMed XML
     */
    public function validate(string $xml): bool
    {
        $doc = new DOMDocument;

        try {
            $doc->loadXML($xml);

            // Basic validation - check if it's valid XML
            return $doc->documentElement->tagName === 'ArticleSet';
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Generate FTP upload filename for PubMed
     * Format: journal_abbreviation_volume_issue.xml
     */
    public function generateFilename(Publication $publication): string
    {
        $journalAbbr = config('journal.abbreviation', 'journal');
        $journalAbbr = preg_replace('/[^a-z0-9]/i', '_', strtolower($journalAbbr));

        $volume = $publication->manuscript->issue->volume_number ?? 'v1';
        $issue = $publication->manuscript->issue->issue_number ?? 'i1';

        return sprintf('%s_%s_%s.xml', $journalAbbr, $volume, $issue);
    }
}
