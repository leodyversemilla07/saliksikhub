<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    public const ROLE_EDITOR = 'editor';

    public const ROLE_AUTHOR = 'author';

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
        'affiliation',
        'country', // Added country
        'username', // Added username
        'avatar',
        'data_collection', // Added data_collection
        'notifications', // Added notifications
        'review_requests', // Added review_requests
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'data_collection' => 'boolean', // Added cast for data_collection
        'notifications' => 'boolean', // Added cast for notifications
        'review_requests' => 'boolean', // Added cast for review_requests
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'avatar_url',
        'name',
    ];

    /**
     * Check if user has the given role.
     *
     * @param  string|array  $roles
     */
    public function hasRole($roles): bool
    {
        if (is_array($roles)) {
            return in_array($this->role, $roles);
        }

        return $this->role === $roles;
    }

    /**
     * Set the user's role.
     *
     * @return $this
     */
    public function assignRole(string $role)
    {
        $this->role = $role;
        $this->save();

        return $this;
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->firstname} {$this->lastname}";
    }

    /**
     * Get the user's name (alias for full_name for frontend compatibility).
     */
    public function getNameAttribute(): string
    {
        return $this->getFullNameAttribute();
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar) {
            return null;
        }

        // Use Storage::url() to generate the proper URL for the public disk
        $url = Storage::disk('public')->url('avatars/'.$this->avatar);

        // For development environment, ensure we use HTTP instead of HTTPS to avoid certificate errors
        if (app()->environment('local') && str_starts_with($url, 'https://localhost')) {
            $url = str_replace('https://localhost', 'http://localhost', $url);
        }

        return $url;
    }

    /**
     * Delete the user's avatar file from storage.
     */
    public function deleteAvatar(): bool
    {
        if (! $this->avatar) {
            return true;
        }

        $deleted = Storage::disk('public')->delete('avatars/'.$this->avatar);

        if ($deleted) {
            $this->avatar = null;
            $this->save();
        }

        return $deleted;
    }

    public function isEditor(): bool
    {
        return $this->role === self::ROLE_EDITOR;
    }

    public function isAuthor(): bool
    {
        return $this->role === self::ROLE_AUTHOR;
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
