<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Review extends Model
{
    use HasFactory;

    // Constants should stay as they define review recommendations
    const RECOMMENDATION_ACCEPT = 'accept';

    const RECOMMENDATION_MINOR_REVISION = 'minor_revision';

    const RECOMMENDATION_MAJOR_REVISION = 'major_revision';

    const RECOMMENDATION_REJECT = 'reject';

    // Define the table name (if it's different from the plural form of the model name)
    protected $table = 'reviews';

    // Mass assignable attributes
    protected $fillable = [
        'manuscript_id',
        'reviewer_id',
        'rating',
        'comments',
        'suggested_edits',
        'confidential_comments',
        'status',
        'review_date',
    ];

    // Cast attributes to specific types
    protected $casts = [
        'review_date' => 'datetime',
    ];

    /**
     * Get the manuscript that the review is for.
     */
    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Get the reviewer (user) for the review.
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Check if the review is submitted by the authenticated reviewer.
     */
    public function isSubmittedByAuthenticatedUser()
    {
        return $this->reviewer_id === Auth::id();
    }
}
