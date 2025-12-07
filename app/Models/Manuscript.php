<?php

namespace App\Models;

use App\ManuscriptStatus;
use App\Models\Concerns\BelongsToJournal;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        return \App\Models\User::role([
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
        return $query->where('status', \App\ManuscriptStatus::PUBLISHED);
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
            \App\ManuscriptStatus::SUBMITTED,
            \App\ManuscriptStatus::UNDER_REVIEW,
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
