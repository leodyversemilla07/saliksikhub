<?php

namespace App\Models;

use App\FileType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ManuscriptFile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'manuscript_id',
        'file_type',
        'filename',
        'storage_path',
        'file_size',
        'mime_type',
        'uploaded_by',
        'version',
    ];

    protected $casts = [
        'file_type' => FileType::class,
        'file_size' => 'integer',
        'version' => 'integer',
    ];

    /**
     * Get the manuscript
     */
    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    /**
     * Get the user who uploaded the file
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the file URL
     */
    public function getFileUrl(): ?string
    {
        if (! $this->storage_path) {
            return null;
        }

        return Storage::disk('manuscripts')->url($this->storage_path);
    }

    /**
     * Get the download URL
     */
    public function getDownloadUrl(): string
    {
        return route('manuscripts.files.download', $this->id);
    }

    /**
     * Get formatted file size
     */
    public function getFormattedFileSize(): string
    {
        $bytes = $this->file_size;

        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2).' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2).' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2).' KB';
        } else {
            return $bytes.' bytes';
        }
    }

    /**
     * Check if the file is an image
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Check if the file is a PDF
     */
    public function isPdf(): bool
    {
        return $this->mime_type === 'application/pdf';
    }

    /**
     * Check if the file is a Word document
     */
    public function isWordDocument(): bool
    {
        return in_array($this->mime_type, [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);
    }

    /**
     * Delete the physical file from storage
     */
    public function deleteFile(): bool
    {
        if ($this->storage_path && Storage::disk('manuscripts')->exists($this->storage_path)) {
            return Storage::disk('manuscripts')->delete($this->storage_path);
        }

        return false;
    }

    /**
     * Scope: Files of a specific type
     */
    public function scopeOfType($query, FileType $type)
    {
        return $query->where('file_type', $type);
    }

    /**
     * Scope: Main documents only
     */
    public function scopeMainDocuments($query)
    {
        return $query->where('file_type', FileType::MAIN_DOCUMENT);
    }

    /**
     * Scope: Supplementary files only
     */
    public function scopeSupplementary($query)
    {
        return $query->where('file_type', FileType::SUPPLEMENTARY);
    }

    /**
     * Scope: Latest version of each file type
     */
    public function scopeLatestVersions($query)
    {
        return $query->whereIn('id', function ($subquery) {
            $subquery->selectRaw('MAX(id)')
                ->from('manuscript_files')
                ->groupBy('manuscript_id', 'file_type');
        });
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // Delete physical file when model is force deleted
        static::forceDeleted(function ($file) {
            $file->deleteFile();
        });
    }
}
