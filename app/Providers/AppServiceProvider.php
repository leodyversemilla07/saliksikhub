<?php

namespace App\Providers;

use App\Core\Plugin\Hook;
use App\Models\Issue;
use App\Models\Manuscript;
use App\Models\Publication;
use App\Observers\ManuscriptObserver;
use App\Observers\PublicationObserver;
use App\Policies\Submission\ManuscriptPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Manuscript::class => ManuscriptPolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Manuscript::observe(ManuscriptObserver::class);
        Publication::observe(PublicationObserver::class);

        // Register policies
        Gate::policy(Manuscript::class, ManuscriptPolicy::class);

        // Register sidebar widget types
        Hook::addFilter('sidebar.widget_types', function (array $types) {
            $types['year_navigation'] = [
                'name' => 'Year Navigation',
                'description' => 'Displays published years and volumes for browsing the archives',
                'icon' => 'Calendar',
            ];
            $types['issue_highlights'] = [
                'name' => 'Issue Highlights',
                'description' => 'Shows featured published issues with cover images',
                'icon' => 'BookOpen',
            ];

            return $types;
        });

        // Populate year_navigation widget data
        Hook::addFilter('sidebar.widget_data', function (array $widget, ?int $journalId) {
            if ($widget['type'] !== 'year_navigation') {
                return $widget;
            }

            $issues = Issue::selectRaw(
                'YEAR(publication_date) as year, volume_number, COUNT(*) as issue_count'
            )
                ->where('status', 'published')
                ->groupBy('year', 'volume_number')
                ->orderBy('year', 'desc')
                ->orderBy('volume_number', 'desc')
                ->get();

            $years = [];
            foreach ($issues as $row) {
                $year = (int) $row->year;
                if (! isset($years[$year])) {
                    $years[$year] = ['year' => $year, 'volumes' => []];
                }
                $years[$year]['volumes'][] = [
                    'volume' => $row->volume_number,
                    'issue_count' => $row->issue_count,
                ];
            }

            $widget['settings']['years'] = array_values($years);

            return $widget;
        }, 10, 2);

        // Populate issue_highlights widget data
        Hook::addFilter('sidebar.widget_data', function (array $widget, ?int $journalId) {
            if ($widget['type'] !== 'issue_highlights') {
                return $widget;
            }

            $query = Issue::withCount('manuscripts')
                ->where('status', 'published');

            if ($journalId) {
                $query->where('journal_id', $journalId);
            }

            $highlights = $query->latest('publication_date')
                ->take(4)
                ->get();

            $widget['settings']['issues'] = $highlights->map(function ($issue) {
                return [
                    'id' => $issue->id,
                    'slug' => $issue->slug,
                    'volume' => $issue->volume_number,
                    'number' => $issue->issue_number,
                    'title' => $issue->issue_title,
                    'publication_date' => $issue->publication_date?->toDateString(),
                    'manuscripts_count' => $issue->manuscripts_count,
                ];
            })->toArray();

            return $widget;
        }, 10, 2);
    }
}
