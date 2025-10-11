<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'role',
        'orcid_id',
        'affiliation',
        'country',
        'bio',
        'cv_path',
        'username',
        'avatar',
        'data_collection',
        'notifications',
        'review_requests',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
        'password' => 'hashed',
        'data_collection' => 'boolean',
        'notifications' => 'boolean',
        'review_requests' => 'boolean',
    ];

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar) {
            return null;
        }

        // Use Storage::url() to generate the proper URL for the public disk
        $url = Storage::url('avatars/'.$this->avatar);

        // For development environment, ensure we use HTTP instead of HTTPS to avoid certificate errors
        if (app()->environment('local') && str_starts_with($url, 'https://localhost')) {
            $url = str_replace('https://localhost', 'http://localhost', $url);
        }

        return $url;
    }

    public function assignedManuscripts(): HasMany
    {
        return $this->hasMany(Manuscript::class, 'editor_id');
    }

    public function authoredManuscripts(): HasMany
    {
        return $this->hasMany(Manuscript::class);
    }

    public function editorialDecisions(): HasMany
    {
        return $this->hasMany(EditorialDecision::class, 'editor_id');
    }

    /**
     * Get all manuscripts where user is a co-author.
     */
    public function coAuthoredManuscripts()
    {
        return $this->belongsToMany(Manuscript::class, 'manuscript_authors', 'user_id', 'manuscript_id')
            ->withPivot(['author_order', 'is_corresponding', 'contribution_role'])
            ->withTimestamps();
    }

    /**
     * Get all manuscript author records for this user.
     */
    public function manuscriptAuthorships(): HasMany
    {
        return $this->hasMany(ManuscriptAuthor::class, 'user_id');
    }

    /**
     * Get all reviews assigned to this user.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    /**
     * Get active reviews (not completed or declined).
     */
    public function activeReviews(): HasMany
    {
        return $this->reviews()->whereIn('status', ['invited', 'accepted', 'in_progress']);
    }

    /**
     * Get completed reviews.
     */
    public function completedReviews(): HasMany
    {
        return $this->reviews()->where('status', 'completed');
    }

    /**
     * Get uploaded files.
     */
    public function uploadedFiles(): HasMany
    {
        return $this->hasMany(ManuscriptFile::class, 'uploaded_by');
    }

    /**
     * Check if user has reviewer role.
     */
    public function isReviewer(): bool
    {
        return $this->hasRole('reviewer');
    }

    /**
     * Check if user has any editor role.
     */
    public function isEditor(): bool
    {
        return $this->hasAnyRole(['managing_editor', 'editor_in_chief', 'associate_editor', 'language_editor']);
    }

    /**
     * Check if user has author role.
     */
    public function isAuthor(): bool
    {
        return $this->hasRole('author');
    }

    /**
     * Get reviewer performance metrics.
     */
    public function getReviewerMetrics(): array
    {
        $totalReviews = $this->reviews()->count();
        $completedReviews = $this->completedReviews()->count();
        $declinedReviews = $this->reviews()->where('status', 'declined')->count();
        $activeReviews = $this->activeReviews()->count();

        $completedReviewsWithTime = $this->completedReviews()
            ->whereNotNull('review_submitted_at')
            ->whereNotNull('invitation_sent_at')
            ->get();

        $averageDays = 0;
        if ($completedReviewsWithTime->count() > 0) {
            $totalDays = $completedReviewsWithTime->sum(function ($review) {
                return $review->invitation_sent_at->diffInDays($review->review_submitted_at);
            });
            $averageDays = round($totalDays / $completedReviewsWithTime->count(), 1);
        }

        $acceptanceRate = $totalReviews > 0 ? round(($completedReviews / $totalReviews) * 100, 1) : 0;

        return [
            'total_reviews' => $totalReviews,
            'completed_reviews' => $completedReviews,
            'declined_reviews' => $declinedReviews,
            'active_reviews' => $activeReviews,
            'average_review_time_days' => $averageDays,
            'acceptance_rate' => $acceptanceRate,
        ];
    }
}
