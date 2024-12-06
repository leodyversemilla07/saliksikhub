<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Manuscript extends Model
{
    use HasFactory;

    const STATUS_SUBMITTED = 'Submitted';
    const STATUS_AI_PRE_REVIEWED = 'AI Pre-reviewed';
    const STATUS_UNDER_REVIEW = 'Under Review';
    const STATUS_REVISION_REQUIRED = 'Revision Required';
    const STATUS_ACCEPTED = 'Accepted';
    const STATUS_REJECTED = 'Rejected';
    const STATUS_PUBLISHED = 'Published';

    protected $fillable = [
        'title',
        'user_id',
        'authors',
        'status',
        'abstract',
        'keywords',
        'manuscript_path',
    ];

    // Define the relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewerAssignments()
    {
        return $this->hasMany(ReviewerAssignment::class);
    }

    public function reviewers()
    {
        return $this->belongsToMany(User::class, 'reviewer_assignments');
    }
}
