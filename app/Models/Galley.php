<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Galley extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'publication_id',
        'label',
        'locale',
        'file_path',
        'mime_type',
        'file_size',
        'original_filename',
        'remote_url',
        'is_approved',
        'sequence',
        'download_count',
        'last_downloaded_at',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'is_approved' => 'boolean',
        'sequence' => 'integer',
        'download_count' => 'integer',
        'last_downloaded_at' => 'datetime',
    ];

    /**
     * Get the publication that owns this galley.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class);
    }

    /**
     * Get the DOI for this galley (polymorphic, optional).
     */
    public function doi(): MorphOne
    {
        return $this->morphOne(DOI::class, 'doiable');
    }

    /**
     * Get the download URL for this galley.
     */
    public function getDownloadUrlAttribute(): string
    {
        if ($this->remote_url) {
            return $this->remote_url;
        }
        
        return route('galleys.download', $this->id);
    }

    /**
     * Get the file URL from storage.
     */
    public function getFileUrlAttribute(): string
    {
        if ($this->remote_url) {
            return $this->remote_url;
        }
        
        return Storage::url($this->file_path);
    }

    /**
     * Get the file contents.
     */
    public function getFileContents(): string
    {
        return Storage::get($this->file_path);
    }

    /**
     * Check if file exists.
     */
    public function fileExists(): bool
    {
        if ($this->remote_url) {
            return true; // Assume remote URLs are valid
        }
        
        return Storage::exists($this->file_path);
    }

    /**
     * Increment download count.
     */
    public function incrementDownloadCount(): void
    {
        $this->increment('download_count');
        $this->update(['last_downloaded_at' => now()]);
    }

    /**
     * Get human-readable file size.
     */
    public function getFormattedFileSizeAttribute(): string
    {
        if (!$this->file_size) {
            return 'Unknown';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $size = $this->file_size;
        $unit = 0;

        while ($size >= 1024 && $unit < count($units) - 1) {
            $size /= 1024;
            $unit++;
        }

        return round($size, 2) . ' ' . $units[$unit];
    }

    /**
     * Check if this is a PDF galley.
     */
    public function isPdf(): bool
    {
        return $this->mime_type === 'application/pdf';
    }

    /**
     * Check if this is an HTML galley.
     */
    public function isHtml(): bool
    {
        return $this->mime_type === 'text/html';
    }

    /**
     * Check if this is an ePub galley.
     */
    public function isEpub(): bool
    {
        return $this->mime_type === 'application/epub+zip';
    }

    /**
     * Check if this is an XML galley.
     */
    public function isXml(): bool
    {
        return in_array($this->mime_type, ['application/xml', 'text/xml']);
    }

    /**
     * Scope to get only approved galleys.
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope to get galleys by label.
     */
    public function scopeByLabel($query, string $label)
    {
        return $query->where('label', $label);
    }

    /**
     * Scope to get galleys by mime type.
     */
    public function scopeByMimeType($query, string $mimeType)
    {
        return $query->where('mime_type', $mimeType);
    }

    /**
     * Get format icon name based on mime type.
     */
    public function getFormatIconAttribute(): string
    {
        return match(true) {
            $this->isPdf() => 'file-pdf',
            $this->isHtml() => 'file-code',
            $this->isEpub() => 'book',
            $this->isXml() => 'file-xml',
            default => 'file',
        };
    }
}
