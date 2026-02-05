<?php

namespace App\Services\Metadata;

use App\Models\Publication;
use DOMDocument;
use DOMElement;

class JATSXMLGenerator
{
    protected DOMDocument $doc;
    protected string $dtdVersion = '1.3';

    /**
     * Generate JATS XML for a publication
     */
    public function generate(Publication $publication): string
    {
        $this->doc = new DOMDocument('1.0', 'UTF-8');
        $this->doc->formatOutput = true;
        
        // Add DOCTYPE declaration for JATS
        $dtd = $this->doc->implementation->createDocumentType(
            'article',
            '-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.3 20210610//EN',
            'https://jats.nlm.nih.gov/publishing/1.3/JATS-journalpublishing1-3.dtd'
        );
        
        $this->doc->appendChild($dtd);

        // Create root article element
        $article = $this->doc->createElement('article');
        $article->setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        $article->setAttribute('xmlns:mml', 'http://www.w3.org/1998/Math/MathML');
        $article->setAttribute('article-type', $this->determineArticleType($publication));
        $article->setAttribute('dtd-version', $this->dtdVersion);
        
        if ($publication->language) {
            $article->setAttribute('xml:lang', $publication->language);
        }
        
        $this->doc->appendChild($article);

        // Build JATS structure
        $this->addFront($article, $publication);
        $this->addBody($article, $publication);
        $this->addBack($article, $publication);

        return $this->doc->saveXML();
    }

    /**
     * Add <front> section (article metadata)
     */
    protected function addFront(DOMElement $article, Publication $publication): void
    {
        $front = $this->doc->createElement('front');
        $article->appendChild($front);

        // Journal metadata
        $this->addJournalMeta($front, $publication);

        // Article metadata
        $this->addArticleMeta($front, $publication);
    }

    /**
     * Add journal metadata
     */
    protected function addJournalMeta(DOMElement $front, Publication $publication): void
    {
        $journalMeta = $this->doc->createElement('journal-meta');
        $front->appendChild($journalMeta);

        // Journal ID
        $journalId = $this->createElement('journal-id', config('app.name'));
        $journalId->setAttribute('journal-id-type', 'publisher');
        $journalMeta->appendChild($journalId);

        // Journal title
        $journalTitleGroup = $this->doc->createElement('journal-title-group');
        $journalTitleGroup->appendChild(
            $this->createElement('journal-title', config('app.name'))
        );
        $journalMeta->appendChild($journalTitleGroup);

        // ISSN (if available)
        if ($issn = config('journal.issn')) {
            $issnEl = $this->createElement('issn', $issn);
            $issnEl->setAttribute('pub-type', 'epub');
            $journalMeta->appendChild($issnEl);
        }

        // Publisher
        $publisher = $this->doc->createElement('publisher');
        $publisher->appendChild(
            $this->createElement('publisher-name', config('app.name'))
        );
        $journalMeta->appendChild($publisher);
    }

    /**
     * Add article metadata
     */
    protected function addArticleMeta(DOMElement $front, Publication $publication): void
    {
        $articleMeta = $this->doc->createElement('article-meta');
        $front->appendChild($articleMeta);

        // Article ID (DOI if available)
        if ($publication->doi) {
            $articleId = $this->createElement('article-id', $publication->doi->doi);
            $articleId->setAttribute('pub-id-type', 'doi');
            $articleMeta->appendChild($articleId);
        }

        // Article categories
        if ($publication->manuscript->category) {
            $articleCategories = $this->doc->createElement('article-categories');
            $subjGroup = $this->doc->createElement('subj-group');
            $subjGroup->setAttribute('subj-group-type', 'heading');
            $subjGroup->appendChild(
                $this->createElement('subject', $publication->manuscript->category)
            );
            $articleCategories->appendChild($subjGroup);
            $articleMeta->appendChild($articleCategories);
        }

        // Title group
        $titleGroup = $this->doc->createElement('title-group');
        $titleGroup->appendChild(
            $this->createElement('article-title', $publication->title)
        );
        $articleMeta->appendChild($titleGroup);

        // Contributors (authors)
        $this->addContribGroup($articleMeta, $publication);

        // Publication date
        if ($publication->date_published) {
            $this->addPubDate($articleMeta, $publication->date_published);
        }

        // Volume and issue information
        if ($publication->manuscript->issue) {
            $issue = $publication->manuscript->issue;
            if ($issue->volume) {
                $articleMeta->appendChild($this->createElement('volume', $issue->volume));
            }
            if ($issue->number) {
                $articleMeta->appendChild($this->createElement('issue', $issue->number));
            }
        }

        // Page information
        if ($publication->page_start && $publication->page_end) {
            $articleMeta->appendChild($this->createElement('fpage', $publication->page_start));
            $articleMeta->appendChild($this->createElement('lpage', $publication->page_end));
        }

        // Permissions (copyright)
        $this->addPermissions($articleMeta, $publication);

        // Abstract
        if ($publication->abstract) {
            $abstract = $this->doc->createElement('abstract');
            $abstractP = $this->createElement('p', strip_tags($publication->abstract));
            $abstract->appendChild($abstractP);
            $articleMeta->appendChild($abstract);
        }

        // Keywords
        if ($publication->keywords && count($publication->keywords) > 0) {
            $kwdGroup = $this->doc->createElement('kwd-group');
            $kwdGroup->setAttribute('kwd-group-type', 'author');
            foreach ($publication->keywords as $keyword) {
                $kwdGroup->appendChild($this->createElement('kwd', $keyword));
            }
            $articleMeta->appendChild($kwdGroup);
        }

        // Funding information
        if ($publication->manuscript->funding_statement) {
            $fundingGroup = $this->doc->createElement('funding-group');
            $fundingStatement = $this->doc->createElement('funding-statement');
            $fundingStatement->appendChild(
                $this->doc->createTextNode($publication->manuscript->funding_statement)
            );
            $fundingGroup->appendChild($fundingStatement);
            $articleMeta->appendChild($fundingGroup);
        }
    }

    /**
     * Add contributor group (authors)
     */
    protected function addContribGroup(DOMElement $articleMeta, Publication $publication): void
    {
        $contribGroup = $this->doc->createElement('contrib-group');
        
        foreach ($publication->manuscript->authors as $index => $author) {
            $contrib = $this->doc->createElement('contrib');
            $contrib->setAttribute('contrib-type', 'author');
            
            // Name
            $name = $this->doc->createElement('name');
            $name->appendChild($this->createElement('surname', $author->last_name ?? $author->full_name));
            if ($author->first_name) {
                $name->appendChild($this->createElement('given-names', $author->first_name));
            }
            $contrib->appendChild($name);

            // Email
            if ($author->email) {
                $email = $this->createElement('email', $author->email);
                $contrib->appendChild($email);
            }

            // Affiliation
            if ($author->affiliation) {
                $aff = $this->doc->createElement('aff');
                $aff->setAttribute('id', 'aff' . ($index + 1));
                $institution = $this->createElement('institution', $author->affiliation);
                $aff->appendChild($institution);
                $contrib->appendChild($aff);
            }

            // ORCID
            if ($author->orcid) {
                $contribId = $this->createElement('contrib-id', $author->orcid);
                $contribId->setAttribute('contrib-id-type', 'orcid');
                $contrib->appendChild($contribId);
            }

            $contribGroup->appendChild($contrib);
        }

        $articleMeta->appendChild($contribGroup);
    }

    /**
     * Add publication date
     */
    protected function addPubDate(DOMElement $articleMeta, $date): void
    {
        $pubDate = $this->doc->createElement('pub-date');
        $pubDate->setAttribute('pub-type', 'epub');
        
        $carbon = \Carbon\Carbon::parse($date);
        $pubDate->appendChild($this->createElement('day', $carbon->day));
        $pubDate->appendChild($this->createElement('month', $carbon->month));
        $pubDate->appendChild($this->createElement('year', $carbon->year));
        
        $articleMeta->appendChild($pubDate);
    }

    /**
     * Add permissions/copyright information
     */
    protected function addPermissions(DOMElement $articleMeta, Publication $publication): void
    {
        $permissions = $this->doc->createElement('permissions');

        // Copyright statement
        if ($publication->copyright_holder) {
            $copyrightStatement = $this->createElement(
                'copyright-statement',
                '© ' . ($publication->copyright_year ?? date('Y')) . ' ' . $publication->copyright_holder
            );
            $permissions->appendChild($copyrightStatement);
        }

        // Copyright year
        if ($publication->copyright_year) {
            $permissions->appendChild(
                $this->createElement('copyright-year', $publication->copyright_year)
            );
        }

        // Copyright holder
        if ($publication->copyright_holder) {
            $permissions->appendChild(
                $this->createElement('copyright-holder', $publication->copyright_holder)
            );
        }

        // License
        if ($publication->license_url) {
            $license = $this->doc->createElement('license');
            $license->setAttribute('xlink:href', $publication->license_url);
            
            $licenseP = $this->doc->createElement('license-p');
            $licenseP->appendChild(
                $this->doc->createTextNode('This article is distributed under the terms of the license.')
            );
            $license->appendChild($licenseP);
            
            $permissions->appendChild($license);
        }

        $articleMeta->appendChild($permissions);
    }

    /**
     * Add <body> section (article body)
     */
    protected function addBody(DOMElement $article, Publication $publication): void
    {
        // For now, add empty body or simple paragraph
        // Full text parsing would require more complex implementation
        $body = $this->doc->createElement('body');
        
        // If we have full text, we could parse it here
        // For now, just add a note that full text is in galleys
        $sec = $this->doc->createElement('sec');
        $title = $this->createElement('title', 'Full Text');
        $p = $this->createElement('p', 'Full text available in PDF and other formats.');
        
        $sec->appendChild($title);
        $sec->appendChild($p);
        $body->appendChild($sec);
        
        $article->appendChild($body);
    }

    /**
     * Add <back> section (references, acknowledgments)
     */
    protected function addBack(DOMElement $article, Publication $publication): void
    {
        $back = $this->doc->createElement('back');
        
        // Acknowledgments
        if ($publication->manuscript->acknowledgments) {
            $ack = $this->doc->createElement('ack');
            $ackTitle = $this->createElement('title', 'Acknowledgments');
            $ackP = $this->createElement('p', $publication->manuscript->acknowledgments);
            $ack->appendChild($ackTitle);
            $ack->appendChild($ackP);
            $back->appendChild($ack);
        }

        // Notes section (conflict of interest)
        if ($publication->manuscript->conflict_statement) {
            $notes = $this->doc->createElement('notes');
            $notesP = $this->createElement('p', $publication->manuscript->conflict_statement);
            $notes->appendChild($notesP);
            $back->appendChild($notes);
        }

        // Only add back if it has content
        if ($back->hasChildNodes()) {
            $article->appendChild($back);
        }
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
     * Determine article type from publication
     */
    protected function determineArticleType(Publication $publication): string
    {
        // Map publication category to JATS article types
        $category = strtolower($publication->manuscript->category ?? '');
        
        return match (true) {
            str_contains($category, 'review') => 'review-article',
            str_contains($category, 'research') => 'research-article',
            str_contains($category, 'case') => 'case-report',
            str_contains($category, 'editorial') => 'editorial',
            str_contains($category, 'letter') => 'letter',
            str_contains($category, 'commentary') => 'article-commentary',
            default => 'research-article',
        };
    }

    /**
     * Validate JATS XML against DTD
     */
    public function validate(string $xml): bool
    {
        $doc = new DOMDocument();
        $doc->loadXML($xml);
        
        // Note: Full DTD validation requires the DTD file
        // For now, just check if it's valid XML
        return $doc->schemaValidate('https://jats.nlm.nih.gov/publishing/1.3/JATS-journalpublishing1-3.xsd');
    }
}
