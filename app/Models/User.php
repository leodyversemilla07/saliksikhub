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
}
