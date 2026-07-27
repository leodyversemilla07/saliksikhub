<?php

namespace App\Models;

use App\Enums\ManuscriptStatus;
use App\Models\Concerns\BelongsToJournal;
use Carbon\Carbon;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Arr;

class Manuscript extends Model
{
    use BelongsToJournal, HasFactory, Sluggable, SluggableScopeHelpers;

    protected $fillable = [
        'journal_id',
        'user_id',
        'issue_id',
        'title',
        'authors',
        'abstract',
        'keywords',
        'category',
        'manuscript_path',
        'status',
        'revision_history',
        'revision_comments',
        'revised_at',
        'editor_id',
        'decision_date',
        'publication_date',
        'doi',
        'volume',
        'issue',
        'page_range',
        'final_pdf_path',
        'author_approval_date',
        'published_at',
        'plagiarism_score',
        'grammar_score',
        'scope_assessment',
        'initial_screening_notes',
    ];

    protected $casts = [
        'revision_history' => 'array',
        'revised_at' => 'datetime',
        'decision_date' => 'datetime',
        'publication_date' => 'date',
        'author_approval_date' => 'date',
        'final_manuscript_uploaded_at' => 'datetime',
        'published_at' => 'datetime',
        'status' => ManuscriptStatus::class,
        'plagiarism_score' => 'decimal:2',
        'grammar_score' => 'decimal:2',
    ];

    /**
     * Return the sluggable configuration array for this model.
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'maxLength' => 100,
                'maxLengthKeepWords' => true,
                'onUpdate' => false, // Don't regenerate slug on update to preserve URLs
            ],
        ];
    }

    /**
     * Get the primary author of the manuscript.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all co-authors of the manuscript.
     */
    public function coAuthors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'manuscript_authors', 'manuscript_id', 'user_id')
            ->withPivot(['author_order', 'is_corresponding', 'contribution_role'])
            ->withTimestamps()
            ->orderBy('author_order');
    }

    /**
     * Get all manuscript authors (pivot records).
     */
    public function manuscriptAuthors(): HasMany
    {
        return $this->hasMany(ManuscriptAuthor::class)->orderBy('author_order');
    }

    /**
     * Get the corresponding author.
     */
    public function correspondingAuthor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all files associated with the manuscript.
     */
    public function files(): HasMany
    {
        return $this->hasMany(ManuscriptFile::class);
    }

    /**
     * Get all reviews for this manuscript.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get all revisions of this manuscript.
     */
    public function revisions(): HasMany
    {
        return $this->hasMany(ManuscriptRevision::class, 'manuscript_id');
    }

    /**
     * Get the editor assigned to the manuscript.
     */
    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    /**
     * Get all editorial decisions for this manuscript.
     */
    public function editorialDecisions(): HasMany
    {
        return $this->hasMany(EditorialDecision::class);
    }

    /**
     * Get the copyright agreement for this manuscript.
     */
    public function copyrightAgreement(): HasOne
    {
        return $this->hasOne(CopyrightAgreement::class);
    }

    /**
     * Get all proof corrections for this manuscript.
     */
    public function proofCorrections(): HasMany
    {
        return $this->hasMany(ProofCorrection::class);
    }

    /**
     * Get all indexing records for this manuscript.
     */
    public function indexingRecords(): HasMany
    {
        return $this->hasMany(ManuscriptIndexing::class);
    }

    /**
     * Get all publications (versions) of this manuscript.
     */
    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class)->orderByDesc('version_major')->orderByDesc('version_minor');
    }

    /**
     * Get the current published version.
     */
    public function currentPublication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'current_publication_id');
    }

    /**
     * Get the latest publication.
     */
    public function latestPublication()
    {
        return $this->publications()->latest('created_at')->first();
    }

    /**
     * Get all payments for this manuscript.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get all statistics for this manuscript.
     */
    public function statistics(): HasMany
    {
        return $this->hasMany(ManuscriptStatistic::class);
    }

    /**
     * Get the copyeditor assigned to this manuscript.
     */
    public function copyeditor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'copyeditor_id');
    }

    /**
     * Get the layout editor assigned to this manuscript.
     */
    public function layoutEditor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'layout_editor_id');
    }

    /**
     * Get the issue this manuscript is assigned to.
     */
    public function issue(): BelongsTo
    {
        return $this->belongsTo(Issue::class);
    }

    /**
     * Check if the manuscript requires a revision.
     */
    public function needsRevision(): bool
    {
        return $this->status?->requiresRevision() ?? false;
    }

    /**
     * Check if manuscript is in review process.
     */
    public function isInReview(): bool
    {
        return $this->status?->isInReview() ?? false;
    }

    /**
     * Check if manuscript is in production.
     */
    public function isInProduction(): bool
    {
        return $this->status?->isInProduction() ?? false;
    }

    /**
     * Check if manuscript can be edited by author.
     */
    public function canBeEditedByAuthor(): bool
    {
        return $this->status?->canBeEditedByAuthor() ?? false;
    }

    /**
     * Determine if the manuscript passes initial screening.
     * A manuscript passes if plagiarism is low (<=30%) and grammar is acceptable (>=60%).
     */
    public function passesInitialScreening(): bool
    {
        return $this->plagiarism_score !== null
            && $this->grammar_score !== null
            && $this->plagiarism_score <= 30
            && $this->grammar_score >= 60;
    }

    /**
     * Get the latest editorial decision.
     */
    public function getLatestDecision(): ?EditorialDecision
    {
        return $this->editorialDecisions()->latest('decision_date')->first();
    }

    /**
     * Get active reviews for current round.
     */
    public function activeReviews(): HasMany
    {
        return $this->reviews()->where('status', '!=', 'completed')
            ->where('status', '!=', 'declined');
    }

    /**
     * Get completed reviews.
     */
    public function completedReviews(): HasMany
    {
        return $this->reviews()->where('status', 'completed');
    }

    /**
     * Get main document file.
     */
    public function mainDocument()
    {
        return $this->files()->where('file_type', 'main_document')
            ->latest()
            ->first();
    }

    /**
     * Get cover letter file.
     */
    public function coverLetter()
    {
        return $this->files()->where('file_type', 'cover_letter')
            ->latest()
            ->first();
    }

    /**
     * Get the previous version of the manuscript.
     */
    public function getPreviousVersion()
    {
        if (empty($this->revision_history)) {
            return null;
        }

        $versions = $this->revision_history;

        // Use Arr::last to avoid mutating the array pointer
        return Arr::last($versions);
    }

    /**
     * Get revision count.
     */
    public function getRevisionCount(): int
    {
        return is_array($this->revision_history) ? count($this->revision_history) : 0;
    }

    /**
     * Get the editor for the manuscript.
     */
    public function getEditor()
    {
        if ($this->editor_id) {
            return $this->editor;
        }

        // If no specific editor is assigned, return the first user with an editor role
        // Use Spatie role scopes to find any editor-like user seeded by RolesAndPermissionsSeeder
        return User::role([
            'managing_editor',
            'editor_in_chief',
            'associate_editor',
            'language_editor',
        ])->first();
    }

    /*
     * Common query scopes for manuscripts
     */
    public function scopePublished($query)
    {
        return $query->where('status', ManuscriptStatus::PUBLISHED);
    }

    public function scopeByAuthor($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeAssignedToEditor($query, $editorId)
    {
        return $query->where('editor_id', $editorId);
    }

    public function scopePendingReview($query)
    {
        return $query->whereIn('status', [
            ManuscriptStatus::SUBMITTED,
            ManuscriptStatus::UNDER_REVIEW,
        ]);
    }

    public function scopeSearch($query, $searchTerm)
    {
        if (! $searchTerm) {
            return $query;
        }

        return $query->where(function ($q) use ($searchTerm) {
            $q->where('title', 'like', "%{$searchTerm}%")
                ->orWhere('authors', 'like', "%{$searchTerm}%")
                ->orWhere('keywords', 'like', "%{$searchTerm}%")
                ->orWhere('abstract', 'like', "%{$searchTerm}%");
        });
    }

    /**
     * Apply facet filters to a manuscript query.
     */
    public function scopeApplyFilters($query, array $filters)
    {
        return $query->when($filters['year_from'] ?? null, function ($q, $year) {
            $q->whereYear('publication_date', '>=', $year);
        })
            ->when($filters['year_to'] ?? null, function ($q, $year) {
                $q->whereYear('publication_date', '<=', $year);
            })
            ->when($filters['author'] ?? null, function ($q, $author) {
                $q->where('authors', 'like', "%{$author}%");
            })
            ->when($filters['keyword'] ?? null, function ($q, $keyword) {
                $q->where('keywords', 'like', "%{$keyword}%");
            })
            ->when($filters['volume'] ?? null, function ($q, $volume) {
                $q->where('volume', $volume);
            })
            ->when($filters['category'] ?? null, function ($q, $category) {
                $q->where('category', $category);
            });
    }

    /**
     * Apply sorting to a manuscript query.
     */
    public function scopeApplySorting($query, string $sort, string $order)
    {
        return match ($sort) {
            'title' => $query->orderBy('title', $order === 'asc' ? 'asc' : 'desc'),
            'authors' => $query->orderBy('authors', $order === 'asc' ? 'asc' : 'desc'),
            'date' => $query->orderBy('publication_date', $order === 'asc' ? 'asc' : 'desc'),
            default => $query->latest('published_at'),
        };
    }

    /**
     * Get facet counts for published manuscripts.
     *
     * Returns available years, volumes, categories, keywords, and authors
     * with their respective counts for the faceted search UI.
     *
     * @return array<string, mixed>
     */
    public static function getFacets(): array
    {
        $published = self::where('status', ManuscriptStatus::PUBLISHED);

        // Years — fetch dates and group in PHP for DB-agnostic compatibility
        $allDates = (clone $published)
            ->whereNotNull('publication_date')
            ->pluck('publication_date');

        $yearCounts = [];
        foreach ($allDates as $date) {
            $year = $date instanceof Carbon ? $date->year : date('Y', strtotime($date));
            if (! isset($yearCounts[$year])) {
                $yearCounts[$year] = 0;
            }
            $yearCounts[$year]++;
        }
        krsort($yearCounts);
        $years = [];
        foreach ($yearCounts as $year => $count) {
            $years[] = ['value' => $year, 'count' => $count];
        }

        // Volumes
        $volumes = (clone $published)
            ->selectRaw('volume as value, COUNT(*) as count')
            ->whereNotNull('volume')
            ->where('volume', '!=', '')
            ->groupBy('value')
            ->orderBy('value', 'desc')
            ->pluck('count', 'value')
            ->map(fn ($count, $vol) => ['value' => (int) $vol, 'count' => $count])
            ->values()
            ->toArray();

        // Categories
        $categories = (clone $published)
            ->selectRaw('category as value, COUNT(*) as count')
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->groupBy('value')
            ->orderBy('count', 'desc')
            ->pluck('count', 'value')
            ->map(fn ($count, $cat) => ['value' => $cat, 'count' => $count])
            ->values()
            ->toArray();

        // Keywords (top 30)
        $allKeywords = (clone $published)
            ->whereNotNull('keywords')
            ->where('keywords', '!=', '')
            ->pluck('keywords');

        $keywordCounts = [];
        foreach ($allKeywords as $kwString) {
            $parts = explode(',', $kwString);
            foreach ($parts as $kw) {
                $kw = trim($kw);
                if ($kw !== '') {
                    $key = mb_strtolower($kw);
                    if (! isset($keywordCounts[$key])) {
                        $keywordCounts[$key] = ['value' => $kw, 'count' => 0];
                    }
                    $keywordCounts[$key]['count']++;
                }
            }
        }
        usort($keywordCounts, fn ($a, $b) => $b['count'] <=> $a['count']);
        $keywords = array_slice($keywordCounts, 0, 30);

        // Authors (top 20 unique author names)
        $allAuthors = (clone $published)
            ->whereNotNull('authors')
            ->where('authors', '!=', '')
            ->pluck('authors');

        $authorCounts = [];
        foreach ($allAuthors as $authString) {
            // authors could be a JSON array string or comma-separated
            $decoded = json_decode($authString, true);
            $parts = (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) ? $decoded : explode(',', $authString);
            foreach ($parts as $name) {
                $name = trim($name);
                if ($name !== '') {
                    $key = mb_strtolower($name);
                    if (! isset($authorCounts[$key])) {
                        $authorCounts[$key] = ['value' => $name, 'count' => 0];
                    }
                    $authorCounts[$key]['count']++;
                }
            }
        }
        usort($authorCounts, fn ($a, $b) => $b['count'] <=> $a['count']);
        $authors = array_slice($authorCounts, 0, 20);

        return [
            'years' => $years,
            'volumes' => array_values($volumes),
            'categories' => array_values($categories),
            'keywords' => array_values($keywords),
            'authors' => array_values($authors),
        ];
    }

    /**
     * Check if the manuscript is ready for author approval.
     */
    public function isReadyForAuthorApproval(): bool
    {
        return $this->status === ManuscriptStatus::AWAITING_AUTHOR_APPROVAL;
    }

    /**
     * Check if the manuscript is ready for publication.
     */
    public function isReadyForPublication(): bool
    {
        return $this->status === ManuscriptStatus::READY_FOR_PUBLICATION;
    }

    /**
     * Check if the manuscript is published.
     */
    public function isPublished(): bool
    {
        return $this->status === ManuscriptStatus::PUBLISHED ||
               $this->status === ManuscriptStatus::PUBLISHED_ONLINE_FIRST;
    }

    /**
     * Get progress percentage (0-100).
     */
    public function getProgressPercentage(): int
    {
        return $this->status?->progressPercentage() ?? 0;
    }

    /**
     * Get workflow stage name.
     */
    public function getWorkflowStage(): string
    {
        return $this->status?->workflowStage() ?? 'unknown';
    }

    /**
     * Get all possible next statuses.
     */
    public function getPossibleNextStatuses(): array
    {
        return $this->status?->possibleNextStatuses() ?? [];
    }
}
