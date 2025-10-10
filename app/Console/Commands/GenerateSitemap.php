<?php

namespace App\Console\Commands;

use App\ManuscriptStatus;
use App\Models\Issue;
use App\Models\Manuscript;
use Illuminate\Console\Command;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate 
                            {--output=sitemap.xml : Output filename}
                            {--format=xml : Output format (xml, txt)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate XML sitemap with slug-based URLs for published content';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $format = $this->option('format');
        $filename = $this->option('output');

        $this->info('🗺️  Generating sitemap...');

        if ($format === 'xml') {
            $content = $this->generateXmlSitemap();
        } else {
            $content = $this->generateTextSitemap();
            $filename = str_replace('.xml', '.txt', $filename);
        }

        // Save to public directory
        $path = public_path($filename);
        file_put_contents($path, $content);

        $this->info("✅ Sitemap generated: {$filename}");
        $this->info("📍 Location: {$path}");

        // Show statistics
        $manuscriptCount = Manuscript::where('status', ManuscriptStatus::PUBLISHED)
            ->whereNotNull('slug')
            ->count();

        $issueCount = Issue::where('status', Issue::STATUS_PUBLISHED)
            ->whereNotNull('slug')
            ->count();

        $this->info('📊 Included:');
        $this->line("   • {$manuscriptCount} published manuscripts");
        $this->line("   • {$issueCount} published issues");
        $this->line('   • Static pages');

        return 0;
    }

    /**
     * Generate XML sitemap content.
     */
    private function generateXmlSitemap(): string
    {
        $urls = $this->gatherUrls();

        $xml = new \DOMDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;

        $urlset = $xml->createElement('urlset');
        $urlset->setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        $xml->appendChild($urlset);

        foreach ($urls as $urlData) {
            $url = $xml->createElement('url');

            $loc = $xml->createElement('loc', htmlspecialchars($urlData['loc']));
            $url->appendChild($loc);

            if (isset($urlData['lastmod'])) {
                $lastmod = $xml->createElement('lastmod', $urlData['lastmod']);
                $url->appendChild($lastmod);
            }

            if (isset($urlData['changefreq'])) {
                $changefreq = $xml->createElement('changefreq', $urlData['changefreq']);
                $url->appendChild($changefreq);
            }

            if (isset($urlData['priority'])) {
                $priority = $xml->createElement('priority', $urlData['priority']);
                $url->appendChild($priority);
            }

            $urlset->appendChild($url);
        }

        return $xml->saveXML();
    }

    /**
     * Generate text sitemap content.
     */
    private function generateTextSitemap(): string
    {
        $urls = $this->gatherUrls();

        $content = '# Sitemap for '.config('app.name')."\n";
        $content .= '# Generated on '.now()->toDateTimeString()."\n\n";

        foreach ($urls as $urlData) {
            $content .= $urlData['loc']."\n";
        }

        return $content;
    }

    /**
     * Gather all URLs for the sitemap.
     */
    private function gatherUrls(): array
    {
        $urls = [];
        $baseUrl = config('app.url');

        // Static pages
        $staticPages = [
            ['url' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => '/current', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['url' => '/submissions', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/archives', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => '/editorial-board', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/about/journal', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/about/aims-scope', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/contact', 'priority' => '0.6', 'changefreq' => 'monthly'],
        ];

        foreach ($staticPages as $page) {
            $urls[] = [
                'loc' => $baseUrl.$page['url'],
                'changefreq' => $page['changefreq'],
                'priority' => $page['priority'],
            ];
        }

        // Published manuscripts
        Manuscript::where('status', ManuscriptStatus::PUBLISHED)
            ->whereNotNull('slug')
            ->with('user')
            ->chunk(100, function ($manuscripts) use (&$urls, $baseUrl) {
                foreach ($manuscripts as $manuscript) {
                    $urls[] = [
                        'loc' => $baseUrl.'/manuscripts/'.$manuscript->slug,
                        'lastmod' => $manuscript->published_at
                            ? $manuscript->published_at->toAtomString()
                            : $manuscript->updated_at->toAtomString(),
                        'changefreq' => 'monthly',
                        'priority' => '0.8',
                    ];
                }
            });

        // Published issues
        Issue::where('status', Issue::STATUS_PUBLISHED)
            ->whereNotNull('slug')
            ->chunk(100, function ($issues) use (&$urls, $baseUrl) {
                foreach ($issues as $issue) {
                    $urls[] = [
                        'loc' => $baseUrl.'/issues/'.$issue->slug,
                        'lastmod' => $issue->publication_date
                            ? $issue->publication_date->toAtomString()
                            : $issue->updated_at->toAtomString(),
                        'changefreq' => 'monthly',
                        'priority' => '0.7',
                    ];
                }
            });

        // Sort by priority (highest first)
        usort($urls, function ($a, $b) {
            $priorityA = isset($a['priority']) ? (float) $a['priority'] : 0.5;
            $priorityB = isset($b['priority']) ? (float) $b['priority'] : 0.5;

            return $priorityB <=> $priorityA;
        });

        return $urls;
    }
}
