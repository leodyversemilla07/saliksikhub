<?php

namespace App\Models;

use App\ManuscriptStatus;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;

class Manuscript extends Model
{
    use HasFactory, Sluggable, SluggableScopeHelpers;

    protected $fillable = [
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
     * Get the author of the manuscript.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
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
        return in_array($this->status, [
            ManuscriptStatus::MINOR_REVISION,
            ManuscriptStatus::MAJOR_REVISION,
        ], true);
    }

    /**
     * Get the latest editorial decision.
     */
    public function getLatestDecision(): ?EditorialDecision
    {
        return $this->editorialDecisions()->latest('decision_date')->first();
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

    /**
     * Check if the manuscript is ready for author approval.
     */
    public function isReadyForAuthorApproval(): bool
    {
        return $this->status === ManuscriptStatus::AWAITING_APPROVAL;
    }

    /**
     * Check if the manuscript is ready for publication.
     */
    public function isReadyForPublication(): bool
    {
        return $this->status === ManuscriptStatus::READY_TO_PUBLISH;
    }

    /**
     * Check if the manuscript is published.
     */
    public function isPublished(): bool
    {
        return $this->status === ManuscriptStatus::PUBLISHED;
    }
}
