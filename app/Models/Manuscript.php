<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Manuscript extends Model
{
    use HasFactory;

    public const STATUSES = [
        'SUBMITTED' => 'Submitted',
        'UNDER_REVIEW' => 'Under Review',
        'MINOR_REVISION' => 'Minor Revision',
        'MAJOR_REVISION' => 'Major Revision',
        'ACCEPTED' => 'Accepted',
        'IN_COPYEDITING' => 'Copyediting',
        'AWAITING_APPROVAL' => 'Awaiting Approval',
        'READY_TO_PUBLISH' => 'Ready to Publish',
        'REJECTED' => 'Rejected',
        'PUBLISHED' => 'Published',
    ];

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
    ];

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
            self::STATUSES['MINOR_REVISION'],
            self::STATUSES['MAJOR_REVISION'],
        ]);
    }

    /**
     * Get the latest editorial decision.
     */
    public function getLatestDecision()
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

        return end($versions);
    }

    /**
     * Get revision count.
     */
    public function getRevisionCount(): int
    {
        return $this->revision_history ? count($this->revision_history) : 0;
    }

    /**
     * Get the editor for the manuscript.
     */
    public function getEditor()
    {
        if ($this->editor_id) {
            return $this->editor;
        }

        // If no specific editor is assigned, return the first editor
        return User::where('role', 'editor')->first();
    }

    /**
     * Check if the manuscript is ready for author approval.
     */
    public function isReadyForAuthorApproval(): bool
    {
        return $this->status === self::STATUSES['AWAITING_APPROVAL'];
    }

    /**
     * Check if the manuscript is ready for publication.
     */
    public function isReadyForPublication(): bool
    {
        return $this->status === self::STATUSES['READY_TO_PUBLISH'];
    }

    /**
     * Check if the manuscript is published.
     */
    public function isPublished(): bool
    {
        return $this->status === self::STATUSES['PUBLISHED'];
    }

    /**
     * Get the user (author) of the manuscript (alias for author relationship).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
