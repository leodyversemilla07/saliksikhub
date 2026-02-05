<?php

namespace App\Services;

use App\Models\Galley;
use App\Models\Publication;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;

class GalleyService
{
    protected array $allowedMimeTypes = [
        'application/pdf',
        'text/html',
        'application/xhtml+xml',
        'application/epub+zip',
        'application/xml',
        'text/xml',
        'application/x-mobipocket-ebook',
    ];

    protected array $allowedExtensions = [
        'pdf',
        'html',
        'htm',
        'xhtml',
        'epub',
        'xml',
        'mobi',
    ];

    /**
     * Upload a new galley file for a publication
     */
    public function uploadGalley(
        Publication $publication,
        UploadedFile $file,
        string $label,
        ?string $locale = null
    ): Galley {
        // Validate file type
        $this->validateFile($file);

        // Generate file path
        $extension = $file->getClientOriginalExtension();
        $filename = Str::slug($label) . '-' . time() . '.' . $extension;
        $path = "galleys/{$publication->manuscript_id}/{$publication->id}/{$filename}";

        // Upload to storage
        $filePath = Storage::disk('s3')->putFileAs(
            dirname($path),
            $file,
            basename($path),
            'public'
        );

        // Get file size and mime type
        $fileSize = $file->getSize();
        $mimeType = $file->getMimeType();

        // Determine next sequence number
        $sequence = $publication->galleys()->max('sequence') + 1;

        // Create galley record
        $galley = $publication->galleys()->create([
            'label' => $label,
            'locale' => $locale ?? config('app.locale'),
            'file_path' => $filePath,
            'file_size' => $fileSize,
            'mime_type' => $mimeType,
            'sequence' => $sequence,
            'is_approved' => false,
        ]);

        return $galley;
    }

    /**
     * Update an existing galley
     */
    public function updateGalley(
        Galley $galley,
        array $data,
        ?UploadedFile $file = null
    ): Galley {
        // Update basic info
        $galley->fill($data);

        // If new file provided, replace the old one
        if ($file) {
            $this->validateFile($file);

            // Delete old file
            Storage::disk('s3')->delete($galley->file_path);

            // Upload new file
            $extension = $file->getClientOriginalExtension();
            $filename = Str::slug($data['label'] ?? $galley->label) . '-' . time() . '.' . $extension;
            $path = "galleys/{$galley->publication->manuscript_id}/{$galley->publication_id}/{$filename}";

            $filePath = Storage::disk('s3')->putFileAs(
                dirname($path),
                $file,
                basename($path),
                'public'
            );

            $galley->file_path = $filePath;
            $galley->file_size = $file->getSize();
            $galley->mime_type = $file->getMimeType();
        }

        $galley->save();

        return $galley;
    }

    /**
     * Delete a galley and its file
     */
    public function deleteGalley(Galley $galley): bool
    {
        // Delete file from storage
        Storage::disk('s3')->delete($galley->file_path);

        // Delete record
        return $galley->delete();
    }

    /**
     * Approve a galley for public access
     */
    public function approveGalley(Galley $galley): Galley
    {
        $galley->update([
            'is_approved' => true,
        ]);

        return $galley;
    }

    /**
     * Reorder galleys for a publication
     */
    public function reorderGalleys(Publication $publication, array $galleyIds): void
    {
        foreach ($galleyIds as $sequence => $galleyId) {
            $publication->galleys()
                ->where('id', $galleyId)
                ->update(['sequence' => $sequence + 1]);
        }
    }

    /**
     * Record a download and increment counter
     */
    public function recordDownload(Galley $galley, ?string $ipAddress = null): void
    {
        $galley->increment('download_count');
        $galley->update(['last_downloaded_at' => now()]);

        // TODO: Record in manuscript_statistics for COUNTER compliance
        // This will be implemented in Phase 7
    }

    /**
     * Get download URL for a galley
     */
    public function getDownloadUrl(Galley $galley, int $expiresInMinutes = 60): string
    {
        return Storage::disk('s3')->temporaryUrl(
            $galley->file_path,
            now()->addMinutes($expiresInMinutes)
        );
    }

    /**
     * Get viewing URL for a galley (for inline viewing)
     */
    public function getViewUrl(Galley $galley, int $expiresInMinutes = 60): string
    {
        // For HTML/XML files, we can display inline
        if ($this->isViewableInline($galley)) {
            return Storage::disk('s3')->temporaryUrl(
                $galley->file_path,
                now()->addMinutes($expiresInMinutes),
                [
                    'ResponseContentDisposition' => 'inline',
                    'ResponseContentType' => $galley->mime_type,
                ]
            );
        }

        // For PDFs and other formats, use download URL
        return $this->getDownloadUrl($galley, $expiresInMinutes);
    }

    /**
     * Check if galley can be viewed inline
     */
    public function isViewableInline(Galley $galley): bool
    {
        $inlineTypes = [
            'application/pdf',
            'text/html',
            'application/xhtml+xml',
        ];

        return in_array($galley->mime_type, $inlineTypes);
    }

    /**
     * Generate HTML version from XML galley
     */
    public function generateHtmlFromXml(Galley $xmlGalley): ?Galley
    {
        if (!in_array($xmlGalley->mime_type, ['application/xml', 'text/xml'])) {
            throw new InvalidArgumentException('Source galley must be XML format');
        }

        // TODO: Implement XSLT transformation from JATS XML to HTML
        // This requires XSLT processor and JATS to HTML stylesheets
        // For now, return null to indicate not implemented
        return null;
    }

    /**
     * Get file icon based on mime type
     */
    public function getFileIcon(Galley $galley): string
    {
        $icons = [
            'application/pdf' => 'file-pdf',
            'text/html' => 'file-code',
            'application/xhtml+xml' => 'file-code',
            'application/epub+zip' => 'book',
            'application/xml' => 'file-code',
            'text/xml' => 'file-code',
            'application/x-mobipocket-ebook' => 'book',
        ];

        return $icons[$galley->mime_type] ?? 'file';
    }

    /**
     * Validate uploaded file
     */
    protected function validateFile(UploadedFile $file): void
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $mimeType = $file->getMimeType();

        if (!in_array($extension, $this->allowedExtensions)) {
            throw new InvalidArgumentException(
                "File extension '{$extension}' is not allowed. Allowed: " . 
                implode(', ', $this->allowedExtensions)
            );
        }

        if (!in_array($mimeType, $this->allowedMimeTypes)) {
            throw new InvalidArgumentException(
                "MIME type '{$mimeType}' is not allowed. Allowed: " . 
                implode(', ', $this->allowedMimeTypes)
            );
        }

        // Check file size (max 50MB)
        $maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if ($file->getSize() > $maxSize) {
            throw new InvalidArgumentException(
                "File size exceeds maximum allowed size of 50MB"
            );
        }
    }

    /**
     * Get human-readable file size
     */
    public function getFormattedFileSize(Galley $galley): string
    {
        $bytes = $galley->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get galley statistics
     */
    public function getGalleyStats(Publication $publication): array
    {
        $galleys = $publication->galleys;

        return [
            'total' => $galleys->count(),
            'approved' => $galleys->where('is_approved', true)->count(),
            'pending' => $galleys->where('is_approved', false)->count(),
            'total_downloads' => $galleys->sum('download_count'),
            'formats' => $galleys->pluck('mime_type')->unique()->values()->toArray(),
        ];
    }
}
