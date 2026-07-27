<?php

namespace App\Services;

use App\Enums\ManuscriptStatus;
use App\Models\Issue;
use App\Models\Journal;
use App\Models\Manuscript;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Import issues, articles, and authors from OJS Native XML format
 * into the SaliksikHub data model.
 */
class OJSImportService
{
    /**
     * Statistics from the last import.
     *
     * @var array{issues: int, articles: int, authors: int, skipped: int, errors: array<int, string>}
     */
    protected array $stats = [
        'issues' => 0,
        'articles' => 0,
        'authors' => 0,
        'skipped' => 0,
        'errors' => [],
    ];

    /**
     * The default namespace URI from the OJS XML (e.g. http://pkp.sfu.ca/ojs/native).
     */
    protected ?string $nsUri = null;

    /**
     * Mapping of section_ref values to SaliksikHub categories.
     */
    protected array $sectionMap = [
        'articles' => 'Research Article',
        'research-articles' => 'Research Article',
        'research_articles' => 'Research Article',
        'review-articles' => 'Review Article',
        'review_articles' => 'Review Article',
        'case-reports' => 'Case Report',
        'case_reports' => 'Case Report',
        'editorials' => 'Editorial',
        'letters' => 'Letter to the Editor',
        'book-reviews' => 'Book Review',
        'book_reviews' => 'Book Review',
        'commentaries' => 'Commentary',
    ];

    /**
     * Run the import from an OJS XML file path or string content.
     *
     * @param  Journal  $journal  The target journal to import into.
     * @param  string  $xmlPath  Absolute path to the XML file on disk, or raw XML string.
     * @param  array{create_issue_if_missing?: bool, publish_articles?: bool, skip_existing_dois?: bool}  $options
     * @return array{issues: int, articles: int, authors: int, skipped: int, errors: array<int, string>}
     */
    public function import(Journal $journal, string $xmlPath, array $options = []): array
    {
        $this->stats = [
            'issues' => 0,
            'articles' => 0,
            'authors' => 0,
            'skipped' => 0,
            'errors' => [],
        ];

        $defaults = [
            'create_issue_if_missing' => true,
            'publish_articles' => false,
            'skip_existing_dois' => true,
        ];
        $options = array_merge($defaults, $options);

        try {
            $xml = $this->loadXML($xmlPath);
        } catch (Exception $e) {
            $this->stats['errors'][] = 'Failed to load XML: '.$e->getMessage();

            return $this->stats;
        }

        // Get the default namespace URI and register it for XPath
        $namespaces = $xml->getNamespaces(true);
        $this->nsUri = $namespaces[''] ?? null;
        if ($this->nsUri) {
            $xml->registerXPathNamespace('ns', $this->nsUri);
        }

        $issues = $this->nsUri ? $xml->xpath('//ns:issue') : $xml->xpath('//issue');

        if (empty($issues)) {
            $this->stats['errors'][] = 'No <issue> elements found in XML.';

            return $this->stats;
        }

        foreach ($issues as $issueNode) {
            try {
                // Re-register namespace on each child for XPath compatibility
                if ($this->nsUri) {
                    $issueNode->registerXPathNamespace('ns', $this->nsUri);
                }
                $this->importIssue($journal, $issueNode, $options);
            } catch (Exception $e) {
                $this->stats['errors'][] = 'Issue import error: '.$e->getMessage();
                Log::error('OJS import failed for an issue', [
                    'journal_id' => $journal->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $this->stats;
    }

    /**
     * Load XML from file path or raw string.
     */
    protected function loadXML(string $source): \SimpleXMLElement
    {
        if (file_exists($source)) {
            $content = file_get_contents($source);
            if ($content === false) {
                throw new Exception("Cannot read file: {$source}");
            }
        } else {
            $content = $source;
        }

        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($content);

        if ($xml === false) {
            $errors = libxml_get_errors();
            libxml_clear_errors();
            $msg = 'XML parse error: ';
            foreach ($errors as $err) {
                $msg .= "[Line {$err->line}: {$err->message}] ";
            }
            throw new Exception($msg);
        }

        return $xml;
    }

    /**
     * Import a single <issue> element.
     */
    protected function importIssue(Journal $journal, \SimpleXMLElement $issueNode, array $options): void
    {
        // Use children() with namespace URI instead of XPath for direct descendants
        $ch = $this->children($issueNode);
        $ident = $ch->issue_identification ?? null;

        $volume = $this->childText($ident, 'volume');
        $number = $this->childText($ident, 'number');
        $year = $this->childText($ident, 'year');
        $issueTitle = $this->childText($ident, 'title');
        $datePublished = $this->childText($ch, 'date_published');
        $description = $this->childText($ch, 'description');

        if (empty($volume) && empty($number)) {
            $this->stats['skipped']++;
            $this->stats['errors'][] = 'Skipping issue with no volume/number.';

            return;
        }

        // Find or create the issue
        $issueData = [
            'journal_id' => $journal->id,
            'user_id' => $this->getOrCreateImporterUser($journal)->id,
            'issue_title' => $issueTitle ?: "Volume {$volume}, Issue {$number}",
            'volume_number' => $volume ? (int) $volume : null,
            'issue_number' => $number ?: null,
            'description' => $description,
            'publication_date' => $datePublished ? Carbon::parse($datePublished) : null,
            'status' => Issue::STATUS_PUBLISHED,
        ];

        $slug = Str::slug("v{$volume}-i{$number}");
        $issueData['slug'] = $slug;

        $issue = Issue::firstOrNew(
            ['journal_id' => $journal->id, 'slug' => $slug],
            $issueData,
        );

        if (! $issue->exists) {
            $issue->save();
            $this->stats['issues']++;
        }

        // Process articles
        $articlesNode = $ch->articles ?? null;

        if ($articlesNode) {
            foreach ($articlesNode->children($this->nsUri) as $articleNode) {
                if ($articleNode->getName() !== 'article') {
                    continue;
                }
                try {
                    // Register namespace for XPath usage within article
                    if ($this->nsUri) {
                        $articleNode->registerXPathNamespace('ns', $this->nsUri);
                    }
                    $this->importArticle($journal, $issue, $articleNode, $options);
                } catch (Exception $e) {
                    $this->stats['errors'][] = 'Article import error: '.$e->getMessage();
                }
            }
        }
    }

    /**
     * Import a single <article> element.
     */
    protected function importArticle(Journal $journal, Issue $issue, \SimpleXMLElement $articleNode, array $options): void
    {
        $ch = $this->children($articleNode);

        // Extract DOIs from <id type="doi">
        $doi = null;
        foreach ($ch->id ?? [] as $idNode) {
            if ((string) $idNode->attributes()->type === 'doi') {
                $doi = trim((string) $idNode);
                break;
            }
        }

        // Skip if DOI already exists
        if ($doi && ($options['skip_existing_dois'] ?? true)) {
            $existing = Manuscript::where('doi', $doi)->first();
            if ($existing) {
                $this->stats['skipped']++;

                return;
            }
        }

        $locale = (string) $articleNode->attributes()->locale ?: 'en_US';

        $title = $this->localeText($ch, 'title', $locale);
        $abstract = $this->localeText($ch, 'abstract', $locale);
        $pages = trim((string) ($ch->pages ?? ''));

        $datePublishedStr = (string) $articleNode->attributes()->date_published;
        $datePublished = $datePublishedStr ? Carbon::parse($datePublishedStr) : null;

        // Keywords
        $keywords = [];
        $keywordsNode = $ch->keywords ?? null;
        if ($keywordsNode) {
            foreach ($keywordsNode->children($this->nsUri) as $kw) {
                if ($kw->getName() === 'keyword') {
                    $keywords[] = trim((string) $kw);
                }
            }
        }

        // Section / category
        $sectionRef = (string) $articleNode->attributes()->section_ref;
        $category = $this->sectionMap[strtolower($sectionRef)] ?? 'Research Article';

        $manuscript = Manuscript::create([
            'journal_id' => $journal->id,
            'issue_id' => $issue->id,
            'user_id' => $this->getOrCreateImporterUser($journal)->id,
            'title' => $title ?: 'Untitled Article',
            'abstract' => $abstract ?: '',
            'keywords' => implode(', ', $keywords),
            'authors' => '',
            'status' => ManuscriptStatus::PUBLISHED,
            'doi' => $doi,
            'volume' => $issue->volume_number,
            'issue' => $issue->issue_number,
            'page_range' => $pages,
            'publication_date' => $datePublished,
            'category' => $category,
        ]);

        $this->stats['articles']++;

        // Import authors
        $authorsNode = $ch->authors ?? null;
        if ($authorsNode) {
            $authorNames = [];
            foreach ($authorsNode->children($this->nsUri) as $authorNode) {
                if ($authorNode->getName() !== 'author') {
                    continue;
                }
                $ach = $this->children($authorNode);
                $firstname = $this->localeText($ach, 'firstname', $locale) ?: 'Unknown';
                $lastname = $this->localeText($ach, 'lastname', $locale) ?: 'Author';
                $authorNames[] = trim("{$firstname} {$lastname}");
            }
            if (! empty($authorNames)) {
                $manuscript->update(['authors' => implode(', ', $authorNames)]);
                $this->stats['authors'] += count($authorNames);
            }
        }
    }

    /**
     * Get or create the system user to own imported manuscripts.
     */
    protected function getOrCreateImporterUser(Journal $journal): User
    {
        $user = User::where('email', 'ojs-import@saliksikhub.local')->first();
        if ($user) {
            return $user;
        }

        $user = User::create([
            'firstname' => 'OJS',
            'lastname' => 'Import',
            'email' => 'ojs-import@saliksikhub.local',
            'password' => bcrypt(Str::random(40)),
            'role' => 'author',
        ]);

        return $user;
    }

    // ──────────────── XML helpers ────────────────

    /**
     * Get children in the default OJS namespace.
     */
    protected function children(\SimpleXMLElement $parent): \SimpleXMLElement
    {
        return $this->nsUri ? $parent->children($this->nsUri) : $parent->children();
    }

    /**
     * Get text of a single child element by name.
     */
    protected function childText(?\SimpleXMLElement $parent, string $name): string
    {
        if ($parent === null) {
            return '';
        }

        $child = $parent->$name;

        return $child ? trim((string) $child) : '';
    }

    /**
     * Get text of a locale-specific child element.
     * Falls back to the first child if no locale match.
     */
    protected function localeText(\SimpleXMLElement $parent, string $name, string $locale): string
    {
        $children = $parent->$name;

        if (! $children || ! $children->count()) {
            return '';
        }

        // Try to find element matching the requested locale
        foreach ($children as $child) {
            if ((string) $child->attributes()->locale === $locale) {
                return trim((string) $child);
            }
        }

        // Fall back to first element
        foreach ($children as $child) {
            return trim((string) $child);
        }

        return '';
    }
}
