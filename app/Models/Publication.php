<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Publication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'manuscript_id',
        'version_major',
        'version_minor',
        'version_stage',
        'status',
        'access_status',
        'embargo_date',
        'title',
        'abstract',
        'keywords',
        'language',
        'license_url',
        'copyright_holder',
        'copyright_year',
        'date_published',
        'date_submitted',
        'date_accepted',
        'pages',
        'page_start',
        'page_end',
        'url_path',
        'cover_image',
    ];

    protected $casts = [
        'keywords' => 'array',
        'embargo_date' => 'date',
        'date_published' => 'date',
        'date_submitted' => 'date',
        'date_accepted' => 'date',
        'copyright_year' => 'integer',
        'page_start' => 'integer',
        'page_end' => 'integer',
    ];

    /**
     * Get the manuscript that owns this publication.
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Get all galleys (file formats) for this publication.
     */
    public function galleys(): HasMany
    {
        return $this->hasMany(Galley::class)->orderBy('sequence');
    }

    /**
     * Get the DOI for this publication (polymorphic).
     */
    public function doi(): MorphOne
    {
        return $this->morphOne(DOI::class, 'doiable');
    }

    /**
     * Get the version string (e.g., "1.0", "2.1").
     */
    public function getVersionAttribute(): string
    {
        return "{$this->version_major}.{$this->version_minor}";
    }

    /**
     * Check if this publication is published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->date_published !== null;
    }

    /**
     * Check if this publication is under embargo.
     */
    public function isEmbargoed(): bool
    {
        return $this->access_status === 'embargo'
            && $this->embargo_date
            && $this->embargo_date->isFuture();
    }

    /**
     * Check if this publication is open access.
     */
    public function isOpenAccess(): bool
    {
        return $this->access_status === 'open'
            || ($this->access_status === 'embargo' && !$this->isEmbargoed());
    }

    /**
     * Scope to get only published publications.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('date_published');
    }

    /**
     * Scope to get only open access publications.
     */
    public function scopeOpenAccess($query)
    {
        return $query->where(function ($q) {
            $q->where('access_status', 'open')
                ->orWhere(function ($q2) {
                    $q2->where('access_status', 'embargo')
                        ->where('embargo_date', '<=', now());
                });
        });
    }

    /**
     * Get the public URL for this publication.
     */
    public function getPublicUrlAttribute(): string
    {
        if ($this->url_path) {
            return url($this->url_path);
        }
        return route('manuscripts.show', $this->manuscript->slug ?? $this->manuscript_id);
    }

    /**
     * Publish this version.
     */
    public function publish(): bool
    {
        $this->status = 'published';
        $this->date_published = now();
        $this->version_stage = 'published';
        
        return $this->save();
    }

    /**
     * Create a new version from this publication.
     */
    public function createNewVersion(bool $isMajor = false): self
    {
        $newPublication = $this->replicate();
        
        if ($isMajor) {
            $newPublication->version_major = $this->version_major + 1;
            $newPublication->version_minor = 0;
        } else {
            $newPublication->version_minor = $this->version_minor + 1;
        }
        
        $newPublication->status = 'draft';
        $newPublication->version_stage = 'preprint';
        $newPublication->date_published = null;
        $newPublication->save();
        
        return $newPublication;
    }
}
