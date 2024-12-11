<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

/**
 * Class Manuscript
 *
 * This class represents a manuscript and defines its relationships with other models.
 *
 * Relationships:
 * - author: A manuscript belongs to a user who is the author.
 * - editor: A manuscript belongs to a user who is the editor.
 * - reviewerAssignments: A manuscript has many reviewer assignments.
 * - reviews: A manuscript has many reviews through reviewer assignments.
 * - decisions: A manuscript has many manuscript decisions.
 */
class Manuscript extends Model
{
    use HasFactory;

    /**
     * Constants representing the possible statuses of a manuscript.
     *
     * @var array<string, string> An associative array where the keys are status codes and the values are human-readable status descriptions.
     */
    public const STATUSES = [
        'SUBMITTED' => 'Submitted',
        'UNDER_REVIEW' => 'Under Review',
        'REVISION_REQUIRED' => 'Revision Required',
        'ACCEPTED' => 'Accepted',
        'REJECTED' => 'Rejected',
        'PUBLISHED' => 'Published'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     * 
     * - title: The title of the manuscript.
     * - user_id: The ID of the user who submitted the manuscript.
     * - authors: The list of authors of the manuscript.
     * - status: The current status of the manuscript.
     * - abstract: The abstract of the manuscript.
     * - keywords: The keywords associated with the manuscript.
     * - manuscript_path: The file path to the manuscript document.
     * - editor_id: The ID of the editor assigned to the manuscript.
     * - decision_date: The date of the latest decision made on the manuscript.
     * - decision_comments: The comments associated with the latest decision.
     */
    protected $fillable = [
        'abstract',
        'authors',
        'decision_comments',
        'decision_date',
        'editor_id',
        'keywords',
        'manuscript_path',
        'status',
        'title',
        'user_id'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string> An associative array where the keys are attribute names and the values are the types to cast to.
     */
    protected $casts = [
        'keywords' => 'array',
        'authors' => 'array'
    ];

    /**
     * Class Manuscript
     *
     * This class represents a manuscript and defines its relationships with other models.
     *
     * Relationships:
     * - author: A manuscript belongs to a user who is the author.
     * - editor: A manuscript belongs to a user who is the editor.
     * - reviewerAssignments: A manuscript has many reviewer assignments.
     * - reviews: A manuscript has many reviews through reviewer assignments.
     * - decisions: A manuscript has many manuscript decisions.
     */
    /**
     * Relationships
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    public function reviewerAssignments()
    {
        return $this->hasMany(ReviewerAssignment::class);
    }

    public function reviews()
    {
        return $this->hasManyThrough(Review::class, ReviewerAssignment::class);
    }

    public function decisions()
    {
        return $this->hasMany(ManuscriptDecision::class);
    }

    /**
     * Status related methods
     */
    public function updateStatus(string $status): bool
    {
        if (in_array($status, array_keys(self::STATUSES), true)) {
            return DB::transaction(function () use ($status) {
                return $this->update(['status' => $status]);
            });
        }
        return false;
    }

    public function isUnderReview(): bool
    {
        return $this->status === array_search('Under Review', self::STATUSES);
    }

    /**
     * Decision related methods
     */
    public function latestDecision()
    {
        return $this->decisions()->latest('decided_at')->first();
    }

    public function aiReview()
    {
        return $this->hasOne(AiReview::class, 'manuscript_id', 'id');
    }
}
