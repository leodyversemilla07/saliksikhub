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
        'authors',
        'abstract',
        'keywords',
        'manuscript_path',
        'user_id', // Add user_id to fillable
        'status',
    ];

    // Define the relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
